"use client";

import { useEffect, useRef } from "react";
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
  const { index, mode, action, commands } = useProductDemoPlayback(story, stage);
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

  return <div className="product-demo" data-product-demo={kind} data-mode={mode} data-animation-scope="" tabIndex={0} aria-label={story.title[locale]}>
    <ScreenshotZoom src={`${basePath}${frame.src}`} alt={`${story.title[locale]} · ${frame.title[locale]}`} caption={story.title[locale]} locale={locale} width={frame.width} height={frame.height} onOpenChange={open => commands.current.inspect(open)} media={
      <div ref={stage} className="product-demo-stage" data-demo-stage="" data-frame={story.poster} data-running="false" data-has-cursor={!!frame.cursor} data-action={action} role="img" aria-label={frame.detail[locale]}>
        <div className="product-demo-camera" data-demo-camera="">
          {story.frames.map((item, i) => <img key={item.id} data-demo-image={item.id} data-active={i === index} src={`${basePath}${item.src}`} width={item.width} height={item.height} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable="false"/>)}
        </div>
        <span className="product-demo-tap" aria-hidden="true"/>
        <svg className="product-demo-pointer" aria-hidden="true" viewBox="0 0 24 28" fill="none"><path d="M2 2 20 16l-9 1-4 8L2 2Z" fill="#fff" stroke="#20252d" strokeWidth="1.6" strokeLinejoin="round"/></svg>
      </div>
    }/>
    <ol className="product-demo-stages" aria-label={zh ? `${story.title.zh}演示步骤` : `${story.title.en} steps`}>
      {story.frames.map((item, i) => <li key={item.id} data-active={i === index} data-demo-step={i}><span>{item.title[locale]}</span><span className="product-demo-progress" aria-hidden="true"/></li>)}
    </ol>
    <div className="product-demo-detail-row"><p className="product-demo-detail">{frame.detail[locale]}</p></div>
    {mode === "error" && <p className="product-demo-error">{zh ? "演示图片暂未加载，可打开原图查看。" : "Demo images could not load. Open the original screen to inspect it."}</p>}
    <span className="sr-only">{zh ? "自动演示；键盘聚焦暂停，移开焦点继续。" : "Auto-play; focus to pause, move focus away to resume."}</span>
    <noscript><style>{".product-demo-stages,.product-demo-detail-row,.product-demo-pointer,.product-demo-tap{display:none}"}</style><ol className="product-demo-static">{story.frames.map(item => <li key={item.id}><strong>{item.title[locale]}</strong><p>{item.detail[locale]}</p><a href={`${basePath}${item.src}`}>{zh ? "查看此步实际界面" : "View this screen"} ↗</a></li>)}</ol></noscript>
  </div>;
}
