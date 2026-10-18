"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { ProductDemoStory } from "./types";
import { observeAnimationHold } from "@/lib/animation-hold";

type Mode = "auto" | "paused" | "still" | "error";

/** 仅在截图与操作镜头切换时更新 React；帧内进度由可暂停的时钟写入 CSS。 */
export function useProductDemoPlayback(story: ProductDemoStory, stage: RefObject<HTMLDivElement | null>) {
  const [index, setIndex] = useState(story.poster);
  const [mode, setMode] = useState<Mode>("still");
  const [action, setAction] = useState(false);
  const commands = useRef({ inspect: (_open: boolean) => {} });

  useEffect(() => {
    const el = stage.current!;
    const host = el.closest<HTMLElement>(".product-demo")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    let current = story.poster, elapsed = 0, raf = 0, last = 0, seekingAction = false;
    let visible = false, paused = false, inspecting = false, ready = false, failed = false, started = false, disposed = false;
    let loading: Promise<void> | undefined;

    function publish() {
      const next = failed ? "error" : !ready || still.matches ? "still" : paused ? "paused" : "auto";
      setMode(next);
      el.dataset.mode = next;
    }
    function progress() {
      const fraction = elapsed / story.frames[current].durationMs;
      const nextAction = fraction >= .62 && !!story.frames[current].cursor;
      if (nextAction !== seekingAction) { seekingAction = nextAction; setAction(nextAction); }
      host.style.setProperty("--demo-progress", String(fraction));
      const tap = Math.max(0, Math.min(1, (fraction - .78) / .18));
      el.style.setProperty("--demo-tap-opacity", String(tap > 0 ? Math.sin(tap * Math.PI) * .8 : 0));
      el.style.setProperty("--demo-tap-scale", String(.6 + tap * .8));
      el.dataset.frame = String(current);
      el.dataset.elapsed = elapsed.toFixed(0);
    }
    function stop() {
      cancelAnimationFrame(raf); raf = 0; last = 0;
      // CSS 运镜与图片淡入同样服从暂停，不能只停脚本时钟。
      el.getAnimations({ subtree: true }).forEach(animation => animation.pause());
      el.dataset.running = "false";
    }
    function wake() {
      if (raf || !ready || !visible || paused || inspecting || still.matches || document.hidden) return;
      el.getAnimations({ subtree: true }).forEach(animation => { if (animation.playState === "paused") animation.play(); });
      last = 0;
      el.dataset.running = "true";
      raf = requestAnimationFrame(tick);
    }
    function tick(now: number) {
      raf = 0;
      elapsed += last ? Math.min(now - last, 100) : 0;
      last = now;
      if (elapsed >= story.frames[current].durationMs) {
        elapsed = 0; current = (current + 1) % story.frames.length; setIndex(current);
      }
      progress();
      raf = requestAnimationFrame(tick);
    }
    async function load() {
      if (loading) return loading;
      loading = (async () => {
        const images = [...el.querySelectorAll<HTMLImageElement>("[data-demo-image]")];
        images.forEach(img => { img.loading = "eager"; });
        const results = await Promise.allSettled(images.map(img => img.decode()));
        if (disposed) return;
        if (results.some(result => result.status === "rejected")) {
          failed = true; publish(); return;
        }
        ready = true; el.dataset.loaded = "true";
        if (!started && !still.matches && !paused) { current = 0; elapsed = 0; setIndex(current); }
        started = true; progress(); publish(); wake();
      })();
      return loading;
    }
    commands.current = {
      inspect(open) { inspecting = open; if (open) stop(); else wake(); },
    };
    const releaseHold = observeAnimationHold(host, held => { paused = held; publish(); if (held) stop(); else wake(); });
    const visibility = () => document.hidden ? stop() : wake();
    const preference = () => {
      stop();
      if (still.matches && !paused) { current = story.poster; elapsed = 0; setIndex(current); progress(); }
      publish(); wake();
    };
    const observer = new IntersectionObserver(entries => {
      const entry = entries[entries.length - 1];
      visible = entry.isIntersecting && entry.intersectionRatio >= .15;
      if (visible) { void load(); wake(); } else stop();
    }, { threshold: [0, .15] });
    progress(); observer.observe(el);
    document.addEventListener("visibilitychange", visibility); still.addEventListener("change", preference);
    return () => {
      disposed = true; stop(); observer.disconnect(); releaseHold();
      commands.current = { inspect: () => {} };
      document.removeEventListener("visibilitychange", visibility); still.removeEventListener("change", preference);
    };
  }, [stage, story]);

  return { index, mode, action, commands };
}
