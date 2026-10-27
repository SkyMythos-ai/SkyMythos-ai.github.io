const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const portable = require('./browser.cjs');
portable.trackIdentity('native-demos');

const url = portable.url;
const directory = portable.evidence;
const redOnly = process.argv.includes('--red-only');
const names = ['delivery', 'methods', 'management'];
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
    if (contextOptions.javaScriptEnabled !== false) await page.waitForFunction(() => ['ready', 'static'].includes(document.querySelector('#product')?.dataset.demoReadiness), null, { polling: 50 });
    await body(page, context);
    equal(issues, [], `${label}: no browser/resource errors`);
    equal(requests.filter(request => !['GET', 'HEAD'].includes(request.method)), [], `${label}: no network writes`);
    equal(requests.filter(request => new URL(request.url).origin !== new URL(url).origin), [], `${label}: all requests stay on the tested static origin`);
    equal(requests.filter(request => !allowedRequest(request, policy)), [], `${label}: no business transport requests`);
    equal(requests.filter(request => /\/(?:api|oauth|auth|credentials?)(?:\/|\?|$)/i.test(new URL(request.url).pathname)), [], `${label}: no model, credential, or authorization endpoints`);
    equal(await page.evaluate(() => window.__nativeDemoEffects || []), [], `${label}: only declared static/RSC reads, no XHR/WS, credentials, cookies or persistence access`);
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

async function seek(page, index, clock = true, progress = index + .15) {
  const target = await page.evaluate(progress => {
    const root = document.querySelector('#product');
    const stage = root.querySelector('.capability-browser');
    const track = root.querySelector('.capability-track');
    const pinTop = parseFloat(getComputedStyle(stage).top);
    const height = stage.getBoundingClientRect().height;
    const distance = (track.getBoundingClientRect().height - height) / 3;
    if (root.dataset.capabilityMode === 'stage') return track.getBoundingClientRect().top + scrollY - pinTop + distance * progress;
    return root.querySelectorAll('[data-native-demo]')[Math.floor(progress)].getBoundingClientRect().top + scrollY - 100;
  }, progress);
  await page.evaluate(y => {
    document.activeElement?.blur();
    scrollTo({ top: y, behavior: 'instant' });
  }, target);
  if (clock) await tick(page, 150);
  else await page.waitForTimeout(120);
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
  equal(row.activeCount, 1, `${name}: exactly one snapshot is active`);
  equal(row.referenceFrame, row.snapshotFrame, `${name}: visible Shadow snapshot agrees with host frame diagnostic`);
  equal(row.phase, row.snapshotPhase, `${name}: phase describes the actual displayed product snapshot`);
  equal(row.role, 'img', `${name}: readonly projection has image semantics, not fake application semantics`);
  equal(row.tabindex, 0, `${name}: static projection is a keyboard reading target`);
  check(/示例/.test(row.accessibleName) && /只读/.test(row.accessibleName), `${name}: accessible name states the local example and readonly boundary`);
  check(/示例/.test(row.caption) && /非实时/.test(row.caption), `${name}: figure caption states the local example/non-live boundary outside the product DOM`);
}

async function capture(page, label) {
  const file = path.join(directory, `native-${runId}-${label}.png`);
  await page.screenshot({ path: file });
  screenshots.push({ label, file });
}

async function nativePresentations(page) {
  const result = await page.evaluate(() => ({
    names: [...document.querySelectorAll('#product [data-native-demo]')].map(node => node.dataset.nativeDemo),
    screenshotPresentations: document.querySelectorAll('#product .product-panel figure img').length,
    shadowRoots: [...document.querySelectorAll('#product [data-native-demo]')].map(node => Boolean(node.shadowRoot)),
  }));
  diagnostics.push({ phase: 'native-presentations', ...result });
  equal(result.names, names, 'Exactly three native HTML projection viewports replace screenshot presentations');
  equal(result.screenshotPresentations, 0, 'Product projection is DOM/SVG, not a screenshot in a native wrapper');
  equal(result.shadowRoots, [true, true, true], 'All native regions have declarative or live Shadow DOM');
  for (const name of names) {
    const row = await ui(page, name);
    check(row.text.trim().length > 90, `${name}: substantial readable product DOM, not an empty canvas`);
    honest(row, name);
  }
}

