import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SiteShell } from "./site-shell";
import site from "./site.module.css";
import styles from "./pricing.module.css";

const offerings = [
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
] as const;

export function PricingOverview() {
  return (
    <section
      className={`${site.container} ${styles.overview}`}
      aria-labelledby="pricing-overview-title"
    >
      <div>
        <h2 id="pricing-overview-title">
          先验证，
          <br />
          再确定企业投入。
        </h2>
        <p>
          POC 与企业项目按范围单独报价，部署、集成和服务边界在方案中逐项确认。
        </p>
        <Link href="/pricing" className={site.textLink}>
          了解价格与合作 <ArrowRight size={15} />
        </Link>
      </div>
      <dl className={styles.overviewOptions}>
        <div>
          <dt>POC 验证</dt>
          <dd>按验证范围报价</dd>
        </div>
        <div>
          <dt>企业项目</dt>
          <dd>按项目范围报价</dd>
        </div>
      </dl>
    </section>
  );
}

export function PricingPage() {
  return (
    <SiteShell>
      <main id="main-content" className={`${site.container} ${styles.page}`}>
        <header className={styles.heading}>
          <h1>价格与合作</h1>
          <p>POC 与企业项目，按实际范围单独报价。</p>
        </header>
        <div className={styles.offerings}>
          {offerings.map((offering) => (
            <section className={styles.offering} key={offering.name}>
              <h2>{offering.name}</h2>
              <p className={styles.description}>{offering.description}</p>
              <p className={styles.quote}>单独报价</p>
              <p className={styles.scope}>{offering.scope}</p>
              <ul aria-label={`${offering.name}沟通范围`}>
                {offering.items.map((item) => (
                  <li key={item}>
                    <Check size={15} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={offering.href} className={site.primaryLink}>
                {offering.action}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </section>
          ))}
        </div>
        <div className={styles.footnote}>
          <p>模型、基础设施与实施服务的费用，在报价中分别确认。</p>
          <Link href="/docs/private-deployment" className={site.textLink}>
            企业接入准备 <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
