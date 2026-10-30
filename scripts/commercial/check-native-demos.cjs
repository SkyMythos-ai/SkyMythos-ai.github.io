const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const portable = require('./browser.cjs');
portable.trackIdentity('native-demos');

const url = portable.url;
const directory = portable.evidence;
assert(!process.argv.includes('--red-only'), 'The retired red-only playback mode is no longer supported');
const names = ['delivery', 'methods', 'management'];
const scenePaths = { delivery: 'product/work-delivery/', methods: 'product/methods/', management: 'product/governance/' };
const rows = [];
const screenshots = [];
const diagnostics = [];
const clockStart = new Date('2026-10-23T12:00:00Z');
const runId = `projection-${Date.now()}`;
let manifest;
let startIdentity;
let endIdentity;
let assertions = 0;
let browser;
function check(value, message) { assertions += 1; assert(value, message); }
function equal(value, expected, message) { assertions += 1; assert.deepEqual(value, expected, message); }

// 本专项只验证官网播放、只读与回退合同；产品结构、样式、来源闭包由独立保真专项验收。
function sceneReference(name) {
  const scene = manifest.scenes[name];
  check(scene?.frames?.start && scene.frames.middle && scene.frames.result, `${name}: captured start, intermediate and terminal snapshots are required`);
  check(scene.frames.result.id === scene.terminal, `${name}: captured terminal snapshot exists`);
  return scene;
}
function identity(name, frame) { return frame.id; }

const buildIdentity = portable.buildIdentity;

async function runCase(label, options, body) {
  const { clock = false, ...contextOptions } = options;
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'no-preference', ...contextOptions });
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  page.setDefaultNavigationTimeout(25000);
  const issues = [];
  const requests = [];
  page.on('pageerror', error => issues.push(error.message));
  page.on('requestfailed', request => { if (!require('./transport.cjs').recordExpectedFailure(request)) issues.push(`${request.failure()?.errorText}: ${request.url()}`); });
  page.on('console', message => { if (message.type() === 'error' || (message.type() === 'warning' && /hydrat|mismatch/i.test(message.text()))) issues.push(message.text()); });
  page.on('request', request => requests.push({ method: request.method(), url: request.url(), type: request.resourceType(), headers: request.headers() }));
  page.on('response', response => { if (response.status() >= 400) issues.push(`HTTP ${response.status()} ${response.url()}`); });
  const start = assertions;
  try {
    const policy = await installSideEffectAudit(page);
    if (clock) {
      await page.clock.install({ time: clockStart });
      await page.clock.pauseAt(new Date(clockStart.getTime() + 60_000));
    }
    await page.goto(url, { waitUntil: 'load' });
    if (clock) await tick(page, 100);
    await body(page, context);
    equal(issues, [], `${label}: no browser/resource errors`);
    equal(requests.filter(request => !['GET', 'HEAD'].includes(request.method)), [], `${label}: no network writes`);
    equal(requests.filter(request => new URL(request.url).origin !== new URL(url).origin), [], `${label}: all requests stay on the tested static origin`);
    equal(requests.filter(request => !allowedRequest(request, policy)), [], `${label}: no business transport requests`);
    equal(requests.filter(request => /\/(?:api|oauth|auth|credentials?)(?:\/|\?|$)/i.test(new URL(request.url).pathname)), [], `${label}: no model, credential, or authorization endpoints`);
    equal((await page.evaluate(() => window.__nativeDemoEffects || [])).filter(effect => !(['storage.getItem', 'storage.setItem'].includes(effect.type) && effect.value === 'skymythos-theme')), [], `${label}: only declared static/RSC reads, no XHR/WS, credentials, cookies or persistence access`);
    equal(await context.cookies(), [], `${label}: no cookies`);
    rows.push({ label, status: 'passed', assertions: assertions - start });
    console.log(`PASS ${label}`);
  } catch (error) {
    rows.push({ label, status: 'failed', assertions: assertions - start, message: error.message, stack: error.stack });
    diagnostics.push({ label, issues, state: await page.evaluate(() => ({
      scrollY, width: innerWidth, height: innerHeight,
      mode: document.querySelector('#product')?.dataset.capabilityMode,
      current: document.querySelector('#product')?.dataset.capabilityCurrent,
      focus: document.activeElement?.outerHTML?.slice(0, 300),
      scenes: [...document.querySelectorAll('[data-native-demo]')].map(node => ({
        name: node.dataset.nativeDemo, elapsed: node.dataset.elapsed, running: node.dataset.running, phase: node.dataset.phase,
        frame: node.dataset.referenceFrame,
        text: node.shadowRoot?.querySelector('[data-product-frame]:not([hidden])')?.innerText,
      })),
    })).catch(error => ({ unavailable: error.message })) });
    process.exitCode = 1;
    console.error(`FAIL ${label}: ${error.message}`);
  } finally {
    await context.close();
  }
}

