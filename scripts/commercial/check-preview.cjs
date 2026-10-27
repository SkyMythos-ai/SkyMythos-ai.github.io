const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const portable = require('./browser.cjs');
portable.trackIdentity('preview');
const { measureHero, assertHero } = require('./check-hero.cjs');
const url = portable.url;
const directory = portable.evidence;
const waitCurrent = (page, name) => page.waitForFunction(name => document.querySelector(`[data-tab="${name}"]`).getAttribute('aria-current') === 'location', name);
const originals = {
  delivery: { alt: '当前产品线程会话与交付信息的只读示例界面，结果仍需人工验收' },
  methods: { alt: '数字员工形成方案的产品界面，显示经验来源、职责与等待确认方案状态，尚未创建员工' },
  management: { alt: '当前产品连接与授权的分类清单及配置界面，不是费用分析图表' },
};
function readReferenceImage(name) {
  const root = portable.referenceRoot;
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  const file = manifest.images?.[name]?.path;
  assert(typeof file === 'string' && file.endsWith('.png'), `Missing current original PNG: ${name}`);
  const filename = path.resolve(root, file);
  assert(filename.startsWith(`${root}${path.sep}`), 'Reference PNG stays inside its published resource directory');
  const bytes = fs.readFileSync(filename);
  assert(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && bytes.toString('ascii', 12, 16) === 'IHDR', 'Current original is a real PNG');
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  assert(width > 0 && height > 0, 'Reference PNG has positive intrinsic dimensions');
  return { file, width, height, ratio: width / height, href: new URL(portable.referencePath + file, url).href };
}
async function decodeImage(page, selector) {
  await page.waitForFunction(selector => { const image = document.querySelector(selector); return image?.getAttribute('src') && image.complete && image.naturalWidth > 0; }, selector, { timeout: 8000 });
  await page.locator(selector).evaluate(image => image.decode());
}
async function assertOriginal(page, name) {
  await decodeImage(page, '#zoom-image');
  const target = originals[name];
  const image = await page.locator('#zoom-image').evaluate(image => ({ src: image.src, alt: image.alt, width: image.naturalWidth, height: image.naturalHeight, renderedWidth: image.getBoundingClientRect().width, renderedHeight: image.getBoundingClientRect().height }));
  assert.equal(image.src, target.href, 'Correct original raw PNG opens');
  assert.equal(image.alt, target.alt, 'Original alternative text remains exact');
  assert.equal(image.width, target.width);
  assert.equal(image.height, target.height);
  assert(Math.abs(image.renderedWidth / image.renderedHeight - target.width / target.height) < .01, 'Original modal preserves source proportions');
}
fs.mkdirSync(directory, { recursive: true });
(async () => {
  const browser = await portable.launch();
  const errors = [];
  const rows = [];
  try {
    Object.entries(originals).forEach(([name, item]) => Object.assign(item, readReferenceImage(name)));
    const workbench = readReferenceImage('workbench');
    for (const [width, height] of [[2560,1440],[1920,1080],[1440,1000],[1280,720],[1024,768],[901,900],[900,900],[768,1024],[701,900],[700,900],[601,900],[600,900],[599,900],[390,844],[320,568],[844,390]]) for (const scheme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width, height }, colorScheme: scheme, reducedMotion: 'reduce' });
      page.on('pageerror', error => errors.push(`${width}/${scheme}: ${error.message}`));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      const pending = new Set();
      const transfers = [];
      page.on('console', message => { if (message.type() === 'error') transfers.push({ type: 'console', text: message.text() }); });
      page.on('request', request => pending.add(request.url()));
      page.on('requestfinished', request => pending.delete(request.url()));
      page.on('requestfailed', request => { pending.delete(request.url()); if (!require('./transport.cjs').recordExpectedFailure(request)) transfers.push({ type: 'requestfailed', url: request.url(), failure: request.failure() }); });
      try { await page.goto(url, { waitUntil: 'load' }); }
      catch (error) { console.error('LOAD DIAGNOSTIC', { width, height, scheme, pending: [...pending], state: await page.evaluate(() => document.readyState).catch(() => 'unavailable') }); throw error; }
      await page.evaluate(() => document.fonts.ready);
      try {
        await decodeImage(page, '.hero-screen img');
        await page.waitForFunction(() => document.querySelector('.product-tabs [aria-current="location"]') !== null);
      } catch (error) {
        console.error('RESOURCE DIAGNOSTIC', JSON.stringify({ width, scheme, pending: [...pending], transfers, js: await page.evaluate(() => document.documentElement.classList.contains('js')) }));
        throw error;
      }
      const row = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const cta = document.querySelector('.hero .button').getBoundingClientRect();
        const title = h1.getBoundingClientRect();
        const life = document.querySelector('[data-lifecycle]');
        const screen = document.querySelector('.hero-screen img');
        const screenBox = screen.getBoundingClientRect();
        const introBox = document.querySelector('.hero-intro').getBoundingClientRect();
        const stageBox = document.querySelector('.hero-stage').getBoundingClientRect();
        const stage = { outerTop: stageBox.top, outerLeft: stageBox.left, outerWidth: stageBox.width, left: screenBox.left, introLeft: introBox.left, top: screenBox.top, width: screenBox.width, height: screenBox.height, naturalWidth: screen.naturalWidth, naturalHeight: screen.naturalHeight, introBottom: introBox.bottom, workflowTop: document.querySelector('#workflow').getBoundingClientRect().top, productBottom: document.querySelector('#product').getBoundingClientRect().bottom };
        const tabBox = document.querySelector('.product-tabs').getBoundingClientRect();
        const panelBox = document.querySelector('.product-panel:not([hidden])').getBoundingClientRect();
        const viewport = document.querySelector('.product-panel:not([hidden]) [data-native-demo]');
        const mediaBox = viewport.getBoundingClientRect();
        const mediaFrame = viewport.closest('.product-shot').getBoundingClientRect();
        const activeFrames = [...(viewport.shadowRoot?.querySelectorAll('[data-product-frame]:not([hidden])') || [])];
        const projection = activeFrames[0]?.querySelector('.product-reference-root');
        const capability = { orientation: matchMedia('(min-width:901px)').matches ? 'vertical' : 'horizontal', tabsRight: tabBox.right, tabsBottom: tabBox.bottom, panelLeft: panelBox.left, panelTop: panelBox.top, mediaWidth: mediaBox.width, mediaHeight: mediaBox.height, frameWidth: mediaFrame.width, mediaLeft: mediaBox.left, frameLeft: mediaFrame.left, mediaTop: mediaBox.top, frameTop: mediaFrame.top, mediaBottom: mediaBox.bottom, frameBottom: mediaFrame.bottom, nativeCount: document.querySelectorAll('[data-native-demo]').length, nativeText: projection?.innerText || '', activeCount: activeFrames.length, readOnly: !!projection?.closest('[inert]'), referenceFrame: viewport.dataset.referenceFrame, frame: activeFrames[0]?.dataset.productFrame };
        return { capability, stage, width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, background: getComputedStyle(document.querySelector('#commercial-site')).backgroundColor, h1: document.querySelectorAll('h1').length, titleLines: title.height / parseFloat(getComputedStyle(h1).lineHeight), cta: { top: cta.top, bottom: cta.bottom, right: cta.right, height: cta.height }, headerHeight: document.querySelector('.masthead').getBoundingClientRect().height, released: life.dataset.released, v2Accepted: life.dataset.v2Accepted, navHidden: document.querySelector('#navigation').hidden };
      });
      const heroComposition = await page.evaluate(measureHero);
      assertHero(heroComposition);
      assert.equal(row.scrollWidth, width, `Overflow ${width}/${scheme}`);
      assert.equal(row.h1, 1);
      assert.equal(row.background, 'rgb(244, 246, 248)');
      assert(row.titleLines <= 2.05, `Title wraps ${width}`);
      assert(row.cta.right <= width && row.cta.height < 60);
      if (width >= 901) { assert(row.cta.bottom < height, `CTA outside screen ${width}`); assert(row.headerHeight <= 80); }
      assert.equal(row.released, 'true');
      assert.equal(row.v2Accepted, 'false');
      assert(row.stage.top >= row.stage.introBottom, 'Product stage is below the introduction');
      assert(row.stage.workflowTop >= row.stage.productBottom, 'B chapter follows product capabilities');
      assert.equal(row.stage.naturalWidth, workbench.width);
      assert.equal(row.stage.naturalHeight, workbench.height);
      assert(Math.abs(row.stage.width / row.stage.height - workbench.ratio) < .01, 'Hero image remains uncropped');
      assert(Math.abs(row.stage.width - (row.stage.outerWidth - 2)) < 1, 'Product image fills the stage width inside its thin border');
      assert(Math.abs(row.stage.left - row.stage.outerLeft - 1) < 1, 'No nested horizontal matte around the product');
      assert(Math.abs(row.stage.top - row.stage.outerTop - 1) < 1, 'No nested top matte around the product');
      if (width >= 1280) {
        assert.equal(row.stage.outerWidth, Math.min(1680, width - 48), 'Stage stays within a centered desktop maximum');
        assert(Math.abs(row.stage.outerLeft - (width - row.stage.outerWidth) / 2) < 1, 'Stage is centered');
        assert.equal(row.stage.introLeft, (width - Math.min(1680, width - 128)) / 2, 'Introduction uses the centered content width');
        if (width >= 1920) assert.equal(row.stage.introLeft, row.stage.outerLeft, 'Large-screen title and product share an alignment');
      }
      assert.equal(row.capability.orientation, width >= 901 ? 'vertical' : 'horizontal');
      if (width >= 901) assert(row.capability.panelLeft > row.capability.tabsRight, 'Desktop choices sit beside their media');
      else assert(row.capability.panelTop >= row.capability.tabsBottom, 'Compact choices precede their media');
      assert.equal(row.capability.nativeCount, 3, 'All three native product presentations are present');
      assert(row.capability.nativeText.trim().length > 40 && row.capability.mediaHeight > 0, 'Capability viewport contains readable native content');
      assert(row.capability.activeCount === 1 && row.capability.readOnly, 'Capability exposes one inert real-component snapshot');
      assert.equal(row.capability.frame, row.capability.referenceFrame, 'Host identifies the active shadow snapshot');
      assert(Math.abs(row.capability.mediaWidth - row.capability.frameWidth) < 1, 'Native capability viewport fills its own figure width');
      assert(Math.abs(row.capability.mediaLeft - row.capability.frameLeft) < 1 && Math.abs(row.capability.mediaTop - row.capability.frameTop) < 1, 'No nested matte around the native viewport');
      assert(row.capability.mediaBottom <= row.capability.frameBottom, 'Figure contains the complete native viewport and separate original-image footer');
      assert.deepEqual(transfers, [], `Unexpected resource error at ${width}/${scheme}`);
      rows.push({ mode: 'layout', scheme, transfers, ...row });
      if (scheme === 'light' && width === 2560) await page.screenshot({ path: path.join(directory, 'hero-2560.png') });
      if (scheme === 'light' && [1440,390,320,1280].includes(width)) {
        await page.screenshot({ path: path.join(directory, `hero-${width}.png`) });
        for (const viewport of await page.locator('.product-panel [data-native-demo]').all()) await viewport.scrollIntoViewIfNeeded();
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: path.join(directory, `layout-${width}.png`), fullPage: true });
      }
      await page.close();
    }
    for (const width of [1440,390,320]) for (const scheme of ['light','dark']) {
      const page = await browser.newPage({ viewport: { width, height: width === 320 ? 568 : 900 }, javaScriptEnabled: false, colorScheme: scheme });
      await page.goto(url, { waitUntil: 'load' });
      await page.evaluate(async () => { await document.fonts.ready; });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, `No JS overflow ${width}`);
      const flow = await page.evaluate(() => ({ headerBottom: document.querySelector('.masthead').getBoundingClientRect().bottom, navigationBottom: document.querySelector('#navigation').getBoundingClientRect().bottom, introductionTop: document.querySelector('.hero h1').getBoundingClientRect().top }));
      assert(flow.headerBottom >= flow.navigationBottom, `No JS header contains navigation at ${width}: ${JSON.stringify(flow)}`);
      assert(flow.introductionTop >= flow.navigationBottom, `No JS navigation overlaps introduction at ${width}: ${JSON.stringify(flow)}`);
      assert(await page.locator('#panel-delivery').isVisible());
      assert(await page.locator('#panel-methods').isVisible());
      assert(await page.locator('#panel-management').isVisible());
      const staticPanels = await page.locator('.product-panel').evaluateAll(panels => panels.map(panel => {
        const viewport = panel.querySelector('[data-native-demo]');
        const box = viewport.getBoundingClientRect();
        const panelBox = panel.getBoundingClientRect();
        const original = panel.querySelector('.capability-original[data-zoom]');
        const activeFrames = [...(viewport.shadowRoot?.querySelectorAll('[data-product-frame]:not([hidden])') || [])];
        const projection = activeFrames[0]?.querySelector('.product-reference-root');
        return { name: panel.dataset.panel, nativeName: viewport.dataset.nativeDemo, text: projection?.innerText || '', activeCount: activeFrames.length, readOnly: !!projection?.closest('[inert]'), frame: activeFrames[0]?.dataset.productFrame, referenceFrame: viewport.dataset.referenceFrame, terminalFrame: viewport.dataset.referenceTerminal, width: box.width, height: box.height, bottom: box.bottom, panelTop: panelBox.top, panelBottom: panelBox.bottom, originalTop: original.getBoundingClientRect().top, href: original.getAttribute('href'), alt: original.dataset.zoomAlt };
      }));
      assert.deepEqual(staticPanels.map(panel => panel.nativeName), ['delivery','methods','management']);
      for (const [index, panel] of staticPanels.entries()) {
        assert(panel.width > 0 && panel.height > 0 && panel.text.trim().length > 40 && panel.bottom <= panel.panelBottom, 'No-JS preserves a full static native viewport');
        assert(panel.activeCount === 1 && panel.readOnly, 'No-JS declarative shadow DOM contains one inert product snapshot');
        assert.equal(panel.frame, panel.referenceFrame);
        assert.equal(panel.frame, panel.terminalFrame, 'No-JS preserves the terminal product snapshot');
        assert(panel.originalTop >= panel.bottom - 1 && new URL(panel.href, url).href === originals[panel.name].href, 'No-JS original link remains reachable after the native demo');
        assert.equal(panel.alt, originals[panel.name].alt);
        if (index) assert(panel.panelTop >= staticPanels[index - 1].panelBottom, 'No-JS native panels never overlap');
      }
      assert(await page.locator('#contact').isVisible());
      assert.equal(await page.locator('[data-lifecycle]').getAttribute('data-v2-accepted'), 'false');
      rows.push({ mode: 'nojs', width, scheme });
      if (width === 390 && scheme === 'light') await page.screenshot({ path: path.join(directory, 'nojs-390.png') });
      await page.close();
    }
    for (const width of [1440,900,390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      page.on('pageerror', error => errors.push(`capabilities/${width}: ${error.message}`));
      page.on('console', message => { if (message.type() === 'error') errors.push(`capabilities/${width}: ${message.text()}`); });
      page.on('requestfailed', request => { if (!require('./transport.cjs').recordExpectedFailure(request)) errors.push(`capabilities/${width}: ${request.url()} ${request.failure()?.errorText}`); });
      await page.goto(url, { waitUntil: 'load' });
      await page.waitForFunction(() => document.querySelector('.product-tabs [aria-current="location"]') !== null);
      const vertical = width >= 901;
      assert.equal(await page.getByRole('navigation', { name: '产品能力', exact: true }).count(), 1);
      assert.equal(await page.locator('.product-tabs [role=tab]').count(), 0);
      for (const name of ['delivery','methods','management']) {
        await page.locator(`[data-tab="${name}"]`).click();
        await waitCurrent(page, name);
        const viewport = page.locator(`#panel-${name} [data-native-demo="${name}"]`);
        await viewport.scrollIntoViewIfNeeded();
        const media = await viewport.evaluate(viewport => { const box = viewport.getBoundingClientRect(); const frame = viewport.closest('.product-shot').getBoundingClientRect(); const activeFrames = [...(viewport.shadowRoot?.querySelectorAll('[data-product-frame]:not([hidden])') || [])]; const projection = activeFrames[0]?.querySelector('.product-reference-root'); return { width: box.width, height: box.height, left: box.left, top: box.top, bottom: box.bottom, frameLeft: frame.left, frameTop: frame.top, frameBottom: frame.bottom, frameWidth: frame.width, text: projection?.innerText || '', tag: viewport.tagName, activeCount: activeFrames.length, readOnly: !!projection?.closest('[inert]'), frame: activeFrames[0]?.dataset.productFrame, referenceFrame: viewport.dataset.referenceFrame }; });
        assert(!['IMG', 'VIDEO', 'CANVAS'].includes(media.tag) && media.text.trim().length > 40 && media.height > 0, `${name} is populated native DOM`);
        assert(media.activeCount === 1 && media.readOnly, `${name} contains one inert real-component snapshot`);
        assert.equal(media.frame, media.referenceFrame, `${name} host selects its active snapshot`);
        assert(Math.abs(media.width - media.frameWidth) < 1 && Math.abs(media.left - media.frameLeft) < 1 && Math.abs(media.top - media.frameTop) < 1 && media.bottom <= media.frameBottom, `${name} native viewport fills and fits its own figure`);
        await page.mouse.move(width - 2, 0);
        await page.locator(`#panel-${name}`).screenshot({ path: path.join(directory, `product-${name}-${width}.png`), style: '.masthead{visibility:hidden}' });
        await page.locator(`#panel-${name} [data-zoom]`).click();
        await assertOriginal(page, name);
        const original = await page.locator(`#panel-${name} [data-zoom]`).getAttribute('href');
        assert.equal(await page.locator('#zoom-image').getAttribute('src'), new URL(original, url).href);
        await page.keyboard.press('Escape');
        await page.waitForFunction(name => !document.querySelector('#image-dialog').open && document.activeElement === document.querySelector(`#panel-${name} [data-zoom]`), name);
      }
      await page.locator('[data-tab="delivery"]').click();
      await page.keyboard.press(vertical ? 'ArrowDown' : 'ArrowRight');
      await waitCurrent(page, 'methods');
      await page.keyboard.press(vertical ? 'ArrowUp' : 'ArrowLeft');
      await waitCurrent(page, 'delivery');
      await page.keyboard.press('End');
      await waitCurrent(page, 'management');
      await page.keyboard.press(vertical ? 'ArrowDown' : 'ArrowRight');
      await waitCurrent(page, 'delivery');
      await page.keyboard.press('Home');
      await waitCurrent(page, 'delivery');
      await page.keyboard.press('End');
      assert.equal(await page.locator('.product-tabs a').evaluateAll(links => links.filter(link => link.tabIndex === 0).length), 3);
      const resizedTo = vertical ? 390 : 1440;
      await page.setViewportSize({ width: resizedTo, height: 1000 });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const expected = await page.evaluate(() => {
        const offset = document.querySelector('.masthead').getBoundingClientRect().height + (innerWidth <= 900 ? document.querySelector('.product-tabs').getBoundingClientRect().height : 0) + 26;
        return [...document.querySelectorAll('[data-panel]')].filter(panel => panel.getBoundingClientRect().top <= offset).at(-1)?.dataset.panel || 'delivery';
      });
      await waitCurrent(page, expected);
      assert(await page.locator('[data-tab="management"]').evaluate(tab => document.activeElement === tab));
      rows.push({ mode: 'capability-interactions', width, resizedTo, panels: 3, focusPreserved: true, currentFollowsLayout: true });
      await page.close();
    }
    for (const [width,height] of [[2560,1440],[1440,1000],[1280,720],[390,844],[320,568]]) for (const scheme of ['light', 'dark']) {
      const page = await browser.newPage({ viewport: { width,height }, reducedMotion: 'reduce', colorScheme: scheme });
      await page.goto(url, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await decodeImage(page, '.hero-screen img');
      const geometry = await page.evaluate(measureHero);
      assertHero(geometry);
      assert.equal(geometry.image.naturalWidth, workbench.width);
      assert.equal(geometry.image.naturalHeight, workbench.height);
      assert(Math.abs(geometry.image.width / geometry.image.height - workbench.ratio) < .01, 'Five-viewport hero contract preserves current full-image proportions');
      rows.push({ mode: 'hero-reference-contract', width, height, scheme, geometry });
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const requests = [];
    page.on('request', request => requests.push({ url: request.url(), method: request.method(), type: request.resourceType(), headers: request.headers() }));
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForFunction(() => document.querySelector('.product-tabs [aria-current="location"]') !== null);
    await page.locator('.hero-screen').click();
    await decodeImage(page, '#zoom-image');
    const heroOriginal = await page.locator('#zoom-image').evaluate(image => ({ src: image.src, alt: image.alt, width: image.naturalWidth, height: image.naturalHeight, renderedWidth: image.getBoundingClientRect().width, renderedHeight: image.getBoundingClientRect().height }));
    assert.equal(heroOriginal.src, workbench.href);
    assert.equal(heroOriginal.alt, '当前 SkyMythos 产品工作台，展示真实功能界面，使用本地示例数据');
    assert.equal(heroOriginal.width, workbench.width);
    assert.equal(heroOriginal.height, workbench.height);
    assert(Math.abs(heroOriginal.renderedWidth / heroOriginal.renderedHeight - workbench.ratio) < .01, 'Hero original modal retains the full source ratio');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#image-dialog').open);
    assert(await page.locator('.hero-screen').evaluate(link => document.activeElement === link));
    await page.getByRole('navigation', { name: '主导航' }).getByText('产品', { exact: true }).click();
    assert(await page.locator('.nav-group').first().getAttribute('open') !== null);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.nav-group').first().getAttribute('open'), null);
    await page.getByRole('navigation', { name: '产品能力', exact: true }).getByRole('link', { name: /保留方法/ }).click();
    assert(await page.locator('#panel-methods').isVisible());
    assert(await page.locator('#panel-methods [data-native-demo="methods"]').isVisible());
    assert(await page.locator('#panel-delivery').isVisible());
    assert(await page.locator('#panel-management').isVisible());
    await waitCurrent(page, 'methods');
    await page.keyboard.press('ArrowDown');
    await waitCurrent(page, 'management');
    assert(await page.locator('#panel-management').isVisible());
    assert(await page.locator('#panel-management [data-native-demo="management"]').isVisible());
    await page.keyboard.press('Home');
    await waitCurrent(page, 'delivery');
    assert(await page.locator('#panel-delivery').isVisible());
    await page.locator('#panel-delivery [data-zoom]').click();
    assert(await page.locator('#image-dialog').isVisible());
    await assertOriginal(page, 'delivery');
    assert((await page.locator('#zoom-image').getAttribute('src')).endsWith('.png'));
    await page.screenshot({ path: path.join(directory, 'image-dialog.png') });
    await page.keyboard.press('Escape');
    assert(!(await page.locator('#image-dialog').isVisible()));
    assert(await page.locator('#panel-delivery [data-zoom]').evaluate(link => document.activeElement === link));
    // 产品投影内的 inert 链接属于隔离快照；这里只枚举官网真实可交互文档，不穿透 Shadow DOM。
    const links = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map(anchor => anchor.href))]);
    for (const link of links) {
      const parsed = new URL(link);
      assert.equal(parsed.origin, new URL(url).origin, `External link ${link}`);
      if (parsed.pathname === new URL(url).pathname && parsed.hash) {
        const exists = await page.evaluate(hash => Boolean(document.getElementById(decodeURIComponent(hash.slice(1)))) || hash === '#', parsed.hash);
        assert(exists, `Missing anchor ${link}`);
      } else {
        const response = await page.request.get(parsed.origin + parsed.pathname);
        assert.equal(response.status(), 200, `Link ${link}`);
      }
    }
    const beforeContact = requests.length;
    const originalURL = page.url();
    await page.locator('.hero [data-contact]').click();
    assert(await page.locator('#contact-dialog').isVisible());
    await page.locator('#contact-form button[type=submit]').click();
    assert.equal(await page.locator('#company').evaluate(input => input.validity.valueMissing), true);
    assert(!(await page.locator('#contact-result').isVisible()));
    await page.locator('#company').fill('本地测试企业');
    await page.locator('#email').fill('demo@example.com');
    await page.locator('#goal').fill('<script>not-executed</script>');
    await page.locator('#contact-form button[type=submit]').click();
    assert(await page.locator('#contact-result').isVisible());
    assert.equal(await page.locator('[data-result=company]').innerText(), '本地测试企业');
    assert.equal(await page.locator('[data-result=goal]').innerText(), '<script>not-executed</script>');
    assert.equal(await page.locator('#contact-result script').count(), 0);
    await page.screenshot({ path: path.join(directory, 'contact-result.png') });
    await page.locator('#edit-contact').click();
    assert.equal(await page.locator('#company').inputValue(), '本地测试企业');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#contact-dialog').open && document.querySelector('#company').value === '');
    assert.equal(await page.locator('#company').inputValue(), '');
    assert.equal(await page.locator('[data-result=company]').innerText(), '');
    assert.equal(page.url(), originalURL);
    assert.equal(requests.length, beforeContact, 'Contact flow made a request');
    assert.deepEqual(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookie: document.cookie })), { local: 0, session: 0, cookie: '' });
    const { readPolicy, allowedRequest } = require('./side-effect-audit.cjs');
    const policy = readPolicy();
    assert(requests.every(request => ['GET', 'HEAD'].includes(request.method) && new URL(request.url).origin === new URL(url).origin && allowedRequest(request, policy)));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.menu-toggle').click();
    assert.equal(await page.locator('#navigation').getAttribute('hidden'), null);
    await page.locator('.nav-group summary').first().click();
    await page.getByRole('link', { name: /保留方法.*让经确认/ }).click();
    await page.waitForURL(new URL('product/methods/', url).href);
    assert.equal(await page.locator('#navigation').getAttribute('hidden'), '');
    assert((await page.title()).includes('方法'));
    assert.equal(await page.locator('main h1').count(), 1);
    assert.equal(await page.locator('#product').count(), 0, 'Global navigation enters a real detail page, not a home panel');
    await page.locator('.nav-cta').click();
    await page.screenshot({ path: path.join(directory, 'contact-mobile.png') });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
    await page.keyboard.press('Escape');
    rows.push({ mode: 'interactions', assertions: 'menus, Escape, capability navigation keyboard, zoom, original links, form validation/preview/edit/reset, zero contact requests/storage/URL values, mobile navigation', checkedLinks: links.length, requests: requests.length });
    await page.close();
    assert.deepEqual(errors, []);
    console.log(`PASS: ${rows.length} scenarios; ${links.length} links; no page or resource errors`);
  } catch (error) {
    errors.push(error.stack);
    console.error(error.stack);
    process.exitCode = 1;
  } finally {
    fs.writeFileSync(path.join(directory, 'browser.json'), JSON.stringify({ at: new Date().toISOString(), rows, errors }, null, 2));
    await browser.close();
  }
})();
