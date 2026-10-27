const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const portable = require('./browser.cjs');
portable.trackIdentity('scroll');
const url = portable.url;
const names = ['delivery', 'methods', 'management'];
const rows = [];
const errors = [];
const report = process.env.SCROLL_REPORT || 'scroll.json';
function observe(page) {
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => { if (!require('./transport.cjs').recordExpectedFailure(request)) errors.push(`${request.failure()?.errorText}: ${request.url()}`); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()} ${response.url()}`); });
}
(async () => {
  const browser = await portable.launch();
  try {
    for (const [width, height] of [[1440,1000],[1280,720],[901,900],[900,900],[390,844],[320,568],[844,390]]) {
      for (const reducedMotion of (height === 390 ? ['no-preference', 'reduce'] : ['reduce'])) {
        const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
        observe(page);
        await page.goto(url, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        const entryY = await page.locator('#product').evaluate(section => scrollY + section.getBoundingClientRect().top);
        await page.mouse.wheel(0, entryY - await page.evaluate(() => scrollY));
        await page.waitForFunction(y => Math.abs(scrollY - y) < 3, entryY, { timeout: 2500 });
        for (const name of names) assert(await page.locator(`#panel-${name}`).isVisible(), `${name}: this capability cannot be read through normal scrolling without clicking`);
        await page.locator('[data-tab="delivery"]').evaluate(element => element.focus({ preventScroll: true }));
        const focus = await page.evaluate(() => document.activeElement.dataset.tab);
        const sequence = [];
        for (const name of [...names, ...names.slice().reverse()]) {
          const panel = page.locator(`#panel-${name}`);
          assert(await panel.isVisible(), `${name}: this capability cannot be read through normal scrolling without clicking`);
          const target = await panel.evaluate(panel => {
            const header = document.querySelector('.masthead').getBoundingClientRect().height;
            const navigation = innerWidth <= 900 ? document.querySelector('.product-tabs').getBoundingClientRect().height : 0;
            return Math.max(0, scrollY + panel.getBoundingClientRect().top - header - navigation - 20);
          });
          await page.mouse.move(width - 2, height / 2);
          await page.mouse.wheel(0, target - await page.evaluate(() => scrollY));
          await page.waitForFunction(({ name, target }) => Math.abs(scrollY - target) < 3 && document.querySelector(`[data-tab="${name}"]`).getAttribute('aria-current') === 'location', { name, target }, { timeout: 2500 });
          assert.equal(await page.evaluate(() => document.activeElement.dataset.tab), focus, 'Automatic scroll tracking must not move keyboard focus');
          const geometry = await panel.evaluate(panel => ({ top: panel.getBoundingClientRect().top, navBottom: innerWidth <= 900 ? document.querySelector('.product-tabs').getBoundingClientRect().bottom : document.querySelector('.masthead').getBoundingClientRect().bottom }));
          assert(geometry.top >= geometry.navBottom - 1, `${name}: title is obscured by sticky navigation`);
          sequence.push(name);
        }
        // Clicking a distant item must settle at its actual content, not be overwritten by a stale scroll sample.
        await page.locator('[data-tab="management"]').click();
        await page.waitForFunction(() => document.querySelector('[data-tab="management"]').getAttribute('aria-current') === 'location');
        await page.waitForFunction(() => { const panel = document.querySelector('#panel-management'); return Math.abs(panel.getBoundingClientRect().top - parseFloat(getComputedStyle(panel).scrollMarginTop) - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)) < 3; });
        assert.equal(await page.locator('.product-tabs [aria-current="location"]').count(), 1);
        assert.equal(await page.locator('[data-panel][hidden]').count(), 0);
        assert.equal(await page.evaluate(() => document.querySelectorAll('[role="tab"], [role="tabpanel"], [role="tablist"]').length), 0, 'Website section navigation is not a tab widget; inert product tabs retain their real roles');
        rows.push({ width, height, reducedMotion, sequence, focusUnchanged: true, manualNavigation: true });
        await page.close();
      }
    }
    for (const width of [1440,390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      observe(page);
      await page.addInitScript(() => {
        window.persistedRestores = 0;
        addEventListener('pageshow', event => { if (event.persisted) window.persistedRestores++; });
      });
      await page.goto(`${url}#panel-methods`, { waitUntil: 'load' });
      await page.waitForFunction(() => document.querySelector('[data-tab="methods"]').getAttribute('aria-current') === 'location');
      await page.reload({ waitUntil: 'load' });
      await page.waitForFunction(() => document.querySelector('[data-tab="methods"]').getAttribute('aria-current') === 'location');
      await page.locator('#panel-methods [data-zoom]').click();
      await page.waitForFunction(() => document.querySelector('#image-dialog').open);
      const before = await page.evaluate(() => scrollY);
      await page.mouse.wheel(0, -400);
      assert.equal(await page.evaluate(() => scrollY), before, 'Image dialog must not scroll the underlying capability page');
      assert.equal(await page.locator('[data-tab="methods"]').getAttribute('aria-current'), 'location');
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('#image-dialog').open);
      await page.goto(new URL(`${portable.siteBasePath}/en/`, url).href, { waitUntil: 'load' });
      await page.goBack({ waitUntil: 'load' });
      await page.waitForFunction(() => document.querySelector('[data-tab="methods"]').getAttribute('aria-current') === 'location');
      rows.push({ width, mode: 'hash-reload-dialog-back', persistedRestores: await page.evaluate(() => window.persistedRestores) });
      await page.close();
      const nojs = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: false });
      observe(nojs);
      await nojs.goto(url, { waitUntil: 'load' });
      await nojs.locator('[data-tab="methods"]').click();
      assert.equal(new URL(nojs.url()).hash, '#panel-methods');
      const clear = await nojs.locator('#panel-methods').evaluate(panel => panel.getBoundingClientRect().top >= document.querySelector(innerWidth <= 900 ? '.product-tabs' : '.masthead').getBoundingClientRect().bottom);
      assert(clear, 'No-JS native anchor must clear the sticky capability navigation');
      rows.push({ width, mode: 'nojs-native-anchor' });
      await nojs.close();
    }
    assert.deepEqual(errors, []);
    console.log(`PASS: ${rows.length} scroll scenarios; forward/reverse wheel, manual navigation, focus, sticky clearance, hash/reload/back, dialogs and no-JS anchors`);
  } catch (error) {
    errors.push(error.stack);
    console.error(error.stack);
    process.exitCode = 1;
  } finally {
    fs.writeFileSync(path.join(portable.evidence, report), JSON.stringify({ at: new Date().toISOString(), rows, errors }, null, 2));
    await browser.close();
  }
})();
