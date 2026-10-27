const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const portable = require('./browser.cjs');
portable.trackIdentity('site');

const base = new URL(portable.url);
assert(base.pathname.endsWith('/') && !base.search && !base.hash, 'PREVIEW_URL must be the site root, ending with /');
const redOnly = process.argv.includes('--red-only');
const evidence = portable.evidence;
const imageDirectory = path.join(evidence, 'site');

// 预期路由独立维护，不读取页面注册表，避免错误注册表和测试一起自证。
const routes = [
  { route: '', name: 'home', group: null, phrases: [/工作/, /方法|能力/] },
  { route: 'product/', name: 'product', group: '产品', phrases: [/工作/, /方法/, /使用|投入/] },
  { route: 'product/work-delivery/', name: 'work-delivery', group: '产品', phrases: [/交付/, /确认|验收|审阅/, /产物|结果/] },
  { route: 'product/methods/', name: 'methods', group: '产品', phrases: [/方法/, /来源/, /确认|审核|审阅/] },
  { route: 'product/governance/', name: 'governance', group: '产品', phrases: [/Token|用量|运行/, /估算|费用/, /账单/] },
  { route: 'product/architecture/', name: 'architecture', group: '产品', phrases: [/部署|执行/, /模型|工具/, /授权|边界/] },
  { route: 'solutions/', name: 'solutions', group: '解决方案', phrases: [/研发/, /复用/, /采用|接入/] },
  { route: 'solutions/engineering/', name: 'engineering', group: '解决方案', phrases: [/需求/, /检查|验收/, /产物|交付/] },
  { route: 'solutions/team-reuse/', name: 'team-reuse', group: '解决方案', phrases: [/来源/, /方法/, /确认|审核|审阅/] },
  { route: 'solutions/enterprise-adoption/', name: 'enterprise-adoption', group: '解决方案', phrases: [/授权|权限/, /模型|接入/, /投入|费用|用量/] },
  { route: 'security/', name: 'security', group: null, phrases: [/授权|权限/, /部署|数据/, /外发|外部/] },
  { route: 'resources/', name: 'resources', group: '资源', phrases: [/文档/, /部署/, /工作方式|工作如何/] },
  { route: 'resources/how-it-works/', name: 'how-it-works', group: '资源', phrases: [/工作/, /交付/, /方法/, /确认/] },
];
const expectedTitles = {
  home: '让 AI 完成工作，让能力留在企业', product: '产品总览', 'work-delivery': '工作交付', methods: '方法复用', governance: '使用治理', architecture: '企业架构',
  solutions: '解决方案', engineering: '研发任务交付方案', 'team-reuse': '团队方法复用方案', 'enterprise-adoption': '企业 AI 采用方案', security: '安全与责任边界', resources: '资源中心', 'how-it-works': '工作方式与完整案例',
};
const groups = [
  { label: '产品', links: [['产品总览', 'product/'], ['完成工作', 'product/work-delivery/'], ['保留方法', 'product/methods/'], ['使用与投入', 'product/governance/'], ['企业架构', 'product/architecture/']] },
  { label: '解决方案', links: [['解决方案总览', 'solutions/'], ['研发任务交付', 'solutions/engineering/'], ['团队方法复用', 'solutions/team-reuse/'], ['企业 AI 采用', 'solutions/enterprise-adoption/']] },
  { label: '资源', links: [['资源总览', 'resources/'], ['工作方式', 'resources/how-it-works/'], ['产品文档', `${portable.siteBasePath}/zh/docs/`], ['部署指南', `${portable.siteBasePath}/zh/docs/getting-started/deployment/`]] },
];
const families = ['product/', 'solutions/engineering/', 'security/', 'resources/how-it-works/'];
const noJsFamilies = ['product/work-delivery/', 'solutions/engineering/', 'security/', 'resources/', 'resources/how-it-works/'];
const expectedPaths = new Set(routes.map(item => new URL(item.route, base).pathname));
const productManifest = JSON.parse(fs.readFileSync(path.join(portable.referenceRoot, 'manifest.json')));
const productImages = new Set(Object.values(productManifest.images).map(image => image.path).map(file => new URL(portable.referencePath + file, base).pathname));
const pages = new Map();
const resources = new Set();
const documents = new Set();
const graph = [];
const rows = [];
const failures = [];
const diagnostics = [];
const screenshots = [];
const noScriptPages = new WeakSet();
const traffic = { requests: 0, responses: 0, consoleMessages: 0, consoleErrors: 0, pageErrors: 0, requestFailures: 0, httpErrors: 0, apiChecks: 0 };
let assertions = 0;
let browser;

function check(value, message) { assertions += 1; assert(value, message); }
function equal(value, expected, message) { assertions += 1; assert.deepEqual(value, expected, message); }
function siteUrl(route = '') { return new URL(route, base).href; }
function compact(text) { return text.replace(/\s+/g, ''); }
function routeFor(route) { return routes.find(item => item.route === route); }
function labelPattern(label) { return new RegExp(label.trim().split(/\s+/).join('\\s*')); }
const frames = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));

