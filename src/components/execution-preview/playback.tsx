"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import { observeAnimationHold } from "@/lib/animation-hold";
import { ScreenshotZoom } from "@/components/screenshot-zoom";
import { executionDuration, executionFrame } from "./model";
import { executionCopy } from "./copy";
import styles from "./screen.module.css";

export function ExecutionPlayback({locale, children}: {locale: Locale; children: ReactNode}) {
  const root = useRef<HTMLDivElement>(null);
  const inspect = useRef((_open: boolean) => {});
  const copy = executionCopy[locale];
  useEffect(() => {
    const el = root.current!;
    const screen = el.querySelector<HTMLElement>("[data-execution-screen]")!;
    const steps = [...el.querySelectorAll<HTMLElement>("[data-execution-step]")];
    const bars = [...el.querySelectorAll<HTMLElement>("[data-execution-progress]")];
    const records = [...el.querySelectorAll<HTMLElement>("[data-execution-record]")];
    const messages = [...el.querySelectorAll<HTMLElement>("[data-execution-message]")];
    const count = el.querySelector<HTMLElement>("[data-execution-count]")!;
    const status = el.querySelector<HTMLElement>("[data-execution-status]")!;
    const views = [...el.querySelectorAll<HTMLElement>("[data-execution-view]")];
    const checks = el.querySelector<HTMLElement>("[data-execution-checks]")!;
    const delivery = el.querySelector<HTMLElement>("[data-execution-delivery]")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let elapsed = 0, raf = 0, last: number | null = null, previous = "";
    let visible = false, held = false, inspecting = false, disposed = false;
    const canRun = () => !disposed && visible && !held && !inspecting && !reduced.matches && !document.hidden;
    const reveal = (node: HTMLElement, shown: boolean) => {
      node.dataset.visible = String(shown);
      node.setAttribute("aria-hidden", String(!shown));
    };
    function paint(still = false) {
      const frame = executionFrame(still ? executionDuration : elapsed);
      el.dataset.mode = still ? "static" : "live";
      const key = `${frame.completed}:${frame.records}:${frame.checks}:${frame.delivery}:${frame.inspection}`;
      if (key !== previous) {
        previous = key;
        count.textContent = String(frame.completed);
        status.textContent = frame.delivery ? copy.ready : copy.executing;
        screen.dataset.inspection = frame.inspection ?? "none";
        views.forEach(node => {
          const active = node.dataset.executionView === (frame.inspection ?? "none");
          node.dataset.active = String(active);
          node.setAttribute("aria-hidden", String(!active));
        });
        steps.forEach((step, i) => {
          const state = i < frame.completed ? "done" : i === frame.active ? "active" : "pending";
          step.dataset.state = state;
          step.querySelector<HTMLElement>("[data-execution-step-state]")!.textContent = copy.states[state];
        });
        records.forEach((node, i) => reveal(node, i < frame.records));
        messages.forEach((node, i) => {
          node.dataset.active = String(i === frame.message);
          node.setAttribute("aria-hidden", String(i !== frame.message));
        });
        reveal(checks, frame.checks); reveal(delivery, frame.delivery);
      }
      bars.forEach((bar, i) => {bar.style.transform = `scaleX(${i < frame.completed ? 1 : i === frame.active ? frame.progress : 0})`;});
      el.dataset.elapsed = elapsed.toFixed(3); el.dataset.cycle = String(frame.cycle);
    }
    function stop() {
      cancelAnimationFrame(raf); raf = 0; last = null;
      el.dataset.running = "false";
      el.getAnimations({subtree:true}).forEach(animation => animation.pause());
    }
    function tick(now: number) {
      raf = 0;
      if (reduced.matches) {stop(); paint(true); return;}
      if (!canRun()) {stop(); return;}
      if (last !== null) elapsed += Math.min((now - last) / 1000, .08);
      last = now; paint(); raf = requestAnimationFrame(tick);
    }
    function wake() {
      if (reduced.matches) {paint(true); return;}
      if (!canRun() || raf) return;
      paint();
      el.getAnimations({subtree:true}).forEach(animation => {if (animation.playState === "paused") animation.play();});
      el.dataset.running = "true"; raf = requestAnimationFrame(tick);
    }
    const release = observeAnimationHold(el, value => {held = value; stop(); wake();});
    const observer = new IntersectionObserver(entries => {
      const entry = entries[entries.length - 1];
      visible = entry.isIntersecting && entry.intersectionRatio >= .08;
      stop(); wake();
    }, {threshold:[0,.08]});
    const change = () => {stop(); wake();};
    inspect.current = open => {inspecting = open; change();};
    paint(reduced.matches); observer.observe(el);
    reduced.addEventListener("change", change); document.addEventListener("visibilitychange", change);
    return () => {
      disposed = true; stop(); observer.disconnect(); release();
      inspect.current = () => {};
      reduced.removeEventListener("change", change); document.removeEventListener("visibilitychange", change);
    };
  }, [copy]);
  return <div ref={root} className={styles.preview} data-execution-preview="" data-mode="static" data-running="false" data-animation-scope="" role="group" tabIndex={0} aria-label={copy.accessible}>
    <ScreenshotZoom src={`${basePath}/images/product/keynote-order-execution.png`} alt={copy.original} caption={copy.caption} sourceLabel={copy.source} separateTrigger locale={locale} width={3200} height={1800} media={children} onOpenChange={open => inspect.current(open)}/>
  </div>;
}
