const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const portable = require('../../scripts/commercial/browser.cjs');
const { PNG } = require('pngjs');

const root = path.resolve(__dirname, '../..');
const fixtureRoot = path.join(root, 'tests/fixtures/product-reference');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/zh/';
const evidence = process.env.EVIDENCE_DIR
  ? path.resolve(process.env.EVIDENCE_DIR, 'fidelity', `run-${Date.now()}`)
  : fs.mkdtempSync(path.join(os.tmpdir(), 'skymythos-fidelity-'));
fs.mkdirSync(evidence, { recursive: true });
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const manifestBytes = fs.readFileSync(path.join(fixtureRoot, 'manifest.json'));
const fixture = JSON.parse(manifestBytes);
const css = fs.readFileSync(path.join(fixtureRoot, fixture.css), 'utf8');
const scenes = ['delivery', 'methods', 'management'];
const scenePaths = { delivery: 'product/work-delivery/', methods: 'product/methods/', management: 'product/governance/' };
const styles = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'color', 'backgroundColor', 'borderTopWidth', 'visibility', 'display'];
const rows = [];
const sourceHashes = () => Object.fromEntries([
  'tests/product-fidelity/check.cjs',
  'scripts/commercial/browser.cjs',
  'scripts/commercial/browser-version.json',
  'tests/fixtures/product-reference/manifest.json',
  'src/components/commercial/product-demo.tsx',
  'src/components/commercial/product-capture-player.tsx',
  'src/styles/product-capture-player.css',
  'src/lib/product-reference.ts',
  'out/zh/index.html',
].filter(file => fs.existsSync(path.join(root, file))).map(file => [file, sha(fs.readFileSync(path.join(root, file)))]));
const startIdentity = sourceHashes();
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');

for (const [file, expected] of Object.entries(fixture.files)) {
  assert.equal(sha(fs.readFileSync(path.join(fixtureRoot, file))), expected, `Independent fixture drift: ${file}`);
}

async function measure(frame, source, selectors) {
  return frame.evaluate(({ source, selectors, styles }) => {
    const host = source ? null : document.querySelector(`[data-native-demo="${selectors.scene}"]`);
    const active = host?.shadowRoot?.querySelector('[data-product-frame]:not([hidden])');
    const element = source ? document.querySelector('.product-reference-root') : active?.querySelector('.product-reference-root');
    if (!element) throw new Error('Missing real product root');
    const origin = element.getBoundingClientRect();
    const hostBox = host?.getBoundingClientRect();
    let willChangeTransform = false;
    for (let ancestor = host; ancestor; ancestor = ancestor.parentElement) {
      if (getComputedStyle(ancestor).willChange.split(',').some(value => value.trim() === 'transform')) {
        willChangeTransform = true;
        break;
      }
    }
    let occlusion = Math.max(hostBox ? hostBox.top + 2 : 0, origin.top, 0);
    const overlays = [...document.querySelectorAll('header,nav')].filter(node => !node.contains(host)).map(node => node.getBoundingClientRect()).filter(box => box.width > 0 && box.height > 0 && (!hostBox || box.left < hostBox.right && box.right > hostBox.left));
    for (let index = 0; index <= overlays.length; index++) {
      const covering = overlays.filter(box => box.top <= occlusion && box.bottom > occlusion);
      if (!covering.length) break;
      occlusion = Math.max(occlusion, ...covering.map(box => box.bottom));
    }
    const landmarks = selectors.landmarks.map(({ selector }) => {
      const node = element.querySelector(selector);
      if (!node) return { selector, missing: true };
      const box = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        selector, text: node.textContent.replace(/\s+/g, ' ').trim(),
        rect: { x: box.x - origin.x, y: box.y - origin.y, width: box.width, height: box.height },
        styles: Object.fromEntries(styles.map(key => [key, style[key]])),
      };
    });
    const counts = {};
    for (const node of element.querySelectorAll('*')) counts[node.tagName] = (counts[node.tagName] || 0) + 1;
    const box = host?.getBoundingClientRect();
    const scroller = host?.closest('.pc-scroll');
    const clipBox = scroller?.getBoundingClientRect();
    const clip = clipBox ? { x: clipBox.left + scroller.clientLeft, y: clipBox.top + scroller.clientTop, right: clipBox.left + scroller.clientLeft + scroller.clientWidth, bottom: clipBox.top + scroller.clientTop + scroller.clientHeight } : null;
    const header = document.querySelector('.site-header')?.getBoundingClientRect();
    return {
      landmarks, counts, text: element.textContent.replace(/\s+/g, ' ').trim(),
      root: { x: origin.x, y: origin.y, width: origin.width, height: origin.height },
      clip,
      host: box ? { x: box.x, y: box.y, right: box.right, bottom: box.bottom } : null,
      viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
      scroll: { x: scrollX, y: scrollY },
      paint: { willChangeTransform },
      headerBottom: Math.max(header?.bottom || 0, occlusion),
      active: active?.dataset.productFrame,
      inert: element.inert,
      secrets: [...element.querySelectorAll('input[type="password"]')].map(node => node.value),
    };
  }, { source, selectors, styles });
}

