"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { observeAnimationHold } from "@/lib/animation-hold";
import { lifecycleCopy } from "./copy";
import { createLifecyclePainter } from "./painter";
import styles from "./hero-lifecycle.module.css";

export function LifecyclePlayback({ children, locale }: { children: ReactNode; locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const copy = lifecycleCopy[locale];
  useEffect(() => {
    const element = root.current!;
    const renderFrame = createLifecyclePainter(element, lifecycleCopy[locale]);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const compact = matchMedia("(max-width: 600px)");
    let elapsed = 0, raf = 0, last: number | null = null;
    let visible = false, held = false, suspended = false, disposed = false;
    const canRun = () => !disposed && !suspended && visible && !held && !document.hidden && !reduced.matches;
    function paint(still = reduced.matches) {
      if (!disposed) renderFrame(elapsed, still, compact.matches);
    }
    function stop() {
      cancelAnimationFrame(raf); raf = 0; last = null;
      element.dataset.running = "false";
    }
    function tick(now: number) {
      raf = 0;
      if (disposed) return;
      if (reduced.matches) { stop(); paint(true); return; }
      if (!canRun()) { stop(); return; }
      if (last !== null) elapsed += Math.min(Math.max((now - last) / 1000, 0), .08);
      last = now; paint(false);
      element.dataset.running = "true";
      raf = requestAnimationFrame(tick);
    }
    function wake() {
      if (disposed) return;
      if (reduced.matches) { stop(); paint(true); return; }
      if (!canRun()) { stop(); return; }
      if (raf) return;
      paint(false); element.dataset.running = "true";
      raf = requestAnimationFrame(tick);
    }
    const change = () => { if (disposed) return; stop(); wake(); };
    const layoutChange = () => { if (disposed) return; paint(); change(); };
    const observer = new IntersectionObserver(entries => {
      if (disposed) return;
      const entry = entries[entries.length - 1];
      visible = entry.isIntersecting && entry.intersectionRatio >= .08;
      change();
    }, { threshold: [0, .08] });
    const releaseHold = observeAnimationHold(element, value => {
      if (disposed) return;
      held = value; change();
    });
    function pageHide(event: PageTransitionEvent) {
      suspended = true; stop();
      if (!event.persisted) dispose();
    }
    function pageShow(event: PageTransitionEvent) {
      if (disposed || !event.persisted) return;
      suspended = false; wake();
    }
    function dispose() {
      if (disposed) return;
      disposed = true; stop(); observer.disconnect(); releaseHold();
      reduced.removeEventListener("change", change);
      compact.removeEventListener("change", layoutChange);
      document.removeEventListener("visibilitychange", change);
      window.removeEventListener("pagehide", pageHide);
      window.removeEventListener("pageshow", pageShow);
    }
    reduced.addEventListener("change", change);
    compact.addEventListener("change", layoutChange);
    document.addEventListener("visibilitychange", change);
    window.addEventListener("pagehide", pageHide);
    window.addEventListener("pageshow", pageShow);
    paint(); observer.observe(element);
    return dispose;
  }, [locale]);
  return <div ref={root} className={styles.playback}
    data-lifecycle="b" data-animation-scope="" data-static="true" data-running="false" data-act="2" data-elapsed="0.000" data-cycle="0"
    data-requirement="REQ-014" data-version="2" data-role-revision="1" data-scope-confirmed="true" data-tested="true" data-accepted="true"
    data-release-approved="true" data-released="true" data-released-version="1" data-summary-ready="true" data-learning-confirmed="true" data-learning-adopted="true"
    data-stored="true" data-referenced="true" data-v1-method="0" data-v2-method="1" data-v2-review="true" data-v2-accepted="false" data-v2-released="false"
    data-planner-model="Claude" data-developer-model="GPT" data-verifier-model="DeepSeek"
    role="group" tabIndex={0} aria-label={`${copy.accessible} ${copy.description}`}>{children}</div>;
}
