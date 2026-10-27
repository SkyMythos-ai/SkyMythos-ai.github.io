/* 显式刷新配方：只读产品源码，在全新输出目录生成候选；不改仓内冻结基线。 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { createRequire } = require('node:module');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');
const { names, stages, sceneGeometry, sha256, createManifest, validateReference } = require('./reference.cjs');

function argumentsFor(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    assert(/^--(?:product-root|output|playwright-module|chromium)$/.test(argv[i]) && argv[i + 1], `Unknown or incomplete argument: ${argv[i]}`);
    args[argv[i].slice(2)] = path.resolve(argv[i + 1]);
  }
  for (const key of ['product-root', 'output', 'playwright-module', 'chromium']) assert(args[key], `Missing --${key}`);
  return args;
}

function snapshotTree(root, result = {}, prefix = root) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) snapshotTree(file, result, prefix);
    else if (entry.isFile()) result[path.relative(prefix, file)] = sha256(fs.readFileSync(file));
  }
  return result;
}

function snapshotProduct(product) {
  const sources = snapshotTree(path.join(product, 'src'), {}, product);
  for (const name of ['package.json', 'public/logo-mark.svg', 'public/logo-wordmark.svg']) sources[name] = sha256(fs.readFileSync(path.join(product, name)));
  return sources;
}

function snapshotStyleInputs(product) {
  const dependencies = {};
  const remember = file => { dependencies[file] = sha256(fs.readFileSync(file)); };
  const styles = fs.readFileSync(path.join(product, 'src/styles.css'), 'utf8');
  for (const [, pattern] of styles.matchAll(/@source\s+"([^"]+)"/g)) {
    assert(pattern.endsWith('/*.js'), `Unsupported product CSS scan pattern: ${pattern}`);
    const directory = path.resolve(product, 'src', path.dirname(pattern));
    for (const name of fs.readdirSync(directory).filter(name => name.endsWith('.js'))) remember(path.join(directory, name));
  }
  for (const name of ['index.css', 'theme.css', 'preflight.css', 'utilities.css']) remember(path.join(product, 'node_modules/tailwindcss', name));
  const requireProduct = createRequire(path.join(product, 'package.json'));
  for (const name of ['vite', '@vitejs/plugin-react', '@tailwindcss/vite', 'tailwindcss']) {
    remember(path.join(product, 'node_modules', name, 'package.json'));
    if (name !== 'tailwindcss') remember(requireProduct.resolve(name));
  }
  return dependencies;
}

function assertUnchanged(product, before, dependencies, revision) {
  const after = snapshotProduct(product);
  assert.deepEqual(after, before, 'Product source inventory or bytes changed during capture');
  assert.equal(execFileSync('git', ['-C', product, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), revision, 'Product revision changed during capture');
  for (const [file, hash] of Object.entries(snapshotStyleInputs(product))) {
    assert(Object.hasOwn(dependencies, file), `CSS scan input added during capture: ${file}`);
    assert.equal(hash, dependencies[file], `CSS scan input changed during capture: ${file}`);
  }
  for (const [file, hash] of Object.entries(dependencies)) assert.equal(sha256(fs.readFileSync(file)), hash, `Capture dependency changed: ${file}`);
}

async function compile(product, privateRoot, dependencies) {
  const requireProduct = createRequire(path.join(product, 'package.json'));
  const compilerRoot = path.join(privateRoot, 'compiler');
  fs.mkdirSync(compilerRoot);
  const modules = {
    ConsolePreferencesProvider: 'src/components/console-preferences.tsx',
    FormationPreview: 'src/pages/my-ai/formation-preview.tsx',
    FormationPage: 'src/pages/my-ai/formation-page.tsx',
    ProductShell: 'src/components/product-shell.tsx',
    ConnectorsPage: 'src/pages/connectors-page.tsx',
    WorkspaceChatPage: 'src/pages/workspace-chat-page.tsx',
    operationMap: 'src/api/operation-map.ts',
  };
  const imports = [
    "import React from 'react';",
    "import {createRoot} from 'react-dom/client';",
    "import {QueryClient,QueryClientProvider} from '@tanstack/react-query';",
    "import {MemoryRouter,Route,Routes} from 'react-router-dom';",
    ...Object.entries(modules).map(([name, file]) => `import {${name}} from ${JSON.stringify(path.join(product, file))};`),
    "import './reference.css';",
  ].join('\n');
  const fixture = fs.readFileSync(path.join(__dirname, 'fixture.json'), 'utf8');
  const entry = fs.readFileSync(path.join(__dirname, 'fixture-entry.mjs'), 'utf8').replace('__IMPORTS__', imports).replace('__FIXTURE__', fixture);
  fs.writeFileSync(path.join(compilerRoot, 'reference.jsx'), entry);
  fs.writeFileSync(path.join(compilerRoot, 'reference.css'), `@import ${JSON.stringify(path.join(product, 'src/styles.css'))};\n@source ${JSON.stringify(path.join(product, 'src'))};\n`);
  fs.writeFileSync(path.join(compilerRoot, 'index.html'), '<!doctype html><html lang="zh-CN" data-theme="light" data-density="compact"><head><meta charset="utf-8"></head><body><div id="root" class="font-ui text-foreground"></div><script type="module" src="./reference.jsx"></script></body></html>');
  const { build } = await import(pathToFileURL(requireProduct.resolve('vite')).href);
  const { default: react } = await import(pathToFileURL(requireProduct.resolve('@vitejs/plugin-react')).href);
  const { default: tailwind } = await import(pathToFileURL(requireProduct.resolve('@tailwindcss/vite')).href);
  await build({
    configFile: false, logLevel: 'warn', root: compilerRoot, base: './', envDir: compilerRoot, cacheDir: path.join(privateRoot, 'cache'),
    resolve: { alias: ['react', 'react-dom', '@tanstack/react-query', 'react-router-dom'].map(name => ({ find: new RegExp('^' + name + '(?=/|$)'), replacement: path.join(product, 'node_modules', name) })) },
    plugins: [react(), tailwind(), {
      name: 'private-capture-provenance',
      load(id) {
        const file = id.split('?')[0];
        if (path.isAbsolute(file) && file.includes('/node_modules/') && fs.existsSync(file) && fs.statSync(file).isFile()) dependencies[file] = sha256(fs.readFileSync(file));
        return null;
      },
    }],
    build: { outDir: path.join(privateRoot, 'app'), emptyOutDir: false, sourcemap: false, minify: false },
  });
  for (const name of ['logo-mark.svg', 'logo-wordmark.svg']) fs.copyFileSync(path.join(product, 'public', name), path.join(privateRoot, 'app/assets', name));
}

async function serve(app) {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname.slice(1)) || 'index.html';
    const file = path.resolve(app, relative);
    if (request.method !== 'GET' || !file.startsWith(app + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404).end(); return; }
    response.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.svg') ? 'image/svg+xml' : 'text/html');
    response.end(fs.readFileSync(file));
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

async function referencePage(browser, origin, app, scene, stage, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1.5, colorScheme: 'light', serviceWorkers: 'block' });
  const failures = [];
  try {
    await context.addInitScript(() => {
      localStorage.setItem('fusion-language', 'zh-CN'); localStorage.setItem('fusion-theme', 'light'); localStorage.setItem('fusion-density', 'compact');
      const fail = () => { throw new Error('Reference fixture blocks business network'); };
      window.fetch = fail;
      window.XMLHttpRequest = class { open() { fail(); } };
      window.EventSource = class { constructor() { fail(); } };
      window.WebSocket = class { constructor() { fail(); } };
    });
    await context.routeWebSocket('**/*', socket => { failures.push(socket.url()); socket.close(); });
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin === origin && /^\/logo-(?:mark|wordmark)\.svg$/.test(url.pathname)) return route.fulfill({ contentType: 'image/svg+xml', body: fs.readFileSync(path.join(app, 'assets', path.basename(url.pathname))) });
      if (url.origin !== origin || route.request().method() !== 'GET' || !(url.pathname === '/' || url.pathname.startsWith('/assets/'))) { failures.push(url.href); return route.abort('blockedbyclient'); }
      return route.continue();
    });
    const page = await context.newPage();
    page.on('pageerror', error => failures.push(error.message));
    await page.clock.install({ time: new Date('2026-10-24T00:00:00Z') });
    await page.goto(`${origin}/?mode=${scene}&frame=${stage}`, { waitUntil: 'networkidle' });
    if (scene === 'poc') await page.getByRole('heading', { name: '确认员工方案', exact: true }).waitFor();
    else await page.locator('.product-shell').waitFor();
    await page.evaluate(() => document.fonts.ready);
    return { context, page, failures };
  } catch (error) { await context.close(); throw error; }
}

