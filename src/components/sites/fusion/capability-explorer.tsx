"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Bot, Users } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { localizeHref, type Locale } from "@/lib/i18n";
import { CapabilityScene } from "./capability-scenes";
import { useSiteMotion } from "./site-motion";
import styles from "./capability-explorer.module.css";

type Capability = "work" | "employees" | "knowledge";

const capabilities: Capability[] = ["work", "employees", "knowledge"];
const icons = { work: Bot, employees: Users, knowledge: BookOpen };

function subscribeCompact(listener: () => void) {
  const query = window.matchMedia("(max-width: 1100px)");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

function stageOffset(stage: HTMLElement) {
  return Number.parseFloat(getComputedStyle(stage).top) || 104;
}

/** 首页能力切换：保留原有锚点入口，并由本地状态控制当前工作面。 */
export function CapabilityExplorer({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<Capability>("work");
  const [scrollLayout, setScrollLayout] = useState(false);
  const scrollLayoutRef = useRef(false);
  const repositionAfterLayout = useRef(false);
  const { enabled } = useSiteMotion();
  const compact = useSyncExternalStore(subscribeCompact, () => window.matchMedia("(max-width: 1100px)").matches, () => false);
  const activeRef = useRef<Capability>("work");
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const indicatorAnimation = useRef<Animation | null>(null);
  const programmaticScroll = useRef(false);
  const hashInitialized = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const text = (zh: string, en: string) => locale === "zh" ? zh : en;
  const content = {
    work: {
      label: text("工作交付", "Work delivery"),
      caption: text("从目标到可检查的成果", "From goal to deliverable"),
      description: text("数字员工核对反馈与产品资料，整理改进建议、来源和验收要求。你查看依据，再决定优先级。", "Turn customer feedback into recommendations with sources and acceptance criteria. Your team reviews the evidence and sets the priorities."),
      links: [
        { href: "/product/skybot", label: text("了解工作交付", "Explore work delivery") },
        { href: "/product/flows", label: text("研发任务与流程", "Tasks & Flows") },
        { href: "/product/automations", label: text("自动化", "Automations") },
      ],
    },
    employees: {
      label: text("数字员工", "AI employees"),
      caption: text("把有效方法用于下一次工作", "Reuse what works"),
      description: text("把有效的工作记录整理成数字员工的职责、知识与技能方案，保留来源，经你确认后再用于后续工作。", "Turn useful work into proposed responsibilities, knowledge and skills. Keep the source and review the proposal before using it again."),
      links: [{ href: "/product/employees", label: text("了解数字员工", "Explore AI employees") }],
    },
    knowledge: {
      label: text("企业知识", "Enterprise knowledge"),
      caption: text("让每个结论都能回到原文", "Trace conclusions to sources"),
      description: text("查看原文与上下文，将项目事实、决策与方法组织成可维护的企业知识，让团队沿着依据继续工作。", "Open the original material behind each conclusion. Keep facts, decisions and methods in maintainable knowledge your team can use."),
      links: [{ href: "/product/knowledge", label: text("了解企业知识", "Explore enterprise knowledge") }],
    },
  };
  const current = content[active];

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1280px) and (min-height: 900px)");
    const update = () => {
      const next = query.matches && enabled;
      if (next === scrollLayoutRef.current) return;
      // 先记住旧布局是否在视野中，轨道收起后仍回到当前能力。
      const bounds = sectionRef.current?.getBoundingClientRect();
      repositionAfterLayout.current = Boolean(bounds && bounds.top < window.innerHeight && bounds.bottom > 104);
      scrollLayoutRef.current = next;
      setScrollLayout(next);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [enabled]);

  function updateActive(capability: Capability) {
    if (activeRef.current !== capability) {
      activeRef.current = capability;
      setActive(capability);
    }
    if (window.location.hash !== `#${capability}`)
      window.history.replaceState(window.history.state, "", `#${capability}`);
  }

  function stopProgrammaticScroll() {
    programmaticScroll.current = false;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = null;
  }

  function scrollToCapability(capability: Capability, behavior: ScrollBehavior) {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!scrollLayout || !track || !stage) {
      sectionRef.current?.scrollIntoView({ behavior });
      return;
    }
    const distance = Math.max(0, track.offsetHeight - stage.offsetHeight);
    const top = window.scrollY + track.getBoundingClientRect().top - stageOffset(stage)
      + distance * (capabilities.indexOf(capability) / (capabilities.length - 1));
    stopProgrammaticScroll();
    programmaticScroll.current = true;
    window.scrollTo({ top, behavior });
    scrollTimer.current = setTimeout(stopProgrammaticScroll, behavior === "smooth" ? 1100 : 100);
  }

  useEffect(() => {
    // 等布局与动效偏好确定后再定位，避免深链被初始滚动进度覆盖。
    let frame = 0;
    function selectFromHash() {
      const capability = window.location.hash.slice(1);
      if (!capabilities.includes(capability as Capability)) {
        hashInitialized.current = true;
        return;
      }
      updateActive(capability as Capability);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        scrollToCapability(capability as Capability, "instant");
        hashInitialized.current = true;
      });
    }
    const bounds = sectionRef.current?.getBoundingClientRect();
    const visible = bounds && bounds.top < window.innerHeight && bounds.bottom > 104;
    if (!hashInitialized.current || repositionAfterLayout.current || (scrollLayout && visible)) {
      repositionAfterLayout.current = false;
      selectFromHash();
    }
    window.addEventListener("hashchange", selectFromHash);
    return () => {
      window.removeEventListener("hashchange", selectFromHash);
      cancelAnimationFrame(frame);
    };
    // 几何变化时需重新定位当前深链。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollLayout]);

  useEffect(() => {
    if (!scrollLayout) {
      stopProgrammaticScroll();
      return;
    }
    let frame = 0;
    const measure = () => {
      frame = 0;
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage || programmaticScroll.current) return;
      const rect = track.getBoundingClientRect();
      const distance = track.offsetHeight - stage.offsetHeight;
      const offset = stageOffset(stage);
      if (distance <= 0 || rect.top > offset || rect.bottom < stage.offsetHeight + offset) return;
      // 操作演示时保留当前 DOM 和焦点，离开面板后恢复滚动选择。
      if (stage.querySelector('[role="tabpanel"]:not([hidden])')?.contains(document.activeElement)) return;
      const progress = Math.max(0, Math.min(1, (offset - rect.top) / distance));
      updateActive(capabilities[Math.round(progress * (capabilities.length - 1))]);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const interrupt = () => { stopProgrammaticScroll(); schedule(); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchstart", interrupt, { passive: true });
    window.addEventListener("focusout", schedule);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("focusout", schedule);
      cancelAnimationFrame(frame);
      if (programmaticScroll.current) window.scrollTo({ top: window.scrollY, behavior: "instant" });
      stopProgrammaticScroll();
    };
  }, [scrollLayout]);

  useLayoutEffect(() => {
    const tabs = tabsRef.current;
    const indicator = indicatorRef.current;
    const selected = tabRefs.current[capabilities.indexOf(active)];
    if (!tabs || !indicator || !selected) return;
    const placeIndicator = (animate: boolean) => {
      const previous = indicator.getBoundingClientRect();
      const parent = tabs.getBoundingClientRect();
      const transform = `translate(${selected.offsetLeft}px, ${selected.offsetTop}px)`;
      if (!animate && indicator.style.transform === transform && indicator.style.width === `${selected.offsetWidth}px` && indicator.style.height === `${selected.offsetHeight}px`) return;
      indicatorAnimation.current?.cancel();
      indicator.style.width = `${selected.offsetWidth}px`;
      indicator.style.height = `${selected.offsetHeight}px`;
      indicator.style.transform = transform;
      if (animate && enabled && tabs.dataset.indicatorReady) {
        indicatorAnimation.current = indicator.animate(
          [{ transform: `translate(${previous.left - parent.left}px, ${previous.top - parent.top}px) scale(${previous.width / selected.offsetWidth}, ${previous.height / selected.offsetHeight})` }, { transform }],
          { duration: 450, easing: "cubic-bezier(.16, 1, .3, 1)" },
        );
      }
      tabs.dataset.indicatorReady = "true";
    };
    placeIndicator(true);
    const observer = new ResizeObserver(() => placeIndicator(false));
    observer.observe(tabs);
    tabRefs.current.forEach((tab) => { if (tab) observer.observe(tab); });
    return () => observer.disconnect();
  }, [active, locale, enabled]);

  useEffect(() => () => indicatorAnimation.current?.cancel(), []);

  function selectCapability(capability: Capability) {
    updateActive(capability);
    if (scrollLayout) scrollToCapability(capability, enabled ? "smooth" : "instant");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % capabilities.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + capabilities.length) % capabilities.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = capabilities.length - 1;
    else return;
    event.preventDefault();
    selectCapability(capabilities[next]);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className={styles.section} id="work" ref={sectionRef} aria-labelledby={`${id}-heading`} data-scroll-layout={scrollLayout}>
      <div className={styles.container}>
        <div className={`${styles.stageTrack} ${scrollLayout ? styles.scrollTrack : ""}`} ref={trackRef} data-capability-track>
          <div className={styles.stage} ref={stageRef} data-capability-stage>
            <header className={styles.headingRow}>
              <h2 id={`${id}-heading`}>
                {text("从交付成果，", "Deliver the work.")}<br />
                {text("到复用经验。", "Build on what works.")}
              </h2>
              <p>{text("以客户反馈改进为例，看看工作如何交付、方法如何复用，每个结论又如何找到依据。", "Follow a customer feedback example: review the deliverable, reuse the method and trace each conclusion to its source.")}</p>
            </header>
            <div className={styles.sceneLayout}>
              <div className={styles.sidebar}>
                <div className={styles.tabsScroller}>
                  <div className={styles.tabs} ref={tabsRef} role="tablist" aria-orientation={compact ? "horizontal" : "vertical"} aria-label={text("探索平台能力", "Explore platform capabilities")}>
                    <span className={styles.indicator} ref={indicatorRef} aria-hidden="true" />
                    {capabilities.map((capability, index) => {
                      const Icon = icons[capability];
                      return (
                        <button key={capability} ref={element => { tabRefs.current[index] = element; }} type="button" role="tab"
                          id={`${id}-tab-${capability}`} aria-controls={`${id}-panel-${capability}`} aria-selected={active === capability}
                          aria-labelledby={`${id}-label-${capability}`} aria-describedby={`${id}-caption-${capability}`}
                          tabIndex={active === capability ? 0 : -1} onClick={() => selectCapability(capability)} onKeyDown={event => handleKeyDown(event, index)}>
                          <Icon size={20} aria-hidden="true" />
                          <span><strong id={`${id}-label-${capability}`}>{content[capability].label}</strong><small id={`${id}-caption-${capability}`}>{content[capability].caption}</small></span>
                          <ArrowRight className={styles.tabArrow} size={16} aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.summary} id={`${id}-summary-${active}`} key={active}>
                  <p>{current.description}</p>
                  <div className={styles.links}>
                    {current.links.map((link, index) => <Link key={link.href} href={localizeHref(link.href, locale)} className={index === 0 ? styles.mainLink : ""}>{link.label}<ArrowRight size={15} aria-hidden="true" /></Link>)}
                  </div>
                </div>
              </div>
              <div className={styles.sceneViewport}>
                {capabilities.map(capability => (
                  <div key={capability} id={`${id}-panel-${capability}`} role="tabpanel" aria-labelledby={`${id}-tab-${capability}`}
                    aria-describedby={active === capability ? `${id}-summary-${capability}` : undefined} tabIndex={0} hidden={active !== capability}
                    className={`${styles.panel} ${enabled ? styles.animatedPanel : ""}`}>
                    {active === capability && <CapabilityScene scene={capability} locale={locale} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