function groupFor(page, label) {
  return page.locator('#navigation details.nav-group').filter({ has: page.locator('summary', { hasText: new RegExp(`^\\s*${label}\\s*$`) }) });
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  if (!noScriptPages.has(page)) await frames(page);
  // 只等待当前可见图片；未滚动的 lazy 图片不应成为等待死锁。
  await page.waitForFunction(() => [...document.images].filter(image => {
    const box = image.getBoundingClientRect();
    const style = getComputedStyle(image);
    return box.bottom > 0 && box.top < innerHeight && box.right > 0 && box.left < innerWidth && box.width > 0 && box.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
  }).every(image => image.complete && image.naturalWidth > 0), undefined, { polling: 100 });
}

async function goto(page, route = '') {
  const response = await page.goto(siteUrl(route), { waitUntil: 'load' });
  equal(response?.status(), 200, `${route || '/'} direct entry returns 200`);
  equal(page.url(), siteUrl(route), `${route || '/'} stays on its canonical own URL`);
  await settle(page);
  return response;
}

async function runCase(label, options, body) {
  let context;
  let page;
  const issues = [];
  const pending = new Set();
  const start = assertions;
  let requests = 0;
  let responses = 0;
  let status = 'passed';
  try {
    context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce', ...options });
    context.on('request', request => { traffic.requests += 1; requests += 1; pending.add(request); });
    context.on('requestfinished', request => pending.delete(request));
    context.on('requestfailed', request => {
      pending.delete(request);
      traffic.requestFailures += 1;
      if (!require('./transport.cjs').recordExpectedFailure(request)) issues.push({ type: 'requestfailed', url: request.url(), failure: request.failure() });
    });
    context.on('response', response => {
      traffic.responses += 1;
      responses += 1;
      if (response.status() >= 400) {
        traffic.httpErrors += 1;
        issues.push({ type: 'http', status: response.status(), url: response.url() });
      }
    });
    context.on('page', current => {
      current.on('console', message => {
        traffic.consoleMessages += 1;
        if (message.type() === 'error' || (message.type() === 'warning' && /hydrat|mismatch|server.rendered/i.test(message.text()))) {
          traffic.consoleErrors += 1;
          issues.push({ type: 'console', level: message.type(), text: message.text(), location: message.location() });
        }
      });
      current.on('pageerror', error => { traffic.pageErrors += 1; issues.push({ type: 'pageerror', message: error.message }); });
    });
    page = await context.newPage();
    if (options.javaScriptEnabled === false) noScriptPages.add(page);
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(30000);
    await body(page, context, () => requests);
    // 捕获晚到的浏览器错误；不在关闭 context 后把主动取消请求算作成功。
    await page.waitForLoadState('networkidle');
    equal(issues, [], `${label}: no console/page/request/HTTP errors`);
    console.log(`PASS ${label} (${assertions - start} assertions)`);
  } catch (error) {
    status = 'failed';
    failures.push({ label, message: error.message, stack: error.stack });
    diagnostics.push({ label, url: page?.url(), pending: [...pending].map(request => request.url()), issues, layout: page ? await layoutSnapshot(page).catch(error => ({ unavailable: error.message })) : null });
    console.error(`FAIL ${label}: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (context) await context.close().catch(error => {
      status = 'failed';
      failures.push({ label, phase: 'context.close', message: error.message });
      process.exitCode = 1;
    });
    if (status === 'passed' && issues.length) {
      status = 'failed';
      failures.push({ label, phase: 'late-browser-errors', message: 'Browser errors arrived while closing the case', issues });
      process.exitCode = 1;
    }
    rows.push({ label, status, assertions: assertions - start, requests, responses, issues });
  }
}

async function screenshot(page, name) {
  await settle(page);
  await page.mouse.move(page.viewportSize().width - 1, 1);
  const file = path.join(imageDirectory, `${name}.png`);
  await page.screenshot({ path: file });
  screenshots.push(file);
}

async function layoutSnapshot(page) {
  return page.evaluate(() => {
    const visible = element => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return box.width > 0 && box.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const box = element => {
      const value = element.getBoundingClientRect();
      return { x: value.x, y: value.y, width: value.width, height: value.height, right: value.right, bottom: value.bottom };
    };
    return {
      width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth,
      header: document.querySelector('.masthead') ? box(document.querySelector('.masthead')) : null,
      h1: document.querySelector('main h1') ? box(document.querySelector('main h1')) : null,
      overflow: [...document.querySelectorAll('main *, .masthead *, .footer *')].filter(element => {
        if (!visible(element) || element.closest('[inert], [aria-hidden="true"], dialog:not([open])')) return false;
        const rect = element.getBoundingClientRect();
        return rect.left < -2 || rect.right > innerWidth + 2;
      }).slice(0, 12).map(element => ({ tag: element.tagName, class: element.className, text: element.textContent.trim().slice(0, 90), box: box(element) })),
    };
  });
}

async function checkLayout(page, label) {
  const geometry = await layoutSnapshot(page);
  check(geometry.scrollWidth <= geometry.width + 1, `${label}: no document horizontal overflow (${geometry.scrollWidth}/${geometry.width})`);
  check(geometry.h1 && geometry.h1.width > 0 && geometry.h1.height > 0, `${label}: visible real H1`);
  check(geometry.h1.x >= -1 && geometry.h1.right <= geometry.width + 1, `${label}: H1 fits viewport`);
  check(geometry.header && geometry.header.width <= geometry.width + 1, `${label}: header fits viewport`);
  if (geometry.width <= 700) {
    check(await page.locator('.menu-toggle').isVisible(), `${label}: compact navigation has an accessible menu toggle`);
    equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false', `${label}: compact menu starts closed`);
    check(await page.locator('.masthead [data-contact]').isVisible(), `${label}: demo action remains visible`);
    const overlap = await page.evaluate(() => {
      const selectors = ['.masthead .brand', '.menu-toggle', '.masthead [data-contact]'];
      const boxes = selectors.map(selector => document.querySelector(selector).getBoundingClientRect());
      return boxes.some((a, index) => boxes.slice(index + 1).some(b => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1));
    });
    check(!overlap, `${label}: brand, demo action and menu do not overlap`);
  }
}

async function openMenu(page, label) {
  const toggle = page.locator('.menu-toggle');
  if (await toggle.isVisible() && await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
  const group = groupFor(page, label);
  equal(await group.count(), 1, `${label}: one native details navigation group`);
  if (!await group.evaluate(element => element.open)) await group.locator('summary').click();
  check(await group.evaluate(element => element.open), `${label}: dropdown opens`);
  return group;
}

async function clickAndArrive(page, link, target) {
  await Promise.all([page.waitForURL(target, { waitUntil: 'load' }), link.click()]);
  equal(page.url(), target, `Click arrives at ${target}, not an old homepage hash`);
  const response = await page.request.get(target);
  equal(response.status(), 200, `Destination has a real static document: ${target}`);
  await settle(page);
}

async function checkHeader(page, item) {
  equal(await page.locator('.masthead .brand').getAttribute('href'), base.pathname, `${item.name}: header brand returns to site root`);
  equal(await page.locator('.masthead .brand').getAttribute('aria-label'), 'SkyMythos 首页', 'Brand accessible name is unchanged');
  equal(await page.locator('#navigation .nav-group').count(), 3, 'Three native product, solutions and resources groups');
  for (const definition of groups) {
    const group = groupFor(page, definition.label);
    equal(await group.count(), 1, `${item.name}: ${definition.label} is a native details group`);
    const links = await group.locator('a').evaluateAll(links => links.map(link => ({ label: (link.querySelector('strong') || link).textContent, href: link.getAttribute('href') })));
    equal(links.length, definition.links.length, `${definition.label}: complete intended destinations without stale extras`);
    for (const [label, route] of definition.links) {
      const matches = links.filter(link => compact(link.label) === compact(label));
      equal(matches.length, 1, `${definition.label}: ${label} occurs exactly once`);
      equal(matches[0].href, new URL(route, base).pathname, `${label}: own real destination`);
    }
  }
  const activeGroups = await page.locator('#navigation .nav-group[data-active="true"] > summary').allTextContents();
  equal(activeGroups.map(text => text.trim()), item.group ? [item.group] : [], `${item.name}: correct active navigation group`);
  const current = await page.locator('#navigation a[aria-current="page"]').evaluateAll(links => links.map(link => link.getAttribute('href')));
  equal(current, item.route ? [sitePath(item.route)] : [], `${item.name}: exactly one matching current inner route, none on home`);
  const security = page.locator('#navigation > a').filter({ hasText: /^\s*安全\s*$/ });
  equal(await security.count(), 1, 'Security is a direct navigation link');
  equal(await security.getAttribute('href'), sitePath('security/'), 'Security has its own page');
  equal(await security.getAttribute('aria-current'), item.route === 'security/' ? 'page' : null, 'Security current state is route-specific');
  for (const [label, route] of [['产品', 'product/'], ['解决方案', 'solutions/'], ['安全', 'security/'], ['资源', 'resources/']]) {
    const link = page.locator('.footer nav a').filter({ hasText: new RegExp(`^\\s*${label}\\s*$`) });
    equal(await link.count(), 1, `Footer has one ${label} category`);
    equal(await link.getAttribute('href'), sitePath(route), `Footer ${label} points to its own hub`);
  }
  equal(await page.locator('#contact-dialog').count(), 1, `${item.name}: common contact dialog exists`);
  equal(await page.locator('#image-dialog').count(), 1, `${item.name}: common image dialog exists`);
}

function sitePath(route) { return new URL(route, base).pathname; }

async function inspectPage(page, item, response) {
  // Playwright's role selector includes inert shadow descendants; inspect Chromium's real AX tree instead.
  const session = await page.context().newCDPSession(page);
  let accessible;
  try {
    await session.send('Accessibility.enable');
    accessible = (await session.send('Accessibility.getFullAXTree')).nodes.filter(node => !node.ignored);
  } finally { await session.detach(); }
  equal(accessible.filter(node => node.role?.value === 'main').length, 1, `${item.name}: one accessible document main landmark`);
  equal(accessible.filter(node => node.role?.value === 'heading' && node.properties?.some(property => property.name === 'level' && property.value.value === 1)).length, 1, `${item.name}: exactly one accessible document H1`);
  const data = await page.evaluate(() => {
    const main = document.querySelector('main');
    const content = main.cloneNode(true);
    content.querySelectorAll('.breadcrumb, .contact, script, style').forEach(element => element.remove());
    return {
      title: document.title.trim(), description: document.querySelector('meta[name="description"]')?.content.trim(),
      h1: document.querySelector('h1').textContent.trim(), body: content.textContent.replace(/\s+/g, ' ').trim(),
      html: content.innerHTML, links: [...document.querySelectorAll('a[href]')].map(link => ({ href: link.getAttribute('href'), label: link.textContent.trim() })),
      assets: [...document.querySelectorAll('script[src], link[rel="stylesheet"][href], link[rel="icon"][href], img[src], source[src], a[data-zoom][href]:not(.capability-zoom)')].map(element => element.getAttribute('src') || element.getAttribute('href')),
      srcsets: [...document.querySelectorAll('[srcset]')].flatMap(element => element.getAttribute('srcset').split(',').map(candidate => candidate.trim().split(/\s+/)[0])),
      figureZoomCount: main.querySelectorAll('.page-figure a[data-zoom]').length,
    };
  });
  equal(data.title, expectedTitles[item.name], `${item.name}: exact intended document title`);
  check(data.description?.length > 20, `${item.name}: meaningful meta description`);
  check(data.h1.length > 3, `${item.name}: meaningful H1`);
  check(data.body.length > 180, `${item.name}: substantial independent main body`);
  for (const phrase of item.phrases) check(phrase.test(data.body), `${item.name}: core subject ${phrase} appears in main body`);
  const raw = await response.text();
  check(/<main(?:\s|>)/i.test(raw) && /<h1(?:\s|>)/i.test(raw), `${item.name}: real main and H1 are delivered in server HTML`);
  const { serverTitle, serverDescription, serverH1, serverMain: rawMain } = await page.evaluate(html => {
    const document = new DOMParser().parseFromString(html, 'text/html');
    return {
      serverTitle: document.title.trim(), serverDescription: document.querySelector('meta[name="description"]')?.content.trim(),
      serverH1: document.querySelector('main h1')?.textContent.trim(), serverMain: document.querySelector('main')?.innerHTML || '',
    };
  }, raw);
  equal(serverTitle, expectedTitles[item.name], `${item.name}: exact intended title is server-rendered`);
  equal(data.title, serverTitle, `${item.name}: hydrated and server-rendered titles agree`);
  check(serverDescription?.length > 20 && serverH1?.length > 3, `${item.name}: meaningful description and H1 are server-rendered`);
  check(rawMain.length > 300, `${item.name}: server HTML contains body, not a JavaScript-only placeholder`);
  for (const phrase of item.phrases) check(phrase.test(rawMain), `${item.name}: core content exists before JavaScript`);
  const isHome = item.route === '';
  equal(await page.locator('#product').count(), isHome ? 1 : 0, `${item.name}: no fake hidden homepage product root on inner pages`);
  equal(await page.locator('[data-tab]').count(), isHome ? 3 : 0, `${item.name}: capability tabs only exist on home`);
  if (isHome) {
    equal(await page.locator('[data-tab]').evaluateAll(links => links.map(link => ({ tag: link.tagName, href: link.getAttribute('href') }))), [
      { tag: 'A', href: '#panel-delivery' }, { tag: 'A', href: '#panel-methods' }, { tag: 'A', href: '#panel-management' },
    ], 'Home capabilities retain local native anchors; only global navigation becomes multipage');
  }
  equal(await page.locator('.capability-track').count(), isHome ? 1 : 0, `${item.name}: capability controller is scoped to home`);
  equal(await page.locator('[data-lifecycle="b"]').count(), isHome || item.route === 'resources/how-it-works/' ? 1 : 0, `${item.name}: lifecycle mounts only on its two intended pages`);
  const breadcrumb = page.locator('.breadcrumb');
  equal(await breadcrumb.count(), isHome ? 0 : 1, `${item.name}: breadcrumbs exist only on inner pages`);
  if (!isHome) {
    check(await breadcrumb.evaluate(element => element.tagName === 'NAV' || !!element.querySelector('nav')), `${item.name}: breadcrumb is a navigation landmark`);
    equal(await breadcrumb.locator('a').first().getAttribute('href'), base.pathname, `${item.name}: breadcrumb can return home`);
    check(await breadcrumb.isVisible(), `${item.name}: breadcrumb is not a hidden generated placeholder`);
    equal(await page.locator('main .hero-stage, main .capability-browser, main .product-tabs').count(), 0, `${item.name}: inner body is not a hidden or copied homepage`);
  }
  for (const asset of [...data.assets, ...data.srcsets]) {
    check(asset.startsWith('/') && !asset.startsWith('//'), `${item.name}: asset is root-absolute (${asset})`);
    resources.add(new URL(asset, base).href);
  }
  for (const link of data.links) {
    check(/^(\/|#|https?:|mailto:|tel:)/.test(link.href), `${item.name}: link is absolute or a deliberate local anchor (${link.href})`);
    const target = new URL(link.href, page.url());
    if (target.origin !== base.origin || !['http:', 'https:'].includes(target.protocol)) continue;
    const documentUrl = new URL(target);
    documentUrl.hash = '';
    if (productImages.has(target.pathname)) {
      resources.add(documentUrl.href);
      continue;
    }
    documents.add(documentUrl.href);
    if (target.pathname.startsWith(base.pathname) && !target.pathname.startsWith(`${base.pathname}docs/`)) {
      check(expectedPaths.has(target.pathname), `${item.name}: no unknown/fabricated marketing route ${target.pathname}`);
      graph.push({ from: sitePath(item.route), to: target.pathname, hash: target.hash, label: link.label });
    }
    if (target.hash && target.pathname === new URL(page.url()).pathname) {
      const id = decodeURIComponent(target.hash.slice(1));
      check(await page.evaluate(id => !!document.getElementById(id), id), `${item.name}: local anchor #${id} really exists`);
    }
  }
  await checkHeader(page, item);
  pages.set(item.route, { route: item.route, name: item.name, title: data.title, description: data.description, h1: data.h1, serverTitle, serverDescription, serverH1, body: data.body, mainLength: data.body.length, assets: data.assets.length + data.srcsets.length, figureZoomCount: data.figureZoomCount });
}