async function prepareScene(page, scene, stage) {
  if (scene === 'methods') {
    if (stage === 'start') {
      await page.getByRole('textbox', { name: '员工负责什么', exact: true }).fill('负责发布前检查，输出检查结果与待处理问题。');
      await page.getByRole('checkbox', { name: '选择 核对回滚路径', exact: true }).click();
    } else if (stage === 'result') await page.getByRole('heading', { name: '确认员工方案', exact: true }).waitFor();
    else await page.getByText('分析经验来源', { exact: true }).waitFor();
  }
  if (scene === 'management' && stage !== 'start') {
    await page.getByRole('button', { name: stage === 'middle' ? '管理 GitHub' : '配置 示例模型服务', exact: true }).click();
    await page.getByRole('dialog').waitFor();
  }
  if (scene === 'delivery') {
    await page.getByRole('heading', { name: '配置与回滚检查', exact: true }).waitFor();
    if (stage === 'result') {
      await page.locator('[data-slot="thread-toolbar"]').getByRole('button', { name: /运行实况/ }).click();
      await page.getByRole('dialog', { name: '运行实况', exact: true }).waitFor();
    }
  }
  await page.mouse.move(1, 1);
  await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

function isolatedCss(original) {
  const adaptation = ':host{display:block;isolation:isolate;font-size:16px;color:var(--fg);background:var(--bg)}.product-reference-root{position:relative;container:product-reference / size;contain:layout style;width:100%;height:100%;overflow:hidden}.product-reference-root #root{height:100%}';
  const defaults = [...original.matchAll(/@property\s+(--[\w-]+)\s*\{([^}]+)\}/g)].map(([, name, body]) => `${name}:${body.match(/initial-value:\s*([^;]+);/)?.[1] || 'initial'};`).join('');
  const embedded = original.replace(/:root((?:\[[^\]]+\])*)/g, (_match, attrs) => attrs ? `:host(${attrs})` : ':host')
    .replace(/\bhtml\b(?=\s*[,\{])/g, ':host').replace(/@container\s+\(/g, '@container product-component (')
    .replace(/container-type:\s*inline-size;/g, 'container: product-component / inline-size;')
    .replace(/container:\s*([^;{}\/]+)\s*\/\s*inline-size;/g, (_match, value) => `container: ${value.trim().includes('product-component') ? value.trim() : value.trim() + ' product-component'} / inline-size;`)
    .replace(/@media\s+\(((?:min-|max-)?(?:width|height)):\s*([^\)]+)\)/g, '@container product-reference ($1: $2)')
    .replace(/@media\s+not all and\s+\(min-width:\s*([^\)]+)\)/g, '@container product-reference not (min-width: $1)');
  return embedded.replace(/(?<=[;{])\s*([-\w]+)\s*:\s*([^;{}]+);/g, (_match, property, value) => `${property}:${value.replace(/(-?(?:\d+(?:\.\d+)?|\.\d+))(d?vw|d?vh)\b/g, (_unit, amount, unit) => `calc(var(--product-reference-${unit.endsWith('w') ? 'width' : 'height'},${unit.endsWith('w') ? '1440' : '700'}px) * ${Number(amount) / 100})`)};`) + '\n' + adaptation + `\n@layer properties{*,::before,::after,::backdrop{${defaults}}}`;
}

