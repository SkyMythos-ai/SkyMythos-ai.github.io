import { verifyBilingual } from "./verify-i18n.mjs";
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
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, locale: "zh-CN" });
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
  await verifyBilingual(page, baseURL, report);
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
