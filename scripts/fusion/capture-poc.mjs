import assert from "node:assert/strict";
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||"playwright");
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 await page.addInitScript(()=>localStorage.setItem("skymythos-theme","light"));
 await page.goto('http://127.0.0.1:3000/poc',{waitUntil:'networkidle'});
 await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; document.body.style.scrollBehavior = 'auto'; });
 await page.getByLabel("工作邮箱",{exact:false}).focus();
 await page.screenshot({path:'docs/design-references/fusion/poc-mobile-focused.png'});
 await page.locator('input[name="email"]').blur();
 await page.evaluate(()=>{ if(document.activeElement instanceof HTMLElement)document.activeElement.blur();window.scrollTo({top:0,behavior:"instant"}); });
 await page.waitForTimeout(700);
 assert.equal(await page.evaluate(()=>scrollY),0);
 await page.screenshot({path:'docs/design-references/fusion/poc-mobile.png',fullPage:true,animations:'disabled'});
 console.log('POC 手机默认全页：焦点已移除，scrollY=0；另存聚焦视口。');
} finally { await browser.close(); }
