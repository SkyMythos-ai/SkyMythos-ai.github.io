const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const browserPin = require('./browser-version.json');

const project = path.resolve(__dirname, '../..');
const base = new URL(process.env.PREVIEW_URL || 'http://127.0.0.1:4173/zh/');
assert(base.pathname.endsWith('/') && !base.search && !base.hash, 'PREVIEW_URL must end in / without a query or fragment');
const siteBasePath = base.pathname.endsWith('/zh/') ? base.pathname.slice(0, -4) : '';
const publicationPath = '/product-reference/033a372f66d5f53bbc8e6b519868238976701c47/';
const referencePath = siteBasePath + publicationPath;
const referenceRoot = path.resolve(project, 'public', publicationPath.slice(1));
const evidence = process.env.EVIDENCE_DIR ? path.resolve(process.env.EVIDENCE_DIR) : fs.mkdtempSync(path.join(os.tmpdir(), 'commercial-browser-'));
for (const directory of ['public', 'out', '.next']) {
  const forbidden = path.join(project, directory);
  assert(evidence !== forbidden && !evidence.startsWith(`${forbidden}${path.sep}`), 'EVIDENCE_DIR must not publish browser evidence inside site artifacts');
}
fs.mkdirSync(evidence, { recursive: true });

const pageStates = new WeakMap();
const requestStates = new WeakMap();
const wrappedContexts = new WeakSet();
function pageState(page) { return pageStates.get(page); }
function requestState(request) { return requestStates.get(request); }
function expectProductCancellation(page, reason) {
  const state = pageState(page);
  if (!state || !state.pending.size) return;
  const data = manifest();
  const paths = new Set([referencePath + 'manifest.json', ...Object.values(data.scenes).flatMap(scene => ['start', 'middle'].map(stage => referencePath + scene.frames[stage].path))]);
  for (const request of state.pending) {
    const target = new URL(request.url());
    if (request.method() === 'GET' && request.resourceType() === 'fetch' && target.origin === base.origin && !target.search && paths.has(target.pathname)) state.canceledReads.set(request, reason);
  }
}
function wrapPage(page, options = {}) {
  if (pageStates.has(page)) return page;
  const state = { javaScriptEnabled: options.javaScriptEnabled !== false, closing: false, pending: new Set(), canceledReads: new Map() };
  pageStates.set(page, state);
  page.on('request', request => {
    state.pending.add(request);
    requestStates.set(request, state);
    // 在发起时保存 frame 身份；失败时 frame.url() 可能已因卸载而失效。
    require('./transport.cjs').trackRequest(request);
  });
  page.on('requestfinished', request => state.pending.delete(request));
  page.on('requestfailed', request => state.pending.delete(request));
  // 只标记导航发生前已在途的产品静态读取，不把随后新出现的失败一概当作取消。
  for (const method of ['goto', 'reload', 'goBack', 'goForward']) {
    const navigate = page[method].bind(page);
    page[method] = (...args) => { expectProductCancellation(page, `Explicit test ${method} replaced the current document`); return navigate(...args); };
  }
  const close = page.close.bind(page);
  page.close = (...args) => { state.closing = true; return close(...args); };
  return page;
}
function wrapContext(context, options = {}) {
  if (wrappedContexts.has(context)) return context;
  wrappedContexts.add(context);
  const newPage = context.newPage.bind(context);
  context.newPage = async (...args) => wrapPage(await newPage(...args), options);
  const close = context.close.bind(context);
  context.close = (...args) => { context.pages().forEach(page => { const state = pageState(page); if (state) state.closing = true; }); return close(...args); };
  return context;
}
function installedBrowser() {
  const target = { 'darwin-arm64': 'mac-arm64', 'darwin-x64': 'mac-x64', 'linux-x64': 'linux64', 'win32-x64': 'win64' }[`${process.platform}-${process.arch}`];
  assert(target, 'No pinned Chrome for Testing build for this platform; provide an explicit supported browser');
  const cache = process.platform === 'darwin' ? path.join(os.homedir(), 'Library', 'Caches') : (process.env.XDG_CACHE_HOME || path.join(os.homedir(), '.cache'));
  const executable = path.join(cache, 'skymythos-browser', browserPin.version, target, `chrome-headless-shell-${target}`, process.platform === 'win32' ? 'chrome-headless-shell.exe' : 'chrome-headless-shell');
  assert(fs.existsSync(executable), `Pinned Chrome ${browserPin.version} is missing; run npm run install:browser`);
  return executable;
}
async function launch() {
  assert(!(process.env.BROWSER_EXECUTABLE_PATH && process.env.BROWSER_CHANNEL), 'Choose BROWSER_EXECUTABLE_PATH or BROWSER_CHANNEL, not both');
  // 156 的流终态通知顺序会把完整读取误报为取消；固定包含上游修复的引擎，不放宽网络断言。
  const override = Boolean(process.env.BROWSER_EXECUTABLE_PATH || process.env.BROWSER_CHANNEL);
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : { executablePath: process.env.BROWSER_EXECUTABLE_PATH || installedBrowser() }) });
  const actualVersion = browser.version();
  if (!override && actualVersion !== browserPin.version) {
    await browser.close();
    throw new Error(`Expected Chrome ${browserPin.version}, received ${actualVersion}`);
  }
  fs.writeFileSync(path.join(evidence, 'browser-info.json'), JSON.stringify({ expectedVersion: browserPin.version, actualVersion, override, platform: process.platform, arch: process.arch }, null, 2));
  const newContext = browser.newContext.bind(browser);
  browser.newContext = async (options = {}) => wrapContext(await newContext(options), options);
  const newPage = browser.newPage.bind(browser);
  browser.newPage = async (options = {}) => wrapPage(await newPage(options), options);
  return browser;
}
function manifest() { return JSON.parse(fs.readFileSync(path.join(referenceRoot, 'manifest.json'), 'utf8')); }
function referenceImage(name) {
  const image = manifest().images[name];
  assert(image && typeof image.path === 'string', `Missing published image ${name}`);
  const filename = path.resolve(referenceRoot, image.path);
  assert(filename.startsWith(`${referenceRoot}${path.sep}`), 'Published image stays inside its version directory');
  const bytes = fs.readFileSync(filename);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  assert.deepEqual([width, height], [image.width, image.height]);
  return { file: image.path, width, height, ratio: width / height, href: new URL(referencePath + image.path, base).href };
}
function buildIdentity() {
  const files = [];
  function visit(directory) {
    assert(fs.existsSync(directory), `Build identity requires ${directory}; build the real static export first`);
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile()) files.push([path.relative(project, file), crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')]);
    }
  }
  for (const directory of ['src', 'public', 'out', 'scripts/commercial', 'scripts/product-reference', 'scripts/product-demo', 'scripts/product-scenes', 'scripts/product-runtime']) visit(path.join(project, directory));
  for (const name of ['package.json', 'package-lock.json', 'next.config.mjs']) {
    files.push([name, crypto.createHash('sha256').update(fs.readFileSync(path.join(project, name))).digest('hex')]);
  }
  return { sha256: crypto.createHash('sha256').update(JSON.stringify(files)).digest('hex'), files: Object.fromEntries(files) };
}
// 每个独立命令都有可复核的起止身份；异常退出也写身份，且不能把中途重建误报为通过。
function trackIdentity(name) {
  if (process.env.COMMERCIAL_IDENTITY_CHILD === '1') return;
  const startedAt = new Date().toISOString();
  const startIdentity = buildIdentity();
  process.once('exit', () => {
    let endIdentity, error;
    try { endIdentity = buildIdentity(); assert.equal(endIdentity.sha256, startIdentity.sha256, 'Source or exported artifact changed during regression'); }
    catch (failure) { error = failure.stack; process.exitCode = 1; }
    fs.writeFileSync(path.join(evidence, `${name}-identity.json`), JSON.stringify({ startedAt, finishedAt: new Date().toISOString(), url: base.href, startIdentity, endIdentity, error, exitCode: process.exitCode || 0 }, null, 2));
  });
  console.log(`Evidence: ${evidence}; build identity: ${startIdentity.sha256}`);
}
module.exports = { project, base, url: base.href, siteBasePath, referencePath, referenceRoot, evidence, launch, pageState, requestState, expectProductCancellation, manifest, referenceImage, buildIdentity, trackIdentity };
