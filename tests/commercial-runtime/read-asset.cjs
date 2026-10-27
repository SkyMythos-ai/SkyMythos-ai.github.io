const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const ts = require('typescript');
const portable = require('../../scripts/commercial/browser.cjs');
const boundaryOnly = process.argv.includes('--boundary-only');
assert(process.argv.slice(2).every(argument => argument === '--boundary-only'), 'Unknown read-asset argument');

// 只追加测试导出，真实请求和故障注入共用生产读取器，不复制读取实现。
const source = fs.readFileSync(path.join(portable.project, 'src/components/commercial/demo-controller.ts'), 'utf8');
const js = ts.transpileModule(source + '\nexport const __boundary = { readAsset, loadFrame, mountCapabilityDemos };', { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const manifest = portable.manifest();
const assets = ['manifest.json', ...Object.values(manifest.scenes).flatMap(scene => ['start', 'middle'].map(phase => scene.frames[phase].path))].map(file => {
  const bytes = fs.readFileSync(path.join(portable.referenceRoot, file));
  return { path: portable.referencePath + file, length: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), max: file === 'manifest.json' ? 64_000 : 1_000_000 };
});

const report = {
  startedAt: new Date().toISOString(), url: portable.url,
  scope: boundaryOnly ? 'controlled-boundaries-only' : 'real-transfers-and-controlled-boundaries',
  sourceIdentity: crypto.createHash('sha256').update(source).digest('hex'),
  testIdentity: crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex'),
  assets, transfers: [],
};
process.once('exit', () => {
  report.finishedAt = new Date().toISOString();
  report.endSourceIdentity = crypto.createHash('sha256').update(fs.readFileSync(path.join(portable.project, 'src/components/commercial/demo-controller.ts'))).digest('hex');
  if (report.endSourceIdentity !== report.sourceIdentity) {
    report.identityError = 'Production reader source changed during regression';
    process.exitCode = 1;
  }
  report.exitCode = process.exitCode || 0;
  fs.writeFileSync(path.join(portable.evidence, 'read-asset.json'), JSON.stringify(report, null, 2));
});

async function realTransfers(browser) {
  for (let iteration = 0; iteration < 6; iteration++) {
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await page.goto(new URL('product/', portable.base).href, { waitUntil: 'load' });
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      const pending = new Map(), finished = [], failed = [], cdpFailed = [];
      const row = { iteration, finished, failed, cdpFailed };
      report.transfers.push(row);
      const target = url => assets.some(asset => new URL(asset.path, portable.base).href === url);
      page.on('requestfinished', request => { if (target(request.url())) finished.push(request.url()); });
      page.on('requestfailed', request => { if (target(request.url())) failed.push({ url: request.url(), error: request.failure() }); });
      cdp.on('Network.requestWillBeSent', event => { if (target(event.request.url)) pending.set(event.requestId, event.request.url); });
      cdp.on('Network.loadingFailed', event => { if (pending.has(event.requestId)) cdpFailed.push({ url: pending.get(event.requestId), error: event.errorText }); });
      const reads = await page.evaluate(async ({ js, assets }) => {
        const exports = {};
        new Function('exports', 'require', js)(exports, () => ({}));
        const controller = new AbortController();
        const values = await Promise.all(assets.map(async asset => {
          const bytes = await exports.__boundary.readAsset(new URL(asset.path, location.origin), controller.signal, asset.max);
          const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(value => value.toString(16).padStart(2, '0')).join('');
          return { path: asset.path, length: bytes.byteLength, sha256: digest };
        }));
        return { values, aborted: controller.signal.aborted };
      }, { js, assets });
      row.reads = reads;
      // 等待真实网络终态（最多五秒），断言在关闭 context 前完成，不过滤失败。
      const deadline = Date.now() + 5_000;
      while (finished.length + failed.length < assets.length && Date.now() < deadline) await page.waitForTimeout(25);
      await page.waitForTimeout(100);
      Object.assign(row, { finished: [...finished], failed: [...failed], cdpFailed: [...cdpFailed], preTeardown: true });
      assert.equal(reads.aborted, false);
      assert.deepEqual(reads.values, assets.map(({ path, length, sha256 }) => ({ path, length, sha256 })));
      assert.deepEqual(failed, [], 'Completed production reads must not emit requestfailed');
      assert.deepEqual(cdpFailed, [], 'Completed production reads must not emit CDP loadingFailed');
      assert.deepEqual(finished.sort(), assets.map(asset => new URL(asset.path, portable.base).href).sort(), 'All seven reads must finish before teardown');
      console.log(`PASS real seven-asset production reads ${iteration + 1}: matching bytes/hashes, seven requestfinished, zero failures`);
    } finally { await context.close(); }
  }
}

