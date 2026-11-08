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
const report = { baseURL, routes: [], search: [], viewports: [], errors: [] };
page.on("pageerror", (error) => report.errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") report.errors.push(message.text());
});

async function shot(name) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((image) => image.decode().catch(() => {})),
    );
  });
  await page.screenshot({
    path: `docs/design-references/fusion/docs-framework-${name}.png`,
  });
}

try {
  for (const slug of fs
    .readdirSync("content/docs/zh")
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => (file === "index.mdx" ? "" : file.slice(0, -4)))) {
    const response = await page.goto(`${baseURL}/docs/${slug}`, {
      waitUntil: "networkidle",
    });
    assert.equal(response.status(), 200);
    const title = await page.getByRole("heading", { level: 1 }).innerText();
    assert(title.length > 0);
    report.routes.push({ slug, title });
  }
  await page.goto(`${baseURL}/docs/deployment`, { waitUntil: "networkidle" });
  if ((await page.locator("html").getAttribute("data-theme")) !== "dark") {
    await page
      .getByRole("button", { name: "切换明暗主题", exact: true })
      .click();
  }
  await page.waitForFunction(
    () => document.documentElement.dataset.theme === "dark",
  );
  const token = page.locator('pre [style*="--shiki-dark"]').first();
  const colors = await token.evaluate((element) => {
    const computed = getComputedStyle(element);
    const probe = document.createElement("span");
    probe.style.color = computed.getPropertyValue("--shiki-dark");
    element.parentElement.append(probe);
    const expected = getComputedStyle(probe).color;
    probe.remove();
    return { actual: computed.color, expected };
  });
  assert.equal(colors.actual, colors.expected);
  report.darkCode = colors;
  const expectedClipboard = await page.locator("pre").first().innerText();
  await page
    .getByRole("button", { name: "复制代码", exact: true })
    .first()
    .click();
  assert.equal(
    (await page.evaluate(() => navigator.clipboard.readText())).trim(),
    expectedClipboard.trim(),
  );
  report.clipboard = true;
  await shot("deployment-dark");
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.getByRole("button", { name: "切换明暗主题", exact: true }).click();
  await page.waitForFunction(
    () => document.documentElement.dataset.theme === "light",
  );
  await page.goto(`${baseURL}/docs`, { waitUntil: "networkidle" });
  await shot("index-light");

  const indexResponse = await context.request.get(`${baseURL}/search-index.json`);
  assert.equal(indexResponse.status(), 200);
  assert.match(indexResponse.headers()["content-type"], /application\/json/);
  const index = await indexResponse.json();
  assert(["advanced", "simple", "i18n"].includes(index.type));
  report.searchIndex = index.type;

  for (const query of ["员工", "持久化", "Kubernetes 部署", "紫晶鲸鱼"]) {
    await page.keyboard.press("Meta+k");
    await page.getByRole("combobox").fill(query);
    if (query === "紫晶鲸鱼") {
      await page.getByText("未找到相关内容", { exact: true }).waitFor();
      assert.equal(await page.getByRole("option").count(), 0);
    } else {
      await page.getByRole("option").first().waitFor();
      assert((await page.getByRole("option").count()) > 0);
    }
    report.search.push({ query, count: await page.getByRole("option").count() });
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
  }
  await page.keyboard.press("Meta+k");
  const search = page.getByRole("combobox");
  await search.fill("持久化");
  await page.getByRole("option").first().waitFor();
  await shot("search");
  await search.press("ArrowDown");
  await search.press("Enter");
  await page.waitForURL(
    (url) => url.pathname.startsWith("/zh/docs/") && url.hash.length > 1,
  );
  const anchor = decodeURIComponent(new URL(page.url()).hash.slice(1));
  assert(
    await page
      .locator("[id]")
      .evaluateAll(
        (elements, id) => elements.some((element) => element.id === id),
        anchor,
      ),
  );
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  report.keyboardSearch = true;

  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${baseURL}/docs/getting-started`, {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(350);
    const dimensions = await page.evaluate(() => ({
      width: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      articleWidth: document.querySelector("#nd-page").getBoundingClientRect()
        .width,
    }));
    assert.equal(dimensions.documentWidth, width);
    assert(dimensions.articleWidth > Math.min(300, width - 32));
    report.viewports.push(dimensions);
    if (width === 390) await shot("mobile");
    if (width === 1440) await shot("desktop");
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(350);
  const menu = page.getByRole("button", { name: "打开文档导航", exact: true });
  await menu.click();
  const drawer = page.locator("#nd-sidebar-mobile");
  await drawer.waitFor();
  for (
    let index = 0;
    index < 20 && (await drawer.getAttribute("data-state")) === "open";
    index++
  ) {
    await page.keyboard.press("Tab");
  }
  await drawer.waitFor({ state: "hidden" });
  report.mobileFocusDismiss = true;
  await menu.click();
  await page.keyboard.press("Escape");
  await drawer.waitFor({ state: "hidden" });
  report.mobileEscape = true;
  assert.deepEqual(report.errors, []);
  fs.writeFileSync(
    "docs/research/fusion/docs-framework-verification.json",
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
