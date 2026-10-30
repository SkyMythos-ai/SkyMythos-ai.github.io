const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const base = path.resolve(__dirname, '../../public/product-scenes/7295629889d881f3485168832359d16d141021f9-composed-v1');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (name === '/harness') { res.writeHead(200, { 'Content-Type': 'text/html' }).end('<!doctype html><title>Test harness</title>'); return; }
  const file = path.resolve(base, `.${name === '/' ? '/index.html' : name}`);
  if (!file.startsWith(base + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const executablePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    for (const scene of ['delivery', 'training', 'knowledge']) {
      const page = await browser.newPage({ viewport: { width: 900, height: 640 } });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto(origin + '/harness'); await page.evaluate(() => localStorage.setItem('fusion-theme', 'parent-sentinel')); await page.setContent(`<button id="guard">guard</button><div inert><iframe style="width:880px;height:620px" src="/?scene=${scene}"></iframe></div><script>document.addEventListener('focusin',e=>{if(e.target.tagName==='IFRAME')document.querySelector('#guard').focus()})</script>`);
      const frame = page.frameLocator('iframe'); await frame.locator('[data-scene]').waitFor();
      const child = page.frames().find(value => value !== page.mainFrame());
      const control = (action, extra = {}) => page.evaluate(({scene, action, extra}) => document.querySelector('iframe').contentWindow.postMessage({type:'skymythos-product-demo-control',scene,action,...extra},location.origin), {scene, action, extra});
      assert.equal(await child.evaluate(() => document.documentElement.dataset.demoPaused), 'true');
      if (scene === 'delivery') {
        await control('seek', {time: 2000});
        await frame.locator('[data-plane="task"] article').first().waitFor();
        await page.waitForTimeout(100);
        const goalVisible = await child.evaluate(() => {const task=document.querySelector('[data-plane="task"]'),execution=document.querySelector('[data-plane="execution"]'),walker=document.createTreeWalker(task,NodeFilter.SHOW_TEXT);let text;while(walker.nextNode())if(walker.currentNode.textContent.includes('请核对本次发布准备情况')){text=walker.currentNode;break}if(!text)return false;const range=document.createRange();range.selectNodeContents(text);const r=range.getBoundingClientRect(),p=task.getBoundingClientRect();return Number(getComputedStyle(execution).opacity)===0&&r.left>=Math.max(0,p.left)&&r.right<=Math.min(innerWidth,p.right)&&r.top>=Math.max(0,p.top)&&r.bottom<=Math.min(innerHeight,p.bottom)});
        assert.equal(goalVisible,true,'desktop goal must be fully visible without execution covering it at 2s');
        await control('seek', {time: 8990});
        await frame.locator('[data-plane="execution"] [data-slot="agent-tool-activity"]').first().waitFor();
        await child.evaluate(() => { window.__firstTool = document.querySelector('[data-plane="execution"] [data-slot="agent-tool-activity"]'); });
        await control('visibility', {visible:true,reduced:false}); await control('play');
        await frame.locator('[data-plane="execution"] [data-slot="agent-tool-activity"]').nth(1).waitFor({timeout:5000});
        await page.waitForTimeout(300);
        assert.equal(await child.evaluate(() => document.querySelector('[data-plane="execution"] [data-slot="agent-tool-activity"]') === window.__firstTool), true);
        const expanded = await frame.locator('[data-plane="execution"] [data-slot="agent-tool-activity"] > button').evaluateAll(buttons => buttons.map(button => button.getAttribute('aria-expanded')));
        assert.deepEqual(expanded, ['true','true']);
        await control('pause'); await page.waitForTimeout(100);
        assert.equal(await child.evaluate(() => document.documentElement.dataset.demoPaused), 'true');
        await control('play'); await page.waitForTimeout(100);
        assert.equal(await child.evaluate(() => document.documentElement.dataset.demoPaused), 'false');
        await child.evaluate(() => { Object.defineProperty(document, 'hidden', {value:true, configurable:true}); document.dispatchEvent(new Event('visibilitychange')); });
        assert.equal(await child.evaluate(() => document.documentElement.dataset.demoPaused), 'true');
        await child.evaluate(() => { delete document.hidden; });
      }
      await page.evaluate(scene => document.querySelector('iframe').contentWindow.postMessage({ type: 'skymythos-product-demo-control', scene, action: 'seek', time: 19000 }, location.origin), scene);
      const expected = scene === 'delivery' ? '发布准备检查报告' : scene === 'training' ? '确认员工方案' : '发布回滚指南';
      await (scene === 'knowledge' ? frame.locator('[data-plane="doc"][data-document-id="release-guide"][data-base-id="example-runbook"][data-revision="rev-1"]') : frame.getByText(expected, { exact: false }).first()).waitFor({ timeout: 10000 });
      if (scene === 'knowledge') assert.ok((await frame.locator('[data-plane="doc"]').innerText()).includes('当关键指标持续异常时'));
      const evidence = await child.evaluate(() => ({ unknown: __reference.unknown, writes: __reference.writes, simulatedWrites: __reference.simulatedWrites, requests: __reference.requests }));
      assert.deepEqual(errors, []); assert.equal(await page.evaluate(() => localStorage.getItem('fusion-theme')), 'parent-sentinel'); assert.deepEqual(evidence.unknown, []); assert.deepEqual(evidence.writes, []);
      if (scene === 'training') assert.equal(evidence.simulatedWrites.filter(value => value.path === 'formation.form').length, 1);
      if (scene === 'knowledge') assert.ok(evidence.requests.some(value => value.path === '/api/v1/knowledge-base/search'));
      await page.evaluate(scene => document.querySelector('iframe').contentWindow.postMessage({ type: 'skymythos-product-demo-control', scene, action: 'seek', time: 0 }, location.origin), scene);
      await (scene === 'knowledge' ? frame.locator('[data-plane="doc"]') : frame.getByText(expected, { exact: false }).first()).waitFor({ state: 'hidden', timeout: 10000 });
      await page.evaluate(scene => document.querySelector('iframe').contentWindow.postMessage({ type: 'skymythos-product-demo-control', scene, action: 'seek', time: 19000 }, location.origin), scene);
      await (scene === 'knowledge' ? frame.locator('[data-plane="doc"][data-document-id="release-guide"][data-base-id="example-runbook"][data-revision="rev-1"]') : frame.getByText(expected, { exact: false }).first()).waitFor({ timeout: 10000 });
      if (scene === 'knowledge') assert.ok((await frame.locator('[data-plane="doc"]').innerText()).includes('当关键指标持续异常时'));
      if (scene === 'training') { const writes = await child.evaluate(() => __reference.simulatedWrites); assert.equal(writes.filter(value => value.path === 'formation.form').length, 1); }
      console.log(scene, 'embedded terminal state OK'); await page.close();
    }
    for (const scene of ['delivery', 'training']) {
      const page = await browser.newPage({ viewport: { width: 390, height: 640 } });
      await page.goto(origin + '/harness');
      await page.setContent(`<div inert><iframe style="width:390px;height:640px;border:0" src="/?scene=${scene}"></iframe></div>`);
      const frame = page.frameLocator('iframe'); await frame.locator('[data-scene]').waitFor();
      const seek = time => page.evaluate(({scene,time}) => document.querySelector('iframe').contentWindow.postMessage({type:'skymythos-product-demo-control',scene,action:'seek',time},location.origin), {scene,time});
      const overlap = async (plane, item) => {
        const outer = await plane.boundingBox(), inner = await item.boundingBox();
        assert.ok(outer && inner, 'expected plane and content bounds');
        assert.ok(Math.min(outer.x+outer.width,inner.x+inner.width,390)-Math.max(outer.x,inner.x,0)>0, 'content must intersect horizontal viewport');
        assert.ok(Math.min(outer.y+outer.height,inner.y+inner.height,640)-Math.max(outer.y,inner.y,0)>8, 'content must intersect plane and vertical viewport');
      };
      if (scene === 'delivery') {
        await seek(2000);
        await frame.locator('[data-plane="task"] article').first().waitFor();
        const mobileChild = page.frames().find(value => value !== page.mainFrame());
        await page.waitForTimeout(100);
        const goalVisible = await mobileChild.evaluate(() => {const task=document.querySelector('[data-plane="task"]'),execution=document.querySelector('[data-plane="execution"]'),walker=document.createTreeWalker(task,NodeFilter.SHOW_TEXT);let text;while(walker.nextNode())if(walker.currentNode.textContent.includes('请核对本次发布准备情况')){text=walker.currentNode;break}if(!text)return false;const range=document.createRange();range.selectNodeContents(text);const r=range.getBoundingClientRect(),p=task.getBoundingClientRect();return Number(getComputedStyle(execution).opacity)===0&&r.left>=Math.max(0,p.left)&&r.right<=Math.min(innerWidth,p.right)&&r.top>=Math.max(0,p.top)&&r.bottom<=Math.min(innerHeight,p.bottom)});
        assert.equal(goalVisible,true,'mobile goal must be fully visible without execution covering it at 2s');
        await seek(13000);
        const execution = frame.locator('[data-plane="execution"]');
        const command = execution.locator('pre').filter({hasText:'release-check --dry-run'}).first();
        const output = execution.locator('pre').filter({hasText:'PASS 配置完整'}).first();
        await command.waitFor({timeout:10000}); await output.waitFor({timeout:10000}); await page.waitForTimeout(250);
        await overlap(execution,command); await overlap(execution,output);
        await seek(24000);
        const report = frame.locator('[data-plane="report"]');
        const end = report.getByText('检查完成，等待人工验收。',{exact:false}).first();
        await end.waitFor({timeout:10000}); await page.waitForTimeout(250); await overlap(report,end);
      } else {
        await seek(24000);
        const plan = frame.locator('[data-plane="analysis"]');
        const end = plan.getByRole('button',{name:'确认方案并创建员工'});
        await end.waitFor({timeout:10000}); await page.waitForTimeout(250); await overlap(plan,end);
      }
      console.log(scene, 'mobile visible bounds OK'); await page.close();
    }
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