async function checkUniqueness() {
  equal(pages.size, routes.length, 'All 13 expected independent pages were inspected');
  for (const field of ['title', 'description', 'h1', 'body', 'serverTitle', 'serverDescription', 'serverH1']) {
    const values = [...pages.values()].map(item => compact(item[field]));
    equal(new Set(values).size, routes.length, `Every page has unique ${field}`);
  }
  const reachable = new Set([base.pathname]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const edge of graph) if (reachable.has(edge.from) && !reachable.has(edge.to)) { reachable.add(edge.to); changed = true; }
  }
  equal([...reachable].sort(), [...expectedPaths].sort(), 'Every expected route is reachable from the genuine site link graph');
  const home = pages.get('');
  check([...pages.values()].filter(item => item.route && item.figureZoomCount > 0).length >= 4, 'Real product image zoom is available across multiple independent inner pages');
  for (const item of [...pages.values()].filter(item => item.route)) {
    check(item.body !== home.body && !item.body.includes(home.body), `${item.name}: main body is not the homepage transplanted below a new heading`);
  }
}

async function checkedGet(context, url) {
  const response = await context.request.get(url);
  traffic.apiChecks += 1;
  if (response.status() >= 400) traffic.httpErrors += 1;
  equal(response.status(), 200, `Resource/document returns 200: ${url}`);
  equal(response.url(), url, `Resource/document does not silently redirect: ${url}`);
  return response;
}

