import { observeAnimationHold } from "@/lib/animation-hold";
import { demoDurations, demoFrame, isCapabilityDemoName, type CapabilityDemoName } from "@/lib/capability-demo-model";

const names: CapabilityDemoName[] = ["delivery", "methods", "management"];
const revision = "033a372f66d5f53bbc8e6b519868238976701c47";
const frameCache = new Map<string, string>();
const MAX_FRAME_BYTES = 1_000_000;
type FrameAsset = { id: string; path: string; sha256: string; phase: string; label: string };
type SceneManifest = { width: number; height: number; crop: { x: number; y: number; width: number; height: number }; terminal: string; frames: Record<"start" | "middle" | "result", FrameAsset> };
type ReferenceManifest = { schemaVersion: 2; product: { revision: string }; scenes: Record<CapabilityDemoName, SceneManifest>; assets: Record<string, string> };
type Scene = { name: CapabilityDemoName; element: HTMLElement; shadow: ShadowRoot; canvas: HTMLElement; elapsed: number; visible: boolean; previous: string | null; inserted: HTMLElement[] };
export type CapabilityPlaybackUpdate = { current: CapabilityDemoName; mode: "stage" | "flow"; settled: boolean };

/** 首次直入保留浏览器已解析的 DSD；Next 客户端换页才迁入尚未消费的 inert template。 */
export function bootstrapProductShadows(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-native-demo]").forEach(element => {
    if (element.shadowRoot) return;
    const template = element.querySelector<HTMLTemplateElement>(":scope > template[shadowrootmode='open']");
    if (!template) return;
    const shadow = element.attachShadow({ mode: "open" });
    shadow.append(template.content);
    template.remove();
  });
}

