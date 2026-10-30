const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');

async function assertFixedMarkdown(content) {
  if (typeof content !== 'string') throw new TypeError('Fixed Markdown must be a string');
  if (/(?:\$|\\[()[\]]|mermaid)/i.test(content)) throw new Error('Fixed Markdown contains unsupported math or Mermaid syntax');
  const {default: Markdown} = await import('react-markdown');
  function rejectUnsupportedNodes() {
    return tree => {
      function visit(node) {
        if (['code', 'inlineCode', 'math', 'inlineMath'].includes(node.type)) throw new Error(`Fixed Markdown contains unsupported ${node.type}`);
        for (const child of node.children || []) visit(child);
      }
      visit(tree);
    };
  }
  renderToStaticMarkup(React.createElement(Markdown, {remarkPlugins:[rejectUnsupportedNodes], children:content}));
}
module.exports = {assertFixedMarkdown};
