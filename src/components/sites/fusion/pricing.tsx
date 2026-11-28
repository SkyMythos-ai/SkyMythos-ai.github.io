import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  Cpu,
  Info,
  Layers3,
  MessageSquare,
  PlugZap,
  ShieldCheck,
  Users,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { localizeHref, type Locale } from "@/lib/i18n";
import {
  getPricingCopy,
  type PlanSubGroup,
  type SuiteIconKey,
} from "./pricing-data";
import { SiteShell } from "./site-shell";
import site from "./site.module.css";
import styles from "./pricing.module.css";

const suiteIcons: Record<SuiteIconKey, LucideIcon> = {
  bot: Bot,
  workflow: Workflow,
  users: Users,
  book: BookOpen,
  zap: Zap,
  message: MessageSquare,
  cpu: Cpu,
  shield: ShieldCheck,
};

const subGroupIcons: Record<PlanSubGroup["id"], LucideIcon> = {
  knowledge: BookOpen,
  connectivity: PlugZap,
  governance: ShieldCheck,
};

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

function ChecklistRow({
  label,
  included,
  note,
  tip,
}: {
  label: string;
  included: boolean;
  note?: string;
  tip?: string;
}) {
  return (
    <li className={included ? styles.itemIncluded : styles.itemMuted}>
      {included ? (
        <Check size={16} className={styles.checkIcon} aria-hidden="true" />
      ) : (
        <X size={16} className={styles.crossIcon} aria-hidden="true" />
      )}
      <span className={styles.itemText}>
        {tip ? (
          <span className={styles.tipAnchor} tabIndex={0}>
            <span className={styles.tipLabel}>{label}</span>
            <span role="tooltip" className={styles.tipBubble}>
              {tip}
            </span>
          </span>
        ) : (
          <span>{label}</span>
        )}
        {note && <span className={styles.itemNote}>{note}</span>}
      </span>
    </li>
  );
}

