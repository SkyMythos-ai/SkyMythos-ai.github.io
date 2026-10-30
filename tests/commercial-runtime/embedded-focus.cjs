const test = require('node:test');
const assert = require('node:assert/strict');
const { installEmbeddedFocusGuard } = require('../../scripts/product-runtime/embedded-focus.cjs');

function fixture({ embedded = true, inert = true } = {}) {
  const calls = [], result = Symbol('native result');
  class Element {
    focus(...args) { calls.push({ receiver: this, args }); return result; }
  }
  const view = { HTMLElement: Element, frameElement: embedded ? { inert } : null };
  view.parent = embedded ? {} : view;
  installEmbeddedFocusGuard(view);
  return { calls, result, view, element: new Element() };
}

test('inert embedded focus preserves receiver, result and options while preventing scroll', () => {
  const { calls, result, element } = fixture();
  const options = { preventScroll: false, focusVisible: true };
  assert.equal(element.focus(options), result);
  assert.equal(calls[0].receiver, element);
  assert.deepEqual(calls[0].args, [{ preventScroll: true, focusVisible: true }]);
  assert.deepEqual(options, { preventScroll: false, focusVisible: true });
});

test('focus without options also prevents ambient scroll', () => {
  const { calls, element } = fixture();
  element.focus();
  assert.deepEqual(calls[0].args, [{ preventScroll: true }]);
});

for (const [name, options] of [['standalone', { embedded: false }], ['interactive iframe', { inert: false }]]) {
  test(`${name} retains the original arguments and native return value`, () => {
    const { calls, result, element } = fixture(options);
    const focusOptions = { preventScroll: false };
    assert.equal(element.focus(focusOptions), result);
    assert.equal(calls[0].args[0], focusOptions);
    element.focus();
    assert.deepEqual(calls[1].args, []);
  });
}

test('the inert boundary is evaluated for each focus call', () => {
  const { calls, view, element } = fixture();
  element.focus();
  view.frameElement.inert = false;
  element.focus();
  assert.deepEqual(calls.map(call => call.args), [[{ preventScroll: true }], []]);
});
