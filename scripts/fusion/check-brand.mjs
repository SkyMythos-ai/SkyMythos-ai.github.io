const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.documentElement.dataset.theme = "dark";
});
await page.waitForTimeout(600);
console.log(
  await page.locator('img[alt="SkyMythos.ai"]').evaluateAll((es) =>
    es.map((e) => ({
      src: e.getAttribute("src"),
      display: getComputedStyle(e).display,
      complete: e.complete,
      width: e.naturalWidth,
      rect: e.getBoundingClientRect().toJSON(),
    })),
  ),
);
await page.screenshot({
  path: "docs/design-references/fusion/home-desktop-dark.png",
  animations: "disabled",
});
await browser.close();