async function boundaryPage(context) {
  const page = await context.newPage();
  const url = new URL('__read-asset-boundary__', portable.base).href;
  await page.route(url, route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body></body></html>' }));
  await page.goto(url);
  return page;
}

async function boundaryFailures(browser) {
  const context = await browser.newContext();
  try {
    const page = await boundaryPage(context);
    const results = await page.evaluate(async js => {
      const exports = {};
      new Function('exports', 'require', js)(exports, () => ({}));
      const originalFetch = window.fetch;
      const rows = [], options = [];
      const url = new URL('/product-reference/test/frame.html', location.origin);
      const verify = (condition, label) => { if (!condition) throw new Error(label); };
      const rejection = async (promise, label) => {
        try { await promise; } catch (error) { verify(error instanceof Error, `${label}: Error required`); return error; }
        throw new Error(`${label}: expected rejection`);
      };
      try {
        for (const max of [64_000, 1_000_000]) for (const header of [null, '1']) for (const overflow of [false, true]) {
          const state = { offset: 0, canceled: false, eof: false };
          const size = max + Number(overflow);
          const body = new ReadableStream({
            pull(controller) {
              if (state.offset === size) {
                if (!overflow) { state.eof = true; controller.close(); }
                return;
              }
              const length = Math.min(32_000, size - state.offset);
              const bytes = new Uint8Array(length).fill(97);
              controller.enqueue(bytes); state.offset += length;
            },
            cancel() { state.canceled = true; },
          }, { highWaterMark: 0 });
          window.fetch = async (input, init) => { options.push(init); return new Response(body, { headers: header === null ? {} : { 'content-length': header } }); };
          const controller = new AbortController();
          const label = `${max} ${overflow ? 'max+1' : 'exact'} ${header === null ? 'absent' : 'lying'} Content-Length`;
          if (overflow) {
            const error = await rejection(exports.__boundary.readAsset(url, controller.signal, max), label);
            verify(error.message === 'Product asset exceeds size budget', `${label}: safe budget error`);
            // pipeThrough 传播取消是在流错误后的微任务，而不是独立读取或延迟网络旁路。
            await new Promise(resolve => setTimeout(resolve, 0));
            verify(state.canceled && !state.eof, `${label}: source canceled before EOF`);
          } else {
            const bytes = await exports.__boundary.readAsset(url, controller.signal, max);
            verify(bytes.byteLength === max && bytes.every(byte => byte === 97), `${label}: full content`);
            verify(state.eof && !state.canceled, `${label}: normal EOF without cancel`);
          }
          rows.push(label);
        }
        for (const mode of ['source-error', 'mid-read-abort', 'deadline']) {
          const controller = new AbortController();
          let pulls = 0, canceled = false, source;
          const body = new ReadableStream({
            start(controller) { source = controller; },
            pull(stream) {
              if (++pulls === 1) { stream.enqueue(new Uint8Array([97])); return; }
              if (mode === 'source-error') stream.error(new Error('Injected source failure'));
              else if (mode === 'mid-read-abort') controller.abort();
              // deadline 保持读取 pending，显式触发拥有者的超时取消。
            },
            cancel() { canceled = true; },
          }, { highWaterMark: 0 });
          // 模拟原生 fetch 将传输取消传播为响应体 AbortError；读取器仍为生产实现。
          window.fetch = async (input, init) => {
            init.signal.addEventListener('abort', () => {
              canceled = true;
              source.error(new DOMException('The operation was aborted.', 'AbortError'));
            }, { once: true });
            return new Response(body);
          };
          const promise = exports.__boundary.readAsset(url, controller.signal, 1_000_000);
          if (mode === 'deadline') setTimeout(() => controller.abort(), 0);
          const error = await rejection(promise, mode);
          if (mode === 'source-error') verify(error.message === 'Injected source failure', mode);
          else {
            await new Promise(resolve => setTimeout(resolve, 0));
            verify(error.name === 'AbortError' && canceled && pulls === 2, `${mode}: abort during pending read before EOF`);
          }
          rows.push(mode);
        }
        let headerBodyRead = false;
        window.fetch = async () => new Response(new ReadableStream({ pull() { headerBodyRead = true; } }, { highWaterMark: 0 }), { headers: { 'content-length': '1000001' } });
        const error = await rejection(exports.__boundary.readAsset(url, new AbortController().signal, 1_000_000), 'oversized header');
        verify(error.message === 'Unavailable product asset' && !headerBodyRead, 'oversized header: safe rejection without body read');
        rows.push('oversized declared length rejected before body read');
        for (const init of options) {
          verify(init.method === 'GET' && init.credentials === 'omit' && init.redirect === 'error' && init.mode === 'same-origin' && init.cache === 'force-cache' && init.referrerPolicy === 'no-referrer' && init.signal instanceof AbortSignal, 'security request options unchanged');
        }
        return rows;
      } finally { window.fetch = originalFetch; }
    }, js);
    for (const row of results) console.log(`PASS production readAsset boundary: ${row}`);
  } finally { await context.close(); }
}

async function deadlineAndLateInstall(browser) {
  const context = await browser.newContext();
  try {
    const page = await boundaryPage(context);
    await page.clock.install();
    const frames = Object.fromEntries(Object.values(manifest.scenes).flatMap(scene => ['start', 'middle'].map(phase => {
      const file = scene.frames[phase].path;
      return [file, fs.readFileSync(path.join(portable.referenceRoot, file), 'utf8')];
    })));
    await page.evaluate(async ({ js, manifest, frames }) => {
      const exports = {};
      new Function('exports', 'require', js)(exports, id => id.includes('animation-hold') ? { observeAnimationHold: () => () => {} } : {
        isCapabilityDemoName: name => ['delivery', 'methods', 'management'].includes(name),
        demoDurations: { delivery: 12, methods: 12, management: 12 },
        demoFrame: (name, elapsed, still) => ({ phase: still ? 'result' : 'start', complete: still }),
      });
      const root = document.createElement('section');
      root.style.cssText = 'position:absolute;top:100000px';
      for (const name of ['delivery', 'methods', 'management']) {
        const host = document.createElement('div');
        host.dataset.nativeDemo = name;
        host.dataset.referenceManifest = '/product-reference/test/manifest.json';
        host.dataset.productStyles = 'ready';
        const shadow = host.attachShadow({ mode: 'open' });
        shadow.innerHTML = `<div data-product-canvas><div data-product-frame="${name}-result">Safe terminal</div></div>`;
        root.append(host);
      }
      document.body.append(root);
      const pending = [];
      window.fetch = async input => {
        const file = new URL(input).pathname.split('/').pop();
        if (file === 'manifest.json') return new Response(JSON.stringify(manifest));
        // 依赖故意忽略 AbortSignal，验证真实 prepare 仍拒绝超时后的迟到内容。
        return new Promise(resolve => pending.push(() => resolve(new Response(frames[file]))));
      };
      const controller = exports.__boundary.mountCapabilityDemos(root, root);
      controller.update({ current: 'delivery', mode: 'stage', settled: false });
      window.__readAssetDeadline = { root, controller, pending };
    }, { js, manifest, frames });
    await page.waitForFunction(() => window.__readAssetDeadline.pending.length === 6);
    await page.clock.runFor(14_999);
    assert.equal(await page.evaluate(() => window.__readAssetDeadline.root.dataset.demoReadiness), 'loading', 'Production deadline must not fire early');
    await page.clock.runFor(1);
    await page.evaluate(async () => {
      const { pending } = window.__readAssetDeadline;
      pending.forEach(resolve => resolve());
      await new Promise(resolve => queueMicrotask(resolve));
    });
    await page.clock.runFor(1);
    assert.deepEqual(await page.evaluate(() => {
      const { root } = window.__readAssetDeadline;
      return { readiness: root.dataset.demoReadiness, counts: [...root.children].map(host => host.shadowRoot.querySelectorAll('[data-product-frame]').length), text: [...root.children].map(host => host.shadowRoot.textContent) };
    }), { readiness: 'static', counts: [1, 1, 1], text: ['Safe terminal', 'Safe terminal', 'Safe terminal'] }, 'Deadline preserves safe terminal and rejects late installation');
    await page.evaluate(() => window.__readAssetDeadline.controller.dispose());
    console.log('PASS production 15-second deadline: loading at 14999ms, static at 15000ms, no late frame installation');
  } finally { await context.close(); }
}

(async () => {
  const browser = await portable.launch();
  try {
    if (!boundaryOnly) await realTransfers(browser);
    await boundaryFailures(browser);
    await deadlineAndLateInstall(browser);
  } finally { await browser.close(); }
})().catch(error => { report.error = error.stack; console.error(error.stack); process.exitCode = 1; });