async function exportFrame(page, app) {
  const images = {};
  for (const src of await page.locator('img').evaluateAll(elements => elements.map(element => element.getAttribute('src')))) {
    if (!src || src.startsWith('data:')) continue;
    assert(/^\/(?:assets\/)?logo-(?:mark|wordmark)\.svg$/.test(src), `Unexpected product image: ${src}`);
    images[src] = `data:image/svg+xml;base64,${fs.readFileSync(path.join(app, 'assets', path.basename(src))).toString('base64')}`;
  }
  return page.evaluate(images => {
    const clone = document.body.cloneNode(true);
    clone.querySelectorAll('script,style').forEach(element => element.remove());
    clone.querySelectorAll('*').forEach(element => {
      for (const attribute of [...element.attributes]) if (/^on/i.test(attribute.name)) element.removeAttribute(attribute.name);
      if (element instanceof HTMLImageElement && images[element.getAttribute('src')]) element.setAttribute('src', images[element.getAttribute('src')]);
      if (element instanceof HTMLInputElement) element.setAttribute('value', element.type === 'password' ? '' : element.value);
      if (element instanceof HTMLTextAreaElement) element.textContent = element.value;
    });
    return `<div class="product-reference-root" style="width:${innerWidth}px;height:${innerHeight}px;--product-reference-width:${innerWidth}px;--product-reference-height:${innerHeight}px" inert>${clone.innerHTML}</div>`;
  }, images);
}

