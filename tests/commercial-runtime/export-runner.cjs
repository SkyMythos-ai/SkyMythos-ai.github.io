const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');

const source = fs.readFileSync(path.join(__dirname, '../../scripts/check-export.cjs'), 'utf8');
const scripts = ['tests/commercial-runtime/read-asset.cjs', 'scripts/commercial/run.cjs', 'tests/commercial-runtime/check.cjs', 'tests/product-fidelity/check.cjs'];

async function exercise({ failed = [], spawnError = false, interrupted = false, gracefulExit = false, startupError = false } = {}) {
  const calls = [], errors = [], signals = new Map();
  let closes = 0, connectionsClosed = 0;
  const server = new EventEmitter();
  server.listening = !startupError;
  server.close = () => { closes++; };
  server.closeAllConnections = () => { connectionsClosed++; };
  const processStub = { env: { EVIDENCE_DIR: '/inert-evidence' }, execPath: process.execPath, exitCode: 0, once: (signal, callback) => signals.set(signal, callback) };
  const completion = vm.runInNewContext(source, {
    process: processStub,
    console: { log() {}, error: value => errors.push(String(value)) },
    require(name) {
      if (name === './serve-export.cjs') return { serve: () => server };
      if (name === 'node:child_process') return { spawn(_command, [file]) {
        calls.push(file);
        const child = new EventEmitter();
        child.kill = () => { queueMicrotask(() => child.emit('exit', gracefulExit ? 0 : null)); };
        queueMicrotask(() => {
          if (interrupted && file === scripts[0]) signals.get('SIGTERM')();
          else if (spawnError && file === scripts[0]) child.emit('error', new Error(`${file} spawn failed`));
          else child.emit('exit', failed.includes(file) ? 1 : 0);
        });
        return child;
      } };
      return require(name);
    },
  });
  if (startupError) queueMicrotask(() => server.emit('error', new Error('Preview startup failed')));
  await completion;
  assert.equal(connectionsClosed, 1, 'Always close preview connections');
  assert.equal(closes, interrupted ? 2 : 1, 'Always close the preview server');
  return { calls, errors, exitCode: processStub.exitCode };
}

(async () => {
  for (const failed of [[], ...scripts.map(file => [file]), scripts]) {
    const result = await exercise({ failed });
    assert.deepEqual(result.calls, scripts, 'Every independent suite must execute, including after a failure');
    assert.equal(result.exitCode, failed.length ? 1 : 0, 'Any failed suite must fail the combined gate');
    for (const file of failed) assert(result.errors.some(error => error.includes(file)), 'Report every failed suite');
  }
  const spawnFailure = await exercise({ spawnError: true });
  assert.deepEqual(spawnFailure.calls, scripts, 'A child launch failure must not hide independent suite results');
  assert.equal(spawnFailure.exitCode, 1);
  const startupFailure = await exercise({ startupError: true });
  assert.deepEqual(startupFailure.calls, []);
  assert.equal(startupFailure.exitCode, 1);
  const cancellation = await exercise({ interrupted: true });
  assert.deepEqual(cancellation.calls, [scripts[0]], 'An interrupt must stop before launching any further suite');
  assert.equal(cancellation.exitCode, 1);
  const gracefulCancellation = await exercise({ interrupted: true, gracefulExit: true });
  assert.deepEqual(gracefulCancellation.calls, [scripts[0]], 'A child exiting successfully after a signal must still stop subsequent suites');
  assert.equal(gracefulCancellation.exitCode, 1);
  console.log('PASS export runner: all suites execute, any failure rejects, interrupts stop, server always closes (10 cases)');
})().catch(error => { console.error(error); process.exitCode = 1; });
