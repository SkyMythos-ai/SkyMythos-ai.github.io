const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const ts = require('typescript');
const portable = require('../../scripts/commercial/browser.cjs');

portable.trackIdentity('commercial-runtime');
const names = ['delivery', 'methods', 'management'];
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

async function sceneState(page) {
  return page.evaluate(() => ({
    readiness: document.querySelector('#product')?.dataset.demoReadiness,
    mode: document.querySelector('#product')?.dataset.capabilityMode,
    current: document.querySelector('#product')?.dataset.capabilityCurrent,
    scenes: [...document.querySelectorAll('[data-native-demo]')].map(element => ({
      name: element.dataset.nativeDemo, elapsed: Number(element.dataset.elapsed), running: element.dataset.running,
      frame: element.dataset.referenceFrame, phase: element.dataset.phase,
      frames: [...(element.shadowRoot?.querySelectorAll('[data-product-frame]') || [])].map(node => node.dataset.productFrame),
      active: [...(element.shadowRoot?.querySelectorAll('[data-product-frame]') || [])].filter(node => !node.hidden).map(node => node.dataset.productFrame),
    })),
  }));
}

async function readyHome(page) {
  await page.waitForFunction(() => document.querySelector('#product')?.dataset.demoReadiness === 'ready', null, { timeout: 20000 });
  const state = await sceneState(page);
  assert.equal(state.mode, 'stage');
  assert.deepEqual(state.scenes.map(row => row.name), names);
  for (const row of state.scenes) {
    assert.deepEqual(row.frames.sort(), ['start', 'middle', 'result'].map(phase => `${row.name}-${phase}`).sort());
    assert.equal(row.active.length, 1);
  }
  assert.equal(await page.locator('.capability-window').count(), 1, 'Exactly one mounted capability window');
  assert.equal(await page.locator('.capability-marker').count(), 3, 'Exactly three mounted markers');
  assert.equal(await page.locator('#capability-detail').count(), 1, 'Exactly one mounted detail');
}

async function positionScene(page, index) {
  await page.evaluate(index => {
    document.activeElement?.blur();
    const root = document.querySelector('#product');
    const stage = root.querySelector('.capability-browser');
    const track = root.querySelector('.capability-track');
    const step = (track.getBoundingClientRect().height - stage.getBoundingClientRect().height) / 3;
    scrollTo({ top: track.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(stage).top) + step * (index + .15), behavior: 'instant' });
  }, index);
}

async function seek(page, index) {
  await positionScene(page, index);
  await page.waitForFunction(name => document.querySelector(`[data-native-demo="${name}"]`)?.dataset.running === 'true', names[index]);
}

async function runningAfter(page, name, elapsed) {
  await page.waitForFunction(({ name, elapsed }) => {
    const element = document.querySelector(`[data-native-demo="${name}"]`);
    return element?.dataset.running === 'true' && Number(element.dataset.elapsed) > elapsed;
  }, { name, elapsed });
}

