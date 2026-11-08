const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
import fs from "node:fs";
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH,
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  await page.goto("https://linear.app/", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(6000);
  await page.screenshot({
    path: "docs/design-references/linear/source-desktop-top.png",
  });
  fs.writeFileSync(
    "docs/research/linear/dom-desktop.json",
    JSON.stringify(
      await page.evaluate(() => ({
        title: document.title,
        text: document.body.innerText,
        headings: [...document.querySelectorAll("h1,h2,h3")].map((e) => ({
          tag: e.tagName,
          text: e.textContent,
          rect: e.getBoundingClientRect().toJSON(),
          font: getComputedStyle(e).font,
          spacing: getComputedStyle(e).letterSpacing,
        })),
        images: [...document.images].map((e) => ({
          alt: e.alt,
          src: e.currentSrc,
          w: e.naturalWidth,
          h: e.naturalHeight,
        })),
        videos: [...document.querySelectorAll("video")].map((e) => ({
          src: e.currentSrc,
          poster: e.poster,
          html: e.outerHTML,
        })),
        links: [...document.querySelectorAll("header a,nav a")].map((e) => ({
          text: e.textContent,
          href: e.href,
        })),
        bodyStyle: {
          background: getComputedStyle(document.body).background,
          color: getComputedStyle(document.body).color,
          font: getComputedStyle(document.body).font,
        },
      })),
      null,
      2,
    ),
  );
  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log("height", height);
  for (let y = 0; y < height; y += 800) {
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(500);
  }
  await page.screenshot({
    path: "docs/design-references/linear/source-desktop-full.png",
    fullPage: true,
  });
  await page.evaluate(() => scrollTo(0, 0));
  await page.getByRole("button", { name: "Product", exact: true }).hover();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: "docs/design-references/linear/source-desktop-menu.png",
  });
  fs.writeFileSync(
    "docs/research/linear/menu-text.txt",
    await page.locator("body").innerText(),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("https://linear.app/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);
  await page.screenshot({
    path: "docs/design-references/linear/source-mobile-top.png",
  });
  for (let y = 0; y < height; y += 800) {
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(200);
  }
  await page.screenshot({
    path: "docs/design-references/linear/source-mobile-full.png",
    fullPage: true,
  });
  console.log("done");
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
