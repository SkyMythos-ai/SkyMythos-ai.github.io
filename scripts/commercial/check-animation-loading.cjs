const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const portable = require('./browser.cjs');

const root = fs.realpathSync(path.join(portable.project, 'out'));
const evidence = portable.evidence;
const deadline = 12000;
const heroBundle = process.env.ANIMATION_HERO_BUNDLE || '14f40b0fc37f7a20eeab00293e3527725552a255-lean-v1';
const sceneBundle = process.env.ANIMATION_SCENE_BUNDLE || '7295629889d881f3485168832359d16d141021f9-composed-v2';
const scenes = ['delivery', 'training', 'knowledge'];
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.xml': 'application/xml; charset=utf-8' };
const requests = [];
const compressed = new Map();
// 浏览器计时之前压缩导出文本，避免重复 gzip 的 CPU 成本影响网络实验。
function prepareCompression(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) prepareCompression(file);
    else if (entry.isFile() && /\.(html|js|mjs|css|json|txt|svg|xml)$/.test(file)) {
      compressed.set(file, zlib.gzipSync(fs.readFileSync(file)));
    }
  }
}
const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    let file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + path.sep)) throw new Error('Outside export root');
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    file = fs.realpathSync(file);
    if (!file.startsWith(root + path.sep) || !fs.statSync(file).isFile()) throw new Error('Outside export root');
    const body = fs.readFileSync(file);
    const compress = /\.(html|js|mjs|css|json|txt|svg|xml)$/.test(file) && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    const payload = compress ? compressed.get(file) : body;
    if (!payload) throw new Error('File missing from precompressed export');
    const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': path.extname(file) === '.html' ? 'no-store' : 'public, max-age=600', 'Content-Length': payload.length, Vary: 'Accept-Encoding' };
    if (compress) headers['Content-Encoding'] = 'gzip';
    if (req.method === 'GET' && /^\/product-(?:demo|scenes)\//.test(pathname)) requests.push({ pathname, bytes: payload.length, at: Date.now() });
    res.writeHead(200, headers).end(req.method === 'HEAD' ? undefined : payload);
  } catch {
    const missing = path.join(root, '404.html');
    if (fs.existsSync(missing)) { res.writeHead(404, { 'Content-Type': mime['.html'], 'Cache-Control': 'no-store' }); res.end(req.method === 'HEAD' ? undefined : fs.readFileSync(missing)); }
    else res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end(req.method === 'HEAD' ? undefined : 'Not found');
  }
});

