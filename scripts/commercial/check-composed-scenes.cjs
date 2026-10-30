const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const portable = require('./browser.cjs');
portable.trackIdentity('composed-scenes');
const revision = '7295629889d881f3485168832359d16d141021f9';
const presentation = 'composed-v1';
const bundle = `${revision}-${presentation}`;
const names = ['delivery', 'training', 'knowledge'];
const matrix = [390, 1440].flatMap(width => ['light', 'dark'].map(theme => `${width}-${theme}-normal`)).concat('1440-light-reduced', '1440-light-nojs');
const cases = [...matrix, 'lifecycle', 'recovery', ...names.map(name => `${name}-cycle`), 'mobile-light-terminal', 'mobile-dark-terminal'];
if (process.env.MATRIX_CASE) assert(cases.includes(process.env.MATRIX_CASE), 'Invalid MATRIX_CASE');
const selected = value => !process.env.MATRIX_CASE || process.env.MATRIX_CASE === value;
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function checkProvenance() {
  const root = path.join(portable.project, 'public/product-scenes', bundle);
  const source = JSON.parse(fs.readFileSync(path.join(root, 'source-provenance.json'), 'utf8'));
  assert.equal(source.sourceRevision, revision);
  assert.deepEqual(source.scenes, names);
  assert.equal(source.sourceTreeBefore, source.sourceTreeAfter, 'build does not change product source');
  for (const [field, file] of Object.entries({ entryHash: 'entry.jsx', scenesHash: 'scenes.jsx', sceneStyleHash: 'scene.css', runtimeHash: 'fixture.js' })) assert.equal(source[field], hash(path.join(portable.project, 'scripts/product-scenes', file)), `${field} matches input`);
  for (const file of ['src/styles.css', 'src/layers.css', 'src/fonts.css', 'src/components/chat-message-presentation.tsx', 'src/components/agent-acp-timeline.tsx', 'src/pages/my-ai/formation-controller.ts', 'src/pages/knowledge-page.tsx', 'src/components/knowledge-rich-markdown.tsx']) assert.match(source.actualImports[file] || '', /^[a-f0-9]{64}$/, `original product import ${file}`);
  for (const [file, expected] of Object.entries(source.generatedFiles)) {
    const target = path.resolve(root, file);
    assert(target.startsWith(root + path.sep), 'bundle path must stay in bundle');
    assert.equal(hash(target), expected, `generated artifact ${file}`);
  }
}
function observe(page) {
  const errors = [], writes = [], external = [];
  page.on('pageerror', error => { errors.push(error.message); console.error(`PAGE ERROR ${error.stack || error.message}`); });
  page.on('request', request => { if (!['GET', 'HEAD'].includes(request.method())) writes.push(request.url()); if (new URL(request.url()).origin !== portable.base.origin) external.push(request.url()); });
  return () => { assert.deepEqual(errors, []); assert.deepEqual(writes, []); assert.deepEqual(external, []); };
}
async function ready(page, name) {
  const player = page.locator(`.focused-prototype[data-prototype="${name}"]`);
  await player.scrollIntoViewIfNeeded();
  try { await page.waitForFunction(name => document.querySelector(`.focused-prototype[data-prototype="${name}"]`)?.dataset.ready === 'true', name, { timeout: 15000 }); }
  catch (error) {
    const info = await player.evaluate(node => { const frame = node.querySelector('iframe'); return { dataset: { ...node.dataset }, url: frame?.contentDocument?.URL, state: frame?.contentDocument?.readyState, text: frame?.contentDocument?.body?.innerText.slice(0, 1000) }; });
    console.error(`READY FAILURE ${name}: ${JSON.stringify(info)}`); throw error;
  }
  const iframe = player.locator('iframe');
  assert.equal(await iframe.count(), 1);
  const url = new URL(await iframe.getAttribute('src'), portable.base);
  assert.equal(url.pathname, `${portable.siteBasePath}/product-scenes/${bundle}/index.html`);
  assert.equal(url.searchParams.get('scene'), name);
  assert.match(url.searchParams.get('attempt') || '', /^\d+$/);
  assert.equal(await player.getAttribute('data-presentation'), presentation);
  assert.equal(await player.getAttribute('data-source-revision'), revision);
  return { player, frame: page.frameLocator(`.focused-prototype[data-prototype="${name}"] iframe`) };
}
async function geometry(player, name, width, mode) {
  const viewport = player.locator('.source-demo-viewport');
  assert.equal(await player.locator('.source-demo-controls,.source-demo-footer,input[type=range],button[aria-label="播放动画"],button[aria-label="暂停动画"],button[aria-label="重新播放"]').count(), 0, 'no player controls');
  assert.equal(await player.locator('.source-demo-pan-hint').count(), 0, 'no pan hint');
  if (mode === 'nojs') { assert.equal(await player.locator('iframe').count(), 0); assert(await player.locator('.source-demo-static a').isVisible()); return; }
  const metrics = await viewport.evaluate(node => {
    const iframe = node.querySelector('iframe'), outer = node.getBoundingClientRect(), inner = iframe.getBoundingClientRect(), style = getComputedStyle(iframe);
    return { viewportWidth: outer.width, viewportHeight: outer.height, frameWidth: inner.width, frameHeight: inner.height, offsetX: inner.left - outer.left, offsetY: inner.top - outer.top, scrollWidth: node.scrollWidth, clientWidth: node.clientWidth, transform: style.transform, marginLeft: style.marginLeft, marginTop: style.marginTop };
  });
  const height = width <= 700 || name === 'delivery' ? 640 : 600;
  assert(Math.abs(metrics.viewportHeight - height) <= 2, `${name}: intended height ${JSON.stringify(metrics)}`);
  assert(Math.abs(metrics.frameWidth - metrics.viewportWidth) <= 2 && Math.abs(metrics.frameHeight - metrics.viewportHeight) <= 2, `${name}: iframe fits viewport ${JSON.stringify(metrics)}`);
  assert(Math.abs(metrics.offsetX) <= 1 && Math.abs(metrics.offsetY) <= 1 && metrics.transform === 'none' && parseFloat(metrics.marginLeft) >= 0 && parseFloat(metrics.marginTop) >= 0, `${name}: no cropping or scaling ${JSON.stringify(metrics)}`);
  assert(metrics.scrollWidth <= metrics.clientWidth + 1, `${name}: no horizontal pan ${JSON.stringify(metrics)}`);
  assert(await player.locator('.source-demo-caption').isVisible(), `${name}: sample-data label`);
}
async function matrixCase(browser, caseName) {
  const [w, theme, mode] = caseName.split('-'), width = Number(w);
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference', javaScriptEnabled: mode !== 'nojs' });
  const page = await context.newPage(), verify = observe(page);
  if (mode !== 'nojs') await page.addInitScript(value => localStorage.setItem('skymythos-theme', value), theme);
  await page.goto(portable.url, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.focused-prototype.source-composition').count(), 3);
  for (const section of ['autonomy', 'training', 'company-knowledge']) {
    const node = page.locator(`#${section}`);
    assert.equal(await node.locator('.harness-heading').count(), 1);
    assert.equal(await node.locator('.harness-feature-index').count(), 1);
  }
  for (const name of names) {
    let player = page.locator(`.focused-prototype[data-prototype="${name}"]`);
    if (mode === 'nojs') { await geometry(player, name, width, mode); continue; }
    const result = await ready(page, name); player = result.player;
    await geometry(player, name, width, mode);
    assert.equal(await result.frame.locator('html').getAttribute('data-theme'), theme);
    assert.equal(await result.frame.locator('html').getAttribute('theme-mode'), theme);
    assert.equal(await result.frame.locator('.product-shell').count(), 0, 'composed scene does not embed ProductShell');
    assert.equal(await player.locator('img,canvas').count(), 0);
    if (mode === 'reduced') {
      await page.waitForFunction(name => { const n = document.querySelector(`.focused-prototype[data-prototype="${name}"]`); return n?.dataset.playing === 'false' && Number(n.dataset.time) === Number(n.dataset.duration); }, name, { timeout: 15000 });
      const time = await player.getAttribute('data-time'); await page.waitForTimeout(5200);
      assert.equal(await player.getAttribute('data-time'), time, `${name}: reduced terminal stays static`);
    }
    await player.screenshot({ path: path.join(portable.evidence, `${caseName}-${name}.png`) });
  }
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no page overflow');
  verify();
  if (mode !== 'nojs') assert.deepEqual(await page.evaluate(() => Object.keys(localStorage).sort()), ['skymythos-theme']);
  await context.close(); console.log(`PASS ${caseName}`);
}
async function lifecycle(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage(), verify = observe(page);
  await page.goto(portable.url, { waitUntil: 'networkidle' });
  const { player, frame } = await ready(page, 'delivery');
  await player.locator('.source-demo-viewport').focus();
  await page.waitForFunction(() => Number(document.querySelector('.source-demo-delivery')?.dataset.time) >= 1000, null, { timeout: 8000 });
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForFunction(() => document.querySelector('.source-demo-delivery')?.dataset.playing === 'false');
  let stopped = await player.getAttribute('data-time'); await page.waitForTimeout(3500);
  assert.equal(await player.getAttribute('data-time'), stopped, 'hidden pauses without reset');
  await frame.locator('body').evaluate((body, revision) => parent.postMessage({ type: 'skymythos-product-demo', scene: 'delivery', sourceRevision: revision, presentation: 'wrong', ready: true, time: 12345, duration: 24000, playing: false, phase: 'forged' }, location.origin), revision);
  await page.waitForTimeout(100); assert.notEqual(await player.getAttribute('data-phase'), 'forged', 'wrong presentation rejected');
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForFunction(previous => Number(document.querySelector('.source-demo-delivery')?.dataset.time) > Number(previous), stopped, { timeout: 8000 });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForFunction(() => document.querySelector('.source-demo-delivery')?.dataset.playing === 'false');
  stopped = await player.getAttribute('data-time'); await page.waitForTimeout(3500);
  assert.equal(await player.getAttribute('data-time'), stopped, 'offscreen pauses without reset');
  await player.scrollIntoViewIfNeeded();
  await page.waitForFunction(previous => Number(document.querySelector('.source-demo-delivery')?.dataset.time) > Number(previous), stopped, { timeout: 8000 });
  assert.notEqual(await page.evaluate(() => document.activeElement?.tagName), 'IFRAME', 'animation does not steal focus');
  verify(); await context.close(); console.log('PASS lifecycle');
}
async function recovery(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } }), page = await context.newPage();
  const block = route => route.abort();
  await page.route(`**/product-scenes/${bundle}/assets/*.js`, block);
  await page.goto(portable.url, { waitUntil: 'networkidle' });
  const player = page.locator('.source-demo-delivery'); await player.scrollIntoViewIfNeeded();
  await player.getByText('产品演示暂时无法载入。').waitFor({ timeout: 16000 });
  assert(await player.getByRole('link', { name: /查看对应功能/ }).isVisible());
  await page.unroute(`**/product-scenes/${bundle}/assets/*.js`, block);
  await player.getByRole('button', { name: '重新载入演示' }).click();
  await page.waitForFunction(() => document.querySelector('.source-demo-delivery')?.dataset.ready === 'true', null, { timeout: 15000 });
  await context.close(); console.log('PASS recovery');
}
async function tickAt(page, name, time, timeout = 12000) {
  await page.waitForFunction(({ name, time }) => Number(document.querySelector(`.focused-prototype[data-prototype="${name}"]`)?.dataset.time) >= time, { name, time }, { timeout });
}
async function visibleInPlane(target, planeSelector, label, whole = false) {
  const info = await target.evaluate((element, selector) => {
    const plane = element.closest(selector), a = element.getBoundingClientRect(), b = plane?.getBoundingClientRect();
    if (!b) return null;
    const left = Math.max(a.left, b.left, 0), top = Math.max(a.top, b.top, 0), right = Math.min(a.right, b.right, innerWidth), bottom = Math.min(a.bottom, b.bottom, innerHeight);
    return { rect: { left: a.left, top: a.top, right: a.right, bottom: a.bottom, width: a.width, height: a.height }, plane: { left: b.left, top: b.top, right: b.right, bottom: b.bottom }, intersection: { width: Math.max(0, right - left), height: Math.max(0, bottom - top) }, opacity: getComputedStyle(plane).opacity, visibility: getComputedStyle(plane).visibility };
  }, planeSelector);
  assert(info && info.visibility !== 'hidden' && Number(info.opacity) > 0 && info.intersection.width >= 4 && info.intersection.height >= 4, `${label}: visible in plane ${JSON.stringify(info)}`);
  if (whole) assert(info.intersection.width >= info.rect.width - 2 && info.intersection.height >= info.rect.height - 2, `${label}: fully inside plane ${JSON.stringify(info)}`);
}
async function checkTerminal(frame, name) {
  if (name === 'delivery') await visibleInPlane(frame.locator('[data-plane="report"]').getByText('检查完成，等待人工验收。', { exact: true }), '[data-plane="report"]', 'report acceptance');
  if (name === 'training') await visibleInPlane(frame.locator('[data-plane="analysis"]').getByRole('button', { name: /确认方案并创建员工/ }), '[data-plane="analysis"]', 'confirmation button');
  if (name === 'knowledge') {
    const doc = frame.locator('[data-plane="doc"]');
    assert.equal(await doc.getAttribute('data-document-id'), 'release-guide');
    assert.equal(await doc.getAttribute('data-base-id'), 'example-runbook');
    assert.equal(await doc.getAttribute('data-revision'), 'rev-1');
    await visibleInPlane(doc.getByText('确认回滚权限与目标版本。', { exact: false }), '[data-plane="doc"]', 'original source');
  }
}
async function checkInitialTask(frame) {
  const article = frame.locator('[data-plane="task"] article').first();
  assert((await article.innerText()).includes('请核对本次发布准备情况，整理检查结果与待处理问题；执行完成后等待人工验收。'), 'complete task text');
  await visibleInPlane(article, '[data-plane="task"]', 'initial task', true);
}
async function cycle(browser, name) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: portable.evidence, size: { width: 1440, height: 900 } } });
  const page = await context.newPage(), verify = observe(page);
  await page.goto(portable.url, { waitUntil: 'networkidle' });
  const { player, frame } = await ready(page, name);
  await player.locator('.source-demo-viewport').focus();
  await player.evaluate(node => { window.__cycleLog = []; const record = () => window.__cycleLog.push({ time: Number(node.dataset.time), duration: Number(node.dataset.duration), playing: node.dataset.playing, at: performance.now() }); new MutationObserver(record).observe(node, { attributes: true, attributeFilter: ['data-time', 'data-playing'] }); record(); });
  await frame.locator('body').evaluate(() => { window.__controlLog = []; window.addEventListener('message', event => { if (event.data?.type === 'skymythos-product-demo-control') window.__controlLog.push({ action: event.data.action, at: parent.performance.now() }); }); });
  const root = frame.locator(`[data-scene="${name}"]`); await root.waitFor();
  if (name === 'delivery') {
    assert(await frame.locator('[data-plane="task"]').getByText('发布准备检查', { exact: false }).count());
    const execution = frame.locator('[data-plane="execution"]');
    await tickAt(page, name, 2000);
    assert.equal(await execution.evaluate(node => Number(getComputedStyle(node).opacity)), 0, 'execution is transparent while initial task is presented');
    await checkInitialTask(frame);
    await player.screenshot({ path: path.join(portable.evidence, 'delivery-natural-2s.png') });
    await tickAt(page, name, 4000);
    const early = await execution.innerText();
    await tickAt(page, name, 8000);
    const later = await execution.innerText();
    assert(later.length > early.length, `native tool output grows ${JSON.stringify({ early, later })}`);
    await tickAt(page, name, 13000);
    const second = execution.locator('[data-slot="agent-tool-activity"]').nth(1);
    await visibleInPlane(second.locator('pre').filter({ hasText: 'release-check --dry-run' }), '[data-plane="execution"]', 'second tool input');
    await visibleInPlane(second.locator('pre').filter({ hasText: 'PASS 配置完整' }), '[data-plane="execution"]', 'second tool output');
    await player.screenshot({ path: path.join(portable.evidence, 'delivery-natural-13s.png') });
    await tickAt(page, name, 17500);
    const reportEarly = await frame.locator('[data-plane="report"]').innerText();
    await tickAt(page, name, 22000);
    const reportFinal = await frame.locator('[data-plane="report"]').innerText();
    assert(reportFinal.length > reportEarly.length && reportFinal.includes('发布准备检查报告') && reportFinal.includes('等待人工验收'), 'report grows to complete result');
  } else if (name === 'training') {
    assert(await frame.locator('[data-plane="source"]').getByText('从经验创建员工', { exact: false }).count());
    await tickAt(page, name, 8000);
    await page.waitForFunction(name => Number(document.querySelector(`.focused-prototype[data-prototype="${name}"]`)?.dataset.time) >= 15000, name, { timeout: 12000 });
    const analysis = frame.locator('[data-plane="analysis"]');
    await analysis.getByText('确认员工方案', { exact: false }).first().waitFor({ timeout: 5000 });
    assert.equal(await frame.locator('body').evaluate(() => window.__reference.getFormationStatus()), 'awaiting_confirmation');
    const fixture = await frame.locator('body').evaluate(() => window.__reference);
    assert.equal(fixture.simulatedWrites.filter(item => item.path === 'formation.form').length, 1, 'one analysis operation');
    assert(!fixture.simulatedWrites.some(item => /confirm/i.test(item.path)), 'no confirmation');
  } else {
    await tickAt(page, name, 6500);
    assert.equal(await frame.locator('[data-knowledge-search-input]').inputValue(), '回滚条件');
    await frame.getByRole('button', { name: /发布回滚指南/ }).first().waitFor({ timeout: 4000 });
    await frame.locator('[data-plane="doc"]').waitFor({ timeout: 8000 });
    const documentPlane = frame.locator('[data-plane="doc"]');
    assert.equal(await documentPlane.getAttribute('data-document-id'), 'release-guide');
    assert.equal(await documentPlane.getAttribute('data-base-id'), 'example-runbook');
    assert.equal(await documentPlane.getAttribute('data-revision'), 'rev-1');
    const doc = await documentPlane.innerText();
    assert(doc.includes('发布回滚指南') && doc.includes('回滚条件') && doc.includes('确认回滚权限与目标版本'), `native source document ${doc}`);
    const fixture = await frame.locator('body').evaluate(() => window.__reference);
    assert(fixture.requests.some(item => item.path === '/api/v1/knowledge-base/search'), 'example search read is recorded');
  }
  const fixture = await frame.locator('body').evaluate(() => window.__reference);
  assert.deepEqual(fixture.unknown, []); assert.deepEqual(fixture.writes, []);
  await tickAt(page, name, 23500, 26000);
  await checkTerminal(frame, name);
  await player.screenshot({ path: path.join(portable.evidence, `${name}-complete.png`) });
  await page.waitForFunction(name => { const n = document.querySelector(`.focused-prototype[data-prototype="${name}"]`); return n?.dataset.playing === 'false' && Number(n.dataset.time) === Number(n.dataset.duration); }, name, { timeout: 26000 });
  await page.waitForFunction(() => { const log = window.__cycleLog; const end = log.findIndex(v => v.duration && v.time === v.duration && v.playing === 'false'); return end >= 0 && log.slice(end + 1).some(v => v.time < 1000 && v.playing === 'true'); }, null, { timeout: 10000 });
  const log = await page.evaluate(() => window.__cycleLog), end = log.findIndex(v => v.duration && v.time === v.duration && v.playing === 'false');
  const replay = (await frame.locator('body').evaluate(() => window.__controlLog)).find(v => v.action === 'replay' && v.at >= log[end].at);
  assert(replay && replay.at - log[end].at >= 2800 && replay.at - log[end].at <= 3800, `${name}: replay after 3s ${JSON.stringify({ terminal: log[end], replay })}`);
  assert(await player.locator('.source-demo-viewport').evaluate(node => document.activeElement === node), `${name}: retains parent focus across replay`);
  verify();
  fs.writeFileSync(path.join(portable.evidence, `${name}-cycle.json`), JSON.stringify({ replayDispatchMs: replay.at - log[end].at, fixture, log }, null, 2));
  const video = await page.video().path(); await context.close(); fs.renameSync(video, path.join(portable.evidence, `${name}-cycle.webm`));
  console.log(`PASS ${name}-cycle`);
}
async function mobileTerminal(browser, theme) {
  const context = await browser.newContext({ viewport: { width: 390, height: 900 }, colorScheme: theme });
  const page = await context.newPage(), verify = observe(page);
  const captures = [];
  await page.addInitScript(value => localStorage.setItem('skymythos-theme', value), theme);
  await page.goto(portable.url, { waitUntil: 'networkidle' });
  for (const name of names) {
    const { player, frame } = await ready(page, name);
    const parentScroll = await page.evaluate(() => scrollY);
    const frameScroll = await frame.locator('body').evaluate(() => scrollY);
    if (name === 'delivery') {
      await tickAt(page, name, 2000);
      assert.equal(await frame.locator('[data-plane="execution"]').evaluate(node => Number(getComputedStyle(node).opacity)), 0, 'mobile initial task is unobscured');
      await checkInitialTask(frame);
      await player.screenshot({ path: path.join(portable.evidence, `mobile-${theme}-delivery-natural-2s.png`) });
      await tickAt(page, name, 13000);
      const second = frame.locator('[data-plane="execution"] [data-slot="agent-tool-activity"]').nth(1);
      await visibleInPlane(second.locator('pre').filter({ hasText: 'release-check --dry-run' }), '[data-plane="execution"]', 'mobile second tool input');
      await visibleInPlane(second.locator('pre').filter({ hasText: 'PASS 配置完整' }), '[data-plane="execution"]', 'mobile second tool output');
      await player.screenshot({ path: path.join(portable.evidence, `mobile-${theme}-delivery-natural-13s.png`) });
    }
    await tickAt(page, name, 23500, 30000);
    await checkTerminal(frame, name);
    assert.equal(await page.evaluate(() => scrollY), parentScroll, `${name}: automatic progression does not scroll parent`);
    assert.equal(await frame.locator('body').evaluate(() => scrollY), frameScroll, `${name}: automatic progression does not scroll iframe document`);
    const fixture = await frame.locator('body').evaluate(() => window.__reference);
    assert.deepEqual(fixture.unknown, []); assert.deepEqual(fixture.writes, []);
    await player.screenshot({ path: path.join(portable.evidence, `mobile-terminal-${theme}-${name}.png`) });
    captures.push({ scene: name, time: Number(await player.getAttribute('data-time')) });
  }
  fs.writeFileSync(path.join(portable.evidence, `mobile-terminal-${theme}.json`), JSON.stringify(captures, null, 2));
  verify(); await context.close(); console.log(`PASS mobile-${theme}-terminal`);
}
(async () => {
  checkProvenance();
  const browser = await portable.launch();
  try {
    for (const name of matrix) if (selected(name)) await matrixCase(browser, name);
    for (const name of names) if (selected(`${name}-cycle`)) await cycle(browser, name);
    for (const theme of ['light', 'dark']) if (selected(`mobile-${theme}-terminal`)) await mobileTerminal(browser, theme);
    if (selected('lifecycle')) await lifecycle(browser);
    if (selected('recovery')) await recovery(browser);
  } finally { await browser.close(); }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
