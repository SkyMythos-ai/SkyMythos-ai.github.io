const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const ts=require('typescript');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
// Interpret only import, constant, object, array, spread and literal syntax. No code executes.
function collectHeroCatalog({root,actualImports}) {
 const cache=new Map();const files=new Set();
 function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const name=path.relative(root,file);if(name!=='src/lib/i18n.ts'&&!name.startsWith('src/lib/i18n/'))throw Error(`Forbidden catalog input ${name}`);const source=fs.readFileSync(file,'utf8');if(hash(Buffer.from(source))!==actualImports[name])throw Error(`Unverified catalog input ${name}`);files.add(name);const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS), bindings=new Map(), imports=new Map(), values=new Map(),active=new Set();const entry={get};cache.set(file,entry);
 for(const stmt of tree.statements){if(ts.isImportDeclaration(stmt)&&stmt.importClause&&!stmt.importClause.isTypeOnly){const spec=stmt.moduleSpecifier.text;if(!spec.startsWith('.'))throw Error(`Nonlocal import in ${name}`);const imported=path.resolve(path.dirname(file),spec)+'.ts';if(!stmt.importClause.namedBindings||!ts.isNamedImports(stmt.importClause.namedBindings))throw Error(`Unsupported import in ${name}`);for(const el of stmt.importClause.namedBindings.elements)if(!el.isTypeOnly)imports.set(el.name.text,{file:imported,name:(el.propertyName||el.name).text})}if(ts.isVariableStatement(stmt))for(const d of stmt.declarationList.declarations)if(ts.isIdentifier(d.name)&&d.initializer)bindings.set(d.name.text,d.initializer)}
 function evalNode(node){while(ts.isAsExpression(node)||ts.isSatisfiesExpression(node)||ts.isParenthesizedExpression(node))node=node.expression;if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node))return node.text;if(ts.isNumericLiteral(node))return Number(node.text);if(node.kind===ts.SyntaxKind.TrueKeyword)return true;if(node.kind===ts.SyntaxKind.FalseKeyword)return false;if(node.kind===ts.SyntaxKind.NullKeyword)return null;if(ts.isIdentifier(node))return get(node.text);if(ts.isArrayLiteralExpression(node))return node.elements.map(evalNode);if(ts.isObjectLiteralExpression(node)){const o={};for(const p of node.properties){if(ts.isSpreadAssignment(p)){Object.assign(o,evalNode(p.expression));continue}if(!ts.isPropertyAssignment(p))throw Error(`Unsupported catalog member ${name}:${p.getText(tree).slice(0,100)}`);const key=ts.isIdentifier(p.name)||ts.isStringLiteral(p.name)||ts.isNumericLiteral(p.name)?p.name.text:undefined;if(key===undefined)throw Error(`Unsupported catalog key in ${name}`);o[key]=evalNode(p.initializer)}return o}throw Error(`Unsupported catalog expression ${name}: ${node.getText(tree).slice(0,100)}`)}
 function get(name){if(values.has(name))return values.get(name);if(active.has(name))throw Error(`Circular catalog binding ${name}`);active.add(name);try{let v;if(imports.has(name)){const dep=imports.get(name);v=load(dep.file).get(dep.name)}else if(bindings.has(name))v=evalNode(bindings.get(name));else throw Error(`Unknown catalog binding ${name}`);values.set(name,v);return v}finally{active.delete(name)}}return entry}
 const mod=load(path.join(root,'src/lib/i18n.ts'));const full=mod.get('messages'), catalogs=mod.get('messageCatalogs');const literals=new Set(),prefixes=new Set();
 function scan(node){if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node))literals.add(node.text);if(ts.isTemplateExpression(node)&&node.head.text)prefixes.add(node.head.text);if(ts.isBinaryExpression(node)&&node.operatorToken.kind===ts.SyntaxKind.PlusToken&&(ts.isStringLiteral(node.left)||ts.isNoSubstitutionTemplateLiteral(node.left)))prefixes.add(node.left.text);ts.forEachChild(node,scan)}
 for(const name of Object.keys(actualImports)){if(!name.startsWith('src/')||!/[.](tsx?|jsx?)$/.test(name)||name==='src/lib/i18n.ts'||name.startsWith('src/lib/i18n/'))continue;const file=path.join(root,name);if(!fs.existsSync(file))continue;const text=fs.readFileSync(file,'utf8');if(hash(Buffer.from(text))!==actualImports[name])throw Error(`Unverified source input ${name}`);scan(ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,name.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS))}
 const prefixesWithDots=[...prefixes].filter(x=>x.length>=3&&x.includes('.'));const critical=Object.fromEntries(Object.entries(full).filter(([key])=>literals.has(key)||prefixesWithDots.some(prefix=>key.startsWith(prefix))));return {full,catalogs,critical,catalogFiles:[...files].sort(),prefixes:prefixesWithDots.sort()};
}
module.exports={collectHeroCatalog};

