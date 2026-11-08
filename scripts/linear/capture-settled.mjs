const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(process.env.BASE_URL || "http://127.0.0.1:3218", { waitUntil: "networkidle" });
  const scenes = page.locator('[class*="scene"][aria-label]');
  for (const scene of await scenes.all()) {
    await page.mouse.move(700, 700);
    const delta = await scene.evaluate(e => e.getBoundingClientRect().top - 160);
    await page.mouse.wheel(0, delta);
    await page.waitForTimeout(5000);
    if ((await scene.getAttribute("aria-label")).startsWith("AI agents")) await page.screenshot({ path: "docs/design-references/linear/local-ai-active.png", animations: "disabled" });
  }
  console.log(await page.locator('[class*="agentPrompt"]').evaluateAll(elements => elements.map(e => ({ text: e.textContent, clipPath: getComputedStyle(e).clipPath, opacity: getComputedStyle(e).opacity }))));
  await page.mouse.wheel(0, -20000);
  await page.waitForTimeout(600);
  await page.screenshot({ path: "docs/design-references/linear/local-desktop-top.png" });
  await page.screenshot({ path: "docs/design-references/linear/local-desktop-full.png", fullPage: true, animations: "disabled" });
} finally { await browser.close(); }
