"use client";

import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { observeAnimationHold } from "@/lib/animation-hold";
import { anatomyPainter } from "./painter";
import { anatomyTour } from "./tour";
import { conceptFrame } from "./concept-model";
import { workflowFrame } from "./workflow-model";
import { overviewFrame } from "./overview-model";
import { architectureFrame } from "./architecture-model";
import type { AnatomyKind } from "./types";

export interface AnatomyStage { title: string; detail: string }

/** 一个时钟自动演示；仅键盘聚焦暂停，鼠标悬停不影响播放。 */
export function AnatomyLive({ kind, locale, title, description, stages, art, variant, underlay, overlay, mobileViewBox, viewBox = "0 80 640 450" }: {
  kind: AnatomyKind; locale: Locale; title: string; description: string;
  stages: AnatomyStage[]; art: ReactNode; viewBox?: string; mobileViewBox?: string; variant?: "workflow" | "overview"; underlay?: ReactNode; overlay?: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const model = useMemo(() => variant === "overview" ? overviewFrame : variant === "workflow" ? workflowFrame : kind === "concept" ? conceptFrame : architectureFrame, [kind, variant]);
  const zh = locale === "zh";
  const lastIndex = stages.length - 1;
  useEffect(() => {
    const el = root.current!, svg = el.querySelector<SVGSVGElement>("svg[data-anatomy]")!;
    const readout = el.querySelector<HTMLElement>("[data-anatomy-readout]");
    const labels = [...el.querySelectorAll<HTMLElement>("[data-anatomy-step]")];
    const detail = el.querySelector<HTMLElement>("[data-anatomy-detail]")!;
    const paint = anatomyPainter(svg, model, locale, readout);
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 767px)");
    const transfers = ["capture", "develop"].map(name => ({
      name,
      token: svg.querySelector<SVGGElement>(`[data-flow-token="${name}"]`),
      desktop: svg.querySelector<SVGPathElement>(`.workflow-desktop[data-flow-path="${name}"]`),
      mobile: svg.querySelector<SVGPathElement>(`.workflow-mobile[data-flow-path="${name}"]`),
    }));
    let position = lastIndex, clock = 0, raf = 0, last = 0, lastStage = -1;
    let visible = false, held = false, started = false;
    function render(reset = false) {
      const frame = paint(position);
      if (variant === "workflow") {
        svg.setAttribute("viewBox", mobile.matches ? mobileViewBox ?? viewBox : viewBox);
        for (const transfer of transfers) {
          const path = mobile.matches ? transfer.mobile : transfer.desktop;
          if (!path || !transfer.token) continue;
          const point = path.getPointAtLength(path.getTotalLength() * (frame.parts[`flow-${transfer.name}`]?.shift ?? 0));
          transfer.token.setAttribute("transform", `translate(${point.x} ${point.y})`);
        }
      }
      const index = Math.min(lastIndex, Math.max(0, Math.round(position)));
      if (index !== lastStage) {
        labels.forEach((label, i) => { label.dataset.active = String(index === i); });
        detail.textContent = stages[index].detail;
        lastStage = index;
      }
      if (reset && readout) readout.textContent = zh ? "演示台复位 · 准备下一轮" : "Resetting the demonstration";
      el.dataset.mode = still.matches ? "still" : held ? "paused" : "tour";
    }
    function stop() { cancelAnimationFrame(raf); raf = 0; last = 0; el.dataset.running = "false"; }
    function wake() {
      if (raf || !visible || document.hidden || still.matches || held) return;
      if (!started) { position = 0; started = true; render(); }
      last = 0;
      el.dataset.running = "true";
      raf = requestAnimationFrame(tick);
    }
    function tick(now: number) {
      raf = 0;
      clock += last ? Math.min((now - last) / 1000, .1) : 0;
      last = now;
      const tour = anatomyTour(clock, stages.length);
      position = variant && tour.resetting ? lastIndex : tour.position;
      render(tour.resetting);
      raf = requestAnimationFrame(tick);
    }
    const releaseHold = observeAnimationHold(el, value => { held = value; if (held) stop(); render(); wake(); });
    const visibility = () => document.hidden ? stop() : wake();
    const preference = () => {
      stop();
      if (still.matches) position = lastIndex;
      render(); wake();
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) wake(); else stop();
    }, { threshold: .1 });
    const layout = () => render();
    mobile.addEventListener("change", layout);
    render(); observer.observe(el);
    document.addEventListener("visibilitychange", visibility); still.addEventListener("change", preference);
    return () => {
      stop(); observer.disconnect(); releaseHold(); mobile.removeEventListener("change", layout);
      document.removeEventListener("visibilitychange", visibility); still.removeEventListener("change", preference);
    };
  }, [locale, model, stages, zh, lastIndex, variant, viewBox, mobileViewBox]);
  return <div ref={root} lang={locale} tabIndex={0} aria-label={title} className="anatomy-live" data-anatomy-kind={kind} data-variant={variant} data-stage-count={stages.length} data-mode="still" data-running="false">
    <div className="anatomy-stage">
      <svg viewBox={viewBox} fill="none" data-anatomy={kind} data-position={lastIndex.toFixed(4)} role="img" aria-label={description}>{underlay}{art}{overlay}</svg>
    </div>
    <div className="anatomy-instrument-status"><p>{zh ? "自动演示" : "Automatic demonstration"}</p><p data-anatomy-readout="">{model(lastIndex).readout[zh ? 0 : 1]}</p></div>
    <ol className="anatomy-stages" style={{ "--anatomy-step-count": stages.length } as CSSProperties} aria-label={title}>
      {stages.map((stage, index) => <li key={stage.title} data-anatomy-step={index} data-active={index === lastIndex}>{stage.title}</li>)}
    </ol>
    <p className="anatomy-stage-detail" data-anatomy-detail="">{stages[lastIndex].detail}</p>
    <span className="sr-only">{zh ? "键盘聚焦图解可暂停，移开焦点继续。" : "Focus the figure to pause; move focus away to resume."}</span>
    <noscript><style>{".anatomy-stages,.anatomy-stage-detail,.anatomy-instrument-status>p:first-child{display:none}"}</style><ol className="anatomy-static-stages">{stages.map(stage => <li key={stage.title}><strong>{stage.title}</strong><p>{stage.detail}</p></li>)}</ol></noscript>
  </div>;
}
