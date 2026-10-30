const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const portable = require('./browser.cjs');
portable.trackIdentity('harness');
const revision = '14f40b0fc37f7a20eeab00293e3527725552a255';
const revisions = { delivery: revision, training: revision, knowledge: '7295629889d881f3485168832359d16d141021f9' };
const names = ['delivery', 'training', 'knowledge'];
const matrix = [390, 1440].flatMap(width => ['light', 'dark'].flatMap(theme => ['normal', 'nojs'].map(mode => `${width}-${theme}-${mode}`))).concat('1440-light-reduced', '1150-light-normal', '1151-light-normal');
const cases = [...matrix, 'delivery-cycle', 'sample-cycles', 'visibility'];
if (process.env.MATRIX_CASE) assert(cases.includes(process.env.MATRIX_CASE), 'Invalid MATRIX_CASE');
assert(!(process.env.FOCUS_ONLY || process.env.CONTROLS_ONLY), 'FOCUS_ONLY and CONTROLS_ONLY are no longer supported');
for (const [name, sourceRevision] of Object.entries(revisions)) {
  const source = JSON.parse(fs.readFileSync(path.join(portable.project, 'public/product-demo', sourceRevision, 'source-provenance.json'), 'utf8'));
  assert.equal(source.sourceRevision, sourceRevision);
  const imports = ['src/components/product-shell.tsx', 'src/pages/workspace-chat-page.tsx', 'src/pages/knowledge-page.tsx', 'src/styles.css', 'src/layers.css', 'node_modules/tdesign-react/dist/tdesign.css'];
  if (name !== 'knowledge') imports.push('src/pages/my-ai/formation-page.tsx');
  for (const file of imports) assert.match(source.actualImports[file] || '', /^[a-f0-9]{64}$/, `${name}: source hash ${file}`);
}
function selected(name) { return !process.env.MATRIX_CASE || process.env.MATRIX_CASE === name; }
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
    const diagnostic = await player.evaluate(node => { const iframe = node.querySelector('iframe'); let frame; try { const doc = iframe?.contentDocument; frame = { url: doc?.URL, readyState: doc?.readyState, body: doc?.body?.innerText.slice(0, 1000) }; } catch (failure) { frame = { error: String(failure) }; } return { dataset: { ...node.dataset }, frame }; });
    console.error(`READY FAILURE ${name}: ${JSON.stringify(diagnostic)}`); throw error;
  }
  const iframe = player.locator('iframe');
  assert.equal(await iframe.count(), 1);
  const url = new URL(await iframe.getAttribute('src'), portable.base);
  assert.equal(url.pathname, `${portable.siteBasePath}/product-demo/${revisions[name]}/index.html`);
  assert.equal(url.searchParams.get('scene'), name);
  assert.match(url.searchParams.get('attempt') || '', /^\d+$/);
  return { player, frame: page.frameLocator(`.focused-prototype[data-prototype="${name}"] iframe`) };
}
async function sample(player, time) {
  // 仅在测试中采样既有演示时钟协议；页面并未提供用户 seek 功能。
  await player.locator('iframe').evaluate((iframe, time) => new Promise((resolve, reject) => {
    const scene = iframe.closest('.focused-prototype').dataset.prototype;
    const timeout = setTimeout(() => { window.removeEventListener('message', receive); reject(new Error(`seek acknowledgement timed out: ${scene} ${time}`)); }, 15000);
    function receive(event) {
      const value = event.data;
      if (event.source !== iframe.contentWindow || event.origin !== location.origin || value?.type !== 'skymythos-product-demo' || value.scene !== scene || value.time !== time || value.playing !== false || !value.ready) return;
      clearTimeout(timeout); window.removeEventListener('message', receive); resolve();
    }
    window.addEventListener('message', receive);
    iframe.contentWindow.postMessage({ type: 'skymythos-product-demo-control', scene, action: 'seek', time }, location.origin);
  }), time);
}
async function terminal(page, name) {
  await page.waitForFunction(name => { const n = document.querySelector(`.focused-prototype[data-prototype="${name}"]`); return n?.dataset.ready === 'true' && Number(n.dataset.time) === Number(n.dataset.duration) && n.dataset.playing === 'false'; }, name, { timeout: 30000 });
}
async function checkChrome(player, mode, width, name) {
  const stage = player.locator('.source-demo-stage'), viewport = player.locator('.source-demo-viewport');
  assert.equal(await stage.count(), 1);
  assert.equal(await stage.locator('.source-demo-viewport').count(), 1);
  assert.equal(await player.locator('.source-demo-footer, .source-demo-controls, input[type=range], button[aria-label="播放动画"], button[aria-label="暂停动画"], button[aria-label="重新播放"]').count(), 0, 'no playback controls in DOM');
  const layout = await player.evaluate(node => {
    const rect = element => { const { left, top, right, bottom, width, height } = element.getBoundingClientRect(); return { left, top, right, bottom, width, height }; };
    const stage = node.querySelector('.source-demo-stage'), hint = node.querySelector('.source-demo-pan-hint');
    return { player: rect(node), stage: rect(stage), viewport: rect(stage.querySelector('.source-demo-viewport')), hint: hint && getComputedStyle(hint).display !== 'none' ? rect(hint) : null };
  });
  const inside = (outer, inner) => inner.left >= outer.left - 1 && inner.right <= outer.right + 1 && inner.top >= outer.top - 1 && inner.bottom <= outer.bottom + 1;
  assert(inside(layout.stage, layout.viewport), `viewport inside stage ${JSON.stringify(layout)}`);
  assert(Math.abs(layout.player.bottom - (layout.hint?.bottom ?? layout.stage.bottom)) <= 2, `no extra footer space ${JSON.stringify(layout)}`);
  if (layout.hint) assert(layout.hint.top - layout.stage.bottom <= 2, `pan hint follows stage ${JSON.stringify(layout)}`);
  if (mode === 'nojs') return;
  const expectedHeight = width <= 700 ? (name === 'knowledge' ? 540 : 640) : name === 'delivery' ? 700 : 540;
  assert(Math.abs(layout.viewport.height - expectedHeight) <= 2, `${name}: viewport height ${JSON.stringify(layout.viewport)}`);
  if (width >= 1440) {
    if (name === 'training') assert(layout.viewport.width >= 600 && layout.viewport.width <= 722, `training split window ${JSON.stringify(layout.viewport)}`);
    else assert(layout.viewport.width >= 1100 && layout.viewport.width <= 1202, `${name}: full-width window ${JSON.stringify(layout.viewport)}`);
  }
  const frameWidth = await viewport.locator('iframe').evaluate(node => node.getBoundingClientRect().width);
  if (width <= 700 || name === 'training') assert(Math.abs(frameWidth - 960) <= 2, `${name}: native 960px frame ${frameWidth}`);
  if (name === 'training') {
    await player.page().waitForFunction(() => {
      const node = document.querySelector('.source-demo-training .source-demo-viewport');
      if (!node || Math.abs(node.scrollLeft - 240) > 1) { if (node) delete node.dataset.testPanStableAt; return false; }
      node.dataset.testPanStableAt ||= String(performance.now());
      return performance.now() - Number(node.dataset.testPanStableAt) >= 200;
    }, null, { timeout: 5000 });
    await viewport.evaluate(node => { delete node.dataset.testPanStableAt; });
  }
  const badge = stage.getByText('示例数据', { exact: true });
  assert(await badge.isVisible(), 'sample data badge visible');
  const box = await badge.boundingBox();
  assert(box && inside(layout.viewport, { left: box.x, top: box.y, right: box.x + box.width, bottom: box.y + box.height }), 'sample data badge inside viewport');
  if (width <= 390) {
    const pan = await viewport.evaluate(node => ({ width: node.clientWidth, content: node.scrollWidth, label: node.getAttribute('aria-label'), scrollLeft: node.scrollLeft }));
    assert(pan.content >= 960 && pan.content > pan.width && pan.label.includes('左右浏览'), `mobile full page pans ${JSON.stringify(pan)}`);
    await viewport.evaluate(node => { node.scrollLeft = 200; });
    const after = await badge.boundingBox();
    assert(Math.abs(after.x - box.x) <= 1 && Math.abs(after.y - box.y) <= 1, 'badge remains fixed while panning');
    await viewport.evaluate((node, value) => { node.scrollLeft = value; }, pan.scrollLeft);
  }
}
async function checkSource(frame, name, theme, width) {
  assert.equal(await frame.locator('html').getAttribute('data-theme'), theme);
  assert.equal(await frame.locator('html').getAttribute('theme-mode'), theme);
  assert(await frame.locator('.product-shell').count());
  assert(await frame.locator('nav, [role=navigation]').count());
  assert(await frame.locator('header').count());
  assert(await frame.locator(name === 'delivery' ? '[data-slot=chat-header]' : '[data-slot=page-header]').count());
  const metrics = await frame.locator('.product-shell').evaluate(node => { const rect = node.getBoundingClientRect(); const text = [...node.querySelectorAll('button, h1, h2')].find(el => el.getBoundingClientRect().width && parseFloat(getComputedStyle(el).fontSize) >= 12); return { width: rect.width, viewport: innerWidth, fontSize: text && parseFloat(getComputedStyle(text).fontSize) }; });
  assert(metrics.width >= metrics.viewport - 2 && metrics.fontSize >= 12, `${name}: native readable page ${JSON.stringify(metrics)}`);
  if (name === 'delivery' && width <= 390) { const chat = await frame.locator('[data-slot=workspace-chat-pane]').boundingBox(); assert(chat && chat.width >= 260, `mobile chat pane ${JSON.stringify(chat)}`); }
  const layout = await frame.locator('body').evaluate(body => ({ flex: [...body.querySelectorAll('.flex')].some(node => getComputedStyle(node).display === 'flex'), styles: [...document.querySelectorAll('link[rel=stylesheet]')].map(link => link.href) }));
  assert(layout.flex && layout.styles.some(href => href.includes('/product-demo/') && href.endsWith('.css')), `${name}: source CSS ${JSON.stringify(layout)}`);
  const text = await frame.locator('body').innerText();
  for (const invented of ['安排执行', '每晚 02:00', '保存方法到公司知识库', '引用企业方法']) assert(!text.includes(invented), `${name}: invented control ${invented}`);
}
async function fixture(frame, name) {
  const value = await frame.locator('body').evaluate(() => window.__reference);
  assert.deepEqual(value.unknown, [], `${name}: unknown API requests`);
  assert.deepEqual(value.writes, [], `${name}: no business writes`);
  return value;
}
async function checkNarrative(page, width) {
  const ids = ['product', 'training', 'company-knowledge', 'security-governance', 'product-proof', 'product-access'];
  const sections = await page.evaluate(ids => ids.map(id => { const node = document.getElementById(id); const rect = node?.getBoundingClientRect(); return { id, tag: node?.tagName, top: rect?.top, bottom: rect?.bottom }; }), ids);
  for (let i = 0; i < sections.length; i++) {
    assert.equal(sections[i].tag, 'SECTION', `${ids[i]} is a narrative section`);
    if (i) assert(sections[i].top >= sections[i - 1].bottom - 1, `narrative order ${JSON.stringify(sections)}`);
  }
  assert.equal(await page.locator('.harness-workflow li').count(), 3);
  assert.equal(await page.locator('.harness-governance-details > a').count(), 3);
  assert.equal(await page.locator('.harness-resource-list > a').count(), 3);
  const anchors = await page.locator('.harness-home a[href^="#"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  assert(anchors.includes('#autonomy'), 'hero links to working demo');
  for (const anchor of anchors) assert.equal(await page.locator(`[id="${anchor.slice(1)}"]`).count(), 1, `anchor target ${anchor}`);
  for (const id of ['autonomy', 'workflow', 'digital-employees', 'people-and-teams', 'governance', 'solutions', 'resources']) assert.equal(await page.locator(`[id="${id}"]`).count(), 1, `navigation target ${id}`);
  const copy = await page.locator('.harness-training .harness-chapter-copy').boundingBox(), visual = await page.locator('.harness-training-visual').boundingBox();
  assert(copy && visual, 'training text and demo are visible');
  if (width > 1150) assert(copy.x + copy.width <= visual.x + 1, `desktop training is split ${JSON.stringify({ copy, visual })}`);
  else assert(visual.y >= copy.y + copy.height - 1, `training stacks at 1150px and below ${JSON.stringify({ copy, visual })}`);
}
async function checkMatrix(browser, caseName) {
  const [widthString, theme, mode] = caseName.split('-'), width = Number(widthString);
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference', javaScriptEnabled: mode !== 'nojs' });
  const page = await context.newPage(), verify = observe(page);
  if (mode !== 'nojs') await page.addInitScript(value => localStorage.setItem('skymythos-theme', value), theme);
  await page.goto(portable.url, { waitUntil: 'networkidle' });
  await checkNarrative(page, width);
  assert.equal(await page.locator('.focused-prototype').count(), 3);
  for (const name of names) {
    const player = page.locator(`.focused-prototype[data-prototype="${name}"]`);
    assert.equal(await player.getAttribute('data-source-revision'), revisions[name]);
    if (mode === 'nojs') { await checkChrome(player, mode, width, name); assert.equal(await player.locator('iframe').count(), 0); assert(await player.locator('.source-demo-static a').isVisible()); continue; }
    const { frame } = await ready(page, name);
    await checkChrome(player, mode, width, name);
    assert.equal(await player.locator('img,canvas').count(), 0);
    await checkSource(frame, name, theme, width);
    if (mode === 'reduced') {
      await terminal(page, name);
      const state = await player.getAttribute('data-time');
      await page.waitForTimeout(5200);
      assert.equal(await player.getAttribute('data-time'), state, `${name}: reduced terminal remains static`);
      assert.equal(await player.getAttribute('data-playing'), 'false');
      await fixture(frame, name);
    }
    await player.screenshot({ path: path.join(portable.evidence, `${caseName}-${name}.png`) });
  }
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${caseName}: no page overflow`);
  verify();
  if (mode !== 'nojs') assert.deepEqual(await page.evaluate(() => Object.keys(localStorage).sort()), ['skymythos-theme']);
  await context.close(); console.log(`PASS ${caseName}`);
}
async function deliveryCycle(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: portable.evidence, size: { width: 1440, height: 900 } } });
  const page = await context.newPage(), verify = observe(page);
  await page.addInitScript(() => { window.__focusLog = []; for (const type of ['focusin', 'focusout']) document.addEventListener(type, event => window.__focusLog.push({ type, target: event.target?.outerHTML?.slice(0, 300), at: performance.now() }), true); });
  await page.goto(portable.url, { waitUntil: 'networkidle' });
  const { player, frame } = await ready(page, 'delivery');
  await player.locator('.source-demo-viewport').focus();
  await player.evaluate(node => { window.__cycleLog = []; const record = () => window.__cycleLog.push({ time: Number(node.dataset.time), duration: Number(node.dataset.duration), playing: node.dataset.playing, at: performance.now() }); new MutationObserver(record).observe(node, { attributes: true, attributeFilter: ['data-time', 'data-playing'] }); record(); });
  await frame.locator('body').evaluate(() => { window.__controlLog = []; window.addEventListener('message', event => { if (event.data?.type === 'skymythos-product-demo-control') window.__controlLog.push({ action: event.data.action, at: parent.performance.now() }); }); });
  await frame.locator('.product-shell').evaluate(node => { window.__originalShell = node; });
  await page.waitForFunction(() => Number(document.querySelector('.focused-prototype[data-prototype=delivery]')?.dataset.time) >= 1500, null, { timeout: 12000 });
  assert((await frame.locator('[data-interaction-draft]').innerText()).length > 0, 'automatic input occurs');
  await page.waitForFunction(() => Number(document.querySelector('.focused-prototype[data-prototype=delivery]')?.dataset.time) >= 7000, null, { timeout: 12000 });
  assert(await frame.locator('.product-shell').evaluate(node => node === window.__originalShell), 'same shell after send');
  assert(await frame.locator('[data-slot=chat-execution-detail]').isVisible(), 'execution detail opens');
  await terminal(page, 'delivery');
  assert(await frame.locator('.product-shell').evaluate(node => node === window.__originalShell), 'same shell through report');
  assert.equal(await frame.locator('[data-slot=chat-execution-detail]').count(), 0);
  assert((await frame.locator('body').innerText()).includes('发布准备检查报告'));
  assert(!(await frame.locator('[data-slot=execution-detail-summary]').innerText()).includes('执行中'));
  assert.equal(await frame.getByRole('button', { name: /停止/ }).count(), 0);
  assert.equal(await frame.locator('body').evaluate(() => window.__reference.getTurnStatus()), 'succeeded');
  assert((await fixture(frame, 'delivery')).simulatedWrites.some(item => item.scope === 'memory'), 'real in-memory send');
  await page.waitForFunction(() => { const entries = window.__cycleLog; const end = entries.findIndex(e => e.duration > 0 && e.time === e.duration && e.playing === 'false'); return end >= 0 && entries.slice(end + 1).some(e => e.time < 1000 && e.playing === 'true'); }, null, { timeout: 10000 });
  const log = await page.evaluate(() => window.__cycleLog);
  const end = log.findIndex(e => e.duration > 0 && e.time === e.duration && e.playing === 'false');
  const next = log.slice(end + 1).find(e => e.time < 1000 && e.playing === 'true');
  const replay = (await frame.locator('body').evaluate(() => window.__controlLog)).find(e => e.action === 'replay' && e.at >= log[end].at);
  assert(replay && replay.at - log[end].at >= 2800 && replay.at - log[end].at <= 3800, `replay dispatched after ~3s: ${JSON.stringify({ terminal: log[end], replay })}`);
  await page.waitForFunction(() => Number(document.querySelector('.focused-prototype[data-prototype=delivery]')?.dataset.time) >= 1500, null, { timeout: 8000 });
  assert((await frame.locator('[data-interaction-draft]').innerText()).length > 0, 'new cycle inputs again');
  const focus = await page.evaluate(() => ({ active: document.activeElement?.outerHTML?.slice(0, 400), log: window.__focusLog }));
  fs.writeFileSync(path.join(portable.evidence, 'delivery-focus.json'), JSON.stringify(focus, null, 2));
  assert(await player.locator('.source-demo-viewport').evaluate(node => document.activeElement === node), `automatic cycle preserves parent focus: ${JSON.stringify(focus)}`);
  verify();
  const video = await page.video().path(); await context.close();
  fs.renameSync(video, path.join(portable.evidence, 'delivery-cycle.webm'));
  fs.writeFileSync(path.join(portable.evidence, 'delivery-cycle.json'), JSON.stringify({ replayDispatchMs: replay.at - log[end].at, restartMs: next.at - log[end].at, log }, null, 2));
  console.log('PASS delivery-cycle');
}
async function sampleCycles(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage(), verify = observe(page);
  await page.goto(portable.url, { waitUntil: 'networkidle' });
  for (const name of ['training', 'knowledge']) {
    const { player, frame } = await ready(page, name);
    await player.locator('.source-demo-viewport').focus();
    if (name === 'knowledge') {
      await page.waitForFunction(() => Number(document.querySelector('.focused-prototype[data-prototype=knowledge]')?.dataset.time) >= 6000, null, { timeout: 10000 });
      assert.equal(await frame.locator('[data-slot="page-search"] input').inputValue(), '发布');
      let text = await frame.locator('body').innerText();
      assert(text.includes('团队发布手册') && !text.includes('交付验收标准'), 'search filters native directory');
      await page.waitForFunction(() => Number(document.querySelector('.focused-prototype[data-prototype=knowledge]')?.dataset.time) >= 15000, null, { timeout: 12000 });
      const shared = await frame.locator('[data-slot="page-toolbar"] [role="combobox"]').innerText();
      assert(shared.includes('共享给我的'), `shared scope at 15000: ${JSON.stringify({ shared, time: await player.getAttribute('data-time'), phase: await player.getAttribute('data-phase'), body: (await frame.locator('body').innerText()).slice(0, 1800) })}`);
      text = await frame.locator('body').innerText();
      assert(text.includes('产品说明') && !text.includes('团队发布手册'), 'shared scope filters directory');
      await page.waitForFunction(() => Number(document.querySelector('.focused-prototype[data-prototype=knowledge]')?.dataset.time) >= 19500, null, { timeout: 8000 });
      assert((await frame.locator('[data-slot="page-toolbar"] [role="combobox"]').innerText()).includes('Workspace 知识库'));
      text = await frame.locator('body').innerText();
      assert(text.includes('团队发布手册') && !text.includes('产品说明'), 'workspace scope filters directory');
    }
    if (name === 'training') await sample(player, Number(await player.getAttribute('data-duration')));
    await terminal(page, name);
    if (name === 'training') assert((await frame.locator('body').innerText()).includes('确认员工方案'));
    else {
      assert.equal(await frame.locator('[data-slot="page-search"] input').inputValue(), '');
      assert((await frame.locator('[data-slot="page-toolbar"] [role="combobox"]').innerText()).includes('全部知识'));
      const text = await frame.locator('body').innerText();
      assert(text.includes('团队发布手册') && text.includes('产品说明'), 'terminal directory includes both scopes');
    }
    await fixture(frame, name);
    const end = Date.now();
    await page.waitForFunction(name => { const n = document.querySelector(`.focused-prototype[data-prototype="${name}"]`); return n?.dataset.playing === 'true' && Number(n.dataset.time) < 1000; }, name, { timeout: 8000 });
    assert(Date.now() - end >= 2600, `${name}: terminal hold`);
    if (name === 'training') { assert(!(await frame.locator('body').innerText()).includes('确认员工方案')); assert((await frame.locator('#formation-goal').inputValue()).length < '负责发布前检查：核对配置和回滚条件，输出检查结果与待处理问题。'.length); }
    else { assert.equal(await frame.locator('[data-slot="page-search"] input').inputValue(), ''); assert((await frame.locator('[data-slot="page-toolbar"] [role="combobox"]').innerText()).includes('全部知识')); }
    assert(await player.locator('.source-demo-viewport').evaluate(node => document.activeElement === node), `${name}: focus retained`);
    await page.waitForFunction(({ name, time }) => Number(document.querySelector(`.focused-prototype[data-prototype="${name}"]`)?.dataset.time) >= time, { name, time: name === 'knowledge' ? 4500 : 1500 }, { timeout: 8000 });
    const input = frame.locator(name === 'training' ? '#formation-goal' : '[data-slot="page-search"] input');
    assert((await input.inputValue()).length > 0, `${name}: new cycle inputs again`);
  }
  verify(); await context.close(); console.log('PASS sample-cycles');
}
async function visibility(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage(), verify = observe(page);
  await page.goto(portable.url, { waitUntil: 'networkidle' });
  const { player } = await ready(page, 'delivery');
  await page.waitForFunction(() => Number(document.querySelector('.focused-prototype[data-prototype=delivery]')?.dataset.time) >= 1000, null, { timeout: 8000 });
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForFunction(() => document.querySelector('.focused-prototype[data-prototype=delivery]')?.dataset.playing === 'false');
  let stopped = await player.getAttribute('data-time'); await page.waitForTimeout(3500);
  assert.equal(await player.getAttribute('data-time'), stopped, 'hidden stable without reset');
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForFunction(previous => Number(document.querySelector('.focused-prototype[data-prototype=delivery]')?.dataset.time) > Number(previous), stopped, { timeout: 8000 });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForFunction(() => document.querySelector('.focused-prototype[data-prototype=delivery]')?.dataset.playing === 'false');
  stopped = await player.getAttribute('data-time'); await page.waitForTimeout(3500);
  assert.equal(await player.getAttribute('data-time'), stopped, 'offscreen stable without reset');
  await player.scrollIntoViewIfNeeded();
  await page.waitForFunction(previous => Number(document.querySelector('.focused-prototype[data-prototype=delivery]')?.dataset.time) > Number(previous), stopped, { timeout: 8000 });
  // 在终态同样验证计时器撤销；恢复后由父页面自行安排新周期。
  for (const reason of ['hidden', 'offscreen']) {
    await sample(player, Number(await player.getAttribute('data-duration')));
    await terminal(page, 'delivery');
    if (reason === 'hidden') await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
    else await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(3500);
    assert.equal(await player.getAttribute('data-time'), await player.getAttribute('data-duration'), `${reason}: terminal does not reset`);
    assert.equal(await player.getAttribute('data-playing'), 'false');
    await page.evaluate(({ revision }) => window.postMessage({ type: 'skymythos-product-demo', scene: 'delivery', ready: true, sourceRevision: revision, time: 12345, duration: 16000, playing: false, phase: 'forged' }, location.origin), { revision });
    await page.waitForTimeout(100);
    assert.notEqual(await player.getAttribute('data-phase'), 'forged', 'rejects wrong message source');
    if (reason === 'hidden') await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    else await player.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => { const n = document.querySelector('.focused-prototype[data-prototype=delivery]'); return n?.dataset.playing === 'true' && Number(n.dataset.time) < 1000; }, null, { timeout: 8000 });
  }
  await sample(player, Number(await player.getAttribute('data-duration')));
  await terminal(page, 'delivery');
  await player.locator('iframe').evaluate(iframe => { iframe.contentWindow.__terminalShell = iframe.contentDocument.querySelector('.product-shell'); });
  await page.waitForFunction(() => { const iframe = document.querySelector('.focused-prototype[data-prototype=delivery] iframe'); return iframe?.contentWindow.__terminalShell && iframe.contentDocument.querySelector('.product-shell') !== iframe.contentWindow.__terminalShell; }, null, { timeout: 6000 });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1800);
  assert.equal(await player.getAttribute('data-playing'), 'false', 'offscreen while replay resets');
  const resetTime = await player.getAttribute('data-time');
  await player.scrollIntoViewIfNeeded();
  await page.waitForFunction(previous => Number(document.querySelector('.focused-prototype[data-prototype=delivery]')?.dataset.time) > Number(previous) + 500, resetTime, { timeout: 8000 });
  verify(); await context.close(); console.log('PASS visibility');
}
(async () => {
  const browser = await portable.launch();
  try {
    for (const name of matrix) if (selected(name)) await checkMatrix(browser, name);
    if (selected('delivery-cycle')) await deliveryCycle(browser);
    if (selected('sample-cycles')) await sampleCycles(browser);
    if (selected('visibility')) await visibility(browser);
  } finally { await browser.close(); }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
