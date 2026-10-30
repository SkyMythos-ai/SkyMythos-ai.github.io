"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ProductSceneName } from "@/lib/product-reference";
import { bootstrapProductShadows } from "./demo-controller";
import "@/styles/product-capture-player.css";

const stages = ["start", "middle", "result"] as const;
const labels: Record<ProductSceneName, readonly string[]> = {
  delivery: ["执行中", "执行完成", "等待验收"],
  methods: ["选择经验", "分析经验", "确认方案"],
  management: ["连接清单", "服务配置", "授权配置"],
};
const summaries: Record<ProductSceneName, readonly string[]> = {
  delivery: ["正在核对配置与回滚路径", "执行完成，检查结果已整理", "交付已生成，等待人工验收"],
  methods: ["选择已有经验作为员工来源", "分析经验来源，尚未生成产物", "员工方案待确认，尚未创建"],
  management: ["查看已连接与待配置服务", "查看 GitHub 配置与凭据入口", "示例模型未配置，凭据等待填写"],
};
const stageDuration = 4000;
// 按真实捕获内容取景；只移动外层浏览窗口，保留产品原始尺寸与布局。
const cameraOffsets: Record<ProductSceneName, readonly number[]> = {
  delivery: [620, 620, 448],
  methods: [24, 24, 24],
  management: [24, 132, 132],
};
type View = { stage: number; ready: boolean; playing: boolean; requested: boolean; reduced: boolean };
type Controls = { select: (stage: number) => void; toggle: () => void };

