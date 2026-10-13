import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { cn } from "@/lib/cn";
import { Wordmark } from "@/components/wordmark";
import { LanguageSwitch } from "@/components/language-switch";
import { NavLink } from "@/components/nav-link";

/**
 * Masthead — the fixed top navigation.
 *
 * Server-rendered; the only client component inside is `NavLink`, which exists
 * solely to read the current pathname for the active state. Keeping the shell
 * static means every page ships as HTML with no navigation JavaScript cost.
 *
 * The bar is a hairline-ruled band rather than a floating pill: this product's
 * audience reads specification documents, and a solid ruled header reads as
 * instrumentation while a floating glass pill reads as a marketing template.
 */
export function Masthead({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);

  const links = [
    { href: "/", label: dictionary.nav.product, exact: true },
    { href: "/concept", label: dictionary.nav.concept, exact: false },
    { href: "/architecture", label: dictionary.nav.architecture, exact: false },
    { href: "/docs", label: dictionary.nav.docs, exact: false },
  ];

  return (
    <header className="no-print sticky top-0 z-30 border-b border-rule bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-6 px-6 md:px-10 lg:px-14">
        <Link
          href={localePath(locale, "/")}
          className="shrink-0 rounded-sm transition-opacity hover:opacity-70"
          aria-label={dictionary.nav.home}
        >
          <Wordmark />
        </Link>

        <nav
          aria-label={dictionary.nav.home}
          className="hidden min-w-0 flex-1 items-center gap-1 md:flex"
        >
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={localePath(locale, link.href)}
              exact={link.exact}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <LanguageSwitch
            locale={locale}
            label={dictionary.nav.switchLanguage}
          />
          <Link
            href={localePath(locale, "/docs/getting-started/overview")}
            className={cn(
              "hidden shrink-0 items-center rounded-sm bg-ink px-3.5 py-1.5",
              "text-[0.8125rem] font-medium text-white",
              "transition-colors hover:bg-ink-2 sm:inline-flex",
            )}
          >
            {dictionary.nav.getStarted}
          </Link>
        </div>
      </div>

      {/*
        Compact navigation for narrow viewports. A native <details> element is
        used rather than a stateful client menu: it works without JavaScript,
        is keyboard-accessible for free, and this site is a document-reading
        experience where a full-screen animated overlay would be noise.
      */}
      <details className="group border-t border-rule-soft md:hidden">
        <summary
          className={cn(
            "flex h-11 cursor-pointer list-none items-center px-6",
            "text-[0.8125rem] font-medium text-ink-2",
            "[&::-webkit-details-marker]:hidden",
          )}
        >
          <span className="group-open:hidden">{dictionary.nav.openMenu}</span>
          <span className="hidden group-open:inline">{dictionary.nav.closeMenu}</span>
        </summary>
        <nav
          aria-label={dictionary.nav.home}
          className="border-t border-rule-soft px-6 pb-3 pt-1"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={localePath(locale, link.href)}
              className="block border-b border-rule-soft py-2.5 text-[0.875rem] text-ink-2 last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}
