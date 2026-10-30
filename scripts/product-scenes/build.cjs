const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const {createRequire}=require('node:module');
const {pathToFileURL}=require('node:url');
const assert=require('node:assert/strict');
const acorn=require('acorn');
const postcss=require('postcss');
const {assertFixedMarkdown}=require('../product-runtime/fixed-markdown.cjs');
function replaceOnce(source, needle, replacement) {assert.equal(source.split(needle).length,2,`Expected exactly one occurrence: ${needle}`);return source.replace(needle,replacement);}
const {prepareSnapshot}=require('../product-runtime/source-snapshot.cjs');
const repo=path.resolve(__dirname,'../..');
const baseline=path.join(repo,'public/product-scenes/7295629889d881f3485168832359d16d141021f9-composed-v1');
const snapshot=prepareSnapshot({baselineDir:baseline,kind:'body'});
const product=snapshot.root;
const rev=snapshot.revision;
const buildScene='all';
assert.ok(['all','knowledge'].includes(buildScene),'Only the isolated knowledge build or the existing complete build is supported');
const expected='7295629889d881f3485168832359d16d141021f9';
const sourceWorkingTreeDirty=snapshot.provenance.sourceWorkingTreeDirty;
assert.equal(rev,expected,'Product revision differs from reviewed source');
const hash=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
function walk(dir,result={},prefix=product){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())walk(file,result,prefix);else if(item.isFile())result[path.relative(prefix,file)]=hash(fs.readFileSync(file));}return result}
const before=walk(path.join(product,'src'));
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'fusion-product-demo-'));
const output=path.join(repo,'public/product-scenes',rev+'-composed-v2');
const requireProduct=createRequire(path.join(product,'package.json'));
async function main(){
 fs.mkdirSync(temp,{recursive:true});
 let entry=fs.readFileSync(path.join(__dirname,'entry.jsx'),'utf8').replaceAll('__PRODUCT__',product).replaceAll('__REVISION__',rev).replaceAll('__BUILD_SCENE__',buildScene).replace('__FIXTURE__',fs.readFileSync(path.join(repo,'scripts/product-reference/fixture.json'),'utf8'));
 if(buildScene==='knowledge'){
  entry=entry.replace(/^import \{WorkspaceChatPage\}[^\n]+\n/m,'').replace(/^import \{FormationPage\}[^\n]+\n/m,'').replace("<Route path='chat' element={<WorkspaceChatPage/>}/>",'').replace("<Route path='my-ai' element={<FormationPage scope={runtime.scope} api={runtime.api}/>}/>",'');
 }
 fs.writeFileSync(path.join(temp,'entry.jsx'),entry);
 const sceneSource=fs.readFileSync(path.join(__dirname,'scenes.jsx'),'utf8').replaceAll('__PRODUCT__',product);
 const header=sceneSource.slice(0,sceneSource.indexOf('const goal='));
 const segment=(start,end)=>sceneSource.slice(sceneSource.indexOf(start),sceneSource.indexOf(end));
 const shared=segment('function useSceneFollow','function Delivery');
 const ref=segment('export const referenceDocument=','function Knowledge');
 const declaration=acorn.parse(ref,{ecmaVersion:'latest',sourceType:'module'}).body;
 assert.equal(declaration.length,1,'Expected a single reference document declaration');
 const init=declaration[0]?.declaration?.declarations?.[0]?.init;
 assert.equal(init?.type,'ObjectExpression','Expected literal reference document');
 const contents=init.properties.filter(p=>p.key?.name==='content');
 assert.equal(contents.length,1,'Expected one fixed document content');
 assert.equal(contents[0].value.type,'Literal','Expected fixed string content');
 const content=contents[0].value.value;
 assert.equal(typeof content,'string');
 await assertFixedMarkdown(content);
 assert.equal((sceneSource.match(/<KnowledgeRichMarkdown\b/g)||[]).length,1,'Expected exactly one reader usage');
 fs.writeFileSync(path.join(temp,'reference.js'),ref);
 const imports={delivery:["ChatUserMessage,ChatReply","projectACPTimeline,ToolCard,AgentACPTimeline","ChatMarkdown","PageHeader,PageSection"],training:["PageHeader,PageSection","Button","useFormationController","FormationSources","FormationSourceDetails","FormationProgressPanel","FormationPreview"],knowledge:["PageHeader,PageSection","Button","KnowledgeDirectory,KnowledgeContentSearchDialog","KnowledgeRichMarkdown","searchKnowledgeBases"]};
 for(const name of Object.keys(imports)) {
  let selected=header.split('\n').filter(line=>line.startsWith('import React')||imports[name].some(item=>line.includes(`{${item}}`))).join('\n')+'\n';
  if(name==='knowledge') selected=selected.replace(/^import \{KnowledgeRichMarkdown\}[^\n]+/m,`const loadReader=()=>import(${JSON.stringify(path.join(product,'src/components/knowledge-rich-markdown.tsx'))});\nconst KnowledgeRichMarkdown=React.lazy(()=>loadReader().then(m=>({default:m.KnowledgeRichMarkdown})));`)+"\nimport {referenceDocument} from './reference.js';\n";
  let body=name==='delivery'?segment('const goal=','function useSceneFollow')+shared+segment('function Delivery','function Training'):name==='training'?segment('const goal=','const report=')+shared+segment('function Training','export const referenceDocument='):segment('function Knowledge','export function Scene');
  if(name==='knowledge') {
   body=replaceOnce(body,'function Knowledge({time}){','function Knowledge({time}){const readerPrefetched=useRef(false);useEffect(()=>{if(time>=6000&&!readerPrefetched.current){readerPrefetched.current=true;void loadReader().catch(()=>window.dispatchEvent(new Event("skymythos-product-demo-load-error")))}},[time]);');
   body=replaceOnce(body,'<KnowledgeRichMarkdown content={referenceDocument.content}/>','<React.Suspense fallback={<p role="status">加载文档中…</p>}><KnowledgeRichMarkdown content={referenceDocument.content}/></React.Suspense>');
  }
  const component=name[0].toUpperCase()+name.slice(1);
  fs.writeFileSync(path.join(temp,name+'.jsx'),selected+body+`\nexport default ${component};\n`);
 }
 fs.copyFileSync(path.join(__dirname,'scene.css'),path.join(temp,'scene.css'));
 const fixtureSource=fs.readFileSync(path.join(__dirname,'fixture.js'),'utf8').replaceAll('__PRODUCT__',product).replace('__FIXTURE__',fs.readFileSync(path.join(repo,'scripts/product-reference/fixture.json'),'utf8'));
 fs.writeFileSync(path.join(temp,'fixture.js'),fixtureSource);
 // Pre-render neutral geometry at build time: browser never imports AJV or compiles schemas.
 const avatarCore=await import(pathToFileURL(path.join(product,'node_modules/@bible-strong/avatar-core/dist/index.js')).href);
 const avatarScenes={};
 for(const name of ['grok-bot','cloudee']){const definition=JSON.parse(fs.readFileSync(path.join(product,`src/assets/${name}.avatar.json`)));avatarScenes[definition.name]=avatarCore.renderAvatarDefinition(definition,'neutral');}
 fs.writeFileSync(path.join(temp,'static-avatar.jsx'),`import React,{useId} from 'react'; const scenes=${JSON.stringify(avatarScenes)}; export function createAvatar(definition){return function StaticAvatar({size=20,ariaLabel=''}){const id=useId().replaceAll(':','');const base=scenes[definition.name]||Object.values(scenes)[1],scene={...base,colors:definition.colors},g=scene.geometry;return <span className="bs-avatar" role="img" aria-label={ariaLabel} style={{display:'block',width:size,height:size}}><svg viewBox="-150 -150 300 300" aria-hidden="true"><defs><clipPath id={id}><path d={g.headPath}/></clipPath></defs>{g.backPaths.map((d,i)=><path key={'b'+i} d={d} fill={scene.colors.body}/>)}<path d={g.headPath} fill={scene.colors.body}/><g clipPath={'url(#'+id+')'} fill={scene.colors.eyes}><path d={g.leftPath} opacity={g.leftVisible?1:0}/><path d={g.rightPath} opacity={g.rightVisible?1:0}/></g>{g.frontPaths.map((d,i)=><path key={'f'+i} d={d} fill={scene.colors.body}/>)}</svg></span>}}`);

 fs.writeFileSync(path.join(temp,'demo.css'),`@import ${JSON.stringify(path.join(product,'src/styles.css'))};\n@source ${JSON.stringify(path.join(product,'src'))};\nhtml, body, #root { width:100%;height:100%;margin:0;overflow:hidden; }\nhtml[data-demo-paused="true"] *, html[data-demo-paused="true"] *::before, html[data-demo-paused="true"] *::after { animation-play-state: paused !important; }\n`);
 fs.writeFileSync(path.join(temp,'index.html'),'<!doctype html><html lang="zh-CN" data-density="compact" data-theme="light" theme-mode="light"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src &#39;none&#39;; script-src &#39;self&#39;; style-src &#39;self&#39; &#39;unsafe-inline&#39;; img-src &#39;self&#39; data:; font-src &#39;self&#39; data:; connect-src &#39;none&#39;; form-action &#39;none&#39;; base-uri &#39;none&#39;"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body class="bg-background text-foreground"><div id="root" style="height:100vh;overflow:auto"></div><script type="module" src="./entry.jsx"></script></body></html>');
 const {build}=await import(pathToFileURL(requireProduct.resolve('vite')).href);
 const {default:react}=await import(pathToFileURL(requireProduct.resolve('@vitejs/plugin-react')).href);
 const {default:tailwind}=await import(pathToFileURL(requireProduct.resolve('@tailwindcss/vite')).href);
 const actualImports={};
 const aliases=['react','react-dom','@tanstack/react-query','react-router-dom'].map(name=>({find:new RegExp('^'+name+'(?=/|$)'),replacement:path.join(product,'node_modules',name)}));
 await build({configFile:false,logLevel:'warn',root:temp,base:'./',envDir:temp,cacheDir:path.join(temp,'cache'),resolve:{alias:aliases},plugins:[react(),tailwind(),{name:'demo-readonly-adapter',enforce:'pre',load(id){const file=id.split('?')[0];if(file.startsWith(product+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile())actualImports[path.relative(product,file)]=hash(fs.readFileSync(file));if(file===path.join(product,'src/components/knowledge-rich-markdown.tsx')){let source=fs.readFileSync(file,'utf8');for(const statement of ['import { code } from "@streamdown/code";\n','import { math } from "@streamdown/math";\n','import { createMermaidPlugin } from "@streamdown/mermaid";\n'])source=replaceOnce(source,statement,'');source=replaceOnce(source,'const knowledgeMarkdownPlugins = {\n  code,\n  math,\n  mermaid: createMermaidPlugin({\n    config: { securityLevel: "strict", startOnLoad: false },\n  }),\n};','const knowledgeMarkdownPlugins = {};');return source;}if(file===path.join(product,'src/components/chat-markdown.tsx'))return fs.readFileSync(file,'utf8').replace('import { ChatCodeHighlight } from "./chat-code-highlight";', 'import { lazy, Suspense } from "react";\nconst ChatCodeHighlight = lazy(() => import("./chat-code-highlight").then(m => ({ default: m.ChatCodeHighlight })));').replace('<ChatCodeHighlight text={text} language={language} />', '<Suspense fallback={text}><ChatCodeHighlight text={text} language={language} /></Suspense>');if(file===path.join(product,'src/pages/knowledge-page.tsx'))return fs.readFileSync(file,'utf8')+'\nexport { KnowledgeContentSearchDialog, KnowledgeDirectory };\n';if(file===path.join(product,'src/components/brand-logo.tsx'))return fs.readFileSync(file,'utf8').replaceAll('`/logo-', '`./logo-');if([path.join(product,'src/components/agent-avatar.tsx'),path.join(product,'src/components/employee/employee-avatar.tsx')].includes(file))return fs.readFileSync(file,'utf8').replace('from "@bible-strong/avatar-react"', 'from '+JSON.stringify(path.join(temp,'static-avatar.jsx'))).replace('import "@bible-strong/avatar-react/styles.css";','');return null;}}],build:{outDir:output,emptyOutDir:true,sourcemap:false,minify:true,assetsInlineLimit:0}});
 // Vite assigns the barrel's unlayered component CSS to delivery. Move the
 // original generated rules into the shared entry before any scene can load.
 const assets=path.join(output,'assets');
 const cssNames=fs.readdirSync(assets).filter(name=>name.endsWith('.css'));
 const entryCss=cssNames.filter(name=>name.startsWith('index-'));
 const lateCss=cssNames.filter(name=>name.startsWith('delivery-'));
 assert.equal(entryCss.length,1);assert.equal(lateCss.length,1);assert.equal(cssNames.length,2);
 const late=fs.readFileSync(path.join(assets,lateCss[0]),'utf8');
 const baselineCssFiles=fs.readdirSync(path.join(baseline,'assets')).filter(name=>/^index-.*\.css$/.test(name));
 assert.equal(baselineCssFiles.length,1);
 const oldNodes=postcss.parse(fs.readFileSync(path.join(baseline,'assets',baselineCssFiles[0]),'utf8')).nodes;
 const fontStart=oldNodes.findIndex(node=>node.type==='atrule'&&node.name==='font-face');
 assert.ok(fontStart>0);
 assert.deepEqual(postcss.parse(late).nodes.map(node=>node.toString()),oldNodes.slice(0,fontStart).map(node=>node.toString()),'TDesign component CSS differs from original baseline');
 const entryContent=late+fs.readFileSync(path.join(assets,entryCss[0]),'utf8');
 const newEntry=`index-shared-${hash(Buffer.from(entryContent)).slice(0,16)}.css`;
 fs.writeFileSync(path.join(assets,newEntry),entryContent);fs.unlinkSync(path.join(assets,entryCss[0]));
 const emptyName=`delivery-shared-${hash(Buffer.alloc(0)).slice(0,16)}.css`;
 fs.writeFileSync(path.join(assets,emptyName),'');fs.unlinkSync(path.join(assets,lateCss[0]));
 const htmlPath=path.join(output,'index.html');fs.writeFileSync(htmlPath,replaceOnce(fs.readFileSync(htmlPath,'utf8'),entryCss[0],newEntry));
 let replaced=0;for(const name of fs.readdirSync(assets).filter(name=>name.endsWith('.js'))){const file=path.join(assets,name),code=fs.readFileSync(file,'utf8');if(code.includes(lateCss[0]))replaced++;fs.writeFileSync(file,code.replaceAll(lateCss[0],emptyName).replaceAll(entryCss[0],newEntry));}
 assert.ok(replaced>0,'Expected delivery CSS reference');
 // Vite's dynamic preload tables also reference shared CSS. Validate every
 // local CSS reference in the emitted HTML, JS literals and CSS imports/URLs.
 function verifyCssReference(ref,from){
  if(ref==='.css'||!/\.css(?:[?#].*)?$/i.test(ref)||/^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(ref))return;
  const pathname=ref.split(/[?#]/,1)[0];
  assert.ok(!pathname.startsWith('/')&&!pathname.includes('\\')&&!pathname.split('/').includes('..')&&!pathname.includes('%'),`Unsafe CSS reference ${ref} in ${from}`);
  const target=path.resolve(path.dirname(from),pathname);
  assert.ok(target.startsWith(output+path.sep)&&fs.existsSync(target)&&fs.statSync(target).isFile(),`Missing CSS reference ${ref} in ${from}`);
 }
 for(const name of fs.readdirSync(assets)){
  const file=path.join(assets,name);
  if(name.endsWith('.js')){
   const tree=acorn.parse(fs.readFileSync(file,'utf8'),{ecmaVersion:'latest',sourceType:'module'});
   const checkLiteral=value=>{if(typeof value==='string'&&/^(?:\.{1,2}\/|\/|assets\/)[^\s"'{}]+\.css(?:[?#].*)?$/i.test(value))verifyCssReference(value,file)};
   const visit=node=>{if(!node||typeof node!=='object')return;if(node.type==='Literal')checkLiteral(node.value);if(node.type==='TemplateLiteral'&&node.expressions.length===0)checkLiteral(node.quasis[0].value.cooked);for(const value of Object.values(node)){if(Array.isArray(value))value.forEach(visit);else if(value&&typeof value==='object')visit(value)}};
   visit(tree);
  }else if(name.endsWith('.css')){
   const tree=postcss.parse(fs.readFileSync(file,'utf8'));
   tree.walkAtRules('import',rule=>{for(const match of rule.params.matchAll(/(?:url\(\s*)?["']([^"']+\.css(?:[?#][^"']*)?)["']/gi))verifyCssReference(match[1],file)});
   tree.walkDecls(decl=>{for(const match of decl.value.matchAll(/url\(\s*["']?([^"')\s]+\.css(?:[?#][^"')\s]*)?)["']?\s*\)/gi))verifyCssReference(match[1],file)});
  }
 }
 for(const match of fs.readFileSync(htmlPath,'utf8').matchAll(/\b(?:href|src)=["']([^"']+\.css(?:[?#][^"']*)?)["']/gi))verifyCssReference(match[1],htmlPath);
 const after=walk(path.join(product,'src'));assert.deepEqual(after,before,'Product sources changed');
 for(const name of ['src/styles.css','src/layers.css','src/fonts.css'])actualImports[name]=hash(fs.readFileSync(path.join(product,name)));
 for(const match of fs.readFileSync(path.join(product,'src/styles.css'),'utf8').matchAll(/@import\s+"(tdesign-react\/[^"]+)"/g)){const imported=path.join(product,'node_modules',match[1]);assert.ok(fs.existsSync(imported),'TDesign CSS import missing');actualImports[path.relative(product,imported)]=hash(fs.readFileSync(imported));}
 for(const [name,digest] of Object.entries(actualImports)) assert.equal(digest,snapshot.provenance.actualImports[name],`Unverified source dependency: ${name}`);
 for(const name of ['logo-mark.svg','logo-wordmark.svg','logo-lockup.svg','logo-mark-dark.svg','logo-wordmark-dark.svg','logo-lockup-dark.svg'])fs.copyFileSync(path.join(product,'public',name),path.join(output,name));
 const bundleFiles=walk(output,{},output);const provenance={scenes:buildScene==='all'?['delivery','training','knowledge']:[buildScene],sourceRevision:rev,sourceWorkingTreeDirty,sourceTreeBefore:hash(Buffer.from(JSON.stringify(before))),sourceTreeAfter:hash(Buffer.from(JSON.stringify(after))),sourceFileCount:Object.keys(before).length,actualImports,snapshot:snapshot.provenance.snapshot,fixtureHash:hash(fs.readFileSync(path.join(repo,'scripts/product-reference/fixture.json'))),entryHash:hash(fs.readFileSync(path.join(__dirname,'entry.jsx'))),scenesHash:hash(fs.readFileSync(path.join(__dirname,'scenes.jsx'))),sceneStyleHash:hash(fs.readFileSync(path.join(__dirname,'scene.css'))),runtimeHash:hash(fs.readFileSync(path.join(__dirname,'fixture.js'))),styleAdapter:'demo.css imports product src/styles.css and scans product src with Tailwind @source',adaptations:['knowledge-page module exports its original private dialog and directory through a build-only appended export','original brand assets use bundle-relative paths','explicit local fixture whitelist blocks real HTTP writes and external requests','original neutral avatar geometry pre-rendered at build time','composed product components run inside isolated iframe without ProductShell','scene modules load separately; original knowledge markdown loads on demand','chat-markdown lazily loads original ChatCodeHighlight for code fences, with text fallback','fixed demo content is checked to exclude code fences, math and Mermaid; its unused reader plugins are removed at build time; product sources remain unchanged','Vite-emitted unlayered TDesign component CSS from tdesign-react/es/index.js is verified against baseline and moved before shared CSS; late stylesheet is empty'],tdesignBarrelHash:hash(fs.readFileSync(path.join(product,'node_modules/tdesign-react/es/index.js'))),tdesignUnlayeredHash:hash(Buffer.from(late)),generatedFiles:bundleFiles};
 fs.writeFileSync(path.join(output,'source-provenance.json'),JSON.stringify(provenance,null,2));
 console.log(JSON.stringify({output,scene:buildScene,revision:rev,files:Object.keys(bundleFiles),sourceFiles:Object.keys(before).length},null,2));
}
main().finally(()=>{fs.rmSync(temp,{recursive:true,force:true});snapshot.cleanup()}).catch(error=>{console.error(error);process.exitCode=1});
