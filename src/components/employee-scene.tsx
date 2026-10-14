"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import type { Locale } from "@/lib/i18n";
import { EMPLOYEE_SCENE_DURATION, type EmployeeScene as StoryScene } from "@/content/employee-story";
import { createEmblemPainter } from "@/components/employee-emblem-motion";
import { IdentityVisual, CollaborationVisual } from "@/components/employee-work-visual";
import { KnowledgeVisual } from "@/components/employee-knowledge-visual";

const POSTER_SECONDS = EMPLOYEE_SCENE_DURATION / 1000 - .8;

/** 外层只负责播放生命周期；暂停和减少动态保留工作构图及当前时间。 */
export function EmployeeScene({ scene, locale, playback, elapsed }: { scene: StoryScene["id"]; locale: Locale; playback: "running" | "paused" | "static"; elapsed: RefObject<number> }) {
  const svg = useRef<SVGSVGElement>(null);
  const lastTime = useRef(POSTER_SECONDS);
  const prefix = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const zh = locale === "zh";

  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const paint = createEmblemPainter(element, scene, locale);
    let frame = 0;
    function tick() {
      lastTime.current = elapsed.current / 1000;
      paint(lastTime.current);
      frame = requestAnimationFrame(tick);
    }
    if (playback === "running") {
      lastTime.current = elapsed.current / 1000;
      frame = requestAnimationFrame(tick);
    }
    paint(playback === "static" ? POSTER_SECONDS : lastTime.current);
    element.dataset.ready = "true";
    element.dataset.playback = playback;
    return () => cancelAnimationFrame(frame);
  }, [elapsed, locale, playback, scene]);

  return <div className="employee-scene" data-illustration={scene} aria-hidden="true">
    <svg ref={svg} className="employee-emblem" viewBox="0 0 640 560" fill="none" data-emblem={scene}>
      <defs>
        <linearGradient id={`${prefix}-core`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#fff"/><stop offset=".48" stopColor="#f4f8ff"/><stop offset="1" stopColor="#dce7ff"/></linearGradient>
        <linearGradient id={`${prefix}-rim`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset=".45" stopColor="#afc5f8"/><stop offset="1" stopColor="#6988d5"/></linearGradient>
        <radialGradient id={`${prefix}-halo`}><stop stopColor="#d4e1ff" stopOpacity=".55"/><stop offset="1" stopColor="#eaf0ff" stopOpacity="0"/></radialGradient>
        <filter id={`${prefix}-shadow`} x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#4b659a" floodOpacity=".14"/></filter>
      </defs>
      <ellipse cx="320" cy="281" rx="280" ry="204" fill={`url(#${prefix}-halo)`}/>
      {/* 固定空间基准只提供深度，不加入独立装饰动画。 */}
      <g stroke="#b9cbee" strokeWidth=".8" opacity=".4">
        <path d="M29 196v-18h18M593 178h18v18M29 417v18h18M593 435h18v-18"/>
        <path d="M40 482h560" strokeDasharray="1 7"/>
        {[96, 208, 320, 432, 544].map(x => <path key={x} d={`M${x} 478v8`}/>)}
      </g>
      {scene === "identity" && <IdentityVisual locale={locale} prefix={prefix}/>}
      {scene === "collaboration" && <CollaborationVisual locale={locale} prefix={prefix}/>}
      {scene === "experience" && <KnowledgeVisual locale={locale} prefix={prefix}/>}
      <text data-motion="caption" x="320" y="519" textAnchor="middle" className="emblem-caption">{scene === "identity" ? (zh ? "让经验与方法，参与下一次工作" : "Bring experience into the next task") : scene === "collaboration" ? (zh ? "多 Agent 分工，汇成一次交付" : "Many agents. One shared delivery.") : (zh ? "带着来源，回到工作" : "Bring cited knowledge into work")}</text>
    </svg>
  </div>;
}
