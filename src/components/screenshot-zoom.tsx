"use client";

import { useRef, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

/** 原图链接在无脚本时仍可用；浏览器原生对话框负责焦点约束与 Escape。 */
export function ScreenshotZoom({ src, alt, caption, locale, width = 1440, height = 900, media, onOpenChange }: {
  src: string; alt: string; caption: string; locale: Locale; width?: number; height?: number;
  media?: ReactNode; onOpenChange?: (open: boolean) => void;
}) {
  const modal = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement>(null);
  const zh = locale === "zh";
  return <figure className="console-figure" data-ui="console-screenshot">
    <a ref={trigger} href={src} className="console-image-link" aria-label={`${zh ? "查看界面：" : "View screen: "}${alt}`} onClick={event => {
      if (!modal.current?.showModal) return;
      event.preventDefault();
      modal.current.showModal();
      onOpenChange?.(true);
    }}>
      {media ?? <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async"/>}
      <span className="console-enlarge" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 8V3h5M12 3h5v5M17 12v5h-5M8 17H3v-5"/></svg>{zh ? "查看界面" : "View screen"}</span>
    </a>
    <figcaption><span>{caption}</span><span>{zh ? "实际 Console 界面 · 示例数据" : "Actual Console · sample data · shown in Chinese"}</span></figcaption>
    <dialog ref={modal} className="screenshot-modal" aria-label={alt} onClose={() => { onOpenChange?.(false); trigger.current?.focus(); }} onClick={event => {
      if (event.target === event.currentTarget) modal.current?.close();
    }}>
      <div className="screenshot-modal-bar"><span>{alt}</span><button type="button" onClick={() => modal.current?.close()} aria-label={zh ? "关闭放大图片" : "Close enlarged image"}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 5 10 10M15 5 5 15"/></svg></button></div>
      <div className="screenshot-modal-media"><img src={src} alt={alt} width={width} height={height} loading="lazy"/></div>
      <p>{zh ? "示例数据，用于说明界面操作。小屏可横向滚动查看细节。" : "Sample data illustrates the interface. Scroll horizontally on smaller screens."}</p>
    </dialog>
  </figure>;
}
