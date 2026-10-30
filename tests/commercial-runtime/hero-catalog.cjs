const test = require('node:test');
const assert = require('node:assert/strict');
const {createLocaleLayers,createLocaleWaitGate} = require('../../scripts/product-runtime/hero-catalog.cjs');

function fixture() {
  const critical = { 'demo.initial': {'zh-CN':'初始', en:'Initial'}, 'demo.empty': undefined };
  const messages = { 'demo.first': {'zh-CN':'第一', en:'First'}, 'demo.initial': critical['demo.initial'], 'demo.empty': undefined, 'demo.later': {'zh-CN':'稍后', en:'Later'} };
  const messageCatalogs = [{ 'demo.first': messages['demo.first'] }, { 'demo.initial': messages['demo.initial'], 'demo.later': messages['demo.later'] }];
  return {critical, full:{messages,messageCatalogs}};
}
function captureThrown(read) {
  try { read(); } catch (error) { return error; }
  assert.fail('Expected the read to throw');
}
function deferred() {
  let resolve, reject;
  const promise = new Promise((ok, fail) => { resolve = ok; reject = fail; });
  return {promise,resolve,reject};
}

test('critical values, undefined, symbols and prototype access do not load the full catalog', () => {
  const {critical} = fixture(); let calls = 0;
  const layer = createLocaleLayers(critical, () => { calls++; throw new Error('unexpected load'); });
  assert.equal(layer.messages['demo.initial'], critical['demo.initial']);
  assert.equal(layer.messages['demo.empty'], undefined);
  assert.equal(Object.prototype.hasOwnProperty.call(layer.messages, 'demo.empty'), true);
  assert.equal(layer.messages[Symbol.iterator], undefined);
  assert.equal(layer.messages.toString, Object.prototype.toString);
  assert.equal(calls, 0);
});

test('missing reads and enumeration share one pending load and preserve complete ordered catalogs', async () => {
  const {critical,full} = fixture(), pending = deferred(); let calls = 0;
  const layer = createLocaleLayers(critical, () => { calls++; return pending.promise; });
  const first = captureThrown(() => layer.messages['demo.later']);
  assert.equal(captureThrown(() => layer.messages['not.a.key']), first);
  assert.equal(captureThrown(() => Object.keys(layer.messages)), first);
  assert.equal(captureThrown(() => layer.catalogs.length), first);
  assert.equal(captureThrown(() => Object.keys(layer.catalogs)), first);
  assert.equal(layer.start(), first);
  await Promise.resolve();
  assert.equal(calls, 1);
  pending.resolve(full); await first;
  assert.equal(layer.ready(), true);
  assert.deepEqual(Object.keys(layer.messages), Object.keys(full.messages));
  for (const [key,value] of Object.entries(full.messages)) assert.deepEqual(layer.messages[key], value);
  assert.deepEqual([...layer.catalogs], full.messageCatalogs);
  assert.equal(layer.messages['not.a.key'], undefined);
  // This is the original translate contract: a truly unknown key is an error.
  const translate = key => { const message = layer.messages[key]; if (!message) throw new Error(`Unknown translation key: ${key}`); return message['zh-CN']; };
  assert.throws(() => translate('not.a.key'), /Unknown translation key: not\.a\.key/);
});

test('a rejected loader is cached and subsequent reads throw the original error', async () => {
  const {critical} = fixture(), pending = deferred(), failure = new Error('locale load failed'); let calls = 0;
  const layer = createLocaleLayers(critical, () => { calls++; return pending.promise; });
  const first = captureThrown(() => layer.messages['demo.later']);
  await Promise.resolve(); pending.reject(failure);
  await assert.rejects(first, error => error === failure);
  assert.equal(captureThrown(() => layer.messages['demo.later']), failure);
  assert.equal(captureThrown(() => Object.keys(layer.messages)), failure);
  assert.equal(captureThrown(() => layer.catalogs.length), failure);
  assert.equal(layer.start(), first);
  assert.equal(layer.ready(), false);
  assert.equal(calls, 1);
});


test('a waiting sequence registers only one continuation despite repeated play attempts', async () => {
  const pending=deferred(); let loads=0, resumes=0, failures=0;
  const state={sequence:1,requested:true,visible:true,hidden:false,reduced:false,failed:false,seeking:false};
  const gate=createLocaleWaitGate({load:()=>{loads++;return pending.promise;},getState:()=>state,resume:()=>resumes++,fail:()=>failures++});
  const wait=gate.wait(1);
  for(let i=0;i<10;i++){assert.equal(gate.blocked(1),true);assert.equal(gate.wait(1),wait);}
  await Promise.resolve();assert.equal(loads,1);pending.resolve();await wait;
  assert.equal(resumes,1);assert.equal(failures,0);assert.equal(gate.blocked(1),false);
});

test('changed sequence, pause, hidden, reduced, failure and seeking cannot revive an old wait', async () => {
  for (const change of [state=>state.sequence++,state=>state.requested=false,state=>state.visible=false,state=>state.hidden=true,state=>state.reduced=true,state=>state.failed=true,state=>state.seeking=true]) {
    const pending=deferred(),state={sequence:1,requested:true,visible:true,hidden:false,reduced:false,failed:false,seeking:false};let resumes=0;
    const gate=createLocaleWaitGate({load:()=>pending.promise,getState:()=>state,resume:()=>resumes++,fail:()=>assert.fail('unexpected failure')});
    const wait=gate.wait(1);change(state);pending.resolve();await wait;assert.equal(resumes,0);
  }
  const old=deferred(),next=deferred(),state={sequence:1,requested:true,visible:true,hidden:false,reduced:false,failed:false,seeking:false};let resumes=0;
  const gate=createLocaleWaitGate({load:()=>state.sequence===1?old.promise:next.promise,getState:()=>state,resume:()=>resumes++,fail:()=>assert.fail('unexpected failure')});
  const first=gate.wait(1);await Promise.resolve();state.sequence=2;const second=gate.wait(2);await Promise.resolve();old.resolve();await first;assert.equal(gate.blocked(2),true);assert.equal(resumes,0);next.resolve();await second;assert.equal(resumes,1);
});

test('a failed wait reports once and does not register another continuation', async () => {
  const pending=deferred(),failure=new Error('offline'),state={sequence:1,requested:true,visible:true,hidden:false,reduced:false,failed:false,seeking:false};let loads=0, failures=0;
  const gate=createLocaleWaitGate({load:()=>{loads++;return pending.promise},getState:()=>state,resume:()=>assert.fail('unexpected resume'),fail:error=>{assert.equal(error,failure);failures++;state.failed=true;}});
  const wait=gate.wait(1);await Promise.resolve();pending.reject(failure);await wait;
  for(let i=0;i<10;i++)assert.equal(gate.wait(1),wait);
  assert.equal(loads,1);assert.equal(failures,1);assert.equal(gate.blocked(1),true);
});