async function lifecycleAndNavigation() {
  const failedBefore = report.checks.filter(row => row.status === 'failed').length;
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(30000);
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' || /hydrat|mismatch/i.test(message.text())) report.errors.push(message.text()); });
  await page.addInitScript(() => {
    window.__runtimeDocument = `${Date.now()}-${Math.random()}`;
    window.__runtimeTransitions = [];
    for (const type of ['pagehide', 'pageshow']) addEventListener(type, event => window.__runtimeTransitions.push({ type, persisted: event.persisted, trusted: event.isTrusted }));
  });
  const productURL = new URL('product/', portable.base).href;
  try {
    await page.goto(portable.url, { waitUntil: 'load' });
    await readyHome(page);
    await check('wall-clock playback reaches actual start, middle and terminal product frames without Playwright.clock', async () => {
      await seek(page, 0);
      await runningAfter(page, 'delivery', .1);
      const start = await sceneState(page);
      assert.equal(start.scenes[0].frame, 'delivery-start');
      await page.waitForFunction(() => document.querySelector('[data-native-demo="delivery"]')?.dataset.referenceFrame === 'delivery-middle', null, { timeout: 15000 });
      const middle = await sceneState(page);
      await page.waitForFunction(() => document.querySelector('[data-native-demo="delivery"]')?.dataset.complete === 'true', null, { timeout: 15000 });
      const result = await sceneState(page);
      assert.equal(result.scenes[0].frame, 'delivery-result');
      assert.equal(result.scenes[0].elapsed, 12);
      assert.equal(result.scenes[0].running, 'false');
      for (const state of [start, middle, result]) {
        assert.deepEqual(state.scenes.slice(1).map(row => row.elapsed), [0, 0], 'Inactive clocks do not advance');
        assert(state.scenes.every(row => row.active.length === 1 && row.active[0] === row.frame));
      }
      report.samples.push({ label: 'wall-clock playback', start, middle, result });
    });
    await check('synthetic persisted pagehide pauses and pageshow resumes the same live instance', async () => {
      await seek(page, 1);
      await runningAfter(page, 'methods', .2);
      await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
      const paused = await sceneState(page);
      assert.equal(paused.scenes[1].running, 'false');
      await page.waitForTimeout(300);
      const held = await sceneState(page);
      assert.equal(held.scenes[1].elapsed, paused.scenes[1].elapsed);
      assert.equal(await page.locator('.capability-window').count(), 1, 'Persisted page retains its controllers');
      await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
      await runningAfter(page, 'methods', paused.scenes[1].elapsed + .1);
      report.samples.push({ label: 'synthetic persisted lifecycle', paused, resumed: await sceneState(page) });
    });
    await check('three product → home → product → home cycles remain client-side and dispose old roots', async () => {
      const documentIdentity = await page.evaluate(() => window.__runtimeDocument);
      const navigate = async home => {
        // 保存旧作者节点，验证卸载恢复而非只看新页面的元素数。
        await page.evaluate(() => { window.__runtimeOldRoot = document.querySelector('[data-commercial-page]'); });
        const oldHome = await page.locator('#product').count() === 1;
        const target = home ? portable.base.pathname : new URL(productURL).pathname;
        let link = home ? page.locator('.breadcrumb a').first() : page.locator(`a[href="${target}"]:visible`).first();
        if (!home && !await link.count()) {
          const group = page.locator('.nav-group').filter({ has: page.locator(`a[href="${target}"]`) }).first();
          await group.locator('summary').click();
          link = group.locator(`a[href="${target}"]`).first();
        }
        assert.equal(await link.getAttribute('href'), target);
        await link.click();
        await page.waitForURL(url => url.pathname === target && !url.hash);
        if (home) await readyHome(page);
        else await page.waitForFunction(() => !document.querySelector('#product') && document.querySelector('#commercial-site.js'));
        assert.equal(await page.evaluate(() => window.__runtimeDocument), documentIdentity, 'Navigation uses the real Next client router, not a document reload');
        const old = await page.evaluate(() => {
          const root = window.__runtimeOldRoot;
          return {
            connected: root?.isConnected,
            enhanced: document.querySelector('#commercial-site')?.classList.contains('js'),
            generated: root?.querySelectorAll('.capability-window,.capability-marker,#capability-detail,.capability-meta').length,
            scenes: [...(root?.querySelectorAll('[data-native-demo]') || [])].map(element => ({
              running: element.dataset.running,
              frames: [...(element.shadowRoot?.querySelectorAll('[data-product-frame]') || [])].map(node => node.dataset.productFrame),
            })),
          };
        });
        assert.equal(old.connected, false, 'Old route root is detached');
        assert.equal(old.enhanced, true, 'Shared Next layout owns the currently mounted site controller');
        assert.equal(old.generated, 0, 'Old capability controller removed all generated nodes');
        if (oldHome) for (const row of old.scenes) { assert.equal(row.running, 'false'); assert.equal(row.frames.length, 1, 'Only original SSR terminal remains after dispose'); }
      };
      // 第一次先由首页进入产品页，随后执行三个完整的往返序列。
      await navigate(false);
      for (let cycle = 0; cycle < 3; cycle++) {
        await navigate(true);
        await navigate(false);
        await navigate(true);
        if (cycle < 2) await navigate(false);
      }
      await page.goBack();
      await page.waitForURL(productURL);
      await page.waitForFunction(() => !document.querySelector('#product') && document.querySelector('#commercial-site.js'));
      await page.goForward();
      await page.waitForURL(portable.url);
      await readyHome(page);
      assert.equal(await page.evaluate(() => window.__runtimeDocument), documentIdentity, 'Client history traversal preserves the current document');
      report.samples.push({ label: 'repeated client navigation and back/forward', documentIdentity, state: await sceneState(page) });
    });
    await check('real document history restores working runtime or remounts it when BFCache is unavailable', async () => {
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      const previous = await page.evaluate(() => window.__runtimeDocument);
      await page.goto(productURL, { waitUntil: 'load' });
      assert.notEqual(await page.evaluate(() => window.__runtimeDocument), previous, 'This leg really crosses a document boundary');
      await page.goBack({ waitUntil: 'load' });
      await page.waitForURL(portable.url);
      await readyHome(page);
      const restored = await page.evaluate(() => ({ identity: window.__runtimeDocument, transitions: window.__runtimeTransitions }));
      const persisted = restored.transitions.some(event => event.type === 'pageshow' && event.persisted && event.trusted);
      if (persisted) assert.equal(restored.identity, previous, 'Actual BFCache retains the same document instance');
      else report.limitations.push('This browser did not expose a trusted persisted pageshow for real document history; fresh runtime remount verified instead. Synthetic persisted pause/resume is separately covered.');
      await seek(page, 0);
      await runningAfter(page, 'delivery', .1);
      report.samples.push({ label: 'actual document history', persisted, restored, state: await sceneState(page) });
    });
    await check('synthetic non-persisted pagehide fully disposes and pageshow cannot restart released controllers', async () => {
      await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false })));
      const disposed = await sceneState(page);
      assert.equal(disposed.readiness, undefined);
      assert.equal(disposed.mode, undefined);
      assert.equal(await page.locator('.capability-window,.capability-marker,#capability-detail,.capability-meta').count(), 0);
      for (const row of disposed.scenes) {
        assert.equal(row.running, 'false');
        assert.deepEqual(row.frames, [`${row.name}-result`]);
        assert.deepEqual(row.active, [`${row.name}-result`]);
      }
      await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false })));
      await page.waitForTimeout(300);
      assert.deepEqual(await sceneState(page), disposed, 'Released instance cannot advance, reinsert frames or remount on pageshow');
      report.samples.push({ label: 'synthetic final disposal', state: disposed });
    });
    assert.deepEqual(report.errors, [], 'No runtime, hydration or console errors across real browser lifecycles');
    assert.equal(report.checks.filter(row => row.status === 'failed').length, failedBefore, 'Every exported runtime lifecycle check must pass');
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