function differences(actual, expected) {
  const errors = [];
  if (actual.text !== expected.text) errors.push('Real product text differs');
  if (JSON.stringify(actual.counts) !== JSON.stringify(expected.counts)) errors.push('Real product element structure differs');
  for (let index = 0; index < expected.landmarks.length; index++) {
    const want = expected.landmarks[index];
    const got = actual.landmarks[index];
    if (want.missing || got?.missing || !got) { errors.push(`Missing landmark ${want.selector}`); continue; }
    if (got.text !== want.text) errors.push(`Landmark text: ${want.selector}`);
    for (const key of Object.keys(want.rect)) {
      if (Math.abs(got.rect[key] - want.rect[key]) > .05) errors.push(`Geometry ${key}: ${want.selector} ${got.rect[key]} != ${want.rect[key]}`);
    }
    for (const [key, value] of Object.entries(want.styles)) {
      if (got.styles[key] !== value) errors.push(`Style ${key}: ${want.selector} ${got.styles[key]} != ${value}`);
    }
  }
  if (!actual.inert || actual.secrets.some(Boolean)) errors.push('Product is not readonly / contains a password');
  return errors;
}

function crop(buffer, box) {
  const image = PNG.sync.read(buffer);
  assert(box.x >= 0 && box.y >= 0 && box.width > 0 && box.height > 0 && box.x + box.width <= image.width && box.y + box.height <= image.height, `Invalid deterministic crop ${JSON.stringify({ box, image: { width: image.width, height: image.height } })}`);
  const target = new PNG({ width: box.width, height: box.height });
  PNG.bitblt(image, target, box.x, box.y, box.width, box.height, 0, 0);
  return target;
}

