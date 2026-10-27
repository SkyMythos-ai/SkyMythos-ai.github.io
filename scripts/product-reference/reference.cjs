const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const names = ['delivery', 'methods', 'management'];
const stages = ['start', 'middle', 'result'];
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
const revision = '033a372f66d5f53bbc8e6b519868238976701c47';
const sceneGeometry = name => ({ width: 1280, height: name === 'methods' ? 1100 : 700, crop: { x: name === 'methods' ? 260 : 240, y: name === 'methods' ? 300 : 56, width: 996, height: 623 } });

/** 仅接受版本目录内的普通文件；链接和路径穿越不能绕过发布资源清单。 */
function readAsset(directory, relative) {
  assert(typeof relative === 'string' && /^[a-z0-9][a-z0-9.-]*$/i.test(relative), `Unsafe resource path: ${relative}`);
  const file = path.join(directory, relative);
  assert(fs.lstatSync(file).isFile() && !fs.lstatSync(file).isSymbolicLink(), `Not a regular resource: ${relative}`);
  return fs.readFileSync(file);
}

function decodeAttribute(value) {
  return value.replace(/&#(x[\da-f]+|\d+);?/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code.replace(/^x/i, ''), /^x/i.test(code) ? 16 : 10)))
    .replace(/&(?:colon|tab|newline);/gi, entity => ({ '&colon;': ':', '&tab;': '\t', '&newline;': '\n' })[entity.toLowerCase()]);
}

// 这是固定资源的保守词法门禁，不是接受任意网页的 HTML sanitizer。
function openingTags(html) {
  const tags = [];
  const stack = [];
  const voids = new Set(['img', 'input', 'br']);
  const token = /<!--[\s\S]*?-->|<\/?([a-z][a-z0-9:-]*)(?:\s+(?:[^\s"'<>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)\s*)*\s*\/?>/gi;
  let cursor = 0;
  for (const match of html.matchAll(token)) {
    assert(!html.slice(cursor, match.index).includes('<'), 'Malformed product HTML');
    cursor = match.index + match[0].length;
    if (!match[1]) continue;
    const name = match[1].toLowerCase();
    if (/^<\//.test(match[0])) {
      assert.equal(stack.pop(), name, 'Malformed or unbalanced product HTML');
      continue;
    }
    const attributes = new Map();
    const body = match[0].slice(match[1].length + 1).replace(/\/?\s*>$/, '');
    const attr = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    for (const item of body.matchAll(attr)) {
      const name = item[1].toLowerCase();
      assert(!attributes.has(name), `Duplicate product attribute: ${name}`);
      attributes.set(name, decodeAttribute(item[2] ?? item[3] ?? item[4] ?? ''));
    }
    tags.push({ name, attributes, depth: stack.length });
    if (!voids.has(name) && !/\/>$/.test(match[0])) stack.push(name);
  }
  assert(!html.slice(cursor).includes('<'), 'Malformed product HTML tail');
  assert.equal(stack.length, 0, 'Unclosed product HTML');
  return tags;
}

/** 失败即阻断：终态与按需帧都必须是 inert、空密码、无可执行业务资源的固定 canvas。 */
function validateHtml(html, geometry) {
  assert(!/\/(?:Users|home)\/|file:\/\/|sourceMappingURL/i.test(html), 'Private path in product HTML');
  const tags = openingTags(html);
  const root = tags[0];
  assert(root?.name === 'div' && root.attributes.get('class') === 'product-reference-root' && root.attributes.has('inert'), 'Product root must remain inert');
  assert.equal(tags.filter(tag => tag.depth === 0).length, 1, 'All product content must stay inside the inert root');
  const style = root.attributes.get('style') ?? '';
  assert.equal(style, `width:${geometry.width}px;height:${geometry.height}px;--product-reference-width:${geometry.width}px;--product-reference-height:${geometry.height}px`, 'Product canvas dimensions changed');
  const allowed = new Set('div a header span img nav svg defs clippath path g circle rect button aside h2 p section h3 strong main input h1 form br i small article dl dt dd label textarea h4 ul li ol table thead tr th tbody td select option footer'.split(' '));
  for (const { name, attributes } of tags) {
    assert(allowed.has(name), `Unsafe product element: ${name}`);
    for (const [key, value] of attributes) {
      assert(!/^on/i.test(key) && !['srcdoc', 'action', 'formaction', 'srcset', 'is', 'autofocus'].includes(key), `Unsafe product attribute: ${key}`);
      assert(!/(?:javascript|vbscript)\s*:|expression\s*\(|@import|url\s*\(/i.test(value.replace(/url\(#[\w-]+\)/g, '').replace(/[\u0000- ]/g, '')), `Executable product attribute: ${key}`);
      if (key === 'src') {
        assert(name === 'img' && /^data:image\/svg\+xml(?:;base64,|,)/i.test(value), 'Product image must be embedded SVG');
        const comma = value.indexOf(',');
        const svg = /;base64,/i.test(value) ? Buffer.from(value.slice(comma + 1), 'base64').toString('utf8') : decodeURIComponent(value.slice(comma + 1));
        assert(!/<\s*(?:script|foreignobject|image|use|style|animate|set)\b|\son\w+\s*=|(?:href|src)\s*=|<!DOCTYPE|<!ENTITY/i.test(svg), 'Unsafe embedded product SVG');
      }
      if (key === 'href' || key === 'xlink:href') {
        assert(name === 'a' && (/^#[\w-]+$/.test(value) || /^\/w\/reference\//.test(value) || value === 'https://github.com/settings/personal-access-tokens/new'), 'Unexpected product navigation');
      }
    }
    if (name === 'input' && attributes.get('type')?.toLowerCase() === 'password') assert.equal(attributes.get('value'), '', 'Product password must be explicitly empty');
  }
  assert.equal((html.match(/class="product-reference-root"/g) ?? []).length, 1, 'Multiple product roots');
  assert(html.endsWith('</div>'), 'Product snapshot must have a complete root');
  return tags;
}

function pngSize(buffer) {
  assert(buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && buffer.toString('ascii', 12, 16) === 'IHDR', 'Invalid PNG header');
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function validateCss(css) {
  assert(css.includes(':host') && css.includes('.product-reference-root'), 'Missing product Shadow DOM isolation');
  assert(!/@import|url\s*\(|expression\s*\(|<\/style|sourceMappingURL|\/(?:Users|home)\//i.test(css), 'Unsafe or nonportable product CSS');
}

function createManifest(directory, original, notice = 'NOTICE.txt') {
  const manifest = { schemaVersion: 2, product: { revision: original.product.revision }, css: 'product.css', scenes: {}, images: {}, notice, transformations: [], assets: {} };
  for (const name of names) {
    const source = original.scenes[name];
    manifest.scenes[name] = { width: source.width, height: source.height, crop: source.crop, terminal: `${name}-result`, frames: {} };
    for (const stage of stages) {
      const frame = source.frames.find(item => item.id === stage);
      assert(frame, `Missing capture stage: ${name}/${stage}`);
      const filename = `${name}-${stage}.html`;
      manifest.scenes[name].frames[stage] = { id: `${name}-${stage}`, path: filename, sha256: sha256(readAsset(directory, filename)), phase: frame.phase, label: frame.label };
    }
  }
  for (const name of ['workbench', ...names]) {
    const filename = original.images[name];
    manifest.images[name] = { path: filename, ...pngSize(readAsset(directory, filename)) };
  }
  for (const filename of [...names.flatMap(name => stages.map(stage => `${name}-${stage}.html`)), 'product.css', ...names.map(name => `full-${name}.png`), notice].sort()) manifest.assets[filename] = sha256(readAsset(directory, filename));
  return manifest;
}

/** 普通构建只读当前仓内版本；baseline 独立固定 manifest SHA，不允许同步重写变绿。 */
function validateReference(directory, baseline) {
  assert(fs.lstatSync(directory).isDirectory() && !fs.lstatSync(directory).isSymbolicLink(), 'Product version must be a real directory');
  const bytes = readAsset(directory, 'manifest.json');
  assert.equal(sha256(bytes), baseline.manifestSha256, 'Product manifest drift; refresh requires explicit review');
  const manifest = JSON.parse(bytes);
  assert.equal(manifest.schemaVersion, 2, 'Unsupported product reference schema');
  assert.equal(manifest.product.revision, baseline.revision);
  assert.deepEqual(Object.keys(manifest.scenes).sort(), [...names].sort(), 'Scene inventory drift');
  const expectedAssets = [...names.flatMap(name => stages.map(stage => `${name}-${stage}.html`)), 'product.css', ...names.map(name => `full-${name}.png`), 'NOTICE.txt'].sort();
  assert.deepEqual(Object.keys(manifest.assets).sort(), expectedAssets, 'Resource inventory drift');
  assert.deepEqual(fs.readdirSync(directory).sort(), [...expectedAssets, 'manifest.json'].sort(), 'Added or removed product resource');
  for (const [filename, hash] of Object.entries(manifest.assets)) assert.equal(sha256(readAsset(directory, filename)), hash, `Product export drift: ${filename}`);
  validateCss(readAsset(directory, manifest.css).toString('utf8'));
  for (const name of names) {
    const scene = manifest.scenes[name];
    const geometry = sceneGeometry(name);
    assert.deepEqual({ width: scene.width, height: scene.height, crop: scene.crop }, geometry, `Scene dimensions changed: ${name}`);
    assert.equal(scene.terminal, `${name}-result`);
    assert.deepEqual(Object.keys(scene.frames).sort(), [...stages].sort(), 'Frame inventory drift');
    for (const stage of stages) {
      const frame = scene.frames[stage];
      assert.equal(frame.id, `${name}-${stage}`);
      assert.equal(frame.path, `${name}-${stage}.html`);
      assert.equal(frame.sha256, manifest.assets[frame.path]);
      validateHtml(readAsset(directory, frame.path).toString('utf8'), geometry);
    }
  }
  assert.deepEqual(Object.keys(manifest.images).sort(), ['workbench', ...names].sort());
  for (const name of ['workbench', ...names]) {
    const image = manifest.images[name];
    assert.equal(image.path, `full-${name === 'workbench' ? 'delivery' : name}.png`);
    assert.deepEqual(pngSize(readAsset(directory, image.path)), { width: 2160, height: 1050 }, `Full image dimensions changed: ${name}`);
    assert.deepEqual({ width: image.width, height: image.height }, { width: 2160, height: 1050 });
  }
  return manifest;
}

module.exports = { names, stages, revision, sceneGeometry, sha256, readAsset, openingTags, validateHtml, validateCss, pngSize, createManifest, validateReference };
