import type { Metadata } from "next";
import Link from "next/link";
import { localePath, toLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/metadata";
import { Section, SectionHeading } from "@/components/primitives";
import { PageHeader } from "@/components/page-header";

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

/**
 * Concepts page.
 *
 * Organised as a numbered field guide to the domain objects, because that is
 * genuinely what the content is: seven objects, each with a responsibility and a
 * set of hard constraints. The numbering is a reference index — it is how the
 * other pages and the documentation cross-reference these sections — not a
 * decorative sequence marker.
 *
 * Each object renders as a three-column row on wide viewports: index, name, and
 * the constraint list. The constraints are the substance. A reader who
 * understands only what a work node *is*, without knowing that a published
 * release is immutable and that `latest` is a movable alias, will make wrong
 * decisions in the product.
 */
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
        lede={dictionary.concept.lede}
        meta={terms.count}
      />

      {/* ── Domain objects ──────────────────────────────────────────────── */}
      <Section divided width="wide">
        <ol>
          {dictionary.concept.objects.map((object) => (
            <li
              key={object.name}
              className="grid gap-x-8 gap-y-4 border-b border-rule py-9 lg:grid-cols-[3rem_minmax(0,15rem)_minmax(0,1fr)]"
            >
              <span className="fact-sm text-ink-4 lg:pt-1">{object.rail}</span>

              <div>
                <h2 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.012em] text-ink">
                  {object.name}
                </h2>
                <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-4">
                  {object.role}
                </p>
              </div>

              <div className="min-w-0">
                <h3 className="rail-label mb-3">{terms.constraintsHeading}</h3>
                <ul className="space-y-2.5">
                  {object.constraints.map((constraint) => (
                    <li key={constraint} className="flex gap-3">
                      {/*
                        A hairline dash, not a bullet character: it matches the
                        rule weight used everywhere else and does not introduce a
                        second glyph style into the page.
                      */}
                      <span
                        aria-hidden="true"
                        className="mt-[0.72em] h-px w-3.5 shrink-0 bg-rule-strong"
                      />
                      <span className="measure text-[0.9375rem] leading-[1.7] text-ink-2">
                        {constraint}
                      </span>
                    </li>
                  ))}
                </ul>

                {object.note ? (
                  <p className="measure mt-4 border-l-2 border-signal/30 pl-4 text-[0.875rem] leading-[1.7] text-ink-3">
                    {object.note}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Lifecycle ───────────────────────────────────────────────────── */}
      <Section rail={dictionary.concept.lifecycleRail} divided width="wide">
        <SectionHeading
          title={dictionary.concept.lifecycleHeading}
          lede={dictionary.concept.lifecycleLede}
        />

        <ol className="grid gap-x-10 lg:grid-cols-2">
          {dictionary.concept.lifecycle.map((step, index) => (
            <li
              key={step.step}
              className="border-t border-rule py-5 lg:[&:nth-last-child(-n+2)]:border-b lg:[&:nth-child(odd)]:pr-2"
            >
              <div className="flex items-baseline gap-3">
                <span className="fact-sm text-ink-4">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[0.9375rem] font-semibold text-ink">
                  {step.step}
                </h3>
              </div>
              <p className="measure mt-2 pl-[2.1rem] text-[0.875rem] leading-[1.7] text-ink-3">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
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
