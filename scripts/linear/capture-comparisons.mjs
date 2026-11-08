import fs from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
});
const results = [];
for (const size of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
  { width: 1920, height: 1080 },
  { width: 768, height: 1024 },
]) {
  const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1 });
  await page.goto("https://linear.app/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(10000);
  const tag =
    size.width === 1440
      ? "desktop"
      : size.width === 390
        ? "mobile"
        : String(size.width);
  await page.screenshot({
    path: `docs/design-references/linear/source-${tag}-top.png`,
  });
  if (size.width === 390 || size.width === 1440) {
    for (let y = 0; y < 10500; y += 800) {
      await page.mouse.wheel(0, 800);
      await page.waitForTimeout(120);
    }
    await page.mouse.wheel(0, -20000);
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `docs/design-references/linear/source-${tag}-full.png`,
      fullPage: true,
    });
  }
  results.push({
    viewport: size,
    height: await page.evaluate(() => document.body.scrollHeight),
  });
  await page.close();
}
fs.writeFileSync(
  "docs/research/linear/source-viewport-results.json",
  JSON.stringify(results, null, 2),
);
await browser.close();
