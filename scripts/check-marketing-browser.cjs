#!/usr/bin/env node
// 独立浏览器回归：调用方负责构建和启动服务，脚本只访问 BASE_URL。
// node scripts/check-marketing-browser.cjs [all|baseline|geometry|timeline|lifecycle|navigation|learning]
// 可组合模式（如 geometry,navigation）。PLAYWRIGHT_MODULE 指向已安装模块；
// CHROME_EXECUTABLE 可选；ARTIFACT_DIR 默认新建系统临时目录，不向源码目录写证据。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const mode = process.env.MODE || process.argv[2] || 'all';
const artifacts = process.env.ARTIFACT_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'fusion-marketing-browser-'));
fs.mkdirSync(artifacts, { recursive: true });
const report = { base, mode, startedAt: new Date().toISOString(), cases: [], errors: [], failures: [], screenshots: [] };
const url = route => new URL(route, base).href;
const locales = ['zh', 'en'];
const widths = [[2000, 1125], [1920, 1080], [1440, 900], [1440, 700], [1280, 720], [1024, 768], [901, 720], [900, 720], [768, 900], [390, 844], [320, 844]];
const filmSelector = '[data-lifecycle]';
const profiles = [['requirement-agent', 'Claude'], ['developer-agent', 'GPT'], ['verification-agent', 'DeepSeek']];
const finalParts = ['v1-history', 'experience', 'method', 'reference', 'review-label'];
const timelineTargets = [.5, 2, 4, 5.8, 6.7, 7.8, 9.5, 10.4, 11.5, 12.8, 15.5, 17.5, 18.3, 20, 22, 23.3, 24.3, 25.8, 26.8, 27.9, 29.5, 31, 32.5, 33.7, 35, 35.8, 36.8, 37.8, 38.5, 39.5, 41.5, 44.5, 46.5, 49.5, 50.5, 53.5, 57.5, 60.5, 64.5, 67.5, 70.9, 71.1, 74.5, 78.1, 81.5, 85.1, 88.5, 92.5];

async function decodeImages(page) {
  const originalScroll = await page.evaluate(() => ({ x: scrollX, y: scrollY }));
  for (const image of await page.locator('img[loading="lazy"]').elementHandles()) {
    if (!(await image.isVisible())) continue;
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(n => n.decode());
  }
  await page.evaluate(({ x, y }) => scrollTo({ left: x, top: y, behavior: 'instant' }), originalScroll);
  return page.evaluate(async () => {
    await document.fonts.ready;
    const sources = [...document.querySelectorAll('svg image')].map(n => n.getAttribute('href')).concat([...document.images].map(n => n.currentSrc || n.src)).filter(Boolean);
    await Promise.all([...new Set(sources)].map(async src => {
      const image = new Image();
      image.src = src;
      await image.decode();
      if (!image.naturalWidth || !image.naturalHeight) throw Error(`Image failed to decode: ${src.slice(0, 160)}`);
    }));
    return { references: sources.length, unique: new Set(sources).size };
  });
}

async function scene(page) {
  return page.locator(filmSelector).evaluate(root => {
    const visible = node => {
      if (getComputedStyle(node).visibility === 'hidden') return false;
      for (let n = node; n && n !== root; n = n.parentElement) {
        const style = getComputedStyle(n);
        if (style.display === 'none' || Number(style.opacity) === 0) return false;
      }
      return true;
    };
    const box = root.querySelector('svg').getBoundingClientRect();
    const objects = Object.fromEntries([...root.querySelectorAll('[data-part]')].filter(n => n.dataset.part !== 'world').map(n => {
      const b = n.getBoundingClientRect();
      return [n.dataset.part, { visible: visible(n), transform: n.getAttribute('transform'), text: n.textContent, bounds: b.toJSON(), inside: b.left >= box.left - 1 && b.right <= box.right + 1 && b.top >= box.top - 1 && b.bottom <= box.bottom + 1 }];
    }));
    return {
      data: { ...root.dataset }, objects,
      headings: [...root.querySelectorAll('[data-act-heading]')].filter(n => !n.hidden).map(n => Number(n.dataset.actHeading)),
      profiles: [...root.querySelectorAll('[data-agent]')].map(n => [n.dataset.agent, n.dataset.model]),
      historyMarkup: root.querySelector('[data-part="v1-history"]')?.innerHTML,
      width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      viewBox: root.querySelector('svg').getAttribute('viewBox'),
      pencilAboveEdit: Boolean(root.querySelector('[data-part="learning-edit"]').compareDocumentPosition(root.querySelector('[data-part="pencil"]')) & Node.DOCUMENT_POSITION_FOLLOWING),
    };
  });
}

function assertFinal(row) {
  for (const key of finalParts) assert(row.objects[key]?.visible, `static scene retains ${key}`);
  for (const name of ['scope', 'prototype', 'code', 'test', 'release', 'feedback', 'learning', 'v2']) {
    assert.equal(row.objects[`${name}-page`].visible, name === 'v2', `static ${name} page visibility`);
  }
  assert.deepEqual(row.profiles, profiles);
  for (const key of ['released', 'stored', 'referenced', 'learningAdopted', 'v2Review']) assert.equal(row.data[key], 'true', key);
  assert.equal(row.data.v2Accepted, 'false');
  assert.equal(row.data.v2Released, 'false');
  assert.equal(row.data.v1Method, '0');
  assert.equal(row.data.v2Method, '1');
}