async function keyboardNavigation(page, mobile) {
  await goto(page, 'product/work-delivery/');
  const toggle = page.locator('.menu-toggle');
  if (mobile) {
    await toggle.focus();
    await page.keyboard.press('Enter');
    equal(await toggle.getAttribute('aria-expanded'), 'true', 'Keyboard opens compact navigation');
  }
  const group = groupFor(page, '产品');
  const summary = group.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  check(await group.evaluate(element => element.open), 'Keyboard Enter opens native product details');
  await page.keyboard.press('Tab');
  check(await group.locator('a').first().evaluate(element => element === document.activeElement), 'Tab enters the first real destination');
  await page.keyboard.press('Escape');
  check(!await group.evaluate(element => element.open), 'Escape closes the open dropdown');
  check(await summary.evaluate(element => element === document.activeElement), 'Escape returns focus to the dropdown trigger');
  if (mobile) {
    await page.keyboard.press('Escape');
    equal(await toggle.getAttribute('aria-expanded'), 'false', 'Second Escape closes compact navigation');
    check(await toggle.evaluate(element => element === document.activeElement), 'Compact navigation returns focus to menu toggle');
    await page.keyboard.press('Enter');
    await summary.focus();
  }
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await Promise.all([page.waitForURL(siteUrl('product/'), { waitUntil: 'load' }), page.keyboard.press('Enter')]);
  equal(page.url(), siteUrl('product/'), 'Keyboard menu link goes to product overview, not homepage anchor');
  await settle(page);
}

