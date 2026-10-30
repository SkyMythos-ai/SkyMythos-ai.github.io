const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { launch, evidence } = require('../commercial/browser.cjs');
const revisions = { training: '14f40b0fc37f7a20eeab00293e3527725552a255', delivery: '14f40b0fc37f7a20eeab00293e3527725552a255', knowledge: '7295629889d881f3485168832359d16d141021f9' };
const root = path.resolve(__dirname, '../../public/product-demo');
const server = http.createServer((request, response) => {
  if (new URL(request.url, 'http://fixture').pathname === '/embedded-knowledge.html') {
    response.setHeader('Content-Type', 'text/html');
    response.end(`<!doctype html><html lang="zh-CN"><body><button id="visitor-focus">产品说明</button><iframe id="product-demo" inert sandbox="allow-scripts allow-same-origin allow-forms" src="/${revisions.knowledge}/index.html?scene=knowledge" style="display:block;width:1200px;height:540px;border:0"></iframe><script>
      const anchor=document.getElementById('visitor-focus'),frame=document.getElementById('product-demo');anchor.focus();let initialized=false;window.demoMessages=[];
      window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.type!=='skymythos-product-demo')return;window.demoMessages.push(event.data);if(document.activeElement===frame)anchor.focus({preventScroll:true});if(!initialized&&event.data.ready){initialized=true;frame.contentWindow.postMessage({type:'skymythos-product-demo-control',scene:'knowledge',action:'visibility',visible:true,reduced:false},location.origin);}});
    </script></body></html>`);
    return;
  }
  const file = path.resolve(root, decodeURIComponent(new URL(request.url, 'http://fixture').pathname).slice(1) || 'index.html');
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) { response.writeHead(404).end(); return; }
  response.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');
  response.end(fs.readFileSync(file));
});
async function verifyEmbeddedKnowledge(browser, origin) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [], writes = [], external = [], samples = [];
  page.on('request', request => { if (!['GET', 'HEAD'].includes(request.method())) writes.push(request.url()); if (new URL(request.url()).origin !== origin) external.push(request.url()); });
  page.on('pageerror', error => errors.push(error.stack || error.message));
  await page.goto(`${origin}/embedded-knowledge.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.demoMessages.some(message => message.ready), null, { timeout: 15000 });
  const frame = page.frames().find(frame => frame.url().includes('scene=knowledge'));
  assert(frame, 'embedded knowledge frame exists');
  await frame.locator('.product-shell').evaluate(node => { window.__embeddedOriginalShell = node; });
  for (const [time, scope, count, name] of [[6000, '全部知识', 1, '团队发布手册'], [15000, '共享给我的', 1, '产品说明'], [19500, 'Workspace 知识库', 3, '交付验收标准'], [24000, '全部知识', 4, '客户答复规范']]) {
    await page.waitForFunction(time => window.demoMessages.at(-1)?.time >= time, time, { timeout: 12000 });
    const actualScope = await frame.locator('[data-slot="page-toolbar"] [role="combobox"]').innerText();
    const rows = await frame.locator('tbody tr').count();
    assert.equal(actualScope, scope, `inert embedded native scope at ${time}`);
    assert.equal(rows, count, `inert embedded native row count at ${time}`);
    assert((await frame.locator('tbody').innerText()).includes(name), `inert embedded native asset at ${time}`);
    assert(await page.locator('#visitor-focus').evaluate(node => node === document.activeElement), `visitor focus preserved at ${time}`);
    samples.push({ time, scope: actualScope, rows });
  }
  assert(await frame.locator('.product-shell').evaluate(node => node === window.__embeddedOriginalShell), 'embedded native shell persists throughout natural playback');
  const fixture = await frame.evaluate(() => window.__reference);
  assert.deepEqual(fixture.unknown, [], 'embedded knowledge unknown API');
  assert.deepEqual(fixture.writes, [], 'embedded knowledge blocked business writes');
  assert.deepEqual(errors, [], 'embedded knowledge page errors');
  assert.deepEqual(writes, [], 'embedded knowledge no network writes');
  assert.deepEqual(external, [], 'embedded knowledge no external network');
  fs.writeFileSync(path.join(evidence, 'embedded-knowledge.json'), JSON.stringify({ samples, errors, writes, external, fixture }, null, 2));
  await page.screenshot({ path: path.join(evidence, 'embedded-knowledge-complete.png') });
  await page.close();
  console.log('knowledge: natural playback in inert iframe with visitor focus preserved verified');
}
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await launch();
  try {
    if (process.env.DEMO_EMBEDDED === '1') await verifyEmbeddedKnowledge(browser, origin);
    else for (const scene of (process.env.DEMO_SCENE ? [process.env.DEMO_SCENE] : ['training', 'knowledge', 'delivery'])) {
      const page = await browser.newPage({ viewport: scene === 'knowledge' ? { width: 1200, height: 540 } : { width: 1000, height: 700 } });
      const errors = [], writes = [], external = [];
      page.on('request', request => { if (!['GET', 'HEAD'].includes(request.method())) writes.push(request.url()); if (new URL(request.url()).origin !== origin) external.push(request.url()); });
      page.on('pageerror', error => errors.push(error.stack || error.message));
      await page.addInitScript(() => { window.__demoMessages = []; window.addEventListener('message', event => { if (event.data?.type === 'skymythos-product-demo') window.__demoMessages.push(event.data); }); });
      await page.goto(`${origin}/${revisions[scene]}/index.html?scene=${scene}`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.__demoMessages.some(message => message.ready), null, { timeout: 15000 }).catch(error => { throw new Error(`${scene} failed to initialize: ${errors.join('; ')}; ${error.message}`); });
      assert.equal(await page.locator('.product-shell').count(), 1, `${scene}: product shell`);
      assert(await page.locator('nav, [role=navigation]').count(), `${scene}: navigation`);
      assert(await page.locator('header').count(), `${scene}: shell header`);
      assert(await page.locator(scene === 'delivery' ? '[data-slot=chat-header]' : '[data-slot=page-header]').count(), `${scene}: page header`);
      assert.equal((await page.evaluate(() => window.__demoMessages.at(-1))).duration, 24000);
      const control = async (action, extra = {}) => page.evaluate(({ scene, origin, action, extra }) => window.postMessage({ type: 'skymythos-product-demo-control', scene, action, ...extra }, origin), { scene, origin, action, extra });
      const seek = async time => { await control('seek', { time }); await page.waitForFunction(time => window.__demoMessages.at(-1)?.time === time, time); await page.waitForTimeout(800); };
      await control('visibility', { visible: true, reduced: false });
      await control('pause');
      const pausedAt = await page.evaluate(() => window.__demoMessages.at(-1).time);
      await control('theme', { theme: 'dark' });
      await control('visibility', { visible: true, reduced: false });
      await page.waitForTimeout(350);
      assert.equal(await page.evaluate(() => window.__demoMessages.at(-1).time), pausedAt, 'theme/visibility preserve manual pause');
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
      if (scene === 'delivery') {
        await seek(0);
        await page.locator('.product-shell').evaluate(node => { window.__originalShell = node; window.__inputs = []; document.body.addEventListener('paste', event => window.__inputs.push(event.clipboardData?.getData('text/plain'))); });
        await control('play');
        await page.waitForFunction(() => window.__demoMessages.at(-1)?.time >= 7000, null, { timeout: 12000 });
        assert(await page.locator('.product-shell').evaluate(node => node === window.__originalShell), 'same shell after send');
        const panel = page.locator('[data-slot=chat-execution-detail]');
        assert(await panel.isVisible(), 'original execution detail opens');
        const earlyDetail = await panel.innerText();
        await page.waitForFunction(() => window.__demoMessages.at(-1)?.time >= 14500, null, { timeout: 10000 });
        const laterDetail = await panel.innerText();
        assert(laterDetail.length > earlyDetail.length, 'execution detail grows during execution');
        assert((await page.evaluate(() => window.__inputs)).length >= 3, 'real composer paste events before sending');
        await page.waitForFunction(() => window.__demoMessages.at(-1)?.time >= 17000, null, { timeout: 15000 });
        assert(await page.locator('.product-shell').evaluate(node => node === window.__originalShell), 'same shell after detail closes');
        assert.equal(await panel.count(), 0, 'execution detail closes to return to report');
        await control('pause');
        const paused = await page.locator('body').innerText();
        const time = await page.evaluate(() => window.__demoMessages.at(-1).time);
        await page.waitForTimeout(400);
        assert.equal(await page.evaluate(() => window.__demoMessages.at(-1).time), time);
        assert.equal(await page.locator('body').innerText(), paused, 'paused output remains stable');
        await control('play');
        await page.waitForFunction(() => window.__demoMessages.at(-1)?.time >= 24000, null, { timeout: 10000 });
        const body = await page.locator('body').innerText();
        assert(body.includes('发布准备检查报告') && body.includes('检查完成，等待人工验收'), `completed report: ${body}`);
        const summary = await page.locator('[data-slot=execution-detail-summary]').innerText();
        assert(!summary.includes('执行中'), `terminal summary: ${summary}`);
        assert.equal(await page.getByRole('button', { name: /停止/ }).count(), 0, 'no stop control after completion');
        assert.equal(await page.evaluate(() => window.__reference.getTurnStatus()), 'succeeded');
        assert(await page.locator('.product-shell').evaluate(node => node === window.__originalShell), 'same shell through report');
        if (process.env.DEMO_LONG_HOLD) {
          await page.waitForTimeout(31000); await page.waitForTimeout(31000);
          assert(await page.locator('.product-shell').evaluate(node => node === window.__originalShell), 'shell persists after a minute');
          const heldText = await page.locator('body').innerText();
          assert(heldText.includes('发布准备检查报告'), 'report persists after a minute');
          assert(!heldText.includes('同步暂不可用'), 'no synchronization warning after a minute');
          assert.equal(await page.locator('[data-slot=agent-environment-onboarding]').count(), 0, 'environment gate stays clear');
        }
        const state = await page.evaluate(() => window.__reference);
        assert(state.simulatedWrites.some(item => item.scope === 'memory'), 'send executed in memory');
        assert.deepEqual(state.unknown, [], 'delivery: no unknown API during playback');
        assert.deepEqual(state.writes, [], 'delivery: no business writes during playback');
        await seek(0);
        assert(!(await page.locator('body').innerText()).includes('发布准备检查报告'), 'seek clears prior report');
        await control('replay'); await page.waitForTimeout(350);
        assert((await page.evaluate(() => window.__demoMessages.at(-1).time)) < 1000, 'replay restarts timeline');
        await control('pause');
      } else {
        if (scene === 'knowledge') {
          const rowCount = () => page.locator('tbody tr').count();
          await seek(0);
          assert.equal(await rowCount(), 4, 'knowledge: original directory lists four fictional assets');
          await page.screenshot({ path: path.join(evidence, 'knowledge-directory-dark.png') });
          assert.equal(await page.locator('[role="dialog"]').count(), 0, 'knowledge: no creation form');
          await seek(8000);
          assert.equal(await page.locator('[data-slot="page-search"] input').inputValue(), '发布', 'knowledge: native search input');
          assert.equal(await rowCount(), 1, 'knowledge: original search filters directory');
          assert((await page.locator('tbody').innerText()).includes('团队发布手册'), 'knowledge: matching asset');
          await seek(15000);
          assert.equal(await rowCount(), 1, 'knowledge: native shared scope filters directory');
          assert((await page.locator('tbody').innerText()).includes('产品说明'), 'knowledge: shared asset visible');
          await page.screenshot({ path: path.join(evidence, 'knowledge-shared-dark.png') });
          await seek(19500);
          assert.equal(await rowCount(), 3, 'knowledge: native workspace scope shows workspace assets');
          assert(!(await page.locator('tbody').innerText()).includes('产品说明'), 'knowledge: shared asset is outside workspace scope');
        }
        await seek(24000);
        const body = await page.locator('body').innerText();
        if (scene === 'training') assert(body.includes('确认员工方案') && body.includes('发布准备员工'), `training result: ${body}`);
        if (scene === 'knowledge') {
          assert.equal(await page.locator('tbody tr').count(), 4, 'knowledge: final directory restores all assets');
          assert.equal(await page.locator('[data-slot="page-search"] input').inputValue(), '', 'knowledge: final query cleared');
          assert.equal(await page.locator('[role="dialog"]').count(), 0, 'knowledge: no create dialog at completion');
          assert(body.includes('工作区') && body.includes('共享给我的'), `knowledge: native scope column ${body}`);
          await control('theme', { theme: 'light' });
          await page.screenshot({ path: path.join(evidence, 'knowledge-directory-light.png') });
          await seek(0);
          const shell = page.locator('.product-shell');
          await shell.evaluate(node => { window.__knowledgeShell = node; });
          await control('play');
          await page.waitForFunction(() => window.__demoMessages.at(-1)?.time >= 8000, null, { timeout: 12000 });
          assert.equal(await page.locator('tbody tr').count(), 1, 'knowledge: continuous native search narrows directory');
          await page.waitForFunction(() => window.__demoMessages.at(-1)?.time >= 15000, null, { timeout: 12000 });
          assert((await page.locator('tbody').innerText()).includes('产品说明'), 'knowledge: continuous native scope selection');
          await page.waitForFunction(() => window.__demoMessages.at(-1)?.time >= 24000, null, { timeout: 15000 });
          assert.equal(await page.locator('tbody tr').count(), 4, 'knowledge: continuous playback restores complete directory');
          assert(await shell.evaluate(node => node === window.__knowledgeShell), 'knowledge: same native shell throughout continuous playback');
        }
        if (process.env.DEMO_LONG_HOLD) {
          await page.waitForTimeout(31000); await page.waitForTimeout(31000);
          const heldText = await page.locator('body').innerText();
          assert(!heldText.includes('同步暂不可用'), `${scene}: no synchronization warning after a minute`);
          assert(await page.locator('.product-shell').count(), `${scene}: shell remains after a minute`);
          assert(heldText.includes(scene === 'training' ? '确认员工方案' : '知识库'), `${scene}: state persists after a minute`);
        }
      }
      const fixture = await page.evaluate(() => window.__reference);
      assert.deepEqual(fixture.unknown, [], `${scene}: unknown API`);
      assert.deepEqual(fixture.writes, [], `${scene}: blocked business writes`);
      assert.deepEqual(errors, [], `${scene}: page errors`);
      assert.deepEqual(writes, [], `${scene}: no network writes`);
      assert.deepEqual(external, [], `${scene}: no external network`);
      console.log(`${scene}: complete product page, local fixture and protocol verified`);
      await page.close();
    }
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
