import "server-only";

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { basePath } from "@/lib/site";
import baseline from "../../scripts/product-reference/baseline.json";

export type ProductSceneName = "delivery" | "methods" | "management";
type ProductStage = "start" | "middle" | "result";
type ProductImageName = "workbench" | ProductSceneName;

export type ProductFrame = {
  id: string;
  path: string;
  sha256: string;
  phase: string;
  label: string;
};

export type ProductScene = {
  width: number;
  height: number;
  crop: { x: number; y: number; width: number; height: number };
  terminal: string;
  frames: Record<ProductStage, ProductFrame>;
};

type ProductManifest = {
  schemaVersion: 2;
  product: { revision: string };
  css: string;
  scenes: Record<ProductSceneName, ProductScene>;
  images: Record<ProductImageName, { path: string; width: number; height: number }>;
  assets: Record<string, string>;
};

export const productReferenceRevision = baseline.revision;
export const productReferenceBase = `${basePath}/product-reference/${productReferenceRevision}`;
export const productReferenceManifestUrl = `${productReferenceBase}/manifest.json`;
const directory = path.join(process.cwd(), "public/product-reference", productReferenceRevision);
const sha256 = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

// 完整安全与资源集合门禁由 build 的 validate.cjs 执行；SSR 再固定 manifest 和所读终态的字节身份。
function readManifest(): ProductManifest {
  const bytes = readFileSync(path.join(directory, "manifest.json"));
  if (sha256(bytes) !== baseline.manifestSha256) {
    throw new Error("Product manifest changed without an explicitly reviewed baseline");
  }
  return JSON.parse(bytes.toString("utf8")) as ProductManifest;
}

/** 返回带站点 basePath 的完整截图；workbench 与 delivery 共用同一原图，不裁切。 */
export function getProductImages(): Record<ProductImageName, { src: string; width: number; height: number }> {
  const images = readManifest().images;
  const image = (name: ProductImageName) => ({
    src: `${productReferenceBase}/${images[name].path}`,
    width: images[name].width,
    height: images[name].height,
  });
  return { workbench: image("workbench"), delivery: image("delivery"), methods: image("methods"), management: image("management") };
}

/** 仅在服务端读取场景终态；缺失/损坏直接失败，不重采、不退回手绘产品副本。 */
export function getProductTerminal(name: ProductSceneName): {
  scene: ProductScene;
  frame: ProductFrame;
  html: string;
  cssUrl: string;
} {
  const manifest = readManifest();
  const scene = manifest.scenes[name];
  if (!scene) throw new Error(`Unknown product scene: ${name}`);
  const frame = scene.frames.result;
  const bytes = readFileSync(path.join(directory, frame.path));
  if (sha256(bytes) !== manifest.assets[frame.path] || frame.sha256 !== manifest.assets[frame.path]) {
    throw new Error(`Frozen product frame changed: ${frame.id}`);
  }
  return { scene, frame, html: bytes.toString("utf8"), cssUrl: `${productReferenceBase}/${manifest.css}` };
}
