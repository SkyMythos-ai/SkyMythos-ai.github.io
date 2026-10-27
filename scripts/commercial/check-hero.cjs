const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const portable = require('./browser.cjs');
if (require.main === module) portable.trackIdentity('hero');

function measureHero() {
  const box = element => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height, center: rect.left + rect.width / 2 };
  };
  const text = element => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return box({ getBoundingClientRect: () => range.getBoundingClientRect() });
  };
  const contrast = (foreground, background) => {
    const luminance = color => {
      const values = color.match(/[\d.]+/g).slice(0, 3).map(value => {
        const channel = Number(value) / 255;
        return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
      });
      return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
    };
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (values[0] + .05) / (values[1] + .05);
  };
  const hero = document.querySelector('.hero');
  const title = hero.querySelector('h1');
  const description = hero.querySelector('.hero-lede');
  const buttons = [...hero.querySelectorAll('.actions a')].map(link => {
    const style = getComputedStyle(link);
    return { ...box(link), label: link.textContent, contrast: contrast(style.color, style.backgroundColor), href: link.getAttribute('href') };
  });
  const image = hero.querySelector('.hero-screen img');
  const background = getComputedStyle(hero, '::before');
  return {
    width: innerWidth,
    height: innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    header: box(document.querySelector('.masthead')),
    title: { ...box(title), text: text(title), lines: title.getBoundingClientRect().height / parseFloat(getComputedStyle(title).lineHeight) },
    description: { ...box(description), text: text(description), lines: description.getBoundingClientRect().height / parseFloat(getComputedStyle(description).lineHeight) },
    buttons,
    image: { ...box(image), src: image.getAttribute('src'), naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight },
    frame: box(hero.querySelector('.hero-screen')),
    caption: hero.querySelector('figcaption').textContent,
    background: { image: background.backgroundImage, color: background.backgroundColor, width: background.width, pointerEvents: background.pointerEvents },
    titleColor: getComputedStyle(title).color,
  };
}

function assertHero(row) {
  const context = `${row.width}x${row.height}`;
  assert.equal(row.scrollWidth, row.width, `Hero has no horizontal overflow at ${context}`);
  assert(Math.abs(row.title.text.center - row.width / 2) <= 2, `Actual title text must be centered at ${context}, got ${row.title.text.center}`);
  assert(Math.abs(row.description.text.center - row.width / 2) <= 2, `Actual description text must be centered at ${context}`);
  assert(row.title.lines <= 2.05, `Title stays within two lines at ${context}`);
  assert(row.description.lines <= 4.05, `Description stays brief at ${context}`);
  assert(row.title.top >= row.header.bottom + 12, `Header clears the title at ${context}`);
  assert(row.title.top - row.header.bottom <= 80, `Hero does not start halfway down the screen at ${context}`);
  assert(row.description.top >= row.title.bottom, `Description follows title at ${context}`);
  assert.equal(row.buttons.length, 2, 'One primary and one secondary hero action');
  const [primary, secondary] = row.buttons;
  assert(Math.abs((primary.left + secondary.right) / 2 - row.width / 2) <= 2, `Actual action pair is centered at ${context}`);
  assert(Math.abs(primary.top - secondary.top) <= 1, `Actions share a row at ${context}`);
  for (const button of row.buttons) {
    assert(button.top >= row.description.bottom, `Actions follow description at ${context}`);
    assert(button.bottom <= row.height - 8, `Action is visible without scrolling at ${context}`);
    assert(button.height >= 44 && button.height <= 56, `Action has a usable single-line height at ${context}`);
    assert(button.left >= 12 && button.right <= row.width - 12, `Action stays inside the viewport at ${context}`);
    assert(button.contrast >= 4.5, `Action contrast is ${button.contrast} at ${context}`);
  }
  assert.equal(primary.href, '#contact');
  assert.equal(secondary.href, new URL('product/', portable.url).pathname);
  const gap = row.image.top - Math.max(primary.bottom, secondary.bottom);
  assert(gap >= 16 && gap <= 58, `Large product image immediately follows actions at ${context}, gap ${gap}`);
  assert(row.image.top < row.height - 8, `Initial screen includes the product image at ${context}`);
  if (row.width >= 1280) assert(row.image.top - row.header.bottom >= 200 && row.image.top - row.header.bottom <= 360, `Compact desktop introduction at ${context}`);
  const referenceRoot = portable.referenceRoot;
  const manifest = JSON.parse(fs.readFileSync(path.join(referenceRoot, 'manifest.json'), 'utf8'));
  const currentImage = manifest.images.workbench.path;
  assert(currentImage, 'Hero must use a captured current product image');
  const bytes = fs.readFileSync(path.join(referenceRoot, currentImage));
  assert.equal(bytes.subarray(1, 4).toString('ascii'), 'PNG');
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  assert.equal(row.image.src, portable.referencePath + currentImage, 'Hero references the published full-resolution product capture');
  assert.equal(row.image.naturalWidth, width);
  assert.equal(row.image.naturalHeight, height);
  assert(Math.abs(row.image.width / row.image.height - width / height) < .01, `Real image is not cropped at ${context}`);
  assert(Math.abs(row.image.width - row.frame.width + 2) < 1, 'Image fills its one-pixel frame without a matte');
  assert(Math.abs(row.image.left - row.frame.left - 1) < 1, 'No inner horizontal padding');
  assert(Math.abs(row.image.top - row.frame.top - 1) < 1, 'No inner top padding');
  assert(Math.abs(row.frame.center - row.width / 2) < 1, 'Product frame is centered');
  if (row.width >= 1280) assert.equal(row.frame.width, Math.min(1680, row.width - 48), 'Existing maximum product display width is retained');
  assert(row.caption.includes('示例数据') && row.caption.includes('非实时运行'), 'Product evidence boundaries remain');
  assert.notEqual(row.background.image, 'none', 'Hero has its own atmospheric background');
  assert.equal(row.background.pointerEvents, 'none', 'Decorative background never blocks controls');
}

module.exports = { measureHero, assertHero };

if (require.main === module) (async () => {
  const directory = portable.evidence;
  fs.mkdirSync(directory, { recursive: true });
  const browser = await portable.launch();
  const errors = [];
  const rows = [];
  try {
    for (const [width, height] of [[2560,1440],[1920,1080],[1440,1000],[1280,720],[900,900],[390,844],[320,568],[844,390]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference' });
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('requestfailed', request => { if (!require('./transport.cjs').recordExpectedFailure(request)) errors.push(`${request.url()}: ${request.failure()?.errorText}`); });
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      await page.goto(portable.url, { waitUntil: 'load' });
      await page.evaluate(async () => { await document.fonts.ready; await document.querySelector('.hero-screen img').decode(); });
      const row = await page.evaluate(measureHero);
      rows.push(row);
      await page.screenshot({ path: path.join(directory, `hero-${width}.png`) });
      assertHero(row);
      await page.close();
      console.log(`PASS centered hero ${width}x${height}`);
    }
    assert.deepEqual(errors, []);
  } catch (error) {
    errors.push(error.stack);
    console.error(error.stack);
    process.exitCode = 1;
  } finally {
    fs.writeFileSync(path.join(directory, 'results.json'), JSON.stringify({ at: new Date().toISOString(), rows, errors }, null, 2));
    await browser.close();
  }
})();