async function advanceTo(page, name, seconds) {
  const before = await ui(page, name);
  check(Number.isFinite(before.elapsed), `${name}: elapsed diagnostic is present`);
  check(before.elapsed <= seconds + .12, `${name}: test has not skipped requested ${seconds}s checkpoint`);
  await tick(page, Math.max(0, (seconds - before.elapsed) * 1000));
  const after = await ui(page, name);
  check(after.elapsed >= seconds - .15 && after.elapsed <= seconds + .2, `${name}: real RAF reaches bounded ${seconds}s checkpoint (${after.elapsed})`);
  return after;
}

async function originalLinks(page, context) {
  const links = await page.locator('#product [data-zoom]').evaluateAll(nodes => nodes.map(node => ({ href: node.href, alt: node.dataset.zoomAlt || node.querySelector('img')?.alt || node.getAttribute('aria-label') })));
  for (const name of names) {
    const relative = manifest.images[name].path;
    check(typeof relative === 'string' && relative, `${name}: latest original image is identified by the capture manifest`);
    const expected = new URL(portable.referencePath + relative, url);
    const link = links.find(link => new URL(link.href).pathname === expected.pathname);
    check(link, `${name}: original link uses the current published product image`);
    check(link.alt?.trim(), `${name}: original image retains descriptive text`);
    const response = await context.request.get(link.href, { timeout: 10000 });
    equal(response.status(), 200, `${name}: original PNG is reachable`);
    const bytes = await response.body();
    equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${name}: original image is a PNG`);
    const source = fs.readFileSync(path.join(portable.referenceRoot, relative));
    equal([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], [source.readUInt32BE(16), source.readUInt32BE(20)], `${name}: original PNG preserves its captured dimensions, not historical image dimensions`);
  }
  const stable = await page.locator('.capability-zoom[data-zoom]').evaluateAll(nodes => nodes.filter(node => !node.hidden).map(node => Boolean(node.closest('[data-panel]'))));
  const stageMode = await page.locator('#product').getAttribute('data-capability-mode') === 'stage';
  equal(stable, stageMode ? [false] : [], stageMode ? 'One visible original-image entry remains outside moving native layers' : 'Static reading retains per-panel originals without duplicate stage entry');
}

async function staticStates(page) {
  for (const name of names) {
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

async function readable(page, name) {
  const result = await page.locator(`[data-native-demo="${name}"]`).evaluate(root => {
    const box = root.getBoundingClientRect();
    const shadow = root.shadowRoot;
    const viewport = shadow.querySelector('[data-product-viewport]');
    const canvas = shadow.querySelector('[data-product-canvas]');
    const snapshot = shadow.querySelector('[data-product-frame]:not([hidden])');
    const crop = viewport.getBoundingClientRect();
    const canvasBox = canvas.getBoundingClientRect();
    const clip = root.closest('.capability-stage .capability-window')?.getBoundingClientRect();
    const visible = node => {
      if (node.closest('[hidden]')) return false;
      const value = node.getBoundingClientRect();
      for (let parent = node; parent; parent = parent.parentElement) {
        const style = getComputedStyle(parent);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
      }
      return value.width > 0 && value.height > 0 && value.bottom > crop.top && value.top < crop.bottom && value.right > crop.left && value.left < crop.right;
    };
    const text = [...snapshot.querySelectorAll('*')].filter(node => [...node.childNodes].some(child => child.nodeType === Node.TEXT_NODE && child.textContent.trim()) && visible(node)).map(node => ({ text: node.innerText?.trim(), size: parseFloat(getComputedStyle(node).fontSize) })).filter(node => node.text);
    return {
      viewportWidth: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      clippedByStage: clip ? { top: box.top - clip.top, bottom: box.bottom - clip.bottom, left: box.left - clip.left, right: box.right - clip.right } : null,
      width: box.width, height: box.height, clientWidth: root.clientWidth, scrollWidthInner: root.scrollWidth,
      canvasWidth: canvasBox.width, canvasHeight: canvasBox.height, intrinsicWidth: canvas.offsetWidth, intrinsicHeight: canvas.offsetHeight,
      transform: getComputedStyle(canvas).transform, viewportOverflow: getComputedStyle(viewport).overflow, text,
    };
  });
  equal(result.scrollWidth, result.viewportWidth, `${name}: no document horizontal overflow`);
  check(result.scrollWidthInner <= result.clientWidth + 1, `${name}: crop is contained by its host`);
  if (result.clippedByStage) {
    check(result.clippedByStage.top >= -1.5 && result.clippedByStage.bottom <= 1.5, `${name}: fixed stage contains the declared product crop vertically`);
    check(result.clippedByStage.left >= -1.5 && result.clippedByStage.right <= 1.5, `${name}: fixed stage contains the declared product crop horizontally`);
  }
  equal(result.viewportOverflow, 'hidden', `${name}: mobile shows a continuous clipped product region, not a new scrollport`);
  check(Math.abs(result.canvasWidth - result.intrinsicWidth) < 1 && Math.abs(result.canvasHeight - result.intrinsicHeight) < 1, `${name}: original product canvas is not scaled to fit`);
  check(result.transform === 'none' || /^matrix\(1, 0, 0, 1,/.test(result.transform) || /^matrix3d\(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,/.test(result.transform), `${name}: crop translation never shrinks product type`);
  check(result.text.length >= 2, `${name}: crop contains readable real product text, not an empty mobile placeholder`);
  // 产品原生微标签可为10px；本专项拒绝整体缩字，不强迫真实产品修改其字号设计。
  check(result.text.some(node => node.size >= 11), `${name}: crop retains readable native body text alongside any original micro labels`);
  check(result.text.every(node => Number.isFinite(node.size) && node.size > 0), `${name}: visible product text has a valid computed font size`);
  diagnostics.push({ phase: 'readability', name, ...result });
}

async function snapshotTimeline(page, name, index) {
  const scene = sceneReference(name);
  await page.waitForFunction(() => document.querySelector('#product').dataset.demoReadiness === 'ready', null, { polling: 50 });
  await seek(page, index);
  const y = await page.evaluate(() => scrollY);
  const checkpoints = [
    { seconds: 0, frame: scene.frames.start },
    { seconds: 6, frame: scene.frames.middle },
    { seconds: 12, frame: scene.frames.result },
  ];
  const frames = [];
  for (const checkpoint of checkpoints) {
    const row = checkpoint.seconds === 0 ? await ui(page, name) : await advanceTo(page, name, checkpoint.seconds);
    if (checkpoint.seconds === 0) check(row.elapsed < .5, `${name}: ready/entrance starts from zero, excluding asset-load time`);
    equal(row.snapshotFrame, identity(name, checkpoint.frame), `${name} ${checkpoint.seconds}s: real clock selects the expected captured product snapshot`);
    equal(row.phase, checkpoint.frame.phase || checkpoint.frame.id, `${name} ${checkpoint.seconds}s: phase names the displayed capture`);
    equal(row.label, checkpoint.frame.label, `${name} ${checkpoint.seconds}s: captured state label is preserved`);
    honest(row, name);
    check(Math.abs(await page.evaluate(() => scrollY) - y) < 1, `${name}: local playback changes without page scrolling`);
    if (frames.length) check(row.signature !== frames.at(-1).signature && row.text !== frames.at(-1).text, `${name}: snapshot transition changes real visible product DOM, not only elapsed diagnostics`);
    if (checkpoint.seconds === 0) {
      check(row.referenceFrame !== row.terminal, `${name}: first live snapshot does not flash the SSR terminal`);
      const box = await page.locator(`[data-native-demo="${name}"]`).boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      check((await ui(page, name)).running === 'true', `${name}: pointer hover does not pause playback`);
    }
    await capture(page, `desktop-${name}-${checkpoint.frame.id}`);
    frames.push(row);
  }
  const terminal = frames.at(-1);
  equal(terminal.complete, 'true', `${name}: terminal is marked complete after the 12-second sequence`);
  if (name === 'delivery') check(/人工.*验收|人工.*审阅/.test(terminal.accessibleName), 'Completed delivery still needs human acceptance');
  if (name === 'methods') check(/等待.*确认/.test(terminal.accessibleName) && /尚未创建/.test(terminal.accessibleName), 'Completed plan still awaits confirmation and never creates an employee');
  if (name === 'management') check(/不.*凭据|不.*授权/.test(terminal.accessibleName), 'Completed connection inspection never submits or authorizes');
  await tick(page, 6300);
  equal((await ui(page, name)).signature, terminal.signature, `${name}: terminal product snapshot is retained instead of inventing a post-result tour`);
  await seek(page, (index + 1) % names.length);
  await tick(page, 600);
  await seek(page, index);
  equal((await ui(page, name)).signature, terminal.signature, `${name}: returning does not replay or erase the terminal product snapshot`);
  diagnostics.push({ phase: `${name}-milestones`, frames: frames.map(row => ({ elapsed: row.elapsed, frame: row.snapshotFrame, phase: row.phase, label: row.label, text: row.text })) });
}

async function pauseGate(page, label, engage, release) {
  await seek(page, 0);
  await advanceTo(page, 'delivery', 1);
  await engage(page);
  await tick(page, 180);
  const held = await ui(page, 'delivery');
  await tick(page, 8000);
  const after = await ui(page, 'delivery');
  equal(after.signature, held.signature, `${label}: real visible product UI does not progress while paused`);
  check(Math.abs(after.elapsed - held.elapsed) < .06, `${label}: elapsed time freezes, not merely hidden DOM`);
  check(after.running !== 'true', `${label}: paused scene has no active timeline`);
  await release(page);
  await tick(page, 180);
  const resumed = await ui(page, 'delivery');
  check(resumed.elapsed - held.elapsed < .5, `${label}: restoration does not catch up the paused eight seconds`);
  await tick(page, 6000);
  const progressed = await ui(page, 'delivery');
  check(progressed.elapsed - resumed.elapsed > 5.7 && progressed.elapsed - resumed.elapsed < 6.3, `${label}: active real RAF time resumes normally`);
  check(progressed.signature !== held.signature && progressed.text !== held.text, `${label}: real product snapshot changes after resume`);
  diagnostics.push({ phase: 'pause-gate', label, held: held.elapsed, after: after.elapsed, resumed: resumed.elapsed, progressed: progressed.elapsed });
}

async function dialogOpen(page) {
  const link = page.locator('.capability-zoom[data-zoom]');
  const original = await link.getAttribute('href');
  await link.click();
  await page.waitForFunction(() => {
    const image = document.querySelector('#zoom-image');
    return Boolean(document.querySelector('#image-dialog[open]') && image.getAttribute('src') && image.complete && image.naturalWidth > 0);
  }, null, { timeout: 8000 });
  equal(await page.locator('#zoom-image').evaluate(image => image.currentSrc), new URL(original, url).href, 'Original-image dialog loads the current full capture, not the clipped native projection');
}

async function dialogClose(page) {
  await page.keyboard.press('Escape');
  await tick(page, 180);
  equal(await page.locator('dialog[open]').count(), 0, 'Escape closes the original PNG dialog');
  check(await page.locator('.capability-zoom').evaluate(node => document.activeElement === node), 'Dialog close restores focus to the stable original-image link');
  check((await ui(page, 'delivery')).running !== 'true', 'Restored keyboard reading focus keeps playback paused');
  const box = await page.locator('.capability-window').boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

async function mobileStates(page, width) {
  const mode = await page.locator('#product').getAttribute('data-capability-mode');
  for (let index = 0; index < names.length; index += 1) {
    const name = names[index];
    await seek(page, index);
    if (mode === 'stage') {
      for (let attempt = 0; attempt < 30 && (await ui(page, name)).running !== 'true'; attempt += 1) await tick(page, 34);
      equal((await ui(page, name)).running, 'true', `${width}px ${name}: visible scene owns the running clock`);
      await tick(page, 13000);
      const row = await ui(page, name);
      honest(row, `${width}px ${name}`);
      equal(row.referenceFrame, row.terminal, `${width}px ${name}: real playback reaches the captured terminal`);
    }
    await readable(page, name);
    if ((width === 390 && index === 0) || (width === 320 && index === 1)) await capture(page, `mobile-${width}-${name}`);
  }
  if (mode === 'flow') await staticStates(page);
}

async function wheelInsideNativeWorkspace(page) {
  const geometry = () => page.evaluate(() => {
    const stage = document.querySelector('#product .capability-browser');
    const track = document.querySelector('#product .capability-track');
    const stageBox = stage.getBoundingClientRect();
    const distance = (track.getBoundingClientRect().height - stageBox.height) / 3;
    const start = track.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(stage).top);
    return { scrollY, distance, u: (scrollY - start) / distance };
  });
  // 读取同一完整节点集合；是否出现溢出会随字体/CSS就绪改变，不能拿动态筛选后的数组长度当滚动证据。
  const scrollOffsets = name => page.locator(`[data-native-demo="${name}"]`).evaluate(root => [...root.shadowRoot.querySelectorAll('*')].map(node => [node.scrollTop, node.scrollLeft]));
  equal(await page.locator('#product').getAttribute('data-capability-mode'), 'stage', 'Native-wheel checks exercise the real pinned stage');
  for (let index = 0; index < names.length; index += 1) {
    const name = names[index];
    await seek(page, index, false);
    const body = page.locator(`[data-native-demo="${name}"] [data-product-viewport]`);
    const box = await body.boundingBox();
    check(box && box.width > 100 && box.height > 80, `${name}: wheel target is the actual product crop viewport`);
    const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const target = await page.evaluate(({ name, point }) => {
      const root = document.querySelector(`[data-native-demo="${name}"]`);
      const box = root.getBoundingClientRect();
      const hit = document.elementFromPoint(point.x, point.y);
      return {
        insideRoot: point.x > box.left && point.x < box.right && point.y > box.top && point.y < box.bottom,
        insideViewport: point.x > 0 && point.x < innerWidth && point.y > 0 && point.y < innerHeight,
        originalOverlay: Boolean(hit?.closest('[data-zoom]')),
        hit: hit?.className || hit?.tagName,
      };
    }, { name, point });
    check(target.insideRoot && target.insideViewport, `${name}: wheel point is at the visible work-area center, not the page edge`);
    check(!target.originalOverlay, `${name}: original PNG link does not cover the product workspace`);
    await page.mouse.move(point.x, point.y);
    const before = await geometry();
    const offsets = await scrollOffsets(name);
    const delta = Math.round(before.distance * .18);
    check(delta >= 40, `${name}: wheel delta exposes swallowed scrolling`);
    // 真实mouse.wheel验证浏览器滚动链；dispatchEvent不能证明内层没有吞滚动。
    await page.mouse.wheel(0, delta);
    await page.waitForFunction(y => Math.abs(scrollY - y) < 3, before.scrollY + delta, { timeout: 6000 });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const forward = await geometry();
    check(Math.abs(forward.u - (before.u + delta / before.distance)) < .012, `${name}: wheel over product DOM advances geometry-derived stage progress`);
    equal(await scrollOffsets(name), offsets, `${name}: inert product scrollports do not consume forward wheel`);
    await page.mouse.wheel(0, -delta);
    await page.waitForFunction(y => Math.abs(scrollY - y) < 3, before.scrollY, { timeout: 6000 });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const reversed = await geometry();
    check(Math.abs(reversed.u - before.u) < .012, `${name}: reverse wheel returns on the same stage path`);
    equal(await scrollOffsets(name), offsets, `${name}: inert product scrollports do not consume reverse wheel`);
    diagnostics.push({ phase: 'wheel-native-center', name, point, target, before, forward, reversed });
  }
}

// 在内存Shadow DOM中创建真实Web Animation，验证宿主subtree查询漏掉的动画也受同一门控与销毁管理。
async function shadowAnimationGate(page) {
  await seek(page, 0, false);
  await page.waitForFunction(() => document.querySelector('[data-native-demo="delivery"]').dataset.running === 'true');
  const discovery = await page.locator('[data-native-demo="delivery"]').evaluate(root => {
    const probe = document.createElement('span');
    probe.dataset.nativeGateProbe = '';
    probe.style.cssText = 'position:absolute;left:8px;top:8px;width:4px;height:4px;background:currentColor;pointer-events:none';
    root.shadowRoot.querySelector('[data-product-viewport]').append(probe);
    window.__nativeGateAnimation = probe.animate([{ opacity: .35 }, { opacity: 1 }], { duration: 60000, iterations: Infinity });
    return { hostFinds: root.getAnimations({ subtree: true }).includes(window.__nativeGateAnimation), shadowFinds: root.shadowRoot.getAnimations().includes(window.__nativeGateAnimation) };
  });
  equal(discovery, { hostFinds: false, shadowFinds: true }, 'Probe genuinely exercises a Shadow animation omitted by host subtree discovery');
  const sample = () => page.evaluate(() => ({ state: window.__nativeGateAnimation.playState, time: window.__nativeGateAnimation.currentTime, opacity: getComputedStyle(document.querySelector('[data-native-demo="delivery"]').shadowRoot.querySelector('[data-native-gate-probe]')).opacity }));
  await page.waitForTimeout(220);
  const active = await sample();
  check(active.state === 'running' && active.time > 100, 'Visible current scene plays a real Shadow Web Animation');
  await seek(page, 1, false);
  const held = await sample();
  equal(held.state, 'paused', 'Inactive scene pauses its real Shadow animation');
  await page.waitForTimeout(400);
  const paused = await sample();
  equal(paused.time, held.time, 'Paused Shadow animation timeline is frozen');
  equal(paused.opacity, held.opacity, 'Paused Shadow animation has frozen computed visual output');
  await seek(page, 0, false);
  await page.waitForTimeout(220);
  const resumed = await sample();
  equal(resumed.state, 'running', 'Returning to the settled current scene resumes the Shadow animation');
  check(resumed.time > held.time + 100 && resumed.time < held.time + 500, 'Shadow animation resumes without catching up inactive wall time');
  await page.evaluate(() => {
    dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false }));
    // pause() 的pending pause在下一帧提交；ready以后才是可严格比较的销毁基线。
    window.__nativeGatePauseReady = false;
    window.__nativeGateAnimation.ready.then(() => { window.__nativeGatePauseReady = true; });
  });
  await page.waitForFunction(() => window.__nativeGatePauseReady === true, null, { polling: 50, timeout: 3000 });
  const disposed = await sample();
  check(disposed.state === 'paused' || disposed.state === 'idle', 'Disposal leaves no running Shadow animation');
  await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false })));
  await page.waitForTimeout(300);
  equal((await sample()).time, disposed.time, 'Disposed Shadow animation cannot restart through pageshow');
  check((await ui(page, 'delivery')).running !== 'true', 'Disposed player reports no active scene');
  diagnostics.push({ phase: 'shadow-animation-gate', discovery, active, held, paused, resumed, disposed });
}

async function main() {
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(portable.referenceRoot, 'manifest.json'), 'utf8'));
    startIdentity = buildIdentity();
    browser = await portable.launch();
    await runCase('native Shadow HTML replaces screenshot-only presentations (not product fidelity)', {}, async (page, context) => {
      await nativePresentations(page);
      if (!redOnly) await originalLinks(page, context);
    });
    if (!redOnly) {
      await runCase('SSR HTML and no-JavaScript readable terminal states', { javaScriptEnabled: false }, async (page, context) => {
        const response = await context.request.get(url, { timeout: 10000 });
        const html = await response.text();
        equal([...html.matchAll(/data-native-demo=["'](delivery|methods|management)["']/g)].map(match => match[1]), names, 'Three native regions exist in raw HTML, not a JS-only mount');
        equal([...html.matchAll(/shadowrootmode="open"/g)].length, 3, 'Raw response includes declarative Shadow DOM for all three projections');
        await nativePresentations(page);
        await staticStates(page);
        await originalLinks(page, context);
        for (let index = 0; index < names.length; index += 1) {
          await seek(page, index, false);
          await readable(page, names[index]);
        }
      });
      await runCase('incoming layers start before execution rather than flashing SSR terminal results', { clock: true }, async page => {
        await seek(page, 0, true, .85);
        const methods = await ui(page, 'methods');
        equal(methods.snapshotFrame, identity('methods', sceneReference('methods').frames.start), 'Incoming methods shows captured initial state before first playback');
        check(methods.referenceFrame !== methods.terminal, 'Incoming methods does not flash an already-complete plan');
        check(methods.elapsed < .05 && methods.running !== 'true', 'Incoming methods clock stays paused during handover');
        await seek(page, 1, true, 1.85);
        const management = await ui(page, 'management');
        equal(management.snapshotFrame, identity('management', sceneReference('management').frames.start), 'Incoming connections shows captured initial state before first playback');
        check(management.referenceFrame !== management.terminal, 'Incoming connection does not flash terminal inspection');
        check(management.elapsed < .05 && management.running !== 'true', 'Incoming connection clock stays paused during handover');
      });
      await runCase('real wheel at native workspace center advances page and pinned stage both ways', {}, wheelInsideNativeWorkspace);
      await runCase('delivery: captured execution and terminal retain human acceptance boundary', { clock: true }, page => snapshotTimeline(page, 'delivery', 0));
      await runCase('methods: captured source, analysis and plan retain confirmation boundary', { clock: true }, page => snapshotTimeline(page, 'methods', 1));
      await runCase('connections: captured list and inspection never authorize or edit credentials', { clock: true }, page => snapshotTimeline(page, 'management', 2));
      await runCase('pause: inactive scene', { clock: true }, page => pauseGate(page, 'inactive', page => seek(page, 1), page => seek(page, 0)));
      await runCase('pause: offscreen native viewport', { clock: true }, page => pauseGate(page, 'offscreen', page => page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })), page => seek(page, 0)));
      await runCase('pause: keyboard reading focus', { clock: true }, page => pauseGate(page, 'keyboard', async page => {
        await page.keyboard.press('Tab');
        await page.locator('.product-tabs [data-tab="delivery"]').focus();
        check(await page.locator('.product-tabs [data-tab="delivery"]').evaluate(node => node.matches(':focus-visible')), 'Keyboard reading focus uses actual :focus-visible');
      }, page => page.evaluate(() => document.activeElement?.blur())));
      await runCase('pause: original PNG dialog with bounded image loading', { clock: true }, page => pauseGate(page, 'dialog', dialogOpen, dialogClose));
      await runCase('pause: synthetic document visibility lifecycle', { clock: true }, page => pauseGate(page, 'synthetic hidden', page => page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
        document.dispatchEvent(new Event('visibilitychange'));
      }), page => page.evaluate(() => {
        delete document.hidden;
        document.dispatchEvent(new Event('visibilitychange'));
      })));
      await runCase('pause: synthetic persisted pagehide/pageshow lifecycle (not real BFCache)', { clock: true }, page => pauseGate(page, 'synthetic persisted lifecycle', page => page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }))), page => page.evaluate(() => dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })))));
      await runCase('pause: unsettled scene handover', { clock: true }, page => pauseGate(page, 'handover', page => seek(page, 0, true, .7), page => seek(page, 0)));
      await runCase('dispose: synthetic non-persisted pagehide cleans active timeline', { clock: true }, async page => {
        await seek(page, 0);
        await advanceTo(page, 'delivery', 1);
        await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false })));
        const before = await ui(page, 'delivery');
        await tick(page, 8000);
        const after = await ui(page, 'delivery');
        equal(after.signature, before.signature, 'Disposed product UI does not continue changing');
        equal(after.elapsed, before.elapsed, 'Disposed scene has no live elapsed progression');
        check(after.running !== 'true', 'Disposal reports no active playback');
      });
      await runCase('real Shadow animation pauses, resumes and stays stopped after disposal', {}, shadowAnimationGate);
      await runCase('compact desktop 1280x720: native product crop remains readable', { viewport: { width: 1280, height: 720 }, clock: true }, page => mobileStates(page, 1280));
      for (const [width, height] of [[390, 844], [320, 568]]) {
        await runCase(`phone ${width}x${height}: continuous product crop preserves native type without scaling`, { viewport: { width, height }, isMobile: true, hasTouch: true, clock: true }, page => mobileStates(page, width));
      }
      await runCase('short landscape: static flow retains all three native interfaces', { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true }, async (page, context) => {
        equal(await page.locator('#product').getAttribute('data-capability-mode'), 'flow', 'Short landscape uses natural flow, not an over-clipped pin');
        await staticStates(page);
        await originalLinks(page, context);
        for (let index = 0; index < names.length; index += 1) { await seek(page, index, false); await readable(page, names[index]); }
      });
      await runCase('reduced motion: complete static reading and real originals', { reducedMotion: 'reduce', viewport: { width: 390, height: 844 } }, async (page, context) => {
        equal(await page.locator('#product').getAttribute('data-capability-mode'), 'flow', 'Reduced motion uses static natural flow');
        await staticStates(page);
        await originalLinks(page, context);
        const before = await ui(page, 'delivery');
        await page.waitForTimeout(220);
        equal((await ui(page, 'delivery')).signature, before.signature, 'Reduced motion does not run a product snapshot timeline');
        for (let index = 0; index < names.length; index += 1) { await seek(page, index, false); await readable(page, names[index]); }
        const host = page.locator('[data-native-demo="methods"]');
        await host.focus();
        check(await host.evaluate(node => document.activeElement === node), 'Static readonly projection is reachable as a keyboard reading target');
        await page.keyboard.press('Tab');
        check(await host.evaluate(node => !node.shadowRoot.activeElement), 'Tab never enters inert product controls');
      });
    }
    if (!redOnly) await require('./native-faults.cjs').runNativeFaults(browser, { rows, diagnostics, url });
    endIdentity = buildIdentity();
    equal(endIdentity, startIdentity, 'Test inputs and generated artifacts do not drift during this run');
  } catch (error) {
    rows.push({ label: 'runner', status: 'failed', message: error.message, stack: error.stack });
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    const report = { url, runId, startIdentity, endIdentity, scope: 'Website playback, readonly side-effect boundary and fallback only; not external product fidelity or business E2E', mode: redOnly ? 'red-only' : 'full', generatedAt: new Date().toISOString(), assertions, rows, diagnostics, screenshots };
    fs.writeFileSync(path.join(directory, redOnly ? 'native-before.json' : 'native-demos.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(`${assertions} assertions; ${rows.filter(row => row.status === 'failed').length} failed case(s)`);
  }
}
main();