// 每次读取生产 RAF 推进后的真实 DOM；不导入生产模型或提供 seek 旁路。
function assertTimeline(row, target) {
  const t = Number(row.data.elapsed), o = row.objects;
  assert(Math.abs(t - target) < .14, `elapsed ${t} vs ${target}`);
  assert.equal(row.width, row.scrollWidth, 'no horizontal overflow');
  assert.deepEqual(row.headings, [t < 10 ? 0 : t < 28 ? 1 : t < 50 ? 2 : Math.floor((t - 50) / 7) % 3]);
  assert.equal(row.data.requirement, 'REQ-014');
  assert.equal(row.data.version, t >= 39 ? '2' : '1');
  assert.deepEqual(row.profiles, profiles);
  for (const [key, threshold] of [['scopeConfirmed', 7.5], ['tested', 23], ['accepted', 24], ['releaseApproved', 25.5], ['released', 26.5], ['summaryReady', 32], ['learningConfirmed', 35.5], ['learningAdopted', 36.5], ['stored', 38], ['referenced', 39]]) {
    assert.equal(row.data[key], String(t >= threshold), `${key} at ${t}`);
  }
  assert.equal(row.data.v1Method, '0');
  assert.equal(row.data.v2Method, t >= 39 ? '1' : 'null');
  assert.equal(row.data.v2Accepted, 'false');
  assert.equal(row.data.v2Released, 'false');
  assert.equal(row.data.roleRevision, '1');
  for (const [key, threshold] of [['v1-history', 26.5], ['method', 36.5], ['experience', 36.5], ['reference', 38], ['review-label', 46]]) {
    assert.equal(o[key].visible, t >= threshold, `${key} visibility at ${t}`);
  }
  const content = t < 12 ? 'scope' : t < 14 ? 'prototype' : t < 17 ? 'code' : t < 23 ? 'test' : t < 29 ? 'release' : t < 30 ? 'feedback' : t < 38 ? 'learning' : 'v2';
  for (const name of ['scope', 'prototype', 'code', 'test', 'release', 'feedback', 'learning', 'v2']) {
    assert.equal(o[`${name}-page`].visible, name === content && t >= 3, `${name} page at ${t}`);
  }
  assert.equal(o['learning-edit'].visible, content === 'learning' && t > 33);
  assert.equal(o['scope-edit'].visible, content === 'scope' && t > 5.5);
  assert.equal(o.pencil.visible, (t >= 5.5 && t < 6.8) || (t >= 33 && t < 34.5));
  assert(row.pencilAboveEdit, 'pencil paints above edit');
  if (t >= 39.5) assert(o['v2-criteria'].visible);
  for (const [key, object] of Object.entries(o)) if (object.visible) assert(object.inside, `${key} outside SVG at ${t}`);
  const overlap = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  for (const a of ['planner', 'developer', 'tester']) {
    assert(o[a].transform.includes('scale(1)'), `${a} station remains readable`);
    for (const b of ['planner', 'developer', 'tester']) if (a !== b && o[a].visible && o[b].visible) assert(!overlap(o[a].bounds, o[b].bounds), `${a}/${b} overlap at ${t}`);
  }
}

async function scenario(name, run) {
  try {
    const details = await run();
    report.cases.push({ name, passed: true, ...details });
    console.log(`PASS ${name}`);
  } catch (error) {
    report.cases.push({ name, passed: false });
    report.failures.push({ name, message: error.stack || String(error) });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

async function screenshot(page, name) {
  const destination = path.join(artifacts, `${name}.png`);
  await page.screenshot({ path: destination, fullPage: true });
  report.screenshots.push(destination);
  return destination;
}

async function layout(page) {
  return page.evaluate(() => ({
    width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth,
    title: document.title, h1: [...document.querySelectorAll('h1')].map(n => n.textContent),
    background: getComputedStyle(document.body).backgroundColor,
    rootColorScheme: getComputedStyle(document.documentElement).colorScheme,
    hero: document.querySelector('.product-hero')?.getBoundingClientRect().toJSON(),
    links: [...document.querySelectorAll('.employee-actions a')].map(n => ({ text: n.textContent, href: n.getAttribute('href'), bounds: n.getBoundingClientRect().toJSON() })),
    images: [...document.images].filter(n => !n.closest('dialog')).map(n => ({ src: n.currentSrc || n.src, loaded: n.complete && n.naturalWidth > 0 })),
    timing: performance.getEntriesByType('navigation').map(n => ({ domContentLoaded: n.domContentLoadedEventEnd, load: n.loadEventEnd, transferSize: n.transferSize, decodedBodySize: n.decodedBodySize })),
  }));
}

async function contrastSamples(page) {
  return page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const rgba = color => { context.clearRect(0, 0, 1, 1); context.fillStyle = color; context.fillRect(0, 0, 1, 1); return [...context.getImageData(0, 0, 1, 1).data]; };
    const over = (foreground, background) => foreground.slice(0, 3).map((value, index) => value * foreground[3] / 255 + background[index] * (1 - foreground[3] / 255));
    const luminance = rgb => rgb.map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
    return [...document.querySelectorAll('main h1,main .story-lede,main .employee-primary,main .employee-secondary,main .product-opening-copy p,main .product-chapter-heading > p,.site-colophon .text-ink-4')].filter(node => node.getBoundingClientRect().width > 0).map(node => {
      const ancestors = []; for (let n = node; n; n = n.parentElement) ancestors.unshift(n);
      let background = [255, 255, 255];
      for (const ancestor of ancestors) background = over(rgba(getComputedStyle(ancestor).backgroundColor), background);
      const style = getComputedStyle(node), foreground = over(rgba(style.color), background);
      const light = luminance(foreground), dark = luminance(background), ratio = (Math.max(light, dark) + .05) / (Math.min(light, dark) + .05);
      const minimum = Number.parseFloat(style.fontSize) >= 24 || (Number.parseFloat(style.fontSize) >= 18.66 && Number.parseInt(style.fontWeight, 10) >= 700) ? 3 : 4.5;
      return { text: node.textContent.slice(0, 100), ratio, minimum, color: style.color, background };
    });
  });
}

