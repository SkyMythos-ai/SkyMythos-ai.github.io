const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const {createRequire}=require('node:module');
const {pathToFileURL}=require('node:url');
const assert=require('node:assert/strict');
const repo=path.resolve(__dirname,'../..');
const product=path.resolve(repo,'../fusion-harness/components/console/web');
const productGit=path.resolve(product,'../../..');
const rev=execFileSync('git',['-C',productGit,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
const buildScene=process.env.DEMO_SCENE||'all';
assert.ok(['all','knowledge'].includes(buildScene),'Only the isolated knowledge build or the existing complete build is supported');
const expected=buildScene==='knowledge'?'7295629889d881f3485168832359d16d141021f9':'14f40b0fc37f7a20eeab00293e3527725552a255';
const sourceWorkingTreeDirty=Boolean(execFileSync('git',['-C',productGit,'status','--porcelain'],{encoding:'utf8'}).trim());
assert.equal(rev,expected,'Product revision differs from reviewed source');
const hash=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
function walk(dir,result={},prefix=product){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())walk(file,result,prefix);else if(item.isFile())result[path.relative(prefix,file)]=hash(fs.readFileSync(file));}return result}
const before=walk(path.join(product,'src'));
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'fusion-product-demo-'));
const output=path.join(repo,'public/product-demo',rev);
const requireProduct=createRequire(path.join(product,'package.json'));
async function main(){
 fs.mkdirSync(temp,{recursive:true});
 let entry=fs.readFileSync(path.join(__dirname,'entry.jsx'),'utf8').replaceAll('__PRODUCT__',product).replaceAll('__REVISION__',rev).replaceAll('__BUILD_SCENE__',buildScene).replace('__FIXTURE__',fs.readFileSync(path.join(repo,'scripts/product-reference/fixture.json'),'utf8'));
 if(buildScene==='knowledge'){
  entry=entry.replace(/^import \{WorkspaceChatPage\}[^\n]+\n/m,'').replace(/^import \{FormationPage\}[^\n]+\n/m,'').replace("<Route path='chat' element={<WorkspaceChatPage/>}/>",'').replace("<Route path='my-ai' element={<FormationPage scope={runtime.scope} api={runtime.api}/>}/>",'');
 }
 fs.writeFileSync(path.join(temp,'entry.jsx'),entry);
 const fixtureSource=fs.readFileSync(path.join(__dirname,'whole-page-fixture.js'),'utf8').replaceAll('__PRODUCT__',product).replace('__FIXTURE__',fs.readFileSync(path.join(repo,'scripts/product-reference/fixture.json'),'utf8'));
 fs.writeFileSync(path.join(temp,'whole-page-fixture.js'),fixtureSource);
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
 await build({configFile:false,logLevel:'warn',root:temp,base:'./',envDir:temp,cacheDir:path.join(temp,'cache'),resolve:{alias:aliases},plugins:[react(),tailwind(),{name:'demo-readonly-adapter',enforce:'pre',load(id){const file=id.split('?')[0];if(file.startsWith(product+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile())actualImports[path.relative(product,file)]=hash(fs.readFileSync(file));if(file===path.join(product,'src/components/brand-logo.tsx'))return fs.readFileSync(file,'utf8').replaceAll('`/logo-', '`./logo-');if([path.join(product,'src/components/agent-avatar.tsx'),path.join(product,'src/components/employee/employee-avatar.tsx')].includes(file))return fs.readFileSync(file,'utf8').replace('from "@bible-strong/avatar-react"', 'from '+JSON.stringify(path.join(temp,'static-avatar.jsx'))).replace('import "@bible-strong/avatar-react/styles.css";','');return null;}}],build:{outDir:output,emptyOutDir:true,sourcemap:false,minify:true,assetsInlineLimit:100000}});
 const after=walk(path.join(product,'src'));assert.deepEqual(after,before,'Product sources changed');
 for(const name of ['src/styles.css','src/layers.css','src/fonts.css'])actualImports[name]=hash(fs.readFileSync(path.join(product,name)));
 for(const match of fs.readFileSync(path.join(product,'src/styles.css'),'utf8').matchAll(/@import\s+"(tdesign-react\/[^"]+)"/g)){const imported=path.join(product,'node_modules',match[1]);assert.ok(fs.existsSync(imported),'TDesign CSS import missing');actualImports[path.relative(product,imported)]=hash(fs.readFileSync(imported));}
 for(const name of ['logo-mark.svg','logo-wordmark.svg','logo-lockup.svg','logo-mark-dark.svg','logo-wordmark-dark.svg','logo-lockup-dark.svg'])fs.copyFileSync(path.join(product,'public',name),path.join(output,name));
 const bundleFiles=walk(output,{},output);const provenance={scenes:buildScene==='all'?['delivery','training','knowledge']:[buildScene],sourceRevision:rev,sourceWorkingTreeDirty,sourceTreeDigest:hash(Buffer.from(JSON.stringify(before))),sourceFileCount:Object.keys(before).length,actualImports,fixtureHash:hash(fs.readFileSync(path.join(repo,'scripts/product-reference/fixture.json'))),entryHash:hash(fs.readFileSync(path.join(__dirname,'entry.jsx'))),runtimeHash:hash(fs.readFileSync(path.join(__dirname,'whole-page-fixture.js'))),styleAdapter:'demo.css imports product src/styles.css and scans product src with Tailwind @source',adaptations:['original ProductShell and original whole pages mounted with MemoryRouter','original brand assets use bundle-relative paths','explicit read API whitelist supplied with fictional in-memory data','only example chat.send and formation.form mutate local memory; all real HTTP writes blocked','original neutral avatar geometry pre-rendered at build time to avoid runtime AJV schema compilation under strict CSP','original desktop product viewport remains intact; narrow marketing stages provide horizontal browsing without shrinking product fonts','parent clock drives native input, native buttons and ACP SSE events; pause seek replay are local only','automatic scripted native actions restore the latest valid parent control focus if the iframe claimed focus; original product focus behavior is unchanged'],generatedFiles:bundleFiles};
 fs.writeFileSync(path.join(output,'source-provenance.json'),JSON.stringify(provenance,null,2));
 console.log(JSON.stringify({output,scene:buildScene,revision:rev,files:Object.keys(bundleFiles),sourceFiles:Object.keys(before).length},null,2));
}
main().finally(()=>fs.rmSync(temp,{recursive:true,force:true})).catch(error=>{console.error(error);process.exitCode=1});
