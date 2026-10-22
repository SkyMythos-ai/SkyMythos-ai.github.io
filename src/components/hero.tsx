import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { HeroLifecycle } from "@/components/hero-lifecycle/figure";

export function Hero({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <header className="product-hero product-width">
    <div className="product-hero-copy">
      <p className="hero-category">{zh ? "企业 AI 工作体系" : "Your company’s AI work system"}</p>
      <h1>{zh ? <>让 AI 完成工作，<br/>让能力留在企业。</> : <>Put AI to work.<br/>Keep the capability.</>}</h1>
      <p className="story-lede">{zh ? "把模型、Agent、知识与工具组织起来，让工作有成果、方法可复用、使用与投入有据可管。" : "Bring models, agents, knowledge and tools together. Deliver work, reuse proven methods, and keep usage and costs accountable."}</p>
      <div className="employee-actions">
        <Link href="#workflow" className="employee-primary">{zh ? "看工作案例" : "See it at work"}<span aria-hidden="true">↗</span></Link>
        <Link href={localePath(locale, "/architecture")} className="employee-secondary">{zh ? "了解企业架构" : "Explore architecture"}<span aria-hidden="true">↗</span></Link>
      </div>
    </div>
    <div className="hero-product-media">
      <HeroLifecycle locale={locale}/>
    </div>
  </header>;
}
