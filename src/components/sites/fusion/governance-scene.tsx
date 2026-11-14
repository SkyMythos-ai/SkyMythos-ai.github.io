"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useSiteMotion } from "./site-motion";
import styles from "./home.module.css";

/** 治理章节随滚动展开边界，进入后的确认节点保持可读，不自动推进验收状态。 */
export function GovernanceScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { enabled, running } = useSiteMotion();

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;
    let frame = 0;
    let visible = false;
    const render = () => {
      frame = 0;
      const top = element.getBoundingClientRect().top;
      const progress = Math.max(0, Math.min(1, (window.innerHeight * .85 - top) / (window.innerHeight * .65)));
      element.style.setProperty("--governance-progress", String(progress));
    };
    const schedule = () => { if (visible && !frame) frame = window.requestAnimationFrame(render); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    }, { rootMargin: "120px" });
    observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      element.style.removeProperty("--governance-progress");
    };
  }, [enabled]);

  return <section ref={ref} className={styles.governanceBand} id="governance" data-governance-running={running}>{children}</section>;
}
