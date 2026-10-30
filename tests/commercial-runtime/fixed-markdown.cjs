const {test} = require('node:test');
const assert = require('node:assert/strict');
const {assertFixedMarkdown} = require('../../scripts/product-runtime/fixed-markdown.cjs');

test('accepts ordinary formatted Markdown', async () => {
  await assertFixedMarkdown('# 标题\n\n段落 **加粗** [链接](https://example.com)。\n\n1. 第一项\n2. 第二项');
});
for (const [name, value] of Object.entries({
  indented:'    code', tab:'\tcode', nested:'- item\n\n      code', fenced:'```js\ncode\n```',
  inline:'`code`', math:'$x^2$', mermaid:'```mermaid\ngraph TD\n```',
})) test(`rejects ${name}`, async () => assert.rejects(assertFixedMarkdown(value)));
