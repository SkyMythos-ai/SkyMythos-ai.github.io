"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { EMPLOYEE_SCENE_DURATION, getEmployeeStory } from "@/content/employee-story";
import { createEmblemPainter } from "@/components/employee-emblem-motion";
import { EMPLOYEE_POSTER_SECONDS } from "@/components/employee-motion-model";

/** 默认自动轮播；手动选择播放一遍并停留，当前主题可暂停、续播或重播。 */
export function HeroStage({ locale, visuals }: { locale: Locale; visuals: ReactNode[] }) {
  const scenes = getEmployeeStory(locale);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const [foreground, setForeground] = useState(true);
  const [ready, setReady] = useState(false);
  const root = useRef<HTMLElement>(null);
  const elapsed = useRef(0);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const panelId = useId();
  const running = ready && !paused && !reducedMotion && visible && foreground;
  const zh = locale === "zh";
  const scene = scenes[active];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(preference.matches);
    const syncVisibility = () => setForeground(!document.hidden);
    syncPreference();
    syncVisibility();
    setReady(true);
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      setVisible(entry.isIntersecting && entry.intersectionRatio >= .12);
    }, { threshold: .12 });
    if (root.current) observer.observe(root.current);
    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const element = root.current?.querySelector<SVGSVGElement>(`[data-emblem="${scene.id}"]`);
    if (!element || !ready) return;
    const paint = createEmblemPainter(element, scene.id, locale);
    paint(reducedMotion ? EMPLOYEE_POSTER_SECONDS : elapsed.current / 1000);
    element.dataset.playback = reducedMotion ? "static" : running ? "running" : "paused";
    if (!running) return;
    let frame = 0;
    let previous = 0;
    function tick(now: number) {
      // 分镜直接按时间求值；低帧率仍保持 12 秒，只截断系统唤醒造成的异常间隔。
      if (previous) elapsed.current += Math.min(now - previous, 100);
      previous = now;
      if (elapsed.current >= EMPLOYEE_SCENE_DURATION) {
        if (autoplay) {
          elapsed.current = 0;
          setActive((index) => (index + 1) % scenes.length);
          root.current?.style.setProperty("--scene-progress", "0");
          return;
        } else {
          elapsed.current = EMPLOYEE_SCENE_DURATION;
          setPaused(true);
        }
      }
      root.current?.style.setProperty("--scene-progress", `${elapsed.current / EMPLOYEE_SCENE_DURATION}`);
      paint(elapsed.current / 1000);
      if (!autoplay && elapsed.current >= EMPLOYEE_SCENE_DURATION) return;
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, scenes.length, autoplay, scene.id, locale, ready, reducedMotion]);

  function selectScene(index: number) {
    setActive((index + scenes.length) % scenes.length);
    setAutoplay(false);
    setPaused(false);
    elapsed.current = 0;
    root.current?.style.setProperty("--scene-progress", "0");
  }

  function activateScene(index: number) {
    if (index !== active || reducedMotion || elapsed.current >= EMPLOYEE_SCENE_DURATION) {
      selectScene(index);
      return;
    }
    setAutoplay(false);
    setPaused((value) => !value);
  }

  return (
    <section
      ref={root}
      className="employee-hero"
      role="region"
      aria-roledescription={zh ? "轮播" : "carousel"}
      aria-label={zh ? "数字员工：成长、多 Agent 协作与知识库" : "Digital employees: growth, multi-agent collaboration and knowledge"}
      data-scene={active}
      data-running={running}
      onFocusCapture={(event) => {
        // 主题获焦停止自动换幕，按下按钮才切换播放状态，避免鼠标聚焦抵消暂停。
        if ((event.target as HTMLElement).closest(".employee-chapter")) setAutoplay(false);
        else setPaused(true);
      }}
      onTouchStart={(event) => { swipeStart.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null; }}
      onTouchEnd={(event) => {
        if (!swipeStart.current || event.changedTouches.length !== 1) return;
        const dx = event.changedTouches[0].clientX - swipeStart.current.x;
        const dy = event.changedTouches[0].clientY - swipeStart.current.y;
        swipeStart.current = null;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) selectScene(active + (dx < 0 ? 1 : -1));
      }}
      onTouchCancel={() => { swipeStart.current = null; }}
    >
      <div className="employee-body">
        <div className="employee-content">
          <div className="employee-copy" id={panelId} role="group" aria-roledescription={zh ? "幻灯片" : "slide"} aria-label={`${active + 1} / ${scenes.length} · ${scene.label}`} aria-live={running ? "off" : "polite"}>
            <p className="employee-eyebrow">{zh ? "数字员工 · 为真实工作而生" : "DIGITAL EMPLOYEES · BUILT FOR REAL WORK"}</p>
            <div className="employee-copy-panels">
              {scenes.map((item, index) => (
                <div key={item.id} className="employee-copy-transition" data-active={active === index} aria-hidden={active !== index}>
                  <h1 className="employee-headline"><span>{item.headline[0]}</span><span>{item.headline[1]}</span></h1>
                  <p className="employee-description">{item.description}</p>
                  <span className="sr-only">{item.alt}</span>
                </div>
              ))}
            </div>
            <div className="employee-actions">
              <Link href="#digital-employees" className="employee-primary">{zh ? "认识数字员工" : "Meet the team"}<span aria-hidden="true">↗</span></Link>
              <Link href={localePath(locale, "/docs/getting-started/overview")} className="employee-secondary">{zh ? "开始探索" : "Get started"}<span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className="employee-scene-picker" role="group" aria-label={reducedMotion ? (zh ? "选择主题" : "Choose a topic") : (zh ? "选择主题；再次点击当前主题可暂停或继续" : "Choose a topic; click the current topic to pause or resume")}>
            {scenes.map((item, index) => {
              const selected = active === index;
              const action = reducedMotion ? "" : !selected ? (zh ? "播放这一幕" : "Play this scene")
                : elapsed.current >= EMPLOYEE_SCENE_DURATION ? (zh ? "重播这一幕" : "Replay this scene")
                : paused ? (zh ? "继续播放" : "Resume animation") : (zh ? "暂停动画" : "Pause animation");
              const label = action ? `${item.label}${zh ? "：" : ": "}${action}` : item.label;
              return (
                <button key={item.id} type="button" className="employee-chapter" title={label} aria-label={label} aria-pressed={selected} aria-controls={panelId} onClick={() => activateScene(index)}>
                  <span>{item.label}</span><span className="employee-chapter-track" aria-hidden="true"><span /></span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="employee-backdrops" aria-hidden="true">
          {scenes.map((item, index) => (
            <div key={item.id} className="employee-backdrop" data-active={active === index}>
              {visuals[index]}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
