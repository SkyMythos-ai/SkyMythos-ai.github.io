"use client";

import Link from "next/link";
import { Popover } from "@base-ui/react/popover";
import { ArrowRight, BookOpen, Layers3, SquarePlay, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { localizeHref, type Locale } from "@/lib/i18n";
import { CompanionBody, CompanionFace, setCompanionBrandProgress } from "./brand-mark";
import { useSiteMotion } from "./site-motion";
import styles from "./brand-companion.module.css";

type Phase = "closed" | "opening" | "open" | "closing";
type Point = { x: number; y: number };
type Pose = Point & { vx: number; vy: number; form: number; vf: number; angle: number; stretch: number; gx: number; gy: number };
type BrandOrigin = Point & { element: HTMLElement; width: number; height: number };
const subscribeMounted = () => () => {};
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const closedFace = "translate(22px, 14px)";

function readBrandOrigin(): BrandOrigin | null {
  const element = document.querySelector<HTMLElement>("header [data-brand-origin]");
  const image = element && [...element.querySelectorAll("img")].find(img => img.getBoundingClientRect().width > 0);
  if (!element || !image) return null;
  const rect = image.getBoundingClientRect();
  // 原锁定字标 viewBox 为1200×306，最左256×306是S；仅交接这一部分。
  return { element, x: rect.x, y: rect.y, width: rect.width * 256 / 1200, height: rect.height };
}

function transferTarget(origin: BrandOrigin, destination: Point, progress: number): Point {
  const start = { x: origin.x - 10, y: origin.y - 4 };
  const t = progress * progress * (3 - 2 * progress);
  const c = 1 - t;
  const control = { x: mix(start.x, destination.x, .32), y: Math.max(start.y + 70, destination.y + 70) };
  return { x: c * c * start.x + 2 * c * t * control.x + t * t * destination.x, y: c * c * start.y + 2 * c * t * control.y + t * t * destination.y };
}

function routeTarget(anchor: HTMLElement, width: number, height: number): Point {
  const rect = anchor.getBoundingClientRect();
  const centerX = rect.left + (rect.width - 80) / 2;
  const endY = height - 104;
  const work = document.querySelector("#work")?.getBoundingClientRect();
  const governance = document.querySelector("#governance")?.getBoundingClientRect();
  const containerGutter = Math.max(0, (width - 1280) / 2);
  if (width < 700 || containerGutter < 96) {
    const t = clamp((window.scrollY - 240) / Math.max(300, rect.top + window.scrollY - 80), 0, 1);
    return { x: mix(centerX, width - 92, t * t * (3 - 2 * t)), y: mix(rect.top, endY, t) };
  }
  if (governance && governance.top < height * .7 && governance.bottom > 120)
    return { x: width - 100, y: height * .54 };
  if (work && work.top < height * .75 && work.bottom > 120) {
    const gutter = Math.max(0, (width - 1440) / 2);
    const stage = document.querySelector("[data-capability-stage]")?.getBoundingClientRect();
    return gutter > 90
      ? { x: gutter - 84, y: height * .55 }
      : { x: width - 96, y: clamp((stage?.top ?? 104) + 160, 132, height - 120) };
  }
  const product = document.querySelector("#product-demo")?.getBoundingClientRect();
  const t = clamp((window.scrollY - 240) / Math.max(360, rect.top + window.scrollY + 160), 0, 1);
  const left = Math.max(16, (product?.left ?? 72) - 78);
  const c = 1 - t;
  return {
    x: c ** 3 * centerX + 3 * c * c * t * (centerX - width * .3) + 3 * c * t * t * left + t ** 3 * left,
    y: c ** 3 * rect.top + 3 * c * c * t * (rect.top - 130) + 3 * c * t * t * (height * .35) + t ** 3 * (height * .63),
  };
}

/** 一个完整角色：路径决定飞行，速度决定体态，同一张脸随身体展开成导览。 */
export function BrandCompanion({ locale }: { locale: Locale }) {
  const mounted = useSyncExternalStore(subscribeMounted, () => true, () => false);
  const { enabled, running, reducedMotion } = useSiteMotion();
  const [phase, setPhase] = useState<Phase>("closed");
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [dizzy, setDizzy] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const interactiveRef = useRef(false);
  const brandOriginRef = useRef<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const companionRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const faceSlotRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const morphSkinRef = useRef<HTMLDivElement>(null);
  const panelSkinRef = useRef<HTMLDivElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const pointerRef = useRef<Point | null>(null);
  const navigatingRef = useRef(false);
  const popupAnimation = useRef<Animation | null>(null);
  const faceAnimation = useRef<Animation | null>(null);
  const skinAnimations = useRef<Animation[]>([]);
  const transitionPhase = useRef<Phase | null>(null);
  const activePopup = useRef<HTMLElement | null>(null);
  const menuRect = useRef<DOMRect | null>(null);
  const dizzyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const floating = mounted;
  const following = enabled && running && phase === "closed" && !hovered && !focused;
  const text = (zh: string, en: string) => locale === "zh" ? zh : en;
  const links = [
    { href: "#product-demo", label: text("看工作台演示", "Watch live workflow"), Icon: SquarePlay },
    { href: localizeHref("/solutions", locale), label: text("岗位解决方案", "Role solutions"), Icon: Layers3 },
    { href: localizeHref("/docs", locale), label: text("阅读产品文档", "Read documentation"), Icon: BookOpen },
    { href: localizeHref("/poc", locale), label: text("预约演示", "Book a Demo"), Icon: ArrowRight },
  ];

  useEffect(() => {
    const element = companionRef.current;
    const anchor = anchorRef.current;
    const body = bodyRef.current;
    const face = faceRef.current;
    if (!floating || !element || !anchor || !body || !face) return;
    let frame = 0;
    let last = 0;
    let wheelDirection = 0;
    let reversals: number[] = [];
    const svg = body.querySelector<SVGSVGElement>("[data-companion-body]");
    if (!svg) return;
    const render = (now: number) => {
      frame = 0;
      const width = document.documentElement.clientWidth;
      const height = window.innerHeight;
      const origin = readBrandOrigin();
      if (!origin) return;
      brandOriginRef.current = origin.element;
      const progress = clamp((window.scrollY - 16) / 224, 0, 1);
      const source = { x: origin.x - 10, y: origin.y - 4 };
      const target = transferTarget(origin, routeTarget(anchor, width, height), progress);
      const p = poseRef.current ?? { ...source, vx: 0, vy: 0, form: 0, vf: 0, angle: 0, stretch: 1, gx: 0, gy: 0 };
      if (progress === 0 && p.form < .002 && element.dataset.atOrigin === "true") {
        p.x = source.x; p.y = source.y; p.vx = 0; p.vy = 0;
      }
      const homing = window.scrollY <= 16 && phase === "closed";
      const travelling = floating && enabled && running && (following || homing);
      const dt = Math.min(last ? now - last : 16, 32) / 1000;
      last = now;
      if (travelling) {
        p.vx += ((target.x - p.x) * 115 - p.vx * 16) * dt;
        p.vy += ((target.y - p.y) * 115 - p.vy * 16) * dt;
        p.vf += ((progress - p.form) * 115 - p.vf * 16) * dt;
        p.form = clamp(p.form + p.vf * dt, 0, 1);
        p.x += p.vx * dt; p.y += p.vy * dt;
      } else if (reducedMotion && phase === "closed" && ((!hovered && !focused) || homing)) {
        p.form = progress > .5 ? 1 : 0;
        p.x = p.form ? width - 96 : source.x;
        p.y = p.form ? height - 104 : source.y;
        p.vx = 0; p.vy = 0; p.vf = 0;
      } else { p.vx = 0; p.vy = 0; }
      const speed = Math.hypot(p.vx, p.vy);
      let gazeError = 0;
      if (reducedMotion) {
        p.angle = 0; p.stretch = 1; p.gx = 0; p.gy = 0;
        body.style.transform = "none";
        face.style.setProperty("--face-angle", "0deg");
        face.style.setProperty("--gaze-x", "0px"); face.style.setProperty("--gaze-y", "0px");
        face.style.setProperty("--eye-length", "1");
      }
      if (running && !reducedMotion) {
        p.angle = mix(p.angle, clamp(p.vx * .008, -14, 14) * p.form, .2);
        p.stretch = mix(p.stretch, 1 + Math.min(.24, speed / 6500) * p.form, .24);
        const rect = face.getBoundingClientRect();
        const pointer = pointerRef.current ?? { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
        const gx = speed > 160 ? clamp(p.vx / 300, -4, 4) : clamp((pointer.x - rect.x - rect.width / 2) / 100, -4, 4);
        const gy = speed > 160 ? clamp(p.vy / 400, -2, 2) : clamp((pointer.y - rect.y - rect.height / 2) / 120, -3, 3);
        p.gx = mix(p.gx, gx, .22); p.gy = mix(p.gy, gy, .22);
        gazeError = Math.hypot(gx - p.gx, gy - p.gy);
        const ux = speed > 2 ? p.vx / speed : 1;
        const uy = speed > 2 ? p.vy / speed : 0;
        const s = p.stretch; const inv = 1 / s;
        const a = s * ux * ux + inv * uy * uy;
        const b = (s - inv) * ux * uy;
        const d = s * uy * uy + inv * ux * ux;
        body.style.transform = `rotate(${p.angle}deg) matrix(${a},${b},${b},${d},0,0)`;
        face.style.setProperty("--gaze-x", `${p.gx}px`);
        face.style.setProperty("--gaze-y", `${p.gy}px`);
        face.style.setProperty("--face-angle", `${p.angle * .65}deg`);
        face.style.setProperty("--eye-length", String(Math.max(.5, 1 - speed / 5500 - Math.abs(p.gy) * .045)));
      }
      poseRef.current = p;
      if (floating) {
        const linking = p.form < .999 || progress < 1;
        p.x = clamp(p.x, linking ? 0 : 12, Math.max(12, width - 92));
        p.y = clamp(p.y, linking ? 0 : 92, Math.max(92, height - 92));
        const atOrigin = p.form < .002 && Math.hypot(p.x - source.x, p.y - source.y) < .6 && speed < 1;
        origin.element.style.setProperty("--brand-mark-cut", atOrigin ? "0px" : `${origin.width + 1}px`);
        element.dataset.atOrigin = String(atOrigin);
        element.dataset.linking = String(linking);
        element.style.setProperty("--actor-form", String(p.form));
        element.style.setProperty("--body-width", `${mix(origin.width, 60, p.form)}px`);
        element.style.setProperty("--body-height", `${mix(origin.height, 54, p.form)}px`);
        element.style.setProperty("--face-presence", String(clamp((p.form - .55) / .35, 0, 1)));
        element.style.setProperty("--caption-presence", String(clamp((p.form - .9) / .1, 0, 1)));
        const dark = document.documentElement.dataset.theme === "dark";
        const color = [49, 86, 255].map(value => Math.round(mix(dark ? 255 : value, value, p.form)));
        element.style.setProperty("--companion-ink", `rgb(${color.join(" ")})`);
        // 先收拢字形，再显出表情，避免眼睛浮在尚未闭合的S轮廓里。
        setCompanionBrandProgress(svg, 1 - (1 - p.form) ** 3);
        svg.style.setProperty("--brand-morph", String(clamp((p.form - .6) / .4, 0, 1)));
        if (atOrigin && element.contains(document.activeElement)) origin.element.focus({ preventScroll: true });
        const ready = p.form > .995 && !atOrigin;
        if (ready !== interactiveRef.current) {
          if (!ready && element.contains(document.activeElement)) origin.element.focus({ preventScroll: true });
          interactiveRef.current = ready; setInteractive(ready);
        }
        element.style.setProperty("--companion-x", `${p.x}px`);
        element.style.setProperty("--companion-y", `${p.y}px`);
        element.dataset.ready = "true";
      }
      if (phase === "open" && faceSlotRef.current) {
        const slot = faceSlotRef.current.getBoundingClientRect();
        const root = element.getBoundingClientRect();
        face.style.transform = `translate(${slot.left - root.left}px, ${slot.top - root.top}px)`;
        if (popupRef.current) menuRect.current = popupRef.current.getBoundingClientRect();
      }
      const moving = travelling && (Math.hypot(target.x - p.x, target.y - p.y) > .2 || speed > .5 || Math.abs(progress - p.form) > .001 || Math.abs(p.vf) > .002);
      if (running && !reducedMotion && (moving || Math.abs(p.angle) > .04 || p.stretch > 1.001 || gazeError > .06)) frame = requestAnimationFrame(render);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const pointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      if ((poseRef.current?.form ?? 0) > .55) schedule();
    };
    const wheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 8) return;
      const direction = Math.sign(event.deltaY);
      const now = performance.now();
      if (wheelDirection && direction !== wheelDirection) reversals.push(now);
      wheelDirection = direction; reversals = reversals.filter(t => now - t < 2200);
      if (reversals.length >= 4 && interactiveRef.current) {
        reversals = []; setDizzy(true);
        if (dizzyTimer.current) clearTimeout(dizzyTimer.current);
        dizzyTimer.current = setTimeout(() => setDizzy(false), 3000);
      }
    };
    schedule();
    if ((enabled && running && phase === "closed") || reducedMotion) window.addEventListener("scroll", schedule, { passive: true });
    if (running && !reducedMotion) {
      window.addEventListener("pointermove", pointerMove, { passive: true });
      window.addEventListener("wheel", wheel, { passive: true });
    }
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", pointerMove); window.removeEventListener("wheel", wheel);
    };
  }, [floating, following, running, reducedMotion, phase, hovered, focused, enabled]);

  useEffect(() => {
    if (!running || reducedMotion || dizzy || !interactive) return;
    let blink: ReturnType<typeof setTimeout>;
    let finish: ReturnType<typeof setTimeout>;
    const schedule = () => { blink = setTimeout(() => {
      setBlinking(true);
      finish = setTimeout(() => { setBlinking(false); schedule(); }, 150);
    }, 1600 + Math.random() * 1800); };
    schedule();
    return () => { clearTimeout(blink); clearTimeout(finish); };
  }, [running, reducedMotion, dizzy, interactive]);

  useLayoutEffect(() => {
    const root = companionRef.current;
    const face = faceRef.current;
    if (!root || !face) return;
    if (phase === "closed") {
      popupAnimation.current?.cancel(); faceAnimation.current?.cancel();
      skinAnimations.current.forEach(animation => animation.cancel());
      transitionPhase.current = null; activePopup.current = null;
      root.dataset.expanded = "false";
      face.style.transform = closedFace;
      return;
    }
    if (phase === "open") {
      const frame = requestAnimationFrame(() => {
        const popup = popupRef.current;
        const slot = faceSlotRef.current;
        if (!popup || !slot) return;
        root.dataset.expanded = "true";
        popup.dataset.skinReady = "true";
        if (morphSkinRef.current) morphSkinRef.current.style.opacity = "0";
        if (panelSkinRef.current) panelSkinRef.current.style.opacity = "1";
        const target = slot.getBoundingClientRect();
        const origin = root.getBoundingClientRect();
        face.style.transform = `translate(${target.x - origin.x}px, ${target.y - origin.y}px)`;
        menuRect.current = popup.getBoundingClientRect();
      });
      return () => cancelAnimationFrame(frame);
    }
    // 后台保留过渡进度；手动暂停仍将菜单呈现为可操作的静态终态。
    if (enabled && !running) {
      popupAnimation.current?.pause(); faceAnimation.current?.pause();
      skinAnimations.current.forEach(animation => animation.pause());
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const frame = requestAnimationFrame(() => {
      const popup = popupRef.current;
      const slot = faceSlotRef.current;
      const morph = morphSkinRef.current;
      const panel = panelSkinRef.current;
      if (!popup || !slot || !morph || !panel) return;
      const resuming = transitionPhase.current === phase && activePopup.current === popup;
      const previousDuration = Number(popupAnimation.current?.effect?.getTiming().duration) || 1;
      const progress = resuming ? clamp(Number(popupAnimation.current?.currentTime ?? 0) / previousDuration, 0, 1) : 0;
      const faceFrom = getComputedStyle(face).transform;
      const popupFrom = getComputedStyle(popup).transform;
      const morphFrom = getComputedStyle(morph).opacity;
      const panelFrom = getComputedStyle(panel).opacity;
      const bodyFrom = bodyRef.current?.getBoundingClientRect();
      popupAnimation.current?.cancel(); faceAnimation.current?.cancel();
      skinAnimations.current.forEach(animation => animation.cancel());
      const origin = root.getBoundingClientRect();
      if (phase === "opening" && !resuming) menuRect.current = popup.getBoundingClientRect();
      const end = menuRect.current ?? popup.getBoundingClientRect();
      const shell = phase === "opening" && bodyFrom ? bodyFrom : { x: origin.x + 10, y: origin.y + 4, width: 60, height: 54 };
      const shellTransform = `translate(${shell.x - end.x}px, ${shell.y - end.y}px) scale(${shell.width / end.width}, ${shell.height / end.height})`;
      const destination = slot.getBoundingClientRect();
      const faceTo = phase === "opening" ? `translate(${destination.x - origin.x}px, ${destination.y - origin.y}px)` : closedFace;
      const duration = reducedMotion || !enabled ? 0 : (phase === "opening" ? 460 : 300) * (1 - progress);
      const easing = phase === "opening" ? "cubic-bezier(.16, 1.25, .3, 1)" : "cubic-bezier(.16, 1, .3, 1)";
      popup.dataset.skinReady = "true";
      root.dataset.expanded = "true";
      popupAnimation.current = popup.animate([
        { transform: phase === "opening" && !resuming ? shellTransform : popupFrom },
        { transform: phase === "opening" ? "none" : shellTransform },
      ], { duration, easing, fill: "both" });
      faceAnimation.current = face.animate([{ transform: faceFrom }, { transform: faceTo }], { duration, easing, fill: "both" });
      skinAnimations.current = [
        morph.animate(phase === "opening"
          ? [{ opacity: morphFrom }, { opacity: 0, offset: .28 }, { opacity: 0 }]
          : [{ opacity: morphFrom }, { opacity: 0, offset: .62 }, { opacity: 1 }], { duration, fill: "both" }),
        panel.animate(phase === "opening"
          ? [{ opacity: panelFrom }, { opacity: 1, offset: .28 }, { opacity: 1 }]
          : [{ opacity: panelFrom }, { opacity: 1, offset: .68 }, { opacity: 0 }], { duration, fill: "both" }),
      ];
      transitionPhase.current = phase; activePopup.current = popup;
      timer = setTimeout(() => {
        face.style.transform = faceTo;
        popup.style.transform = phase === "opening" ? "none" : shellTransform;
        morph.style.opacity = phase === "opening" ? "0" : "1";
        panel.style.opacity = phase === "opening" ? "1" : "0";
        popupAnimation.current?.cancel(); faceAnimation.current?.cancel();
        skinAnimations.current.forEach(animation => animation.cancel());
        setPhase(phase === "opening" ? "open" : "closed");
      }, duration);
    });
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, [phase, reducedMotion, enabled, running, floating]);

  useEffect(() => () => {
    popupAnimation.current?.cancel(); faceAnimation.current?.cancel();
    skinAnimations.current.forEach(animation => animation.cancel());
    if (dizzyTimer.current) clearTimeout(dizzyTimer.current);
    brandOriginRef.current?.style.removeProperty("--brand-mark-cut");
  }, []);

  function navigate() { navigatingRef.current = true; setPhase("closed"); }
  const controls = <Popover.Root open={phase !== "closed"} onOpenChange={next => {
    if (next) { navigatingRef.current = false; if (poseRef.current) { poseRef.current.form = 1; poseRef.current.vf = 0; } setPhase("opening"); }
    else if (phase !== "closing") setPhase("closing");
  }}>
    <div ref={companionRef} className={styles.companion} data-brand-companion data-floating={floating} data-phase={phase} data-running={running} data-at-origin="true" data-interactive={interactive}
      onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }} onPointerLeave={() => setHovered(false)}>
      <Popover.Trigger className={styles.trigger} aria-label={text("打开官网导览", "Open site guide")} tabIndex={interactive ? 0 : -1} aria-hidden={!interactive}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
        <div ref={bodyRef} className={styles.shell}><CompanionBody brandForm className={dizzy && interactive ? styles.dizzy : undefined} /></div>
        <span className={styles.caption}>{text("官网导览", "Site guide")}</span>
      </Popover.Trigger>
      <div ref={faceRef} className={styles.face}><CompanionFace blinking={blinking && interactive} dizzy={dizzy && interactive} /></div>
    </div>
    <Popover.Portal>
      <Popover.Positioner side="top" align="center" sideOffset={-58} collisionPadding={16} className={styles.positioner}>
        <Popover.Popup ref={popupRef} className={styles.popup} data-phase={phase} data-running={running} finalFocus={() => {
          if (navigatingRef.current) return false;
          return window.scrollY <= 16 ? document.querySelector<HTMLElement>("header [data-brand-origin]") ?? true : true;
        }}>
          <div ref={morphSkinRef} className={styles.morphSkin} aria-hidden="true"><CompanionBody stretch /></div>
          <div ref={panelSkinRef} className={styles.panelSkin} aria-hidden="true" />
          <div className={styles.popupHeader}>
            <span ref={faceSlotRef} className={styles.faceSlot} aria-hidden="true" />
            <Popover.Title>{text("SkyMythos 导览", "SkyMythos guide")}</Popover.Title>
            <Popover.Close className={styles.close} aria-label={text("关闭导览", "Close guide")}><X size={17} /></Popover.Close>
          </div>
          <nav aria-label={text("官网快捷导航", "Site shortcuts")}>
            {links.map(({ href, label, Icon }) => {
              const content = <><Icon size={18} aria-hidden="true" /><span>{label}</span><ArrowRight size={15} aria-hidden="true" /></>;
              return href.startsWith("#") ? <a key={href} href={href} onClick={navigate}>{content}</a> : <Link key={href} href={href} onClick={navigate}>{content}</Link>;
            })}
          </nav>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>;
  return <div className={styles.anchor} ref={anchorRef} data-brand-anchor>{floating ? createPortal(controls, document.body) : controls}</div>;
}