const { installSideEffectAudit, allowedRequest } = require('./side-effect-audit.cjs');

// Playwright.clock 驱动页面真实RAF；宿主短等待只交付布局/IntersectionObserver，不代替演示时间。
async function tick(page, milliseconds) {
  await page.clock.runFor(milliseconds);
  await page.evaluate(() => document.documentElement.offsetHeight);
  await new Promise(resolve => setTimeout(resolve, 35));
  await page.clock.runFor(34);
}

async function ui(page, name) {
  return page.locator(`[data-native-demo="${name}"]`).evaluate(root => {
    const shadow = root.shadowRoot;
    const active = [...(shadow?.querySelectorAll('[data-product-frame]') || [])].filter(node => !node.hidden);
    const snapshot = active[0];
    const product = snapshot?.querySelector('.product-reference-root');
    const box = root.getBoundingClientRect();
    const controls = [...(snapshot?.querySelectorAll('input,textarea,select,button,a[href],[contenteditable="true"]') || [])];
    return {
      text: snapshot?.innerText || '',
      signature: JSON.stringify([snapshot?.dataset.productFrame, snapshot?.innerText]),
      referenceFrame: root.dataset.referenceFrame,
      terminal: root.dataset.referenceTerminal,
      snapshotFrame: snapshot?.dataset.productFrame,
      snapshotPhase: snapshot?.dataset.phase,
      label: snapshot?.dataset.label,
      activeCount: active.length,
      frameIds: [...(shadow?.querySelectorAll('[data-product-frame]') || [])].map(node => node.dataset.productFrame),
      productInert: Boolean(product?.inert),
      role: root.getAttribute('role'), tabindex: root.tabIndex, accessibleName: root.getAttribute('aria-label'),
      caption: root.closest('figure')?.querySelector('figcaption')?.innerText || '',
      elapsed: Number(root.dataset.elapsed), running: root.dataset.running,
      phase: root.dataset.phase, complete: root.dataset.complete, mode: root.dataset.mode,
      width: box.width, height: box.height,
      controls: controls.filter(node => !node.closest('[inert]') && !node.disabled && !node.readOnly).map(node => ({ tag: node.tagName, text: node.innerText, type: node.type })),
      secretValues: controls.filter(node => node.matches('input[type="password"],input[autocomplete*="password"],input[name*="token" i],input[name*="secret" i],input[name*="credential" i]') && node.value).map(node => node.type),
    };
  });
}

function honest(row, name) {
  check(!/已接受交付|已自动发布|发布成功|员工创建成功|员工已创建|方法已采用|自动确认方案|全入口硬预算|免费使用/.test(row.text), `${name}: no invented approval, publication, adoption, billing or hard-budget claim`);
  check(!/(?:gh[pousr]_[A-Za-z0-9]{12,}|sk-[A-Za-z0-9]{16,}|Bearer\s+[A-Za-z0-9._-]{16,})/.test(row.text), `${name}: no plaintext credential is rendered`);
  check(row.productInert, `${name}: product controls remain under their inert exported root`);
  equal(row.controls, [], `${name}: product controls cannot submit, authorize, edit credentials or navigate`);
  equal(row.secretValues, [], `${name}: password inputs stay empty`);
  equal(row.frameIds.length, 3, `${name}: all three validated frames are embedded`);
  equal(row.activeCount, 1, `${name}: exactly one snapshot is active`);
  equal(row.referenceFrame, row.snapshotFrame, `${name}: visible Shadow snapshot agrees with host frame diagnostic`);
  equal(row.phase, row.snapshotPhase, `${name}: phase describes the actual displayed product snapshot`);
  equal(row.role, 'img', `${name}: readonly projection has image semantics, not fake application semantics`);
  equal(row.tabindex, 0, `${name}: static projection is a keyboard reading target`);
  check(/示例/.test(row.accessibleName) && /只读/.test(row.accessibleName), `${name}: accessible name states the local example and readonly boundary`);
  check(/示例/.test(row.accessibleName), `${name}: accessible name identifies example data`);
}