async function geometry(newPage) {
  for (const locale of locales) for (const route of ['', 'concept/', 'architecture/']) {
    const page = await newPage({ reducedMotion: 'reduce' });
    try {
      await page.goto(url(`/${locale}/${route}`), { waitUntil: 'networkidle' });
      const images = await decodeImages(page);
      for (const scheme of ['light', 'dark']) for (const [width, height] of widths) {
        await scenario(`geometry/${locale}/${route || 'home'}/${scheme}/${width}x${height}`, async () => {
          await page.setViewportSize({ width, height });
          await page.emulateMedia({ colorScheme: scheme });
          await page.waitForTimeout(60);
          const row = await layout(page);
          const content = await page.evaluate(() => ({
            clipped: [...document.querySelectorAll('h1,h2,h3,p,summary,.employee-primary,.employee-secondary')].filter(n => n.clientWidth > 0 && n.getBoundingClientRect().width > 0 && n.scrollWidth > n.clientWidth + 2).map(n => ({ text: n.textContent.slice(0, 160), width: n.clientWidth, scroll: n.scrollWidth })),
            duplicateIDs: [...document.querySelectorAll('[id]')].map(n => n.id).filter((id, index, all) => all.indexOf(id) !== index),
            marketing: !!document.querySelector('.scope-marketing'),
          }));
          assert.equal(row.scrollWidth, width, 'no page overflow');
          assert.equal(row.h1.length, 1, 'one h1');
          assert(content.marketing, 'marketing styles remain scoped');
          assert.deepEqual(content.clipped, [], 'no clipped text');
          assert.deepEqual(content.duplicateIDs, [], 'no duplicate IDs');
          assert.equal(row.rootColorScheme, 'light', 'system dark preference does not change fixed-light site');
          const contrast = await contrastSamples(page);
          assert(contrast.length > 0, 'body/button contrast samples exist');
          for (const sample of contrast) assert(sample.ratio >= sample.minimum, `contrast ${sample.ratio.toFixed(2)} < ${sample.minimum}: ${sample.text}`);
          if (!route) {
            assert.equal(await page.locator(filmSelector).count(), 1, 'formal Hero uses lifecycle scene');
            const state = await scene(page);
            assertFinal(state);
            const branding = await page.locator(filmSelector).evaluate(root => ({
              buttons: root.querySelectorAll('button').length,
              stations: [...root.querySelectorAll('[data-station]')].map(node => ({ label: node.dataset.station, images: [...node.querySelectorAll('image')].map(image => ({ brand: image.dataset.brand, role: image.getAttribute('role'), href: image.getAttribute('href'), filter: getComputedStyle(image).filter })) })),
              cliInsideSVG: /Claude Code|Codex CLI/.test(root.querySelector('svg').textContent),
              cli: [...root.querySelectorAll('img')].map(node => node.alt),
            }));
            assert.equal(branding.buttons, 0, 'no playback or stage controls');
            assert.equal(branding.stations.length, 3, 'three physical Logo stations');
            assert.deepEqual(branding.stations.map(station => station.images.length), [1, 1, 1]);
            assert.deepEqual(branding.stations.flatMap(station => station.images.map(image => image.brand)), ['claude-symbol', 'openai-blossom', 'deepseek-symbol']);
            for (const station of branding.stations) for (const image of station.images) {
              assert(image.href.endsWith(`/brand/${image.brand}.svg`), 'station uses original local brand asset');
              assert.equal(image.role, 'img', 'labeled SVG brand image has an explicit accessible role');
              assert.equal(image.filter, 'none', 'no brand recoloring filter');
            }
            assert.equal(branding.cliInsideSVG, false, 'coding CLI annotation stays separate from stations');
            assert.equal(state.data.static, 'true');
            const boxes = await page.evaluate(() => ({ copy: document.querySelector('.product-hero-copy').getBoundingClientRect().toJSON(), film: document.querySelector('[data-lifecycle]').getBoundingClientRect().toJSON() }));
            if (width >= 901) {
              assert(row.hero.bottom <= height + 1, `complete desktop Hero fits (${row.hero.bottom} > ${height})`);
              assert(row.links.every(link => link.bounds.bottom <= height), 'all Hero CTAs in first viewport');
              assert(boxes.copy.right <= boxes.film.left + 1, 'desktop copy and scene side by side');
            } else assert(boxes.film.top >= boxes.copy.bottom - 1, 'mobile copy then scene');
          }
          if (scheme === 'light' && [1440, 390].includes(width) && (width !== 1440 || height === 900)) {
            row.screenshot = await screenshot(page, `${locale}-${route.replace('/', '') || 'home'}-${width}`);
          }
          return { ...row, scheme, images, contrast };
        });
      }
    } finally { await page.close(); }
    for (const width of [1440, 390]) for (const scheme of ['light', 'dark']) {
      await scenario(`noJS/${locale}/${route || 'home'}/${scheme}/${width}`, async () => {
        const noJS = await newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, javaScriptEnabled: false, colorScheme: scheme });
        try {
          await noJS.goto(url(`/${locale}/${route}`), { waitUntil: 'domcontentloaded' });
          const images = await decodeImages(noJS), row = await layout(noJS);
          assert.equal(row.scrollWidth, width);
          assert.equal(row.h1.length, 1);
          if (!route) assertFinal(await scene(noJS));
          const links = await noJS.locator('a[data-screenshot-trigger]').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')));
          assert(links.every(href => /\.(png|webp|jpe?g)(?:\?|$)/.test(href)), 'no-JS screenshot controls retain image links');
          return { ...row, images, imageLinks: links, screenshot: scheme === 'light' ? await screenshot(noJS, `${locale}-${route.replace('/', '') || 'home'}-nojs-${width}`) : undefined };
        } finally { await noJS.close(); }
      });
    }
  }
}

