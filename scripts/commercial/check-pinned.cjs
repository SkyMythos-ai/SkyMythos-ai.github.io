const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const portable = require('./browser.cjs');
const caseLabels = [
  'stage-wheel/1440x1000', 'stage-wheel/1280x720', 'stage-wheel/390x844', 'stage-wheel/320x568',
  'manual-dialog-keyboard-resize', 'hash-reload-back',
  'flow/1440x1000/reduce', 'flow/390x844/reduce', 'flow/844x390/no-preference',
  'nojs/1440x1000', 'nojs/390x844', 'nojs/320x568',
];
const selectedCase = process.env.PINNED_CASE;
assert(selectedCase === undefined || caseLabels.includes(selectedCase), `Unknown PINNED_CASE: ${selectedCase}; expected one of ${caseLabels.join(', ')}`);
portable.trackIdentity('pinned');

const url = portable.url;
const directory = portable.evidence;
const names = ['delivery', 'methods', 'management'];
const expected = [
  { name: 'delivery', title: '交付有依据，结果由人确认。', description: '明确目标和验收条件，查看执行、检查与产物，再决定是否接受交付。', caption: '执行状态与人工验收分开，不是客户实测或效果承诺。', alt: '当前产品线程会话与交付信息的只读示例界面，结果仍需人工验收' },
  { name: 'methods', title: '经验先审清，再成为工作能力。', description: '选择有来源的经验，检查职责、方法与工具配置。经人确认方案后，才继续创建。', caption: '方案待确认 · 员工尚未创建、方法尚未采用，不表示模型训练。', alt: '数字员工形成方案的产品界面，显示经验来源、职责与等待确认方案状态，尚未创建员工' },
  { name: 'management', title: '接入工具，也明确授权范围。', description: '看清连接状态、工作空间与凭据边界。运行、Token 与估算费用的覆盖范围，另见管理说明。', caption: '连接清单与配置弹窗，非费用图 · 不提交凭据或发起授权。', alt: '当前产品连接与授权的分类清单及配置界面，不是费用分析图表' },
];
const rows = [];
const errors = [];
const diagnostics = [];
const screenshots = [];
let assertions = 0;
let browser;

function readReferenceImage(name) {
  const root = portable.referenceRoot;
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  const file = manifest.images?.[name]?.path;
  assert(typeof file === 'string' && file.endsWith('.png'), `Missing current original PNG: ${name}`);
  const filename = path.resolve(root, file);
  assert(filename.startsWith(`${root}${path.sep}`), 'Reference PNG stays inside its published resource directory');
  const bytes = fs.readFileSync(filename);
  assert(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && bytes.toString('ascii', 12, 16) === 'IHDR', 'Current original is a real PNG');
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  assert(width > 0 && height > 0, 'Reference PNG has positive intrinsic dimensions');
  return { file, width, height, ratio: width / height, href: new URL(portable.referencePath + file, url).href };
}

function check(condition, message) { assertions += 1; assert(condition, message); }
function equal(actual, target, message) { assertions += 1; assert.deepEqual(actual, target, message); }
function near(actual, target, tolerance, message) { check(Math.abs(actual - target) <= tolerance, `${message}: ${actual} vs ${target} (±${tolerance})`); }
const frames = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
// 只等待左栏有限的说明/FLIP 动画；内部演示不参与外层几何验收的等待条件。
const settleMetadata = page => page.waitForFunction(() => [...document.querySelectorAll('.product-tabs')].every(element => element.getAnimations({ subtree: true }).every(animation => animation.effect?.getTiming().iterations === Infinity || ['finished', 'idle'].includes(animation.playState))), null, { timeout: 1500 });
const captionPrefix = '真实工作区节选，示例数据，非实时运行。';

