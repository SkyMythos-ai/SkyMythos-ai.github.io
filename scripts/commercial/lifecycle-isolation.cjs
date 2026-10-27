const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { project, url } = require('./browser.cjs');

/** 仅供测试：从作者 AST 抽取同一个 effect，在无 React 的内存文档测资源所有权。 */
async function isolateLifecycle(page) {
  const hero = path.join(project, 'src/components/hero-lifecycle');
  const source = fs.readFileSync(path.join(hero, 'playback.tsx'), 'utf8');
  const tree = ts.createSourceFile('playback.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const effects = [];
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(tree) === 'useEffect') effects.push(node);
    ts.forEachChild(node, visit);
  }
  visit(tree);
  assert.equal(effects.length, 1, 'Lifecycle must have one unambiguous effect owner');
  const callback = effects[0].arguments[0];
  assert(ts.isArrowFunction(callback) && ts.isBlock(callback.body));
  const esm = text => ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  const modules = new Map();
  for (const name of ['model', 'copy', 'painter']) {
    modules.set(`${name}.js`, esm(fs.readFileSync(path.join(hero, `${name}.ts`), 'utf8')).replace(/from (["'])\.\/(model|copy)\1/g, 'from "./$2.js"'));
  }
  modules.set('animation-hold.js', esm(fs.readFileSync(path.join(project, 'src/lib/animation-hold.ts'), 'utf8')));
  modules.set('lifecycle.js', esm(`import { observeAnimationHold } from './animation-hold.js';\nimport { lifecycleCopy } from './copy.js';\nimport { createLifecyclePainter } from './painter.js';\nexport function mountLifecycle(root: {current: HTMLElement}, locale: 'zh' = 'zh') ${callback.body.getText(tree)}`));
  const response = await page.request.get(url);
  assert.equal(response.status(), 200);
  // 使用实际 out SSR markup/CSS，但不加载任何 React 或官网 controller，避免双挂载。
  const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '').replace(/<link\b(?=[^>]*\brel=["'](?:preload|modulepreload)["'])(?=[^>]*\bas=["']script["'])[^>]*>/gi, '');
  const isolatedURL = new URL('/__commercial-lifecycle-isolation__/', url).href;
  await page.route(`${isolatedURL}**`, route => {
    const file = new URL(route.request().url()).pathname.split('/').at(-1);
    if (modules.has(file)) return route.fulfill({ contentType: 'text/javascript', body: modules.get(file) });
    if (route.request().url() === isolatedURL) return route.fulfill({ contentType: 'text/html', body: html });
    return route.abort();
  });
  await page.goto(isolatedURL, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('[data-lifecycle="b"]').count(), 1);
  return { isolatedURL, modules: [...modules.keys()], markup: 'actual static export response without scripts', authority: 'playback.tsx useEffect callback AST' };
}
module.exports = { isolateLifecycle };
