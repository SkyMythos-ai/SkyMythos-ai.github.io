const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");
const temporaryRoot = process.env.CLAUDE_JOB_DIR ? path.join(process.env.CLAUDE_JOB_DIR, "tmp") : os.tmpdir();
const directory = fs.mkdtempSync(path.join(temporaryRoot, "fusion-work-system-"));
try {
  const source = fs.readFileSync(path.resolve(__dirname, "../src/components/work-system-model.ts"), "utf8");
  fs.writeFileSync(path.join(directory, "model.js"), ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText);
  const { workSystemFrame: frame, systemIntroduction, systemInspection } = require(path.join(directory, "model.js"));
  const results = ["records", "confirmed", "retained", "reused"];
  let previous = frame(0), samples = 0;
  for (let index = 0; index <= (systemIntroduction + systemInspection * 4) * 100; index++) {
    const time = index / 100, state = frame(time); samples++;
    assert(state.workProgress >= previous.workProgress && state.workProgress <= 1);
    assert.equal(state.workProgress, Math.min(time / 4, 1));
    if (state.records) assert.equal(state.workProgress, 1);
    for (const result of results) assert(!previous[result] || state[result], `${result} lost at ${time}`);
    if (state.confirmed) assert(state.records);
    if (state.retained) assert(state.confirmed);
    if (state.reused) assert(state.retained);
    if (state.transfer === "curate") assert(state.records && !state.confirmed);
    if (state.transfer === "store") assert(state.confirmed && !state.retained);
    if (state.transfer === "reuse") assert(state.retained && !state.reused);
    assert(state.progress >= 0 && state.progress <= 1);
    if (time >= systemIntroduction) {
      for (const result of results) assert.equal(state[result], true);
      assert.equal(state.transfer, null);
      assert(["work", "assets", "governance"].includes(state.focus));
    }
    previous = state;
  }
  assert.deepEqual(frame(-10), frame(0));
  for (const [time, name] of [[4,"records"],[9,"confirmed"],[13,"retained"],[18,"reused"]]) {
    assert.equal(frame(time - .001)[name], false);
    assert.equal(frame(time)[name], true);
  }
  for (const [time, transfer] of [[0,null],[5,"curate"],[8,null],[10,"store"],[13,null],[15,"reuse"],[18,null],[20,null],[74,null]]) assert.equal(frame(time).transfer, transfer);
  for (const [time, focus] of [[20,"work"],[26,"assets"],[32,"governance"],[38,"work"],[56,"work"],[74,"work"]]) assert.equal(frame(time).focus, focus);
  console.log(`PASS: ${samples} work-system samples; records before human confirmation, confirmation before curation, authorised reuse, bounded transfers and four retained inspection cycles.`);
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