async function storageSnapshot(page, context) {
  return {
    url: page.url(), cookies: await context.cookies(),
    storage: await page.evaluate(() => ({ local: Object.entries(localStorage).sort(), session: Object.entries(sessionStorage).sort(), cookie: document.cookie })),
  };
}

async function contactFlow(page, context, requestCount) {
  await goto(page, 'solutions/engineering/');
  await page.waitForLoadState('networkidle');
  const before = await storageSnapshot(page, context);
  const count = requestCount();
  const trigger = page.locator('.masthead [data-contact]');
  await trigger.click();
  const dialog = page.locator('#contact-dialog');
  check(await dialog.evaluate(element => element instanceof HTMLDialogElement && element.open && element.matches(':modal')), 'Inner-page CTA opens a native modal dialog');
  await dialog.locator('#company').fill('回归测试企业 <虚构>');
  await dialog.locator('#email').fill('site-regression@example.com');
  await dialog.locator('#interest').selectOption({ label: '团队知识与方法复用' });
  await dialog.locator('#goal').fill('虚构验证：从需求到审阅，再保留经人确认的方法。');
  await dialog.locator('button[type="submit"]').click();
  check(await dialog.locator('#contact-result').isVisible(), 'Submission shows local preview');
  equal(await dialog.locator('[data-result="company"]').textContent(), '回归测试企业 <虚构>', 'Preview preserves fictional text safely');
  equal(await dialog.locator('[data-result="email"]').textContent(), 'site-regression@example.com', 'Preview shows fictional email');
  check(/未发送|尚未发送/.test(await dialog.locator('#contact-result').innerText()), 'Preview explicitly says nothing was sent');
  equal(await storageSnapshot(page, context), before, 'Preview writes no local/session storage, cookies, or URL values');
  await dialog.locator('#edit-contact').click();
  equal(await dialog.locator('#company').inputValue(), '回归测试企业 <虚构>', 'Edit keeps current in-memory input');
  await dialog.locator('#company').fill('回归测试企业（修改，虚构）');
  await dialog.locator('button[type="submit"]').click();
  equal(await dialog.locator('[data-result="company"]').textContent(), '回归测试企业（修改，虚构）', 'Edited preview updates without sending');
  await page.keyboard.press('Escape');
  check(!await dialog.evaluate(element => element.open), 'Escape closes contact preview');
  check(await trigger.evaluate(element => element === document.activeElement), 'Contact close restores its inner-page trigger focus');
  await trigger.click();
  for (const selector of ['#company', '#email', '#goal']) equal(await dialog.locator(selector).inputValue(), '', `${selector}: closing clears entered information`);
  equal(await dialog.locator('#interest').evaluate(element => element.selectedIndex), 0, 'Closing resets selected interest');
  check(await dialog.locator('#contact-form').isVisible(), 'Reopen returns to empty form');
  check(!await dialog.locator('#contact-result').isVisible(), 'Reopen does not reveal previous preview');
  equal(await dialog.locator('[data-result]').allTextContents(), ['', '', '', ''], 'Closing clears preview text as well as form values');
  await dialog.locator('[data-close]').click();
  await frames(page);
  equal(requestCount(), count, 'Entire contact fill/preview/edit/close/reset flow creates zero additional requests');
  equal(await storageSnapshot(page, context), before, 'Entire contact flow leaves URL, cookies, local and session storage unchanged');
  diagnostics.push({ label: 'contact-no-send', requestsBefore: count, requestsAfter: requestCount(), additionalRequests: requestCount() - count, storageUnchanged: true });
}

