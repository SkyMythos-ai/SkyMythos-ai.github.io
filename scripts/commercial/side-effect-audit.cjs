const { base, manifest, referencePath } = require('./browser.cjs');
const { transportPolicy } = require('./transport.cjs');

function readPolicy() {
  const data = manifest();
  const productPaths = [referencePath + 'manifest.json', ...Object.values(data.scenes).flatMap(scene => ['start', 'middle'].map(stage => referencePath + scene.frames[stage].path))];
  const { rsc, documents } = transportPolicy();
  return { origin: base.origin, productPaths, rscPaths: [...rsc], documentPaths: [...documents] };
}
function allowedRequest(request, policy) {
  if (request.type !== 'fetch') return !['xhr', 'websocket', 'eventsource'].includes(request.type);
  const url = new URL(request.url);
  if (url.origin !== policy.origin || url.username || url.password) return false;
  if (request.method === 'HEAD') return !url.search && policy.documentPaths.includes(url.pathname);
  if (request.method !== 'GET') return false;
  if (policy.productPaths.includes(url.pathname) && !url.search) return true;
  return policy.rscPaths.includes(url.pathname) && request.headers?.rsc === '1';
}
/** 在浏览器 API 边界审计，只放行产品静态 GET、真实导出 Next RSC GET 及实际页面 HEAD 探测。 */
async function installSideEffectAudit(page) {
  const policy = readPolicy();
  await page.addInitScript(policy => {
    const effects = [];
    const reads = [];
    Object.defineProperty(window, '__nativeDemoEffects', { value: effects });
    Object.defineProperty(window, '__nativeDemoReads', { value: reads });
    const record = (type, value) => effects.push({ type, value: String(value ?? '') });
    for (const method of ['getItem', 'setItem', 'removeItem', 'clear', 'key']) {
      const original = Storage.prototype[method];
      Storage.prototype[method] = function (...args) { record(`storage.${method}`, args[0]); return original.apply(this, args); };
    }
    const cookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    if (cookie) Object.defineProperty(Document.prototype, 'cookie', { ...cookie,
      get() { record('cookie.get', ''); return cookie.get.call(this); },
      set(value) { record('cookie.set', ''); return cookie.set.call(this, value); },
    });
    const fetch = window.fetch;
    window.fetch = function (input, options = {}) {
      const request = input instanceof Request ? input : null;
      const target = new URL(request ? request.url : String(input), location.href);
      const method = (options.method || request?.method || 'GET').toUpperCase();
      const credentials = options.credentials || request?.credentials || 'same-origin';
      const headers = new Headers(options.headers || request?.headers);
      const sameOrigin = target.origin === policy.origin && !target.username && !target.password;
      const noCredentialHeaders = !['authorization', 'proxy-authorization', 'cookie', 'x-api-key'].some(name => headers.has(name));
      const product = sameOrigin && noCredentialHeaders && policy.productPaths.includes(target.pathname) && !target.search && !target.hash && method === 'GET' && credentials === 'omit';
      const rsc = sameOrigin && noCredentialHeaders && policy.rscPaths.includes(target.pathname) && method === 'GET' && ['omit', 'same-origin'].includes(credentials) && headers.get('rsc') === '1';
      const head = sameOrigin && noCredentialHeaders && policy.documentPaths.includes(target.pathname) && !target.search && !target.hash && method === 'HEAD' && ['omit', 'same-origin'].includes(credentials);
      const details = { url: target.href, method, credentials, product, rsc, head };
      if (product || rsc || head) reads.push(details); else record('fetch', JSON.stringify(details));
      return fetch.call(this, input, options);
    };
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) { record('xhr', args[1]); return open.apply(this, args); };
    const beacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = (...args) => { record('beacon', args[0]); return beacon(...args); };
    for (const method of ['open', 'deleteDatabase']) {
      const original = indexedDB[method].bind(indexedDB);
      indexedDB[method] = (...args) => { record(`indexedDB.${method}`, args[0]); return original(...args); };
    }
    for (const name of ['WebSocket', 'EventSource']) {
      const Original = window[name];
      window[name] = class extends Original { constructor(...args) { record(name, args[0]); super(...args); } };
    }
    for (const [owner, methods, prefix] of [
      [navigator.credentials, ['get', 'create', 'store', 'preventSilentAccess'], 'credentials'],
      [window.cookieStore, ['get', 'getAll', 'set', 'delete'], 'cookieStore'],
      [window.caches, ['open', 'match', 'has', 'keys', 'delete'], 'caches'],
    ]) if (owner) for (const method of methods) if (typeof owner[method] === 'function') {
      const original = owner[method].bind(owner);
      owner[method] = (...args) => { record(`${prefix}.${method}`, ''); return original(...args); };
    }
  }, policy);
  return policy;
}
module.exports = { readPolicy, allowedRequest, installSideEffectAudit };
