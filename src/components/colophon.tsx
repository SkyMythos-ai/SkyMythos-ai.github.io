import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { Wordmark } from "@/components/wordmark";
import { localeHtmlLang } from "@/lib/i18n";

/**
 * Colophon — the site footer.
 *
 * Three link columns plus an identity block, laid out on the same ruled grid as
 * everything else. The locale is printed alongside the wordmark: on a site that
 * ships two full trees, stating which one you are reading is information, not
 * decoration.
 */
export function Colophon({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const currentYear = new Date().getFullYear();

  /**
   * Internal links must carry the locale prefix; external ones must not.
   * `href` starting with `http` is treated as external.
   */
  const renderLink = (link: { label: string; href: string }) =>
    link.href.startsWith("http") ? (
      <a
        key={link.href}
        href={link.href}
        target="_blank"
        rel="noreferrer noopener"
        className="block py-1 text-[0.8125rem] text-ink-3 transition-colors hover:text-ink"
      >
        {link.label}
      </a>
    ) : (
      <Link
        key={link.href}
        href={localePath(locale, link.href)}
        className="block py-1 text-[0.8125rem] text-ink-3 transition-colors hover:text-ink"
      >
        {link.label}
      </Link>
    );

  const columns = [
    { heading: dictionary.footer.productHeading, links: dictionary.footer.productLinks },
    { heading: dictionary.footer.resourceHeading, links: dictionary.footer.resourceLinks },
    { heading: dictionary.footer.companyHeading, links: dictionary.footer.companyLinks },
  ];

  return (
    <footer className="no-print border-t border-rule bg-paper-deep">
      <div className="mx-auto max-w-[90rem] px-6 py-14 md:px-10 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Wordmark size="large" />
            <p className="measure-tight mt-3 text-[0.8125rem] leading-[1.65] text-ink-3">
              {dictionary.footer.tagline}
            </p>
            <p className="fact-sm mt-4 text-ink-4" lang={localeHtmlLang[locale]}>
              {localeHtmlLang[locale]}
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="rail-label mb-3">{column.heading}</h2>
              {column.links.map(renderLink)}
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-rule pt-5">
          <p className="fact-sm text-ink-4">
            © {currentYear} SkyMythos. {dictionary.footer.rights}
          </p>
          <p className="fact-sm text-ink-4">{dictionary.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