async function timeline(newPage) {
  for (const locale of locales) for (const width of [1440, 390]) {
    await scenario(`timeline/${locale}/${width}`, async () => {
      const page = await newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
      try {
        // Playwright 驱动浏览器时钟，仍运行每一帧正式 requestAnimationFrame 回调。
        await page.clock.install();
        await page.clock.pauseAt(await page.evaluate(() => Date.now() + 5));
        await page.goto(url(`/${locale}/`), { waitUntil: 'domcontentloaded' });
        const film = page.locator(filmSelector);
        await film.scrollIntoViewIfNeeded();
        await page.locator('[data-lifecycle][data-running="true"]').waitFor({ state: 'attached' });
        let elapsed = Number(await film.getAttribute('data-elapsed'));
        assert(elapsed < .5, 'timeline begins before first observation');
        const rows = [];
        for (const target of timelineTargets) {
          await page.clock.runFor(Math.max(0, target - elapsed) * 1000);
          const row = await scene(page);
          assertTimeline(row, target);
          if ([7.8, 18.3, 24.3, 33.7, 38.5, 46.5, 57.5, 78.1, 92.5].includes(target)) {
            const destination = path.join(artifacts, `timeline-${locale}-${width}-${target}.png`);
            await film.screenshot({ path: destination });
            report.screenshots.push(destination);
          }
          rows.push({ target, ...row });
          elapsed = Number(row.data.elapsed);
        }
        const retained = rows.filter(row => Number(row.data.elapsed) >= 50);
        for (const key of ['v1-history', 'experience', 'method', 'reference', 'folio', 'developer', 'planner', 'tester']) {
          assert(retained.every(row => row.objects[key].visible), `retained ${key}`);
          assert(retained.every(row => row.objects[key].transform === retained[0].objects[key].transform), `${key} position retained through two inspection loops`);
        }
        assert(retained.every(row => row.historyMarkup === retained[0].historyMarkup), 'published v1 never rewritten');
        return { locale, width, clock: 'Browser fake time executing production RAF; no seek API', completeSeconds: elapsed, rows };
      } finally { await page.close(); }
    });
  }
}

