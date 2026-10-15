"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import { ScreenshotZoom } from "@/components/screenshot-zoom";
import { productDemoStories } from "@/content/product-demo-stories";
import { productDemoCamera } from "./camera";
import { useProductDemoPlayback } from "./playback";
import type { ProductDemoKind } from "./types";

/** 以原生 Console 连续截图演示操作；截图的产品内容保持完整原样。 */
export function ProductDemo({ kind, locale }: { kind: ProductDemoKind; locale: Locale }) {
  const story = productDemoStories[kind];
  const stage = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const { index, mode, action, commands } = useProductDemoPlayback(story, stage);
  const [announcement, announce] = useState("");
  const detailId = useId();
  const frame = story.frames[index];
  const zh = locale === "zh";

  useEffect(() => {
    const el = stage.current!, camera = el.querySelector<HTMLElement>("[data-demo-camera]")!;
    function resize() {
      const box = el.getBoundingClientRect();
      const pose = productDemoCamera(frame, box.width, box.height, action);
      camera.style.width = `${frame.width}px`; camera.style.height = `${frame.height}px`;
      camera.style.transform = `translate(${pose.left}px,${pose.top}px) scale(${pose.scale})`;
      el.style.setProperty("--demo-cursor-x", `${pose.cursorX}px`);
      el.style.setProperty("--demo-cursor-y", `${pose.cursorY}px`);
      // 首次取景直接落座，后续阶段才平滑运镜，避免图片从原始像素尺寸缩入。
      if (el.dataset.ready !== "true") { camera.getBoundingClientRect(); el.dataset.ready = "true"; }
    }
    resize();
    const observer = new ResizeObserver(resize); observer.observe(el);
    return () => observer.disconnect();
  }, [frame, action]);

  function select(next: number) {
    commands.current.select(next);
    announce(`${zh ? "已选择：" : "Selected: "}${story.frames[next].title[locale]}`);
  }

  return <div ref={root} className="product-demo" data-product-demo={kind} data-mode={mode}>
    <ScreenshotZoom src={`${basePath}${frame.src}`} alt={`${story.title[locale]} · ${frame.title[locale]}`} caption={story.title[locale]} locale={locale} width={frame.width} height={frame.height} onOpenChange={open => commands.current.inspect(open)} media={
      <div ref={stage} className="product-demo-stage" data-demo-stage="" data-frame={story.poster} data-running="false" data-has-cursor={!!frame.cursor} data-action={action} role="img" aria-label={frame.detail[locale]}>
        <div className="product-demo-camera" data-demo-camera="">
          {story.frames.map((item, i) => <img key={item.id} data-demo-image={item.id} data-active={i === index} src={`${basePath}${item.src}`} width={item.width} height={item.height} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable="false"/>)}
        </div>
        <span className="product-demo-tap" aria-hidden="true"/>
        <svg className="product-demo-pointer" aria-hidden="true" viewBox="0 0 24 28" fill="none"><path d="M2 2 20 16l-9 1-4 8L2 2Z" fill="#fff" stroke="#20252d" strokeWidth="1.6" strokeLinejoin="round"/></svg>
      </div>
    }/>
    <div className="product-demo-controls" role="group" aria-label={zh ? `${story.title.zh}演示步骤` : `${story.title.en} steps`}>
      {story.frames.map((item, i) => <button key={item.id} type="button" disabled={mode === "error"} aria-pressed={i === index} aria-describedby={i === index ? detailId : undefined} data-demo-step={i} onClick={() => select(i)} onKeyDown={event => {
        const next = event.key === "Home" ? 0 : event.key === "End" ? story.frames.length - 1 : event.key === "ArrowRight" || event.key === "ArrowDown" ? (i + 1) % story.frames.length : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (i + story.frames.length - 1) % story.frames.length : undefined;
        if (next === undefined) return;
        event.preventDefault(); select(next);
        root.current?.querySelector<HTMLButtonElement>(`[data-demo-step="${next}"]`)?.focus();
      }}><span>{item.title[locale]}</span><span className="product-demo-progress" aria-hidden="true"/></button>)}
    </div>
    <div className="product-demo-detail-row"><p id={detailId} className="product-demo-detail">{frame.detail[locale]}</p><button className="product-demo-playback" type="button" data-demo-playback="" hidden={mode === "still" || mode === "error"} onClick={() => commands.current.toggle()}>{mode === "paused" ? (zh ? "继续自动演示" : "Resume demonstration") : (zh ? "暂停演示" : "Pause demonstration")}</button></div>
    {mode === "error" && <p className="product-demo-error">{zh ? "演示图片暂未加载，可打开原图查看。" : "Demo images could not load. Open the original screen to inspect it."}</p>}
    <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
    <noscript><style>{".product-demo-controls,.product-demo-detail-row,.product-demo-pointer,.product-demo-tap{display:none}"}</style><ol className="product-demo-static">{story.frames.map(item => <li key={item.id}><strong>{item.title[locale]}</strong><p>{item.detail[locale]}</p><a href={`${basePath}${item.src}`}>{zh ? "查看此步实际界面" : "View this screen"} ↗</a></li>)}</ol></noscript>
  </div>;
}
