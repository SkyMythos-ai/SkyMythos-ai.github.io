import "server-only";

import type { CSSProperties } from "react";
import {
  getProductImages,
  getProductSequence,
  getProductTerminal,
  productReferenceManifestUrl,
  productReferenceRevision,
  type ProductSceneName,
} from "@/lib/product-reference";

const labels: Record<ProductSceneName, string> = {
  delivery: "真实产品线程与交付工作区节选。示例数据，只读演示，结果仍需人工验收。",
  methods: "真实产品员工方案节选。示例数据，只读演示，等待人工确认，尚未创建员工。",
  management: "真实产品连接清单与配置弹窗节选。示例数据，只读演示，不提交凭据或发起授权。",
};

const embedding = "[data-product-viewport]{position:relative;width:100%;height:100%;overflow:hidden}[data-product-canvas]{position:absolute;left:0;top:0;width:var(--reference-width);height:var(--reference-height);transform:translate3d(var(--reference-x),var(--reference-y),0)}[data-product-frame]{width:100%;height:100%}[data-product-frame][hidden]{display:none!important}";
const stylesheetBoundary = "[data-product-viewport]{visibility:hidden}[data-product-style-status]{position:absolute;inset:0;box-sizing:border-box;display:grid;place-content:center;gap:12px;margin:0;padding:24px;background:#fff;color:#536274;font:13px/1.8 system-ui,sans-serif;text-align:center}[data-product-style-status] a{color:#1f3b64;text-decoration:underline}[data-product-style-error]{display:none}:host([data-product-styles=ready]) [data-product-viewport]{visibility:visible}:host([data-product-styles=ready]) [data-product-style-status]{display:none}:host([data-product-styles=error]) [data-product-style-pending]{display:none}:host([data-product-styles=error]) [data-product-style-error]{display:inline}";
const escapeAttribute = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

/**
 * 默认 SSR 只发布完整只读终态；playback 预置全部已验证帧，仍以终态作为无脚本回退。
 * 产品 DOM 是不透明边界，不能经营销 HTML→React parser 重建。
 * 浏览器 runtime 接管 ShadowRoot 内部；客户端换页时负责激活声明式 template，失败保留此终态。
 * host 按场景固定 key，防止换页时不同场景复用无法由 innerHTML 更新的既有 ShadowRoot。
 */
export function ProductDemo({ name, playback = false }: { name: ProductSceneName; playback?: boolean }) {
  const terminal = getProductTerminal(name);
  const { scene, frame, html, cssUrl } = terminal;
  const frames = playback ? getProductSequence(name).frames : [{ stage: "result", frame, html }];
  const style = {
    "--native-height": `${scene.crop.height}px`,
    "--reference-width": `${scene.width}px`,
    "--reference-height": `${scene.height}px`,
    "--reference-x": `${-scene.crop.x}px`,
    "--reference-y": `${-scene.crop.y}px`,
    WebkitFontSmoothing: "auto",
  } as CSSProperties;
  // 屏外 CSS 不阻塞首屏；样式就绪前保留几何并显示可读原图入口，禁止闪现无样式产品 DOM。
  // 固定 load/error handler 不依赖站点 bundle；无脚本则同步应用完整 CSS，不隐藏任何终态。
  const stylesheet = `<link rel="stylesheet" href="${escapeAttribute(cssUrl)}" media="print" onload="this.onload=null;this.media='all';this.getRootNode().host.dataset.productStyles='ready'" onerror="this.getRootNode().host.dataset.productStyles='error'"><noscript><link rel="stylesheet" href="${escapeAttribute(cssUrl)}"><style>[data-product-viewport]{visibility:visible}[data-product-style-status]{display:none}</style></noscript>`;
  const status = `<p data-product-style-status><span data-product-style-pending>正在载入完整产品界面。</span><span data-product-style-error>产品界面样式暂时无法加载。</span><a href="${escapeAttribute(getProductImages()[name].src)}" target="_blank" rel="noopener">查看完整产品原图 ↗</a></p>`;
  const frameMarkup = frames.map(({ stage, frame: snapshot, html: source }) => `<div data-product-frame="${snapshot.id}" data-reference-frame="${snapshot.id}" data-phase="${snapshot.phase}" data-label="${escapeAttribute(snapshot.label)}"${stage === "result" ? "" : " hidden"}>${source}</div>`).join("");
  const playbackStyle = playback ? ":host([data-running=false]) *, :host([data-running=false]) *::before, :host([data-running=false]) *::after{animation-play-state:paused!important}" : "";
  const shadow = `<template shadowrootmode="open"><style>${embedding}${stylesheetBoundary}${playbackStyle}</style>${stylesheet}<div data-product-viewport><div data-product-canvas>${frameMarkup}</div></div>${status}</template>`;

  return (
    <div
      key={name}
      className={`native-demo native-demo-${name}`}
      data-native-demo={name}
      data-reference-manifest={productReferenceManifestUrl}
      data-reference-frame={frame.id}
      data-reference-terminal={scene.terminal}
      data-product-revision={productReferenceRevision}
      data-phase={frame.phase}
      data-inspection="result"
      data-complete="true"
      data-elapsed="0.000"
      data-running="false"
      data-mode="static"
      data-theme="light"
      data-density="compact"
      lang="zh-CN"
      style={style}
      role="img"
      aria-label={labels[name]}
      tabIndex={0}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: shadow }}
    />
  );
}