async function lifecycle(newPage) {
  for (const locale of locales) for (const width of [1440, 390]) {
    await scenario(`lifecycle/${locale}/${width}`, async () => {
      const page = await newPage({ viewport: { width, height: width === 390 ? 844 : 900 } }), steps = [];
      try {
        await page.goto(url(`/${locale}/`), { waitUntil: 'domcontentloaded' });
        const film = page.locator(filmSelector);
        await film.scrollIntoViewIfNeeded();
        const time = async () => Number(await film.getAttribute('data-elapsed'));
        const frozen = async label => {
          await page.waitForFunction(() => document.querySelector('[data-lifecycle]').dataset.running === 'false');
          const before = await time();
          await page.waitForTimeout(260);
          const after = await time();
          assert.equal(after, before, `${label} freezes elapsed`);
          steps.push({ label, before, after });
          return after;
        };
        const advances = async label => {
          await page.waitForFunction(() => document.querySelector('[data-lifecycle]').dataset.running === 'true');
          const before = await time();
          await page.waitForFunction(value => Number(document.querySelector('[data-lifecycle]').dataset.elapsed) > value + .18, before);
          const after = await time();
          assert(after > before + .18);
          steps.push({ label, before, after });
          return after;
        };
        const hidden = async value => page.evaluate(value => {
          if (value) Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
          else delete document.hidden;
          document.dispatchEvent(new Event('visibilitychange'));
        }, value);
        const transition = async (type, persisted) => page.evaluate(({ type, persisted }) => window.dispatchEvent(new PageTransitionEvent(type, { persisted })), { type, persisted });
        await advances('initial real-clock playback');
        await film.hover();
        await advances('pointer hover does not pause');
        await page.locator('body').click({ position: { x: 2, y: 2 } });
        for (let i = 0; i < 40 && !(await film.evaluate(n => document.activeElement === n)); i++) await page.keyboard.press('Tab');
        assert(await film.evaluate(n => document.activeElement === n && n.matches(':focus-visible')), 'actual keyboard focus reaches scene');
        await frozen('keyboard focus');
        await film.click({ position: { x: 12, y: 12 } });
        await advances('pointer clears keyboard pause while focused');
        await film.evaluate(n => n.blur());
        await film.evaluate(n => n.style.transform = 'translateY(4000px)');
        await frozen('actual IntersectionObserver offscreen');
        await film.evaluate(n => n.style.transform = '');
        await film.scrollIntoViewIfNeeded();
        await advances('onscreen resumes');
        await hidden(true);
        await frozen('simulated document.hidden');
        await transition('pagehide', true);
        await hidden(false);
        await frozen('visibility cannot clear retained pagehide pause');
        await transition('pageshow', true);
        await advances('simulated persisted pageshow');
        await hidden(true);
        const original = await frozen('before reduced motion');
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForFunction(() => {
          const root = document.querySelector('[data-lifecycle]');
          return root.dataset.static === 'true' && ['v1-history', 'method', 'reference', 'experience', 'review-label'].every(key => {
            const node = root.querySelector(`[data-part="${key}"]`), style = getComputedStyle(node);
            return style.visibility === 'visible' && style.display !== 'none';
          });
        });
        const reducedState = await scene(page);
        const visibilityChain = await film.locator('[data-part="v1-history"]').evaluate(node => {
          const chain = [];
          for (let n = node; n; n = n.parentElement) {
            const style = getComputedStyle(n);
            chain.push({ tag: n.tagName, part: n.dataset.part, display: style.display, visibility: style.visibility, opacity: style.opacity, attributes: n.getAttribute('style') });
            if (n.matches('[data-lifecycle]')) break;
          }
          return chain;
        });
        (report.lifecycleReducedStates ||= []).push({ locale, width, original, reducedState, visibilityChain });
        const reducedScreenshot = path.join(artifacts, `lifecycle-reduced-${locale}-${width}.png`);
        await film.screenshot({ path: reducedScreenshot }); report.screenshots.push(reducedScreenshot);
        assertFinal(reducedState);
        assert.equal(await frozen('reduced motion complete static presentation'), original);
        await hidden(false);
        assert.equal(await frozen('reduce remains static when visible'), original);
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.waitForFunction(() => document.querySelector('[data-lifecycle]').dataset.running === 'true');
        assert((await time()) < original + .2, 'restores original clock rather than static final time');
        await advances('restore dynamic preference');
        const resizedWidth = width === 390 ? 1440 : 390;
        await page.setViewportSize({ width: resizedWidth, height: 900 });
        await film.scrollIntoViewIfNeeded();
        await advances('resize preserves playback');
        await transition('pagehide', true);
        const retained = await frozen('simulated bfcache retained pagehide');
        await page.waitForTimeout(300);
        await transition('pageshow', true);
        await advances('simulated bfcache restore does not include inactive time');
        assert((await time()) < retained + 1, 'no inactive-time catchup');
        const viewBox = await page.locator(`${filmSelector} svg`).getAttribute('viewBox');
        await transition('pagehide', false);
        const disposedAt = await frozen('nonpersisted pagehide disposal');
        await film.evaluate(root => {
          window.__marketingAfterDisposeMutations = 0;
          new MutationObserver(records => window.__marketingAfterDisposeMutations += records.length).observe(root, { attributes: true, childList: true, characterData: true, subtree: true });
        });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.setViewportSize({ width, height: 900 });
        await hidden(false);
        await transition('pageshow', true);
        await film.dispatchEvent('pointerdown');
        assert.equal(await frozen('disposed listeners cannot restart RAF'), disposedAt);
        assert.equal(await page.locator(`${filmSelector} svg`).getAttribute('viewBox'), viewBox, 'resize listener removed on disposal');
        assert.equal(await page.evaluate(() => window.__marketingAfterDisposeMutations), 0, 'no DOM painting after disposal');
        return { locale, width, realClock: true, visibility: 'simulated document.hidden property/event; not OS background', bfcache: 'simulated PageTransitionEvent persisted true; not actual browser cache admission', disposal: 'simulated nonpersisted pagehide', steps };
      } finally { await page.close(); }
    });
    await scenario(`lifecycle/${locale}/${width}/route-disposal`, async () => {
      const page = await newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
      try {
        await page.goto(url(`/${locale}/`), { waitUntil: 'networkidle' });
        await page.locator(filmSelector).scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector('[data-lifecycle]')?.dataset.running === 'true');
        await page.evaluate(() => { window.__marketingOldRoot = document.querySelector('[data-lifecycle]'); });
        await page.locator('.product-hero .employee-secondary').click();
        await page.waitForURL(new RegExp(`/${locale}/architecture/?$`));
        const retainedContext = await page.evaluate(() => !!window.__marketingOldRoot);
        if (!retainedContext) return { mechanism: 'Full document navigation destroyed the prior JS context' };
        await page.evaluate(() => {
          const root = window.__marketingOldRoot;
          if (root.isConnected) throw Error('Old Hero remains connected after navigation');
          if (root.dataset.running !== 'false') throw Error('Detached Hero RAF remains marked running');
          window.__marketingRouteTime = root.dataset.elapsed;
          window.__marketingRouteMutations = 0;
          new MutationObserver(records => window.__marketingRouteMutations += records.length).observe(root, { attributes: true, childList: true, characterData: true, subtree: true });
        });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.setViewportSize({ width: width === 390 ? 1440 : 390, height: 900 });
        await page.evaluate(() => {
          window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
          document.dispatchEvent(new Event('visibilitychange'));
          window.__marketingOldRoot.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        });
        await page.waitForTimeout(300);
        const state = await page.evaluate(() => ({ running: window.__marketingOldRoot.dataset.running, before: window.__marketingRouteTime, after: window.__marketingOldRoot.dataset.elapsed, mutations: window.__marketingRouteMutations }));
        assert.equal(state.running, 'false'); assert.equal(state.after, state.before); assert.equal(state.mutations, 0);
        return { mechanism: 'Actual Next client route unmount; retained detached root observed', ...state };
      } finally { await page.close(); }
    });
  }
}

