"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const temporaryRoot = process.env.CLAUDE_JOB_DIR ? path.join(process.env.CLAUDE_JOB_DIR, "tmp") : os.tmpdir();
const directory = fs.mkdtempSync(path.join(temporaryRoot, "fusion-hero-lifecycle-"));
const sourceRoot = path.resolve(__dirname, "../src/components/hero-lifecycle");
const read = name => fs.readFileSync(path.join(sourceRoot, name), "utf8");
const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
try {
  for (const name of ["model", "copy", "painter"]) fs.writeFileSync(path.join(directory, `${name}.js`), compile(read(`${name}.ts`)));
  const { frameAt, introduction, inspection, agents, clamp, progress, ease } = require(path.join(directory, "model.js"));
  const { lifecycleCopy } = require(path.join(directory, "copy.js"));
  const { createLifecyclePainter } = require(path.join(directory, "painter.js"));
  const ranges = {
    goal: [1, 3], clarify: [3, 5], scopeEdit: [5.5, 6.8], developer: [10, 12], prototype: [12, 14], implementation: [14, 17], tester: [17, 18],
    fix: [18.5, 21], retest: [21, 23], archive: [26.5, 28], summary: [30, 32], humanEdit: [33, 34.5], store: [36.5, 38], reference: [38, 39],
    acceptanceUpdate: [39, 40], v2Build: [40, 43], v2Verify: [43, 45],
  };
  const gates = { scopeConfirmed: 7.5, planReady: 9, defect: 18, tested: 23, accepted: 24, releaseApproved: 25.5, released: 26.5, feedback: 29, summaryReady: 32, learningConfirmed: 35.5, learningAdopted: 36.5, stored: 38, referenced: 39, v2Review: 46 };
  const dependencies = {
    clarify: "goal", scopeEdit: "clarify", scopeConfirmed: "scopeEdit", planReady: "scopeConfirmed", developer: "planReady", prototype: "developer",
    implementation: "prototype", tester: "implementation", defect: "tester", fix: "defect", retest: "fix", tested: "retest", accepted: "tested",
    releaseApproved: "accepted", released: "releaseApproved", archive: "released", feedback: "archive", summary: "feedback", summaryReady: "summary",
    humanEdit: "summaryReady", learningConfirmed: "humanEdit", learningAdopted: "learningConfirmed", store: "learningAdopted", stored: "store",
    reference: "stored", referenced: "reference", acceptanceUpdate: "referenced", v2Build: "acceptanceUpdate", v2Verify: "v2Build", v2Review: "v2Verify",
  };
  const catalog = {
    planner: { identity: "requirement-agent", model: "Claude", roleRevision: 1 },
    developer: { identity: "developer-agent", model: "GPT", harness: "Codex CLI", roleRevision: 1 },
    verifier: { identity: "verification-agent", model: "DeepSeek", roleRevision: 1 },
  };
  assert.equal(introduction, 50); assert.equal(inspection, 21);
  assert.deepEqual(agents, catalog); assert(Object.isFrozen(agents));
  for (const profile of Object.values(agents)) assert(Object.isFrozen(profile));
  assert.throws(() => { agents.developer.model = "DeepSeek"; }, TypeError);
  for (const input of [NaN, Infinity, -Infinity, undefined, null, "50", {}, 1n]) assert.throws(() => frameAt(input), TypeError);
  assert.deepEqual(frameAt(-12), frameAt(0));
  assert.deepEqual([clamp(-1), clamp(.5), clamp(2), progress(2, 1, 3), ease(.5)], [0, .5, 1, .5, .5]);
  for (const [key, at] of Object.entries(gates)) {
    assert.equal(frameAt(at - .000001)[key], false, `${key} must not precede ${at}s`);
    assert.equal(frameAt(at)[key], true, `${key} starts at ${at}s`);
  }
  for (const [key, [start, end]] of Object.entries(ranges)) {
    assert.equal(frameAt(start)[key], 0); assert.equal(frameAt(end)[key], 1);
    assert(Math.abs(frameAt((start + end) / 2)[key] - .5) < 1e-12);
  }
  const published = frameAt(26.5).v1PublishedSnapshot;
  assert.deepEqual(published, { requirementID: "REQ-014", requirementVersion: 1, version: 1, roleRevision: 1, methodRevision: 0, status: "released" });
  assert(Object.isFrozen(published)); assert.throws(() => { published.methodRevision = 1; }, TypeError);
  let previous = frameAt(0);
  for (let index = 0; index <= 12000; index++) {
    const time = index / 100, frame = frameAt(time);
    assert.equal(frame.time, time); assert.equal(frame.requirementID, "REQ-014"); assert.equal(frame.roleRevision, 1);
    assert.equal(frame.v1MethodRevision, 0); assert.equal(frame.requirementVersion, time >= 39 ? 2 : 1);
    assert.equal(frame.v2MethodRevision, time >= 39 ? 1 : null); assert.equal(frame.methodCount, time >= 38 ? 1 : 0);
    assert.equal(frame.learnedMethodRevision, time >= 38 ? 1 : null); assert.equal(frame.referencedMethodRevision, time >= 39 ? 1 : null);
    assert.equal(frame.releasedVersion, time >= 26.5 ? 1 : null); assert.equal(frame.v1PublishedSnapshot, time >= 26.5 ? published : null);
    assert.equal(frame.v2Accepted, false); assert.equal(frame.v2Released, false);
    assert.equal(frame.v2Status, time >= 46 ? "pending-human-review" : time >= 45 ? "verified" : time >= 43 ? "verifying" : time >= 40 ? "building" : "not-started");
    for (const key of Object.keys(ranges)) assert(frame[key] >= previous[key] && frame[key] <= 1, `${key} monotonic at ${time}`);
    for (const [key, at] of Object.entries(gates)) assert.equal(frame[key], time >= at, `${key} gate at ${time}`);
    for (const [effect, cause] of Object.entries(dependencies)) if (frame[effect]) assert.equal(frame[cause], typeof frame[cause] === "boolean" ? true : 1, `${effect} requires completed ${cause}`);
    assert.equal(frame.inspecting, time >= 50);
    assert.equal(frame.act, time >= 50 ? Math.floor((time - 50) / 7) % 3 : time < 10 ? 0 : time < 28 ? 1 : 2);
    assert.equal(frame.cycle, time >= 50 ? Math.floor((time - 50) / 21) : 0);
    previous = frame;
  }
  const final = frameAt(50);
  for (const time of [50, 56.999, 57, 64, 70.999, 71, 92, 113, 120, 1000000]) for (const key of Object.keys(final)) {
    if (!["time", "act", "cycle"].includes(key)) assert.deepEqual(frameAt(time)[key], final[key], `${key} retained at ${time}`);
  }
  assert.deepEqual(agents, catalog);

  function leaves(value, prefix = "") {
    return Object.entries(value).flatMap(([key, item]) => typeof item === "object" ? leaves(item, `${prefix}${key}.`) : [[`${prefix}${key}`, item]]);
  }
  assert.deepEqual(leaves(lifecycleCopy.zh).map(([key]) => key), leaves(lifecycleCopy.en).map(([key]) => key));
  for (const locale of ["zh", "en"]) for (const [key, value] of leaves(lifecycleCopy[locale])) {
    assert.equal(typeof value, "string", `${locale}.${key} text`); assert(value.trim(), `${locale}.${key} nonempty`);
    if (locale === "en") assert(!/[一-鿿]/u.test(value), `${key} translated`);
  }
  const sceneSource = read("scene.tsx");
  for (const name of ["scene.tsx", "figure.tsx", "playback.tsx", "painter.ts", "model.ts", "copy.ts"]) assert(!/\.handoff|dangerouslySetInnerHTML|<iframe|data:image|\.py["']/u.test(read(name)), `${name} production-native`);
  assert(!/Bot|data-bot|engineSwitch|activeModel/u.test(sceneSource));
  assert.equal((sceneSource.match(/data-brand=/gu) || []).length, 3);
  assert.equal((sceneSource.match(/width="62" height="64"/gu) || []).length, 3, "equal station mounts");
  for (const name of ["claude-symbol", "openai-blossom", "deepseek-symbol"]) assert(sceneSource.includes(`\${basePath}/brand/${name}.svg`));
  const sceneModule = { exports: {} };
  new Function("require", "module", "exports", compile(sceneSource))(name => name === "@/lib/site" ? { basePath: "/preview" } : name.endsWith(".css") ? { default: {} } : require(name), sceneModule, sceneModule.exports);
  const { LifecycleScene } = sceneModule.exports;
  for (const locale of ["zh", "en"]) {
    const markup = renderToStaticMarkup(React.createElement(LifecycleScene, { copy: lifecycleCopy[locale] }));
    assert(markup.includes("/preview/brand/claude-symbol.svg")); assert(markup.includes("/preview/images/characters/person.svg"));
    for (const image of markup.matchAll(/<image\b[^>]*data-brand=[^>]*>/gu)) assert(image[0].includes('role="img"'), 'Labeled SVG brand images require an explicit accessible role');
    assert(markup.includes(lifecycleCopy[locale].scene.pending)); assert(markup.includes(lifecycleCopy[locale].scene.released));
    assert.equal((markup.match(/data-station=/gu) || []).length, 3);
    if (locale === "en") assert(!/[一-鿿]/u.test(markup), "all native English SVG strings translated");
    const parts = Object.fromEntries([...markup.matchAll(/<g\b([^>]*)>/gu)].flatMap(([, attributes]) => {
      const name = attributes.match(/data-part="([^"]+)"/u)?.[1];
      if (!name) return [];
      const node = { dataset: {}, style: {}, attributes: {}, text: { textContent: "" }, path: { setAttribute() {} } };
      for (const field of ["home", "pivot"]) node.dataset[field] = attributes.match(new RegExp(`data-${field}="([^"]+)"`, "u"))?.[1];
      node.setAttribute = (key, value) => { node.attributes[key] = value; };
      node.querySelector = selector => selector === "text" ? node.text : node.path;
      return [[name, node]];
    }));
    const root = { dataset: {}, querySelectorAll: selector => selector === "[data-part]" ? Object.entries(parts).map(([key, node]) => { node.dataset.part = key; return node; }) : [], querySelector: () => ({ textContent: "" }) };
    const paint = createLifecyclePainter(root, lifecycleCopy[locale]);
    for (const time of [0, 5.8, 7.5, 12.8, 18.3, 24, 25.499, 25.5, 26.5, 29.5, 33.7, 35.5, 36.5, 38, 39, 46, 50, 57, 64, 71, 92, 113]) {
      paint(time, false);
      assert.equal(parts["release-approved"].attributes.visibility, time >= 25.5 ? "visible" : "hidden");
      assert.equal(parts["release-seal"].attributes.visibility, time >= 26.5 ? "visible" : "hidden");
      assert.equal(parts["v1-history"].attributes.visibility, time >= 26.5 ? "visible" : "hidden");
      assert.equal(parts.method.attributes.visibility, time >= 36.5 ? "visible" : "hidden");
      if (time === 24 || time === 25.499) assert.notEqual(parts.approval.text.textContent, lifecycleCopy[locale].scene.approved, "no release-approval stamp before the approval gate");
      if (time >= 50) {
        assert.equal(parts.approval.attributes.visibility, "hidden"); assert.equal(parts.pencil.attributes.visibility, "hidden");
        assert.equal(parts["scope-page"].style.display, "none"); assert.equal(parts["v2-page"].attributes.visibility, "visible");
        assert.equal(parts.method.attributes.transform, "translate(245 600) scale(1) ");
      }
      assert.equal(root.dataset.v2Released, "false");
    }
    paint(12.8, true); assert.equal(root.dataset.elapsed, "12.800"); assert.equal(root.dataset.version, "2");
    paint(12.8, false); assert.equal(root.dataset.version, "1", "reduced-motion pose does not advance real elapsed");
  }
  console.log("PASS: 12,001 lifecycle samples; exact 50s/21s timing, human gates, immutable v1/roles, retained method and pending v2; complete zh/en native SSR SVG, three original equal stations, and both localized painters through three inspection cycles.");
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
