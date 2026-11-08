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
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const report = { baseURL, errors: [], viewports: [] };
page.on("pageerror", (error) => report.errors.push(error.message));
try {
  await page.goto(`${baseURL}/pricing`, { waitUntil: "networkidle" });
  assert(
    await page
      .getByRole("heading", { name: "POC 验证", exact: true })
      .isVisible(),
  );
  assert(
    await page
      .getByRole("heading", { name: "企业项目", exact: true })
      .isVisible(),
  );
  assert.equal(
    await page
      .getByRole("link", { name: "咨询企业项目报价", exact: true })
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
    .getByRole("link", { name: "咨询企业项目报价", exact: true })
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
  // 本地失败响应夹具仅用于核对客户端询价类型与资料保留，不发送外部信息。
  let payload;
  await page.route("**/api/poc", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({
      status: 503,
      json: { ok: false, message: "本地验证：当前资料未发送。" },
    });
  });
  await page.getByRole("button", { name: "提交项目询价", exact: true }).click();
  await page.getByText("本地验证：当前资料未发送。", { exact: true }).waitFor();
  assert.equal(payload.requestType, "enterprise");
  assert.equal(
    await page.getByLabel("工作邮箱", { exact: false }).inputValue(),
    "quote@example.com",
  );
  report.enterpriseIntentPreserved = true;
  await page.goto(`${baseURL}/poc`, { waitUntil: "networkidle" });
  assert(
    await page
      .getByRole("button", { name: "提交 POC 申请", exact: true })
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
