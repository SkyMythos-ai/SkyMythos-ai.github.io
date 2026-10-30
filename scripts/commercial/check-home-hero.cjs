const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const portable = require('./browser.cjs');
portable.trackIdentity('home-hero');
const wholeRevision = '14f40b0fc37f7a20eeab00293e3527725552a255';
const sceneRevision = '7295629889d881f3485168832359d16d141021f9';
const cases = ['390-light', '390-dark', '1440-light', '1440-dark', 'hero-cycle'];
if (process.env.HERO_CASE) assert(cases.includes(process.env.HERO_CASE), 'Invalid HERO_CASE');
const selected = name => !process.env.HERO_CASE || process.env.HERO_CASE === name;
function provenance() {
  const root = path.join(portable.project, 'public/product-demo', `${wholeRevision}-lean-v1`);
  const source = JSON.parse(fs.readFileSync(path.join(root, 'source-provenance.json'), 'utf8'));
  assert.equal(source.sourceRevision, wholeRevision);
  for (const file of ['src/components/product-shell.tsx', 'src/pages/workspace-chat-page.tsx', 'src/styles.css', 'src/layers.css']) assert.match(source.actualImports[file] || '', /^[a-f0-9]{64}$/, `whole page product source ${file}`);
  for (const [file, digest] of Object.entries(source.generatedFiles)) {
    const target = path.resolve(root, file);
    assert(target.startsWith(root + path.sep), 'asset stays within revision');
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex'), digest, `whole page asset ${file}`);
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
  catch (error) { console.error(`READY ${name}: ${JSON.stringify({ dataset: await player.evaluate(node => ({ ...node.dataset })), page: await page.evaluate(() => ({ readyState: document.readyState, title: document.title, scripts: [...document.scripts].map(script => script.src).filter(Boolean), text: document.body.innerText.slice(0, 800) })) })}`); throw error; }
  const iframe = player.locator('iframe'); assert.equal(await iframe.count(), 1);
  const url = new URL(await iframe.getAttribute('src'), portable.base);
  if (name === 'hero') {
    assert.equal(url.pathname, `${portable.siteBasePath}/product-demo/${wholeRevision}-lean-v1/index.html`);
    assert.equal(url.searchParams.get('scene'), 'delivery');
    assert.equal(await player.getAttribute('data-source-revision'), wholeRevision);
    assert.equal(await player.getAttribute('data-presentation'), 'whole-page');
  } else {
    assert.equal(url.pathname, `${portable.siteBasePath}/product-scenes/${sceneRevision}-composed-v2/index.html`);
    assert.equal(url.searchParams.get('scene'), name);
    assert.equal(await player.getAttribute('data-source-revision'), sceneRevision);
    assert.equal(await player.getAttribute('data-presentation'), 'composed-v1');
  }
  return { player, frame: page.frameLocator(`.focused-prototype[data-prototype="${name}"] iframe`) };
}
async function geometry(page, width, theme) {
  const context = page.context(), verify = observe(page);
  await page.addInitScript(value => localStorage.setItem('skymythos-theme', value), theme);
  await page.goto(portable.url, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.focused-prototype').count(), 4);
  const h1 = page.locator('.harness-hero-copy h1');
  assert((await h1.innerText()).includes('数字员工持续工作'));
  const description = page.locator('.harness-hero-copy p');
  assert((await description.innerText()).includes('AI-Native Harness'));
  const cta = page.locator('.harness-hero-copy .harness-actions');
  assert(await cta.getByRole('link', { name: /查看工作方式/ }).isVisible());
  const alignment = await page.locator('.harness-hero-copy').evaluate(node => { const els = [node.querySelector('h1'), node.querySelector('p'), node.querySelector('.harness-actions')]; return els.map(el => ({ left: el.getBoundingClientRect().left, textAlign: getComputedStyle(el).textAlign })); });
  assert(alignment.every(item => Math.abs(item.left - alignment[0].left) <= 2 && ['left', 'start'].includes(item.textAlign)), `hero copy aligns left ${JSON.stringify(alignment)}`);
  assert.equal(await page.locator('.focused-prototype .source-demo-controls,.focused-prototype input[type=range],.focused-prototype button[aria-label="播放动画"],.focused-prototype button[aria-label="暂停动画"],.focused-prototype button[aria-label="重新播放"]').count(), 0);
  const { player, frame } = await ready(page, 'hero');
  assert.equal(await frame.locator('html').getAttribute('data-theme'), theme);
  assert.equal(await frame.locator('html').getAttribute('theme-mode'), theme);
  assert(await frame.locator('.product-shell').count(), 'hero original ProductShell');
  assert(await frame.locator('nav,[role=navigation]').count());
  assert(await frame.locator('[data-slot=chat-header]').count());
  const viewport = player.locator('.source-demo-viewport');
  const box = await viewport.evaluate(node => { const iframe = node.querySelector('iframe'), a = node.getBoundingClientRect(), b = iframe.getBoundingClientRect(); return { height: a.height, width: a.width, frameWidth: b.width, content: node.scrollWidth, client: node.clientWidth }; });
  assert(Math.abs(box.height - (width <= 700 ? 640 : 700)) <= 2, `whole page height ${JSON.stringify(box)}`);
  if (width <= 700) assert(box.frameWidth >= 959 && box.content > box.client, `mobile whole page remains horizontally browsable ${JSON.stringify(box)}`);
  else assert(Math.abs(box.frameWidth - box.width) <= 2, `desktop whole page fits ${JSON.stringify(box)}`);
  await player.screenshot({ path: path.join(portable.evidence, `hero-${width}-${theme}.png`) });
  const ids = ['autonomy', 'training', 'company-knowledge'];
  const names = ['delivery', 'training', 'knowledge'];
  for (let index = 0; index < ids.length; index++) {
    const section = page.locator(`#${ids[index]}`);
    assert.equal(await section.locator('.harness-heading').count(), 1, `${ids[index]} heading`);
    assert.equal(await section.locator('.harness-feature-index').count(), 1, `${ids[index]} feature index`);
    const item = await ready(page, names[index]);
    assert.equal(await item.frame.locator('html').getAttribute('data-theme'), theme);
    assert.equal(await item.frame.locator('.product-shell').count(), 0, 'following chapter is composed');
    assert.equal(await item.frame.locator(`[data-scene="${names[index]}"]`).count(), 1);
    if (index === 0) {
      await frame.locator('body').evaluate((body, revision) => parent.postMessage({ type: 'skymythos-product-demo', scene: 'delivery', sourceRevision: revision, presentation: 'composed-v1', ready: true, time: 11111, duration: 24000, playing: false, phase: 'forged' }, location.origin), sceneRevision);
      await page.waitForTimeout(100);
      assert.notEqual(await item.player.getAttribute('data-phase'), 'forged', 'hero message cannot impersonate composed delivery');
    }
  }
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}: no page overflow`);
  verify(); await context.close(); console.log(`PASS hero ${width} ${theme}`);
}
async function cycle(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: portable.evidence, size: { width: 1440, height: 900 } } });
  const page = await context.newPage(), verify = observe(page); await page.goto(portable.url, { waitUntil: 'networkidle' });
  const { player, frame } = await ready(page, 'hero');
  await player.locator('.source-demo-viewport').focus();
  await frame.locator('.product-shell').evaluate(node => { window.__heroShell = node; });
  await page.waitForFunction(() => Number(document.querySelector('[data-prototype=hero]')?.dataset.time) >= 1500, null, { timeout: 12000 });
  assert((await frame.locator('[data-interaction-draft]').innerText()).length > 0, 'native input starts automatically');
  await page.waitForFunction(() => Number(document.querySelector('[data-prototype=hero]')?.dataset.time) >= 7000, null, { timeout: 12000 });
  assert(await frame.locator('.product-shell').evaluate(node => node === window.__heroShell), 'same shell after sending');
  assert(await frame.locator('[data-slot=chat-execution-detail]').isVisible(), 'native execution detail appears');
  await player.screenshot({ path: path.join(portable.evidence, 'hero-execution.png') });
  await page.waitForFunction(() => { const n = document.querySelector('[data-prototype=hero]'); return n && Number(n.dataset.time) >= Number(n.dataset.duration); }, null, { timeout: 26000 });
  assert(await frame.locator('.product-shell').evaluate(node => node === window.__heroShell), 'same shell through report');
  assert((await frame.locator('body').innerText()).includes('发布准备检查报告'));
  assert(!(await frame.locator('[data-slot=execution-detail-summary]').innerText()).includes('执行中'));
  assert.equal(await frame.getByRole('button', { name: /停止/ }).count(), 0);
  assert.equal(await frame.locator('body').evaluate(() => window.__reference.getTurnStatus()), 'succeeded');
  const fixture = await frame.locator('body').evaluate(() => window.__reference);
  assert.deepEqual(fixture.unknown, []); assert.deepEqual(fixture.writes, []);
  assert(fixture.simulatedWrites.some(item => item.scope === 'memory'), 'example send is local');
  await player.screenshot({ path: path.join(portable.evidence, 'hero-report.png') });
  await page.waitForFunction(() => { const n = document.querySelector('[data-prototype=hero]'); return n?.dataset.playing === 'true' && Number(n.dataset.time) < 1000; }, null, { timeout: 10000 });
  await page.waitForFunction(() => Number(document.querySelector('[data-prototype=hero]')?.dataset.time) >= 1500, null, { timeout: 8000 });
  assert((await frame.locator('[data-interaction-draft]').innerText()).length > 0, 'new cycle restarts native input');
  assert(await player.locator('.source-demo-viewport').evaluate(node => document.activeElement === node), 'parent focus retained');
  verify(); const video = await page.video().path(); await context.close(); fs.renameSync(video, path.join(portable.evidence, 'hero-cycle.webm')); console.log('PASS hero-cycle');
}
(async () => {
  provenance();
  const browser = await portable.launch();
  try {
    for (const width of [390, 1440]) for (const theme of ['light', 'dark']) if (selected(`${width}-${theme}`)) await geometry(await browser.newPage({ viewport: { width, height: 900 }, colorScheme: theme }), width, theme);
    if (selected('hero-cycle')) await cycle(browser);
  } finally { await browser.close(); }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