/** 只控制服务端已校验的三个真实捕获状态，不构造产品 DOM、不调用产品业务。 */
export function ProductCapturePlayer({ name, children }: { name: ProductSceneName; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const controls = useRef<Controls | null>(null);
  const [view, setView] = useState<View>({ stage: 2, ready: false, playing: false, requested: false, reduced: false });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    bootstrapProductShadows(root);
    const host = root.querySelector<HTMLElement>(`[data-native-demo="${name}"]`);
    const shadow = host?.shadowRoot;
    if (!host || !shadow) return;
    const frames = stages.map(stage => shadow.querySelector<HTMLElement>(`[data-product-frame="${name}-${stage}"]`));
    if (frames.some(frame => !frame)) return;
    const viewport = root.querySelector<HTMLElement>(".pc-scroll");
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches;
    let stage = 2;
    let requested = false;
    let visible = false;
    let started = false;
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let runningSince: number | null = null;
    let remaining = stageDuration;
    let cameraStage = -1;
    let manualCamera = false;

    function frameViewport() {
      if (!viewport) return;
      const overflow = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      viewport.scrollLeft = overflow <= 2 ? 0 : Math.min(overflow, cameraOffsets[name][stage]);
    }
    const resizeViewport = () => {
      manualCamera = false;
      frameViewport();
    };
    const holdCamera = () => { manualCamera = true; };
    const cameraKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") holdCamera();
    };
    viewport?.addEventListener("pointerdown", holdCamera, { passive: true });
    viewport?.addEventListener("touchstart", holdCamera, { passive: true });
    viewport?.addEventListener("wheel", holdCamera, { passive: true });
    viewport?.addEventListener("keydown", cameraKey);
    window.addEventListener("resize", resizeViewport);

    function stopClock() {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
      if (runningSince !== null) remaining = Math.max(0, remaining - (performance.now() - runningSince));
      runningSince = null;
    }
    function show() {
      if (!host || disposed) return;
      const frame = frames[stage]!;
      frames.forEach((item, index) => { item!.hidden = index !== stage; });
      if (stage !== cameraStage && !manualCamera) frameViewport();
      cameraStage = stage;
      host.dataset.referenceFrame = frame.dataset.referenceFrame;
      host.dataset.phase = frame.dataset.phase;
      host.dataset.inspection = stages[stage];
      host.dataset.complete = String(stage === 2);
      host.dataset.elapsed = (started ? (stage * stageDuration + (stage === 2 ? 0 : stageDuration - remaining)) / 1000 : 0).toFixed(3);
      host.dataset.running = String(runningSince !== null);
      host.dataset.mode = started ? "captured" : "static";
      setView({ stage, ready: true, playing: runningSince !== null, requested, reduced });
    }
    function sync() {
      stopClock();
      const styled = host?.dataset.productStyles === "ready";
      // 首次入场才切换初态；未载入 CSS 时继续保留服务端终态。
      if (!started && visible && !document.hidden && styled && !reduced) {
        started = true;
        stage = 0;
        requested = true;
        remaining = stageDuration;
      }
      if (requested && visible && !document.hidden && styled && !reduced && stage < 2) {
        runningSince = performance.now();
        timer = setTimeout(() => {
          stopClock();
          stage += 1;
          remaining = stageDuration;
          if (stage === 2) requested = false;
          sync();
        }, remaining);
      }
      show();
    }
    controls.current = {
      select(next) {
        stopClock();
        started = true;
        requested = false;
        stage = next;
        remaining = stageDuration;
        sync();
      },
      toggle() {
        if (reduced) return;
        stopClock();
        started = true;
        if (stage === 2) {
          stage = 0;
          remaining = stageDuration;
          requested = true;
        } else requested = !requested;
        sync();
      },
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0 });
    observer.observe(root);
    const styles = new MutationObserver(sync);
    styles.observe(host, { attributes: true, attributeFilter: ["data-product-styles"] });
    const visibility = () => sync();
    const preference = () => {
      stopClock();
      reduced = media.matches;
      if (reduced) {
        stage = 2;
        remaining = stageDuration;
        requested = false;
        started = true;
      }
      sync();
    };
    const pagehide = () => { visible = false; sync(); };
    const pageshow = () => {
      const box = root.getBoundingClientRect();
      visible = box.bottom > 0 && box.top < window.innerHeight;
      sync();
    };
    document.addEventListener("visibilitychange", visibility);
    media.addEventListener("change", preference);
    window.addEventListener("pagehide", pagehide);
    window.addEventListener("pageshow", pageshow);
    sync();
    return () => {
      disposed = true;
      stopClock();
      controls.current = null;
      observer.disconnect();
      styles.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      media.removeEventListener("change", preference);
      window.removeEventListener("pagehide", pagehide);
      window.removeEventListener("pageshow", pageshow);
      window.removeEventListener("resize", resizeViewport);
      viewport?.removeEventListener("pointerdown", holdCamera);
      viewport?.removeEventListener("touchstart", holdCamera);
      viewport?.removeEventListener("wheel", holdCamera);
      viewport?.removeEventListener("keydown", cameraKey);
      // StrictMode / 路由离场只还原包裹元数据与可见性，不碰捕获 HTML。
      frames.forEach((frame, index) => { frame!.hidden = index !== 2; });
      host.dataset.referenceFrame = frames[2]!.dataset.referenceFrame;
      host.dataset.phase = frames[2]!.dataset.phase;
      host.dataset.inspection = "result";
      host.dataset.complete = "true";
      host.dataset.elapsed = "0.000";
      host.dataset.running = "false";
      host.dataset.mode = "static";
    };
  }, [name]);

  return (
    <div ref={rootRef} className="product-capture-player" data-player={name} data-player-stage={stages[view.stage]} data-playing={view.playing} data-ready={view.ready} data-reduced={view.reduced}>
      <div className="pc-toolbar" hidden={!view.ready}>
        <div className="pc-steps" role="group" aria-label="查看产品演示步骤">
          {labels[name].map((label, index) => <button key={label} type="button" aria-pressed={view.stage === index} onClick={() => controls.current?.select(index)}>{label}</button>)}
        </div>
        <button className="pc-play" type="button" disabled={view.reduced} onClick={() => controls.current?.toggle()}>{view.reduced ? "已减少动态" : view.stage === 2 ? "重播" : view.requested ? "暂停" : "继续"}</button>
      </div>
      <p className="pc-summary" aria-live="polite" aria-atomic="true"><span>{view.stage + 1} / 3</span>{summaries[name][view.stage]}</p>
      <p className="pc-scroll-hint">左右滑动查看界面</p>
      <div className="pc-scroll" tabIndex={0} role="region" aria-label="真实产品只读界面，可左右滑动查看">{children}</div>
      <p className="pc-caption">真实产品界面 · 固定示例数据 · 只读演示</p>
    </div>
  );
}
