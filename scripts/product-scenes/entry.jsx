import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter} from 'react-router-dom';
import {ConsolePreferencesProvider,useConsolePreferences} from '__PRODUCT__/src/components/console-preferences.tsx';
import {TDesignProvider} from '__PRODUCT__/src/components/ui/tdesign-provider.tsx';
import {createWholePageFixture} from './fixture.js';
import {Scene,referenceDocument} from './scenes.jsx';
import '__PRODUCT__/src/fonts.css'; import '__PRODUCT__/src/layers.css'; import './demo.css'; import './scene.css';
const scene=new URLSearchParams(location.search).get('scene')||'delivery', revision='__REVISION__', duration=24000;
function memoryStorage(){const values=new Map();return {get length(){return values.size},key:index=>[...values.keys()][index]??null,getItem:key=>values.get(String(key))??null,setItem:(key,value)=>values.set(String(key),String(value)),removeItem:key=>values.delete(String(key)),clear:()=>values.clear()}}
Object.defineProperty(window,'localStorage',{value:memoryStorage(),configurable:true});Object.defineProperty(window,'sessionStorage',{value:memoryStorage(),configurable:true});
localStorage.setItem('fusion-language','zh-CN');localStorage.setItem('fusion-density','compact');localStorage.setItem('fusion-theme','light');
function installRuntime(value){value.install();const fixtureFetch=window.fetch;window.fetch=async(input,init={})=>{const response=await fixtureFetch(input,init);const url=new URL(input instanceof Request?input.url:String(input),location.origin);if(url.origin===location.origin&&url.pathname==='/api/v1/knowledge-base/search'&&(init.method||'GET')==='POST'&&response.ok){const {documentId,knowledgeBaseId,documentRevisionId,title,snippet}=referenceDocument;return new Response(JSON.stringify({code:'ok',info:'',data:[{documentId,knowledgeBaseId,documentRevisionId,title,chunkId:'rollback',content:snippet,score:0.94}],total:1}),{headers:{'Content-Type':'application/json'}})}return response}}
let runtime=createWholePageFixture(); installRuntime(runtime);
let theme='light',setTheme,playing=false,visible=false,reduced=false,time=0,last=0,frame,requested=false,epoch=0,ready=false,update=()=>{};
function ThemeBridge(){const {setTheme:applyTheme}=useConsolePreferences();useEffect(()=>{setTheme=applyTheme;applyTheme(theme);return()=>{setTheme=undefined}},[applyTheme]);return null}
function phase(){return scene==='delivery'?(time<15000?'executing':time<21000?'report':'completed'):scene==='training'?(time<6000?'experience':time<14500?'analysis':'awaiting_confirmation'):(time<3000?'directory':time<8000?'search':time<15000?'results':'document')}
function post(){document.documentElement.dataset.demoPaused=String(!playing||reduced);parent.postMessage({type:'skymythos-product-demo',scene,ready,time,duration,playing,phase:phase(),sourceRevision:revision,presentation:'composed-v1'},location.origin)}
function App(){const [snapshot,setSnapshot]=useState({time,epoch});useEffect(()=>{update=setSnapshot;ready=true;post();return()=>{update=()=>{};ready=false}},[]);return <QueryClientProvider client={runtime.client}><ConsolePreferencesProvider><ThemeBridge/><TDesignProvider><MemoryRouter initialEntries={['/w/reference']}><Scene key={snapshot.epoch} scene={scene} time={snapshot.time} runtime={runtime}/></MemoryRouter></TDesignProvider></ConsolePreferencesProvider></QueryClientProvider>}
const root=createRoot(document.getElementById('root'));root.render(<App/>);
function draw(){runtime.advance(time);update({time,epoch});post()}
function tick(now){if(!playing)return;if(document.hidden||!visible){playing=false;cancelAnimationFrame(frame);post();return}time=Math.min(duration,time+now-last);last=now;draw();if(time<duration)frame=requestAnimationFrame(tick);else{playing=false;requested=false;post()}}
function play(){requested=true;if(!visible||document.hidden||playing)return;if(reduced){time=duration;draw();return}if(time>=duration)return;playing=true;last=performance.now();frame=requestAnimationFrame(tick);post()}
function seek(value){playing=false;cancelAnimationFrame(frame);time=Math.max(0,Math.min(duration,value));epoch++;ready=false;runtime.dispose();runtime=createWholePageFixture();installRuntime(runtime);root.render(<App key={epoch}/>);post()}
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='skymythos-product-demo-control'||e.data.scene!==scene)return;const v=e.data;if(v.action==='theme'){theme=v.theme==='dark'?'dark':'light';localStorage.setItem('fusion-theme',theme);setTheme?.(theme);document.documentElement.dataset.theme=theme;document.documentElement.setAttribute('theme-mode',theme);document.documentElement.style.colorScheme=theme}if(v.action==='visibility'){visible=!!v.visible;reduced=!!v.reduced;if(!visible){playing=false;cancelAnimationFrame(frame)}else if(reduced){seek(duration)}else if(requested)play();post()}if(v.action==='play')play();if(v.action==='pause'){requested=false;playing=false;cancelAnimationFrame(frame);post()}if(v.action==='replay'){seek(0);play()}if(v.action==='seek'){requested=false;seek(v.time||0)}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;cancelAnimationFrame(frame);post()}else if(requested)play()});requestAnimationFrame(post);
