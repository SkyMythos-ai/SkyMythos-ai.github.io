const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');

// 用固定导出目录和可控 frame 生命周期验证生产分类器，不依赖本地 out 或浏览器。
const revision = '14f40b0fc37f7a20eeab00293e3527725552a255';
const revision2 = '7295629889d881f3485168832359d16d141021f9';
const root = '/fixture/out';
const demo = `${root}/product-demo/${revision}`;
const scene = `${root}/product-scenes/${revision2}-composed-v1`;
const tree = {
  [root]: [['product-demo', true], ['product-scenes', true], ['zh', true], ['_next', true]],
  [`${root}/product-demo`]: [[revision, true]],
  [demo]: [['index.html', false], ['assets', true]],
  [`${demo}/assets`]: [['app.js', false], ['app.css', false], ['font.woff2', false]],
  [`${root}/product-scenes`]: [[`${revision2}-composed-v1`, true]],
  [scene]: [['index.html', false], ['assets', true]],
  [`${scene}/assets`]: [['app.js', false]],
  [`${root}/zh`]: [['index.html', false], ['index.txt', false]],
  [`${root}/_next`]: [['main.js', false]],
};
const browser = {
  project: '/fixture', base: new URL('http://localhost:4173/stage/zh/'), siteBasePath: '/stage', evidence: '/evidence',
  pageState: page => page.state, requestState: request => request.state,
};
const exitHandlers = [];
let recorded;
const sandbox = {
  module: { exports: {} }, process: { argv: ['node', 'transport.cjs'], once: (event, handler) => { if (event === 'exit') exitHandlers.push(handler); } },
  URL, setTimeout, clearTimeout,
  require(name) {
    if (name === './browser.cjs') return browser;
    if (name === 'node:fs') return {
      readdirSync: directory => (tree[directory] || []).map(([name, directoryEntry]) => ({ name, isDirectory: () => directoryEntry })),
      writeFileSync: (_file, value) => { recorded = JSON.parse(value); },
    };
    return require(name);
  },
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../scripts/commercial/transport.cjs'), 'utf8'), sandbox, { filename: 'transport.cjs' });
const transport = sandbox.module.exports;
const directory = `/stage/product-demo/${revision}/`;
const sceneDirectory = `/stage/product-scenes/${revision2}-composed-v1/`;

function sample({ url = `http://localhost:4173${directory}assets/app.js`, frameUrl = `http://localhost:4173${directory}index.html?scene=delivery`, detached = true, child = true, method = 'GET', type = 'script', failure = 'net::ERR_ABORTED', headers = {}, state = null } = {}) {
  const page = Object.assign(new EventEmitter(), { state });
  const frame = { detached, url: () => frameUrl, parentFrame: () => child ? {} : null, isDetached() { return this.detached; }, page: () => page };
  return { url: () => url, frame: () => frame, method: () => method, resourceType: () => type, failure: () => ({ errorText: failure }), headers: () => headers, state };
}
function decision(options, track = true) {
  const request = sample(options);
  if (track) transport.trackRequest(request);
  return transport.expectedFailure(request);
}

const expected = 'Detached product demonstration frame canceled its exported static asset';
assert.equal(decision({}), expected);
assert.equal(decision({ url: `http://localhost:4173${directory}assets/app.css`, type: 'stylesheet' }), expected);
assert.equal(decision({ url: `http://localhost:4173${directory}assets/font.woff2`, type: 'font' }), expected);
assert.equal(decision({ frameUrl: `http://localhost:4173${sceneDirectory}index.html`, url: `http://localhost:4173${sceneDirectory}assets/app.js` }), expected);
for (const [label, options, track] of [
  ['untracked request', {}, false],
  ['live frame', { detached: false }, true],
  ['main frame', { child: false }, true],
  ['foreign frame', { frameUrl: `https://external.test${directory}index.html` }, true],
  ['foreign asset', { url: `https://external.test${directory}assets/app.js` }, true],
  ['foreign revision', { url: `http://localhost:4173${sceneDirectory}assets/app.js` }, true],
  ['unknown file', { url: `http://localhost:4173${directory}assets/missing.js` }, true],
  ['query', { url: `http://localhost:4173${directory}assets/app.js?v=1` }, true],
  ['write', { method: 'POST' }, true],
  ['other error', { failure: 'net::ERR_FAILED' }, true],
  ['wrong resource type', { type: 'fetch' }, true],
  ['main site script', { url: 'http://localhost:4173/stage/_next/main.js' }, true],
]) assert.equal(decision(options, track), null, label);

// 已有 fetch/Next/CSP 策略不随子 frame 规则而变化。
assert.match(decision({ url: 'http://localhost:4173/stage/zh/', method: 'HEAD', type: 'fetch' }, false), /Next static-export/);
assert.match(decision({ url: 'http://localhost:4173/stage/zh/index.txt', headers: { rsc: '1' }, type: 'fetch' }, false), /Next exported RSC/);
assert.match(decision({ url: 'http://localhost:4173/stage/_next/main.js', type: 'script', failure: 'csp', state: { javaScriptEnabled: false } }, false), /no-JavaScript/);
const explicitState = { canceledReads: new Map(), closing: false };
const canceled = sample({ type: 'fetch', state: explicitState });
explicitState.canceledReads.set(canceled, 'Explicit product cancellation');
assert.equal(transport.expectedFailure(canceled), 'Explicit product cancellation');
assert.match(decision({ url: 'http://localhost:4173/stage/_next/main.js', type: 'fetch', state: { canceledReads: new Map(), closing: true } }, false), /Explicit test page\/context close/);
const request = sample();
transport.trackRequest(request);
assert.equal(transport.recordExpectedFailure(request), true);
exitHandlers.forEach(handler => handler());
assert.equal(recorded.classifications.length, 1);
assert.equal(recorded.classifications[0].demoFrame.directory, directory);
assert.equal(recorded.classifications[0].demoFrame.detached, true);
assert.equal(recorded.classifications[0].reason, expected);
console.log('PASS transport: detached product-frame reads and rejection boundaries');

module.exports = async function checkLifecycleOrder() {
  const delayed = sample({ detached: false });
  transport.trackRequest(delayed);
  const pending = transport.recordExpectedFailureAfterLifecycle(delayed);
  assert.equal(delayed.frame().page().listenerCount('framedetached'), 1, 'Matching live frame waits for its lifecycle event');
  delayed.frame().page().emit('framedetached', {});
  assert.equal(delayed.frame().page().listenerCount('framedetached'), 1, 'Another frame cannot satisfy the wait');
  delayed.frame().detached = true;
  delayed.frame().page().emit('framedetached', delayed.frame());
  assert.equal(await pending, true, 'A subsequent detach classifies the canceled request');
  assert.equal(delayed.frame().page().listenerCount('framedetached'), 0, 'Detach listener is removed');

  const live = sample({ detached: false });
  transport.trackRequest(live);
  assert.equal(await transport.recordExpectedFailureAfterLifecycle(live), false, 'Timeout cannot excuse a live frame failure');
  assert.equal(live.frame().page().listenerCount('framedetached'), 0, 'Timeout removes the listener');

  const unknown = sample({ detached: false, url: `http://localhost:4173${directory}assets/missing.js` });
  transport.trackRequest(unknown);
  const immediate = transport.recordExpectedFailureAfterLifecycle(unknown);
  assert.equal(unknown.frame().page().listenerCount('framedetached'), 0, 'Unknown file does not wait');
  assert.equal(await immediate, false);
  console.log('PASS transport lifecycle: matching detach, timeout rejection and unrelated request');
};
