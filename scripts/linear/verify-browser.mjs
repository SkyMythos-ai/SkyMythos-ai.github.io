import assert from "node:assert/strict";
import fs from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const baseURL = process.env.BASE_URL || "http://127.0.0.1:3217";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const sourceSpecs = JSON.parse(
  fs.readFileSync("docs/research/linear/specs.json", "utf8"),
);
const report = {
  baseURL,
  errors: [],
  consoleErrors: [],
  failed: [],
  viewports: [],
  features: [],
  interactions: [],
};
page.on("pageerror", (e) => report.errors.push(e.message));
page.on("console", (e) => {
  if (e.type() === "error") report.consoleErrors.push(e.text());
});
page.on("response", (r) => {
  if (r.status() >= 400)
    report.failed.push({ status: r.status(), url: r.url() });
});
const screenshot = (name) =>
  page.screenshot({ path: `docs/design-references/linear/local-${name}.png` });
async function measure(tag) {
  const state = await page.evaluate(() => ({
    width: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    height: document.body.scrollHeight,
    headings: [...document.querySelectorAll("h1,h2")]
      .filter((e) => e.getBoundingClientRect().height)
      .map((e) => ({
        text: e.innerText,
        y: e.getBoundingClientRect().y + scrollY,
        x: e.getBoundingClientRect().x,
      })),
  }));
  assert.equal(state.width, state.documentWidth, `${tag} 横向溢出`);
  report.viewports.push({ tag, ...state });
}
try {
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(6500);
  await screenshot("desktop-top");
  for (let y = 0; y < 10500; y += 800) {
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(4500);
  await page.mouse.wheel(0, -20000);
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: "docs/design-references/linear/local-desktop-full.png",
    fullPage: true,
  });
  await measure("desktop");
  for (const name of ["Product", "Resources"]) {
    const button = page.getByRole("button", { name, exact: true });
    await button.hover();
    assert.equal(await button.getAttribute("aria-expanded"), "true");
    await button.click();
    assert.equal(await button.getAttribute("aria-expanded"), "true");
    await screenshot(`desktop-menu-${name.toLowerCase()}`);
    await page.keyboard.press("Escape");
    assert.equal(await button.getAttribute("aria-expanded"), "false");
  }
  report.interactions.push("桌面导航悬停、点击、Escape");
  const buttons = page.locator('button[aria-haspopup="dialog"]');
  const names = [...new Set(await buttons.allTextContents())];
  for (const text of names) {
    const name = text.replace(/\s*\+$/, "");
    const button = buttons.filter({ hasText: text }).first();
    await button.click();
    const dialog = page.locator("dialog[open]");
    await dialog.waitFor({ state: "visible" });
    assert.equal(
      (
        await dialog.getByRole("heading", { level: 2 }).textContent()
      ).toLowerCase(),
      sourceSpecs[name].heading.toLowerCase(),
    );
    assert((await dialog.locator("p").first().textContent()).length > 20);
    if (name === "Projects") await screenshot("spec-projects");
    await page.keyboard.press("Tab");
    assert(
      await dialog.evaluate((e) => e.contains(document.activeElement)),
      `详情面板焦点约束：${name}`,
    );
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    await page.waitForFunction(() => document.body.style.overflow === "");
    report.features.push(name);
  }
  assert.equal(report.features.length, 18);
  report.interactions.push("18种功能详情、Tab焦点约束、Escape、滚动恢复");
  for (const size of [
    { width: 390, height: 844 },
    { width: 1920, height: 1080 },
    { width: 768, height: 1024 },
    { width: 320, height: 740 },
  ]) {
    await page.setViewportSize(size);
    await page.goto(baseURL, { waitUntil: "networkidle" });
    await page.waitForTimeout(6500);
    const tag = size.width === 390 ? "mobile" : String(size.width);
    await measure(tag);
    await screenshot(`${tag}-top`);
    if (size.width === 390) {
      await page.screenshot({
        path: "docs/design-references/linear/local-mobile-full.png",
        fullPage: true,
      });
      const open = page.getByRole("button", { name: "Open menu", exact: true });
      await open.click();
      const dialog = page.getByRole("dialog", { name: "Site navigation" });
      await dialog.waitFor({ state: "visible" });
      await screenshot("mobile-menu");
      await page.keyboard.press("Tab");
      assert(await dialog.evaluate((e) => e.contains(document.activeElement)));
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden" });
      await open.click();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Close menu" })
        .click();
      assert.equal(await open.getAttribute("aria-expanded"), "false");
      assert(await open.evaluate((e) => e === document.activeElement));
      const carousel = page.locator('[class*="principles"]').first();
      await carousel.scrollIntoViewIfNeeded();
      await carousel.hover();
      await page.mouse.wheel(280, 0);
      await page.waitForTimeout(400);
      assert(await carousel.evaluate((e) => e.scrollLeft > 0));
      report.interactions.push(
        "手机菜单打开、关闭、Escape、焦点约束；卡片横向滚动",
      );
    }
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.failed, []);
  assert.deepEqual(report.consoleErrors, []);
  fs.writeFileSync(
    "docs/research/linear/browser-results.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
