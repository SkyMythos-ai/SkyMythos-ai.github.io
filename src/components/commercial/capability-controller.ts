import { mountCapabilityDemos, type CapabilityPlaybackUpdate } from "./demo-controller";
import type { CommercialSiteController } from "./site-controller";
import { isCapabilityDemoName, type CapabilityDemoName } from "@/lib/capability-demo-model";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
type Geometry = { mode: "stage"; start: number; step: number; height: number; mediaHeight: number } | { mode: "flow"; offset: number };

/** 固定舞台采用滚动驱动的双向上推覆盖，不截获 wheel，也不把它改为 carousel。 */
export function mountCapabilities(root: HTMLElement, site: CommercialSiteController) {
  const capability = root.querySelector<HTMLElement>("#product");
  const track = capability?.querySelector<HTMLElement>(".capability-track");
  const stage = capability?.querySelector<HTMLElement>(".capability-browser");
  const navigation = capability?.querySelector<HTMLElement>(".product-tabs");
  const area = capability?.querySelector<HTMLElement>(".capability-panels");
  const masthead = root.querySelector<HTMLElement>(".masthead");
  if (!capability || !track || !stage || !navigation || !area || !masthead) return () => {};
  const links = [...navigation.querySelectorAll<HTMLAnchorElement>("[data-tab]")];
  const panels = [...capability.querySelectorAll<HTMLElement>("[data-panel]")];
  if (panels.length !== 3 || links.length !== 3) return () => {};
  const items = panels.flatMap(panel => {
    const viewport = panel.querySelector<HTMLElement>("[data-native-demo]");
    const original = panel.querySelector<HTMLAnchorElement>("[data-zoom]");
    const name = panel.dataset.panel;
    if (!viewport || !original || !isCapabilityDemoName(name)) return [];
    return [{ panel, viewport, original, name, id: panel.id, parent: panel.parentNode, next: panel.nextSibling,
      description: panel.querySelector(".panel-copy p")?.textContent || "",
      caption: panel.querySelector("figcaption")?.textContent || "", alt: original.dataset.zoomAlt || "产品原图",
      marker: document.createElement("span") }];
  });
  if (items.length !== 3) return () => {};
  const panelLayout = matchMedia("(min-width: 901px)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const events = new AbortController();
  const options = { signal: events.signal };
  const media = document.createElement("div");
  media.className = "capability-window";
  area.prepend(media);
  items.forEach((item, index) => {
    item.marker.className = "capability-marker";
    item.marker.setAttribute("aria-hidden", "true");
    track.append(item.marker);
    media.append(item.panel);
    links[index].style.order = String(index * 2);
    links[index].style.setProperty("--capability-index", String(index + 1));
  });
  const detail = document.createElement("p");
  detail.id = "capability-detail";
  detail.className = "capability-detail";
  detail.hidden = true;
  navigation.append(detail);
  const zoom = document.createElement("a");
  zoom.className = "capability-zoom";
  zoom.dataset.zoom = "";
  zoom.hidden = true;
  zoom.textContent = "查看原图 ↗";
  const meta = document.createElement("div");
  meta.className = "capability-meta";
  const caption = document.createElement("p");
  caption.className = "capability-caption";
  caption.id = "capability-caption";
  caption.hidden = true;
  meta.append(caption, zoom);
  area.append(meta);
  zoom.setAttribute("aria-describedby", caption.id);
  let raf = 0;
  let geometry: Geometry | undefined;
  let dirty = true;
  let progress: number | undefined;
  let navigationCache: { key: string; height: number } | undefined;
  let current = -1;
  let pageHidden = false;
  const demoPlayer = mountCapabilityDemos(capability, root);

  function render(index: number, force = false) {
    if (current === index && !force) return;
    const soften = current >= 0 && current !== index && geometry?.mode === "stage" && !reduced.matches && !capability!.querySelector(":focus-visible");
    const previousTops = soften ? links.map(link => link.getBoundingClientRect().top) : [];
    links.forEach(link => link.getAnimations().forEach(animation => animation.cancel()));
    detail.getAnimations().forEach(animation => animation.cancel());
    current = index;
    const item = items[index];
    links.forEach((link, position) => {
      if (position === index) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
      if (position === index && geometry?.mode === "stage") link.setAttribute("aria-describedby", detail.id);
      else link.removeAttribute("aria-describedby");
    });
    detail.textContent = item.description;
    detail.style.order = String(index * 2 + 1);
    caption.textContent = item.caption;
    zoom.href = item.original.href;
    zoom.dataset.zoomAlt = item.alt;
    zoom.setAttribute("aria-label", `查看原图，${links[index].querySelector("strong")?.textContent || ""}：${item.alt}`);
    capability!.dataset.capabilityCurrent = item.name;
    if (soften) {
      const timing = { duration: 260, easing: "cubic-bezier(.22,1,.36,1)" };
      links.forEach((link, position) => {
        const offset = previousTops[position] - link.getBoundingClientRect().top;
        if (Math.abs(offset) > 1) link.animate([{ transform: `translateY(${offset}px)` }, { transform: "translateY(0)" }], timing);
      });
      detail.animate([{ opacity: 0, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }], timing);
    }
  }
  function measure() {
    dirty = false;
    progress = undefined;
    const headerHeight = masthead!.getBoundingClientRect().height;
    const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const horizontal = !panelLayout.matches;
    const pinTop = headerHeight + (horizontal ? 16 : 24);
    const available = innerHeight - pinTop - 24;
    const focused = document.activeElement;
    let mode: "stage" | "flow" = "flow";
    capability!.classList.toggle("capability-stage", !reduced.matches && available >= 300);
    if (capability!.classList.contains("capability-stage")) {
      detail.hidden = false;
      const key = `${horizontal}/${navigation!.getBoundingClientRect().width}/${document.fonts.status}`;
      let navigationHeight = navigationCache?.key === key ? navigationCache.height : 0;
      if (!navigationHeight) {
        navigation!.style.removeProperty("height");
        for (const item of items) {
          detail.textContent = item.description;
          navigationHeight = Math.max(navigationHeight, navigation!.getBoundingClientRect().height);
        }
        navigationCache = { key, height: navigationHeight };
      }
      const width = area!.getBoundingClientRect().width;
      const captionHeight = horizontal ? 96 : 64;
      const preceding = horizontal ? navigationHeight + 24 : 0;
      const desired = horizontal ? clamp(width * .95, 220, 380) : clamp(width / 1.6, 320, 640);
      const height = Math.min(available, Math.max(horizontal ? 0 : navigationHeight, preceding + desired + captionHeight));
      const mediaHeight = height - preceding - captionHeight;
      if (mediaHeight >= 160 && (horizontal || navigationHeight <= height)) {
        mode = "stage";
        const step = clamp(height * .85, 240, 800);
        track!.style.height = `${height + step * 3}px`;
        stage!.style.height = `${height}px`;
        stage!.style.top = `${pinTop}px`;
        navigation!.style.height = `${navigationHeight}px`;
        capability!.style.setProperty("--capability-media-height", `${mediaHeight}px`);
        capability!.style.setProperty("--capability-caption-height", `${captionHeight}px`);
        items.forEach((item, index) => {
          item.panel.id = `capability-layer-${item.name}`;
          item.marker.id = item.id;
          item.marker.style.top = `${index * step + step * .15}px`;
          item.marker.style.scrollMarginTop = `${pinTop - scrollPadding}px`;
          item.panel.inert = true;
          item.panel.setAttribute("aria-hidden", "true");
          item.viewport.dataset.presentation = "stage";
          item.viewport.dataset.compact = String(mediaHeight < 270);
        });
        geometry = { mode, start: track!.getBoundingClientRect().top + scrollY - pinTop, step, height, mediaHeight };
      }
    }
    if (mode === "flow") {
      capability!.classList.remove("capability-stage");
      track!.style.removeProperty("height");
      stage!.style.removeProperty("height");
      stage!.style.removeProperty("top");
      navigation!.style.removeProperty("height");
      navigation!.style.top = `${horizontal ? headerHeight : 112}px`;
      detail.hidden = true;
      items.forEach(item => {
        item.marker.removeAttribute("id");
        item.panel.id = item.id;
        item.panel.inert = false;
        item.panel.removeAttribute("aria-hidden");
        item.panel.style.removeProperty("transform");
        item.viewport.dataset.presentation = "flow";
        delete item.viewport.dataset.compact;
      });
      const offset = headerHeight + (horizontal ? navigation!.getBoundingClientRect().height : 0) + 24;
      capability!.style.setProperty("--capability-scroll-margin", `${Math.max(0, offset - scrollPadding)}px`);
      geometry = { mode, offset };
    }
    capability!.dataset.capabilityMode = mode;
    detail.hidden = caption.hidden = meta.hidden = zoom.hidden = mode !== "stage";
    render(Math.max(0, current), true);
    if (mode === "stage" && panels.some(panel => focused && panel.contains(focused))) zoom.focus({ preventScroll: true });
    if (mode === "flow" && focused === zoom) items[Math.max(0, current)].original.focus({ preventScroll: true });
  }
  function sync() {
    cancelAnimationFrame(raf);
    raf = 0;
    if (events.signal.aborted || pageHidden || document.hidden || root.querySelector("dialog[open]")) return;
    if (dirty) measure();
    if (!geometry) return;
    let update: CapabilityPlaybackUpdate;
    if (geometry.mode === "stage") {
      const value = clamp((scrollY - geometry.start) / geometry.step, 0, 3);
      progress = value;
      // 同一窗口内零速度端点的 smoothstep；向上滚动逐像素还原，最后一项自然释放。
      const revealAt = (start: number) => { const t = clamp((value - start) / .6, 0, 1); return t * t * (3 - 2 * t); };
      const reveal = [1, revealAt(.4), revealAt(1.4)];
      items.forEach((item, index) => { item.panel.style.transform = `translateY(${(1 - reveal[index]) * 100}%)`; });
      render(reveal[2] >= .5 ? 2 : reveal[1] >= .5 ? 1 : 0);
      update = { current: items[current].name, mode: "stage", settled: !reveal.some(value => value > 0 && value < 1) };
    } else {
      let index = 0;
      const offset = geometry.offset;
      panels.forEach((panel, position) => { if (panel.getBoundingClientRect().top <= offset + 2) index = position; });
      render(index);
      update = { current: items[index].name, mode: "flow", settled: true };
    }
    demoPlayer.update(update);
  }
  function schedule() {
    if (!dirty && geometry?.mode === "stage" && clamp((scrollY - geometry.start) / geometry.step, 0, 3) === progress) return;
    if (!raf && !events.signal.aborted && !pageHidden && !document.hidden) raf = requestAnimationFrame(sync);
  }
  function invalidate() { dirty = true; schedule(); }
  function pause() { cancelAnimationFrame(raf); raf = 0; }
  function navigate(name: CapabilityDemoName | string | undefined, focus = false, behavior?: ScrollBehavior) {
    const index = items.findIndex(item => item.name === name);
    if (index === -1) return;
    site.setNavigation(false);
    dirty = true;
    sync();
    const motion = behavior || (reduced.matches ? "instant" : "smooth");
    if (geometry?.mode === "stage") scrollTo({ top: geometry.start + geometry.step * (index + .15), behavior: motion });
    else items[index].panel.scrollIntoView({ block: "start", behavior: motion });
    if (focus) links[index].focus({ preventScroll: true });
    schedule();
  }
  links.forEach((link, index) => {
    link.addEventListener("click", event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      navigate(link.dataset.tab);
    }, options);
    link.addEventListener("keydown", event => {
      let next: number | undefined;
      if (event.key === (panelLayout.matches ? "ArrowDown" : "ArrowRight")) next = (index + 1) % links.length;
      if (event.key === (panelLayout.matches ? "ArrowUp" : "ArrowLeft")) next = (index + links.length - 1) % links.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = links.length - 1;
      if (next !== undefined) { event.preventDefault(); navigate(links[next].dataset.tab, true); }
    }, options);
  });
  window.addEventListener("scroll", schedule, { ...options, passive: true });
  window.addEventListener("resize", invalidate, options);
  window.addEventListener("pageshow", () => { pageHidden = false; invalidate(); }, options);
  window.addEventListener("pagehide", () => { pageHidden = true; pause(); }, options);
  panelLayout.addEventListener("change", invalidate, options);
  reduced.addEventListener("change", invalidate, options);
  window.addEventListener("hashchange", () => navigate(location.hash.replace("#panel-", ""), false, "instant"), options);
  document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); else invalidate(); }, options);
  root.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("close", invalidate, options));
  const observer = new ResizeObserver(invalidate);
  observer.observe(capability);
  observer.observe(masthead);
  void document.fonts.ready.then(() => { if (!events.signal.aborted) invalidate(); });
  sync();
  if (location.hash.startsWith("#panel-")) navigate(location.hash.slice(7), false, "instant");

  return () => {
    pause();
    events.abort();
    observer.disconnect();
    demoPlayer.dispose();
    links.forEach(link => {
      link.getAnimations().forEach(animation => animation.cancel());
      link.removeAttribute("aria-current"); link.removeAttribute("aria-describedby");
      link.style.removeProperty("order"); link.style.removeProperty("--capability-index");
    });
    detail.getAnimations().forEach(animation => animation.cancel());
    // React 仍拥有作者节点；清理时恢复原父级/顺序，避免换页时留下移动后的孤儿节点。
    [...items].reverse().forEach(item => {
      if (item.parent) item.parent.insertBefore(item.panel, item.next?.parentNode === item.parent ? item.next : null);
      item.panel.id = item.id; item.panel.inert = false;
      item.panel.removeAttribute("aria-hidden"); item.panel.style.removeProperty("transform");
      item.viewport.dataset.presentation = "flow"; delete item.viewport.dataset.compact;
      item.marker.remove();
    });
    media.remove(); detail.remove(); meta.remove();
    capability.classList.remove("capability-stage");
    delete capability.dataset.capabilityMode; delete capability.dataset.capabilityCurrent;
    ["--capability-media-height", "--capability-caption-height", "--capability-scroll-margin"].forEach(key => capability.style.removeProperty(key));
    track.style.removeProperty("height"); stage.style.removeProperty("height"); stage.style.removeProperty("top");
    navigation.style.removeProperty("height"); navigation.style.removeProperty("top");
  };
}
