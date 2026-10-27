const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { validateReference } = require('./reference.cjs');
const baseline = require('./baseline.json');

const directory = path.resolve(__dirname, '../../public/product-reference', baseline.revision);

function validatePublishedReference(root = directory) {
  if (root === directory) assert.deepEqual(fs.readdirSync(path.dirname(directory)), [baseline.revision], 'Unexpected public product reference version');
  return validateReference(root, baseline);
}

if (require.main === module) {
  try {
    const manifest = validatePublishedReference();
    console.log(`Product reference OK: ${manifest.product.revision}; 9 inert frames, 3 complete PNGs, ${Object.keys(manifest.assets).length} hashed assets`);
  } catch (error) {
    console.error(error.stack);
    process.exitCode = 1;
  }
}

module.exports = { validatePublishedReference };
