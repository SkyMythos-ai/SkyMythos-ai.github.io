const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { spawn } = require('node:child_process');
const { serve } = require('./serve-export.cjs');

const evidence = process.env.EVIDENCE_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'skymythos-release-'));
const port = Number(process.env.PORT || 4173);
const prefix = process.env.BASE_PATH || '';
const server = serve(path.resolve('out'), port, prefix);
const env = { ...process.env, EVIDENCE_DIR: evidence, PREVIEW_URL: `http://127.0.0.1:${port}${prefix}/zh/` };
let active;
let interrupted = false;
function run(file) {
  return new Promise((resolve, reject) => {
    active = spawn(process.execPath, [file], { stdio: 'inherit', env });
    active.once('error', reject);
    active.once('exit', code => code === 0 ? resolve() : reject(new Error(`${file} failed (${code})`)));
  });
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => { interrupted = true; process.exitCode = 1; active?.kill(signal); server.close(); });

(async () => {
  if (!server.listening) await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
  console.log(`Release check evidence: ${evidence}`);
  const failures = [];
  for (const file of ['tests/commercial-runtime/read-asset.cjs', 'scripts/commercial/run.cjs', 'tests/commercial-runtime/check.cjs', 'tests/product-fidelity/check.cjs']) {
    try {
      await run(file);
      if (interrupted) throw new Error('Export checks interrupted');
    } catch (error) {
      if (interrupted) throw error;
      console.error(error.stack);
      failures.push(error);
    }
  }
  if (failures.length) throw new AggregateError(failures, `${failures.length} export check groups failed; see individual failures above`);
})().catch(error => { console.error(error.stack); process.exitCode = 1; }).finally(() => { server.closeAllConnections(); server.close(); });
