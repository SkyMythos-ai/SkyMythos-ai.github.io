import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { Section } from "@/components/primitives";
import { HomeWorkflowFigure } from "@/components/home-workflow-figure";

export function HomePerspectives({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <Section id="people-and-teams" className="home-section home-perspectives" width="wide" divided>
      <header className="home-product-heading"><h2 className="home-heading">{zh ? "从工作记录与经验，沉淀出数字员工。" : "Digital employees start with work records and experience."}</h2></header>
      <HomeWorkflowFigure locale={locale} />
      <div className="home-evidence-note">
        <p>{zh ? "先整理真实经验，再由人确认培养。" : "Curate real experience. People confirm the employee plan."}</p>
        <Link className="home-text-link" href={localePath(locale, "/docs/guides/digital-employees")}>{zh ? "了解员工培养" : "Explore employee development"}<span aria-hidden="true">↗</span></Link>
      </div>
    </Section>
  );
}
