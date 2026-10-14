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
          diagramNote: "治理、环境与执行，各有自己的权威。",
          authorityNote: "任务级状态与节点级状态，分别由控制面与 Supervisor 承载。",
          persistenceNote: "事实只有一处权威，交接通过显式合同。",
        }
      : {
          authorityHeading: "State authority",
          consequenceHeading: "Consequence",
          decisionHeading: "Decision",
          diagramNote: "Governance, environments and execution each have their own authority.",
          authorityNote: "The control plane owns task-level state. The supervisor owns node-level state.",
          persistenceNote: "One authority for each fact. Explicit contracts between components.",
        };


  return (
    <div className="architecture-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        rail={dictionary.nav.architecture}
        title={dictionary.architecture.title}
        lede={locale === "zh" ? "控制面管理任务，沙箱承载执行。每一层都有清晰的职责。" : "The control plane governs tasks. Sandboxes host execution. Every layer has a clear responsibility."}
        className="interior-opening"
      />

      {/* ── Components ─────────────────────────────────────────────────── */}
      <Section rail={dictionary.architecture.layersRail} index="01" divided width="wide" className="interior-section architecture-overview">
        <div className="interior-heading-row" data-reveal>
          <SectionHeading title={dictionary.architecture.layersHeading} />
          <p>{terms.diagramNote}</p>
        </div>
        <div className="premium-frame architecture-diagram-frame" data-reveal>
          <div className="premium-core"><ArchitectureMap locale={locale} /></div>
        </div>
        <div className="architecture-authority-note" data-reveal>
          <span className="rail-label">{terms.authorityHeading}</span>
          <p>{terms.authorityNote}</p>
        </div>
        <div className="premium-frame architecture-layer-frame" data-reveal>
          <details className="premium-core interior-disclosure architecture-layer-disclosure">
            <summary>
              <span className="interior-disclosure__heading"><strong>{locale === "zh" ? "查看组件职责与状态权威" : "Component responsibilities and state authority"}</strong><span>{locale === "zh" ? "六个组件，一套明确的边界。" : "Six components. One clear set of boundaries."}</span></span>
              <span className="interior-disclosure__toggle" aria-hidden="true" />
            </summary>
            <div className="architecture-layer-content"><LayerStack layers={dictionary.architecture.layers} authorityLabel={terms.authorityHeading} /></div>
          </details>
        </div>
      </Section>

      {/* ── Decisions ──────────────────────────────────────────────────── */}
      <Section rail={dictionary.architecture.decisionsRail} index="02" divided width="wide" className="interior-section architecture-decisions">
        <div className="interior-editorial-split">
          <div className="interior-section-intro" data-reveal>
            <SectionHeading title={dictionary.architecture.decisionsHeading} lede={dictionary.architecture.decisionsLede} />
          </div>
          <div className="premium-frame" data-reveal>
            <div className="premium-core interior-disclosure-board">
              {dictionary.architecture.decisions.map((decision, index) => (
                <details key={decision.title} className="interior-disclosure architecture-decision">
                  <summary>
                    <span className="interior-disclosure__index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="interior-disclosure__heading"><strong>{decision.title}</strong></span>
                    <span className="interior-disclosure__toggle" aria-hidden="true" />
                  </summary>
                  <div className="interior-disclosure__body">
                    <h3 className="rail-label">{terms.decisionHeading}</h3>
                    <p>{decision.decision}</p>
                    <div className="architecture-consequence"><h3 className="rail-label">{terms.consequenceHeading}</h3><p>{decision.consequence}</p></div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Persistence ────────────────────────────────────────────────── */}
      <Section rail={dictionary.architecture.persistenceRail} index="03" divided width="wide" className="interior-section architecture-persistence">
        <div className="interior-editorial-split">
          <div className="interior-section-intro" data-reveal>
            <SectionHeading title={dictionary.architecture.persistenceHeading} lede={terms.persistenceNote} />
          </div>
          <div className="premium-frame architecture-persistence-frame" data-reveal>
            <div className="premium-core">
              <div className="architecture-storage-tags" aria-hidden="true"><span>PostgreSQL</span><span>Git</span><span>{locale === "zh" ? "事务日志" : "Journal"}</span><span>{locale === "zh" ? "对象存储" : "Object storage"}</span></div>
              <p className="architecture-persistence-body">{dictionary.architecture.persistenceBody}</p>
            </div>
          </div>
        </div>
        <div className="architecture-doc-actions" data-reveal>
          <Link href={localePath(locale, "/docs/operations/roles")} className="premium-action">
            <span>{locale === "zh" ? "平台运维与角色" : "Platform operations and roles"}</span>
            <span className="premium-action__icon" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25"><path d="M5 15 15 5M5 5h10v10" /></svg></span>
          </Link>
          <Link href={localePath(locale, "/docs/concepts/sandbox")} className="premium-action">
            <span>{locale === "zh" ? "沙箱与执行模型" : "Sandbox and execution model"}</span>
            <span className="premium-action__icon" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25"><path d="M5 15 15 5M5 5h10v10" /></svg></span>
          </Link>
        </div>
      </Section>
    </div>
  );
}
