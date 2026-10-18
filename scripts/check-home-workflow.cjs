const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");

// Compile only the pure models using the existing TypeScript dependency.
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "fusion-workflow-check-"));
try {
  for (const name of ["types", "concept-model", "workflow-model"]) {
    const file = path.resolve(__dirname, `../src/components/anatomy/${name}.ts`);
    const output = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    });
    fs.writeFileSync(path.join(directory, `${name}.js`), output.outputText);
  }
  const { workflowFrame } = require(path.join(directory, "workflow-model.js"));
  const at = position => workflowFrame(position).parts;
  const absent = (parts, ...names) => names.forEach(name => assert.equal(parts[name].opacity, 0, `${name} must not exist yet`));
  const present = (parts, ...names) => names.forEach(name => assert.equal(parts[name].opacity, 1, `${name} must already exist`));

  absent(at(0), "agent-visible", "employee-ready", "source-log", "source-experience", "delegated-work");
  present(at(1), "source-log", "source-experience");
  absent(at(1), "agent-visible", "employee-ready", "source-method", "source-role", "source-confirmed");
  present(at(2), "source-log", "source-experience", "source-method", "source-role", "source-confirmed");
  absent(at(2), "agent-visible", "employee-ready", "delegated-work");
  present(at(3), "agent-visible", "employee-ready");
  absent(at(3), "delegated-work");
  present(at(5), "human-approved", "source-log", "source-experience");

  for (let step = 0; step <= 1000; step++) {
    const parts = at(step / 200);
    for (const [name, pose] of Object.entries(parts)) {
      for (const value of Object.values(pose)) assert.ok(Number.isFinite(value), `${name} must be finite`);
      if (pose.opacity !== undefined) assert.ok(pose.opacity >= 0 && pose.opacity <= 1, `${name} opacity`);
    }
    if (parts["flow-capture"].opacity > 0) {
      present(parts, "prior-work", "prior-experience");
      absent(parts, "agent-visible", "employee-ready");
    }
    if (parts["source-method"].opacity > 0) present(parts, "source-log", "source-experience");
    if (parts["source-confirmed"].opacity > 0) {
      present(parts, "source-method", "source-role");
      if (parts["source-confirmed"].opacity < 1) present(parts, "formation-review");
    }
    if (parts["flow-develop"].opacity > 0) {
      present(parts, "source-confirmed");
      absent(parts, "agent-visible");
    }
    if (parts["skill-record"].opacity > 0) assert.equal(parts["flow-develop"].shift, 1);
    if (parts["agent-visible"].opacity > 0) present(parts, "source-log", "source-experience", "source-confirmed", "skill-record", "mcp-record");
    if (parts["employee-ready"].opacity > 0) {
      present(parts, "agent-visible");
      assert.equal(parts["skill-install"].shift, 1);
      assert.equal(parts["mcp-install"].shift, 1);
    }
    if (parts["delegated-work"].opacity > 0) {
      present(parts, "employee-ready");
      absent(parts, "prior-work");
    }
    if (parts["human-approved"].opacity > 0) {
      assert.equal(parts["delegated-work"].shift, 0);
      present(parts, "agent-result");
    }
  }
  assert.deepEqual(workflowFrame(-1), workflowFrame(0));
  assert.deepEqual(workflowFrame(6), workflowFrame(5));
  console.log("PASS: 1001 positions — work → records and experience → human confirmation → employee → next task → human acceptance.");
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