async function innerZoom(page) {
  await goto(page, 'product/work-delivery/');
  const trigger = page.locator('.page-figure a[data-zoom]').first();
  check(await trigger.count() > 0, 'Inner delivery page has a real product image zoom trigger');
  await trigger.scrollIntoViewIfNeeded();
  await settle(page);
  const href = await trigger.getAttribute('href');
  check(productImages.has(new URL(href, base).pathname), 'Inner zoom points to an exact current product manifest image');
  const before = page.url();
  await trigger.click();
  const dialog = page.locator('#image-dialog');
  check(await dialog.evaluate(element => element instanceof HTMLDialogElement && element.open && element.matches(':modal')), 'Inner image opens native modal');
  await page.waitForFunction(() => {
    const image = document.querySelector('#zoom-image');
    return image.complete && image.naturalWidth > 0;
  });
  equal(await page.locator('#image-original').getAttribute('href'), new URL(href, base).href, 'Image original link matches the inner-page asset');
  equal(await page.locator('#zoom-image').getAttribute('src'), new URL(href, base).href, 'Modal image loads that same real asset');
  check((await page.locator('#zoom-image').getAttribute('alt')).length > 5, 'Inner image retains meaningful alternative text');
  await page.keyboard.press('Escape');
  check(!await dialog.evaluate(element => element.open), 'Escape closes inner image dialog');
  check(await trigger.evaluate(element => element === document.activeElement), 'Image close restores focus to original inner-page trigger');
  equal(page.url(), before, 'Image zoom does not change route/hash');
}