async function navigation(newPage) {
  for (const locale of locales) for (const width of [1440, 390]) {
    const page = await newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: 'reduce' });
    try {
      await scenario(`navigation/${locale}/${width}/hero-cta`, async () => {
        await page.goto(url(`/${locale}/`), { waitUntil: 'networkidle' });
        const primary = page.locator('.product-hero .employee-primary').first();
        const href = await primary.getAttribute('href');
        assert.equal(href, '#workflow', 'formal primary CTA retains the work section, not draft navigation');
        await primary.click();
        const destination = new URL(href, url(`/${locale}/`));
        await page.waitForURL(value => value.pathname.replace(/\/$/, '') === destination.pathname.replace(/\/$/, '') && value.hash === destination.hash);
        if (destination.hash) assert.equal(await page.locator(destination.hash).count(), 1, 'CTA anchor target survives');
        await page.goto(url(`/${locale}/`), { waitUntil: 'networkidle' });
        await page.locator('.product-hero .employee-secondary').click();
        await page.waitForURL(new RegExp(`/${locale}/architecture/?$`));
        assert.equal(await page.locator('h1').count(), 1);
        return { primary: destination.href, secondary: page.url() };
      });
      await scenario(`navigation/${locale}/${width}/old-anchors`, async () => {
        const anchors = { '': ['workflow', 'people-and-teams', 'digital-employees', 'governance', 'product-access', 'pilot', 'first-use'], 'concept/': ['collaboration', 'delivery', 'employees', 'knowledge'], 'architecture/': ['system', 'boundaries', 'cost-governance', 'deployment'] };
        const visited = [];
        for (const [route, ids] of Object.entries(anchors)) {
          await page.goto(url(`/${locale}/${route}`), { waitUntil: 'networkidle' });
          for (const id of ids) {
            assert.equal(await page.locator(`[id="${id}"]`).count(), 1, `legacy anchor #${id}`);
            await page.evaluate(id => { location.hash = id; }, id);
            assert.equal(new URL(page.url()).hash, `#${id}`);
            await page.waitForFunction(id => { const n = document.getElementById(id); if (!n) return false; const b = n.getBoundingClientRect(); return b.y >= -1 && b.y < innerHeight; }, id);
            const box = await page.locator(`[id="${id}"]`).boundingBox();
            assert(box && box.y >= -1 && box.y < (width === 390 ? 844 : 900), `#${id} reachable by native fragment`);
            visited.push(`${route}#${id}`);
          }
        }
        return { visited };
      });
      await scenario(`navigation/${locale}/${width}/zoom-escape-focus`, async () => {
        await page.goto(url(`/${locale}/concept/`), { waitUntil: 'networkidle' });
        const trigger = page.locator('[data-screenshot-trigger]').first();
        await trigger.click();
        const dialog = page.locator('dialog[open]');
        await dialog.waitFor({ state: 'visible' });
        assert(await dialog.evaluate(n => n.contains(document.activeElement)), 'native dialog traps initial focus');
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => !document.querySelector('dialog[open]'));
        assert(await trigger.evaluate(n => document.activeElement === n), 'Escape returns focus to exact screenshot trigger');
        return { source: await trigger.getAttribute('href') };
      });
      await scenario(`navigation/${locale}/${width}/language`, async () => {
        const other = locale === 'zh' ? 'en' : 'zh';
        await page.goto(url(`/${locale}/concept/?verification=1#delivery`), { waitUntil: 'networkidle' });
        const button = page.locator('.site-language-trigger');
        await button.click();
        await page.keyboard.press('Escape');
        assert(await button.evaluate(n => document.activeElement === n), 'language Escape restores focus');
        assert.equal(await button.getAttribute('aria-expanded'), 'false');
        await button.click();
        const link = page.locator(`.site-language-option[href*="/${other}/concept/"]`);
        assert.equal(await link.count(), 1);
        assert((await link.getAttribute('href')).endsWith('?verification=1#delivery'), 'language retains query and fragment');
        await link.click();
        await page.waitForURL(value => value.pathname.includes(`/${other}/concept/`) && value.hash === '#delivery' && value.search === '?verification=1');
        assert.equal(await page.locator('h1').count(), 1);
        return { destination: page.url() };
      });
      if (width === 390) await scenario(`navigation/${locale}/mobile-menu`, async () => {
        await page.goto(url(`/${locale}/`), { waitUntil: 'networkidle' });
        const menu = page.locator('.site-masthead__mobile-menu'), summary = menu.locator('summary');
        await summary.click();
        assert(await menu.evaluate(n => n.open));
        await page.keyboard.press('Escape');
        assert(!(await menu.evaluate(n => n.open)));
        assert(await summary.evaluate(n => document.activeElement === n));
        await summary.click();
        await menu.locator(`a:is([href$="/${locale}/concept"],[href$="/${locale}/concept/"])`).click();
        await page.waitForURL(new RegExp(`/${locale}/concept/?$`));
        assert(!(await menu.evaluate(n => n.open)), 'mobile menu closes after actual route navigation');
        return { destination: page.url() };
      });
      await scenario(`navigation/${locale}/${width}/management-guides`, async () => {
        const destinations = [];
        for (const slug of ['usage', 'costs', 'model-policies']) {
          await page.goto(url(`/${locale}/`), { waitUntil: 'networkidle' });
          const link = page.locator(`.governance-guides a:is([href$="/docs/management/${slug}"],[href$="/docs/management/${slug}/"])`);
          assert.equal(await link.count(), 1, `governance guide ${slug} retained`);
          await link.click();
          await page.waitForURL(new RegExp(`/${locale}/docs/management/${slug}/?$`));
          assert.equal(await page.locator('h1').count(), 1);
          assert.equal(await page.locator('.scope-marketing').count(), 0);
          destinations.push(page.url());
        }
        return { destinations };
      });
      await scenario(`navigation/${locale}/${width}/docs-search`, async () => {
        await page.goto(url(`/${locale}/docs/`), { waitUntil: 'networkidle' });
        assert.equal(await page.locator('.scope-marketing').count(), 0, 'marketing theme does not leak into docs');
        const input = page.locator('#docs-search');
        const all = await page.locator('.docs-topic li a').count();
        assert(all > 0);
        await input.fill('digital-employees');
        await page.waitForFunction(() => document.querySelectorAll('.docs-topic li a').length === 1);
        assert((await page.locator('.docs-topic li a').getAttribute('href')).includes('/digital-employees'));
        await input.fill('verification-query-that-matches-no-guide');
        await page.locator('.docs-search-empty').waitFor({ state: 'visible' });
        assert.equal(await page.locator('.docs-topic li a').count(), 0);
        await page.locator('.docs-search button').click();
        await page.waitForFunction(count => document.querySelectorAll('.docs-topic li a').length === count, all);
        const link = page.locator('.docs-topic li a').first(), href = await link.getAttribute('href');
        await link.click();
        await page.waitForURL(value => value.pathname.replace(/\/$/, '') === new URL(href, base).pathname.replace(/\/$/, ''));
        assert.equal(await page.locator('h1').count(), 1);
        const article = new URL(page.url()), other = locale === 'zh' ? 'en' : 'zh';
        article.search = '?verification=article'; article.hash = '#main';
        await page.goto(article.href, { waitUntil: 'networkidle' });
        await page.locator('.site-language-trigger').click();
        await page.locator(`.site-language-option[href*="/${other}/docs/"]`).click();
        const translatedPath = article.pathname.replace(`/${locale}/`, `/${other}/`);
        await page.waitForURL(value => value.pathname === translatedPath && value.search === article.search && value.hash === article.hash);
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.locator('.scope-marketing').count(), 0);
        return { guides: all, article: article.href, translatedArticle: page.url() };
      });
    } finally { await page.close(); }
  }
}

