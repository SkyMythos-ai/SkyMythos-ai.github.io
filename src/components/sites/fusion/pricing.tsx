import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { localizeHref, type Locale } from "@/lib/i18n";
import { SiteShell } from "./site-shell";
import site from "./site.module.css";
import styles from "./pricing.module.css";

const offerings = {
  zh: [
    {
      name: "POC 验证",
      description: "用一项真实工作，验证是否适合你的团队。",
      scope: "按验证范围评估",
      items: ["验证目标与输入", "试点环境与接入范围", "交付物与验收方式"],
      action: "咨询 POC 报价",
      href: "/poc",
    },
    {
      name: "企业项目",
      description: "面向企业部署、系统集成与持续使用。",
      scope: "按项目范围评估",
      items: ["部署与使用规模", "模型、工具与知识对接", "实施与支持范围"],
      action: "咨询企业项目报价",
      href: "/poc?enquiry=enterprise",
    },
  ],
  en: [
    {
      name: "POC",
      description: "Assess the fit with one real piece of work.",
      scope: "Based on validation scope",
      items: ["Goals and inputs", "Pilot environment and connections", "Deliverables and acceptance criteria"],
      action: "Discuss a POC",
      href: "/poc",
    },
    {
      name: "Enterprise",
      description: "For enterprise deployment, integration and ongoing use.",
      scope: "Based on project scope",
      items: ["Deployment and usage scale", "Models, tools and knowledge integration", "Implementation and support scope"],
      action: "Contact us",
      href: "/poc?enquiry=enterprise",
    },
  ],
};

export function PricingOverview({ locale = "en" }: { locale?: Locale }) {
  const zh = locale === "zh";
  return (
    <section
      className={`${site.container} ${styles.overview}`}
      aria-labelledby="pricing-overview-title"
    >
      <div>
        <h2 id="pricing-overview-title">
          {zh ? "先验证，" : "Validate the fit."}
          <br />
          {zh ? "再确定企业投入。" : "Then plan the investment."}
        </h2>
        <p>
          {zh
            ? "POC 与企业项目按范围单独报价，部署、集成和服务边界在方案中逐项确认。"
            : "POCs and enterprise projects are quoted separately, with deployment, integration and service scope agreed in the proposal."}
        </p>
        <Link href={localizeHref("/pricing", locale)} className={site.textLink}>
          {zh ? "了解价格与合作" : "Explore pricing"} <ArrowRight size={15} />
        </Link>
      </div>
      <dl className={styles.overviewOptions}>
        <div>
          <dt>{zh ? "POC 验证" : "POC"}</dt>
          <dd>{zh ? "按验证范围报价" : "Quoted by validation scope"}</dd>
        </div>
        <div>
          <dt>{zh ? "企业项目" : "Enterprise"}</dt>
          <dd>{zh ? "按项目范围报价" : "Quoted by project scope"}</dd>
        </div>
      </dl>
    </section>
  );
}

export function PricingPage({ locale = "en" }: { locale?: Locale }) {
  const zh = locale === "zh";
  return (
    <SiteShell>
      <main id="main-content" className={`${site.container} ${styles.page}`}>
        <header className={styles.heading}>
          <h1>{zh ? "价格与合作" : "Pricing"}</h1>
          <p>{zh ? "POC 与企业项目，按实际范围单独报价。" : "POCs and enterprise projects, quoted for your scope."}</p>
        </header>
        <div className={styles.offerings}>
          {offerings[locale].map((offering) => (
            <section className={styles.offering} key={offering.name}>
              <h2>{offering.name}</h2>
              <p className={styles.description}>{offering.description}</p>
              <p className={styles.quote}>{zh ? "单独报价" : "Custom"}</p>
              <p className={styles.scope}>{offering.scope}</p>
              <ul aria-label={zh ? `${offering.name}沟通范围` : `${offering.name} scope`}>
                {offering.items.map((item) => (
                  <li key={item}>
                    <Check size={15} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={localizeHref(offering.href, locale)} className={site.primaryLink}>
                {offering.action}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </section>
          ))}
        </div>
        <div className={styles.footnote}>
          <p>{zh ? "模型、基础设施与实施服务的费用，在报价中分别确认。" : "Model, infrastructure and implementation costs are confirmed separately in your quote."}</p>
          <Link href={localizeHref("/docs/private-deployment", locale)} className={site.textLink}>
            {zh ? "企业接入准备" : "Prepare for enterprise setup"} <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