// Runtime helper is serialized into the generated i18n module and unit-tested here.
function createLocaleLayers(critical, loader) {
 let complete=false,pending,error;
 const target={...critical},catalogTarget=[];
 const start=()=>pending||(pending=Promise.resolve().then(loader).then(full=>{for(const key of Object.keys(target))delete target[key];Object.assign(target,full.messages);catalogTarget.push(...full.messageCatalogs);complete=true;return full}).catch(reason=>{error=reason;throw reason}));
 const requireFull=()=>{if(error)throw error;if(!complete)throw start()};
 const messages=new Proxy(target,{get(obj,key,receiver){if(typeof key==='symbol'||Reflect.has(obj,key))return Reflect.get(obj,key,receiver);requireFull();return Reflect.get(obj,key,receiver)},has(obj,key){if(typeof key==='symbol'||Reflect.has(obj,key))return Reflect.has(obj,key);requireFull();return Reflect.has(obj,key)},ownKeys(obj){requireFull();return Reflect.ownKeys(obj)},getOwnPropertyDescriptor(obj,key){if(typeof key==='symbol'||Reflect.has(obj,key))return Reflect.getOwnPropertyDescriptor(obj,key);requireFull();return Reflect.getOwnPropertyDescriptor(obj,key)}});
 const catalogs=new Proxy(catalogTarget,{get(obj,key,receiver){if(typeof key==='symbol'||(typeof key==='string'&&key!=='length'&&key in Array.prototype))return Reflect.get(obj,key,receiver);requireFull();return Reflect.get(obj,key,receiver)},ownKeys(obj){requireFull();return Reflect.ownKeys(obj)},getOwnPropertyDescriptor(obj,key){requireFull();return Reflect.getOwnPropertyDescriptor(obj,key)}});
 return {messages,catalogs,start,ready:()=>complete};
}
function makeHeroLocaleSource({original,critical}) {
 const tree=ts.createSourceFile('i18n.ts',original,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
 const preserved=tree.statements.filter(node=>ts.isFunctionDeclaration(node)||ts.isTypeAliasDeclaration(node)||ts.isImportDeclaration(node)&&node.importClause?.isTypeOnly||ts.isExportDeclaration(node)&&node.isTypeOnly).map(node=>node.getText(tree));
 if(!preserved.some(x=>x.startsWith('export function translate(')))throw Error('Original translate missing');
 return `${createLocaleLayers.toString()}\nconst demoLayers=createLocaleLayers(${JSON.stringify(critical)},()=>import("./i18n.ts?demo-full-locale"));\nexport const messages=demoLayers.messages;\nexport const messageCatalogs=demoLayers.catalogs;\nexport const loadDemoFullLocale=demoLayers.start;\nexport const demoFullLocaleReady=demoLayers.ready;\n${preserved.join('\n')}\n`;
}
module.exports.createLocaleLayers=createLocaleLayers;
module.exports.makeHeroLocaleSource=makeHeroLocaleSource;

// One resume continuation per playback sequence; obsolete work never restarts playback.
function createLocaleWaitGate({load,getState,resume,fail}) {
 let current;
 function blocked(sequence){return current?.sequence===sequence}
 function wait(sequence){
  if(blocked(sequence))return current.promise;
  const record={sequence,promise:undefined};current=record;
  record.promise=Promise.resolve().then(load).then(()=>{
   if(current!==record)return;
   current=undefined;
   const state=getState();
   if(state.sequence===sequence&&state.requested&&state.visible&&!state.hidden&&!state.reduced&&!state.failed&&!state.seeking)resume();
  },error=>{
   if(current===record&&getState().sequence===sequence)fail(error);
  });
  return record.promise;
 }
 return {wait,blocked};
}
module.exports.createLocaleWaitGate=createLocaleWaitGate;
