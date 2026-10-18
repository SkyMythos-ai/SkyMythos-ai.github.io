import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { WorkOverview } from "@/components/work-overview";

export function Hero({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <header className="product-hero product-width">
    <div className="product-hero-copy">
      <p className="story-eyebrow">SkyMythos · {zh ? "企业 AI Native" : "Enterprise AI Native"}</p>
      <h1>{zh ? <>企业自己的<br /><span>AI 工作体系。</span></> : <>Your own<br /><span>AI work system.</span></>}</h1>
      <p className="story-lede">{zh ? "接入已有模型与 Agent，组织协作、核对交付，让经过验证的经验成为下一次工作的能力。" : "Bring your models and Agents together. Coordinate work, verify results and carry proven experience into the next job."}</p>
      <div className="employee-actions">
        <Link href={localePath(locale, "/concept#delivery")} className="employee-primary">{zh ? "看一次工作如何完成" : "See work in action"}<span aria-hidden="true">↗</span></Link>
        <Link href={localePath(locale, "/architecture")} className="employee-secondary">{zh ? "了解企业架构" : "Explore the architecture"}<span aria-hidden="true">↗</span></Link>
      </div>
      <p className="hero-positioning">{zh ? "不再造一个 Coding Agent，组织已有的执行能力。" : "Not another coding Agent. A way to organise the ones you use."}</p>
    </div>
    <WorkOverview locale={locale} />
  </header>;
}
