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
    title: dictionary.architecture.title,
    description: dictionary.architecture.description,
    path: "/architecture",
    keywords:
      locale === "zh"
        ? ["系统架构", "控制面", "Agent Runner", "Sandbox Provider", "状态权威", "私有化部署"]
        : [
            "system architecture",
            "control plane",
            "agent runner",
            "sandbox provider",
            "state authority",
            "private deployment",
          ],
  });
}

/**
 * Architecture page.
 *
 * Three bands, in an order chosen for how engineers actually evaluate a platform.
 * First the components and — more usefully — what each one is *authoritative*
 * for, because the boundary of authority is what breaks first in a system like
 * this. Then the decisions, each stated as decision plus consequence, since a
 * trade-off without its cost is a claim rather than a design. Finally a single
 * dense paragraph on persistence, because "where does this fact live" is the
 * question that determines whether a deployment can be operated.
 *
 * The decisions are written as rejected alternatives, not benefits. A reader who
 * disagrees with the trade can tell immediately whether this platform fits.
 */
export default async function ArchitecturePage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = toLocale(raw);
  const dictionary = getDictionary(locale);

  const jsonLd = breadcrumbJsonLd(locale, [
    { name: dictionary.nav.home, path: "/" },
    { name: dictionary.architecture.title, path: "/architecture" },
  ]);

  const terms =
    locale === "zh"
      ? {
          authorityHeading: "状态权威",
          consequenceHeading: "后果",
          decisionHeading: "决策",
        }
      : {
          authorityHeading: "State authority",
          consequenceHeading: "Consequence",
          decisionHeading: "Decision",
        };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        rail={dictionary.nav.architecture}
        title={dictionary.architecture.title}
        lede={dictionary.architecture.lede}
      />

      {/* ── Components ─────────────────────────────────────────────────── */}
      <Section rail={dictionary.architecture.layersRail} divided width="wide">
        <SectionHeading title={dictionary.architecture.layersHeading} />

        <ul>
          {dictionary.architecture.layers.map((layer, index) => (
            <li
              key={layer.name}
              className="grid gap-x-8 gap-y-4 border-t border-rule py-7 lg:grid-cols-[3rem_minmax(0,14rem)_minmax(0,1fr)]"
            >
              <span className="fact-sm text-ink-4 lg:pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="text-[0.9375rem] font-semibold leading-snug text-ink">
                {layer.name}
              </h3>

              <div className="min-w-0">
                <p className="measure text-[0.9375rem] leading-[1.7] text-ink-2">
                  {layer.responsibility}
                </p>
                {/*
                  Authority is the load-bearing part of each row, so it gets its
                  own labelled slot in mono rather than being folded into the
                  prose where it would read as an aside.
                */}
                <p className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="rail-label">{terms.authorityHeading}</span>
                  <span className="fact-sm text-ink-3">{layer.authority}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Decisions ──────────────────────────────────────────────────── */}
      <Section rail={dictionary.architecture.decisionsRail} divided width="wide">
        <SectionHeading
          title={dictionary.architecture.decisionsHeading}
          lede={dictionary.architecture.decisionsLede}
        />

        <ul>
          {dictionary.architecture.decisions.map((decision, index) => (
            <li
              key={decision.title}
              className="border-t border-rule py-8 lg:grid lg:grid-cols-[3rem_minmax(0,1fr)] lg:gap-x-8"
            >
              <span className="fact-sm hidden text-ink-4 lg:block lg:pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0">
                <h3 className="text-[1.0625rem] font-semibold tracking-[-0.012em] text-ink">
                  {decision.title}
                </h3>

                <p className="measure mt-3 text-[0.9375rem] leading-[1.72] text-ink-2">
                  {decision.decision}
                </p>

                {/*
                  The consequence sits in a bordered inset, visually separated
                  from the decision. This is deliberate: it makes the cost of
                  each choice impossible to skim past, which is the honest way to
                  present an architectural trade-off.
                */}
                <div className="mt-4 border-l-2 border-caution/35 bg-caution-wash/50 py-2.5 pl-4 pr-3">
                  <span className="rail-label block text-caution">
                    {terms.consequenceHeading}
                  </span>
                  <p className="measure mt-1.5 text-[0.875rem] leading-[1.7] text-ink-3">
                    {decision.consequence}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Persistence ────────────────────────────────────────────────── */}
      <Section rail={dictionary.architecture.persistenceRail} divided>
        <SectionHeading title={dictionary.architecture.persistenceHeading} />
        <p className="measure text-[0.9375rem] leading-[1.8] text-ink-2">
          {dictionary.architecture.persistenceBody}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href={localePath(locale, "/docs/operations/roles")}
            className="inline-flex items-center rounded-sm border border-rule-strong px-4 py-2.5 text-[0.875rem] font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
          >
            {locale === "zh" ? "平台运维与角色" : "Platform operations and roles"}
          </Link>
          <Link
            href={localePath(locale, "/docs/concepts/sandbox")}
            className="inline-flex items-center rounded-sm border border-rule-strong px-4 py-2.5 text-[0.875rem] font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
          >
            {locale === "zh" ? "沙箱与执行模型" : "Sandbox and execution model"}
          </Link>
        </div>
      </Section>

      <div className="pb-24 md:pb-28" />
    </>
  );
}
