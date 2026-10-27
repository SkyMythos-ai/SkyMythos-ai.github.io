const fs = require('node:fs');
const path = require('node:path');
const { project, base, siteBasePath, pageState, requestState, evidence } = require('./browser.cjs');
const classifications = [];
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
  if (failure !== 'net::ERR_ABORTED' || request.resourceType() !== 'fetch') return null;
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
  classifications.push({ url: request.url(), method: request.method(), resourceType: request.resourceType(), failure: request.failure(), reason });
  return true;
}
module.exports = { transportPolicy, expectedFailure, recordExpectedFailure };
