import assert from "node:assert/strict";
import fs from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const origin = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
// 原有中文专项回归保持使用中文路由；默认英文与切换由verify-pages覆盖。
const baseURL = `${origin}/zh`;
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
const report = { baseURL, errors: [], viewports: [] };
page.on("pageerror", (error) => report.errors.push(error.message));
try {
  await page.goto(`${baseURL}/pricing`, { waitUntil: "networkidle" });
  assert(
    await page
      .getByRole("heading", { name: "场景试点验证", exact: true })
      .isVisible(),
  );
  assert(
    await page
      .getByRole("heading", { name: "企业正式部署", exact: true })
      .isVisible(),
  );
  assert(
    await page
      .getByRole("heading", { name: "一套席位授权，内置完整企业智能体套件", exact: true })
      .isVisible(),
  );
  assert(
    await page
      .getByRole("heading", { name: "企业私有化架构与定制集成", exact: true })
      .isVisible(),
  );
  assert.equal(
    await page
      .getByRole("link", { name: "获取席位报价方案", exact: true })
      .getAttribute("href"),
    "/zh/poc?enquiry=enterprise",
  );
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((image) => image.decode().catch(() => {})),
      );
    });
    const dimensions = await page.evaluate(() => ({
      width: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    assert.equal(dimensions.width, dimensions.documentWidth);
    report.viewports.push(dimensions);
    if ([390, 1440].includes(width))
      await page.screenshot({
        path: `docs/design-references/fusion/pricing-${width}-light.png`,
        fullPage: true,
      });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "切换明暗主题", exact: true }).click();
  await page.screenshot({
    path: "docs/design-references/fusion/pricing-desktop-dark.png",
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "获取席位报价方案", exact: true })
    .click();
  await page.waitForURL(/enquiry=enterprise/);
  assert(
    (await page.getByRole("heading", { level: 1 }).innerText()).includes(
      "明确项目与报价",
    ),
  );
  await page.getByLabel("姓名", { exact: false }).fill("示例申请人");
  await page.getByLabel("公司 / 组织", { exact: false }).fill("示例企业");
  await page.getByLabel("工作邮箱", { exact: false }).fill("quote@example.com");
  await page
    .getByLabel("关注方向", { exact: false })
    .selectOption("多场景综合评估");
  await page
    .getByLabel("企业项目希望实现什么", { exact: false })
    .fill("希望评估企业部署、模型接入与服务范围，申请项目报价。");
  await page.getByRole("checkbox").check();
  await page.evaluate(() => {
    window.__mailtoClicks = [];
    document.addEventListener("click", (event) => {
      const anchor = event.target instanceof Element ? event.target.closest('a[href^="mailto:"]') : null;
      if (anchor) {
        window.__mailtoClicks.push(anchor.getAttribute("href") || "");
        event.preventDefault();
      }
    }, true);
  });
  await page.getByRole("button", { name: "通过邮件发送项目询价", exact: true }).click();
  await page.getByRole("status").filter({ hasText: "avatr@skymythos.ai" }).waitFor();
  assert.equal(await page.locator("textarea[readonly]").count(), 0);
  const mailHref = await page
    .locator('a[href^="mailto:avatr@skymythos.ai?"]')
    .getAttribute("href");
  assert(
    mailHref &&
      mailHref.includes(encodeURIComponent("企业项目询价")) &&
      mailHref.includes("quote%40example.com"),
  );
  const triggered = await page.evaluate(() => window.__mailtoClicks);
  assert(triggered.some((href) => href.startsWith("mailto:avatr@skymythos.ai?")));
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  assert(clipboardText.includes("示例企业") && clipboardText.includes("quote@example.com"));
  assert.equal(
    await page.getByLabel("工作邮箱", { exact: false }).inputValue(),
    "quote@example.com",
  );
  report.enterpriseIntentPreserved = true;
  await page.goto(`${baseURL}/poc`, { waitUntil: "networkidle" });
  assert(
    await page
      .getByRole("button", { name: "通过邮件发送 POC 申请", exact: true })
      .isVisible(),
  );
  assert.deepEqual(report.errors, []);
  fs.writeFileSync(
    "docs/research/fusion/pricing-verification.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
