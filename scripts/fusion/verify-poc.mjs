import assert from "node:assert/strict";
import http from "node:http";
import { spawn } from "node:child_process";
import fs from "node:fs";
import { validatePoc } from "../../src/lib/poc.ts";

const fixture = {
  name: "示例申请人",
  company: "示例企业",
  email: "poc@example.com",
  role: "技术负责人",
  scenario: "多场景综合评估",
  needs: "希望验证企业研发、数字员工与知识管理的 POC 目标与验收标准。",
  consent: true,
};
assert.equal(validatePoc(fixture).valid, true);
for (const changed of [
  { email: "bad-address" },
  { company: "" },
  { scenario: "不支持的方向" },
  { consent: false },
  { needs: "过短" },
  { needs: "长".repeat(2001) },
  { requestType: "unsupported" },
])
  assert.equal(validatePoc({ ...fixture, ...changed }).valid, false);
const normalized = validatePoc({ ...fixture, name: "  示例申请人  " });
assert(normalized.valid);
assert.equal(normalized.data.name, "示例申请人");
let receiverMode = "success";
const received = [];
const receiver = http.createServer(async (request, response) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  assert.equal(request.headers.authorization, "Bearer local-fixture-token");
  received.push(JSON.parse(Buffer.concat(chunks).toString()));
  response.writeHead(receiverMode === "success" ? 200 : 500, {
    "Content-Type": "application/json",
  });
  response.end(
    JSON.stringify(
      receiverMode === "success"
        ? { accepted: true }
        : { privateDiagnostic: "internal-fixture-error" },
    ),
  );
});
await new Promise((resolve) => receiver.listen(0, "127.0.0.1", resolve));
const address = receiver.address();
assert(address && typeof address === "object");
const baseURL = "http://127.0.0.1:3219";
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3219",
  ],
  {
    env: {
      ...process.env,
      POC_WEBHOOK_URL: `http://127.0.0.1:${address.port}/leads`,
      POC_WEBHOOK_TOKEN: "local-fixture-token",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let output = "";
child.stdout.on("data", (data) => {
  output += data;
});
child.stderr.on("data", (data) => {
  output += data;
});
async function ready() {
  for (let i = 0; i < 80; i++) {
    try {
      const response = await fetch(`${baseURL}/poc`);
      if (response.ok) return;
    } catch {
      /* 等待服务就绪。 */
    }
    if (child.exitCode !== null) throw new Error(output);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("生产验证服务启动超时");
}
try {
  await ready();
  const post = (data) =>
    fetch(`${baseURL}/api/poc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  let response = await post({ ...fixture, consent: false });
  assert.equal(response.status, 400);
  assert.equal(received.length, 0);
  response = await fetch(`${baseURL}/api/poc`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept-Language": "en" },
    body: JSON.stringify({ ...fixture, consent: false }),
  });
  assert.equal(response.status, 400);
  const englishError = await response.json();
  assert(!/\p{Script=Han}/u.test(englishError.message));
  assert(!/\p{Script=Han}/u.test(englishError.errors.consent));
  assert.equal(received.length, 0);
  response = await fetch(`${baseURL}/api/poc`, {
    method: "POST",
    body: "invalid json",
  });
  assert.equal(response.status, 400);
  response = await fetch(`${baseURL}/api/poc`, {
    method: "POST",
    body: "x".repeat(16001),
  });
  assert.equal(response.status, 413);
  receiverMode = "failure";
  response = await post(fixture);
  assert.equal(response.status, 502);
  assert.equal(
    (await response.text()).includes("internal-fixture-error"),
    false,
  );
  receiverMode = "success";
  response = await post(fixture);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.deepEqual(received.at(-1).lead, fixture);
  assert.equal(received.at(-1).source, "skymythos-website");
  const enterpriseFixture = { ...fixture, requestType: "enterprise" };
  response = await post(enterpriseFixture);
  assert.equal(response.status, 200);
  assert.deepEqual(received.at(-1).lead, enterpriseFixture);
  const html = await (await fetch(`${baseURL}/poc`)).text();
  assert.equal(html.includes("local-fixture-token"), false);
  assert.equal(html.includes(`127.0.0.1:${address.port}`), false);
  const browser = spawn(
    process.execPath,
    ["scripts/fusion/verify-browser.mjs"],
    {
      env: {
        ...process.env,
        BASE_URL: baseURL,
        EXPECT_POC_SUCCESS: "1",
        SCREENSHOT_PREFIX: "transport-",
        REPORT_NAME: "transport-browser-results.json",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let browserOutput = "";
  browser.stdout.on("data", (data) => {
    browserOutput += data;
  });
  browser.stderr.on("data", (data) => {
    browserOutput += data;
  });
  const exitCode = await new Promise((resolve) => browser.on("exit", resolve));
  assert.equal(exitCode, 0, browserOutput);
  const result = {
    validation:
      "通过：有效资料与规范化、无效邮箱、缺公司、错误场景、无同意、描述长度",
    http: "通过：400/413/502 与成功200；上游错误不泄露；payload一致；token和接收器地址不进入HTML",
    browser: "通过：完整浏览器表单→Next服务端→本地HTTP接收器成功确认",
    externalDelivery:
      "未验证真实接收地址；只向本地测试接收器发送example.com示例资料",
    received: received.length,
  };
  fs.writeFileSync(
    "docs/research/fusion/poc-verification.json",
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  child.kill("SIGTERM");
  await new Promise((resolve) => receiver.close(resolve));
}
