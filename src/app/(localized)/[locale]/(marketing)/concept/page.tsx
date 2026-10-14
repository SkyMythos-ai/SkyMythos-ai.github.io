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
        }
      : {
          constraintsHeading: "Hard constraints",
          count: `${objectCount} domain objects`,
          nextHeading: "Where to go next",
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        rail={dictionary.nav.concept}
        title={dictionary.concept.title}
        lede={locale === "zh" ? "一份冻结的规格，一个隔离的沙箱，一条可追溯的交付链。" : "One frozen specification. One isolated sandbox. A traceable path to delivery."}
        meta={terms.count}
      />

      <Section divided width="wide">
        <SectionHeading title={locale === "zh" ? "从任务，看懂对象关系" : "The objects behind every task"} />
        <figure className="rounded-xl border border-rule bg-paper p-5 md:p-8">
          <figcaption className="mb-8 flex flex-wrap items-center gap-3 text-xs text-ink-3">
            <span className="rounded border border-rule px-3 py-2">Organization</span>
            <span aria-hidden="true">›</span>
            <span className="rounded border border-rule px-3 py-2">Workspace</span>
            <span aria-hidden="true">›</span>
            <span className="rounded border border-rule px-3 py-2">Project</span>
            <span>{locale === "zh" ? "治理与协作范围" : "Governance and collaboration scope"}</span>
          </figcaption>
          <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,2fr)_auto_minmax(0,1fr)]">
            <div className="rounded-lg border border-rule-strong p-5">
              <h3 className="text-lg font-semibold text-ink">Task</h3>
              <p className="mt-1 text-xs text-ink-3">{locale === "zh" ? "一次研发执行" : "One R&D execution"}</p>
              <div className="mt-5 border-t border-rule pt-4">
                <p className="text-sm font-medium text-ink">TaskSpec</p>
                <p className="mt-1 text-xs text-ink-3">{locale === "zh" ? "冻结规格 · 运行中不可变" : "Frozen spec · Immutable during execution"}</p>
              </div>
            </div>
            <span aria-hidden="true" className="justify-self-center text-2xl text-ink-4 lg:rotate-0 rotate-90">→</span>
            <div className="rounded-lg border border-signal/40 bg-signal-wash/60 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-signal">Sandbox</h3>
                <span className="text-xs text-signal">{locale === "zh" ? "每任务一个" : "One per task"}</span>
              </div>
              <p className="mt-2 text-xs text-ink-3">{locale === "zh" ? "Supervisor · 唯一调度权威" : "Supervisor · Sole scheduling authority"}</p>
              <div className="mt-5 rounded border border-rule bg-paper p-4">
                <p className="text-sm font-medium text-ink">{locale === "zh" ? "Flow 快照" : "Flow snapshot"}</p>
                <p className="mt-1 text-xs text-ink-3">{locale === "zh" ? "由 WorkNode 调用按依赖组成" : "WorkNode invocations connected by dependencies"}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-ink-2">
                  <span className="rounded border border-rule px-3 py-2">WorkNode</span>
                  <span aria-hidden="true">→</span>
                  <span className="rounded border border-rule px-3 py-2">Attempt</span>
                </div>
                <p className="mt-3 text-xs text-ink-3">{locale === "zh" ? "每次执行：独立会话 + 独立 worktree" : "Each attempt: its own session and worktree"}</p>
              </div>
            </div>
            <span aria-hidden="true" className="justify-self-center text-2xl text-ink-4 lg:rotate-0 rotate-90">→</span>
            <div className="rounded-lg border border-rule-strong p-5">
              <h3 className="text-lg font-semibold text-ink">Artifact</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-3">{locale === "zh" ? "产物 + 清单 + 结果摘要" : "Outputs + manifest + result summary"}</p>
              <p className="mt-5 border-t border-rule pt-4 text-xs leading-relaxed text-ink-3">{locale === "zh" ? "质量门禁通过后冻结，下游只读。" : "Frozen after quality gates pass. Read-only downstream."}</p>
            </div>
          </div>
          <div className="mt-7 grid gap-4 border-t border-rule pt-5 sm:grid-cols-2">
            <p className="text-xs leading-relaxed text-ink-3"><strong className="mr-2 font-medium text-ink">Knowledge</strong>{locale === "zh" ? "带来源、可审阅的正式知识" : "Sourced, reviewable formal knowledge"}</p>
            <p className="text-xs leading-relaxed text-ink-3"><strong className="mr-2 font-medium text-ink">Memory</strong>{locale === "zh" ? "独立的个人记忆权威，Agent 不直接写入" : "Separate personal-memory authority; no direct agent writes"}</p>
          </div>
        </figure>

        <div className="mt-10 grid gap-x-10 md:grid-cols-2">
          {dictionary.concept.objects.map((object) => (
            <details key={object.name} className="border-t border-rule py-1">
              <summary className="cursor-pointer py-5 text-sm font-semibold text-ink">
                <span className="fact-sm mr-3 text-ink-4">{object.rail}</span>
                {object.name}
                <span className="mt-2 block pl-7 text-xs font-normal leading-relaxed text-ink-3">{object.role}</span>
              </summary>
              <div className="pb-6 pl-7">
                <h3 className="rail-label mb-3">{terms.constraintsHeading}</h3>
                <ul className="list-disc space-y-3 pl-4 text-sm leading-relaxed text-ink-2">
                  {object.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}
                </ul>
                {object.note ? <p className="mt-4 border-l-2 border-signal/30 pl-4 text-sm leading-relaxed text-ink-3">{object.note}</p> : null}
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section rail={dictionary.concept.lifecycleRail} divided width="wide">
        <SectionHeading title={dictionary.concept.lifecycleHeading} />
        <Pipeline locale={locale} />
      </Section>

      {/* ── Onward ──────────────────────────────────────────────────────── */}
      <Section divided className="pb-24 md:pb-28">
        <h2 className="rail-label mb-6">{terms.nextHeading}</h2>
        <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-3">
          {onward.map((item) => (
            <li key={item.href}>
              <Link
                href={localePath(locale, item.href)}
                className="group block border-t border-rule pt-4 transition-colors"
              >
                <span className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
                  {item.title}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 10 10"
                    className="h-2.5 w-2.5 text-ink-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M2 5h6M5.4 2.4 8 5l-2.6 2.6" />
                  </svg>
                </span>
                <span className="mt-1.5 block text-[0.875rem] leading-[1.65] text-ink-3">
                  {item.detail}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
