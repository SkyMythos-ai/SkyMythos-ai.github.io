"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { anatomyPainter } from "./painter";
import { anatomyTour, anatomyTourTimeAt } from "./tour";
import { conceptFrame } from "./concept-model";
import { architectureFrame } from "./architecture-model";
import type { AnatomyKind } from "./types";

export interface AnatomyStage { title: string; detail: string }

/** 单一时钟改写预计算 SVG；阶段选择只设置目标，React 不参与逐帧绘制。 */
export function AnatomyLive({ kind, locale, title, description, stages, art, viewBox = "0 80 640 450" }: {
  kind: AnatomyKind; locale: Locale; title: string; description: string;
  stages: AnatomyStage[]; art: ReactNode; viewBox?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const command = useRef<(index: number) => void>(() => {});
  const playback = useRef<() => void>(() => {});
  const model = kind === "concept" ? conceptFrame : architectureFrame;
  const zh = locale === "zh";
  const lastIndex = stages.length - 1;
  useEffect(() => {
    const el = root.current!, svg = el.querySelector<SVGSVGElement>("svg[data-anatomy]")!;
    const readout = el.querySelector<HTMLElement>("[data-anatomy-readout]");
    const announce = el.querySelector<HTMLElement>("[data-anatomy-announcement]");
    const buttons = [...el.querySelectorAll<HTMLButtonElement>("[data-anatomy-step]")];
    const detail = el.querySelector<HTMLElement>("[data-anatomy-detail]")!;
    const toggle = el.querySelector<HTMLButtonElement>("[data-anatomy-playback]")!;
    const paint = anatomyPainter(svg, model, locale, readout);
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    let position = lastIndex, target = lastIndex, clock = 0, raf = 0, last = 0;
    let visible = false, manual = false, paused = false, started = false, lastStage = -1;
    function render(reset = false) {
      paint(position);
      const index = manual ? target : Math.min(lastIndex, Math.max(0, Math.round(position)));
      if (index !== lastStage) {
        buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(index === i)));
        detail.textContent = stages[index].detail;
        lastStage = index;
      }
      if (reset && readout) readout.textContent = zh ? "演示台复位 · 准备下一轮" : "Resetting the demonstration";
      el.dataset.mode = still.matches ? "still" : manual ? "selected" : paused ? "paused" : "tour";
      toggle.hidden = still.matches;
      toggle.textContent = manual || paused ? (zh ? "继续自动演示" : "Resume demonstration") : (zh ? "暂停演示" : "Pause demonstration");
    }
    function wake() {
      if (raf || !visible || document.hidden || still.matches || paused) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    }
    function tick(now: number) {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 0;
      last = now;
      let reset = false;
      if (manual) {
        position += (target - position) * (1 - Math.exp(-dt / .25));
        if (Math.abs(position - target) < .0001) position = target;
      } else {
        clock += dt;
        const tour = anatomyTour(clock, stages.length);
        position = tour.position;
        reset = tour.resetting;
      }
      render(reset);
      const moving = !paused && (manual ? position !== target : true);
      el.dataset.running = String(moving && visible && !document.hidden);
      if (visible && !document.hidden && moving && !still.matches) raf = requestAnimationFrame(tick);
    }
    command.current = index => {
      manual = true;
      paused = false;
      target = index;
      if (announce) announce.textContent = `${zh ? "已选择：" : "Selected: "}${stages[index].title}`;
      if (still.matches) position = target;
      render(); wake();
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; last = 0; el.dataset.running = "false"; };
    playback.current = () => {
      if (manual || paused) {
        if (manual) clock = anatomyTourTimeAt(position, stages.length);
        manual = false; paused = false; render(); wake();
      } else { paused = true; stop(); render(); }
    };
    const visibility = () => document.hidden ? stop() : wake();
    const preference = () => {
      stop();
      if (still.matches) { position = manual ? target : lastIndex; render(); }
      else wake();
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[entries.length - 1].isIntersecting;
      if (!visible) { stop(); return; }
      if (!started && !still.matches && !manual) { position = 0; started = true; render(); }
      wake();
    }, { rootMargin: "0px", threshold: .1 });
    render(); observer.observe(el);
    document.addEventListener("visibilitychange", visibility); still.addEventListener("change", preference);
    return () => {
      stop(); observer.disconnect(); command.current = () => {}; playback.current = () => {};
      document.removeEventListener("visibilitychange", visibility); still.removeEventListener("change", preference);
    };
  }, [kind, locale, model, stages, zh, lastIndex]);
  return <div ref={root} lang={locale} className="anatomy-live" data-anatomy-kind={kind} data-stage-count={stages.length} data-mode="still" data-running="false">
    <div className="anatomy-stage">
      <svg viewBox={viewBox} fill="none" data-anatomy={kind} data-position={lastIndex.toFixed(4)} role="img" aria-label={description}>{art}</svg>
    </div>
    <div className="anatomy-instrument-status"><p>{kind === "concept" ? (zh ? "选择阶段，观察从 Chat 到委派与验收" : "Follow the stages from Chat to delegation and review") : (zh ? "选择阶段，观察机构如何工作" : "Select a stage to inspect the mechanism")}</p><p data-anatomy-readout="">{model(lastIndex).readout[zh ? 0 : 1]}</p></div>
    <div className="anatomy-controls" style={{ "--anatomy-step-count": stages.length } as CSSProperties} role="group" aria-label={title}>
      {stages.map((stage, index) => <button key={stage.title} type="button" data-anatomy-step={index} aria-pressed={index === lastIndex} onClick={() => command.current(index)} onKeyDown={event => {
        const next = event.key === "Home" ? 0 : event.key === "End" ? lastIndex : event.key === "ArrowRight" || event.key === "ArrowDown" ? (index + 1) % stages.length : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (index + stages.length - 1) % stages.length : undefined;
        if (next === undefined) return;
        event.preventDefault(); command.current(next);
        root.current?.querySelector<HTMLButtonElement>(`[data-anatomy-step="${next}"]`)?.focus();
      }}>{stage.title}</button>)}
    </div>
    <div className="anatomy-playback-row"><p className="anatomy-stage-detail" data-anatomy-detail="">{stages[lastIndex].detail}</p><button type="button" className="anatomy-playback" data-anatomy-playback="" onClick={() => playback.current()}>{zh ? "暂停演示" : "Pause demonstration"}</button></div>
    <span className="sr-only" role="status" aria-live="polite" data-anatomy-announcement=""/>
    <noscript><style>{".anatomy-controls,.anatomy-playback-row,.anatomy-instrument-status>p:first-child{display:none}"}</style><ol className="anatomy-static-stages">{stages.map(stage => <li key={stage.title}><strong>{stage.title}</strong><p>{stage.detail}</p></li>)}</ol></noscript>
  </div>;
}
