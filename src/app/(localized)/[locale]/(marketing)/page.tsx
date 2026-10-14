import type { Metadata } from "next";
import Link from "next/link";
import { localePath, toLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { buildMetadata, softwareApplicationJsonLd } from "@/lib/metadata";
import { Section, SectionHeading } from "@/components/primitives";
import { EmployeeIntro } from "@/components/employee-intro";
import { Hero } from "@/components/hero";
import { ArchitectureMap } from "@/components/architecture-map";
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
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    path: "/",
    keywords: dictionary.meta.keywords,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = toLocale(raw);
  const dictionary = getDictionary(locale);
  const jsonLd = softwareApplicationJsonLd(locale);

  return (
    <div className="home-page">
      <script
        type="application/ld+json"
        // Content is a build-time constant, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero locale={locale} />
      <EmployeeIntro locale={locale} />

      <Section id="workflow" className="home-section home-workflow" rail={locale === "zh" ? "工作链路" : "The workflow"} divided width="wide">
        <SectionHeading title={locale === "zh" ? "从需求到交付，一条清晰的路径。" : "A clear path from requirement to delivery."} />
        <Pipeline locale={locale} />
      </Section>

      <Section className="home-section home-architecture" divided width="wide">
        <div className="home-architecture-layout">
          <div className="home-architecture-heading">
            <p className="home-eyebrow">{locale === "zh" ? "协作架构" : "Built for collaboration"}</p>
            <h2 className="home-heading">{locale === "zh" ? "协作有边界，执行有依据。" : "Clear boundaries. Grounded execution."}</h2>
            <p className="home-lede">{locale === "zh" ? "控制面负责授权与资源供给。Agent 在隔离环境内协作，工作成果按契约交接。" : "The control plane governs access and resources. Agents collaborate in isolation and hand off work under clear contracts."}</p>
            <Link href={localePath(locale, "/architecture")} className="home-text-link">{locale === "zh" ? "探索完整架构" : "Explore the architecture"}<span aria-hidden="true">↗</span></Link>
          </div>
          <div className="premium-frame"><div className="premium-core"><ArchitectureMap locale={locale} /></div></div>
        </div>
      </Section>

      <Section className="home-section home-capabilities" rail={locale === "zh" ? "产品能力" : "Product capabilities"} divided>
        <SectionHeading title={locale === "zh" ? "深入了解" : "Explore further"} />
        <div className="premium-frame"><div className="premium-core home-capabilities-core">
        <div className="home-capability-grid">
          {dictionary.home.capabilities.map((capability) => (
            <details key={capability.name} className="home-disclosure">
              <summary>{capability.name}</summary>
              <p className="mt-4 text-sm leading-relaxed text-ink-3">{capability.detail}</p>
            </details>
          ))}
        </div>
        <details className="home-disclosure home-boundaries">
          <summary className="cursor-pointer text-sm text-ink-3">{dictionary.home.boundaryHeading}</summary>
          <ul className="mt-5 grid gap-5 md:grid-cols-2">{dictionary.home.boundaries.map((boundary) => <li key={boundary.title}><h3 className="text-sm">{boundary.title}</h3><p className="mt-2 text-sm text-ink-3">{boundary.detail}</p></li>)}</ul>
        </details>
        </div></div>
      </Section>

      {/* ── Maturity: stated plainly, on the sunken surface ─────────────── */}
      <Section className="home-section home-progress" divided>
        <div className="home-progress-layout">
          <div>
            <p className="home-eyebrow">{dictionary.home.maturityRail}</p>
            <h2 className="home-heading">{dictionary.home.maturityHeading}</h2>
          </div>
          <div>
            <p className="home-lede">{locale === "zh" ? "核心链路已跑通，生产级投放仍在建设中。" : "The core workflow runs. Production readiness remains in progress."}</p>
            <details className="home-disclosure">
              <summary>{locale === "zh" ? "查看当前进展与限制" : "Current progress and limitations"}</summary>
              <div className="mt-5 rounded-panel bg-sunken p-6">
                {dictionary.home.maturityBody.map((paragraph) => <p key={paragraph.slice(0, 24)} className="measure text-sm leading-relaxed text-ink-2 [&+&]:mt-4">{paragraph}</p>)}
                <p className="mt-4 text-xs text-ink-3">{dictionary.home.maturityCaveat}</p>
              </div>
            </details>
          </div>
        </div>
      </Section>

      {/* ── Call to action ──────────────────────────────────────────────── */}
      <Section className="home-section home-cta">
        <div className="premium-frame home-cta-frame"><div className="home-cta-panel premium-core">
          <div>
            <h2 className="home-heading">{dictionary.home.ctaHeading}</h2>
            <p className="home-lede">{dictionary.home.ctaBody}</p>
          </div>
          <div className="home-cta-actions">
            <Link
              href={localePath(locale, "/docs/getting-started/overview")}
              className="employee-primary premium-action"
            >
              {dictionary.home.ctaPrimary}
              <span className="premium-action__icon" aria-hidden="true">↗</span>
            </Link>
            <Link
              href={localePath(locale, "/docs/reference/glossary")}
              className="home-text-link"
            >
              {dictionary.home.ctaSecondary}
            </Link>
          </div>
        </div></div>
      </Section>
    </div>
  );
}
