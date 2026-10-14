import type { Metadata } from "next";
import Link from "next/link";
import { localePath, toLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/metadata";
import { Section, SectionHeading } from "@/components/primitives";
import { PageHeader } from "@/components/page-header";
import { ArchitectureMap } from "@/components/architecture-map";
import { LayerStack } from "@/components/layer-stack";

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
        lede={locale === "zh" ? "控制面管理任务，沙箱承载执行。每一层都有清晰的职责。" : "The control plane governs tasks. Sandboxes host execution. Every layer has a clear responsibility."}
      />

      {/* ── Components ─────────────────────────────────────────────────── */}
      <Section rail={dictionary.architecture.layersRail} divided width="wide" className="architecture-components">
        <SectionHeading title={dictionary.architecture.layersHeading} />

        <ArchitectureMap locale={locale} />
        <details className="interior-disclosure mt-12 border-t border-rule py-5">
          <summary className="cursor-pointer text-sm text-ink-2">{locale === "zh" ? "查看组件职责与状态权威" : "Component responsibilities and state authority"}</summary>
          <LayerStack layers={dictionary.architecture.layers} authorityLabel={terms.authorityHeading} />
        </details>
      </Section>

      {/* ── Decisions ──────────────────────────────────────────────────── */}
      <Section rail={dictionary.architecture.decisionsRail} divided width="wide">
        <SectionHeading
          title={dictionary.architecture.decisionsHeading}
          lede={dictionary.architecture.decisionsLede}
        />

        <div>
          {dictionary.architecture.decisions.map((decision) => (
            <details key={decision.title} className="interior-disclosure border-t border-rule py-5">
              <summary className="cursor-pointer text-lg font-medium">{decision.title}</summary>
              <p className="measure mt-4 text-sm leading-relaxed text-ink-2">{decision.decision}</p>
              <p className="measure mt-4 border-l-2 border-caution/35 pl-4 text-sm leading-relaxed text-ink-3"><strong className="text-caution">{terms.consequenceHeading}：</strong>{decision.consequence}</p>
            </details>
          ))}
        </div>
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
            className="site-button inline-flex items-center rounded-[3px] border border-rule-strong px-4 py-2.5 text-[0.875rem] font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
          >
            {locale === "zh" ? "平台运维与角色" : "Platform operations and roles"}
          </Link>
          <Link
            href={localePath(locale, "/docs/concepts/sandbox")}
            className="site-button inline-flex items-center rounded-[3px] border border-rule-strong px-4 py-2.5 text-[0.875rem] font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
          >
            {locale === "zh" ? "沙箱与执行模型" : "Sandbox and execution model"}
          </Link>
        </div>
      </Section>

      <div className="pb-24 md:pb-28" />
    </>
  );
}
