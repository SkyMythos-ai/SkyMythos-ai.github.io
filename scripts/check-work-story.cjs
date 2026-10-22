const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");

// Exercise the production model without importing browser or Next.js code.
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "fusion-work-story-"));
try {
  for (const name of ["types", "copy", "model"]) {
    const source = fs.readFileSync(path.resolve(__dirname, `../src/components/work-story/${name}.ts`), "utf8");
    const output = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    });
    fs.writeFileSync(path.join(directory, `${name}.js`), output.outputText);
  }
  const { storyFrame: frame, durations, repeatDurations, retainedParts } = require(path.join(directory, "model.js"));
  let samples = 0;
  for (const kind of Object.keys(durations)) {
    let previous;
    for (let elapsed = 0; elapsed < durations[kind] + repeatDurations[kind] * 2; elapsed += .02) {
      const f = frame(kind, elapsed), first = f.cycle === 0;
      const english = frame(kind, elapsed, "en");
      assert(!/[\u4e00-\u9fff]/u.test(english.caption + english.scenario), `${kind}: untranslated English readout`);
      samples++;
      for (const opacity of Object.values(f.parts)) assert(opacity >= 0 && opacity <= 1);
      for (const flow of Object.values(f.flows)) {
        assert(flow.opacity >= 0 && flow.opacity <= 1);
        assert(flow.progress >= 0 && flow.progress <= 1);
      }
      for (const name of retainedParts[kind]) {
        if (previous) assert(f.parts[name] >= previous.parts[name], `${kind}/${name} must never fade out after formation`);
        if (!first) assert.equal(f.parts[name], 1, `${kind}/${name} survives every later request`);
      }
      if (kind === 'assets') {
        if (first && f.t < 2.7) assert.equal(f.parts.candidate, 0);
        if (first && f.t < 4.8) assert.equal(f.parts['human-edit'], 0);
        if (first && f.t < 5.6) assert.equal(f.parts.confirmed, 0);
        if (f.parts.candidate > 0) assert.equal(f.parts['record-three'], 1);
        if (f.parts['human-edit'] > 0) assert.equal(f.parts.candidate, 1);
        if (f.parts.confirmed > 0) assert.equal(f.parts['human-edit'], 1);
        if (first && f.t < 7.3) assert.equal(f.parts.skill, 0);
        if (f.parts.skill > 0) assert.equal(f.parts.confirmed, 1);
        if (f.flows.reuse.opacity > 0) assert.equal(f.parts.skill, 1);
        if (f.parts.reference > 0 && !f.resetting) assert.equal(f.parts['next-task'], 1);
        if (f.parts['next-delivery'] > 0 && !f.resetting) assert.equal(f.parts.reference, 1);
        if (!first) {
          assert.equal(f.flows.review, undefined, 'Confirmed sources are not reviewed again as if new');
          assert.equal(f.flows.form, undefined, 'Existing Skill is not repeatedly created');
        }
      }
      if (kind === 'overview') {
        if (f.parts.accepted > 0 && !f.resetting) {
          assert.equal(f.parts['delivery-output'], 1);
          assert.equal(f.parts['delivery-checks'], 1);
        }
        if (f.flows.deliver.opacity > 0) assert.equal(f.parts.checked, 1);
        if (f.flows.return.opacity > 0) assert.equal(f.parts['delivery-checks'], 1);
        if (f.t < 8.2) assert.equal(f.parts['delivery-checks'], 0);
        if (f.t < 13.6) assert.equal(f.parts['delivery-review'], 0);
        if (first && f.t < 14.5) assert.equal(f.parts.archive, 0);
      }
      if (kind === 'governance') {
        assert(!((f.parts.allowed ?? 0) > 0 && (f.parts.denied ?? 0) > 0));
        assert(!f.flows['decision-allow'] || !f.flows['decision-deny']);
        if ((f.parts.allowed ?? 0) > 0) assert.equal(f.cycle % 2, 0);
        if ((f.parts.denied ?? 0) > 0) assert.equal(f.cycle % 2, 1);
        if (f.t < (first ? 10.7 : 5.9)) assert.equal((f.parts.allowed ?? 0) + (f.parts.denied ?? 0), 0);
        if (!first) {
          assert.equal(f.flows.attribute, undefined, 'Previously recorded run remains associated');
          assert.equal(f.flows.measure, undefined, 'Changing a request does not invent more consumption');
        }
      }
      if (f.t > f.duration - 2) for (const flow of Object.values(f.flows)) assert.equal(flow.opacity, 0, 'No transmission during end hold or task reset');
      previous = f;
    }
    for (const boundary of [durations[kind], durations[kind] + repeatDurations[kind]]) {
      const before = frame(kind, boundary - .001), after = frame(kind, boundary);
      for (const key of retainedParts[kind]) {
        assert.equal(before.parts[key], 1);
        assert.equal(after.parts[key], 1, `${kind}/${key} must not flash off across the loop boundary`);
      }
      assert.equal(after.cycle, before.cycle + 1);
      assert.equal(after.t, 0);
    }
  }
  // One glance at these frames must show accumulation, not three disconnected slides.
  const output = frame('overview', 6.9), checks = frame('overview', 8.9), review = frame('overview', 14.3);
  assert.equal(output.parts['delivery-output'], 1);
  assert.equal(output.parts['delivery-checks'], 0);
  assert.equal(checks.parts['delivery-output'], 1);
  assert.equal(checks.parts['delivery-checks'], 1);
  assert.equal(checks.parts['delivery-review'], 0);
  assert.equal(review.parts['delivery-review'], 1);
  // AI drafts, actual human edits and adoption remain distinct visible events.
  const candidate = frame('assets', 3.3), edited = frame('assets', 5.4), adopted = frame('assets', 6.16);
  assert.equal(candidate.parts.candidate, 1);
  assert.equal(candidate.parts['human-edit'], 0);
  assert.equal(candidate.parts.confirmed, 0);
  assert.equal(edited.parts['human-edit'], 1);
  assert.equal(edited.parts.confirmed, 0);
  assert.equal(adopted.parts.confirmed, 1);
  assert.equal(adopted.parts.skill, 0);
  for (const [time, pattern] of [[2.7, /AI/], [3.4, /reviews/], [4.8, /edits.*access.*row-count/], [5.6, /confirms.*adoption/]]) {
    assert.match(frame('assets', time, 'en').caption, pattern);
  }
  const art = fs.readFileSync(path.resolve(__dirname, '../src/components/work-story/assets-art.tsx'), 'utf8');
  for (const name of ['candidate', 'human-edit', 'confirmed']) assert(art.includes(`<Part name="${name}">`), `${name} must be drawn, not only narrated`);
  for (const text of ['AI 候选：导出并核对结果', 'AI draft: export + check', '人修改：沿用权限 + 核对行数', 'Human edit: access + row count', '确认并采用', 'Adopted', '行数与结果核对', 'Row and result checks']) assert(art.includes(text), `${text} must remain visible in the asset diagram`);
  console.log(`PASS: ${samples} model samples; candidate → human edit → adoption before reuse, cumulative delivery, retained assets/records, three cycles and exclusive decisions.`);
  for (const kind of Object.keys(durations)) assert.deepEqual(frame(kind, -1), frame(kind, 0));
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
