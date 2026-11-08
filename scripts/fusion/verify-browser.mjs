import assert from "node:assert/strict";
import fs from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
const screenshotPrefix = process.env.SCREENSHOT_PREFIX || "";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
await page.addInitScript(
  () =>
    !localStorage.getItem("skymythos-theme") &&
    localStorage.setItem("skymythos-theme", "light"),
);
const report = {
  baseURL,
  errors: [],
  consoleErrors: [],
  failed: [],
  viewports: [],
  routes: [],
  interactions: [],
};
page.on("pageerror", (error) => report.errors.push(error.message));
page.on("console", (message) => {
  if (
    message.type() === "error" &&
    !(
      message.location().url.includes("/api/poc") &&
      message.text().includes("503")
    )
  )
    report.consoleErrors.push(message.text());
});
page.on("response", (response) => {
  if (response.status() >= 400 && !response.url().includes("/api/poc"))
    report.failed.push({ status: response.status(), url: response.url() });
});
async function shot(name, fullPage = false) {
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images]
        .filter((img) => img.getBoundingClientRect().width > 0)
        .map((img) => img.decode().catch(() => {})),
    );
  });
  await page.screenshot({
    path: `docs/design-references/fusion/${screenshotPrefix}${name}.png`,
    fullPage,
    animations: "disabled",
  });
}
try {
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await shot("home-desktop-top");
  await page.screenshot({
    path: `docs/design-references/fusion/${screenshotPrefix}home-desktop-full.png`,
    fullPage: true,
    animations: "disabled",
  });
  assert(
    (await page.getByRole("heading", { level: 1 }).innerText()).includes(
      "让能力留在企业",
    ),
  );
  assert.equal(await page.locator('a[href="https://linear.app"]').count(), 0);
  assert.equal(
    await page
      .getByRole("link", { name: /申请 POC/ })
      .first()
      .getAttribute("href"),
    "/poc",
  );
  assert.equal(
    await page.locator('input:not([type="hidden"])').count(),
    1,
    "首页只保留知识阅读检索，无试用目标输入",
  );
  await page.getByRole("button", { name: /产品能力/ }).click();
  assert(await page.locator("#fusion-products").isVisible());
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "切换明暗主题" }).click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await shot("home-desktop-dark");
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  assert.equal(
    await page.evaluate(() => localStorage.getItem("skymythos-theme")),
    "dark",
  );
  await page.getByRole("button", { name: "切换明暗主题" }).click();
  const question = page.locator("summary").first();
  await question.click();
  assert(await question.evaluate((e) => e.parentElement.open));
  await question.click();
  report.interactions.push("产品菜单、主题切换/偏好、FAQ");
  const routeLinks = await page
    .locator('a[href^="/"]')
    .evaluateAll((elements) => [
      ...new Set(
        elements
          .map((e) => e.getAttribute("href").split("#")[0])
          .filter(Boolean),
      ),
    ]);
  for (const route of routeLinks) {
    if (route === "/") continue;
    const response = await page.goto(baseURL + route, {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200, route);
    assert(await page.getByRole("heading", { level: 1 }).count());
    report.routes.push(route);
  }
  for (const route of [
    "/product/flows",
    "/docs",
    "/docs/private-deployment",
    "/poc",
    "/privacy",
  ]) {
    await page.goto(baseURL + route, { waitUntil: "networkidle" });
    await shot(route.replaceAll("/", "-").replace(/^-/, ""));
  }
  await page.goto(baseURL + "/poc", { waitUntil: "networkidle" });
  const submit = page.getByRole("button", { name: "提交 POC 申请" });
  await submit.click();
  assert.equal(
    await page.locator('[name="name"]').getAttribute("aria-invalid"),
    "true",
  );
  await page.getByLabel("姓名", { exact: false }).fill("示例申请人");
  await page.getByLabel("公司 / 组织", { exact: false }).fill("示例企业");
  await page.getByLabel("工作邮箱", { exact: false }).fill("poc@example.com");
  await page
    .getByLabel("关注方向", { exact: false })
    .selectOption("多场景综合评估");
  await page
    .getByLabel("希望通过 POC 验证什么", { exact: false })
    .fill("希望为企业研发、数字员工和知识管理场景制定 POC 验收标准。");
  await page.getByRole("checkbox").check();
  if (process.env.EXPECT_POC_SUCCESS === "1") {
    await submit.click();
    await page
      .getByRole("heading", { name: "已收到您的 POC 申请。" })
      .waitFor();
    report.interactions.push("POC 浏览器→服务端→本地接收器确认链路");
  } else {
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/poc") &&
        response.request().method() === "POST",
    );
    await submit.click();
    const response = await responsePromise;
    assert.equal(response.status(), 503);
    await page
      .getByRole("alert")
      .filter({ hasText: "申请接收服务暂未开放" })
      .waitFor();
    assert.equal(
      await page.locator('[name="company"]').inputValue(),
      "示例企业",
    );
    assert.equal(
      await page
        .getByRole("heading", { name: "已收到您的 POC 申请。" })
        .count(),
      0,
    );
    report.interactions.push("POC 字段校验、无通道不报成功、失败保留资料");
  }
  for (const size of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1920, height: 1080 },
    { width: 320, height: 740 },
  ]) {
    await page.setViewportSize(size);
    await page.goto(baseURL, { waitUntil: "networkidle" });
    const geometry = await page.evaluate(() => ({
      width: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      height: document.body.scrollHeight,
    }));
    assert.equal(geometry.width, geometry.documentWidth, `${size.width} 溢出`);
    report.viewports.push(geometry);
    await shot(`home-${size.width}-top`);
    if (size.width === 390) {
      await shot("home-mobile-full", true);
      const open = page.getByRole("button", { name: "打开导航", exact: true });
      await open.click();
      const dialog = page.getByRole("dialog", { name: "网站导航" });
      await dialog.waitFor();
      await shot("mobile-navigation");
      await page.keyboard.press("Tab");
      assert(await dialog.evaluate((e) => e.contains(document.activeElement)));
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden" });
      await page.waitForFunction(() => document.body.style.overflow === "");
      assert(await open.evaluate((e) => document.activeElement === e));
      report.interactions.push("手机导航、Tab、Escape、焦点/滚动恢复");
      await page.goto(baseURL + "/poc", { waitUntil: "networkidle" });
      await page.getByLabel("工作邮箱", { exact: false }).focus();
      const mobileFields = await page
        .locator('form input:not([type="checkbox"]),form select,form textarea')
        .evaluateAll((elements) =>
          elements.map((element) => ({
            name: element.getAttribute("name"),
            size: parseFloat(getComputedStyle(element).fontSize),
          })),
        );
      assert(mobileFields.every((field) => field.size >= 16));
      report.mobileForm = {
        fields: mobileFields,
        focusedField: await page.locator(":focus").getAttribute("name"),
        viewportScale: await page.evaluate(() => window.visualViewport?.scale),
      };
      report.interactions.push("手机表单字段≥16px，聚焦无横向溢出");
      await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; document.body.style.scrollBehavior = "auto"; });
      await page.locator('input[name="email"]').blur();
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(300);
      await shot("poc-mobile", true);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        390,
      );
    }
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.failed, []);
  fs.writeFileSync(
    `docs/research/fusion/${process.env.REPORT_NAME || "browser-results.json"}`,
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