export function PricingPage({ locale = "en" }: { locale?: Locale }) {
  const copy = getPricingCopy(locale);

  return (
    <SiteShell>
      <main id="main-content" className={styles.page}>
        <section className={styles.heroBand} aria-labelledby="pricing-page-title">
          <div className={site.container}>
            <header className={styles.heading}>
              <span className={styles.eyebrowPill}>{copy.eyebrow}</span>
              <h1 id="pricing-page-title">{copy.title}</h1>
              <p>{copy.subtitle}</p>
            </header>

            <div className={styles.suiteSection}>
              <h2 id="pricing-suite-heading">{copy.suiteHeading}</h2>
              <div className={styles.chipsPrimary}>
                {copy.suitePrimaryChips.map((chip) => {
                  const Icon = suiteIcons[chip.icon];
                  return (
                    <span key={chip.id} className={`${styles.suiteChip} ${styles.suiteChipLarge}`}>
                      <Icon size={17} aria-hidden="true" />
                      <span>{chip.label}</span>
                    </span>
                  );
                })}
              </div>
              <div className={styles.chipsSecondary}>
                {copy.suiteSecondaryChips.map((chip) => {
                  const Icon = suiteIcons[chip.icon];
                  return (
                    <span key={chip.id} className={styles.suiteChip}>
                      <Icon size={15} aria-hidden="true" />
                      <span>{chip.label}</span>
                      {chip.tag && <span className={styles.chipTag}>{chip.tag}</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className={site.container}>
          <div className={styles.plansGrid}>
            {copy.plans.map((plan) => (
              <section
                key={plan.id}
                className={`${styles.planCard} ${plan.featured ? styles.featuredPlanCard : ""}`}
                aria-labelledby={`plan-${plan.id}-title`}
              >
                {plan.badge && <span className={styles.floatingBadge}>{plan.badge}</span>}

                <div className={styles.planTop}>
                  <h2 id={`plan-${plan.id}-title`}>{plan.name}</h2>
                  <div className={styles.priceRow}>
                    <span className={styles.priceLabel}>{plan.priceLabel}</span>
                    <span className={styles.priceUnit}>{plan.priceUnit}</span>
                  </div>
                  <p className={styles.tagline}>{plan.tagline}</p>

                  <Link
                    href={localizeHref(plan.primaryHref, locale)}
                    className={`${styles.primaryCta} ${plan.featured ? styles.primaryCtaFeatured : ""}`}
                  >
                    <span>{plan.primaryCta}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>

                  <div className={styles.secondaryRow}>
                    {plan.secondaryActions.map((action) => (
                      <Link
                        key={action.label}
                        href={localizeHref(action.href, locale)}
                        className={styles.secondaryAction}
                      >
                        {action.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className={styles.noticeBox}>
                  <div className={styles.noticeHead}>
                    <Info size={15} aria-hidden="true" />
                    <strong>{plan.noticeTitle}</strong>
                  </div>
                  <p>{plan.noticeText}</p>
                </div>

                <div className={styles.planBody}>
                  <div className={styles.primaryGroupHeader}>
                    <span className={styles.groupLogoMark} aria-hidden="true">
                      <Layers3 size={16} />
                    </span>
                    <h3>{plan.primaryGroupTitle}</h3>
                  </div>

                  <ul className={styles.checklist}>
                    {plan.primaryItems.map((item) => (
                      <ChecklistRow key={item.label} {...item} />
                    ))}
                  </ul>

                  <div className={styles.mainDivider} aria-hidden="true" />
                  <p className={styles.bonusLabel}>{plan.bonusLabel}</p>

                  <div className={styles.bonusGroups}>
                    {plan.bonusGroups.map((group) => {
                      const GroupIcon = subGroupIcons[group.id];
                      return (
                        <div key={group.id} className={styles.subGroup}>
                          <div className={styles.subGroupHeader}>
                            <GroupIcon size={16} aria-hidden="true" />
                            <h4>{group.title}</h4>
                          </div>
                          <ul className={styles.checklist}>
                            {group.items.map((item) => (
                              <ChecklistRow key={item.label} {...item} />
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <section
            id="private"
            className={styles.privateBanner}
            aria-labelledby="private-banner-heading"
          >
            <div className={styles.privateCopy}>
              <h2 id="private-banner-heading">{copy.privateBanner.title}</h2>
              <p>{copy.privateBanner.description}</p>
              <div className={styles.privateActions}>
                <Link
                  href={localizeHref(copy.privateBanner.primaryHref, locale)}
                  className={site.primaryLink}
                >
                  {copy.privateBanner.primaryLabel}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <Link
                  href={localizeHref(copy.privateBanner.secondaryHref, locale)}
                  className={site.textLink}
                >
                  {copy.privateBanner.secondaryLabel}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className={styles.privateVisual} aria-hidden="true">
              <svg viewBox="0 0 320 180" fill="none">
                <rect
                  x="16"
                  y="24"
                  width="288"
                  height="132"
                  rx="16"
                  stroke="currentColor"
                  strokeOpacity="0.16"
                  strokeDasharray="4 4"
                />
                <rect
                  x="42"
                  y="46"
                  width="96"
                  height="88"
                  rx="12"
                  fill="var(--f-surface)"
                  stroke="currentColor"
                  strokeOpacity="0.22"
                />
                <rect
                  x="182"
                  y="46"
                  width="96"
                  height="88"
                  rx="12"
                  fill="var(--f-surface)"
                  stroke="currentColor"
                  strokeOpacity="0.22"
                />
                <path
                  d="M138 90H182"
                  stroke="var(--f-accent)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <circle cx="160" cy="90" r="14" fill="var(--f-accent-soft)" stroke="var(--f-accent)" />
                <path
                  d="M155 90L158.5 93.5L165.5 86.5"
                  stroke="var(--f-accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect x="58" y="64" width="64" height="10" rx="5" fill="var(--f-accent-soft)" />
                <rect x="58" y="84" width="48" height="8" rx="4" fill="currentColor" fillOpacity="0.14" />
                <rect x="58" y="100" width="56" height="8" rx="4" fill="currentColor" fillOpacity="0.1" />
                <rect x="198" y="64" width="64" height="10" rx="5" fill="var(--f-accent-soft)" />
                <rect x="198" y="84" width="52" height="8" rx="4" fill="currentColor" fillOpacity="0.14" />
                <rect x="198" y="100" width="44" height="8" rx="4" fill="currentColor" fillOpacity="0.1" />
              </svg>
            </div>
          </section>

          <p className={styles.footnote}>{copy.footnote}</p>
        </div>
      </main>
    </SiteShell>
  );
}
