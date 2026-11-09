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
const selector = '[aria-label="SkyMythos 产品场景示意"]';
const report = {
  baseURL,
  errors: [],
  desktop: {},
  mobile: {},
  reducedMotion: {},
};
function watch(page) {
  page.on("pageerror", (error) => report.errors.push(error.message));
}
async function state(page) {
  return page
    .locator(selector)
    .evaluate((element) => ({
      scene: element.dataset.scene,
      stage: element.dataset.stage,
      playback: element.dataset.playback,
    }));
}
async function waitStage(page, stage, timeout = 10000) {
  await page.waitForFunction(
    ({ selector, stage }) =>
      document.querySelector(selector)?.dataset.stage === stage,
    { selector, stage },
    { timeout },
  );
}
async function waitPlayback(page, playback) {
  await page.waitForFunction(
    ({ selector, playback }) =>
      document.querySelector(selector)?.dataset.playback === playback,
    { selector, playback },
  );
}
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  watch(page);
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.locator(selector).scrollIntoViewIfNeeded();
  const showResult = page.getByRole("button", { name: "直接查看成果", exact: true });
  if (await showResult.isVisible()) await showResult.click();
  await waitPlayback(page, "complete");
  await waitStage(page, "confirmation");
  report.desktop.directResult = true;
  await page.getByRole("button", { name: "重播演示", exact: true }).click();
  const stages = [];
  for (const stage of [
    "goal",
    "reading",
    "working",
    "drafting",
    "delivery",
    "confirmation",
  ]) {
    await waitStage(page, stage);
    stages.push(await state(page));
  }
  report.desktop.stages = stages;
  await waitPlayback(page, "complete");
  report.desktop.completed = await state(page);
  assert.equal(report.desktop.completed.scene, "project");
  assert.equal(report.desktop.completed.stage, "confirmation");
  assert.equal(await page.locator(selector).locator('[data-playback-control]').count(), 0);
  assert.equal(await page.locator(selector).locator('header').getByText(/产品场景示意|示例数据|静态示意/).count(), 0);
  assert(await page.getByRole("button", { name: "重播演示", exact: true }).isVisible());
  report.desktop.controlsOutsideWorkbench = true;
  const tabs = page
    .locator(selector)
    .getByRole("tablist", { name: "选择产品工作场景" });
  await tabs.getByRole("tab", { name: "研发任务", exact: true }).click();
  await page.keyboard.press("ArrowRight");
  await waitPlayback(page, "complete");
  const focused = await state(page);
  await page.waitForTimeout(4500);
  assert.deepEqual(await state(page), focused);
  assert.equal(focused.scene, "automation");
  assert.equal(
    await tabs
      .getByRole("tab", { name: "自动化", exact: true })
      .evaluate((e) => document.activeElement === e),
    true,
  );
  report.desktop.focusKeepsSelectedScene = true;
  await page.getByRole("button", { name: "重播演示", exact: true }).click();
  await waitPlayback(page, "playing");
  await page.getByRole("button", { name: "暂停演示", exact: true }).click();
  await waitPlayback(page, "suspended");
  const paused = await state(page);
  await page.waitForTimeout(1800);
  assert.deepEqual(await state(page), paused);
  report.desktop.manualPause = true;
  await page.getByRole("button", { name: "继续演示", exact: true }).click();
  await waitPlayback(page, "playing");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await waitPlayback(page, "suspended");
  const outside = await state(page);
  await page.waitForTimeout(2000);
  assert.deepEqual(await state(page), outside);
  report.desktop.offscreenStable = true;
  await page.locator(selector).scrollIntoViewIfNeeded();
  await waitPlayback(page, "playing");
  // Headless Chrome does not consistently hide background tabs; inject its native visibility signal.
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await waitPlayback(page, "suspended");
  const background = await state(page);
  await page.waitForTimeout(2000);
  assert.deepEqual(await state(page), background);
  report.desktop.visibilitySignalPauses = true;
  await page.evaluate(() => {
    delete document.visibilityState;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await waitPlayback(page, "playing");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await waitPlayback(page, "reduced");
  await waitStage(page, "confirmation");
  const reduced = await state(page);
  await page.waitForTimeout(1800);
  assert.deepEqual(await state(page), reduced);
  report.reducedMotion.liveChangeShowsCompleteReport = true;
  assert.equal(
    await page
      .locator(selector)
      .getByText("已附验收要求，等待你的确认", { exact: true })
      .isVisible(),
    true,
  );
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "no-preference",
  });
  watch(mobile);
  await mobile.goto(baseURL, { waitUntil: "networkidle" });
  await mobile.locator(selector).scrollIntoViewIfNeeded();
  await waitStage(mobile, "reading");
  const mobileStage = mobile
    .locator(selector)
    .locator('[class*="reportStage"]');
  assert.equal(await mobileStage.isVisible(), true);
  report.mobile.readingText = await mobileStage.innerText();
  await waitStage(mobile, "working");
  report.mobile.workingText = await mobileStage.innerText();
  await waitStage(mobile, "delivery");
  report.mobile.deliveryText = await mobileStage.innerText();
  await waitStage(mobile, "confirmation");
  report.mobile.confirmationText = await mobileStage.innerText();
  assert.equal(
    await mobile
      .locator(selector)
      .getByText("已附验收要求，等待你的确认", { exact: true })
      .isVisible(),
    true,
  );
  await waitPlayback(mobile, "complete");
  assert(await mobile.getByRole("button", { name: "重播演示", exact: true }).isVisible());
  assert.equal((await state(mobile)).scene, "project");
  report.mobile.completedWithoutSceneChange = true;
  await mobile.setViewportSize({ width: 320, height: 740 });
  report.mobile.narrowWidth = await mobile.evaluate(
    () => document.documentElement.scrollWidth,
  );
  assert.equal(report.mobile.narrowWidth, 320);
  const staticPage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  watch(staticPage);
  await staticPage.goto(baseURL, { waitUntil: "networkidle" });
  await staticPage.locator(selector).scrollIntoViewIfNeeded();
  await waitPlayback(staticPage, "reduced");
  await waitStage(staticPage, "confirmation");
  report.reducedMotion.initialStatic = true;
  await staticPage
    .locator(selector)
    .getByRole("tab", { name: "研发任务", exact: true })
    .click();
  assert.equal((await state(staticPage)).stage, "confirmation");
  report.reducedMotion.manualTabsWork = true;
  assert.deepEqual(report.errors, []);
  fs.writeFileSync(
    "docs/research/fusion/motion-verification.json",
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
