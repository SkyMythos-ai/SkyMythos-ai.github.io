import React, {useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter,Route,Routes} from 'react-router-dom';
import {ProductShell} from '__PRODUCT__/src/components/product-shell.tsx';
import {WorkspaceChatPage} from '__PRODUCT__/src/pages/workspace-chat-page.tsx';
import {FormationPage} from '__PRODUCT__/src/pages/my-ai/formation-page.tsx';
import {KnowledgeHomePage} from '__PRODUCT__/src/pages/knowledge-page.tsx';
import {ConsolePreferencesProvider,useConsolePreferences} from '__PRODUCT__/src/components/console-preferences.tsx';
import {TDesignProvider} from '__PRODUCT__/src/components/ui/tdesign-provider.tsx';
import {createWholePageFixture} from './whole-page-fixture.js';
import '__PRODUCT__/src/fonts.css';
import '__PRODUCT__/src/layers.css';
import './demo.css';

const buildScene='__BUILD_SCENE__';
const scene=buildScene==='all'?(new URLSearchParams(location.search).get('scene')||'training'):buildScene;
const revision='__REVISION__',duration=24000;
function memoryStorage(){const values=new Map();return {get length(){return values.size},key:index=>[...values.keys()][index]??null,getItem:key=>values.get(String(key))??null,setItem:(key,value)=>values.set(String(key),String(value)),removeItem:key=>values.delete(String(key)),clear:()=>values.clear()}}
Object.defineProperty(window,'localStorage',{value:memoryStorage(),configurable:true});Object.defineProperty(window,'sessionStorage',{value:memoryStorage(),configurable:true});
localStorage.setItem('fusion-language','zh-CN');localStorage.setItem('fusion-density','compact');localStorage.setItem('fusion-theme','light');
document.body.dataset.demoScene=scene;
const root=createRoot(document.getElementById('root'));
let runtime,epoch=0,time=0,playing=false,requested=false,everVisible=false,initialized=false,visible=false,reduced=false,last=0,raf=0,sequence=0,seeking=false;
let completed=new Map(),actionPending=false;
let latestParentControl=null;
function rememberParentFocus(event){const target=event.target;if(parent===window)return;if(target===parent.document.body||target===parent.document.documentElement){latestParentControl=null;return}if(target&&target!==window.frameElement&&target.ownerDocument===parent.document&&typeof target.focus==='function')latestParentControl=target}
function restoreParentFocus(){if(parent!==window&&parent.document.activeElement===window.frameElement&&latestParentControl?.isConnected)latestParentControl.focus({preventScroll:true})}
if(parent!==window){rememberParentFocus({target:parent.document.activeElement});parent.document.addEventListener('focusin',rememberParentFocus);window.addEventListener('pagehide',event=>{if(!event.persisted)parent.document.removeEventListener('focusin',rememberParentFocus)})}
let themeValue='light',setProductTheme;
function ThemeBridge(){const preferences=useConsolePreferences();useEffect(()=>{setProductTheme=preferences.setTheme;preferences.setTheme(themeValue);return()=>{setProductTheme=undefined}},[]);return null}
function App(){const route=scene==='delivery'?`/w/reference/chat?mode=agent&project=example-project&conversation=example-main`:scene==='knowledge'?'/w/reference/knowledge':'/w/reference/my-ai?create=experience';return <QueryClientProvider client={runtime.client}><ConsolePreferencesProvider><ThemeBridge/><TDesignProvider><MemoryRouter initialEntries={[route]}><Routes><Route path='/w/:workspaceId' element={<ProductShell/>}><Route path='chat' element={<WorkspaceChatPage/>}/><Route path='my-ai' element={<FormationPage scope={runtime.scope} api={runtime.api}/>}/><Route path='knowledge' element={<KnowledgeHomePage/>}/></Route></Routes></MemoryRouter></TDesignProvider></ConsolePreferencesProvider></QueryClientProvider>}
function render(){runtime?.dispose();runtime=createWholePageFixture();runtime.install();initialized=false;root.render(<App key={++epoch}/>)}
render();
function theme(value){themeValue=value==='dark'?'dark':'light';localStorage.setItem('fusion-theme',themeValue);setProductTheme?.(themeValue);document.documentElement.dataset.theme=themeValue;document.documentElement.setAttribute('theme-mode',themeValue);document.documentElement.style.colorScheme=themeValue}
function phase(){return scene==='training'?(time<800?'ready':time<6000?'responsibility':time<9500?'experience':time<14500?'analysis':'awaiting_confirmation'):scene==='knowledge'?(time<3000?'directory':time<9000?'search':time<13500?'scope':time<18000?'shared':time<22000?'workspace':'directory_ready'):(time<800?'ready':time<3500?'prompt':time<5500?'sent':time<16000?'executing':time<20600?'report':'completed')}
function post(){const pageReady=scene==='training'?(document.querySelector('#formation-goal')||[...document.querySelectorAll('h2')].some(node=>node.textContent.trim()==='确认员工方案')):document.querySelector(scene==='knowledge'?'[data-slot="page-frame"]':'[data-interaction-draft]');initialized ||=!!document.querySelector('.product-shell')&&!!pageReady;if(seeking)return;document.documentElement.dataset.demoPaused=String(!playing||reduced);parent.postMessage({type:'skymythos-product-demo',scene,ready:initialized,time,duration,playing,phase:phase(),sourceRevision:revision},location.origin)}
function setText(el,value){if(!el)return false;if(el.isContentEditable){const transfer=new DataTransfer();transfer.setData('text/plain',value.slice((el.__demoValue||'').length));el.dispatchEvent(new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:transfer}));el.__demoValue=value}else{const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(el,value);el.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:value.slice(-1)}))}return true}
function byText(text,scope=document){return [...scope.querySelectorAll('button')].find(el=>el.textContent.trim()===text)}
function scrollNative(target){if(!target)return;for(let scroller=target.parentElement;scroller&&!['root'].includes(scroller.id)&&!['BODY','HTML'].includes(scroller.tagName)&&!scroller.classList.contains('product-shell');scroller=scroller.parentElement){if(!['auto','scroll'].includes(getComputedStyle(scroller).overflowY)||scroller.scrollHeight<=scroller.clientHeight+1)continue;const viewport=scroller.getBoundingClientRect(),item=target.getBoundingClientRect();scroller.scrollTop+=(item.top-viewport.top-(viewport.height-Math.min(item.height,viewport.height))/2)/(viewport.height/scroller.clientHeight||1);return}}
function typeTo(selector,text,start,end,target,key){const length=Math.max(0,Math.min(text.length,Math.floor((target-start)/(end-start)*text.length)));if(length<=0||completed.get(key)===length)return;if(setText(document.querySelector(selector),text.slice(0,length)))completed.set(key,length)}
const trainingText='负责发布前检查：核对配置和回滚条件，输出检查结果与待处理问题。';
const deliveryText='请核对本次发布准备情况，整理检查结果与待处理问题。';
const settle=()=>new Promise(resolve=>setTimeout(resolve,100));
async function actionAt(key,target,at,token,callback){if(target<at||completed.has(key)||token!==sequence)return;const result=callback();if(result===false)return;completed.set(key,true);await settle();if(token===sequence)restoreParentFocus()}
async function runActions(target,token){
 if(token!==sequence||actionPending)return;const activeRuntime=runtime;actionPending=true;
 try{
 if(scene==='training'){
  typeTo('#formation-goal',trainingText,800,5200,target,'goal');await settle();if(token!==sequence)return;
  await actionAt('select',target,6500,token,()=>{const el=document.querySelector('button[role="checkbox"],input[type="checkbox"]');if(!el)return false;scrollNative(el);el.click()});if(token!==sequence)return;
  await actionAt('analyze',target,9500,token,()=>{const el=byText('分析所选经验');if(!el||el.disabled)return false;scrollNative(el);el.click()});if(token!==sequence)return;
  activeRuntime.advance(target);if(target>=14500){await settle();if(token!==sequence)return;scrollNative([...document.querySelectorAll('h2')].find(el=>el.textContent.trim()==='确认员工方案'))}
 }else if(scene==='knowledge'){
  typeTo('[data-slot="page-search"] input','发布',3000,5500,target,'directory-query');
  await actionAt('clear-search',target,9000,token,()=>{const el=byText('清除筛选');if(!el)return false;el.click()});if(token!==sequence)return;
  // Use original sidebar navigation: the select popover needs focus, which an ambient
  // embedded demo must restore to its visitor. These links expose the same native scopes.
  const openScope=view=>{const href=`/w/${encodeURIComponent(activeRuntime.scope.workspaceId)}/knowledge${view?`?view=${view}`:''}`;const el=[...document.querySelectorAll('a[href]')].find(el=>el.getAttribute('href')===href);if(!el)return false;el.click()};
  await actionAt('shared-select',target,13500,token,()=>openScope('shared'));if(token!==sequence)return;
  await actionAt('workspace-select',target,18000,token,()=>openScope('workspace'));if(token!==sequence)return;
  await actionAt('all-select',target,22000,token,()=>openScope(''));
 }else{
  if(!completed.has('send'))typeTo('[data-interaction-draft]',deliveryText,800,2900,target,'prompt');await settle();if(token!==sequence)return;
  await actionAt('send',target,3500,token,()=>{const form=document.querySelector('form[data-slot="conversation-composer"]');const button=form?.querySelector('button[type="submit"]');if(!form||!button||button.disabled)return false;form.requestSubmit()});
  if(token!==sequence)return;activeRuntime.advance(target);await settle();if(token!==sequence)return;
  await actionAt('details-open',target,6000,token,()=>{if(target>=15500)return;const el=document.querySelector('button[data-execution-turn="demo-turn"]');if(!el)return false;el.click()});if(token!==sequence)return;
  await actionAt('details-expand',target,6100,token,()=>{if(target>=15500)return;if(!parent.matchMedia('(max-width: 700px)').matches)return;const el=document.querySelector('button[aria-label="放大执行详情"]');if(!el)return false;el.click()});if(token!==sequence)return;
  if(target>=6500&&target<15500){const panel=document.querySelector('[data-slot="chat-execution-detail"]');panel?.querySelector('[data-slot="agent-tool-group"] > button[aria-expanded="false"]')?.click();for(const el of panel?.querySelectorAll('[data-slot="agent-tool-activity"] > button[aria-expanded="false"]')||[])el.click()}
  await actionAt('details-close',target,15500,token,()=>{const el=document.querySelector('button[aria-label="关闭执行详情"]');el?.click()});
 }
 }finally{if(token===sequence)actionPending=false}
}
async function seek(target){const token=++sequence;seeking=true;playing=false;time=Math.max(0,Math.min(duration,target));completed=new Map();actionPending=false;render();const activeRuntime=runtime;await settle();if(token!==sequence)return false;await settle();if(token!==sequence)return false;for(let attempt=0;attempt<6;attempt++){await runActions(time,token);if(token!==sequence)return false;await settle();if(token!==sequence)return false}await activeRuntime.settle();if(token!==sequence)return false;await settle();if(token!==sequence)return false;seeking=false;post();return true}
function tick(now){if(!playing)return;if(!visible||document.hidden){playing=false;post();return}time=Math.min(duration,time+(now-last));last=now;runtime.advance(time);void runActions(time,sequence);post();if(time>=duration){playing=false;requested=false;post();return}raf=requestAnimationFrame(tick)}
function startClock(){if(playing||!visible||document.hidden)return;playing=true;last=performance.now();raf=requestAnimationFrame(tick);post()}
function play(){requested=true;if(!visible||playing)return;if(reduced){if(time<duration)void seek(duration);requested=false;return}if(time>=duration){void seek(0).then(current=>{if(current&&requested)startClock()});return}startClock()}
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==parent)return;const value=event.data;if(value?.type!=='skymythos-product-demo-control'||value.scene!==scene)return;if(value.action==='theme')theme(value.theme);if(value.action==='visibility'){visible=Boolean(value.visible);reduced=Boolean(value.reduced);if(!visible){playing=false;cancelAnimationFrame(raf)}else if(reduced){if(time<duration)void seek(duration);requested=false}else if(requested||(!everVisible&&time===0))play();if(visible)everVisible=true;post()}if(value.action==='play')play();if(value.action==='pause'){requested=false;playing=false;cancelAnimationFrame(raf);post()}if(value.action==='replay'){requested=false;playing=false;cancelAnimationFrame(raf);void seek(0).then(current=>{if(current&&visible)play()})}if(value.action==='seek'){requested=false;playing=false;cancelAnimationFrame(raf);void seek(value.time||0)}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;cancelAnimationFrame(raf);post()}});
const readiness=new MutationObserver(()=>{if(!initialized)post()});readiness.observe(document.getElementById('root'),{childList:true,subtree:true});
requestAnimationFrame(()=>requestAnimationFrame(post));
