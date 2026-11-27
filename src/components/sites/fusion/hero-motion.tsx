"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Bot, Layers3, Pause, Play, Users, Wrench } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { localizeHref, type Locale } from "@/lib/i18n";
import { useSiteMotion } from "./site-motion";
import { BrandCompanion } from "./brand-companion";
import site from "./site.module.css";
import home from "./home.module.css";
import motion from "./hero-motion.module.css";

const words = [
  { zh: "完成工作", en: "deliver work.", href: "/product/skybot", Icon: Bot },
  { zh: "协同业务", en: "align teams.", href: "/solutions", Icon: Users },
  { zh: "沉淀知识", en: "keep context.", href: "/product/knowledge", Icon: BookOpen },
];

/** 词带按时间推进，工作台按滚动展开；二者不截获访客的原生滚轮。 */
export function HomeHero({ locale, children }: { locale: Locale; children: ReactNode }) {
  const { enabled, running, reducedMotion, paused, togglePaused } = useSiteMotion();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const text = (zh: string, en: string) => locale === "zh" ? zh : en;
  const selected = enabled ? active : 0;

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running || !inView || hovered || focused) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % words.length), 2800);
    return () => window.clearInterval(timer);
  }, [running, inView, hovered, focused]);

  useEffect(() => {
    const section = sectionRef.current;
    const camera = cameraRef.current;
    if (!enabled || !section || !camera) return;
    let frame = 0;
    const render = () => {
      frame = 0;
      const rect = camera.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.9 - rect.top) / (window.innerHeight * 0.6)));
      const spread = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / 600));
      camera.style.setProperty("--camera-progress", String(progress));
      section.style.setProperty("--hero-spread", String(spread));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(render); };
    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      camera.style.removeProperty("--camera-progress");
      section.style.removeProperty("--hero-spread");
    };
  }, [enabled]);

  return (
    <section className={`${home.hero} ${motion.hero}`} ref={sectionRef} aria-labelledby="home-title" data-hero-playing={running && inView}>
      <div className={motion.field} aria-hidden="true">
        <div className={`${motion.nodePosition} ${motion.tools}`}><span><Wrench />{text("工具", "Tools")}</span></div>
        <div className={`${motion.nodePosition} ${motion.knowledge}`}><span><BookOpen />{text("知识", "Knowledge")}</span></div>
        <div className={`${motion.nodePosition} ${motion.flows}`}><span><Layers3 />{text("流程", "Flows")}</span></div>
        <div className={`${motion.nodePosition} ${motion.employees}`}><span><Users />{text("数字员工", "AI employees")}</span></div>
        <svg className={motion.connections} viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
          <path d="M160 160C320 160 330 440 580 540M1280 120C1110 120 1110 450 860 540M120 390C300 390 350 520 580 540M1320 400C1130 400 1100 520 860 540" />
        </svg>
      </div>
      <div className={`${site.container} ${home.heroContent}`} ref={contentRef}>
        <h1 id="home-title" aria-label={text("让 AI 完成工作，让能力留在企业。", "Let AI do the work. Keep the capability.")}>
          <span className={home.titleLine}>
            {text("让 AI", "Let AI")}{" "}
            <span className={motion.wordReel}
              onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
              onFocusCapture={() => setFocused(true)}
              onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
              {words.map(({ zh, en, Icon }) => <span key={zh} className={`${home.taskPill} ${motion.wordSizer}`} aria-hidden="true"><Icon />{text(zh, en)}</span>)}
              {words.map(({ zh, en, href, Icon }, index) => {
                const delta = (index - selected + words.length) % words.length;
                const offset = delta === 2 ? -1 : delta;
                return <Link key={zh} href={localizeHref(href, locale)} className={`${home.taskPill} ${motion.reelWord}`}
                  data-offset={offset} aria-hidden={offset !== 0} tabIndex={offset === 0 ? 0 : -1}
                  aria-label={text(`了解${zh}`, `Explore: ${en}`)}><Icon aria-hidden="true" />{text(zh, en)}</Link>;
              })}
            </span>
          </span>
          <span className={home.titleLine}>{text("让能力留在企业。", "Keep the capability.")}</span>
        </h1>
        <p className={home.heroDescription}>{text("私有化部署的企业级数字员工与 AI 协作平台。连接内部知识与办公工具，交付有据可查的成果，沉淀组织可复用的能力。", "The self-hosted enterprise platform for AI employees and collaborative work. Connect company knowledge and tools to deliver verifiable results.")}</p>
        <div className={home.heroActions}>
          <Link href={localizeHref("/poc", locale)} className={site.primaryLink}>{text("预约演示", "Book a Demo")}<ArrowRight size={16} /></Link>
          <a href="#product-demo" className={site.secondaryLink}>{text("查看工作台演示", "Watch live workflow")}<ArrowRight size={15} /></a>
        </div>
        <BrandCompanion locale={locale} />
      </div>
      <div className={`${home.heroProduct} ${motion.cameraAnchor}`} id="product-demo" ref={cameraRef}>
        <div className={motion.controls}>
          <button type="button" onClick={togglePaused} disabled={reducedMotion} aria-pressed={paused}>
            {paused ? <Play size={13} /> : <Pause size={13} />}
            {reducedMotion ? text("已减少动态效果", "Reduced motion") : paused ? text("播放页面动效", "Play page motion") : text("暂停页面动效", "Pause page motion")}
          </button>
        </div>
        <div className={motion.cameraFrame}>{children}</div>
      </div>
    </section>
  );
}
