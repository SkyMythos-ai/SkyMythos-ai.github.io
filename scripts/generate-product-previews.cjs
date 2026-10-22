const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

// 从实际截图生成缩略图与首屏重点取景，不拼接或改写界面；放大查看始终使用原图。
const files = ["keynote-order-delivery", "keynote-order-execution", "formation-plan"];
(async () => {
  const target = path.resolve(__dirname, "../public/images/product/previews");
  fs.mkdirSync(target, { recursive: true });
  for (const name of files) for (const width of [960, 1600]) {
    await sharp(path.resolve(__dirname, `../public/images/product/${name}.png`)).resize({ width, withoutEnlargement: true }).webp({ quality: 88 }).toFile(path.join(target, `${name}-${width}.webp`));
  }
  const crops = {
    "keynote-order-delivery": { left: 740, top: 600, width: 1400, height: 660 },
    "keynote-order-execution": { left: 740, top: 340, width: 1460, height: 1040 },
  };
  for (const [name, crop] of Object.entries(crops)) for (const width of [960, 1600]) {
    await sharp(path.resolve(__dirname, `../public/images/product/${name}.png`))
      .extract(crop).resize({ width }).webp({ quality: 90 })
      .toFile(path.join(target, `${name}-focus-${width}.webp`));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
