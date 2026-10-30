"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { basePath } from "@/lib/site";
import "@/styles/source-product-demo.css";

type Scene = "delivery" | "training" | "knowledge";
const sceneRevision = "7295629889d881f3485168832359d16d141021f9";
const heroRevision = "14f40b0fc37f7a20eeab00293e3527725552a255";
const scenes = {
  delivery: { title: "从接收任务到持续执行与产出结果", route: "/zh/product/work-delivery/", fallback: "发送任务 → 自动读取资料与检查配置 → 生成报告与完成反馈。" },
  training: { title: "从工作经验创建员工", route: "/zh/product/methods/", fallback: "员工负责什么 → 选择工作经验 → 分析所选经验 → 确认员工方案。" },
  knowledge: { title: "检索企业知识并打开原文", route: "/zh/docs/guides/knowledge-base/", fallback: "搜索已有知识，查看匹配内容，再打开相应原文核对工作依据。" },
};
type Playback = { time: number; duration: number; ready: boolean; playing: boolean; phase: string };
type Control = { action: "play" | "pause" | "replay" | "theme" | "visibility"; theme?: "light" | "dark"; visible?: boolean; reduced?: boolean };

/** 首屏保留完整控制台；后续章节承载原生组件场景，两类来源独立且均只读。 */
export function SourceProductDemo({ name, wholePage = false }: { name: Scene; wholePage?: boolean }) {
  const revision = wholePage ? heroRevision : sceneRevision;
  const presentation = wholePage ? "whole-page" : "composed-v1";
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const followPage = useRef(true);
  const visible = useRef(false);
  const initialized = useRef(false);
  const crashed = useRef(false);
  const warmed = useRef(false);
  const reduced = useRef(false);
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [client, setClient] = useState(false);
  const [mounted, setMounted] = useState(wholePage);
  const [attempt, setAttempt] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [failed, setFailed] = useState(false);
  const [motion, setMotion] = useState<Playback>({ time: 0, duration: 24000, ready: false, playing: false, phase: "loading" });
  const send = useCallback((message: Control) => frame.current?.contentWindow?.postMessage({ type: "skymythos-product-demo-control", scene: name, ...message }, location.origin), [name]);
  const sync = useCallback(() => {
    const theme = document.documentElement.dataset.siteTheme === "dark" ? "dark" : "light";
    send({ action: "theme", theme });
    send({ action: "visibility", visible: visible.current && !document.hidden, reduced: reduced.current });
  }, [send]);
  const pageOffset = motion.time < 1500 ? 0 : 240;
  // 首屏随 HTML 启动；正文按阅读顺序预热，播放仍由实际可见性控制。
  useEffect(() => {
    if (mounted || !root.current) return;
    const predecessor = name === "delivery" ? "hero" : name === "training" ? "delivery" : "training";
    let disposed = false;
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const mount = () => {
      idle = undefined;
      timer = undefined;
      if (!disposed && !document.hidden) setMounted(true);
    };
    const warm = () => {
      if (disposed || document.hidden || idle !== undefined || timer !== undefined) return;
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(mount, { timeout: 1500 });
      else timer = setTimeout(mount, 300);
    };
    const ready = (event: Event) => {
      if (event instanceof CustomEvent && event.detail?.prototype === predecessor) warm();
    };
    const resume = () => {
      if (document.querySelector(`[data-prototype="${predecessor}"][data-ready="true"][data-assets-ready="true"]`)) warm();
    };
    document.addEventListener("skymythos-demo-ready", ready);
    document.addEventListener("visibilitychange", resume);
    resume();
    return () => {
      disposed = true;
      if (idle !== undefined) window.cancelIdleCallback(idle);
      clearTimeout(timer);
      document.removeEventListener("skymythos-demo-ready", ready);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [mounted, name]);

  // 期限从实际挂载开始；后台期间不把浏览器的延后加载误报为失败。
  useEffect(() => {
    if (!mounted || motion.ready) return;
    const watch = () => {
      clearTimeout(loadingTimer.current);
      loadingTimer.current = document.hidden ? undefined : setTimeout(() => setFailed(true), 12000);
    };
    watch();
    document.addEventListener("visibilitychange", watch);
    return () => { clearTimeout(loadingTimer.current); document.removeEventListener("visibilitychange", watch); };
  }, [mounted, attempt, motion.ready]);
  useEffect(() => {
    if (!wholePage || !motion.ready || !followPage.current || !matchMedia("(max-width:700px)").matches) return;
    viewport.current?.scrollTo({ left: pageOffset, behavior: motion.playing && !reducedMotion ? "smooth" : "instant" });
  }, [wholePage, pageOffset, motion.ready, motion.playing, reducedMotion]);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    setClient(true);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = media.matches;
    setReducedMotion(media.matches);
    let loopTimer: ReturnType<typeof setTimeout> | undefined;
    let ended = false;
    let disposed = false;
    let parentFocus: HTMLElement | null = null;
    const rememberFocus = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement) || target.tagName === "IFRAME") return;
      parentFocus = target === document.body || target === document.documentElement ? null : target;
    };
    const focusChanged = (event: FocusEvent) => rememberFocus(event.target);
    rememberFocus(document.activeElement);
    document.addEventListener("focusin", focusChanged);
    const cancelLoop = () => { clearTimeout(loopTimer); loopTimer = undefined; };
    const scheduleLoop = () => {
      if (disposed || loopTimer || !ended || !visible.current || document.hidden || reduced.current) return;
      loopTimer = setTimeout(() => {
        loopTimer = undefined;
        if (disposed || !ended || !visible.current || document.hidden || reduced.current) return;
        ended = false;
        followPage.current = true;
        send({ action: "replay" });
      }, 3000);
    };
    const message = (event: MessageEvent<unknown>) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow) return;
      if (!event.data || typeof event.data !== "object") return;
      const data = event.data as Record<string, unknown>;
      if (data.scene !== name || data.sourceRevision !== revision || data.presentation !== (wholePage ? undefined : presentation)) return;
      if (data.type === "skymythos-product-demo-error" && data.failed === true) {
        crashed.current = true;
        ended = false;
        cancelLoop();
        send({ action: "pause" });
        setFailed(true);
        setMotion(current => ({ ...current, ready: false, playing: false, phase: "error" }));
        return;
      }
      if (crashed.current || data.type !== "skymythos-product-demo" || data.ready !== true) return;
      if (typeof data.duration !== "number" || !Number.isFinite(data.duration) || data.duration <= 0 || data.duration > 120000 || typeof data.time !== "number" || !Number.isFinite(data.time) || typeof data.playing !== "boolean" || typeof data.phase !== "string" || data.phase.length > 80) return;
      if (data.assetsReady !== undefined && typeof data.assetsReady !== "boolean") return;
      node.dataset.assetsReady = String(!wholePage || data.assetsReady === true);
      // 自动重建的原编辑器可能聚焦 iframe；演示不应接管访客的键盘焦点。
      if (document.hasFocus() && document.activeElement === frame.current) {
        if (parentFocus?.isConnected) parentFocus.focus({ preventScroll: true });
        else frame.current?.blur();
      }
      setFailed(false);
      if (loadingTimer.current) { clearTimeout(loadingTimer.current); loadingTimer.current = undefined; }
      setMotion({ time: Math.max(0, Math.min(data.duration, Math.round(data.time))), duration: data.duration, ready: true, playing: data.playing, phase: data.phase });
      ended = data.time >= data.duration && !data.playing;
      if (ended) scheduleLoop();
      else {
        cancelLoop();
        // 原页面重置期间可能离屏；回来后自动继续，避免停在新周期起点。
        if (!data.playing && visible.current && !document.hidden && !reduced.current) send({ action: "play" });
      }
      if (!initialized.current) {
        initialized.current = true;
        sync();
      }
      if (!warmed.current && (!wholePage || data.assetsReady === true)) {
        warmed.current = true;
        document.dispatchEvent(new CustomEvent("skymythos-demo-ready", { detail: { prototype: wholePage ? "hero" : name } }));
      }
    };
    window.addEventListener("message", message);
    const visibility = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting && entry.intersectionRatio >= .15;
      if (visible.current) {
        setMounted(true);
      }
      if (visible.current) scheduleLoop(); else cancelLoop();
      sync();
    }, { threshold: .15 });
    visibility.observe(node);
    const theme = new MutationObserver(sync);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-site-theme"] });
    const preference = () => { reduced.current = media.matches; setReducedMotion(media.matches); if (reduced.current) cancelLoop(); else scheduleLoop(); sync(); };
    const pageVisibility = () => { if (document.hidden) cancelLoop(); else scheduleLoop(); sync(); };
    document.addEventListener("visibilitychange", pageVisibility);
    media.addEventListener("change", preference);
    return () => {
      disposed = true;
      cancelLoop();
      send({ action: "pause" });
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
      node.dataset.playing = "false";
      window.removeEventListener("message", message);
      visibility.disconnect(); theme.disconnect();
      document.removeEventListener("visibilitychange", pageVisibility);
      document.removeEventListener("focusin", focusChanged);
      media.removeEventListener("change", preference);
    };
  }, [name, wholePage, revision, presentation, send, sync]);

  function reload() {
    crashed.current = false;
    warmed.current = false;
    if (root.current) root.current.dataset.assetsReady = "false";
    initialized.current = false;
    followPage.current = true;
    viewport.current?.scrollTo({ left: 0, behavior: "instant" });
    viewport.current?.focus({ preventScroll: true });
    if (loadingTimer.current) clearTimeout(loadingTimer.current);
    setFailed(false);
    setMotion(current => ({ ...current, ready: false, playing: false, phase: "loading" }));
    setAttempt(current => current + 1);
  }
  const source = wholePage
    ? `${basePath}/product-demo/${revision}-lean-v1/index.html?scene=${name}&attempt=${attempt}`
    : `${basePath}/product-scenes/${revision}-composed-v2/index.html?scene=${name}&attempt=${attempt}`;
  return <article ref={root} className={`focused-prototype source-product-demo source-demo-${wholePage ? "hero" : name} ${wholePage ? "source-whole-page" : "source-composition"}`} data-prototype={wholePage ? "hero" : name} data-source-revision={revision} data-presentation={presentation} data-time={motion.time} data-duration={motion.duration} data-playing={motion.playing} data-ready={motion.ready} data-reduced={reducedMotion} data-phase={motion.phase} data-client={client} aria-label={scenes[name].title}>
    <div className="source-demo-stage">
    <div ref={viewport} className="source-demo-viewport" data-loaded={motion.ready} tabIndex={0} aria-label={wholePage ? "完整产品页面，可左右浏览" : scenes[name].title} onPointerDown={() => { if (wholePage) followPage.current = false; }}>
      {mounted && <iframe key={attempt} ref={frame} title={scenes[name].title} src={source} inert loading="eager" sandbox="allow-scripts allow-same-origin allow-forms" referrerPolicy="no-referrer" onLoad={sync} onError={() => setFailed(true)} />}
      {client && !motion.ready && <div className="source-demo-loading" role="status"><span>{failed ? "产品演示暂时无法载入。" : "正在载入产品演示…"}</span>{failed && <button type="button" onClick={reload}>重新载入演示</button>}<Link prefetch={false} href={scenes[name].route}>查看对应功能</Link></div>}
      <noscript><style>{".source-product-demo .source-demo-viewport{height:auto!important;min-height:0}.source-product-demo iframe{display:none}"}</style><div className="source-demo-static"><h3>{scenes[name].title}</h3><p>{scenes[name].fallback}</p><Link prefetch={false} href={scenes[name].route}>查看产品界面与操作说明</Link></div></noscript>
    </div>
    <span className="source-demo-caption" hidden={!motion.ready}>示例数据</span>
    </div>
    {wholePage && <p className="source-demo-pan-hint" hidden={!motion.ready}>完整产品页面，可左右浏览</p>}
  </article>;
}
