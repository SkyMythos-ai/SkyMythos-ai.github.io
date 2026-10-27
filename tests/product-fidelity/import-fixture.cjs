const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

// Explicit review tool, never invoked by build or by the fidelity check itself.
const source = process.argv[2];
assert(source, 'Usage: node tests/product-fidelity/import-fixture.cjs <reviewed-capture-directory>');
const root = path.resolve(source);
const destination = path.resolve(__dirname, '../fixtures/product-reference');
assert(!fs.existsSync(destination), 'Refusing to overwrite an existing independent fixture');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const originalBytes = fs.readFileSync(path.join(root, 'manifest.json'));
const original = JSON.parse(originalBytes);
const manifest = {
  schemaVersion: 1,
  revision: original.product.revision,
  originalCaptureManifestSha256: sha(originalBytes),
  scope: 'Frozen DOM and original, unadapted CSS captured from real product components; no website renderer, business JavaScript, credentials or live service execution.',
  css: 'original.css',
  files: {},
  scenes: {},
};
const output = new Map();
output.set('original.css', fs.readFileSync(path.join(root, 'product-original.css')));
for (const name of ['delivery', 'methods', 'management']) {
  const scene = original.scenes[name];
  const frames = [];
  for (const frame of scene.frames) {
    const html = fs.readFileSync(path.join(root, frame.html));
    assert(!html.toString().includes('/Users/'), 'Personal paths may not enter test fixtures');
    assert(!/<script\b|\son\w+\s*=|javascript\s*:/i.test(html.toString()), 'Unsafe source fixture');
    const measured = JSON.parse(fs.readFileSync(path.join(root, frame.measurements)));
    const htmlName = `${name}-${frame.id}.html`;
    output.set(htmlName, html);
    frames.push({
      id: frame.id, html: htmlName,
      // Geometry is measured anew against original CSS on the current platform;
      // selectors/text are independent real-component capture expectations.
      landmarks: measured.landmarks.map(({ selector, text }) => ({ selector, text })),
    });
  }
  manifest.scenes[name] = { width: scene.width, height: scene.height, frames };
}
for (const [name, bytes] of output) manifest.files[name] = sha(bytes);
fs.mkdirSync(destination, { recursive: true });
for (const [name, bytes] of output) fs.writeFileSync(path.join(destination, name), bytes, { flag: 'wx' });
fs.writeFileSync(path.join(destination, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
console.log(`Imported ${output.size} independently captured fixture assets for ${manifest.revision}`);