async function stylesheetClock() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  let releaseCSS;
  let closing = false;
  const barrier = new Promise(resolve => { releaseCSS = resolve; });
  try {
    const cssURL = new URL(portable.referencePath + portable.manifest().css, portable.base).href;
    await page.route(cssURL, async route => {
      await barrier;
      if (!closing) await route.continue();
    });
    await page.goto(new URL('product/', portable.base).href, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('#commercial-site')?.classList.contains('js'));
    const documentIdentity = await page.evaluate(() => performance.timeOrigin);
    await page.locator('.breadcrumb a').first().click();
    await page.waitForURL(portable.url);
    await readyHome(page);
    assert.equal(await page.evaluate(() => performance.timeOrigin), documentIdentity, 'Delayed CSS test exercises real client navigation and attachShadow');
    await positionScene(page, 0);
    await page.waitForTimeout(300);
    const pending = await sceneState(page);
    const loading = await stylesheetUI(page);
    assert.equal(loading.viewport, 'hidden');
    assert(loading.statusVisible, 'Pending CSS retains a visible readable loading status');
    assert.match(loading.text, /载入完整产品界面/);
    assert.equal(loading.original, new URL(portable.referencePath + portable.manifest().images.delivery.path, portable.base).href, 'Pending status links to the complete original image');
    assert(pending.scenes.every(row => row.elapsed === 0 && row.running === 'false'), 'CSSpending media cannot consume execution time even after entering the viewport');
    releaseCSS();
    await runningAfter(page, 'delivery', .1);
    await page.locator('[data-native-demo="delivery"]').evaluate(element => { element.dataset.productStyles = 'error'; });
    await page.waitForFunction(() => document.querySelector('[data-native-demo="delivery"]').dataset.running === 'false');
    const error = await sceneState(page);
    await page.waitForTimeout(250);
    assert.deepEqual(await sceneState(page), error, 'CSSerror freezes the current scene clock');
    await page.locator('[data-native-demo="delivery"]').evaluate(element => { element.dataset.productStyles = 'ready'; });
    await runningAfter(page, 'delivery', error.scenes[0].elapsed + .1);
    await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false })));
    const disposed = await sceneState(page);
    await page.locator('[data-native-demo="delivery"]').evaluate(element => { element.dataset.productStyles = 'error'; element.dataset.productStyles = 'ready'; });
    await page.waitForTimeout(250);
    assert.deepEqual(await sceneState(page), disposed, 'CSSready mutation cannot revive a disposed player');
    report.samples.push({ label: 'client-navigation CSS clock gate', pending, loading, error, disposed });
  } finally { closing = true; releaseCSS(); await context.close(); }
}