async function main() {
  fs.mkdirSync(imageDirectory, { recursive: true });
  try {
    browser = await portable.launch();
    if (redOnly) {
      await runCase('red-only-real-product-navigation', {}, async page => {
        await goto(page);
        const group = await openMenu(page, '产品');
        const link = group.locator('a').filter({ hasText: /产品总览/ });
        // 旧版会在这里以 #product 失败；不等待一个根本不会发生的导航超时。
        await link.click();
        await page.waitForLoadState('load');
        equal(page.url(), siteUrl('product/'), '产品总览 must navigate to its own page, never the old homepage #product');
      });
      return;
    }

    for (const item of routes) {
      await runCase(`direct-desktop-${item.name}`, {}, async page => {
        const response = await goto(page, item.route);
        await inspectPage(page, item, response);
        await checkLayout(page, item.name);
        if (['home', 'product', 'engineering', 'security', 'how-it-works'].includes(item.name)) await screenshot(page, `desktop-${item.name}`);
        const reload = await page.reload({ waitUntil: 'load' });
        equal(reload?.status(), 200, `${item.name}: deep-entry reload returns 200`);
        equal(page.url(), siteUrl(item.route), `${item.name}: reload preserves own URL`);
        await settle(page);
        equal(await page.evaluate(() => document.querySelector('main h1').textContent.trim()), pages.get(item.route).h1, `${item.name}: reload preserves independent H1`);
      });
    }

    await runCase('independent-content-and-complete-resource-graph', {}, async (page, context) => {
      await goto(page);
      await checkUniqueness();
      const urls = new Set([...resources, ...documents, ...routes.map(item => siteUrl(item.route)), new URL(`${portable.siteBasePath}/zh/docs/`, base).href, new URL(`${portable.siteBasePath}/zh/docs/getting-started/deployment/`, base).href]);
      for (const url of urls) await checkedGet(context, url);
      const crossHashes = new Map();
      for (const edge of graph.filter(edge => edge.hash)) crossHashes.set(`${edge.to}${edge.hash}`, edge);
      for (const edge of crossHashes.values()) {
        const response = await checkedGet(context, new URL(edge.to, base).href);
        const html = await response.text();
        const id = decodeURIComponent(edge.hash.slice(1)).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // capability-layer IDs are replaced at runtime with real anchor markers by the home controller.
        const runtimeCapability = edge.to === base.pathname && /^#panel-(delivery|methods|management)$/.test(edge.hash);
        check(runtimeCapability || new RegExp(`\\bid=["']${id}["']`).test(html), `Graph fragment has a real server-rendered destination: ${edge.to}${edge.hash}`);
      }
      diagnostics.push({ label: 'resource-graph', routeCount: routes.length, graphEdges: graph.length, assetCount: resources.size, checkedUrls: urls.size });
    });

    await runCase('real-header-footer-hero-and-history-navigation', {}, async page => {
      await goto(page);
      const heroLink = page.locator('.hero a').filter({ hasText: /了解产品/ });
      equal(await heroLink.count(), 1, 'Home hero has one next-step product CTA');
      equal(await heroLink.getAttribute('href'), sitePath('product/'), 'Home hero next step points to product page');
      await clickAndArrive(page, heroLink, siteUrl('product/'));
      await page.goBack({ waitUntil: 'load' });
      equal(page.url(), siteUrl(), 'Browser back returns from product to home');
      await settle(page);
      for (const definition of groups) {
        for (const [label, route] of definition.links.filter(([, route]) => !route.startsWith('/'))) {
          const group = await openMenu(page, definition.label);
          const link = group.locator('a').filter({ has: page.locator('strong', { hasText: labelPattern(label) }) });
          await clickAndArrive(page, link, siteUrl(route));
          await page.goBack({ waitUntil: 'load' });
          equal(page.url(), siteUrl(), `Back from ${label} restores home`);
          await settle(page);
        }
      }
      await clickAndArrive(page, page.locator('#navigation > a').filter({ hasText: /^\s*安全\s*$/ }), siteUrl('security/'));
      await clickAndArrive(page, page.locator('.masthead .brand'), siteUrl());
      for (const [label, route] of [['产品', 'product/'], ['解决方案', 'solutions/'], ['安全', 'security/'], ['资源', 'resources/']]) {
        await clickAndArrive(page, page.locator('.footer nav a').filter({ hasText: new RegExp(`^\\s*${label}\\s*$`) }), siteUrl(route));
        await clickAndArrive(page, page.locator('.masthead .brand'), siteUrl());
      }
      await goto(page, 'product/work-delivery/');
      const parentLink = page.locator(`.breadcrumb a[href="${sitePath('product/')}"]`);
      equal(await parentLink.count(), 1, 'Nested breadcrumb exposes product parent');
      await clickAndArrive(page, parentLink, siteUrl('product/'));
      await clickAndArrive(page, page.locator('.breadcrumb a').first(), siteUrl());
      const dropdown = await openMenu(page, '产品');
      await screenshot(page, 'desktop-header-dropdown');
      check(await dropdown.isVisible(), 'Screenshot records a genuine expanded header dropdown');
    });

    for (const viewport of [{ width: 1280, height: 720 }, { width: 390, height: 844 }, { width: 320, height: 568 }]) {
      for (const route of families) {
        const item = routeFor(route);
        await runCase(`responsive-${viewport.width}-${item.name}`, { viewport }, async page => {
          await goto(page, route);
          await checkLayout(page, `${viewport.width}/${item.name}`);
          if (viewport.width === 390) await screenshot(page, `mobile-${item.name}`);
          if (viewport.width <= 700) {
            const group = await openMenu(page, '产品');
            check(await group.locator('a').first().isVisible(), 'Compact dropdown destination is visible');
            const bounds = await group.locator('.nav-panel').boundingBox();
            check(bounds && bounds.x >= -1 && bounds.x + bounds.width <= viewport.width + 1, 'Compact dropdown fits narrow viewport');
            await page.keyboard.press('Escape');
            await page.keyboard.press('Escape');
          }
          await page.locator('.footer').scrollIntoViewIfNeeded();
          await settle(page);
          check((await layoutSnapshot(page)).scrollWidth <= viewport.width + 1, 'Bottom-of-page layout remains horizontally contained');
        });
      }
    }

    for (const viewport of [{ width: 1440, height: 1000 }, { width: 320, height: 568 }]) {
      for (const route of noJsFamilies) {
        const item = routeFor(route);
        await runCase(`nojs-${viewport.width}-${item.name}`, { viewport, javaScriptEnabled: false }, async page => {
          await goto(page, route);
          equal(await page.locator('#main > :not([inert]) h1, #main > h1').count(), 1, 'No-JS deep page has real H1');
          const body = await page.locator('main').innerText();
          for (const phrase of item.phrases) check(phrase.test(body), `No-JS ${item.name}: core content ${phrase} is visible`);
          check((await layoutSnapshot(page)).scrollWidth <= viewport.width + 1, 'No-JS layout is contained even at 320px');
          check(await page.locator('.breadcrumb').isVisible(), 'No-JS breadcrumb remains visible');
          const group = groupFor(page, '产品');
          await group.locator('summary').click();
          check(await group.locator('a').first().isVisible(), 'Native details navigation works without JavaScript');
          await clickAndArrive(page, group.locator('a').first(), siteUrl('product/'));
          check((await page.locator('main').innerText()).includes('方法'), 'No-JS destination has its own product body');
        });
      }
    }

    await runCase('client-home-entry-return-reentry-and-legacy-boundaries', {}, async page => {
      await goto(page, 'product/');
      const origin = await page.evaluate(() => performance.timeOrigin);
      for (let pass = 0; pass < 2; pass += 1) {
        await clickAndArrive(page, page.locator('.masthead .brand'), siteUrl());
        equal(await page.evaluate(() => performance.timeOrigin), origin, 'Home entry is a true Next client transition');
        await page.waitForFunction(() => [...document.querySelectorAll('[data-native-demo]')].length === 3 && [...document.querySelectorAll('[data-native-demo]')].every(root => root.shadowRoot?.querySelector('.product-reference-root[inert]')));
        await page.waitForFunction(() => document.querySelector('#product')?.dataset.capabilityMode != null);
        const session = await page.context().newCDPSession(page);
        const nodes = (await session.send('Accessibility.getFullAXTree')).nodes.filter(node => !node.ignored);
        await session.detach();
        equal(nodes.filter(node => node.role?.value === 'main').length, 1, 'Client home has one real accessible marketing main');
        equal(nodes.filter(node => node.role?.value === 'heading' && node.properties?.some(property => property.name === 'level' && property.value.value === 1)).length, 1, 'Client home has one real accessible marketing H1');
        await page.goBack({ waitUntil: 'load' });
        equal(page.url(), siteUrl('product/'), 'Back returns to the independent product route');
        await settle(page);
      }
      for (const outside of ['/en/', '/zh/docs/', '/zh/concept/']) {
        const response = await page.goto(new URL(portable.siteBasePath + outside, base).href, { waitUntil: 'load' });
        equal(response.status(), 200, `${outside}: real preserved external-family page`);
        equal(await page.locator('#commercial-site').count(), 0, `${outside}: commercial shell does not leak`);
        await page.goBack({ waitUntil: 'load' });
        equal(page.url(), siteUrl('product/'), 'Leaving a preserved page returns to the real commercial route');
        await settle(page);
      }
    });

    await runCase('keyboard-desktop-navigation-and-escape', {}, page => keyboardNavigation(page, false));
    await runCase('keyboard-compact-navigation-and-escape', { viewport: { width: 320, height: 568 } }, page => keyboardNavigation(page, true));
    await runCase('inner-contact-preview-no-send-edit-reset', {}, contactFlow);
    await runCase('inner-image-zoom-escape-focus', {}, innerZoom);
  } catch (error) {
    failures.push({ label: 'runner', message: error.message, stack: error.stack });
    process.exitCode = 1;
    console.error(error.stack);
  } finally {
    if (browser) await browser.close().catch(error => {
      failures.push({ label: 'browser.close', message: error.message });
      process.exitCode = 1;
    });
    const report = {
      url: base.href, mode: redOnly ? 'red-only' : 'full', generatedAt: new Date().toISOString(),
      status: failures.length || rows.some(row => row.status !== 'passed') ? 'failed' : 'passed',
      assertions, expectedRoutes: routes.map(item => sitePath(item.route)),
      completedCases: rows.length, passedCases: rows.filter(row => row.status === 'passed').length, failedCases: rows.filter(row => row.status === 'failed').length,
      traffic, rows, failures, diagnostics, pages: [...pages.values()].map(item => ({ ...item, body: undefined })), graph, screenshots,
      exclusions: ['Homepage capability motion, transitions and dynamic zoom stability remain owned by check-pinned.cjs; this script does not replace that suite.'],
      limitations: ['Bundled Chromium (or explicit configured browser) only; responsive viewport emulation is not physical touch-device or Safari/Firefox validation.', 'Browser back is verified without claiming BFCache restoration. Screenshots require human visual review.'],
    };
    fs.mkdirSync(evidence, { recursive: true });
    fs.writeFileSync(path.join(evidence, 'site.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(`${report.status.toUpperCase()}: ${report.passedCases}/${report.completedCases} cases, ${assertions} assertions; report ${path.join(evidence, 'site.json')}`);
    if (report.status !== 'passed') process.exitCode = 1;
  }
}

main().catch(error => { console.error(error.stack); process.exitCode = 1; });
