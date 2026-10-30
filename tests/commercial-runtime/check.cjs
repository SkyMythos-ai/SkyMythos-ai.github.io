const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const ts = require('typescript');
const portable = require('../../scripts/commercial/browser.cjs');

portable.trackIdentity('commercial-runtime');
const testIdentity = () => crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex');
const report = { startedAt: new Date().toISOString(), url: portable.url, testIdentity: testIdentity(), checks: [], samples: [], errors: [], limitations: [] };
let browser;

async function check(label, body) {
  try {
    await body();
    report.checks.push({ label, status: 'passed' });
    console.log(`PASS ${label}`);
  } catch (error) {
    report.checks.push({ label, status: 'failed', message: error.message, stack: error.stack });
    process.exitCode = 1;
    console.error(`FAIL ${label}: ${error.stack}`);
  }
}

async function frameBoundary() {
  const manifest = portable.manifest();
  const cases = Object.entries(manifest.scenes).flatMap(([name, scene]) => ['start', 'middle'].map(phase => ({ name, phase, scene, html: fs.readFileSync(path.join(portable.referenceRoot, scene.frames[phase].path), 'utf8') })));
  // 直接运行生产解析器；只增加测试导出，不复制白名单实现或模拟 DOM。
  const source = fs.readFileSync(path.join(portable.project, 'src/components/commercial/demo-controller.ts'), 'utf8') + '\nexport const __boundary = { parseFrame };';
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.route('http://runtime-boundary.test/', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body></body></html>' }));
    await page.goto('http://runtime-boundary.test/');
    const requests = [];
    page.on('request', request => requests.push(request.url()));
    const results = await page.evaluate(({ js, cases, version }) => {
      const exports = {};
      new Function('exports', 'require', js)(exports, () => ({}));
      const base = new URL(`https://example.test/product-reference/${version}/manifest.json`);
      const rows = [];
      const inspect = (label, html, scene, accepted) => {
        let error;
        try { exports.__boundary.parseFrame(html, scene, base); }
        catch (failure) { error = failure.message; }
        rows.push({ label, passed: accepted ? error === undefined : error !== undefined, error });
      };
      cases.forEach(row => inspect(`${row.name}-${row.phase} frozen real component frame`, row.html, row.scene, true));
      const original = cases.find(row => row.name === 'management' && row.phase === 'start');
      const src = /(<img\b[^>]*\bsrc=")[^"]*(")/;
      if (!src.test(original.html)) throw new Error('Boundary negative fixture requires a real product image');
      for (const value of ['https://external.test/icon.svg', '/api/credentials', 'javascript:alert(1)', 'data:text/html,<script>alert(1)</script>']) inspect(`reject image ${value}`, original.html.replace(src, `$1${value}$2`), original.scene, false);
      inspect('reject event attribute', original.html.replace('<div ', '<div onclick="alert(1)" '), original.scene, false);
      inspect('reject non-inert root', original.html.replace(/ inert(?=>)/, ''), original.scene, false);
      inspect('reject changed width', original.html.replace('width:1280px', 'width:1279px'), original.scene, false);
      inspect('reject external SVG image resource', original.html.replace('</div>', '<svg><image href="https://external.test/x.svg"></image></svg></div>'), original.scene, false);
      return rows;
    }, { js, cases, version: manifest.product.revision });
    report.boundary = { results, requests };
    assert.equal(results.length, 14);
    assert.deepEqual(results.filter(row => !row.passed), [], 'Six frozen frames are accepted and eight active/corrupt variants are rejected');
    assert.deepEqual(requests, [], 'Inert parsing cannot initiate any network requests');
  } finally { await context.close(); }
}

async function stylesheetUI(page) {
  return page.locator('[data-native-demo="delivery"]').evaluate(element => {
    const shadow = element.shadowRoot;
    const status = shadow.querySelector('[data-product-style-status]');
    return {
      state: element.dataset.productStyles,
      viewport: getComputedStyle(shadow.querySelector('[data-product-viewport]')).visibility,
      statusVisible: getComputedStyle(status).display !== 'none' && getComputedStyle(status).visibility !== 'hidden',
      text: status.innerText,
      original: status.querySelector('a')?.href,
    };
  });
}

async function harnessStylesheetFailure() {
  const context = await browser.newContext();
  const page = await context.newPage();
  const css = new URL(portable.referencePath + portable.manifest().css, portable.base).href;
  const failures = [];
  page.on('requestfailed', request => { if (request.url() === css) failures.push(request.url()); });
  try {
    await page.route(css, route => route.abort('failed'));
    await page.goto(new URL('product/work-delivery/', portable.base).href, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('[data-native-demo="delivery"]')?.dataset.productStyles === 'error');
    assert(failures.length, 'Actual product stylesheet request fails');
    const fallback = await stylesheetUI(page);
    assert.equal(fallback.state, 'error');
    assert.equal(fallback.viewport, 'hidden');
    assert(fallback.statusVisible);
    assert.match(fallback.text, /暂时无法加载/);
    assert.equal(fallback.original, new URL(portable.referencePath + portable.manifest().images.delivery.path, portable.base).href);
  } finally { await context.close(); }
}

async function harnessNavigation() {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [], writes = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!['GET', 'HEAD'].includes(request.method())) writes.push(request.url()); });
  try {
    await page.goto(new URL('product/', portable.base).href, { waitUntil: 'load' });
    for (let pass = 0; pass < 3; pass++) {
      await page.locator('.masthead .brand').click();
      await page.waitForURL(portable.url);
      assert.equal(await page.locator('.focused-prototype').count(), 4);
      for (const [name, presentation] of [['hero', 'whole-page'], ['delivery', 'composed-v1'], ['training', 'composed-v1'], ['knowledge', 'composed-v1']]) {
        const prototype = page.locator(`.focused-prototype[data-prototype="${name}"]`);
        assert.equal(await prototype.count(), 1);
        assert.equal(await prototype.getAttribute('data-presentation'), presentation);
        // 每个场景在进入视口时才挂载，避免把离屏的懒加载误判为故障。
        await prototype.scrollIntoViewIfNeeded();
        await page.waitForFunction(name => document.querySelector(`.focused-prototype[data-prototype="${name}"]`)?.dataset.ready === 'true', name, { timeout: 15000 });
      }
      await page.evaluate(() => { window.__retiredProductHosts = [...document.querySelectorAll('.focused-prototype')]; });
      await page.locator('#product-access a[href$="/zh/product/"]').click();
      await page.waitForURL(new URL('product/', portable.base).href);
      assert.equal(await page.locator('.focused-prototype').count(), 0);
      assert.deepEqual(await page.evaluate(() => window.__retiredProductHosts.map(host => host.isConnected)), [false, false, false, false], 'All prior player hosts unmount after navigation');
    }
    assert.deepEqual(errors, []); assert.deepEqual(writes, []);
  } finally { await context.close(); }
}

(async () => {
  browser = await portable.launch();
  await check('production parser: six frozen frames, eight rejection boundaries, zero parsing requests', frameBoundary);
  await check('harness repeated navigation and prototype lifecycle', harnessNavigation);
  await check('actual stylesheet failure retains original-image fallback', harnessStylesheetFailure);
})().catch(error => {
  process.exitCode = 1;
  report.errors.push(error.stack);
  console.error(error.stack);
}).finally(async () => {
  if (browser) await browser.close();
  report.finishedAt = new Date().toISOString();
  report.endTestIdentity = testIdentity();
  if (report.endTestIdentity !== report.testIdentity) {
    process.exitCode = 1;
    report.errors.push('Runtime test source changed during regression');
  }
  report.exitCode = process.exitCode || 0;
  fs.writeFileSync(path.join(portable.evidence, 'commercial-runtime.json'), JSON.stringify(report, null, 2));
  console.log(`Runtime evidence: ${portable.evidence}`);
});
