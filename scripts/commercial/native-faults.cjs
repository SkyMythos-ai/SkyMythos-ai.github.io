const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { manifest, referenceRoot, referencePath } = require('./browser.cjs');
const { installSideEffectAudit, allowedRequest } = require('./side-effect-audit.cjs');
const names = ['delivery', 'methods', 'management'];
const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
async function tick(page, milliseconds) { await page.clock.runFor(milliseconds); await delay(60); await page.clock.runFor(34); }
async function states(page) {
  return page.evaluate(() => [...document.querySelectorAll('[data-native-demo]')].map(root => ({
    name: root.dataset.nativeDemo, frame: root.dataset.referenceFrame, terminal: root.dataset.referenceTerminal,
    elapsed: Number(root.dataset.elapsed), running: root.dataset.running,
    active: [...root.shadowRoot.querySelectorAll('[data-product-frame]')].filter(frame => !frame.hidden).map(frame => frame.dataset.productFrame),
    frames: root.shadowRoot.querySelectorAll('[data-product-frame]').length,
    inert: !!root.shadowRoot.querySelector('.product-reference-root[inert]'),
    secrets: [...root.shadowRoot.querySelectorAll('input[type="password"]')].map(input => input.value),
  })));
}
function staticTerminal(samples) {
  assert.deepEqual(samples.map(row => row.name), names);
  for (const row of samples) {
    assert.equal(row.frame, row.terminal, `${row.name}: retains readable terminal on load failure`);
    assert.deepEqual(row.active, [row.terminal]);
    assert.equal(row.running, 'false');
    assert(row.inert);
    assert(row.secrets.every(value => value === ''));
    assert.equal(row.frames, 1, 'Failed/canceled preload must not install a partial frame set');
  }
}
async function enter(page) {
  await page.evaluate(() => {
    const root = document.querySelector('#product');
    const stage = root.querySelector('.capability-browser');
    const track = root.querySelector('.capability-track');
    const distance = (track.getBoundingClientRect().height - stage.getBoundingClientRect().height) / 3;
    scrollTo({ top: scrollY + track.getBoundingClientRect().top - parseFloat(getComputedStyle(stage).top) + distance * .15, behavior: 'instant' });
  });
  await tick(page, 180);
}
/** 故障只注入发布静态边界；页面、React controller、计时与回退始终是真实 out 产物。 */
async function runNativeFaults(browser, report) {
  const data = manifest();
  const target = referencePath + data.scenes.delivery.frames.start.path;
  const manifestURL = referencePath + 'manifest.json';
  const specs = ['corrupt-frame', 'invalid-manifest', 'partial-http-failure', 'slow-before-entrance', 'late-after-entrance', 'cancel-on-client-unmount', 'reduced-during-load', 'keyboard-during-load', 'dialog-during-load', 'hidden-during-load', 'timeout'];
  for (const kind of specs) {
    const label = `load fault: ${kind}`;
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const issues = [], requests = [], expectedResourceErrors = [];
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    let seen;
    const intercepted = new Promise(resolve => { seen = resolve; });
    let injected = false;
    const delayed = !['corrupt-frame', 'invalid-manifest', 'partial-http-failure'].includes(kind);
    const interceptedPath = kind === 'invalid-manifest' ? manifestURL : target;
    try {
      const policy = await installSideEffectAudit(page);
      await page.clock.install({ time: new Date('2026-10-26T00:00:00Z') });
      await page.clock.pauseAt(new Date('2026-10-26T00:01:00Z'));
      page.on('pageerror', error => issues.push(error.stack));
      page.on('console', message => {
        if (message.type() !== 'error') return;
        const expected = kind === 'partial-http-failure' && message.location().url?.includes(interceptedPath) && /Failed to load resource/.test(message.text());
        (expected ? expectedResourceErrors : issues).push(message.text());
      });
      page.on('request', request => requests.push({ method: request.method(), url: request.url(), type: request.resourceType(), headers: request.headers() }));
      page.on('requestfailed', request => {
        if (require('./transport.cjs').recordExpectedFailure(request)) return;
        const canceledProductRead = policy.productPaths.includes(new URL(request.url()).pathname) && request.method() === 'GET' && request.resourceType() === 'fetch' && new URL(request.url()).origin === policy.origin && request.failure()?.errorText === 'net::ERR_ABORTED';
        (canceledProductRead ? expectedResourceErrors : issues).push(`${request.failure()?.errorText}: ${request.url()}`);
      });
      page.on('response', response => {
        if (response.status() < 400) return;
        const injectedHTTP = kind === 'partial-http-failure' && new URL(response.url()).pathname === interceptedPath && response.status() === 503;
        (injectedHTTP ? expectedResourceErrors : issues).push(`HTTP ${response.status()}: ${response.url()}`);
      });
      await page.route(new URL(interceptedPath, report.url).href, async route => {
        injected = true; seen();
        if (delayed) await gate;
        const file = path.join(referenceRoot, interceptedPath.slice(referencePath.length));
        const body = fs.readFileSync(file);
        try {
          if (kind === 'partial-http-failure') await route.fulfill({ status: 503, contentType: 'text/plain', body: 'Intentional regression fixture failure' });
          else if (kind === 'invalid-manifest') await route.fulfill({ contentType: 'application/json', body: '{invalid-json' });
          else await route.fulfill({ contentType: 'text/html', body: kind === 'corrupt-frame' ? Buffer.concat([body, Buffer.from('tampered')]) : body });
        } catch (error) {
          // 取消/卸载后浏览器可能已撤销对应route；这正是受测故障，不扩大到其他请求。
          if (!delayed) throw error;
          expectedResourceErrors.push(`intercepted request already canceled: ${error.message}`);
        }
      });
      await page.goto(report.url, { waitUntil: 'load' });
      await tick(page, 100);
      await Promise.race([intercepted, delay(8000).then(() => { throw new Error('Expected product preload was not requested'); })]);
      assert(injected);
      if (delayed) {
        assert.equal(await page.locator('#product').getAttribute('data-demo-readiness'), 'loading');
        staticTerminal(await states(page));
        if (kind === 'slow-before-entrance') {
          await tick(page, 6000);
          staticTerminal(await states(page));
          release();
          await page.waitForFunction(() => document.querySelector('#product').dataset.demoReadiness === 'ready', null, { polling: 50 });
          const prepared = await states(page);
          for (const row of prepared) { assert.equal(row.elapsed, 0); assert.equal(row.frame, data.scenes[row.name].frames.start.id); }
          await enter(page); await tick(page, 6000);
          assert.equal((await states(page))[0].frame, data.scenes.delivery.frames.middle.id, 'Six seconds begins after ready/entry, never during six-second load');
        } else if (kind === 'cancel-on-client-unmount') {
          await page.evaluate(() => { window.__oldProductHosts = [...document.querySelectorAll('[data-native-demo]')]; document.querySelector('.hero a[href$="/product/"]').click(); });
          await page.waitForURL(new URL('product/', report.url).href);
          release(); await tick(page, 1000);
          assert.equal(await page.locator('[data-native-demo]').count(), 0);
          assert(await page.evaluate(() => window.__oldProductHosts.every(root => !root.isConnected && root.dataset.running === 'false' && root.dataset.referenceFrame === root.dataset.referenceTerminal && root.shadowRoot.querySelectorAll('[data-product-frame]').length === 1)), 'Unmount ignores late frames and owns no running player');
        } else {
          if (kind === 'late-after-entrance') await enter(page);
          if (kind === 'reduced-during-load') await page.emulateMedia({ reducedMotion: 'reduce' });
          if (kind === 'keyboard-during-load') { await page.keyboard.press('Tab'); await page.locator('[data-tab="delivery"]').focus(); }
          if (kind === 'dialog-during-load') await page.locator('.hero [data-contact]').click();
          if (kind === 'hidden-during-load') await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
          await tick(page, kind === 'timeout' ? 16000 : 250);
          await page.waitForFunction(() => document.querySelector('#product').dataset.demoReadiness === 'static', null, { polling: 50 });
          const before = await states(page); staticTerminal(before);
          release(); await delay(150); await tick(page, 2000);
          staticTerminal(await states(page));
          assert.equal(await page.locator('#product').getAttribute('data-demo-readiness'), 'static', 'Late completion never restarts a canceled reading session');
        }
      } else {
        await page.waitForFunction(() => document.querySelector('#product').dataset.demoReadiness === 'static', null, { polling: 50 });
        staticTerminal(await states(page));
        await enter(page); await tick(page, 13000); staticTerminal(await states(page));
      }
      assert.deepEqual(issues, [], 'No unexpected page/hydration/console errors in fault case');
      assert.deepEqual(requests.filter(request => !allowedRequest(request, policy) || !['GET', 'HEAD'].includes(request.method) || new URL(request.url).origin !== new URL(report.url).origin), [], 'Fault recovery has only declared same-origin static GET/RSC reads');
      assert.deepEqual(await page.evaluate(() => window.__nativeDemoEffects), [], 'Fault recovery has no cookie/storage/credential/business side effects');
      assert.deepEqual(await context.cookies(), []);
      report.rows.push({ label, status: 'passed', injected: interceptedPath, expectedResourceErrors });
      console.log(`PASS ${label}`);
    } catch (error) {
      report.rows.push({ label, status: 'failed', message: error.message, stack: error.stack });
      report.diagnostics.push({ label, issues, expectedResourceErrors, state: await states(page).catch(() => null) });
      process.exitCode = 1;
      console.error(`FAIL ${label}: ${error.message}`);
    } finally { release(); await context.close(); }
  }
}
module.exports = { runNativeFaults };
