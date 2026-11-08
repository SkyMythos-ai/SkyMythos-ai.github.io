import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const phase=process.env.AUDIT_PHASE||'before';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});
const report={phase,engine:'Chromium，本地模拟视口',cases:[],errors:[]};
for(const width of [320,390,640,768,1024,1440,1920])for(const theme of ['light','dark']){
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});page.on('pageerror',e=>report.errors.push(e.message));await page.addInitScript(t=>localStorage.setItem('skymythos-theme',t),theme);
 await page.goto('http://127.0.0.1:3000/zh/pricing',{waitUntil:'networkidle'});await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});
 const metrics=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,tableWidth:document.querySelector('table')?.getBoundingClientRect().width ?? null,tableParentWidth:document.querySelector('table')?.parentElement.clientWidth ?? null,markers:document.querySelector('ol') ? getComputedStyle(document.querySelector('ol')).listStyleType : null,quotes:[...document.querySelectorAll('main section')].filter(e=>e.querySelector('h2') && e.querySelector('a')).map(e=>({quoteY:e.querySelector('h2').getBoundingClientRect().y,actionY:e.querySelector('a').getBoundingClientRect().y}))}));
 const entry={width,theme,metrics};
 if([390,1440].includes(width)){
  await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});const a=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));entry.violations=a.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
  await page.screenshot({path:`docs/design-references/fusion/pricing-${phase}-${width}-${theme}.png`,fullPage:true});
 }
 report.cases.push(entry);await page.close();
}
fs.writeFileSync(`docs/research/fusion/pricing-audit-${phase}.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({phase,cases:report.cases.length,violations:report.cases.filter(c=>c.violations?.length).map(c=>({width:c.width,theme:c.theme,issues:c.violations.map(v=>v.id)})),errors:report.errors}));await browser.close();