async function learningParts(root, activeSelector) {
  return root.evaluate((root, activeSelector) => {
    const active = root.querySelector(activeSelector);
    if (!active || getComputedStyle(active).display === 'none') throw Error(`Active learning layout missing: ${activeSelector}`);
    const parts = {};
    for (const node of active.querySelectorAll('[data-part]')) {
      let opacity = 1;
      for (let parent = node; parent && parent !== root; parent = parent.parentElement) {
        const style = getComputedStyle(parent);
        opacity *= style.display === 'none' || style.visibility === 'hidden' ? 0 : Number(style.opacity);
      }
      (parts[node.dataset.part] ||= []).push({ opacity, text: node.textContent, paths: node.querySelectorAll('path').length });
    }
    return { data: { ...root.dataset }, position: Number(root.querySelector('svg[data-position]')?.dataset.position), readout: root.querySelector('[data-anatomy-readout],[data-story-readout]')?.textContent, parts };
  }, activeSelector);
}

function learningOpacity(row, key, expected) {
  const parts = row.parts[key];
  assert(parts?.length, `learning part ${key} exists`);
  for (const part of parts) {
    if (expected === 'rising') assert(part.opacity > .1, `${key} candidate is visibly rising`);
    else if (expected === 0) assert(part.opacity < .001, `${key} is not yet visible (opacity ${part.opacity})`);
    else assert(part.opacity > .98, `${key} is fully visible (opacity ${part.opacity})`);
  }
}

async function learning(newPage) {
  for (const locale of locales) for (const width of [1440, 390]) {
    await scenario(`learning/${locale}/${width}/assets`, async () => {
      const page = await newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
      try {
        await page.clock.install();
        await page.goto(url(`/${locale}/`), { waitUntil: 'domcontentloaded' });
        const root = page.locator('.work-story-assets .story-playback[data-story="assets"]');
        await root.scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector('[data-story="assets"]')?.dataset.running === 'true');
        await page.clock.pauseAt(await page.evaluate(() => Date.now() + 20));
        const active = `svg[data-layout="${width <= 1023 ? 'mobile' : 'desktop'}"]`, rows = [];
        let elapsed = Number(await root.getAttribute('data-elapsed'));
        for (const target of [3.3, 5.4, 6.18, 9.3, 12.2, 14.6, 20.2, 32.2]) {
          await page.clock.runFor(Math.max(0, target - elapsed) * 1000);
          const row = await learningParts(root, active);
          (report.learningObservations ||= []).push({ kind: 'assets', locale, width, target, ...row });
          elapsed = Number(row.data.elapsed);
          assert(Math.abs(elapsed - target) < .08, `assets actual elapsed ${elapsed} vs ${target}`);
          learningOpacity(row, 'candidate', 1);
          learningOpacity(row, 'human-edit', target >= 5.4 ? 1 : 0);
          learningOpacity(row, 'confirmed', target >= 6.18 ? 1 : 0);
          learningOpacity(row, 'skill', target >= 9.3 ? 1 : 0);
          for (const key of ['method-one', 'method-two', 'method-three', 'provenance']) learningOpacity(row, key, target >= 9.3 ? 1 : 0);
          if (target === 12.2) learningOpacity(row, 'reference', 1);
          if (target === 14.6) learningOpacity(row, 'next-delivery', 1);
          const candidate = row.parts.candidate.map(part => part.text).join(' '), edit = row.parts['human-edit'].map(part => part.text).join(' ');
          assert(candidate.includes(locale === 'zh' ? '导出并核对结果' : 'export + check'), 'actual AI candidate content');
          assert(edit.includes(locale === 'zh' ? '沿用权限' : 'access + row count'), 'actual human-revised content');
          if (target >= 5.4) assert(row.parts['human-edit'].some(part => part.paths > 0), 'candidate strike is an actual painted path');
          rows.push({ target, ...row });
          if ([3.3, 5.4, 6.18, 9.3].includes(target)) {
            const destination = path.join(artifacts, `learning-assets-${locale}-${width}-${target}.png`);
            await root.screenshot({ path: destination }); report.screenshots.push(destination);
          }
        }
        return { locale, width, rows, contract: 'AI candidate → actual human content edit → confirmation/adoption → retained Skill, sources and references' };
      } finally { await page.close(); }
    });
    await scenario(`learning/${locale}/${width}/formation`, async () => {
      const page = await newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
      try {
        await page.clock.install();
        await page.goto(url(`/${locale}/concept/`), { waitUntil: 'domcontentloaded' });
        const root = page.locator('.home-workflow-figure .anatomy-live[data-variant="workflow"]');
        await root.scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector('.home-workflow-figure .anatomy-live')?.dataset.running === 'true');
        await page.clock.pauseAt(await page.evaluate(() => Date.now() + 20));
        const active = width <= 767 ? '.formation-mobile' : '.formation-desktop', rows = [];
        const gates = [
          { label: 'AI candidate before human edit', from: 1.35, to: 1.39, readout: locale === 'zh' ? 'AI 从记录提出总结与方法候选。' : 'AI proposes summaries and methods from records.', parts: { 'source-method': 'rising', 'source-role': 0, 'source-confirmed': 0, 'agent-visible': 0 } },
          { label: 'human edit before adoption', from: 1.75, to: 1.79, readout: locale === 'zh' ? '人审核并修改方法：按权限核对行数。' : 'A person reviews and edits: check access and rows.', parts: { 'source-method': 1, 'source-role': 1, 'source-confirmed': 0, 'agent-visible': 0 } },
          { label: 'adoption before employee creation', from: 2, to: 2.02, readout: locale === 'zh' ? '人确认修改并决定采用职责、方法与工具配置。' : 'A person confirms the edits and adopts the role, method and tools.', parts: { 'source-confirmed': 1, 'agent-visible': 0, 'employee-ready': 0 } },
          { label: 'equipped before delegation', from: 3, to: 3.02, parts: { 'source-confirmed': 1, 'agent-visible': 1, 'employee-ready': 1, 'delegated-work': 0 } },
          { label: 'final human review with retained evidence', from: 5, to: 5.01, parts: { 'source-log': 1, 'source-experience': 1, 'source-confirmed': 1, 'agent-visible': 1, 'employee-ready': 1, 'human-approved': 1 } },
        ];
        let frames = 0;
        for (const gate of gates) {
          let position = Number(await root.locator('svg[data-position]').getAttribute('data-position'));
          while (position < gate.from && frames++ < 500) {
            await page.clock.runFor(80);
            position = Number(await root.locator('svg[data-position]').getAttribute('data-position'));
          }
          assert(position >= gate.from && position <= gate.to, `${gate.label}: actual position ${position} outside [${gate.from},${gate.to}]`);
          const row = await learningParts(root, active);
          (report.learningObservations ||= []).push({ kind: 'formation', locale, width, gate: gate.label, ...row });
          const destination = path.join(artifacts, `learning-formation-${locale}-${width}-${rows.length + 1}.png`);
          await root.screenshot({ path: destination }); report.screenshots.push(destination);
          if (gate.readout) assert.equal(row.readout, gate.readout, `actual live readout at position ${row.position}`);
          for (const [key, expected] of Object.entries(gate.parts)) learningOpacity(row, key, expected);
          assert(row.parts['source-method'].some(part => part.text.includes(locale === 'zh' ? '候选：核对导出' : 'Check export')), 'AI candidate text exists in actual SVG');
          assert(row.parts['source-role'].some(part => part.text.includes(locale === 'zh' ? '按权限核对行数' : 'Access + rows')), 'human changes actual SVG content');
          assert(row.parts['source-role'].some(part => part.paths > 0), 'human edit strikes the earlier candidate');
          rows.push({ label: gate.label, ...row });
        }
        return { locale, width, rows, contract: 'Observed actual tour positions; no production seek. Formation intentionally resets in a later demonstration tour, not immutable historical execution.' };
      } finally { await page.close(); }
    });
  }
}