// The independent replay uses unadapted original CSS and a fixed desktop
// viewport. Only its OUTER iframe moves; the product's body never moves.
async function reference(browser, name, id, dpr, viewport) {
  const scene = fixture.scenes[name];
  const frame = scene.frames.find(frame => frame.id === id);
  assert(frame, `Unknown independent frame ${name}/${id}`);
  const html = fs.readFileSync(path.join(fixtureRoot, frame.html), 'utf8');
  const document = `<!doctype html><html lang="zh-CN" data-theme="light" data-density="compact"><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
  const context = await browser.newContext({ viewport, deviceScaleFactor: dpr, javaScriptEnabled: false, colorScheme: 'light', serviceWorkers: 'block' });
  const unexpected = [];
  await context.route('**/*', route => { unexpected.push(route.request().url()); return route.abort(); });
  const page = await context.newPage();
  await page.setContent(`<!doctype html><html><body style="margin:0"><iframe title="independent product reference" sandbox="allow-same-origin" width="${scene.width}" height="${scene.height}" style="display:block;border:0" srcdoc="${escape(document)}"></iframe></body></html>`);
  const app = page.frames().find(frame => frame !== page.mainFrame());
  assert(app, 'Independent reference iframe exists');
  await app.waitForSelector('.product-reference-root', { state: 'attached' });
  await app.evaluate(() => document.fonts.ready);
  await page.screenshot({ animations: 'disabled' });
  const selectors = { scene: name, landmarks: frame.landmarks };
  const measured = await measure(app, true, selectors);
  assert.equal(measured.viewport.width, scene.width);
  assert.equal(measured.viewport.height, scene.height);
  assert.deepEqual(unexpected, [], 'Independent frozen reference makes no network requests');
  return { context, page, app, selectors, measured };
}

async function compare(page, name, id, label, pixelmatch) {
  const expected = await reference(page.context().browser(), name, id, 1.5, page.viewportSize());
  try {
    const viewportBytes = await page.screenshot({ animations: 'disabled' });
    const actual = await measure(page, false, expected.selectors);
    const errors = differences(actual, expected.measured);
    assert.equal(actual.active, `${name}-${id}`, 'Visible state agrees with the requested independent product frame');
    assert.equal(actual.viewport.dpr, 1.5);
    const dpr = actual.viewport.dpr;
    const world = { x: actual.root.x + actual.scroll.x, y: actual.root.y + actual.scroll.y };
    // Reproduce the complete outer document coordinate AND scroll, rather
    // than guessing a fractional phase. The inner product viewport/body stays
    // untouched. Both full-viewport screenshots now use identical clip pixels.
    await expected.page.evaluate(({ world, scroll, height, paint }) => {
      const iframe = document.querySelector('iframe');
      document.body.style.cssText = `margin:0;overflow-x:hidden;min-height:${Math.max(world.y + iframe.offsetHeight, scroll.y + height + 100)}px`;
      iframe.style.position = 'absolute';
      iframe.style.left = `${world.x}px`;
      iframe.style.top = `${world.y}px`;
      iframe.style.transform = 'translate3d(0,0,0)';
      // Chromium 会因祖先的 transform 预告禁用 LCD 字体抗锯齿；只同步外层合成条件，保持原产品内部不变。
      iframe.style.willChange = paint.willChangeTransform ? 'transform' : 'auto';
      scrollTo({ left: scroll.x, top: scroll.y, behavior: 'instant' });
    }, { world, scroll: actual.scroll, height: actual.viewport.height, paint: actual.paint });
    const referenceBox = await expected.page.locator('iframe').boundingBox();
    assert(Math.abs(referenceBox.x - actual.root.x) < .002 && Math.abs(referenceBox.y - actual.root.y) < .002, 'Independent outer camera matches the actual product root exactly');
    const referenceBytes = await expected.page.screenshot({ animations: 'disabled' });
    const afterCamera = await measure(expected.app, true, expected.selectors);
    assert.deepEqual(afterCamera, expected.measured, 'Outer camera must not alter source internal geometry, styles, or viewport');
    const left = Math.ceil(Math.max(actual.host.x + 2, actual.clip?.x + 2 || 0, 0) * dpr);
    const top = Math.ceil(Math.max(actual.host.y + 2, actual.clip?.y + 2 || 0, actual.headerBottom + 2, 0) * dpr);
    const right = Math.floor(Math.min(actual.host.right - 2, actual.clip?.right - 2 || Infinity, actual.root.x + actual.root.width, actual.viewport.width) * dpr);
    const bottom = Math.floor(Math.min(actual.host.bottom - 2, actual.clip?.bottom - 2 || Infinity, actual.root.y + actual.root.height, actual.viewport.height) * dpr);
    const actualCrop = { x: left, y: top, width: right - left, height: bottom - top };
    assert(actualCrop.width > 100 && actualCrop.height > 50, 'Meaningful unobscured native product area is visible');
    const sourceCrop = { ...actualCrop };
    const observed = crop(viewportBytes, actualCrop);
    const original = crop(referenceBytes, sourceCrop);
    const diff = new PNG({ width: observed.width, height: observed.height });
    const pixels = pixelmatch(observed.data, original.data, diff.data, observed.width, observed.height, { threshold: .1, includeAA: false });
    const ratio = pixels / (observed.width * observed.height);
    fs.writeFileSync(path.join(evidence, `${label}-actual.png`), PNG.sync.write(observed));
    fs.writeFileSync(path.join(evidence, `${label}-reference.png`), PNG.sync.write(original));
    fs.writeFileSync(path.join(evidence, `${label}-diff.png`), PNG.sync.write(diff));
    if (ratio > .005) errors.push(`Pixel difference ${ratio} exceeds unchanged 0.5% threshold`);
    const row = { label, scene: name, frame: id, pass: errors.length === 0, errors, ratio, maximumRatio: .005, camera: { world, scroll: actual.scroll, paint: actual.paint, referenceBox }, actualCrop, sourceCrop, comparedLandmarks: actual.landmarks.length, sourceCameraPreserved: true };
    rows.push(row);
    console.log(`${row.pass ? 'PASS' : 'FAIL'} ${label}: ${pixels} pixels (${(ratio * 100).toFixed(4)}%) / ${actual.landmarks.length} landmarks`);
    return { actual, expected: expected.measured, selectors: expected.selectors };
  } finally { await expected.context.close(); }
}

async function reveal(page, name) {
  const host = page.locator(`[data-native-demo="${name}"]`);
  await host.scrollIntoViewIfNeeded();
  await host.evaluate(node => {
    const top = scrollY + node.getBoundingClientRect().top - 100;
    scrollTo({ top: Math.round(top * devicePixelRatio) / devicePixelRatio, behavior: 'instant' });
  });
  await page.evaluate(() => document.fonts.ready);
}

async function staticCase(browser, viewport, javaScriptEnabled, pixelmatch, mutations = false) {
  const context = await browser.newContext({ viewport, javaScriptEnabled, reducedMotion: 'reduce', deviceScaleFactor: 1.5, colorScheme: 'light', serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const label = `${javaScriptEnabled ? 'reduced' : 'nojs'}-${viewport.width}`;
  try {
    for (const name of scenes) {
      const response = await page.goto(new URL(scenePaths[name], base).href, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      await reveal(page, name);
      const result = await compare(page, name, 'result', `${label}-${name}`, pixelmatch);
      if (mutations && name === 'methods') {
        const host = page.locator('[data-native-demo="methods"]');
        for (const mutation of ['hide-confirmation', 'wrong-font']) {
          const restore = await host.evaluate((host, mutation) => {
            const element = mutation === 'wrong-font' ? host.shadowRoot.querySelector('[data-product-frame]:not([hidden]) h1') : [...host.shadowRoot.querySelectorAll('[data-product-frame]:not([hidden]) button')].find(node => /确认.*创建员工/.test(node.textContent));
            if (!element) throw new Error(`Missing genuine mutation target ${mutation}`);
            const previous = element.getAttribute('style');
            element.setAttribute('data-fidelity-mutated', '');
            if (mutation === 'wrong-font') element.style.fontSize = '27px'; else element.style.visibility = 'hidden';
            return previous;
          }, mutation);
          const changed = await measure(page, false, result.selectors);
          const rejected = differences(changed, result.expected);
          assert(rejected.length > 0, `${mutation} must fail actual visual/semantic comparisons`);
          rows.push({ label: `${mutation}-negative-control`, pass: true, rejected: true, errorsDetected: rejected });
          await host.evaluate((host, previous) => {
            const element = host.shadowRoot.querySelector('[data-fidelity-mutated]');
            if (previous === null) element.removeAttribute('style'); else element.setAttribute('style', previous);
            element.removeAttribute('data-fidelity-mutated');
          }, restore);
        }
      }
    }
    assert.deepEqual(errors, [], 'No browser or hydration errors');
  } catch (error) {
    rows.push({ label, pass: false, errors: [error.stack], browserErrors: errors });
    console.error(`FAIL ${label}: ${error.message}`);
  } finally { await context.close(); }
}


async function capturedStages(browser, pixelmatch) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', deviceScaleFactor: 1.5, colorScheme: 'light', serviceWorkers: 'block' });
  const page = await context.newPage();
  try {
    for (const name of scenes) {
      await page.goto(new URL(scenePaths[name], base).href, { waitUntil: 'networkidle' });
      assert.equal(fixture.scenes[name].frames.length, 3, `${name}: independent fixture contains three frames`);
      const player = page.locator(`.product-capture-player[data-player="${name}"]`);
      for (const [index, phase] of ['start', 'middle'].entries()) {
        await player.locator('button[aria-pressed]').nth(index).click();
        await reveal(page, name);
        assert.equal(await player.getAttribute('data-player-stage'), phase);
        await compare(page, name, phase, `captured-${name}-${phase}`, pixelmatch);
      }
    }
  } catch (error) {
    rows.push({ label: 'captured-start-middle', pass: false, errors: [error.stack] });
  } finally { await context.close(); }
}

(async () => {
  const { default: pixelmatch } = await import('pixelmatch');
  const browser = await portable.launch();
  try {
    const viewports = [{ width: 1024, height: 900 }, { width: 1440, height: 1000 }, { width: 1920, height: 1080 }, { width: 390, height: 844 }, { width: 320, height: 568 }];
    const selected = process.env.FIDELITY_WIDTHS ? process.env.FIDELITY_WIDTHS.split(',').map(Number) : viewports.map(viewport => viewport.width);
    assert(selected.length && selected.every(width => viewports.some(viewport => viewport.width === width)), 'Unknown fidelity viewport');
    for (const viewport of viewports.filter(viewport => selected.includes(viewport.width))) {
      await staticCase(browser, viewport, false, pixelmatch);
    }
    await staticCase(browser, { width: 1440, height: 1000 }, true, pixelmatch, true);
    await capturedStages(browser, pixelmatch);

  } finally { await browser.close(); }
  const endIdentity = sourceHashes();
  try {
    assert.deepEqual(endIdentity, startIdentity, 'Consumer and checks remain unchanged during the run');
  } catch (error) {
    rows.push({ label: 'immutable-consumer-identity', pass: false, errors: [error.message] });
  }
  const report = {
    generatedAt: new Date().toISOString(), url: base, fixtureRevision: fixture.revision,
    selection: process.env.FIDELITY_WIDTHS || 'full-static-and-animated-matrix',
    fixtureManifestSha256: sha(manifestBytes), startIdentity, endIdentity,
    scope: 'Actual exported website versus independent frozen real-component DOM with original unadapted CSS in a fixed-size browser iframe. Includes no-JS/reduced terminals and actual consumer start/middle/result states advanced through browser RAF. Not live product/business E2E. Timing, pause and failure contracts are checked separately by native playback regression.',
    cameraRule: 'Outer reference iframe placed at actual product document coordinates; same outer viewport, DPR, scroll and crop pixels. Inner fixed viewport/body/geometry unchanged. No phase guess or offset search.',
    rows, passed: rows.filter(row => row.pass).length, failed: rows.filter(row => !row.pass).length,
  };
  fs.writeFileSync(path.join(evidence, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ evidence, passed: report.passed, failed: report.failed }));
  if (report.failed || !report.rows.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