async function nativePresentations(page, sceneName) {
  const result = await page.evaluate(() => ({
    names: [...document.querySelectorAll('[data-native-demo]')].map(node => node.dataset.nativeDemo),
    screenshotPresentations: document.querySelectorAll('.product-capture-player img').length,
    shadowRoots: [...document.querySelectorAll('[data-native-demo]')].map(node => Boolean(node.shadowRoot)),
  }));
  diagnostics.push({ phase: 'native-presentations', ...result });
  equal(result.names, [sceneName], 'Exactly three native HTML projection viewports replace screenshot presentations');
  equal(result.screenshotPresentations, 0, 'Product projection is DOM/SVG, not a screenshot in a native wrapper');
  equal(result.shadowRoots, [true], 'All native regions have declarative or live Shadow DOM');
  for (const name of [sceneName]) {
    const row = await ui(page, name);
    check(row.text.trim().length > 90, `${name}: substantial readable product DOM, not an empty canvas`);
    honest(row, name);
  }
}

async function staticStates(page, sceneName) {
  for (const name of [sceneName]) {
    const player = page.locator(`.product-capture-player[data-player="${name}"]`);
    if (await player.locator('button[aria-pressed]').nth(2).isVisible()) await player.locator('button[aria-pressed]').nth(2).click();
    const row = await ui(page, name);
    const scene = sceneReference(name);
    equal(row.snapshotFrame, identity(name, scene.frames.result), `${name}: static fallback displays the captured terminal snapshot`);
    equal(row.referenceFrame, row.terminal, `${name}: static terminal agrees with visible snapshot`);
    check(row.text.trim().length > 90, `${name}: static terminal contains real readable product DOM`);
    check(row.running !== 'true', `${name}: static fallback does not run a timeline`);
    honest(row, name);
    if (name === 'delivery') check(/人工.*验收|人工.*审阅/.test(row.accessibleName), 'Static delivery preserves the human acceptance boundary');
    if (name === 'methods') check(/等待.*确认/.test(row.accessibleName) && /尚未创建/.test(row.accessibleName), 'Static methods waits for human confirmation, not employee creation');
    if (name === 'management') check(/不.*凭据|不.*授权/.test(row.accessibleName), 'Static connections never submits credentials or authorizes');
  }
}

async function main() {
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(portable.referenceRoot, 'manifest.json'), 'utf8'));
    startIdentity = buildIdentity();
    browser = await portable.launch();
    for (const [label, options] of [['static', {}], ['no-JS', { javaScriptEnabled: false }], ['reduced', { reducedMotion: 'reduce' }]]) {
      await runCase(label, options, async (page, context) => {
        for (const name of names) {
          await page.goto(new URL(scenePaths[name], url).href, { waitUntil: 'load' });
          await nativePresentations(page, name);
          await staticStates(page, name);
          const link = page.locator(`a[href$="${manifest.images[name].path}"]`).first();
          const expected = new URL(portable.referencePath + manifest.images[name].path, url).href;
          equal(new URL(await link.getAttribute('href'), url).href, expected, `${name}: original source`);
          const response = await context.request.get(expected);
          equal(response.status(), 200, `${name}: original available`);
          equal((await response.body()).subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${name}: PNG signature`);
        }
      });
    }
    await runCase('captured playback readonly audit', { clock: true }, async page => {
      for (const name of names) {
        await page.goto(new URL(scenePaths[name], url).href, { waitUntil: 'load' });
        const player = page.locator(`.product-capture-player[data-player="${name}"]`);
        await player.scrollIntoViewIfNeeded();
        await page.waitForFunction(name => document.querySelector(`.product-capture-player[data-player="${name}"]`)?.dataset.ready === 'true', name);
        for (const [index, phase] of ['start', 'middle', 'result'].entries()) {
          await player.locator('button[aria-pressed]').nth(index).click();
          const row = await ui(page, name);
          equal(row.snapshotFrame, sceneReference(name).frames[phase].id, `${name}: actual captured ${phase} frame`);
          honest(row, name);
        }
        await player.getByRole('button', { name: '重播', exact: true }).click();
        await tick(page, 100);
        honest(await ui(page, name), name);
        await tick(page, 8300);
        const row = await ui(page, name);
        equal(row.snapshotFrame, sceneReference(name).frames.result.id, `${name}: readonly playback reaches actual terminal`);
        equal(row.running, 'false', `${name}: terminal timeline stops`);
        honest(row, name);
      }
    });
    endIdentity = buildIdentity();
    equal(endIdentity, startIdentity, 'Test inputs and generated artifacts do not drift during this run');
  } catch (error) {
    rows.push({ label: 'runner', status: 'failed', message: error.message, stack: error.stack });
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    const report = { url, runId, startIdentity, endIdentity, scope: 'Website static readonly projection, side-effect boundary and fallback; not external product fidelity or business E2E', mode: 'full', generatedAt: new Date().toISOString(), assertions, rows, diagnostics, screenshots };
    fs.writeFileSync(path.join(directory, 'native-demos.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(`${assertions} assertions; ${rows.filter(row => row.status === 'failed').length} failed case(s)`);
  }
}
main();
