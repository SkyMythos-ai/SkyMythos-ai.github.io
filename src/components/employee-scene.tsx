"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import type { Locale } from "@/lib/i18n";
import { EMPLOYEE_SCENE_DURATION, type EmployeeScene as StoryScene } from "@/content/employee-story";
import { createEmblemPainter } from "@/components/employee-emblem-motion";
import { IdentityVisual, CollaborationVisual } from "@/components/employee-work-visual";
import { KnowledgeVisual } from "@/components/employee-knowledge-visual";

const POSTER_SECONDS = EMPLOYEE_SCENE_DURATION / 1000 - .2;

/** 外层只负责播放生命周期；暂停和减少动态保留工作构图及当前时间。 */
export function EmployeeScene({ scene, locale, playback, elapsed }: { scene: StoryScene["id"]; locale: Locale; playback: "running" | "paused" | "static"; elapsed: RefObject<number> }) {
  const svg = useRef<SVGSVGElement>(null);
  const lastTime = useRef(POSTER_SECONDS);
  const prefix = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const paint = createEmblemPainter(element, scene);
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
    paint(playback === "static" ? POSTER_SECONDS : playback === "running" ? elapsed.current / 1000 : lastTime.current);
    element.dataset.ready = "true";
    element.dataset.playback = playback;
    return () => cancelAnimationFrame(frame);
  }, [elapsed, locale, playback, scene]);

  return <div className="employee-scene" data-illustration={scene} aria-hidden="true">
    <svg ref={svg} className="employee-emblem" viewBox="0 0 640 560" fill="none" data-emblem={scene} data-time="11.800">
      {scene === "identity" && <IdentityVisual locale={locale} prefix={prefix}/>}
      {scene === "collaboration" && <CollaborationVisual locale={locale} prefix={prefix}/>}
      {scene === "experience" && <KnowledgeVisual locale={locale} prefix={prefix}/>}
    </svg>
  </div>;
}
