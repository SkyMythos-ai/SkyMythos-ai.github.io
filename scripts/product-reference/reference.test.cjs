const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');
const { sceneGeometry, validateHtml, validateCss } = require('./reference.cjs');
const { validatePublishedReference } = require('./validate.cjs');
const baseline = require('./baseline.json');
const directory = path.resolve(__dirname, '../../public/product-reference', baseline.revision);
const geometry = sceneGeometry('management');
const safe = fs.readFileSync(path.join(directory, 'management-result.html'), 'utf8');

function rejectsResourceMutation(mutate) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'product-reference-test-'));
  const copy = path.join(root, 'reference');
  try {
    fs.cpSync(directory, copy, { recursive: true });
    mutate(copy);
    const result = spawnSync(process.execPath, ['-e', 'require(process.argv[1]).validatePublishedReference(process.argv[2])', path.join(__dirname, 'validate.cjs'), copy], { encoding: 'utf8' });
    assert.notEqual(result.status, 0, 'Invalid frozen export must produce a nonzero process exit');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('current repository-only frozen export passes', () => {
  assert.equal(validatePublishedReference().product.revision, baseline.revision);
});

test('added, removed, corrupted and symlinked assets exit nonzero', () => {
  rejectsResourceMutation(root => fs.writeFileSync(path.join(root, 'unexpected.js'), 'alert(1)'));
  rejectsResourceMutation(root => fs.unlinkSync(path.join(root, 'methods-start.html')));
  rejectsResourceMutation(root => fs.appendFileSync(path.join(root, 'product.css'), '\n/* drift */'));
  rejectsResourceMutation(root => {
    fs.unlinkSync(path.join(root, 'full-methods.png'));
    fs.symlinkSync(path.join(directory, 'full-methods.png'), path.join(root, 'full-methods.png'));
  });
});

test('manifest rehash cannot silently replace the reviewed baseline', () => {
  rejectsResourceMutation(root => {
    const filename = path.join(root, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(filename, 'utf8'));
    manifest.product.revision = '0'.repeat(40);
    fs.writeFileSync(filename, JSON.stringify(manifest));
  });
});

test('readonly and fixed-canvas semantics fail closed', () => {
  assert.throws(() => validateHtml(safe.replace(' inert>', '>'), geometry), /inert/);
  assert.throws(() => validateHtml(safe.replace('width:1280px', 'width:1279px'), geometry), /dimensions/);
  assert.throws(() => validateHtml(safe + '<div>outside readonly root</div>', geometry), /inert root/);
  assert.throws(() => validateHtml(safe.slice(0, -6), geometry), /Unclosed/);
  assert.throws(() => validateHtml(safe.replace('type="password" value=""', 'type="password" value="secret"'), geometry), /password/);
});

test('scripts, event handlers, encoded URL schemes and resource loaders are rejected', () => {
  for (const injected of [
    '<script>alert(1)</script>',
    '<img src="data:image/svg+xml,%3Csvg%3E%3Cscript%3Ealert(1)%3C/script%3E%3C/svg%3E">',
    '<button onclick="alert(1)">unsafe</button>',
    '<a href="java&#x73;cript&colon;alert(1)">unsafe</a>',
    '<iframe srcdoc="unsafe"></iframe>',
    '<img src="https://example.test/tracker.png">',
    '<div style="background:url(https://example.test/tracker)">unsafe</div>',
    '<form action="/api/submit">unsafe</form>',
    '<img src="data:image/svg+xml,%3Csvg/%3E" src="https://example.test/tracker">',
  ]) assert.throws(() => validateHtml(safe.replace('</div>', `${injected}</div>`), geometry));
});

test('CSS cannot import remote resources or expose local paths', () => {
  for (const injected of ['@import "remote.css";', 'a{background:url(https://example.test)}', '/* /Users/example/private */']) {
    assert.throws(() => validateCss(':host{}.product-reference-root{}' + injected));
  }
});

test('publication copy record agrees with the frozen capture identities', () => {
  const record = require('./transformation.json');
  const manifest = validatePublishedReference();
  assert.equal(record.revision, baseline.revision);
  assert.equal(record.publishedManifestSha256, baseline.manifestSha256);
  const copies = Object.fromEntries(Object.entries(manifest.assets).filter(([filename]) => filename !== 'NOTICE.txt'));
  assert.deepEqual(record.publication.copiedAssets, copies);
  assert.deepEqual(record.publication.domTransformations, []);
  assert.equal(record.cssDerivation.output.sha256, manifest.assets['product.css']);
});

test('frozen manifest declares no export transformations', () => {
  // Frozen assets are identity-checked against an independently pinned manifest; this test never recaptures.
  assert.equal(validatePublishedReference().transformations.length, 0);
});