async function stylesheetFailure() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  const errors = [];
  const failedCSS = [];
  page.on('pageerror', error => errors.push(error.message));
  const cssURL = new URL(portable.referencePath + portable.manifest().css, portable.base).href;
  page.on('requestfailed', request => { if (request.url() === cssURL) failedCSS.push(request.failure()?.errorText); });
  try {
    await page.route(cssURL, route => route.abort('failed'));
    await page.goto(portable.url, { waitUntil: 'load' });
    await readyHome(page);
    await page.waitForFunction(() => [...document.querySelectorAll('[data-native-demo]')].every(element => element.dataset.productStyles === 'error'));
    await positionScene(page, 0);
    await page.waitForTimeout(300);
    const initial = await sceneState(page);
    const fallback = await stylesheetUI(page);
    assert(failedCSS.length > 0, 'The actual full product stylesheet request really failed');
    assert.equal(fallback.state, 'error');
    assert.equal(fallback.viewport, 'hidden');
    assert(fallback.statusVisible, 'CSS failure retains readable error and original image fallback');
    assert.match(fallback.text, /暂时无法加载/);
    assert.equal(fallback.original, new URL(portable.referencePath + portable.manifest().images.delivery.path, portable.base).href);
    assert(initial.scenes.every(row => row.elapsed === 0 && row.running === 'false'), 'CSS request failure never consumes scene execution time');
    await page.waitForTimeout(250);
    assert.deepEqual(await sceneState(page), initial, 'Visible CSS-error scene stays stationary');
    assert.deepEqual(errors, [], 'A stylesheet transport failure does not produce a runtime exception');
    report.samples.push({ label: 'actual CSS request failure', failedCSS, fallback, state: initial });
  } finally { await context.close(); }
}

async function mobileEntrance() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5, reducedMotion: 'no-preference', colorScheme: 'light', serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(portable.url, { waitUntil: 'load' });
    await page.waitForFunction(() => ['ready', 'static'].includes(document.querySelector('#product')?.dataset.demoReadiness), null, { polling: 50, timeout: 20000 });
    const entrance = await page.evaluate(() => ({
      sectionTop: document.querySelector('#product').getBoundingClientRect().top,
      viewportHeight: innerHeight,
      mediaTop: Math.min(...[...document.querySelectorAll('[data-native-demo]')].map(element => element.getBoundingClientRect().top)),
      readiness: document.querySelector('#product').dataset.demoReadiness,
    }));
    report.samples.push({ label: 'mobile initial media entrance', entrance });
    assert(entrance.mediaTop > entrance.viewportHeight, 'Actual initial mobile product media is below the fold');
    assert.equal(entrance.readiness, 'ready', 'Visible section heading must not permanently disable playback before actual product media enters');
    await readyHome(page);
    for (const [index, name] of names.entries()) {
      await seek(page, index);
      await runningAfter(page, name, .1);
      const state = await sceneState(page);
      const scene = state.scenes[index];
      assert.equal(scene.frame, `${name}-start`);
      assert.deepEqual(scene.active, [`${name}-start`]);
      report.samples.push({ label: `mobile real-clock ${name}`, state });
    }
    assert.deepEqual(errors, [], 'Mobile playback has no browser runtime errors');
  } finally { await context.close(); }
}

(async () => {
  browser = await portable.launch();
  await check('production parser: six frozen frames, eight rejection boundaries, zero parsing requests', frameBoundary);
  await check('real exported app runtime lifecycle integration', lifecycleAndNavigation);
  await check('mobile visible heading does not count as below-fold product media entrance', mobileEntrance);
  await check('client-navigation CSSpending/error pauses clocks and disposed ready cannot restart', stylesheetClock);
  await check('actual CSS request failure keeps readable fallback with zero elapsed', stylesheetFailure);
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
