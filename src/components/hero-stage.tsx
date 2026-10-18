"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { EMPLOYEE_SCENE_DURATION, getEmployeeStory } from "@/content/employee-story";
import { createEmblemPainter } from "@/components/employee-emblem-motion";
import { EMPLOYEE_POSTER_SECONDS } from "@/components/employee-motion-model";
import { observeAnimationHold } from "@/lib/animation-hold";

/** 自动轮播；鼠标悬停继续播放，保留键盘聚焦暂停以便阅读。 */
export function HeroStage({ locale, visuals }: { locale: Locale; visuals: ReactNode[] }) {
  const scenes = getEmployeeStory(locale);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const [foreground, setForeground] = useState(true);
  const [ready, setReady] = useState(false);
  const root = useRef<HTMLElement>(null);
  const elapsed = useRef(0);
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
    const releaseHold = observeAnimationHold(root.current!, setPaused);
    return () => {
      releaseHold();
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
        elapsed.current = 0;
        setActive((index) => (index + 1) % scenes.length);
        root.current?.style.setProperty("--scene-progress", "0");
        return;
      }
      root.current?.style.setProperty("--scene-progress", `${elapsed.current / EMPLOYEE_SCENE_DURATION}`);
      paint(elapsed.current / 1000);
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, scenes.length, scene.id, locale, ready, reducedMotion]);

  return (
    <section
      ref={root}
      className="employee-hero"
      role="region"
      aria-roledescription={zh ? "轮播" : "carousel"}
      aria-label={zh ? "人与 AI 协作：个人工作、团队能力与持续改进" : "People and AI: individual work, team capability and improvement"}
      data-scene={active}
      data-running={running}
      data-animation-scope=""
      tabIndex={0}
    >
      <div className="employee-body">
        <div className="employee-content">
          <div className="employee-copy" id={panelId} role="group" aria-roledescription={zh ? "幻灯片" : "slide"} aria-label={`${active + 1} / ${scenes.length} · ${scene.label}`} aria-live={running ? "off" : "polite"}>
            <p className="employee-eyebrow">{zh ? "SkyMythos · 人与 AI，一起把工作做好" : "SKYMYTHOS · PEOPLE AND AI, WORKING TOGETHER"}</p>
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
              <Link href="#people-and-teams" className="employee-primary">{zh ? "看见协作价值" : "Explore the benefits"}<span aria-hidden="true">↗</span></Link>
              <Link href={localePath(locale, "/docs/getting-started/overview")} className="employee-secondary">{zh ? "快速开始" : "Get started"}<span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <ol className="employee-scene-picker" aria-label={zh ? "协作主题" : "Collaboration topics"}>
            {scenes.map((item, index) => <li key={item.id} className="employee-chapter" data-active={active === index}>
              <span>{item.label}</span><span className="employee-chapter-track" aria-hidden="true"><span /></span>
            </li>)}
          </ol>
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
