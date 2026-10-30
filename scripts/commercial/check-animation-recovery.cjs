const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const portable = require('./browser.cjs');

const heroBundle = '14f40b0fc37f7a20eeab00293e3527725552a255-lean-v1';
const sceneBundle = '7295629889d881f3485168832359d16d141021f9-composed-v2';
const heroDir = path.join(portable.project, 'out/product-demo', heroBundle);
const sceneDir = path.join(portable.project, 'out/product-scenes', sceneBundle);

// 只拦截构建分析确认不在静态闭包中的模块，确保实验发生在首屏就绪后。
function faultTargets(name) {
  const dir = name === 'hero' ? heroDir : sceneDir;
  const pattern = name === 'hero' ? /^(agent-execution-detail|chat-markdown)-.*\.js$/ : /^knowledge-rich-markdown-.*\.js$/;
  const initial = name === 'hero' ? new Set(JSON.parse(fs.readFileSync(path.join(dir, 'bundle-analysis.json'), 'utf8')).initialChunks) : new Set();
  const files = fs.readdirSync(path.join(dir, 'assets')).filter(file => pattern.test(file) && !initial.has(`assets/${file}`));
  assert(files.length, `${name}: missing eligible lazy chunk outside initial closure`);
  return files.map(file => `${portable.siteBasePath}/product-${name === 'hero' ? 'demo' : 'scenes'}/${name === 'hero' ? heroBundle : sceneBundle}/assets/${file}`);
}
async function runCase(browser, name) {
  const result = { name, passed: false, interceptions: [], expectedConsole: [], errors: [], writes: [], external: [] };
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await context.newPage();
  const selector = `.focused-prototype[data-prototype="${name}"]`;
  let blocked = false;
  let faultRequest;
  let faultUrl;
  let confirmed503 = false;
  const consoleErrors = [];
  try {
    const targets = faultTargets(name);
    result.targets = targets;
    page.on('pageerror', error => result.errors.push(`pageerror: ${error.stack || error.message}`));
    page.on('request', request => {
      if (!['GET', 'HEAD'].includes(request.method())) result.writes.push(`${request.method()} ${request.url()}`);
      if (new URL(request.url()).origin !== portable.base.origin) result.external.push(request.url());
    });
    page.on('console', message => {
      if (message.type() !== 'error') return;
      consoleErrors.push({ text: message.text(), location: message.location() });
    });
    page.on('response', response => {
      if (response.status() < 400) return;
      if (response.status() === 503 && response.request() === faultRequest && response.url() === faultUrl) confirmed503 = true;
      else result.errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
    const fault = async route => {
      const pathname = new URL(route.request().url()).pathname;
      if (!targets.includes(pathname) || blocked) return route.continue();
      blocked = true;
      faultRequest = route.request();
      faultUrl = faultRequest.url();
      const state = await page.evaluate(selector => {
        const node = document.querySelector(selector);
        const ref = node?.querySelector('iframe')?.contentWindow?.__reference;
        return { ready: node?.dataset.ready, phase: node?.dataset.phase, playing: node?.dataset.playing, time: node?.dataset.time, fixture: ref && { unknown: [...ref.unknown], writes: [...ref.writes] } };
      }, selector);
      result.interceptions.push({ pathname, state });
      await route.fulfill({ status: 503, contentType: 'text/plain', body: 'Expected injected lazy chunk failure' });
    };
    await page.route('**/*', fault);
    await page.goto(portable.url, { waitUntil: 'domcontentloaded' });
    const player = page.locator(selector);
    await player.scrollIntoViewIfNeeded({ timeout: 15000 });
    await page.waitForFunction(selector => document.querySelector(selector)?.dataset.ready === 'true', selector, { timeout: 15000 });
    await player.getByRole('button', { name: '重新载入演示' }).waitFor({ timeout: 30000 });
    assert.equal(result.interceptions.length, 1, 'one lazy module request was faulted');
    const observed = result.interceptions[0].state;
    assert.equal(observed.ready, 'true', 'fault must occur after host player is ready');
    assert(observed.fixture, 'live fixture existed before the lazy fault');
    assert.deepEqual(observed.fixture.unknown, []);
    assert.deepEqual(observed.fixture.writes, []);
    await page.waitForFunction(selector => { const node = document.querySelector(selector); return node?.dataset.ready === 'false' && node.dataset.phase === 'error' && node.dataset.playing === 'false'; }, selector, { timeout: 3000 });
    await player.screenshot({ path: path.join(portable.evidence, `animation-recovery-${name}-error.png`) });
    const original = await player.locator('iframe').elementHandle();
    const oldSrc = await original.getAttribute('src');
    await page.unroute('**/*', fault);
    await player.getByRole('button', { name: '重新载入演示' }).click();
    await page.waitForFunction(({ selector, oldSrc }) => { const node = document.querySelector(selector); return node?.dataset.ready === 'true' && node.querySelector('iframe')?.getAttribute('src') !== oldSrc; }, { selector, oldSrc }, { timeout: 15000 });
    assert.equal(await original.evaluate(node => node.isConnected), false, 'retry replaced the failed iframe');
    const frame = page.frameLocator(`${selector} iframe`);
    if (name === 'hero') {
      await frame.getByText('发布准备检查报告', { exact: false }).first().waitFor({ state: 'visible', timeout: 30000 });
      await page.waitForFunction(selector => Number(document.querySelector(selector)?.dataset.time) >= 22000, selector, { timeout: 30000 });
      assert((await frame.locator('body').innerText()).includes('等待人工验收'), 'natural playback reached complete report');
      assert.equal(await frame.locator('body').evaluate(() => window.__reference.getTurnStatus()), 'succeeded');
    } else {
      const doc = frame.locator('[data-plane="doc"]');
      await doc.waitFor({ state: 'visible', timeout: 30000 });
      assert.equal(await doc.getAttribute('data-document-id'), 'release-guide');
      assert.equal(await doc.getAttribute('data-base-id'), 'example-runbook');
      assert.equal(await doc.getAttribute('data-revision'), 'rev-1');
      assert((await doc.innerText()).includes('确认回滚权限与目标版本'), 'natural playback reached original document');
    }
    const fixture = await frame.locator('body').evaluate(() => ({ unknown: window.__reference.unknown, writes: window.__reference.writes }));
    assert.deepEqual(fixture.unknown, []);
    assert.deepEqual(fixture.writes, []);
    assert.deepEqual(result.writes, [], 'no network writes');
    assert.deepEqual(result.external, [], 'no external requests');
    assert.equal(await player.locator('.source-demo-controls,.source-demo-footer,input[type=range]').count(), 0, 'no player controls');
    assert.notEqual(await page.evaluate(() => document.activeElement?.tagName), 'IFRAME', 'frame does not steal focus');
    await player.screenshot({ path: path.join(portable.evidence, `animation-recovery-${name}-recovered.png`) });
    assert(confirmed503, 'the exact injected request received its 503 response');
    // React 在入口模块处报告 import 拒绝；只放行本次实际注入过503的精确 URL。
    // 延后分类，避免依赖 console 与 response 事件的先后顺序。
    for (const detail of consoleErrors) {
      const importError = detail.text === `TypeError: Failed to fetch dynamically imported module: ${faultUrl}`;
      const resourceError = detail.location.url === faultUrl && detail.text === 'Failed to load resource: the server responded with a status of 503 (Service Unavailable)';
      if (confirmed503 && (importError || resourceError)) result.expectedConsole.push(detail);
      else result.errors.push(`console: ${JSON.stringify(detail)}`);
    }
    assert.deepEqual(result.errors, [], 'no unexpected browser or resource errors');
    result.recovered = { oldSrc, newSrc: await player.locator('iframe').getAttribute('src'), fixture };
    result.passed = true;
  } catch (error) {
    result.error = error.stack || String(error);
    result.state = await page.evaluate(selector => { const node = document.querySelector(selector); return node && { ...node.dataset }; }, selector).catch(() => null);
    await page.screenshot({ path: path.join(portable.evidence, `animation-recovery-${name}-failure.png`) }).catch(() => {});
  } finally { await context.close(); }
  return result;
}
// 用完整模块身份定位词库，禁止通过模糊文件名拦截无关动态资源。
function catalogTarget() {
  const analysis = JSON.parse(fs.readFileSync(path.join(heroDir, 'bundle-analysis.json'), 'utf8'));
  assert(Array.isArray(analysis.allModules), 'Build analysis must include allModules with raw module identities');
  const matches = analysis.allModules.filter(item => item.id === 'src/lib/i18n.ts?demo-full-locale');
  assert.equal(matches.length, 1, 'one full locale module');
  const item = matches[0];
  assert.equal(item.isDynamicEntry, true, 'full locale is a dynamic entry');
  assert(!analysis.initialChunks.includes(item.chunk), 'full locale is outside the initial closure');
  assert(/^assets\/[^/]+\.js$/.test(item.chunk), 'safe generated chunk path');
  assert(fs.existsSync(path.join(heroDir, item.chunk)), 'full locale chunk exists in exported bundle');
  return { module: item.id, chunk: item.chunk, pathname: `${portable.siteBasePath}/product-demo/${heroBundle}/${item.chunk}` };
}
async function catalogWait(browser) {
  const name = 'catalog-wait', selector = '.focused-prototype[data-prototype="hero"]';
  const result = { name, passed: false, errors: [], writes: [], external: [] };
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await context.newPage();
  let release;
  const held = new Promise(resolve => { release = resolve; });
  try {
    const target = result.target = catalogTarget();
    let intercepted = 0;
    page.on('pageerror', error => result.errors.push(`pageerror: ${error.stack || error.message}`));
    page.on('console', message => { if (message.type() === 'error') result.errors.push(`console: ${message.text()}`); });
    page.on('request', request => {
      if (!['GET', 'HEAD'].includes(request.method())) result.writes.push(`${request.method()} ${request.url()}`);
      if (new URL(request.url()).origin !== portable.base.origin) result.external.push(request.url());
    });
    page.on('response', response => { if (response.status() >= 400) result.errors.push(`HTTP ${response.status()}: ${response.url()}`); });
    await page.addInitScript(() => {
      const log = window.__catalogWaitLog = { messages: 0, changes: [] };
      let previous = '';
      window.addEventListener('message', event => {
        if (event.source !== document.querySelector('[data-prototype="hero"] iframe')?.contentWindow || event.data?.type !== 'skymythos-product-demo') return;
        log.messages++;
        const value = `${event.data.playing}:${event.data.time}:${event.data.assetsReady}`;
        // 仅保存状态或整数秒变化，避免逐帧证据淹没结果。
        const key = `${event.data.playing}:${Math.floor(event.data.time / 1000)}:${event.data.assetsReady}`;
        if (key !== previous) { previous = key; log.changes.push({ at: performance.now(), value }); }
      });
    });
    const hold = async route => {
      if (new URL(route.request().url()).pathname !== target.pathname) return route.continue();
      intercepted++;
      await held;
      await route.continue();
    };
    await page.route('**/*', hold);
    await page.goto(portable.url, { waitUntil: 'domcontentloaded' });
    const player = page.locator(selector);
    await player.scrollIntoViewIfNeeded({ timeout: 15000 });
    await page.waitForFunction(selector => { const n = document.querySelector(selector); return n?.dataset.ready === 'true' && n.dataset.assetsReady === 'false' && n.dataset.playing === 'false' && Number(n.dataset.time) === 3499; }, selector, { timeout: 15000 });
    assert.equal(intercepted, 1, 'held the full locale request');
    const frame = page.frameLocator(`${selector} iframe`);
    await frame.locator('.product-shell').evaluate(node => { window.__catalogShell = node; });
    const before = await page.evaluate(() => window.__catalogWaitLog.messages);
    await page.evaluate(selector => {
      const target = document.querySelector(selector).querySelector('iframe').contentWindow;
      for (let n = 0; n < 10; n++) target.postMessage({ type: 'skymythos-product-demo-control', scene: 'delivery', action: 'play' }, location.origin);
    }, selector);
    await page.waitForTimeout(500);
    const blocked = await player.evaluate(node => ({ ...node.dataset }));
    const blockedMessages = (await page.evaluate(() => window.__catalogWaitLog.messages)) - before;
    assert.equal(blocked.ready, 'true');
    assert.equal(blocked.assetsReady, 'false');
    assert.equal(blocked.playing, 'false');
    assert.equal(Number(blocked.time), 3499, 'repeated play cannot advance the waiting clock');
    assert(blockedMessages < 40, `repeated play must not create a busy feedback loop: ${blockedMessages}`);
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
    release();
    await page.waitForFunction(selector => document.querySelector(selector)?.dataset.assetsReady === 'true', selector, { timeout: 15000 });
    await page.waitForTimeout(500);
    const hidden = await player.evaluate(node => ({ ...node.dataset }));
    assert.equal(Number(hidden.time), 3499, 'catalog resolution cannot advance while host is hidden');
    assert.equal(hidden.playing, 'false');
    assert.equal(hidden.ready, 'true');
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    await page.waitForFunction(selector => { const n = document.querySelector(selector); return n?.dataset.ready === 'true' && Number(n.dataset.time) >= Number(n.dataset.duration); }, selector, { timeout: 30000 });
    assert(await frame.locator('.product-shell').evaluate(node => node === window.__catalogShell), 'same ProductShell resumed');
    const fixture = await frame.locator('body').evaluate(() => ({ unknown: window.__reference.unknown, writes: window.__reference.writes, simulatedWrites: window.__reference.simulatedWrites, turn: window.__reference.getTurnStatus() }));
    assert.deepEqual(fixture.unknown, []);
    assert.deepEqual(fixture.writes, []);
    assert.equal(fixture.simulatedWrites.filter(item => item.scope === 'memory').length, 1, 'one example send');
    assert.equal(fixture.turn, 'succeeded');
    assert((await frame.locator('body').innerText()).includes('发布准备检查报告'), 'natural playback reached final report');
    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.writes, []);
    assert.deepEqual(result.external, []);
    result.evidence = { blocked, hidden, blockedMessages, fixture, log: await page.evaluate(() => window.__catalogWaitLog) };
    await player.screenshot({ path: path.join(portable.evidence, 'animation-recovery-catalog-wait-recovered.png') });
    result.passed = true;
  } catch (error) {
    result.error = error.stack || String(error);
    result.state = await page.evaluate(selector => { const node = document.querySelector(selector); return node && { ...node.dataset }; }, selector).catch(() => null);
    result.log = await page.evaluate(() => window.__catalogWaitLog).catch(() => null);
    await page.screenshot({ path: path.join(portable.evidence, 'animation-recovery-catalog-wait-failure.png') }).catch(() => {});
  } finally { release(); await context.close(); }
  return result;
}
async function main() {
  const selected = process.env.ANIMATION_RECOVERY_CASE;
  assert(!selected || ['hero', 'knowledge', 'catalog-wait'].includes(selected), 'ANIMATION_RECOVERY_CASE must be hero, knowledge or catalog-wait');
  portable.trackIdentity('animation-recovery');
  const results = [];
  let browser;
  try {
    browser = await portable.launch();
    for (const name of selected ? [selected] : ['hero', 'knowledge', 'catalog-wait']) {
      const result = name === 'catalog-wait' ? await catalogWait(browser) : await runCase(browser, name);
      results.push(result);
      console.log(`${result.passed ? 'PASS' : 'FAIL'} ${name}${result.error ? `: ${result.error}` : ''}`);
    }
  } finally {
    try { if (browser) await browser.close(); }
    finally { fs.writeFileSync(path.join(portable.evidence, 'animation-recovery.json'), JSON.stringify({ url: portable.url, results }, null, 2) + '\n'); }
  }
  assert(results.length && results.every(result => result.passed), 'Animation recovery regression failed');
}
main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
