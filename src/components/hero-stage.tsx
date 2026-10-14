"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { EMPLOYEE_SCENE_DURATION, getEmployeeStory } from "@/content/employee-story";
import { EmployeeScene } from "@/components/employee-scene";

/** 短片与轮播共用时钟；手动选择播放一遍并保留成果，显式播放才恢复自动轮播。 */
export function HeroStage({ locale }: { locale: Locale }) {
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
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= .12), { threshold: .12 });
    if (root.current) observer.observe(root.current);
    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let previous = 0;
    function tick(now: number) {
      if (previous) elapsed.current += Math.min(now - previous, 100);
      previous = now;
      if (elapsed.current >= EMPLOYEE_SCENE_DURATION) {
        if (autoplay) {
          elapsed.current = 0;
          setActive((index) => (index + 1) % scenes.length);
        } else {
          elapsed.current = EMPLOYEE_SCENE_DURATION;
          setPaused(true);
        }
      }
      root.current?.style.setProperty("--scene-progress", `${elapsed.current / EMPLOYEE_SCENE_DURATION}`);
      if (!autoplay && elapsed.current >= EMPLOYEE_SCENE_DURATION) return;
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, scenes.length, autoplay]);

  function selectScene(index: number) {
    setActive((index + scenes.length) % scenes.length);
    setAutoplay(false);
    setPaused(false);
    elapsed.current = 0;
    root.current?.style.setProperty("--scene-progress", "0");
  }

  function togglePlayback() {
    if (paused) {
      if (elapsed.current >= EMPLOYEE_SCENE_DURATION) {
        elapsed.current = 0;
        root.current?.style.setProperty("--scene-progress", "0");
      }
      setAutoplay(true);
    }
    setPaused(!paused);
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
        if (!(event.target as HTMLElement).closest("[data-playback-control]")) setPaused(true);
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
        <div className="employee-copy" id={panelId} role="group" aria-roledescription={zh ? "幻灯片" : "slide"} aria-label={`${active + 1} / ${scenes.length} · ${scene.label}`} aria-live={running ? "off" : "polite"}>
          <p className="employee-eyebrow">{zh ? "数字员工 · 为真实工作而生" : "DIGITAL EMPLOYEES · BUILT FOR REAL WORK"}</p>
          <div key={scene.id} className="employee-copy-transition">
            <h1 className="employee-headline"><span>{scene.headline[0]}</span><span>{scene.headline[1]}</span></h1>
            <p className="employee-description">{scene.description}</p>
            <span className="sr-only">{scene.alt}</span>
          </div>
          <div className="employee-actions">
            <Link href="#digital-employees" className="employee-primary">{zh ? "认识数字员工" : "Meet the team"}<span aria-hidden="true">↗</span></Link>
            <Link href={localePath(locale, "/docs/getting-started/overview")} className="employee-secondary">{zh ? "开始探索" : "Get started"}<span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="employee-backdrops" aria-hidden="true">
          {scenes.map((item, index) => (
            <div key={item.id} className="employee-backdrop" data-active={active === index}>
              <EmployeeScene scene={item.id} locale={locale} playback={reducedMotion ? "static" : running && active === index ? "running" : "paused"} elapsed={elapsed} />
            </div>
          ))}
        </div>
      </div>
      <div className="employee-footer">
        <div className="employee-scene-picker" role="group" aria-label={zh ? "选择故事章节" : "Choose a chapter"}>
          {scenes.map((item, index) => (
            <button key={item.id} type="button" className="employee-chapter" title={reducedMotion ? item.label : (zh ? `${item.label}：播放这一幕` : `${item.label}: play this scene`)} aria-pressed={active === index} aria-controls={panelId} onClick={() => selectScene(index)}>
              <span className="employee-chapter-index">0{index + 1}</span><span>{item.label}</span><span className="employee-chapter-track" aria-hidden="true"><span /></span>
            </button>
          ))}
        </div>
        <div className="employee-playback">
          <span className="employee-counter" aria-hidden="true">0{active + 1}<span> / 03</span></span>
          <button type="button" aria-label={zh ? "上一幕" : "Previous slide"} onClick={() => selectScene(active - 1)}>←</button>
          <button type="button" aria-label={zh ? "下一幕" : "Next slide"} onClick={() => selectScene(active + 1)}>→</button>
          {!reducedMotion && <button type="button" data-playback-control aria-label={paused ? (zh ? "播放轮播" : "Play slideshow") : (zh ? "暂停轮播" : "Pause slideshow")} aria-pressed={paused} onClick={togglePlayback}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button>}
        </div>
      </div>
    </section>
  );
}
