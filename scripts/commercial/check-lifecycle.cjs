const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const portable = require('./browser.cjs');
portable.trackIdentity('lifecycle');

const project = portable.project;
const evidence = portable.evidence;
const url = portable.url;
const hero = path.join(project, 'src/components/hero-lifecycle');
const read = file => fs.readFileSync(file, 'utf8');
const compiled = ts.transpileModule(read(path.join(hero, 'model.ts')), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const model = { exports: {} };
new Function('module', 'exports', compiled)(model, model.exports);
const { frameAt } = model.exports;
const report = { url, startedAt: new Date().toISOString(), clock: 'Playwright clock.runFor, executing each scheduled RAF (not fastForward)', checks: [], samples: [], screenshots: [], errors: [], requests: [], failedRequests: [], failedResponses: [] };
fs.mkdirSync(evidence, { recursive: true });
let browser;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function check(name, action) {
  try { const details = await action(); report.checks.push({ name, pass: true, details }); }
  catch (error) { report.checks.push({ name, pass: false, error: error.stack }); }
}
async function snapshot(page) {
  return page.locator('[data-lifecycle="b"]').evaluate(root => ({
    data: { ...root.dataset }, held: root.dataset.held,
    focused: root.matches(':focus-visible'),
    headings: [...root.querySelectorAll('[data-act-heading]')].filter(node => !node.hidden).map(node => Number(node.dataset.actHeading)),
    status: root.querySelector('[data-lifecycle-status]').textContent,
    parts: Object.fromEntries(['release-approved', 'release-seal', 'v1-history', 'learning-edit', 'approval', 'method', 'reference', 'review-label', 'v2-page', 'document-version', 'world'].map(key => {
      const node = root.querySelector(`[data-part="${key}"]`);
      return [key, { visibility: node.getAttribute('visibility'), display: node.style.display, text: node.textContent, transform: node.getAttribute('transform'), clipPath: node.style.clipPath }];
    })),
  }));
}
function compare(sample, still = false) {
  const d = sample.data;
  const frame = frameAt(still ? 50 : Number(d.elapsed));
  const fields = { act: still ? 2 : frame.act, cycle: frame.cycle, requirement: frame.requirementID, version: frame.requirementVersion, scopeConfirmed: frame.scopeConfirmed, tested: frame.tested, accepted: frame.accepted, releaseApproved: frame.releaseApproved, released: frame.released, releasedVersion: frame.releasedVersion, summaryReady: frame.summaryReady, learningConfirmed: frame.learningConfirmed, learningAdopted: frame.learningAdopted, stored: frame.stored, referenced: frame.referenced, v2Review: frame.v2Review, v2Accepted: frame.v2Accepted, v2Released: frame.v2Released, v1Method: frame.v1MethodRevision, v2Method: frame.v2MethodRevision, roleRevision: frame.roleRevision };
  for (const [key, value] of Object.entries(fields)) assert.equal(d[key], String(value), `${key} at elapsed ${d.elapsed}`);
  assert.deepEqual(sample.headings, [Number(d.act)]);
  assert.equal(d.plannerModel, 'Claude');
  assert.equal(d.developerModel, 'GPT');
  assert.equal(d.verifierModel, 'DeepSeek');
  assert.equal(d.static, String(still));
  return Object.keys(fields).length + 5;
}
async function advanceTo(page, target) {
  const current = Number((await snapshot(page)).data.elapsed);
  assert(target >= current, `${target} must follow ${current}`);
  await page.clock.runFor(Math.ceil((target - current) * 1000) + 17);
  return snapshot(page);
}
async function scrollBIntoView(page) {
  const root = page.locator('[data-lifecycle="b"]');
  await root.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await delay(100);
}
async function initialOffscreen(page, still = false) {
  await delay(100);
  const geometry = await page.locator('[data-lifecycle="b"]').evaluate(root => {
    const box = root.getBoundingClientRect();
    return { top: box.top, bottom: box.bottom, viewportHeight: innerHeight, scrollY };
  });
  assert.equal(geometry.scrollY, 0, 'Initial page must remain at the top');
  assert(geometry.top >= geometry.viewportHeight, `B should initially be below viewport: ${JSON.stringify(geometry)}`);
  const before = await snapshot(page); compare(before, still);
  assert.equal(before.data.elapsed, '0.000'); assert.equal(before.data.running, 'false');
  await page.clock.runFor(5000); await delay(100);
  const after = await snapshot(page); compare(after, still);
  assert.equal(after.data.elapsed, '0.000'); assert.equal(after.data.running, 'false');
  return { geometry, virtualMilliseconds: 5000, before: before.data.elapsed, after: after.data.elapsed, static: after.data.static };
}
async function ready(page) {
  const root = page.locator('[data-lifecycle="b"]');
  await scrollBIntoView(page);
  for (let n = 0; n < 30; n++) {
    await delay(30);
    await page.clock.runFor(32);
    if ((await root.getAttribute('data-running')) === 'true') return;
  }
  throw new Error('Lifecycle did not start while in view');
}
async function newPage(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'no-preference', ...options });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push({ page: options.viewport ? 'mobile' : 'desktop', type: 'pageerror', text: error.message }));
  const pageLabel = options.viewport ? 'mobile' : 'desktop';
  page.on('console', message => { if (message.type() === 'error') report.errors.push({ page: pageLabel, type: 'console', text: message.text(), location: message.location() }); });
  page.on('request', request => report.requests.push({ page: pageLabel, method: request.method(), url: request.url() }));
  page.on('requestfailed', request => { if (!require('./transport.cjs').recordExpectedFailure(request)) report.failedRequests.push({ page: pageLabel, method: request.method(), url: request.url(), resourceType: request.resourceType(), error: request.failure()?.errorText }); });
  page.on('response', response => { if (response.status() >= 400) report.failedResponses.push({ page: pageLabel, url: response.url(), status: response.status(), statusText: response.statusText() }); });
  await page.clock.install({ time: new Date('2026-10-22T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-22T00:01:00Z'));
  return page;
}
(async () => {
  browser = await portable.launch();
  const page = await newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await check('initial desktop below-fold B stays stopped at zero after 5 virtual seconds', () => initialOffscreen(page));
  await check('formal page uses the actual React lifecycle without a public test controller', async () => {
    assert.equal(await page.locator('[data-lifecycle="b"]').count(), 1);
    assert.equal(await page.locator('script[src*="lifecycle.js"]').count(), 0);
    return { authority: 'src/components/hero-lifecycle/playback.tsx React effect', publicTestController: false };
  });
  await ready(page);
  const times = [1, 3, 5.5, 6.8, 7.5, 9, 10, 12, 14, 17, 18, 18.5, 21, 23, 23.95, 24, 25.45, 25.5, 26.45, 26.5, 28, 29, 30, 32, 33, 34.5, 35.5, 36.5, 38, 39, 40, 43, 45, 46, 49.9, 50, 56.9, 57, 63.9, 64, 70.9, 71, 77.9, 78, 84.9, 85, 91.9, 92];
  let assertions = 0;
  for (const time of times) {
    await check(`browser timeline ${time}s matches production model`, async () => {
      const sample = await advanceTo(page, time);
      report.samples.push({ target: time, ...sample });
      assertions += compare(sample);
      assert(Math.abs(Number(sample.data.elapsed) - time) < .05);
      if (time === 24) {
        assert.equal(sample.data.accepted, 'true'); assert.equal(sample.data.releaseApproved, 'false'); assert.equal(sample.data.released, 'false');
        assert.equal(sample.parts['release-approved'].display, 'none'); assert.equal(sample.parts['release-seal'].display, 'none');
      }
      if (time === 25.5) { assert.equal(sample.data.releaseApproved, 'true'); assert.equal(sample.data.released, 'false'); }
      if (time === 26.5) { assert.equal(sample.data.released, 'true'); assert.equal(sample.data.releasedVersion, '1'); }
      if (time === 32) { assert.equal(sample.data.summaryReady, 'true'); assert.equal(sample.data.learningConfirmed, 'false'); assert.equal(sample.data.learningAdopted, 'false'); assert.equal(sample.parts['learning-edit'].display, 'none'); }
      if (time === 34.5) { assert.notEqual(sample.parts['learning-edit'].display, 'none'); assert.equal(sample.parts['learning-edit'].clipPath.replaceAll('px', ''), 'inset(0 0% 0 0)'); assert.equal(sample.data.learningConfirmed, 'false'); }
      if (time === 35.5) { assert.equal(sample.data.learningConfirmed, 'true'); assert.equal(sample.data.learningAdopted, 'false'); }
      if (time === 36.5) { assert.equal(sample.data.learningAdopted, 'true'); assert.equal(sample.data.stored, 'false'); }
      if (time === 38) { assert.equal(sample.data.stored, 'true'); assert.equal(sample.data.referenced, 'false'); }
      if (time === 39) { assert.equal(sample.data.referenced, 'true'); assert.equal(sample.data.version, '2'); }
      if (time >= 46) { assert.equal(sample.data.v2Accepted, 'false'); assert.equal(sample.data.v2Released, 'false'); assert.equal(sample.data.releasedVersion, '1'); }
      return { elapsed: sample.data.elapsed, act: sample.data.act, cycle: sample.data.cycle };
    });
  }
  report.timeline = { sampledCheckpoints: times.length, fieldComparisons: assertions, requiredSeconds: 92, lastElapsed: (await snapshot(page)).data.elapsed };
  await check('two 21 second focus cycles preserve history and alternate acts', async () => {
    const samples = report.samples.filter(sample => sample.target >= 50);
    assert.deepEqual(samples.filter(s => [50, 57, 64, 71, 78, 85, 92].includes(s.target)).map(s => s.data.act), ['0', '1', '2', '0', '1', '2', '0']);
    assert.deepEqual(samples.filter(s => [50, 71, 92].includes(s.target)).map(s => s.data.cycle), ['0', '1', '2']);
    for (const s of samples) { assert.equal(s.data.requirement, 'REQ-014'); assert.equal(s.data.version, '2'); assert.equal(s.data.releasedVersion, '1'); assert.equal(s.data.v2Released, 'false'); }
    return { acts: samples.map(s => [s.target, s.data.act, s.data.cycle]) };
  });
  await check('hover continues playback', async () => {
    await page.locator('[data-lifecycle="b"]').hover();
    const before = await snapshot(page); await page.clock.runFor(2000); const after = await snapshot(page);
    assert(Number(after.data.elapsed) - Number(before.data.elapsed) > 1.9);
    return { before: before.data.elapsed, after: after.data.elapsed };
  });
  await check('keyboard focus holds, blur resumes', async () => {
    await page.keyboard.press('Tab');
    await page.locator('[data-lifecycle="b"]').focus();
    const before = await snapshot(page);
    assert.equal(before.focused, true); assert.equal(before.held, 'true'); assert.equal(before.data.running, 'false');
    await page.clock.runFor(2000); const held = await snapshot(page); assert.equal(held.data.elapsed, before.data.elapsed);
    await page.keyboard.press('Tab'); await scrollBIntoView(page); await page.clock.runFor(1000); const after = await snapshot(page);
    assert.equal(after.held, 'false'); assert(Number(after.data.elapsed) > Number(held.data.elapsed) + .9);
    return { before: before.data.elapsed, held: held.data.elapsed, after: after.data.elapsed };
  });
  await check('pointer press releases keyboard hold without resetting elapsed', async () => {
    await page.keyboard.press('Tab'); await page.locator('[data-lifecycle="b"]').focus();
    const before = await snapshot(page); assert.equal(before.held, 'true'); assert.equal(before.data.running, 'false');
    await page.locator('[data-lifecycle="b"]').dispatchEvent('pointerdown', { pointerType: 'mouse' });
    await page.clock.runFor(1000); const after = await snapshot(page); compare(after);
    assert.equal(after.held, 'false'); assert(Number(after.data.elapsed) > Number(before.data.elapsed) + .9);
    await page.locator('[data-lifecycle="b"]').evaluate(root => root.blur());
    return { before: before.data.elapsed, after: after.data.elapsed, stimulus: 'synthetic pointerdown on the actual lifecycle scope' };
  });
  await check('simulated document hidden freezes and visibility restoration resumes', async () => {
    const before = await snapshot(page);
    try {
      await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
      const hidden = await snapshot(page); assert.equal(hidden.data.running, 'false'); assert.equal(hidden.data.elapsed, before.data.elapsed);
      await page.clock.runFor(3000); const frozen = await snapshot(page); assert.equal(frozen.data.elapsed, before.data.elapsed);
      await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
      await page.clock.runFor(1000); const after = await snapshot(page); compare(after);
      assert(Number(after.data.elapsed) > Number(before.data.elapsed) + .9);
      return { before: before.data.elapsed, frozen: frozen.data.elapsed, after: after.data.elapsed, stimulus: 'document.hidden override and visibilitychange, not a real background tab' };
    } finally {
      await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    }
  });
  await check('simulated persisted pagehide freezes and pageshow restores without resetting', async () => {
    const before = await snapshot(page);
    await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
    const hidden = await snapshot(page); assert.equal(hidden.data.running, 'false');
    await page.clock.runFor(3000); const frozen = await snapshot(page); assert.equal(frozen.data.elapsed, before.data.elapsed);
    await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
    await page.clock.runFor(1000); const after = await snapshot(page); compare(after);
    assert(Number(after.data.elapsed) > Number(before.data.elapsed) + .9);
    return { before: before.data.elapsed, frozen: frozen.data.elapsed, after: after.data.elapsed, stimulus: 'synthetic persisted page transition events, not real BFCache navigation' };
  });
  await check('offscreen freezes elapsed and reentry resumes', async () => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await delay(150); await page.clock.runFor(32);
    const geometry = await page.locator('[data-lifecycle="b"]').evaluate(root => ({ top: root.getBoundingClientRect().top, viewportHeight: innerHeight }));
    assert(geometry.top >= geometry.viewportHeight, 'B must really be offscreen before checking freeze');
    const before = await snapshot(page); assert.equal(before.data.running, 'false');
    await page.clock.runFor(3000); const frozen = await snapshot(page); assert.equal(frozen.data.elapsed, before.data.elapsed);
    await ready(page); await page.clock.runFor(1000); const after = await snapshot(page);
    assert(Number(after.data.elapsed) > Number(frozen.data.elapsed) + .9);
    return { before: before.data.elapsed, frozen: frozen.data.elapsed, after: after.data.elapsed };
  });
  await check('reduced motion paints terminal without changing elapsed then resumes', async () => {
    const before = await snapshot(page);
    await page.emulateMedia({ reducedMotion: 'reduce' }); await delay(100); await page.clock.runFor(32);
    const still = await snapshot(page); compare(still, true); assert.equal(still.data.running, 'false'); assert.equal(still.data.elapsed, before.data.elapsed);
    await page.clock.runFor(3000); const frozen = await snapshot(page); assert.equal(frozen.data.elapsed, before.data.elapsed);
    const screenshot = path.join(evidence, 'desktop-reduced-terminal.png'); await page.screenshot({ path: screenshot, clip: await page.locator('[data-lifecycle="b"]').boundingBox() }); report.screenshots.push(screenshot);
    await page.emulateMedia({ reducedMotion: 'no-preference' }); await delay(100); await page.clock.runFor(1000);
    const after = await snapshot(page); compare(after); assert(Number(after.data.elapsed) > Number(before.data.elapsed) + .9);
    return { before: before.data.elapsed, still: still.data.elapsed, frozen: frozen.data.elapsed, after: after.data.elapsed };
  });
  const mobile = await newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await mobile.goto(url, { waitUntil: 'networkidle' });
  await check('initial mobile below-fold reduced B stays terminal at zero after 5 virtual seconds', () => initialOffscreen(mobile, true));
  await check('compact mobile reduced motion terminal state', async () => {
    await scrollBIntoView(mobile);
    const sample = await snapshot(mobile); compare(sample, true); assert.equal(sample.data.elapsed, '0.000'); assert.equal(sample.data.running, 'false');
    const methodHome = await mobile.locator('[data-part="method"]').getAttribute('data-home');
    const [methodX, methodY] = methodHome.split(',').map(Number);
    assert.equal(sample.parts.method.transform, `translate(${methodX} ${methodY}) scale(1) `);
    await mobile.clock.runFor(5000); assert.equal((await snapshot(mobile)).data.elapsed, '0.000');
    const screenshot = path.join(evidence, 'mobile-reduced-terminal.png'); await mobile.screenshot({ path: screenshot, clip: await mobile.locator('[data-lifecycle="b"]').boundingBox() }); report.screenshots.push(screenshot);
    report.samples.push({ target: 'mobile-terminal', ...sample });
    return { elapsed: sample.data.elapsed, version: sample.data.version, v2Accepted: sample.data.v2Accepted, v2Released: sample.data.v2Released };
  });
  await check('mobile disabling reduced motion while B is offscreen does not start playback', async () => {
    await mobile.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await delay(150);
    await mobile.emulateMedia({ reducedMotion: 'no-preference' }); await delay(100);
    assert.equal(await mobile.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), false);
    // Offscreen wake() deliberately keeps the last terminal paint; entry will paint the live frame.
    return initialOffscreen(mobile, true);
  });
  await check('compact mobile resumes full animated introduction to pending v2', async () => {
    await ready(mobile);
    const sample = await advanceTo(mobile, 46); compare(sample);
    assert.equal(sample.data.version, '2'); assert.equal(sample.data.v2Review, 'true'); assert.equal(sample.data.v2Accepted, 'false'); assert.equal(sample.data.v2Released, 'false'); assert.equal(sample.data.releasedVersion, '1');
    report.samples.push({ target: 'mobile-animated-46', ...sample });
    return { elapsed: sample.data.elapsed, static: sample.data.static, running: sample.data.running, v2Review: sample.data.v2Review, v2Accepted: sample.data.v2Accepted, v2Released: sample.data.v2Released };
  });
  await check('desktop and mobile no-JavaScript SSR retain complete pending-v2 terminal state', async () => {
    const results = [];
    for (const viewport of [{ width: 1440, height: 1100 }, { width: 390, height: 844 }]) {
      const nojs = await newPage({ viewport, javaScriptEnabled: false });
      await nojs.goto(url, { waitUntil: 'networkidle' });
      await scrollBIntoView(nojs);
      const before = await snapshot(nojs); compare(before, true);
      assert.equal(before.data.elapsed, '0.000'); assert.equal(before.data.running, 'false');
      for (const key of ['v1-history', 'method', 'reference', 'review-label', 'v2-page']) {
        assert.notEqual(before.parts[key].display, 'none', `${key} must be present in SSR`);
        assert.notEqual(before.parts[key].visibility, 'hidden', `${key} must be visible in SSR`);
      }
      // Production approval is a transient stamp; terminal SSR keeps adopted facts, not an active approval action.
      assert.equal(before.parts.approval.visibility, 'hidden');
      assert.equal(await nojs.locator('[data-part="learning-page"]').isVisible(), false);
      assert.equal(await nojs.locator('[data-part="v2-page"]').isVisible(), true);
      await nojs.clock.runFor(5000); const after = await snapshot(nojs); assert.deepEqual(after, before);
      const screenshot = path.join(evidence, `${viewport.width < 600 ? 'mobile' : 'desktop'}-nojs-terminal.png`);
      await nojs.screenshot({ path: screenshot, clip: await nojs.locator('[data-lifecycle="b"]').boundingBox() }); report.screenshots.push(screenshot);
      results.push({ viewport, elapsed: after.data.elapsed, static: after.data.static, v2Accepted: after.data.v2Accepted, v2Released: after.data.v2Released });
      await nojs.close();
    }
    return results;
  });
  await check('desktop and mobile lifecycle image assets decode completely', async () => {
    const results = [];
    for (const [label, target] of [['desktop', page], ['mobile', mobile]]) {
      const images = await target.locator('[data-lifecycle="b"]').evaluate(async root => {
        return Promise.all([...root.querySelectorAll('image, img')].map(async node => {
          const src = node instanceof SVGImageElement ? node.href.baseVal : node.currentSrc || node.src;
          const image = new Image(); image.src = src;
          try { await image.decode(); return { source: src.startsWith('data:') ? `${src.slice(0, 45)}…` : src, width: image.naturalWidth, height: image.naturalHeight }; }
          catch (error) { return { source: src.slice(0, 100), error: String(error) }; }
        }));
      });
      assert(images.length > 0, `${label} must include actual brand/person artwork`);
      for (const image of images) { assert.equal(image.error, undefined, `${label} image must decode: ${image.source}`); assert(image.width > 0 && image.height > 0); }
      results.push({ page: label, images });
    }
    return results;
  });
  await check('mount/dispose clears owned listeners observer and RAF; idempotent and remountable', async () => {
    const isolated = await newPage();
    const isolation = await require('./lifecycle-isolation.cjs').isolateLifecycle(isolated);
    await isolated.evaluate(async () => {
      const root = document.querySelector('[data-lifecycle="b"]');
      const original = { add: EventTarget.prototype.addEventListener, remove: EventTarget.prototype.removeEventListener, raf: window.requestAnimationFrame, cancel: window.cancelAnimationFrame, IO: window.IntersectionObserver };
      const active = []; const pending = new Set(); const observers = []; let recording = false;
      EventTarget.prototype.addEventListener = function(type, callback, options) { if (recording) active.push({ target: this, type, callback }); return original.add.call(this, type, callback, options); };
      EventTarget.prototype.removeEventListener = function(type, callback, options) { const index = active.findIndex(item => item.target === this && item.type === type && item.callback === callback); if (index >= 0) active.splice(index, 1); return original.remove.call(this, type, callback, options); };
      window.requestAnimationFrame = callback => { let id; id = original.raf.call(window, time => { pending.delete(id); callback(time); }); pending.add(id); return id; };
      window.cancelAnimationFrame = id => { pending.delete(id); return original.cancel.call(window, id); };
      window.IntersectionObserver = class extends original.IO { constructor(...args) { super(...args); this.disconnected = false; observers.push(this); } disconnect() { this.disconnected = true; return super.disconnect(); } };
      const { mountLifecycle } = await import('./lifecycle.js');
      const trackedMount = () => { recording = true; try { return mountLifecycle({ current: root }, 'zh'); } finally { recording = false; } };
      window.__audit = { root, active, pending, observers, mount: trackedMount, dispose: trackedMount() };
    });
    const initiallyOffscreen = await initialOffscreen(isolated);
    await ready(isolated); await isolated.clock.runFor(1000);
    const mounted = await isolated.evaluate(() => ({ listeners: __audit.active.map(item => item.type), pending: __audit.pending.size, observers: __audit.observers.length }));
    assert.equal(mounted.listeners.length, 8); assert.equal(mounted.pending, 1); assert.equal(mounted.observers, 1);
    const disposed = await isolated.evaluate(() => { __audit.dispose(); __audit.dispose(); return { listeners: __audit.active.length, pending: __audit.pending.size, disconnected: __audit.observers.every(item => item.disconnected), elapsed: __audit.root.dataset.elapsed }; });
    assert.equal(disposed.listeners, 0); assert.equal(disposed.pending, 0); assert.equal(disposed.disconnected, true);
    await isolated.clock.runFor(2000); assert.equal((await snapshot(isolated)).data.elapsed, disposed.elapsed);
    await isolated.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await delay(150);
    await isolated.evaluate(() => { __audit.dispose = __audit.mount(); });
    const remountOffscreen = await initialOffscreen(isolated);
    await ready(isolated); await isolated.clock.runFor(1000); const remounted = await snapshot(isolated); assert(Number(remounted.data.elapsed) > .9);
    const final = await isolated.evaluate(() => { __audit.dispose(); return { listeners: __audit.active.length, pending: __audit.pending.size, disconnected: __audit.observers.every(item => item.disconnected) }; });
    assert.deepEqual(final, { listeners: 0, pending: 0, disconnected: true });
    await isolated.close();
    return { isolation, initiallyOffscreen, mounted, disposed, remountOffscreen, remountedElapsed: remounted.data.elapsed, final };
  });
  await check('no browser errors or external action requests', async () => {
    assert.deepEqual(report.errors, []);
    assert.deepEqual(report.failedRequests, [], 'No resource transfer failures');
    assert.deepEqual(report.failedResponses, [], 'No HTTP failures');
    const nonlocal = report.requests.filter(request => new URL(request.url).origin !== new URL(url).origin);
    const mutations = report.requests.filter(request => !['GET', 'HEAD'].includes(request.method));
    assert.deepEqual(nonlocal, []); assert.deepEqual(mutations, []);
    return { observedRequests: report.requests.length, failedRequests: report.failedRequests.length, failedResponses: report.failedResponses.length, nonlocalRequests: nonlocal.length, mutationRequests: mutations.length, errors: report.errors.length };
  });
})().catch(error => { report.errors.push({ type: 'fatal', text: error.stack }); }).finally(async () => {
  if (browser) await browser.close();
  report.finishedAt = new Date().toISOString();
  report.passed = report.checks.filter(check => check.pass).length;
  report.failed = report.checks.filter(check => !check.pass).length;
  report.pass = report.failed === 0 && report.errors.length === 0 && report.failedRequests.length === 0 && report.failedResponses.length === 0;
  report.limitations = ['Chromium desktop and emulated 390px mobile only; not physical mobile hardware.', 'Elapsed timeline is accelerated with Playwright runFor executing RAF callbacks; wall-clock 92-second timing is not claimed.', 'Keyboard and viewport/reduced-motion are browser-driven; document hidden and persisted page transitions use synthetic events, not real background tabs or BFCache navigation.', 'Cleanup additionally uses isolated mountLifecycle with instrumented browser APIs.', 'No product UI/layout/link integration audit; resource failures are monitored, and no model calls or business actions are invoked.'];
  fs.writeFileSync(path.join(evidence, 'results.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ pass: report.pass, passed: report.passed, failed: report.failed, errors: report.errors, failedRequests: report.failedRequests, failedResponses: report.failedResponses, failedChecks: report.checks.filter(check => !check.pass), timeline: report.timeline, evidence }, null, 2));
  process.exitCode = report.pass ? 0 : 1;
});