async function runCase(label, options, body) {
  if (selectedCase !== undefined && selectedCase !== label) return;
  const context = await browser.newContext({ colorScheme: 'light', reducedMotion: 'no-preference', ...options });
  const page = await context.newPage();
  if (label === 'hash-reload-back') {
    await page.addInitScript(() => {
      window.__pinnedDocument = `${Date.now()}-${Math.random()}`;
      window.__pinnedHistoryEvents = [];
      const record = (type, extra = {}) => window.__pinnedHistoryEvents.push({ type, at: performance.now(), href: location.href, length: history.length, ...extra });
      for (const type of ['pagehide', 'pageshow', 'popstate', 'hashchange']) addEventListener(type, event => record(type, { persisted: event.persisted }));
      for (const method of ['pushState', 'replaceState']) {
        const original = history[method].bind(history);
        history[method] = (...args) => { const result = original(...args); record(method); return result; };
      }
      record('document');
    });
  }
  page.setDefaultTimeout(8000);
  page.setDefaultNavigationTimeout(25000);
  const pending = new Set();
  const issues = [];
  const note = issue => issues.push(issue);
  page.on('console', message => { if (message.type() === 'error') note({ type: 'console', text: message.text() }); });
  page.on('pageerror', error => note({ type: 'pageerror', message: error.message }));
  page.on('request', request => pending.add(request.url()));
  page.on('requestfinished', request => pending.delete(request.url()));
  page.on('requestfailed', request => { pending.delete(request.url()); if (!require('./transport.cjs').recordExpectedFailure(request)) note({ type: 'requestfailed', url: request.url(), failure: request.failure() }); });
  page.on('response', response => { if (response.status() >= 400) note({ type: 'http', status: response.status(), url: response.url() }); });
  const start = assertions;
  try {
    try { await page.goto(url, { waitUntil: 'load' }); }
    catch (error) {
      diagnostics.push({ label, phase: 'load', url: page.url(), pending: [...pending], readyState: await page.evaluate(() => document.readyState).catch(() => 'unavailable'), error: error.message });
      throw error;
    }
    await page.evaluate(() => document.fonts.ready);
    await body(page);
    equal(issues, [], `${label}: browser/resource errors`);
    rows.push({ label, status: 'passed', assertions: assertions - start });
    console.log(`PASS ${label} (${assertions - start} assertions)`);
  } catch (error) {
    errors.push({ label, message: error.message, stack: error.stack });
    rows.push({ label, status: 'failed', assertions: assertions - start });
    diagnostics.push({ label, phase: 'failure', url: page.url(), pending: [...pending], issues, geometry: await snapshot(page).catch(error => ({ unavailable: error.message })) });
    console.error(`FAIL ${label}: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (issues.length) diagnostics.push({ label, issues });
    await context.close();
  }
}

// 进度仅从真实轨道/舞台几何推导；不读控制器的 debug dataset，避免实现自证。
async function snapshot(page) {
  return page.evaluate(() => {
    const box = element => {
      const value = element.getBoundingClientRect();
      return { x: value.x, y: value.y, width: value.width, height: value.height, right: value.right, bottom: value.bottom };
    };
    const visible = element => {
      const style = getComputedStyle(element);
      return !element.hidden && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && element.getBoundingClientRect().height > 0;
    };
    const root = document.querySelector('#product');
    const track = root.querySelector('.capability-track');
    const stage = root.querySelector('.capability-browser');
    const clip = root.querySelector('.capability-window');
    const trackBox = box(track);
    const stageBox = box(stage);
    const pinTop = parseFloat(getComputedStyle(stage).top);
    const distance = (trackBox.height - stageBox.height) / 3;
    const pinStart = trackBox.y + scrollY - pinTop;
    const zoom = root.querySelector('.capability-zoom[data-zoom]');
    return {
      mode: root.dataset.capabilityMode, y: scrollY, width: innerWidth, height: innerHeight,
      scrollWidth: document.documentElement.scrollWidth, track: trackBox, stage: stageBox,
      clip: clip ? box(clip) : null,
      clipOverflow: clip ? [getComputedStyle(clip).overflowX, getComputedStyle(clip).overflowY] : [],
      stagePosition: getComputedStyle(stage).position, pinTop, distance, pinStart,
      u: Math.max(0, Math.min(3, (scrollY - pinStart) / distance)),
      current: [...root.querySelectorAll('[data-tab][aria-current="location"]')].map(link => link.dataset.tab),
      focus: document.activeElement?.dataset.tab || document.activeElement?.className || document.activeElement?.tagName,
      href: location.href,
      details: [...root.querySelectorAll('.capability-detail')].filter(visible).map(element => element.innerText).join('\n'),
      caption: [...root.querySelectorAll('.capability-caption')].filter(visible).map(element => element.innerText).join('\n'),
      zoom: zoom ? { href: zoom.getAttribute('href'), alt: zoom.dataset.zoomAlt, box: box(zoom), count: root.querySelectorAll('.capability-zoom[data-zoom]').length, insidePanel: !!zoom.closest('[data-panel]'), insideClip: !!zoom.closest('.capability-window'), visible: visible(zoom) } : null,
      nativeCount: root.querySelectorAll('[data-native-demo]').length,
      panels: [...root.querySelectorAll('.product-panel[data-panel]')].map(panel => {
        const style = getComputedStyle(panel);
        const matrix = new DOMMatrixReadOnly(style.transform === 'none' ? undefined : style.transform);
        const viewport = panel.querySelector('[data-native-demo]');
        const viewportStyle = viewport ? getComputedStyle(viewport) : null;
        const viewportMatrix = viewportStyle ? new DOMMatrixReadOnly(viewportStyle.transform === 'none' ? undefined : viewportStyle.transform) : null;
        const activeFrames = viewport ? [...(viewport.shadowRoot?.querySelectorAll('[data-product-frame]:not([hidden])') || [])] : [];
        const activeFrame = activeFrames[0];
        const projection = activeFrame?.querySelector('.product-reference-root');
        const original = panel.querySelector('.capability-original[data-zoom]');
        const visual = panel.closest('[inert]');
        return { name: panel.dataset.panel, box: box(panel), position: style.position, transform: style.transform,
          tx: matrix.m41, ty: matrix.m42, scaleX: matrix.a, scaleY: matrix.d,
          inert: panel.inert || !!visual, ariaHidden: panel.getAttribute('aria-hidden') === 'true' || !!panel.closest('[aria-hidden="true"]'),
          viewport: viewport ? { name: viewport.dataset.nativeDemo, box: box(viewport), tag: viewport.tagName, text: projection?.innerText || '', children: projection?.querySelectorAll('*').length || 0, shadow: !!viewport.shadowRoot, activeCount: activeFrames.length, frame: activeFrame?.dataset.productFrame, referenceFrame: viewport.dataset.referenceFrame, terminalFrame: viewport.dataset.referenceTerminal, phase: viewport.dataset.phase, framePhase: activeFrame?.dataset.phase, readOnly: !!projection?.closest('[inert]'), scaleX: viewportMatrix.a, scaleY: viewportMatrix.d } : null,
          original: original ? { href: original.getAttribute('href'), alt: original.dataset.zoomAlt, visible: visible(original), box: box(original) } : null,
        };
      }),
    };
  });
}

async function mode(page, value) {
  await page.waitForFunction(value => document.querySelector('#product').dataset.capabilityMode === value, value);
  await frames(page);
  equal(await page.locator('#product').getAttribute('data-capability-mode'), value, `Expected ${value} mode`);
}

async function seek(page, u) {
  const geometry = await snapshot(page);
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), geometry.pinStart + geometry.distance * u);
  await frames(page);
  await settleMetadata(page);
  return snapshot(page);
}

async function wheelTo(page, u) {
  const before = await snapshot(page);
  const target = before.pinStart + before.distance * u;
  const pointer = { x: before.clip.x + before.clip.width / 2, y: before.clip.y + before.clip.height / 2 };
  check(pointer.x > 0 && pointer.x < before.width && pointer.y > 0 && pointer.y < before.height, 'Real wheel originates at the visible native viewport center');
  await page.mouse.move(pointer.x, pointer.y);
  await page.mouse.wheel(0, target - before.y);
  await page.waitForFunction(target => Math.abs(scrollY - target) < 3, target);
  await frames(page);
  await settleMetadata(page);
  const after = await snapshot(page);
  near(after.u, u, .009, 'Wheel reaches geometry-derived progress');
  return after;
}

async function screenshot(page, name) {
  const file = path.join(directory, `pinned-${name}.png`);
  await page.mouse.move(page.viewportSize().width - 2, 0);
  await page.screenshot({ path: file });
  screenshots.push(file);
}

function fixedGeometry(row, base) {
  near(row.stage.y, base.stage.y, 1.5, 'The entire presentation stage remains pinned, rather than moving as a long list');
  near(row.stage.x, base.stage.x, 1, 'Stage horizontal position stays fixed');
  near(row.stage.width, base.stage.width, 1, 'Stage width stays fixed');
  near(row.stage.height, base.stage.height, 1, 'Stage height stays fixed');
  for (const key of ['x', 'y', 'width', 'height']) near(row.clip[key], base.clip[key], 1.5, `Internal clipping window ${key} stays fixed`);
  equal(row.stagePosition, 'sticky', 'Whole stage, not only its navigation, is sticky');
  check(row.clipOverflow.every(value => ['hidden', 'clip'].includes(value)), 'Incoming native viewport is masked by the fixed clip window');
  check(row.stage.y >= 0 && row.stage.bottom <= row.height + 1.5, 'Pinned stage fits the real viewport');
  equal(row.scrollWidth, row.width, 'Layers do not leak horizontally outside viewport');
}

function nativeViewport(panel, index) {
  check(panel.viewport && panel.viewport.name === names[index], 'Panel contains its corresponding native viewport');
  check(!['IMG', 'VIDEO', 'CANVAS'].includes(panel.viewport.tag) && panel.viewport.children > 1 && panel.viewport.text.trim().length > 40, 'Native presentation is populated readable DOM, not a screenshot placeholder');
  check(panel.viewport.shadow && panel.viewport.activeCount === 1 && panel.viewport.readOnly, 'One inert real-component projection is active in the open shadow root');
  equal(panel.viewport.frame, panel.viewport.referenceFrame, 'Host frame identity matches its selected snapshot');
  equal(panel.viewport.phase, panel.viewport.framePhase, 'Host phase matches its selected snapshot');
  check(panel.viewport.frame.startsWith(`${names[index]}-`), 'Selected frame belongs to its actual product scene');
  near(panel.viewport.scaleX, 1, .001, 'Native viewport is not horizontally scaled');
  near(panel.viewport.scaleY, 1, .001, 'Native viewport is not vertically scaled');
  check(panel.original && new URL(panel.original.href, url).href === expected[index].href, 'Separate original link retains its current full-resolution PNG');
  equal(panel.original.alt, expected[index].alt, 'Separate original link preserves the exact original alt');
}

function translatedLayers(row) {
  equal(row.nativeCount, 3, 'Exactly three native viewports replace the original screenshot presentations');
  for (let index = 0; index < 3; index += 1) {
    const panel = row.panels[index];
    equal(panel.name, names[index], 'Original three visual panels retain their order');
    equal(panel.position, 'absolute', 'Visual panels are overlaid, not a natural long list');
    check(panel.inert && panel.ariaHidden, 'Visual layer is inert and hidden from assistive navigation');
    near(panel.scaleX, 1, .001, 'No whole-panel horizontal scaling');
    near(panel.scaleY, 1, .001, 'No whole-panel vertical scaling');
    near(panel.tx, 0, 1, 'Transition moves vertically');
    // 独立多项式预期：每次交接跨 .6 区间，不导入控制器或读取其进度属性。
    const t = Math.max(0, Math.min(1, (row.u - (index - .6)) / .6));
    const fraction = index === 0 ? 0 : 1 - (3 * t * t - 2 * t * t * t);
    near(panel.ty / panel.box.height, fraction, .018, `Panel ${index} uses smooth translateY at progress ${row.u}`);
    const intersectionHeight = Math.max(0, Math.min(panel.box.bottom, row.clip.bottom) - Math.max(panel.box.y, row.clip.y));
    near(intersectionHeight / row.clip.height, 1 - fraction, .022, 'Translated layer has the expected visible intersection with the fixed mask');
    if (fraction > .05 && fraction < .95) check(intersectionHeight > 0 && intersectionHeight < row.clip.height, 'Transition really reveals only part of the incoming layer');
    nativeViewport(panel, index);
    for (const key of ['x', 'y', 'width', 'height']) near(panel.viewport.box[key], panel.box[key], 1.5, `Native viewport ${key} fills its moving panel`);
    near(panel.box.height, row.clip.height, 1.5, 'Whole moving viewport occupies the fixed clipping height');
  }
}

function currentMetadata(row, index) {
  const item = expected[index];
  equal(row.current, [item.name], 'Only the visually dominant capability is current');
  equal(row.details.trim(), item.description, 'Left description exactly matches the current original paragraph');
  equal(row.caption.trim(), captionPrefix + item.caption, 'Current caption preserves both demo disclosure and exact original boundary');
  for (const other of expected.filter(value => value !== item)) {
    check(!row.details.includes(other.description), 'Inactive descriptions are not exposed in the stage');
    check(!row.caption.includes(other.caption), 'Inactive boundary captions are not exposed in the stage');
  }
  check(row.zoom && row.zoom.count === 1 && !row.zoom.insidePanel && !row.zoom.insideClip && row.zoom.visible, 'One stable original-image trigger is outside the moving layers and clip');
  check(row.zoom.box.y >= row.clip.bottom - 1 && row.zoom.box.width < row.clip.width, 'Original-image trigger is a small footer link, not a full-frame overlay');
  equal(new URL(row.zoom.href, url).href, item.href, 'Stable trigger selects the current original PNG');
  equal(row.zoom.alt, item.alt, 'Stable trigger selects the exact current original alt text');
}

function completeCurrentViewport(row, index) {
  const viewport = row.panels[index].viewport.box;
  check(viewport.x >= row.clip.x - 1 && viewport.right <= row.clip.right + 1, 'Stable native viewport is not horizontally cropped');
  check(viewport.y >= row.clip.y - 1 && viewport.bottom <= row.clip.bottom + 1, 'Stable native viewport is not vertically cropped');
}

async function stageSequence(page, width, height) {
  await mode(page, 'stage');
  equal(await page.locator('#product [data-native-demo]').count(), 3, 'Stage has three native DOM presentations');
  const initial = await snapshot(page);
  check(initial.distance > 0, 'Track provides three intervals of scroll runway');
  equal(initial.panels.length, 3, 'Original three panels remain present');
  equal(await page.getByRole('navigation', { name: '产品能力', exact: true }).count(), 1, 'Capability choices are real navigation');
  equal(await page.locator('.product-tabs [role="tab"]').count(), 0, 'Navigation does not fake tab roles');
  equal(await page.locator('.product-tabs a').evaluateAll(links => links.filter(link => link.tabIndex === 0).length), 3, 'All original navigation links remain tabbable');
  const base = await seek(page, .15);
  const href = page.url();
  await page.locator('[data-tab="delivery"]').evaluate(element => element.focus({ preventScroll: true }));
  near(initial.distance, Math.max(240, Math.min(800, initial.stage.height * .85)), 1.5, 'Runway interval uses clamped stage-height distance');
  near(initial.track.height, initial.stage.height + 3 * initial.distance, 1.5, 'Track retains H + 3D geometry');
  const samples = [.15, .4 + .6 * .25, .4 + .6 * .5, .4 + .6 * .75, 1.15, 1.4 + .6 * .25, 1.4 + .6 * .5, 1.4 + .6 * .75, 2.15, 2.8];
  for (const [direction, sequence] of [['forward', samples], ['reverse', [...samples].reverse()]]) {
    for (const u of sequence) {
      const row = await wheelTo(page, u);
      fixedGeometry(row, base);
      translatedLayers(row);
      const index = u < .7 - .003 ? 0 : u > 1.7 + .003 ? 2 : u > .7 + .003 && u < 1.7 - .003 ? 1 : null;
      if (index !== null) currentMetadata(row, index);
      if ([.15, 1.15, 2.15, 2.8].includes(u)) completeCurrentViewport(row, Math.floor(u));
      equal(row.href, href, 'Automatic scroll does not mutate the URL');
      equal(row.focus, 'delivery', 'Automatic scroll does not steal focus');
      rows.push({ label: `wheel/${width}x${height}/${direction}/${u.toFixed(4)}`, status: 'sampled', geometry: row });
      if (direction === 'forward' && width === 1440 && [.15, .7, 1.15, 1.7, 2.8].some(value => Math.abs(value - u) < .0001)) await screenshot(page, `sequence-${width}-${u.toFixed(3)}`);
      if (direction === 'forward' && ((width === 390 && Math.abs(u - .7) < .0001) || (width === 320 && Math.abs(u - 1.7) < .0001))) await screenshot(page, `sequence-${width}-${u.toFixed(3)}`);
    }
  }
  for (const [u, index] of [[.68, 0], [.72, 1], [1.68, 1], [1.72, 2]]) {
    const row = await wheelTo(page, u);
    fixedGeometry(row, base);
    translatedLayers(row);
    currentMetadata(row, index);
  }
  for (const endpoint of [.4, 1, 1.4, 2]) {
    const before = await seek(page, endpoint - .004);
    const after = await seek(page, endpoint + .004);
    fixedGeometry(after, before);
    translatedLayers(before);
    translatedLayers(after);
    equal(after.current, before.current, `No current-item jump at reveal endpoint ${endpoint}`);
    for (let index = 0; index < 3; index += 1) {
      near(after.panels[index].viewport.box.height, before.panels[index].viewport.box.height, 1, 'Native viewport height is continuous across reveal endpoint');
      near(after.panels[index].ty, before.panels[index].ty, 1.5, 'Smoothstep translation is continuous across reveal endpoint');
    }
  }
  await seek(page, 2.1);
  const dwell = await wheelTo(page, 2.9);
  currentMetadata(dwell, 2);
  fixedGeometry(dwell, base);
  // 末项有完整停留区，超过父轨道末端才随文档自然离开。
  const releaseY = dwell.pinStart + dwell.distance * 3 + Math.min(160, dwell.stage.height / 2);
  await page.mouse.wheel(0, releaseY - dwell.y);
  await page.waitForFunction(y => Math.abs(scrollY - y) < 3, releaseY);
  await frames(page);
  const released = await snapshot(page);
  check(released.stage.y < base.stage.y - 50, 'Parent naturally releases the entire stage after the final dwell');
  near(released.stage.bottom, released.track.bottom, 2, 'Sticky release is constrained by parent track end');
  rows.push({ label: `release/${width}x${height}`, status: 'sampled', geometry: released });
}

async function navigate(page, index, action = 'click') {
  const link = page.locator(`[data-tab="${names[index]}"]`);
  if (action === 'click') await link.click();
  await page.waitForFunction(name => document.querySelector(`[data-tab="${name}"]`).getAttribute('aria-current') === 'location', names[index]);
  const geometry = await snapshot(page);
  await page.waitForFunction(({ start, distance, index }) => Math.abs((scrollY - start) / distance - (index + .15)) < .055, { start: geometry.pinStart, distance: geometry.distance, index });
  await frames(page);
  await settleMetadata(page);
  const row = await snapshot(page);
  currentMetadata(row, index);
  near(row.u, index + .15, .055, 'Manual navigation maps directly into the stable runway interval');
  return row;
}

async function interactionSequence(page) {
  await mode(page, 'stage');
  await seek(page, .15);
  const originalHref = page.url();
  for (let index = 0; index < 3; index += 1) {
    const before = await navigate(page, index);
    equal(page.url(), originalHref, 'Clicking capability navigation keeps the URL stable');
    const trigger = page.locator('.capability-zoom[data-zoom]');
    await trigger.click();
    await page.waitForFunction(() => document.querySelector('#image-dialog').open && document.querySelector('#zoom-image').complete && document.querySelector('#zoom-image').naturalWidth > 0);
    await page.locator('#zoom-image').evaluate(image => image.decode());
    const image = await page.locator('#zoom-image').evaluate(image => ({ src: image.src, alt: image.alt, width: image.naturalWidth, height: image.naturalHeight, box: { width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height } }));
    equal(image.src, expected[index].href, 'Stable trigger opens the correct original PNG');
    equal(image.alt, expected[index].alt, 'Original image retains the exact current alternative text');
    equal(image.width, expected[index].width, 'Modal decodes the exact original PNG width');
    equal(image.height, expected[index].height, 'Modal decodes the exact original PNG height');
    near(image.width / image.height, expected[index].ratio, .001, 'Modal decodes the original PNG dimensions');
    near(image.box.width / image.box.height, expected[index].ratio, .012, 'Modal renders the complete original PNG without distortion');
    // 人工滚动背景仍不能推进舞台状态；不把 body 是否锁滚当作冻结的唯一证明。
    await page.evaluate(delta => scrollTo({ top: scrollY + delta, behavior: 'instant' }), before.distance * .7);
    await frames(page);
    const frozen = await snapshot(page);
    equal(frozen.current, before.current, 'Dialog freezes current navigation');
    equal(frozen.panels.map(panel => panel.transform), before.panels.map(panel => panel.transform), 'Dialog freezes visual transition matrices');
    equal(frozen.details, before.details, 'Dialog freezes current description');
    equal(frozen.caption, before.caption, 'Dialog freezes current boundary');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#image-dialog').open && document.activeElement === document.querySelector('.capability-zoom[data-zoom]'));
    check(await trigger.evaluate(element => document.activeElement === element), 'Escape returns focus to the stable trigger');
  }
  await navigate(page, 0);
  await page.locator('[data-tab="delivery"]').evaluate(element => element.focus({ preventScroll: true }));
  for (const [key, index] of [['ArrowDown', 1], ['ArrowUp', 0], ['End', 2], ['ArrowDown', 0], ['Home', 0]]) {
    await page.keyboard.press(key);
    await navigate(page, index, 'keyboard');
    check(await page.locator(`[data-tab="${names[index]}"]`).evaluate(link => link === document.activeElement), `${key} focuses the intended navigation link`);
  }
  await page.keyboard.press('Tab');
  check(await page.locator('[data-tab="methods"]').evaluate(link => link === document.activeElement), 'Tab reaches the next real navigation link');
  await page.keyboard.press('Tab');
  check(await page.locator('[data-tab="management"]').evaluate(link => link === document.activeElement), 'Tab reaches every capability link');
  await page.setViewportSize({ width: 390, height: 844 });
  await mode(page, 'stage');
  await seek(page, .15);
  await page.locator('[data-tab="delivery"]').evaluate(element => element.focus({ preventScroll: true }));
  await page.keyboard.press('ArrowRight');
  await navigate(page, 1, 'keyboard');
  await page.keyboard.press('ArrowLeft');
  await navigate(page, 0, 'keyboard');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mode(page, 'flow');
  await assertFlow(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await mode(page, 'stage');
  await navigate(page, 1);
  await page.setViewportSize({ width: 844, height: 390 });
  await mode(page, 'flow');
  await assertFlow(page);
  await page.setViewportSize({ width: 1280, height: 720 });
  await mode(page, 'stage');
  await navigate(page, 2);
  const resized = await snapshot(page);
  check(Number.isFinite(resized.u) && resized.distance > 0, 'Cross-mode resizing rebuilds valid geometry');
  currentMetadata(resized, 2);
}

async function assertFlow(page) {
  const row = await snapshot(page);
  check(row.stagePosition !== 'sticky', 'Flow fallback clears sticky stage behavior');
  check(row.panels.every(panel => panel.position !== 'absolute'), 'Flow fallback restores natural document panels');
  check(row.panels.every(panel => Math.abs(panel.ty) < 1), 'Flow fallback clears transition transforms');
  equal(row.scrollWidth, row.width, 'Flow fallback does not overflow viewport');
  equal(row.nativeCount, 3, 'Flow fallback retains all three full native viewports');
  for (let index = 0; index < 3; index += 1) {
    const panel = page.locator(`[data-panel="${names[index]}"]`);
    check(await panel.isVisible(), 'Every original panel remains readable in flow fallback');
    await panel.locator('[data-native-demo]').scrollIntoViewIfNeeded();
    nativeViewport(row.panels[index], index);
    const viewport = row.panels[index].viewport.box;
    check(viewport.width > 0 && viewport.height > 0, 'Flow native viewport has natural visible dimensions');
    check(viewport.x >= row.panels[index].box.x - 1 && viewport.right <= row.panels[index].box.right + 1 && viewport.y >= row.panels[index].box.y - 1 && viewport.bottom <= row.panels[index].box.bottom + 1, 'Complete native viewport remains inside its natural-flow panel');
    check(row.panels[index].original.visible && row.panels[index].original.box.y >= viewport.bottom - 1, 'Separate original link remains reachable below the native viewport');
    check(await panel.locator('.panel-copy').innerText().then(text => text.includes(expected[index].title) && text.includes(expected[index].description)), 'Flow preserves full title and description');
    equal((await panel.locator('figcaption').innerText()).trim(), captionPrefix + expected[index].caption, 'Flow preserves demo disclosure and original caption');
    if (index) check(row.panels[index].box.y >= row.panels[index - 1].box.bottom - 1, 'Fallback panels follow naturally without overlap');
  }
}

async function historyCheckpoint(page, name, action) {
  const observe = async status => diagnostics.push({
    label: 'hash-reload-back', checkpoint: name, status,
    history: await page.evaluate(() => ({ documentId: window.__pinnedDocument, href: location.href, length: history.length, readyState: document.readyState, events: window.__pinnedHistoryEvents })),
    geometry: await snapshot(page),
  });
  diagnostics.push({ label: 'hash-reload-back', checkpoint: name, status: 'started' });
  try {
    await action();
    await observe('passed');
  } catch (error) {
    await observe('failed').catch(() => {});
    error.message = `${name}: ${error.message}`;
    throw error;
  }
}

async function hashHistory(page) {
  // 先等首页挂载；否则同文档 hash 导航会早于 Next 首次 canonical URL 提交，被初始化 replaceState 覆盖。
  await historyCheckpoint(page, 'hash/initial-document-ready', () => mode(page, 'stage'));
  await historyCheckpoint(page, 'hash/initial-navigation', () => page.goto(`${url}#panel-methods`, { waitUntil: 'load' }));
  await historyCheckpoint(page, 'hash/initial-stage', () => mode(page, 'stage'));
  await historyCheckpoint(page, 'hash/initial-methods-current', () => page.waitForFunction(() => document.querySelector('[data-tab="methods"]').getAttribute('aria-current') === 'location'));
  await settleMetadata(page);
  currentMetadata(await snapshot(page), 1);
  await historyCheckpoint(page, 'hash/reload', () => page.reload({ waitUntil: 'load' }));
  await historyCheckpoint(page, 'hash/reload-stage', () => mode(page, 'stage'));
  await historyCheckpoint(page, 'hash/reload-methods-current', () => page.waitForFunction(() => document.querySelector('[data-tab="methods"]').getAttribute('aria-current') === 'location'));
  await settleMetadata(page);
  currentMetadata(await snapshot(page), 1);
  await historyCheckpoint(page, 'hash/management-navigation', () => page.goto(`${url}#panel-management`, { waitUntil: 'load' }));
  await historyCheckpoint(page, 'hash/management-current', () => page.waitForFunction(() => document.querySelector('[data-tab="management"]').getAttribute('aria-current') === 'location'));
  await settleMetadata(page);
  currentMetadata(await snapshot(page), 2);
  await historyCheckpoint(page, 'hash/back-navigation', () => page.goBack({ waitUntil: 'load' }));
  await historyCheckpoint(page, 'hash/back-methods-current-and-fragment', () => page.waitForFunction(() => location.hash === '#panel-methods' && document.querySelector('[data-tab="methods"]').getAttribute('aria-current') === 'location'));
  await settleMetadata(page);
  currentMetadata(await snapshot(page), 1);
  const history = await page.evaluate(() => ({ hash: location.hash, navigationType: performance.getEntriesByType('navigation')[0]?.type }));
  rows.push({ label: 'history-observation', status: 'sampled', ...history, note: 'Back navigation verified; BFCache use is not claimed.' });
}

(async () => {
  fs.mkdirSync(directory, { recursive: true });
  try {
    expected.forEach(item => Object.assign(item, readReferenceImage(item.name)));
    browser = await portable.launch();
    for (const [width, height] of [[1440, 1000], [1280, 720], [390, 844], [320, 568]]) {
      await runCase(`stage-wheel/${width}x${height}`, { viewport: { width, height } }, page => stageSequence(page, width, height));
    }
    await runCase('manual-dialog-keyboard-resize', { viewport: { width: 1440, height: 1000 } }, interactionSequence);
    await runCase('hash-reload-back', { viewport: { width: 1440, height: 1000 } }, hashHistory);
    for (const [width, height, reducedMotion] of [[1440, 1000, 'reduce'], [390, 844, 'reduce'], [844, 390, 'no-preference']]) {
      await runCase(`flow/${width}x${height}/${reducedMotion}`, { viewport: { width, height }, reducedMotion }, async page => { await mode(page, 'flow'); await assertFlow(page); });
    }
    for (const [width, height] of [[1440, 1000], [390, 844], [320, 568]]) {
      await runCase(`nojs/${width}x${height}`, { viewport: { width, height }, javaScriptEnabled: false }, async page => {
        const layout = await page.locator('.product-panel').evaluateAll(panels => panels.map(panel => { const box = panel.getBoundingClientRect(); return { name: panel.dataset.panel, top: box.top, bottom: box.bottom, position: getComputedStyle(panel).position, text: panel.innerText }; }));
        equal(layout.map(panel => panel.name), names, 'No-JS retains all original capability panels');
        equal(await page.evaluate(() => document.documentElement.scrollWidth), width, 'No-JS does not overflow viewport');
        for (let index = 0; index < 3; index += 1) {
          check(await page.locator(`[data-panel="${names[index]}"]`).isVisible(), 'No-JS panel remains visible');
          const viewport = page.locator(`[data-panel="${names[index]}"] [data-native-demo]`);
          await viewport.scrollIntoViewIfNeeded();
          const row = await snapshot(page);
          equal(row.nativeCount, 3, 'No-JS has all three static native viewports');
          nativeViewport(row.panels[index], index);
          equal(row.panels[index].viewport.frame, row.panels[index].viewport.terminalFrame, 'No-JS declarative shadow DOM preserves the terminal real-component snapshot');
          const viewportBox = row.panels[index].viewport.box;
          check(viewportBox.width > 0 && viewportBox.height > 0 && viewportBox.bottom <= row.panels[index].box.bottom + 1, 'No-JS retains the whole naturally sized native viewport');
          check(row.panels[index].original.visible && row.panels[index].original.box.y >= viewportBox.bottom - 1, 'No-JS original PNG remains separately reachable below the demo');
          check(layout[index].text.includes(expected[index].title) && layout[index].text.includes(expected[index].description) && layout[index].text.includes(captionPrefix + expected[index].caption), 'No-JS exposes full description and demo boundary');
          check(layout[index].position !== 'absolute', 'No-JS does not overlay original readable panels');
          if (index) check(layout[index].top >= layout[index - 1].bottom, 'No-JS panels remain in readable document flow');
        }
      });
    }
  } catch (error) {
    errors.push({ label: 'runner', stack: error.stack });
    process.exitCode = 1;
  } finally {
    const report = { at: new Date().toISOString(), url, selection: selectedCase || 'all', assertions, casesPassed: rows.filter(row => row.status === 'passed').length, casesFailed: rows.filter(row => row.status === 'failed').length, rows, errors, diagnostics, screenshots, limitations: ['Chromium only; no Safari/Firefox or physical touch-device validation.', 'Back navigation is checked, without asserting BFCache use.', 'Visual masking is measured by CSS clipping, translation matrices and native-viewport/clip intersection; original PNG ratios are checked only in their modal; screenshots remain available for human review.'] };
    const reportName = process.env.PINNED_REPORT || 'pinned.json';
    if (path.basename(reportName) !== reportName || !reportName.startsWith('pinned')) throw new Error('PINNED_REPORT must be a pinned*.json basename');
    fs.writeFileSync(path.join(directory, reportName), JSON.stringify(report, null, 2));
    if (browser) await browser.close();
    console.log(`Pinned regression: ${report.casesPassed} passed, ${report.casesFailed} failed, ${assertions} assertions; ${screenshots.length} viewport screenshots`);
  }
})();
