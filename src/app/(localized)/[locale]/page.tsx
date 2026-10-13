import type { Metadata } from "next";
import Link from "next/link";
import { localePath, toLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { buildMetadata, softwareApplicationJsonLd } from "@/lib/metadata";
import { Section, SectionHeading } from "@/components/primitives";
import { Hero } from "@/components/hero";
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

/**
 * Home page.
 *
 * The order of the bands is an argument, and it is deliberately not the usual
 * one. Most developer-platform home pages open with capabilities, which assumes
 * the reader already agrees there is a problem worth solving. This one opens by
 * naming six specific failures in the current way of using coding agents — each
 * of which is a control-plane problem, not a model problem. Only then does it
 * present the product, the pipeline, the capabilities, and finally what the
 * platform refuses to do.
 *
 * The maturity band near the end is not boilerplate. A private-deployment
 * platform is bought by people who will ask what is actually finished, and a
 * site that overstates that is worse than useless during procurement.
 */
export default async function HomePage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale: Locale = toLocale(raw);
  const dictionary = getDictionary(locale);
  const jsonLd = softwareApplicationJsonLd(locale);

  return (
    <>
      <script
        type="application/ld+json"
        // Content is a build-time constant, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero locale={locale} />

      {/* ── The problem ─────────────────────────────────────────────────── */}
      <Section rail={dictionary.home.problemRail} divided>
        <SectionHeading
          title={dictionary.home.problemHeading}
          lede={dictionary.home.problemLede}
        />

        <ul className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-2">
          {dictionary.home.problems.map((problem, index) => (
            <li key={problem.title} className="border-t border-rule pt-4">
              <span className="fact-sm text-ink-4">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-[0.9375rem] font-semibold text-ink">
                {problem.title}
              </h3>
              <p className="mt-2 text-[0.875rem] leading-[1.65] text-ink-3">
                {problem.detail}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── The shift: a two-column contrast, not a feature list ────────── */}
      <Section rail={dictionary.home.shiftRail} divided>
        <SectionHeading title={dictionary.home.shiftHeading} />

        <div className="overflow-hidden rounded-panel border border-rule">
          {/*
            Headers. The conventional column is deliberately un-styled — grey and
            flat — while the governed column carries the signal colour. The
            asymmetry is the point of the table.
          */}
          <div className="grid grid-cols-1 border-b border-rule bg-sunken sm:grid-cols-2">
            <div className="border-rule-soft px-4 py-3 sm:border-r">
              <span className="text-[0.8125rem] font-medium text-ink-4">
                {dictionary.home.shiftColumns[0]}
              </span>
            </div>
            <div className="border-t border-rule-soft px-4 py-3 sm:border-t-0">
              <span className="text-[0.8125rem] font-medium text-ink">
                {dictionary.home.shiftColumns[1]}
              </span>
            </div>
          </div>

          <dl>
            {dictionary.home.shifts.map((shift, index) => (
              <div
                key={shift.governed}
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  index > 0 ? "border-t border-rule-soft" : ""
                }`}
              >
                <dt className="border-rule-soft px-4 py-3.5 text-[0.875rem] leading-[1.6] text-ink-4 sm:border-r">
                  {shift.conventional}
                </dt>
                <dd className="flex items-start gap-2.5 border-t border-rule-soft px-4 py-3.5 text-[0.875rem] leading-[1.6] text-ink sm:border-t-0">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    className="mt-[0.35em] h-3 w-3 shrink-0 text-signal"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.2 6.3 4.8 8.9 9.8 3.4" />
                  </svg>
                  <span>{shift.governed}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* ── The pipeline ────────────────────────────────────────────────── */}
      <Section rail={dictionary.home.pipelineRail} divided width="wide">
        <SectionHeading
          title={dictionary.home.pipelineHeading}
          lede={dictionary.home.pipelineLede}
        />
        <Pipeline locale={locale} />
        <p className="measure mt-8 border-l-2 border-rule-strong pl-4 text-[0.875rem] leading-[1.7] text-ink-3">
          {dictionary.home.pipelineNote}
        </p>
      </Section>

      {/* ── Capabilities, indexed by the domain object each is built on ─── */}
      <Section rail={dictionary.home.capabilityRail} divided>
        <SectionHeading
          title={dictionary.home.capabilityHeading}
          lede={dictionary.home.capabilityLede}
        />

        <ul className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
          {dictionary.home.capabilities.map((capability) => (
            <li
              key={capability.name}
              className="border-t border-rule py-5 first:border-t sm:[&:nth-child(2)]:border-t lg:first:border-t"
            >
              {/*
                The domain object is printed as a mono tag next to the capability
                name. This is how the marketing page stays tethered to the domain
                model: every capability names the object it is made of, so a
                reader can cross-reference the concepts page rather than take the
                marketing copy on faith.
              */}
              <div className="flex items-center gap-2.5">
                <h3 className="text-[0.9375rem] font-semibold text-ink">
                  {capability.name}
                </h3>
                <span className="fact-sm rounded-[2px] border border-rule bg-sunken px-1.5 py-[1px] text-ink-3">
                  {capability.object}
                </span>
              </div>
              <p className="measure mt-2 text-[0.875rem] leading-[1.65] text-ink-3">
                {capability.detail}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Boundaries ──────────────────────────────────────────────────── */}
      <Section rail={dictionary.home.boundaryRail} divided>
        <SectionHeading
          title={dictionary.home.boundaryHeading}
          lede={dictionary.home.boundaryLede}
        />

        <ul className="space-y-0">
          {dictionary.home.boundaries.map((boundary) => (
            <li
              key={boundary.title}
              className="grid gap-x-6 gap-y-1.5 border-t border-rule py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]"
            >
              <h3 className="text-[0.9375rem] font-medium text-ink">
                {boundary.title}
              </h3>
              <p className="text-[0.875rem] leading-[1.65] text-ink-3">
                {boundary.detail}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Maturity: stated plainly, on the sunken surface ─────────────── */}
      <Section rail={dictionary.home.maturityRail} divided>
        <SectionHeading title={dictionary.home.maturityHeading} />

        <div className="rounded-panel border border-rule bg-sunken p-6 md:p-7">
          {dictionary.home.maturityBody.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="measure text-[0.9375rem] leading-[1.75] text-ink-2 [&+&]:mt-4"
            >
              {paragraph}
            </p>
          ))}
          <p className="fact-sm mt-5 border-t border-rule pt-4 text-ink-4">
            {dictionary.home.maturityCaveat}
          </p>
        </div>
      </Section>

      {/* ── Call to action ──────────────────────────────────────────────── */}
      <Section divided className="pb-24 md:pb-28">
        <div className="max-w-[42rem]">
          <h2 className="text-[1.75rem] leading-[1.22] tracking-[-0.02em] md:text-[2.05rem]">
            {dictionary.home.ctaHeading}
          </h2>
          <p className="measure mt-4 text-[0.9375rem] leading-[1.7] text-ink-3">
            {dictionary.home.ctaBody}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={localePath(locale, "/docs/getting-started/overview")}
              className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2.5 text-[0.875rem] font-medium text-white transition-colors hover:bg-ink-2"
            >
              {dictionary.home.ctaPrimary}
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/25">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 10 10"
                  className="h-2.5 w-2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M2 5h6M5.4 2.4 8 5l-2.6 2.6" />
                </svg>
              </span>
            </Link>
            <Link
              href={localePath(locale, "/docs/reference/glossary")}
              className="inline-flex items-center rounded-sm border border-rule-strong px-4 py-2.5 text-[0.875rem] font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
            >
              {dictionary.home.ctaSecondary}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
