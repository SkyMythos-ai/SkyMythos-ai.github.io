import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { Wordmark } from "@/components/wordmark";
import { LanguageSwitch } from "@/components/language-switch";
import { NavLink } from "@/components/nav-link";
import { MobileNavigation } from "@/components/mobile-navigation";

/** 共享浮岛顶栏：内外两层保持同心曲线，所有页面复用同一导航。 */
export function Masthead({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);

  const links = [
    { href: "/", label: dictionary.nav.product, exact: true },
    { href: "/concept", label: dictionary.nav.concept, exact: false },
    { href: "/architecture", label: dictionary.nav.architecture, exact: false },
    // The documentation tab opens the first page of the manual rather than a
    // landing page: a reader who clicks "Documentation" wants to start reading,
    // not to choose from a second menu that repeats the sidebar. `match` keeps
    // the tab lit across the whole subtree regardless of which page is open.
    {
      href: "/docs/getting-started/overview",
      match: "/docs",
      label: dictionary.nav.docs,
      exact: false,
    },
  ];

  return (
    <header className="site-masthead no-print">
      <div className="site-masthead__shell">
        <div className="site-masthead__bar">
          <Link
            href={localePath(locale, "/")}
            className="site-masthead__brand"
            aria-label={dictionary.nav.home}
          >
            <Wordmark />
          </Link>

          <nav aria-label={dictionary.nav.home} className="site-masthead__desktop-nav">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={localePath(locale, link.href)}
                match={link.match ? localePath(locale, link.match) : undefined}
                exact={link.exact}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-masthead__actions">
            <LanguageSwitch locale={locale} label={dictionary.nav.switchLanguage} className="site-masthead__language" />
            <Link
              href={localePath(locale, "/docs/getting-started/overview")}
              className="site-masthead__start site-masthead__desktop-start"
            >
              {dictionary.nav.getStarted}
              <span className="site-masthead__start-icon" aria-hidden="true">↗</span>
            </Link>
          </div>

          {/* 原生 disclosure 保持无 JavaScript 时可用，增强后提供焦点与滚动约束。 */}
          <MobileNavigation label={dictionary.nav.openMenu}>
            <nav aria-label={dictionary.nav.home} className="site-masthead__mobile-panel">
              <p className="site-masthead__mobile-caption" aria-hidden="true">SkyMythos.ai</p>
              <div className="site-masthead__mobile-links">
                {links.map((link) => (
                  <NavLink
                    key={link.href}
                    href={localePath(locale, link.href)}
                    match={link.match ? localePath(locale, link.match) : undefined}
                    exact={link.exact}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
              <Link
                href={localePath(locale, "/docs/getting-started/overview")}
                className="site-masthead__start"
              >
                {dictionary.nav.getStarted}
                <span className="site-masthead__start-icon" aria-hidden="true">↗</span>
              </Link>
            </nav>
          </MobileNavigation>
        </div>
      </div>
    </header>
  );
}
