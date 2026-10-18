const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");

const directory = fs.mkdtempSync(path.join(os.tmpdir(), "fusion-overview-check-"));
try {
  for (const name of ["types", "overview-model"]) {
    const file = path.resolve(__dirname, `../src/components/anatomy/${name}.ts`);
    const output = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    });
    fs.writeFileSync(path.join(directory, `${name}.js`), output.outputText);
  }
  const { overviewFrame } = require(path.join(directory, "overview-model.js"));
  for (let step = 0; step <= 600; step++) {
    const parts = overviewFrame(step / 200).parts;
    for (const pose of Object.values(parts)) for (const value of Object.values(pose)) {
      assert.ok(Number.isFinite(value) && value >= 0 && value <= 1);
    }
    if (parts["overview-evidence"].opacity > 0 && step / 200 < 2.2) {
      assert.equal(parts["overview-work"].shift, 1, "Evidence follows delegation");
    }
    if (parts["overview-review"].opacity > 0) {
      assert.equal(parts["overview-work"].shift, 0, "Review follows return to the person");
      assert.equal(parts["overview-evidence"].opacity, 1);
      assert.equal(parts["overview-transfer"].opacity, 0);
    }
  }
  assert.equal(overviewFrame(0).parts["overview-transfer"].opacity, 0);
  assert.equal(overviewFrame(0).parts["overview-review"].opacity, 0);
  assert.equal(overviewFrame(3).parts["overview-review"].opacity, 1);
  assert.deepEqual(overviewFrame(-1), overviewFrame(0));
  assert.deepEqual(overviewFrame(4), overviewFrame(3));
  console.log("PASS: 601 overview positions — delegation → evidence → return → human acceptance; transfer routes only accompany movement.");
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
