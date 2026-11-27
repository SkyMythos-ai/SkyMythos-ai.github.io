import Link from "next/link";
import { ArrowRight, Check, Plus } from "lucide-react";
import { localizeHref, type Locale } from "@/lib/i18n";
import { getPricingCopy } from "./pricing-data";
import { SiteShell } from "./site-shell";
import site from "./site.module.css";
import styles from "./pricing.module.css";

export function PricingOverview({ locale = "en" }: { locale?: Locale }) {
  const copy = getPricingCopy(locale).overview;
  return (
    <section
      className={`${site.container} ${styles.overview}`}
      aria-labelledby="pricing-overview-title"
    >
      <div className={styles.overviewLead}>
        <h2 id="pricing-overview-title">
          {copy.titleLine1}
          <br />
          {copy.titleLine2}
        </h2>
        <Link href={localizeHref("/pricing", locale)} className={site.textLink}>
          {copy.linkLabel} <ArrowRight size={15} />
        </Link>
      </div>
      <dl className={styles.overviewOptions}>
        {copy.items.map((item) => (
          <div key={item.name}>
            <dt>{item.name}</dt>
            <dd>{item.basis}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function PricingPage({ locale = "en" }: { locale?: Locale }) {
  const copy = getPricingCopy(locale);
  const zh = locale === "zh";

  return (
    <SiteShell>
      <main id="main-content" className={styles.page}>
        <div className={site.container}>
          <header className={styles.heading}>
            <span className={styles.eyebrowPill}>{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.subtitle}</p>
          </header>

          <div className={styles.offerings}>
            {copy.stages.map((stage) => (
              <section
                key={stage.id}
                className={`${styles.offering} ${stage.featured ? styles.featuredOffering : ""}`}
              >
                <div className={styles.offeringTop}>
                  <h2>{stage.name}</h2>
                  {stage.badge && <span className={styles.tierBadge}>{stage.badge}</span>}
                </div>
                <p className={styles.description}>{stage.tagline}</p>

                <div className={styles.priceBlock}>
                  <p className={styles.quote}>{stage.priceLabel}</p>
                  <p className={styles.scope}>{stage.billingBasis}</p>
                </div>

                <Link
                  href={localizeHref(stage.href, locale)}
                  className={stage.featured ? site.primaryLink : site.secondaryLink}
                >
                  {stage.actionLabel}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>

                <ul
                  className={styles.featureList}
                  aria-label={zh ? `${stage.name}包含内容` : `${stage.name} included scope`}
                >
                  {stage.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <section
            id="private"
            className={styles.boundarySection}
            aria-labelledby="cost-boundary-heading"
          >
            <h2 id="cost-boundary-heading">{copy.boundaryHeading}</h2>
            <div className={styles.boundaryGrid}>
              {copy.boundaries.map((item) => (
                <article key={item.step} className={styles.boundaryCard}>
                  <span className={styles.stepNum}>{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.rolloutSection} aria-labelledby="rollout-steps-heading">
            <h2 id="rollout-steps-heading">{copy.rolloutHeading}</h2>
            <ol className={styles.rolloutGrid}>
              {copy.rolloutSteps.map((item) => (
                <li key={item.step} className={styles.rolloutCard}>
                  <span className={styles.stepNum}>{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className={styles.footnote}>
            <p>{copy.footnote}</p>
            <Link href={localizeHref("/docs/private-deployment", locale)} className={site.textLink}>
              {copy.setupLinkLabel} <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <section className={`${site.container} ${site.faq}`} aria-labelledby="pricing-faq-heading">
          <h2 id="pricing-faq-heading">{copy.faqHeading}</h2>
          <div>
            {copy.faqs.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <span aria-hidden="true">
                    <Plus size={18} />
                  </span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