async function main() {
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const launch = { headless: true };
  if (process.env.CHROME_EXECUTABLE) launch.executablePath = process.env.CHROME_EXECUTABLE;
  const browser = await chromium.launch(launch);
  const newPage = async options => {
    const page = await browser.newPage(options);
    page.setDefaultTimeout(Number(process.env.ACTION_TIMEOUT_MS || 10000));
    page.setDefaultNavigationTimeout(Number(process.env.NAVIGATION_TIMEOUT_MS || 15000));
    page.on('pageerror', error => report.errors.push({ url: page.url(), message: String(error) }));
    page.on('response', response => {
      if (response.status() >= 400 && ['document', 'image'].includes(response.request().resourceType())) {
        report.errors.push({ url: response.url(), message: `HTTP ${response.status()} ${response.request().resourceType()}` });
      }
    });
    return page;
  };
  try {
    if (mode === 'baseline') {
      report.scope = 'Existing served formal pages before rebuilding; not validation of new source.';
      for (const locale of ['zh', 'en']) for (const width of [1440, 390]) {
        await scenario(`baseline/${locale}/${width}`, async () => {
          const page = await newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: 'reduce' });
          try {
            await page.goto(url(`/${locale}/`), { waitUntil: 'networkidle' });
            await page.evaluate(() => document.fonts.ready);
            const row = await layout(page);
            assert.equal(row.h1.length, 1);
            assert.equal(row.scrollWidth, width);
            return { ...row, screenshot: await screenshot(page, `baseline-${locale}-${width}`) };
          } finally { await page.close(); }
        });
      }
      report.lighthouse = { measuredByThisScript: false, reason: 'This script captures browser geometry/screenshots only. Run an existing Lighthouse tool separately for a comparable performance baseline; navigation timing here is diagnostic, not Lighthouse.' };
    } else {
      const selected = new Set(mode === 'all' ? ['geometry', 'timeline', 'lifecycle', 'navigation', 'learning'] : mode.split(','));
      for (const name of selected) assert(['geometry', 'timeline', 'lifecycle', 'navigation', 'learning'].includes(name), `Unknown mode ${name}`);
      report.scope = 'Served formal-site regression. Build and server lifecycle are owned by the caller.';
      if (selected.has('geometry')) await geometry(newPage);
      if (selected.has('timeline')) await timeline(newPage);
      if (selected.has('lifecycle')) await lifecycle(newPage);
      if (selected.has('navigation')) await navigation(newPage);
      if (selected.has('learning')) await learning(newPage);
    }
  } finally { await browser.close(); }
}

main().catch(error => report.failures.push({ name: 'harness', message: error.stack || String(error) })).finally(() => {
  report.finishedAt = new Date().toISOString();
  report.passed = report.failures.length === 0 && report.errors.length === 0 && report.cases.length > 0;
  fs.writeFileSync(path.join(artifacts, `${mode}.json`), JSON.stringify(report, null, 2) + '\n');
  console.log(`${report.passed ? 'PASS' : 'FAIL'} ${report.cases.length} cases; ${report.errors.length} page errors; artifacts: ${artifacts}`);
  if (!report.passed) process.exitCode = 1;
});