function object(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function validManifest(value: unknown): value is ReferenceManifest {
  if (!object(value) || value.schemaVersion !== 2 || !object(value.product) || value.product.revision !== revision || !object(value.scenes) || !object(value.assets)) return false;
  return names.every(name => {
    const scene = value.scenes && object(value.scenes) ? value.scenes[name] : undefined;
    if (!object(scene) || scene.width !== 1280 || scene.height !== (name === "methods" ? 1100 : 700) || scene.terminal !== `${name}-result` || !object(scene.crop) || !object(scene.frames)) return false;
    if (scene.crop.x !== (name === "methods" ? 260 : 240) || scene.crop.y !== (name === "methods" ? 300 : 56) || scene.crop.width !== 996 || scene.crop.height !== 623) return false;
    return (["start", "middle", "result"] as const).every(phase => {
      const frame = object(scene.frames) ? scene.frames[phase] : undefined;
      return object(frame) && frame.id === `${name}-${phase}` && frame.path === `${name}-${phase}.html` && typeof frame.sha256 === "string" && /^[a-f0-9]{64}$/.test(frame.sha256) && object(value.assets) && value.assets[frame.path] === frame.sha256 && typeof frame.phase === "string" && typeof frame.label === "string";
    });
  });
}
function staticURL(path: string, manifestURL: URL) {
  const url = new URL(path, manifestURL);
  if (url.origin !== location.origin || url.search || url.hash || url.username || url.password || !url.pathname.startsWith(new URL(".", manifestURL).pathname)) throw new Error("Invalid product asset URL");
  return url;
}
async function readAsset(url: URL, signal: AbortSignal, maxBytes: number) {
  const response = await fetch(url, { method: "GET", credentials: "omit", redirect: "error", mode: "same-origin", signal, cache: "force-cache", referrerPolicy: "no-referrer" });
  if (!response.ok || Number(response.headers.get("content-length")) > maxBytes) throw new Error("Unavailable product asset");
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Product asset has no body");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) throw new Error("Product asset exceeds size budget");
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel();
    throw error;
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  chunks.forEach(chunk => { bytes.set(chunk, offset); offset += chunk.length; });
  return bytes;
}

function parseFrame(html: string, scene: SceneManifest, base: URL) {
  // template 不执行脚本也不发起图片请求；校验完成后才允许其进入产品 Shadow DOM。
  const template = document.createElement("template");
  template.innerHTML = html;
  const roots = [...template.content.children];
  const product = roots[0];
  if (roots.length !== 1 || !(product instanceof HTMLElement) || !product.classList.contains("product-reference-root") || !product.hasAttribute("inert") || product.style.width !== `${scene.width}px` || product.style.height !== `${scene.height}px`) throw new Error("Invalid product frame geometry");
  if (template.content.querySelector("script,iframe,object,embed,link,style,base,meta,template,audio,video,source,foreignObject")) throw new Error("Executable product frame");
  const allowedTags = new Set("div span svg path button circle p a rect section g strong input h3 header defs clippath h2 li img nav label aside ul main h1 form br i dt dd ol article th td option small dl textarea h4 tr footer table thead tbody select".split(" "));
  for (const element of template.content.querySelectorAll("*")) {
    if (!allowedTags.has(element.tagName.toLowerCase())) throw new Error("Unexpected product element");
    for (const attribute of element.attributes) {
      const normalized = attribute.value.replace(/[\u0000- ]/g, "");
      if (/^on/i.test(attribute.name) || /javascript:|vbscript:|expression\(/i.test(normalized)) throw new Error("Executable product attribute");
      if (["srcset", "srcdoc", "action", "formaction", "background", "poster", "ping"].includes(attribute.name)) throw new Error("Active product resource");
      if (/url\s*\(/i.test(attribute.value) && !/^url\(#[a-zA-Z0-9_:-]+\)$/.test(attribute.value)) throw new Error("Unexpected product resource");
      if (attribute.name === "style" && /url\s*\(|@import/i.test(attribute.value)) throw new Error("Active inline product style");
      if (attribute.name === "src") {
        if (!(element instanceof HTMLImageElement)) throw new Error("Unexpected product image element");
        const value = attribute.value;
        // 内联图片或版本目录下经固化的机械外置 logo，不允许第三方/业务请求。
        // 捕获源同时含 base64 与百分号编码 SVG（如 data:image/svg+xml,%3csvg...）；两者都不发网络请求。
        // MIME 后必须是逗号或明确的 ;base64,，不能只接受分号而误拒绝真实产品图标。
        if (!/^data:image\/(?:png|jpe?g|webp|svg\+xml)(?:;base64)?,/i.test(value)) {
          const url = new URL(value, location.origin);
          if (url.origin !== base.origin || !url.pathname.startsWith(new URL(".", base).pathname) || !/\/logos\/[a-f0-9]{64}\.svg$/.test(url.pathname) || url.search || url.hash) throw new Error("Unexpected product image");
        }
      }
    }
    if (element instanceof HTMLInputElement && element.type === "password" && element.value !== "") throw new Error("Product projection contains a secret");
  }
  return template.content;
}

async function loadFrame(asset: FrameAsset, scene: SceneManifest, base: URL, signal: AbortSignal) {
  const url = staticURL(asset.path, base);
  const key = `${url.href}/${asset.sha256}`;
  const cached = frameCache.get(key);
  if (cached !== undefined) return parseFrame(cached, scene, base);
  const bytes = await readAsset(url, signal, MAX_FRAME_BYTES);
  const digest = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map(byte => byte.toString(16).padStart(2, "0")).join("");
  if (digest !== asset.sha256 || signal.aborted) throw new Error("Product frame integrity mismatch");
  const html = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  const fragment = parseFrame(html, scene, base);
  // 只缓存最多六个非终态、每帧上限 1MB；不缓存失败或未验证内容，不持久化。
  if (frameCache.size >= 6) frameCache.delete(frameCache.keys().next().value!);
  frameCache.set(key, html);
  return fragment;
}

/**
 * 一次挂载拥有所有局部时钟。六帧均完成验证且尚未入场 → 原子准备初态；否则继续 SSR 终态。
 * 慢载跨过入场、后台/键盘/dialog/离场取消 → 忽略迟到，不在阅读中补跑或重排跑道。
 */
export function mountCapabilityDemos(root: HTMLElement, commercialRoot: HTMLElement) {
  bootstrapProductShadows(root);
  const scenes = new Map<CapabilityDemoName, Scene>();
  root.querySelectorAll<HTMLElement>("[data-native-demo]").forEach(element => {
    const name = element.dataset.nativeDemo;
    const shadow = element.shadowRoot;
    const canvas = shadow?.querySelector<HTMLElement>("[data-product-canvas]");
    if (isCapabilityDemoName(name) && shadow && canvas && shadow.querySelector(`[data-product-frame='${name}-result']`)) scenes.set(name, { name, element, shadow, canvas, elapsed: 0, visible: false, previous: null, inserted: [] });
  });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const events = new AbortController();
  const options = { signal: events.signal };
  let current: CapabilityDemoName | null = null;
  let mode: "stage" | "flow" | null = null;
  let settled = false;
  let held = false;
  let pageHidden = false;
  let disposed = false;
  let dialogOpen = !!commercialRoot.querySelector("dialog[open]");
  let raf = 0;
  let last: number | null = null;
  let running: CapabilityDemoName | null = null;
  let loading: AbortController | null = null;
  let loadTimeout = 0;
  let loadState: "idle" | "loading" | "ready" | "static" = "idle";
  let entered = false;

  function animations(scene: Scene) {
    return new Set([...scene.element.getAnimations({ subtree: true }), ...scene.shadow.getAnimations()]);
  }
  const canRun = () => !disposed && loadState === "ready" && mode === "stage" && settled && current !== null && !!scenes.get(current)?.visible && scenes.get(current)?.element.dataset.productStyles === "ready" && !held && !dialogOpen && !pageHidden && !document.hidden && !reduced.matches;
  function gateAnimations() {
    scenes.forEach((scene, name) => animations(scene).forEach(animation => {
      if (running === name && canRun()) { if (animation.playState === "paused") animation.play(); }
      else animation.pause();
    }));
  }
  function paint(scene: Scene, still = false) {
    const frame = demoFrame(scene.name, scene.elapsed, still);
    const identity = `${scene.name}-${frame.phase}`;
    const selected = scene.canvas.querySelector<HTMLElement>(`[data-product-frame='${identity}']`);
    if (!selected) return;
    scene.element.dataset.phase = selected.dataset.phase || frame.phase;
    scene.element.dataset.inspection = identity;
    scene.element.dataset.complete = String(frame.complete);
    scene.element.dataset.referenceFrame = identity;
    scene.element.dataset.elapsed = scene.elapsed.toFixed(3);
    scene.element.dataset.mode = still ? "static" : "live";
    if (scene.previous === identity) return;
    scene.canvas.querySelectorAll<HTMLElement>("[data-product-frame]").forEach(node => { node.hidden = node !== selected; });
    if (scene.previous !== null && scene.element.dataset.running === "true" && !reduced.matches) selected.animate([{ opacity: .72 }, { opacity: 1 }], { duration: 280, easing: "cubic-bezier(.22,1,.36,1)" });
    scene.previous = identity;
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0; last = null; running = null;
    scenes.forEach(scene => { scene.element.dataset.running = "false"; });
    gateAnimations();
  }
  function abandonLoad() {
    if (loadState === "ready" || loadState === "static") return;
    loading?.abort(); loading = null; window.clearTimeout(loadTimeout); loadTimeout = 0; loadState = "static";
    root.dataset.demoReadiness = "static";
  }
  function tick(now: number) {
    raf = 0;
    if (!canRun() || running !== current || current === null) { reconcile(); return; }
    const scene = scenes.get(current);
    if (!scene) return;
    if (last !== null) scene.elapsed = Math.min(demoDurations[scene.name], scene.elapsed + Math.min(Math.max(0, (now - last) / 1000), .1));
    last = now;
    paint(scene);
    gateAnimations();
    if (scene.elapsed < demoDurations[scene.name]) raf = requestAnimationFrame(tick);
    else stop();
  }
  function reconcile() {
    if (disposed) return;
    if (reduced.matches || mode === "flow") {
      stop(); abandonLoad();
      scenes.forEach(scene => { scene.elapsed = demoDurations[scene.name]; paint(scene, true); });
      gateAnimations();
      return;
    }
    if (held || dialogOpen || pageHidden || document.hidden) { if (loadState === "loading") abandonLoad(); }
    if (!canRun() || current === null) { stop(); return; }
    const scene = scenes.get(current);
    if (!scene || scene.elapsed >= demoDurations[scene.name]) { stop(); return; }
    if (running === current && raf) { gateAnimations(); return; }
    stop(); running = current;
    scene.element.dataset.running = "true";
    paint(scene); gateAnimations(); raf = requestAnimationFrame(tick);
  }
  function checkEntrance() {
    // 手机首屏可能已露出章节标题，但产品画面仍在屏外；以实际画面入场为界，避免提前永久禁播。
    // 任一画面触及视口后仍禁止迟到重置，保留慢载时可读终态而不闪回初态。
    if ([...scenes.values()].some(scene => scene.element.getBoundingClientRect().top <= innerHeight)) {
      entered = true;
      if (loadState !== "ready") abandonLoad();
    }
  }
  async function prepare() {
    if (loadState !== "idle" || mode !== "stage" || reduced.matches || scenes.size !== 3 || held || dialogOpen || pageHidden || document.hidden) return;
    checkEntrance();
    if (entered || loadState !== "idle") return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    loadTimeout = timeout;
    loading = controller; loadState = "loading"; root.dataset.demoReadiness = "loading";
    try {
      const elements = [...scenes.values()].map(scene => scene.element);
      const manifestPaths = new Set(elements.map(element => element.dataset.referenceManifest));
      const path = elements[0]?.dataset.referenceManifest;
      if (!path || manifestPaths.size !== 1) throw new Error("Missing product manifest");
      const base = new URL(path, location.origin);
      if (base.origin !== location.origin || base.username || base.password || base.search || base.hash || !/\/product-reference\/[a-zA-Z0-9._-]+\/manifest\.json$/.test(base.pathname)) throw new Error("Invalid product manifest URL");
      const data: unknown = JSON.parse(new TextDecoder().decode(await readAsset(base, controller.signal, 64_000)));
      if (!validManifest(data)) throw new Error("Invalid product manifest");
      const ready = await Promise.all(names.flatMap(name => (["start", "middle"] as const).map(async phase => ({ name, phase, fragment: await loadFrame(data.scenes[name].frames[phase], data.scenes[name], base, controller.signal) }))));
      checkEntrance();
      if (disposed || controller.signal.aborted || entered || held || dialogOpen || document.hidden || reduced.matches || mode !== "stage") return;
      // 全量完成前不修改 SSR DOM；同一同步步骤准备所有 incoming，避免先露终态再闪回初态。
      ready.forEach(({ name, phase, fragment }) => {
        const scene = scenes.get(name)!;
        const asset = data.scenes[name].frames[phase];
        const wrapper = document.createElement("div");
        wrapper.dataset.productFrame = asset.id;
        wrapper.dataset.referenceFrame = asset.id;
        wrapper.dataset.phase = asset.phase;
        wrapper.dataset.label = asset.label;
        wrapper.hidden = true;
        wrapper.append(fragment);
        scene.canvas.append(wrapper);
        scene.inserted.push(wrapper);
      });
      loadState = "ready"; loading = null; root.dataset.demoReadiness = "ready";
      scenes.forEach(scene => paint(scene));
      gateAnimations(); reconcile();
    } catch {
      // 网络/完整性/HTML 校验失败不是业务失败；明确留在可读终态，本次挂载不重试。
      if (!disposed) { abandonLoad(); scenes.forEach(scene => paint(scene, true)); gateAnimations(); }
    } finally {
      window.clearTimeout(timeout);
      if (loadTimeout === timeout) loadTimeout = 0;
    }
  }
  const releaseHold = observeAnimationHold(root, value => { held = value; reconcile(); });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const name = (entry.target as HTMLElement).dataset.nativeDemo;
      if (isCapabilityDemoName(name)) {
        const scene = scenes.get(name);
        if (scene) scene.visible = entry.isIntersecting && entry.intersectionRatio >= .08;
      }
    });
    checkEntrance(); reconcile();
  }, { threshold: [0, .08] });
  scenes.forEach(scene => observer.observe(scene.element));
  // CSS pending/error 的画面仍有几何与交集；完整样式 ready 才能消费执行时间，状态恢复时不重置局部时钟。
  const styles = new MutationObserver(reconcile);
  scenes.forEach(scene => styles.observe(scene.element, { attributes: true, attributeFilter: ["data-product-styles"] }));
  const syncDialog = () => { dialogOpen = !!commercialRoot.querySelector("dialog[open]"); reconcile(); };
  const dialogs = new MutationObserver(syncDialog);
  dialogs.observe(commercialRoot, { subtree: true, attributes: true, attributeFilter: ["open"] });
  commercialRoot.addEventListener("toggle", syncDialog, { ...options, capture: true });
  commercialRoot.addEventListener("close", syncDialog, { ...options, capture: true });
  document.addEventListener("visibilitychange", reconcile, options);
  reduced.addEventListener("change", reconcile, options);
  window.addEventListener("scroll", checkEntrance, { ...options, passive: true });
  window.addEventListener("pagehide", () => { pageHidden = true; abandonLoad(); stop(); }, options);
  window.addEventListener("pageshow", () => { pageHidden = false; syncDialog(); reconcile(); }, options);
  gateAnimations();
  return {
    update(next: CapabilityPlaybackUpdate) {
      if (disposed) return;
      current = next.current; mode = next.mode; settled = next.settled;
      if (mode === "stage") { checkEntrance(); void prepare(); }
      reconcile();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      loading?.abort(); loading = null; window.clearTimeout(loadTimeout); loadTimeout = 0;
      stop(); observer.disconnect(); styles.disconnect(); dialogs.disconnect(); releaseHold(); events.abort();
      scenes.forEach(scene => {
        animations(scene).forEach(animation => animation.cancel());
        paint(scene, true);
        scene.inserted.forEach(element => element.remove());
      });
      delete root.dataset.demoReadiness;
    },
  };
}
