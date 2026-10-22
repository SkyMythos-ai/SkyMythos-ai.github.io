const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "fusion-execution-preview-"));
try {
  for (const name of ["model", "copy"]) {
    const source = fs.readFileSync(path.resolve(__dirname, `../src/components/execution-preview/${name}.ts`), "utf8");
    fs.writeFileSync(path.join(directory, `${name}.js`), ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText);
  }
  const {executionFrame:frame,executionDuration,inspectionDuration} = require(path.join(directory,"model.js"));
  const {executionCopy:copy} = require(path.join(directory,"copy.js"));
  let samples = 0, previous = frame(0);
  for (let time=0; time<executionDuration+inspectionDuration*4; time+=.01) {
    const f = frame(time); samples++;
    assert(f.completed>=previous.completed && f.completed<=4);
    assert(f.records>=previous.records && f.records<=4);
    assert(f.progress>=0 && f.progress<=1);
    if(f.records>=1)assert(f.completed>=1);
    if(f.records>=2)assert(f.completed>=2);
    if(f.records>=3)assert(f.completed>=3);
    if(f.records===4)assert.equal(f.checks,true);
    if(f.delivery) {assert.equal(f.checks,true);assert.equal(f.records,4);assert.equal(f.completed,4);assert.equal(f.active,null);assert(f.inspection)}
    if(time<16)assert.equal(f.checks,false);
    if(time<executionDuration){assert.equal(f.delivery,false);assert.equal(f.active,f.completed);assert.equal(f.inspection,null)}
    else {assert.equal(f.completed,4);assert.equal(f.delivery,true);assert.equal(f.checks,true);assert.equal(f.message,4)}
    previous=f;
  }
  assert.deepEqual(frame(-1),frame(0));
  for (const [time,completed,inspection] of [[0,0,null],[3,1,null],[7.5,2,null],[12,3,null],[18,4,"records"],[22,4,"checks"],[26,4,"delivery"],[30,4,"records"],[54,4,"records"]]) {
    const f=frame(time);assert.equal(f.completed,completed);assert.equal(f.inspection,inspection);
  }
  for(const text of [copy.en.title,...copy.en.steps,...copy.en.messages,...copy.en.entries,copy.en.caption,copy.en.source])assert(!/[一-鿿]/u.test(text));
  assert.equal(copy.zh.steps.length,4);assert.equal(copy.en.steps.length,4);
  assert.equal(copy.zh.review,"待人工审阅");assert.equal(copy.en.review,"Awaiting your review");
  console.log(`PASS: ${samples} native execution samples; causal records, monotonic completion, checks before delivery, four retained inspection cycles, bilingual copy and human review.`);
} finally {fs.rmSync(directory,{recursive:true,force:true})}
