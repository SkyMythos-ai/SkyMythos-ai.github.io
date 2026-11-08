import assert from "node:assert/strict";
import { createServer } from "node:http";
import { access, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const root = path.resolve("out");
const mime = {
  ".html": "text/html; charset=utf-8", ".js": "application/javascript",
  ".css": "text/css", ".json": "application/json", ".txt": "text/plain",
  ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp",
  ".jpg": "image/jpeg", ".avif": "image/avif", ".woff2": "font/woff2",
};
const server = createServer(async (request, response) => {
  try {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405).end();
      return;
    }
    const url = new URL(request.url, "http://localhost");
    let file = path.resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) throw new Error("path");
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        response.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end();
        return;
      }
      file = path.join(file, "index.html");
    }
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(404).end("Not found");
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const baseURL = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(15000);
const report = { hosting: "纯静态本地HTTP服务", routes: [], search: [], enquiries: [], posts: [], errors: [] };
page.on("pageerror", (error) => report.errors.push(error.message));
page.on("response", (response) => {
  if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`);
});
page.on("request", (request) => {
  if (request.method() === "POST") report.posts.push(request.url());
});

try {
  for (const forbidden of ["reference", "api/poc", "sites/linear"]) {
    await assert.rejects(access(path.join(root, forbidden)));
  }
  await access(path.join(root, ".nojekyll"));
  for (const route of ["/", "/pricing/", "/docs/", "/docs/deployment/", "/poc/", "/privacy/"]) {
    const response = await page.goto(baseURL + route, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.getByRole("heading", { level: 1 }).first().waitFor();
    report.routes.push(route);
  }
  const indexResponse = await page.request.get(baseURL + "/search-index.json");
  assert.equal(indexResponse.status(), 200);
  assert.match(indexResponse.headers()["content-type"], /application\/json/);
  const index = await indexResponse.json();
  assert(["advanced", "simple", "i18n"].includes(index.type));
  report.index = { path: "/search-index.json", type: index.type };
  await page.goto(baseURL + "/docs/", { waitUntil: "networkidle" });
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
  await page.getByRole("combobox").fill("持久化");
  await page.getByRole("option").first().waitFor();
  await page.getByRole("combobox").press("ArrowDown");
  await page.getByRole("combobox").press("Enter");
  await page.waitForURL((url) => url.pathname.startsWith("/docs/") && url.hash.length > 1);
  report.keyboardSearch = true;

  for (const enterprise of [false, true]) {
    await page.goto(baseURL + (enterprise ? "/poc/?enquiry=enterprise" : "/poc/"), { waitUntil: "networkidle" });
    const title = await page.getByRole("heading", { level: 1 }).innerText();
    assert.match(title, enterprise ? /企业需求.*项目与报价/s : /业务场景.*POC/s);
    assert.match(await page.title(), /POC 与企业项目咨询/);
    const label = enterprise ? "提交项目询价" : "提交 POC 申请";
    await page.getByRole("button", { name: label, exact: true }).click();
    assert.equal(await page.locator('[name="name"]').getAttribute("aria-invalid"), "true");
    await page.getByLabel("姓名", { exact: false }).fill("静态验证示例");
    await page.getByLabel("公司 / 组织", { exact: false }).fill("示例组织");
    await page.getByLabel("工作邮箱", { exact: false }).fill("static-check@example.com");
    await page.getByLabel("关注方向", { exact: false }).selectOption("多场景综合评估");
    await page.locator('[name="needs"]').fill("验证静态站点保持询价语义，不发送资料，并明确展示未发送状态。");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: label, exact: true }).click();
    await page.getByRole("alert").filter({ hasText: "您的资料尚未发送" }).waitFor();
    assert.equal(await page.locator('[name="email"]').inputValue(), "static-check@example.com");
    assert.equal(await page.getByRole("heading", { name: /已收到/ }).count(), 0);
    report.enquiries.push({ type: enterprise ? "enterprise" : "poc", title, unsent: true, draftRetained: true });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.deepEqual(report.posts, []);
  assert.deepEqual(report.errors, []);

  async function scan(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await scan(file);
      else if (/\.(html|js|json|txt|css)$/.test(entry.name)) {
        const body = await readFile(file, "utf8");
        for (const marker of ["static-check@example.com", "static-secret-fixture", "private-static-fixture"]) {
          assert.equal(body.includes(marker), false, `${path.relative(root, file)}含测试私有标记`);
        }
      }
    }
  }
  await scan(root);
  report.artifacts = "无参考路由、POST服务端、Linear素材或测试个人资料/secret标记；保留.nojekyll";
  await writeFile("docs/research/fusion/pages-verification.json", JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
