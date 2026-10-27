const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { validatePublishedReference } = require('./validate.cjs');

/** 统一资源门禁：先校验冻结发布集，再验证拒绝负例；不刷新基线、不启动产品。 */
function check() {
  const manifest = validatePublishedReference();
  console.log(`Frozen product reference verified: ${manifest.product.revision}`);
  const result = spawnSync(process.execPath, ['--test', path.join(__dirname, 'reference.test.cjs')], { stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}

if (require.main === module) {
  try { check(); }
  catch (error) { console.error(error.stack); process.exitCode = 1; }
}

module.exports = { check };