async function assertBoundary(reference) {
  const state = await reference.page.evaluate(() => window.__reference);
  assert.equal(state.unknown.length, 0, `Unspecified fixture reads: ${JSON.stringify(state.unknown)}`);
  assert.equal(state.writes.length, 0, 'Fixture attempted a business write');
  assert.deepEqual(reference.failures, [], 'Capture leaked network or raised page errors');
}

function writeNotice(directory, product, revision) {
  const sections = [`SkyMythos frozen read-only product examples. Product revision: ${revision}.\nFictional data; no application JavaScript or complete source/dependency closure distributed.\nAvatar material: @bible-strong/avatar-core/react 0.1.0, Stéphane Montlouis-Calixte, AGPL-3.0-only.\nUpstream: https://github.com/smontlouis/bible-strong-avatar-lab\nAttribution does not determine output licensing or satisfy applicable source obligations by itself.\n`];
  for (const name of ['lucide-react', 'tailwindcss', '@bible-strong/avatar-core']) sections.push(`\n===== ${name} =====\n` + fs.readFileSync(path.join(product, 'node_modules', name, 'LICENSE'), 'utf8'));
  fs.writeFileSync(path.join(directory, 'NOTICE.txt'), sections.join('\n'));
}

async function capture(args) {
  const product = fs.realpathSync(args['product-root']);
  const output = path.join(fs.realpathSync(path.dirname(args.output)), path.basename(args.output));
  const website = fs.realpathSync(path.resolve(__dirname, '../..'));
  assert(!fs.existsSync(output), 'Capture output must be new and empty; never overwrite a baseline');
  assert(!output.startsWith(product + path.sep) && output !== product, 'Capture must never write to the product');
  assert(!output.startsWith(path.join(website, 'public') + path.sep) && output !== path.join(website, 'public'), 'Candidates must not be publicly served before review');
  fs.mkdirSync(output, { recursive: true });
  const privateRoot = path.join(output, 'private');
  const publish = path.join(output, 'candidate');
  fs.mkdirSync(privateRoot); fs.mkdirSync(publish);
  const revision = execFileSync('git', ['-C', product, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const before = snapshotProduct(product);
  const dependencies = snapshotStyleInputs(product);
  await compile(product, privateRoot, dependencies);
  const app = path.join(privateRoot, 'app');
  const { server, origin } = await serve(app);
  let browser;
  try {
    const { chromium } = require(args['playwright-module']);
    browser = await chromium.launch({ executablePath: args.chromium, headless: true });
    const poc = await referencePage(browser, origin, app, 'poc', 'result', { width: 960, height: 700 });
    try {
      const css = await poc.page.evaluate(() => [...document.styleSheets].map(sheet => [...sheet.cssRules].map(rule => rule.cssText).join('\n')).join('\n'));
      fs.writeFileSync(path.join(publish, 'product.css'), isolatedCss(css));
      await assertBoundary(poc);
    } finally { await poc.context.close(); }
    const original = { product: { revision }, scenes: {}, images: {} };
    const phases = { delivery: ['execution_running', 'execution_succeeded_review_pending', 'delivery_readonly_review_pending'], methods: ['selecting_experience', 'analysis_running', 'awaiting_confirmation'], management: ['catalog', 'github_configured_empty_secret', 'model_unconfigured_empty_secret'] };
    for (const name of names) {
      const geometry = sceneGeometry(name);
      original.scenes[name] = { ...geometry, frames: [] };
      for (const [index, stage] of stages.entries()) {
        const reference = await referencePage(browser, origin, app, name, stage, { width: geometry.width, height: geometry.height });
        try {
          await prepareScene(reference.page, name, stage);
          fs.writeFileSync(path.join(publish, `${name}-${stage}.html`), await exportFrame(reference.page, app));
          await assertBoundary(reference);
          const phase = phases[name][index];
          original.scenes[name].frames.push({ id: stage, phase, label: `${name} · ${phase} · 示例数据，只读` });
        } finally { await reference.context.close(); }
      }
      const full = await referencePage(browser, origin, app, name, 'result', { width: 1440, height: 700 });
      try {
        if (name !== 'management') await full.page.getByRole('heading', { name: name === 'methods' ? '确认员工方案' : '配置与回滚检查', exact: true }).waitFor();
        await assertBoundary(full);
        const filename = `full-${name}.png`;
        await full.page.screenshot({ path: path.join(publish, filename), animations: 'disabled', timeout: 60000 });
        original.images[name] = filename;
        if (name === 'delivery') original.images.workbench = filename;
      } finally { await full.context.close(); }
    }
    assertUnchanged(product, before, dependencies, revision);
    writeNotice(publish, product, revision);
    const manifest = JSON.stringify(createManifest(publish, original), null, 2) + '\n';
    fs.writeFileSync(path.join(publish, 'manifest.json'), manifest);
    validateReference(publish, { revision, manifestSha256: sha256(manifest) });
    fs.writeFileSync(path.join(privateRoot, 'provenance.json'), JSON.stringify({ product, revision, sources: before, dependencies, fidelity: 'not-verified', publication: 'requires-explicit-license-and-fidelity-review' }, null, 2) + '\n');
    console.log(`Candidate generated at ${publish}. Structural integrity only; fidelity and licensing remain unverified. No repository baseline changed.`);
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

if (require.main === module) {
  if (process.argv.includes('--help')) console.log('Usage: node scripts/product-reference/capture.cjs --product-root <product web root> --output <new private candidate directory> --playwright-module <installed playwright module> --chromium <browser executable>\nExplicit refresh only. Never runs during build. Review candidate fidelity and licensing before manually promoting assets and updating baseline.json. private/ must never be staged or published.');
  else Promise.resolve().then(() => capture(argumentsFor(process.argv.slice(2)))).catch(error => { console.error(error.stack); process.exitCode = 1; });
}

module.exports = { argumentsFor, isolatedCss, capture };
