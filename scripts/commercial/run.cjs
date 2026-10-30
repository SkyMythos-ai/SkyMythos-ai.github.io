const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const suites = ['harness', 'site', 'native-demos', 'lifecycle'];

/** CLI 优先于 SUITES；任何未知套件立即失败，避免拼错名字悄悄漏跑。 */
function selectSuites(args, environment = process.env) {
  const requested = [];
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--suites') {
      assert(args[index + 1] && !args[index + 1].startsWith('--'), '--suites requires comma-separated suite names');
      requested.push(args[++index]);
    } else if (argument.startsWith('--suites=')) requested.push(argument.slice('--suites='.length));
    else { assert(!argument.startsWith('-'), `Unknown option: ${argument}`); requested.push(argument); }
  }
  const values = requested.length ? requested : environment.SUITES ? [environment.SUITES] : suites;
  const names = [...new Set(values.flatMap(value => value.split(/[\s,]+/)).filter(Boolean))];
  assert(names.length, 'Select at least one commercial regression suite');
  for (const name of names) assert(suites.includes(name), `Unknown suite ${name}; choose ${suites.join(', ')}`);
  return names;
}

/** 同一静态产物串行执行；失败保留到最终退出码，但不跳过之后的套件。 */
function run(selected, options) {
  const records = [];
  for (const name of selected) {
    const startedAt = new Date().toISOString();
    const started = performance.now();
    console.log(`\n=== Commercial regression: ${name} ===`);
    const child = (options.spawn || spawnSync)(process.execPath, [path.join(__dirname, `check-${name === "harness" ? "composed-scenes" : name}.cjs`)], {
      cwd: options.project,
      env: { ...process.env, PREVIEW_URL: options.url, EVIDENCE_DIR: options.evidence },
      stdio: 'inherit', timeout: options.timeout, killSignal: 'SIGTERM',
    });
    const passed = child.status === 0 && !child.error && !child.signal;
    records.push({ name, startedAt, finishedAt: new Date().toISOString(), durationMs: Math.round(performance.now() - started), status: passed ? 'passed' : 'failed', exitCode: child.status, signal: child.signal, error: child.error?.stack });
    console.log(`=== ${name}: ${passed ? 'PASS' : 'FAIL'} ===`);
  }
  return records;
}

function main() {
  if (process.argv.includes('--help')) {
    console.log(`Usage: node scripts/commercial/run.cjs [--suites harness,site | harness site]\nSUITES=${suites.join(',')}\nPREVIEW_URL=http://127.0.0.1:4173/zh/\nEVIDENCE_DIR defaults to a new project-external temporary directory.\nSUITE_TIMEOUT_MS defaults to 600000 per suite.`);
    return;
  }
  const selected = selectSuites(process.argv.slice(2));
  const portable = require('./browser.cjs');
  const timeout = Number(process.env.SUITE_TIMEOUT_MS || 600000);
  assert(Number.isSafeInteger(timeout) && timeout > 0, 'SUITE_TIMEOUT_MS must be a positive safe integer');
  const report = { startedAt: new Date().toISOString(), url: portable.url, evidence: portable.evidence, selected, startIdentity: portable.buildIdentity(), rows: [], status: 'failed' };
  console.log(`Commercial evidence: ${portable.evidence}`);
  try {
    report.rows = run(selected, { ...portable, timeout });
    report.endIdentity = portable.buildIdentity();
    assert.equal(report.endIdentity.sha256, report.startIdentity.sha256, 'Sources or static artifacts changed during the serial regression run');
    report.status = report.rows.every(row => row.status === 'passed') ? 'passed' : 'failed';
  } catch (error) { report.error = error.stack; }
  finally {
    report.finishedAt = new Date().toISOString();
    if (!report.endIdentity) {
      try { report.endIdentity = portable.buildIdentity(); }
      catch (error) { report.identityError = error.stack; }
    }
    fs.writeFileSync(path.join(portable.evidence, 'run.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(`\nCommercial regression ${report.status}: ${report.rows.filter(row => row.status === 'passed').length}/${selected.length} suites; ${path.join(portable.evidence, 'run.json')}`);
    process.exitCode = report.status === 'passed' ? 0 : 1;
  }
}
if (require.main === module) {
  try { main(); }
  catch (error) { console.error(error.stack); process.exitCode = 1; }
}
module.exports = { selectSuites, run };