function totals(from) {
  const list = requests.slice(from);
  return { getCount: list.length, gzipBytes: list.reduce((sum, item) => sum + item.bytes, 0), requests: list };
}
async function network(context, page, disableCache) {
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.clearBrowserCache');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: disableCache });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 80, downloadThroughput: 128 * 1024, uploadThroughput: 128 * 1024 });
}
async function core(frame, name) {
  const selector = name === 'hero' ? '.product-shell' : `[data-scene="${name}"] [data-plane="${name === 'delivery' ? 'task' : 'source'}"]`;
  const node = frame.locator(selector).first();
  await node.waitFor({ state: 'visible', timeout: 1500 });
  const text = (await node.innerText()).trim();
  assert(text.length > 10, `${name}: core product DOM must contain visible content`);
  if (name === 'hero') assert(await frame.locator('[data-interaction-draft]').count(), 'hero: real task editor exists');
  return { selector, textSample: text.slice(0, 120) };
}
async function instrument(page) {
  await page.addInitScript(() => {
    const entries = window.__animationTimings = {};
    const observe = () => {
      for (const node of document.querySelectorAll('.focused-prototype[data-prototype]')) {
        const name = node.dataset.prototype;
        if (entries[name]) continue;
        const item = entries[name] = { observed: performance.now(), mounted: null, visible: null, ready: null };
        const update = () => { if (item.mounted === null && node.querySelector('iframe')) item.mounted = performance.now(); if (item.ready === null && node.dataset.ready === 'true') item.ready = performance.now(); };
        new MutationObserver(update).observe(node, { attributes: true, attributeFilter: ['data-ready'], childList: true, subtree: true });
        new IntersectionObserver(([entry]) => { if (entry.isIntersecting && item.visible === null) item.visible = performance.now(); }).observe(node);
        update();
      }
    };
    new MutationObserver(observe).observe(document, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', observe);
  });
}
async function hostCase(browser, origin, width, theme) {
  const id = `${width}-${theme}`, result = { id, kind: 'host', scenes: [] };
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme });
  const page = await context.newPage();
  const errors = [];
  const startRequests = requests.length;
  page.on('pageerror', e => errors.push(e.message));
  try {
    await network(context, page, false);
    await instrument(page);
    await page.addInitScript(value => localStorage.setItem('skymythos-theme', value), theme);
    await page.goto(`${origin}/zh/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    for (const name of ['hero', ...scenes]) {
      const player = page.locator(`.focused-prototype[data-prototype="${name}"]`);
      const sceneRequests = requests.length;
      await player.scrollIntoViewIfNeeded({ timeout: 15000 });
      await page.waitForFunction(n => { const t = window.__animationTimings?.[n]; return t && t.visible !== null && t.ready !== null; }, name, { timeout: deadline });
      const timing = await page.evaluate(n => window.__animationTimings[n], name);
      assert(timing.mounted !== null && timing.ready >= timing.mounted, `${name}: ready must follow frame mount`);
      assert(timing.ready - timing.mounted <= deadline, `${name}: frame mount to ready exceeds 12 seconds: ${JSON.stringify(timing)}`);
      assert(timing.ready - timing.visible <= deadline, `${name}: viewport to ready exceeds 12 seconds: ${JSON.stringify(timing)}`);
      assert.equal(await player.getAttribute('data-ready'), 'true');
      const iframe = player.locator('iframe');
      assert.equal(await iframe.count(), 1);
      const url = new URL(await iframe.getAttribute('src'), origin);
      assert.equal(url.pathname, `/product-${name === 'hero' ? 'demo' : 'scenes'}/${name === 'hero' ? heroBundle : sceneBundle}/index.html`, `${name}: optimized frame bundle`);
      assert.equal(url.searchParams.get('scene'), name === 'hero' ? 'delivery' : name);
      const frame = await iframe.elementHandle().then(handle => handle.contentFrame());
      assert(frame, `${name}: frame is accessible`);
      const content = await core(frame, name);
      result.scenes.push({ name, timing, viewportToReadyMs: Math.max(0, timing.ready - timing.visible), mountToReadyMs: timing.ready - timing.mounted, content, sinceScroll: totals(sceneRequests) });
    }
    assert.deepEqual(errors, [], 'no uncaught page errors');
    result.prototypeTraffic = totals(startRequests);
    result.passed = true;
  } catch (error) {
    result.error = error.stack || String(error);
    result.pageErrors = errors;
    result.prototypeTraffic = totals(startRequests);
    result.timings = await page.evaluate(() => window.__animationTimings).catch(() => null);
    await page.screenshot({ path: path.join(evidence, `animation-loading-${id}-failure.png`), fullPage: false }).catch(() => {});
    result.passed = false;
  } finally { await context.close(); }
  return result;
}
async function directCase(browser, origin, name) {
  const result = { id: `direct-${name}`, kind: 'direct', name };
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await context.newPage();
  const errors = [];
  const first = requests.length;
  page.on('pageerror', e => errors.push(e.message));
  try {
    await network(context, page, true);
    await page.addInitScript(() => window.addEventListener('message', e => { if (e.source === window && e.origin === location.origin && e.data?.type === 'skymythos-product-demo' && e.data.ready === true) window.__animationReady = performance.now(); }));
    const started = Date.now();
    await page.goto(`${origin}/product-scenes/${sceneBundle}/index.html?scene=${name}`, { waitUntil: 'commit' });
    await page.waitForFunction(() => window.__animationReady > 0, null, { timeout: deadline });
    result.readyMs = Date.now() - started;
    assert(result.readyMs <= deadline, `${name}: independent cold frame exceeds 12 seconds`);
    result.content = await core(page, name);
    result.prototypeTraffic = totals(first);
    // 单场景冷入口约 1 MiB；预算阻止重新打包整套 eager Mermaid，同时允许少量资源变化。
    assert(result.prototypeTraffic.gzipBytes <= 1200000, `${name}: cold prototype gzip budget exceeded: ${result.prototypeTraffic.gzipBytes}`);
    assert.deepEqual(errors, []);
    result.passed = true;
  } catch (error) {
    result.error = error.stack || String(error);
    result.pageErrors = errors;
    result.prototypeTraffic = totals(first);
    await page.screenshot({ path: path.join(evidence, `animation-loading-direct-${name}-failure.png`) }).catch(() => {});
    result.passed = false;
  } finally { await context.close(); }
  return result;
}
async function main() {
  const all = ['1440-light', '1440-dark', '390-light', '390-dark', ...scenes.map(n => `direct-${n}`)];
  const selected = process.env.ANIMATION_CASE;
  assert(!selected || all.includes(selected), `ANIMATION_CASE must be one of ${all.join(', ')}`);
  const results = [];
  portable.trackIdentity('animation-loading');
  prepareCompression(root);
  let browser;
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = await portable.launch();
    for (const id of selected ? [selected] : all) {
      const result = id.startsWith('direct-') ? await directCase(browser, origin, id.slice(7)) : await hostCase(browser, origin, Number(id.split('-')[0]), id.split('-')[1]);
      results.push(result);
      console.log(`${result.passed ? 'PASS' : 'FAIL'} ${id}${result.error ? `: ${result.error}` : ''}`);
    }
  } finally {
    try { if (browser) await browser.close(); }
    finally { if (server.listening) await new Promise(resolve => server.close(resolve)); }
    fs.writeFileSync(path.join(evidence, 'animation-loading.json'), JSON.stringify({ deadlineMs: deadline, network: 'CDP 1 Mbps / 80 ms; host clears cache at startup and shares static assets within the page; direct clears and disables browser cache', heroBundle, sceneBundle, results }, null, 2));
  }
  assert(results.length && results.every(result => result.passed), 'Animation cold-loading regression failed');
}
main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
