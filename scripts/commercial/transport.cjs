const fs = require('node:fs');
const path = require('node:path');
const { project, base, siteBasePath, pageState, requestState, evidence } = require('./browser.cjs');
const classifications = [];
const demoRequests = new WeakMap();
process.once('exit', () => fs.writeFileSync(path.join(evidence, `transport-${path.basename(process.argv[1] || 'unit', '.cjs')}.json`), JSON.stringify({ classifications }, null, 2)));

let cached;
function transportPolicy() {
  if (cached) return cached;
  const files = new Set();
  const documents = new Set();
  const rsc = new Set();
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(filename);
      else {
        const relative = '/' + path.relative(path.join(project, 'out'), filename).split(path.sep).join('/');
        const pathname = siteBasePath + relative;
        files.add(pathname);
        if (entry.name === 'index.html') documents.add(pathname.slice(0, -'index.html'.length));
        if (/^(?:__next\..*|index)\.txt$/.test(entry.name)) rsc.add(pathname);
      }
    }
  }
  visit(path.join(project, 'out'));
  cached = { files, documents, rsc };
  return cached;
}

/** 保存发起请求时的子 frame 身份，不能用失败时可能已变化的 URL 猜测来源。 */
function trackRequest(request) {
  try {
    const frame = request.frame();
    if (!frame.parentFrame()) return;
    const frameUrl = new URL(frame.url());
    if (frameUrl.origin !== base.origin || frameUrl.username || frameUrl.password) return;
    const suffix = frameUrl.pathname.slice(siteBasePath.length);
    if (!frameUrl.pathname.startsWith(siteBasePath + '/') || !/^\/product-demo\/[a-f0-9]{40}(?:-lean-v1)?\/index\.html$/.test(suffix) && !/^\/product-scenes\/[a-f0-9]{40}-composed-v[12]\/index\.html$/.test(suffix)) return;
    demoRequests.set(request, { frame, frameUrl: frameUrl.href, directory: frameUrl.pathname.slice(0, -'index.html'.length) });
  } catch {
    // 无 frame 的请求不具备证明条件，保持普通失败处理。
  }
}

function demoRead(request, url, policy) {
  const tracked = demoRequests.get(request);
  if (!tracked || request.method() !== 'GET' || url.search || url.hash || !url.pathname.startsWith(tracked.directory) || !policy.files.has(url.pathname)) return null;
  const resource = request.resourceType();
  if (!(resource === 'script' && /\.(?:js|mjs)$/.test(url.pathname) || resource === 'stylesheet' && /\.css$/.test(url.pathname) || resource === 'font' && /\.(?:woff2?|ttf|otf)$/.test(url.pathname))) return null;
  return tracked;
}

function detachedDemoRead(request, url, policy) {
  const tracked = demoRead(request, url, policy);
  if (!tracked) return null;
  try {
    if (!tracked.frame.isDetached()) return null;
  } catch { return null; }
  return tracked;
}

/** 只分类有作者/浏览器合同的预期取消；所有其它请求失败仍必须让套件失败。 */
function expectedFailure(request) {
  const url = new URL(request.url());
  if (url.origin !== base.origin || url.username || url.password) return null;
  const policy = transportPolicy();
  const failure = request.failure()?.errorText;
  const method = request.method();
  let state = requestState(request);
  if (!state) { try { state = pageState(request.frame().page()); } catch { return null; } }
  if (failure === 'csp' && state?.javaScriptEnabled === false && request.resourceType() === 'script' && method === 'GET' && policy.files.has(url.pathname) && url.pathname.endsWith('.js')) return 'Playwright no-JavaScript policy blocked a declared exported script';
  if (failure !== 'net::ERR_ABORTED') return null;
  if (detachedDemoRead(request, url, policy)) return 'Detached product demonstration frame canceled its exported static asset';
  if (request.resourceType() !== 'fetch') return null;
  // Next 16.4 output:export cache.js:1188 先 HEAD 确认真实页面，再 GET RSC；HEAD 的空 body 可被 Chromium 标为 aborted。
  if (method === 'HEAD' && !url.search && policy.documents.has(url.pathname)) return 'Next static-export document HEAD probe cancellation';
  if (method === 'GET' && request.headers().rsc === '1' && policy.rsc.has(url.pathname)) return 'Next exported RSC prefetch/navigation cancellation';
  if (state?.canceledReads.has(request)) return state.canceledReads.get(request);
  if (state?.closing && ['GET', 'HEAD'].includes(method) && (policy.files.has(url.pathname) || policy.documents.has(url.pathname))) return 'Explicit test page/context close canceled an exported static read';
  return null;
}
function recordExpectedFailure(request) {
  const reason = expectedFailure(request);
  if (!reason) return false;
  const tracked = demoRequests.get(request);
  const demoFrame = reason === 'Detached product demonstration frame canceled its exported static asset'
    ? { urlAtRequest: tracked.frameUrl, directory: tracked.directory, detached: true } : undefined;
  classifications.push({ url: request.url(), method: request.method(), resourceType: request.resourceType(), failure: request.failure(), reason, demoFrame });
  return true;
}

/** Chromium 可先报告取消、随后才分离 frame；只等待同一 frame，最终仍以分离状态判定。 */
async function recordExpectedFailureAfterLifecycle(request) {
  let tracked;
  try {
    const url = new URL(request.url());
    if (demoRequests.has(request) && url.origin === base.origin && !url.username && !url.password && request.failure()?.errorText === 'net::ERR_ABORTED') {
      tracked = demoRead(request, url, transportPolicy());
    }
    if (tracked && !tracked.frame.isDetached()) {
      const page = tracked.frame.page();
      await new Promise(resolve => {
        let timer;
        let finished = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          try { page.off('framedetached', detached); } catch { /* 关闭中的页面仍按最终 frame 状态判定。 */ }
          resolve();
        };
        const detached = frame => { if (frame === tracked.frame) finish(); };
        page.on('framedetached', detached);
        timer = setTimeout(finish, 1000);
        // 注册监听与检查之间可能已分离，不丢失该生命周期事件。
        try { if (tracked.frame.isDetached()) finish(); } catch { finish(); }
      });
    }
  } catch {
    // 异常不构成预期取消的证明，交由同步严格分类。
  }
  return recordExpectedFailure(request);
}
module.exports = { transportPolicy, trackRequest, expectedFailure, recordExpectedFailure, recordExpectedFailureAfterLifecycle };
