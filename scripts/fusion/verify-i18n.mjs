import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";

// 在静态服务器上验证；共享给Pages检查，不能用开发服务器代替静态能力。
export async function verifyBilingual(page, baseURL, report) {
  report.locales = [];
  report.viewports = [];
  const route = (locale, pathname) => `${baseURL}${locale === "zh" ? "/zh" : ""}${pathname}`;
  const switchName = locale => locale === "en" ? "切换到中文" : "Switch to English";
  for (const locale of ["en", "zh"]) {
    const prefix = locale === "zh" ? "/zh" : "";
    const docs = (await readdir(`content/docs/${locale}`)).filter(file => file.endsWith(".mdx"));
    const routes = ["/", "/pricing/", "/poc/", "/privacy/",
      ...["skybot", "employees", "flows", "automations", "knowledge", "environments"].map(slug => `/product/${slug}/`),
      ...docs.map(file => file === "index.mdx" ? "/docs/" : `/docs/${file.slice(0, -4)}/`),
    ];
    for (const pathname of routes) {
      const response = await page.request.get(route(locale, pathname));
      assert.equal(response.status(), 200, prefix + pathname);
      const html = await response.text();
      assert(html.includes(`lang="${locale === "en" ? "en" : "zh-CN"}"`), prefix + pathname);
      assert(html.includes('name="robots" content="index, follow"'), prefix + pathname);
      assert(html.includes('hrefLang="en"') && html.includes('hrefLang="zh-CN"'), `语言替代链接缺失：${pathname}`);
      report.routes.push(prefix + pathname);
    }
    const index = await page.request.get(route(locale, "/search-index.json"));
    assert.equal(index.status(), 200);
    assert.match(index.headers()["content-type"], /application\/json/);
    assert.equal((await index.json()).type, "advanced");

    await page.goto(route(locale, "/"), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const text = await page.locator("main").innerText();
    if (locale === "en") assert(!/\p{Script=Han}/u.test(text), "英文首页不能残留中文可见文案");
    else assert.match(text, /让 AI 完成工作/);
    const nav = await page.locator('header nav').first().innerText();
    assert(nav.indexOf(locale === "en" ? "Pricing" : "价格") < nav.indexOf(locale === "en" ? "Docs" : "文档"));
    const theme = page.getByRole("button", { name: locale === "en" ? "Toggle color theme" : "切换明暗主题", exact: true });
    await theme.click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await theme.click();

    for (const enterprise of [false, true]) {
      await page.goto(route(locale, `/poc/${enterprise ? "?enquiry=enterprise#main-content" : ""}`), { waitUntil: "networkidle" });
      const title = await page.getByRole("heading", { level: 1 }).innerText();
      assert.match(title, locale === "zh" ? enterprise ? /企业需求.*项目与报价/s : /业务场景.*POC/s : enterprise ? /needs.*project and quote/s : /use case.*POC/s);
      const submit = page.locator('button[type="submit"]');
      await submit.click();
      assert.equal(await page.locator('[name="name"]').getAttribute("aria-invalid"), "true");
      const errorId = await page.locator('[name="name"]').getAttribute("aria-describedby");
      const error = await page.locator(`[id="${errorId}"]`).innerText();
      assert(locale === "en" ? !/\p{Script=Han}/u.test(error) : /\p{Script=Han}/u.test(error));
      await page.locator('[name="name"]').fill("Example applicant");
      await page.locator('[name="company"]').fill("Example organization");
      await page.locator('[name="email"]').fill("static-check@example.com");
      await page.locator('[name="scenario"]').selectOption({ index: 5 });
      await page.locator('[name="needs"]').fill("Evaluate work delivery, integrations and acceptance criteria.");
      await page.getByRole("checkbox").check();
      await submit.click();
      await page.getByRole("alert").filter({ hasText: locale === "en" ? "have not been sent" : "您的资料尚未发送" }).waitFor();
      assert.equal(await page.locator('[name="email"]').inputValue(), "static-check@example.com");
      report.enquiries.push({ locale, enterprise, unsent: true, draftRetained: true });
      if (enterprise) {
        const languageLink = page.getByRole("link", { name: switchName(locale), exact: true }).first();
        const target = new URL(await languageLink.getAttribute("href"), baseURL);
        assert.equal(target.searchParams.get("enquiry"), "enterprise");
        assert.equal(target.hash, "#main-content");
        await languageLink.click();
        await page.waitForURL(url => url.searchParams.get("enquiry") === "enterprise" && url.hash === "#main-content" && (locale === "en" ? url.pathname.startsWith("/zh/") : !url.pathname.startsWith("/zh/")));
        await page.getByRole("heading", { level: 1 }).filter({ hasText: locale === "en" ? "企业需求" : "Start with your needs" }).waitFor();
      }
    }

    await page.goto(route(locale, "/docs/deployment/"), { waitUntil: "networkidle" });
    await page.keyboard.press(process.platform === "darwin" ? "Meta+k" : "Control+k");
    await page.getByRole("combobox").fill(locale === "en" ? "persistent storage" : "持久化");
    await page.getByRole("option").first().waitFor();
    report.search.push({ locale, results: await page.getByRole("option").count() });
    await page.getByRole("combobox").press("ArrowDown");
    await page.getByRole("combobox").press("Enter");
    await page.waitForURL(url => url.pathname.startsWith(`${prefix}/docs/`) && url.hash.length > 1);
    const current = new URL(page.url());
    const hash = current.hash;
    const languageLink = page.getByRole("link", { name: switchName(locale), exact: true }).first();
    assert.equal(new URL(await languageLink.getAttribute("href"), baseURL).hash, hash);
    const [newTab] = await Promise.all([
      page.context().waitForEvent("page"),
      languageLink.click({ button: "middle" }),
    ]);
    await newTab.waitForLoadState("load");
    assert.equal(new URL(newTab.url()).hash, hash);
    await newTab.close();
    await languageLink.click();
    await page.waitForURL(url => url.hash === hash && (locale === "en" ? url.pathname.startsWith("/zh/docs/") : url.pathname.startsWith("/docs/")));
    assert.equal(await page.locator("html").getAttribute("lang"), locale === "en" ? "zh-CN" : "en");
    assert(await page.evaluate(id => !!document.getElementById(decodeURIComponent(id.slice(1))), hash), "切换后对应章节应存在");
    await page.goto(route(locale, "/docs/"), { waitUntil: "networkidle" });
    await page.keyboard.press(process.platform === "darwin" ? "Meta+k" : "Control+k");
    await page.getByRole("combobox").fill("purplewhaleunfindablexyz");
    await page.getByText(locale === "en" ? "No results found" : "未找到相关内容", { exact: true }).waitFor();
    assert.equal(await page.getByRole("option").count(), 0);
    await page.keyboard.press("Escape");

    for (const pathname of ["/", "/pricing/", "/poc/", "/product/employees/", "/docs/deployment/"]) {
      await page.goto(route(locale, pathname), { waitUntil: "networkidle" });
      for (const width of [320, 390, 768, 1100, 1280, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(() => document.fonts.ready);
        const dimensions = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth }));
        assert.equal(dimensions.document, dimensions.width, `${locale}${pathname} ${width}`);
        if (pathname === "/") {
          const bounds = await page.locator("header").first().evaluate(header => [...header.querySelectorAll('a, button')].filter(el => el.getClientRects().length).map(el => ({ text: el.textContent, left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right })));
          assert(bounds.every(box => box.left >= 0 && box.right <= width), `页头控件裁切：${locale} ${width} ${JSON.stringify(bounds)}`);
        }
        report.viewports.push({ locale, pathname, width });
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
    report.locales.push({ locale, publicRoutes: routes.length, docs: docs.length });
    console.log(`${locale}: ${routes.length}条路由、搜索、询价、切换与布局通过`);
  }
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  report.defaultEnglish = true;
}
