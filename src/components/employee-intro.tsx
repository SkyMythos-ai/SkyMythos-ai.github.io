import type { Locale } from "@/lib/i18n";
import { Section } from "@/components/primitives";

const content = {
  zh: {
    rail: "数字员工",
    title: "一起工作，也一起积累。",
    lede: "有持续身份、有专业分工，也有属于自己的工作经验。",
    items: [
      {
        title: "持续身份",
        description: "每位数字员工都有独立身份。任务结束后，身份与经验继续保留。",
      },
      {
        title: "专业角色",
        description: "按角色雇用数字员工，在授权范围内工作。升级角色时，保留已有经验。",
      },
      {
        title: "经验积累",
        description: "从真实工作中提炼经验，保留来源。你可以查看、纠正，也可以排除不适用的经验。",
      },
    ],
    note: "新提炼的经验需经后续实际应用验证，访问遵循所属工作区与项目的权限。",
  },
  en: {
    rail: "Digital employees",
    title: "Work together. Build experience.",
    lede: "A lasting identity, a defined role, and experience carried into the next task.",
    items: [
      {
        title: "Lasting identity",
        description: "Each digital employee has a distinct identity. That identity and its experience remain after a task ends.",
      },
      {
        title: "Defined roles",
        description: "Hire by role and work within granted access. Role upgrades preserve existing experience.",
      },
      {
        title: "Grounded experience",
        description: "Experience is drawn from real work, with its sources retained. Review, correct, or exclude what no longer applies.",
      },
    ],
    note: "Newly distilled experience needs validation through later use. Access follows workspace and project permissions.",
  },
} satisfies Record<Locale, {
  rail: string;
  title: string;
  lede: string;
  items: { title: string; description: string }[];
  note: string;
}>;

export function EmployeeIntro({ locale }: { locale: Locale }) {
  const copy = content[locale];

  return (
    <Section id="digital-employees" className="home-section employee-introduction" width="wide">
      <div className="employee-intro-layout">
        <div className="employee-intro-heading">
          <p className="home-eyebrow">{copy.rail}</p>
          <h2 className="home-heading">{copy.title}</h2>
          <p className="home-lede">{copy.lede}</p>
          <p className="employee-intro-note">{copy.note}</p>
        </div>
        <ol className="employee-intro-list">
        {copy.items.map((item, index) => (
          <li key={item.title} className="premium-frame" data-featured={index === 0}>
            <div className="employee-intro-card premium-core">
            <span aria-hidden="true" className="employee-intro-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div><h3>{item.title}</h3><p>{item.description}</p></div>
            </div>
          </li>
        ))}
        </ol>
      </div>
    </Section>
  );
}
