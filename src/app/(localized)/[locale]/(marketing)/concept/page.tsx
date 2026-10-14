import type { Metadata } from "next";
import Link from "next/link";
import { localePath, toLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/metadata";
import { Section, SectionHeading } from "@/components/primitives";
import { PageHeader } from "@/components/page-header";
import { Pipeline } from "@/components/pipeline";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = toLocale(raw);
  const dictionary = getDictionary(locale);

  return buildMetadata({
    locale,
    title: dictionary.concept.title,
    description: dictionary.concept.description,
    path: "/concept",
    keywords:
      locale === "zh"
        ? ["领域模型", "WorkNode", "Flow", "Sandbox", "Artifact", "TaskSpec", "知识空间"]
        : [
            "domain model",
            "work node",
            "flow",
            "sandbox",
            "artefact",
            "task specification",
            "knowledge space",
          ],
  });
}

/** 对象关系先行，完整约束按需展开；生命周期复用统一流程图。 */
export default async function ConceptPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = toLocale(raw);
  const dictionary = getDictionary(locale);

  const jsonLd = breadcrumbJsonLd(locale, [
    { name: dictionary.nav.home, path: "/" },
    { name: dictionary.concept.title, path: "/concept" },
  ]);

  const objectCount = dictionary.concept.objects.length;

  const terms =
    locale === "zh"
      ? {
          constraintsHeading: "硬约束",
          count: `${objectCount} 个领域对象`,
          nextHeading: "下一步",
          objectRail: "对象关系",
          referenceRail: "领域索引",
          referenceHeading: "每个对象，都有明确的边界。",
          referenceLede: "展开一个对象，查看它的职责、状态权威与不可越过的约束。",
          lifecycleNote: "先冻结，再执行。完成之后，才进入长期知识。",
        }
      : {
          constraintsHeading: "Hard constraints",
          count: `${objectCount} domain objects`,
          nextHeading: "Where to go next",
          objectRail: "Relationships",
          referenceRail: "Domain index",
          referenceHeading: "Every object has a clear boundary.",
          referenceLede: "Open an object to explore its responsibility, state authority and hard constraints.",
          lifecycleNote: "Freeze first. Execute next. Consolidate knowledge after completion.",
        };

  const onward =
    locale === "zh"
      ? [
          {
            href: "/architecture",
            title: "架构",
            detail: "这些对象由哪些组件承载，以及为什么这样分层。",
          },
          {
            href: "/docs/concepts/preflight",
            title: "预检与冻结",
            detail: "一次任务在创建沙箱之前究竟发生了什么。",
          },
          {
            href: "/docs/reference/glossary",
            title: "领域术语表",
            detail: "全部对象、状态与边界的规范用语。",
          },
        ]
      : [
          {
            href: "/architecture",
            title: "Architecture",
            detail: "Which components carry these objects, and why they layer this way.",
          },
          {
            href: "/docs/concepts/preflight",
            title: "Preflight and freezing",
            detail: "What actually happens before a sandbox is ever created.",
          },
          {
            href: "/docs/reference/glossary",
            title: "Glossary",
            detail: "Canonical vocabulary for every object, state and boundary.",
          },
        ];

  return (
    <div className="concept-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        rail={dictionary.nav.concept}
        title={dictionary.concept.title}
        lede={locale === "zh" ? "一份冻结的规格，一个隔离的沙箱，一条可追溯的交付链。" : "One frozen specification. One isolated sandbox. A traceable path to delivery."}
        meta={terms.count}
        className="interior-opening"
      />

      <Section rail={terms.objectRail} index="01" divided width="wide" className="interior-section concept-overview">
        <div data-reveal>
          <SectionHeading title={locale === "zh" ? "从任务，看懂对象关系" : "The objects behind every task"} />
        </div>
        <div className="premium-frame concept-system" data-reveal>
          <figure className="premium-core concept-system__core">
            <figcaption className="concept-scope">
              <div className="concept-scope__path">
                <span>Organization</span><span aria-hidden="true">/</span>
                <span>Workspace</span><span aria-hidden="true">/</span>
                <span>Project</span>
              </div>
              <p>{locale === "zh" ? "治理与协作范围" : "Governance and collaboration scope"}</p>
            </figcaption>
            <div className="concept-execution">
              <div className="concept-node">
                <div className="concept-node__core">
                  <span className="concept-node__eyebrow">01 / {locale === "zh" ? "输入" : "Input"}</span>
                  <h3>Task</h3>
                  <p>{locale === "zh" ? "一次研发执行" : "One R&D execution"}</p>
                  <div className="concept-node__fact">
                    <strong>TaskSpec</strong>
                    <p>{locale === "zh" ? "冻结规格 · 运行中不可变" : "Frozen spec · Immutable during execution"}</p>
                  </div>
                </div>
              </div>
              <span aria-hidden="true" className="concept-flow-arrow">→</span>
              <div className="concept-node concept-node--sandbox">
                <div className="concept-node__core">
                  <span className="concept-node__eyebrow">02 / {locale === "zh" ? "隔离执行" : "Isolated execution"}</span>
                  <div className="concept-node__title">
                    <h3>Sandbox</h3>
                    <span>{locale === "zh" ? "每任务一个" : "One per task"}</span>
                  </div>
                  <p>{locale === "zh" ? "Supervisor · 唯一调度权威" : "Supervisor · Sole scheduling authority"}</p>
                  <div className="concept-flow-snapshot">
                    <strong>{locale === "zh" ? "Flow 快照" : "Flow snapshot"}</strong>
                    <p>{locale === "zh" ? "由 WorkNode 调用按依赖组成" : "WorkNode invocations connected by dependencies"}</p>
                    <div className="concept-flow-snapshot__chain"><span>WorkNode</span><span aria-hidden="true">→</span><span>Attempt</span></div>
                    <p>{locale === "zh" ? "每次执行：独立会话 + 独立 worktree" : "Each attempt: its own session and worktree"}</p>
                  </div>
                </div>
              </div>
              <span aria-hidden="true" className="concept-flow-arrow">→</span>
              <div className="concept-node">
                <div className="concept-node__core">
                  <span className="concept-node__eyebrow">03 / {locale === "zh" ? "交接" : "Handoff"}</span>
                  <h3>Artifact</h3>
                  <p>{locale === "zh" ? "产物 + 清单 + 结果摘要" : "Outputs + manifest + result summary"}</p>
                  <div className="concept-node__fact"><p>{locale === "zh" ? "质量门禁通过后冻结，下游只读。" : "Frozen after quality gates pass. Read-only downstream."}</p></div>
                </div>
              </div>
            </div>
            <dl className="concept-cognition">
              <div><dt>Knowledge</dt><dd>{locale === "zh" ? "带来源、可审阅的正式知识" : "Sourced, reviewable formal knowledge"}</dd></div>
              <div><dt>Memory</dt><dd>{locale === "zh" ? "独立的个人记忆权威，Agent 不直接写入" : "Separate personal-memory authority; no direct agent writes"}</dd></div>
            </dl>
          </figure>
        </div>
      </Section>

      <Section rail={terms.referenceRail} index="02" divided width="wide" className="interior-section concept-reference">
        <div className="interior-editorial-split">
          <div className="interior-section-intro" data-reveal>
            <SectionHeading title={terms.referenceHeading} lede={terms.referenceLede} />
            <p className="interior-index-note">{terms.count}</p>
          </div>
          <div className="premium-frame" data-reveal>
            <div className="premium-core interior-disclosure-board">
              {dictionary.concept.objects.map((object) => (
                <details key={object.name} className="interior-disclosure">
                  <summary>
                    <span className="interior-disclosure__index">{object.rail}</span>
                    <span className="interior-disclosure__heading"><strong>{object.name}</strong><span>{object.role}</span></span>
                    <span className="interior-disclosure__toggle" aria-hidden="true" />
                  </summary>
                  <div className="interior-disclosure__body">
                    <h3 className="rail-label">{terms.constraintsHeading}</h3>
                    <ul className="interior-constraints">
                      {object.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}
                    </ul>
                    {object.note ? <p className="interior-context-note">{object.note}</p> : null}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section rail={dictionary.concept.lifecycleRail} index="03" divided width="wide" className="interior-section concept-lifecycle">
        <div className="interior-heading-row" data-reveal>
          <SectionHeading title={dictionary.concept.lifecycleHeading} />
          <p>{terms.lifecycleNote}</p>
        </div>
        <div className="premium-frame interior-flow-frame" data-reveal>
          <div className="premium-core"><Pipeline locale={locale} /></div>
        </div>
      </Section>

      <Section divided width="wide" className="interior-section interior-onward">
        <div className="interior-onward__layout" data-reveal>
          <div><h2 className="rail-label">{terms.nextHeading}</h2><p>{locale === "zh" ? "从领域模型，走向系统实现。" : "From the domain model to the system behind it."}</p></div>
          <ul>
            {onward.map((item) => (
              <li key={item.href}>
                <Link href={localePath(locale, item.href)} className="premium-action interior-onward__link">
                  <span>{item.title}</span>
                  <span className="premium-action__icon" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25"><path d="M5 15 15 5M5 5h10v10" /></svg></span>
                </Link>
                <p>{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </div>
  );
}
