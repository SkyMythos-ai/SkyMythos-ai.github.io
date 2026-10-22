"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { observeAnimationHold } from "@/lib/animation-hold";
import { storyFrame } from "./model";
import type { StoryKind } from "./types";

export function StoryPlayback({ kind, locale, description, children }: { kind: StoryKind; locale: Locale; description: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!;
    const readout = el.querySelector<HTMLElement>("[data-story-readout]")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 1023px)");
    const layouts = [...el.querySelectorAll<SVGSVGElement>("svg[data-layout]")].map(svg => ({
      mobile: svg.dataset.layout === "mobile",
      parts: [...svg.querySelectorAll<SVGGElement>("[data-part]")],
      scenarios: [...svg.querySelectorAll<SVGTextElement>("[data-scenario]")],
      flows: [...svg.querySelectorAll<SVGGElement>("[data-flow]")].map(group => {
        const path = group.querySelector<SVGPathElement>("[data-route]")!;
        const length = path.getTotalLength();
        return { name: group.dataset.flow!, group, packet: group.querySelector<SVGGElement>("[data-packet]")!, points: Array.from({ length: 81 }, (_, i) => path.getPointAtLength(length * i / 80)) };
      }),
    }));
    let elapsed = 0, raf = 0, last: number | null = null;
    let visible = false, held = false, disposed = false;
    const canRun = () => !disposed && visible && !held && !document.hidden && !reduced.matches;
    function stop() { cancelAnimationFrame(raf); raf = 0; last = null; el.dataset.running = "false"; }
    function still() { stop(); el.dataset.mode = "static"; readout.textContent = description; }
    function paint() {
      const state = storyFrame(kind, elapsed, locale);
      const layout = layouts.find(item => item.mobile === mobile.matches)!;
      for (const part of layout.parts) {
        const opacity = state.parts[part.dataset.part!] ?? 0;
        part.style.opacity = String(opacity);
        part.style.transform = `translateY(${((1 - opacity) * 7).toFixed(2)}px)`;
      }
      for (const { name, group, packet, points } of layout.flows) {
        const flow = state.flows[name] ?? { opacity: 0, progress: 0 };
        group.style.opacity = String(flow.opacity);
        if (!flow.opacity) continue;
        const progress = flow.progress * 80, index = Math.min(79, Math.floor(progress)), fraction = progress - index;
        const a = points[index], b = points[index + 1];
        packet.setAttribute("transform", `translate(${a.x + (b.x - a.x) * fraction} ${a.y + (b.y - a.y) * fraction})`);
      }
      for (const node of layout.scenarios) if (node.textContent !== state.scenario) node.textContent = state.scenario;
      if (readout.textContent !== state.caption) readout.textContent = state.caption;
      el.dataset.elapsed = elapsed.toFixed(3); el.dataset.cycle = String(state.cycle); el.dataset.mode = "live";
    }
    function tick(now: number) {
      raf = 0;
      if (reduced.matches) { still(); return; }
      if (!canRun()) { stop(); return; }
      if (last !== null) elapsed += Math.min((now - last) / 1000, .08);
      last = now; paint(); raf = requestAnimationFrame(tick);
    }
    function wake() {
      if (reduced.matches) { still(); return; }
      if (!canRun() || raf) return;
      paint(); el.dataset.running = "true"; raf = requestAnimationFrame(tick);
    }
    const release = observeAnimationHold(el, value => { held = value; stop(); wake(); });
    const observer = new IntersectionObserver(entries => {
      const entry = entries[entries.length - 1];
      visible = entry.isIntersecting && entry.intersectionRatio >= .08;
      if (visible) wake(); else stop();
    }, { threshold: [0, .08] });
    const visibility = () => { stop(); wake(); };
    const preference = () => { stop(); if (reduced.matches) still(); else { paint(); wake(); } };
    const layout = () => { if (!reduced.matches) paint(); };
    if (reduced.matches) still(); else paint();
    observer.observe(el);
    reduced.addEventListener("change", preference); mobile.addEventListener("change", layout);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true; stop(); observer.disconnect(); release();
      reduced.removeEventListener("change", preference); mobile.removeEventListener("change", layout);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [kind, locale, description]);
  return <div ref={root} className="story-playback" role="group" data-story={kind} data-mode="static" data-running="false" data-animation-scope="" tabIndex={0} aria-label={`${description} ${locale === "zh" ? "键盘聚焦暂停，移开焦点继续。" : "Focus to pause; move focus away to resume."}`}>
    <div className="work-story-stage">{children}</div>
    <p className="work-story-readout" data-story-readout="" aria-hidden="true">{description}</p>
  </div>;
}
