import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { Section } from "@/components/primitives";
import { ProductDemo } from "@/components/product-demo/figure";

const content = {
  zh: {
    title: "把你的好方法，教给 AI 工作伙伴。",
    lede: "将验证过的经验培养为数字员工，协助处理职责明确的工作。你仍负责目标、判断与验收。",
    items: [
      { title: "选经验，而不是复制聊天", description: "从当前工作区有权访问的已保存经验中选择，保留来源与版本。" },
      { title: "先看方案，再确认创建", description: "核对员工职责、拟形成的 Skill 与来源。你确认后，才创建技能、角色和员工。" },
      { title: "独立身份，持续协作", description: "从 Agent Employee 管理 SkyBot 与专业员工，查看工作记录、记忆和就绪状态。" },
    ],
    link: "了解员工培养",
  },
  en: {
    title: "Teach your AI collaborator what works.",
    lede: "Develop validated experience into a digital employee for defined work. You retain the goals, judgement and final review.",
    items: [
      { title: "Select experience, not chat logs", description: "Choose authorised, saved experience in your workspace. Keep its sources and revisions." },
      { title: "Review before creation", description: "Check the responsibility, proposed Skills and sources. Skills, role and employee are created only after your confirmation." },
      { title: "A lasting collaboration", description: "Manage SkyBot and specialists in Agent Employee. Inspect work records, memory and readiness." },
    ],
    link: "Explore employee development",
  },
} as const;

export function EmployeeIntro({ locale }: { locale: Locale }) {
  const copy = content[locale];
  return (
    <Section id="digital-employees" className="home-section employee-introduction" width="wide" divided>
      <header className="home-product-heading">
        <h2 className="home-heading">{copy.title}</h2>
        <p className="home-lede">{copy.lede}</p>
      </header>
      <div className="home-employee-showcase">
        <ProductDemo locale={locale} kind="employees" />
        <div className="home-employee-copy">
          <ol className="home-employee-steps">
            {copy.items.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.description}</p></li>)}
          </ol>
          <Link href={localePath(locale, "/docs/guides/digital-employees")} className="home-text-link">{copy.link}<span aria-hidden="true"> ↗</span></Link>
        </div>
      </div>
    </Section>
  );
}
