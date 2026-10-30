import type { ReactNode } from "react";
import { plexSans, plexMono } from "@/lib/fonts";
import { localeHtmlLang, type Locale } from "@/lib/i18n";
import "@/styles/globals.css";
import "@/styles/site-theme.css";

/**
 * DocumentShell — the document element for every entry point.
 *
 * Three routes need to emit a complete HTML document: the locale tree, the root
 * gateway, and the 404. They share this component so the `lang` attribute, the
 * font variables and the global stylesheet can never drift apart between them.
 *
 * `lang` belongs on `<html>`, not on a wrapper element. This is the whole reason
 * the component exists: the locale must reach the document element, and only the
 * `[locale]` segment knows what it is. Browsers read the document `lang` for the
 * tab language, hyphenation and the spell-check dictionary; a wrapper `<div>`
 * does not affect any of those. Putting it here also keeps the 404 and the
 * gateway correct, since neither can see a locale from its own route.
 *
 * `suppressHydrationWarning` is set because the document element is the one node
 * React cannot fully reconcile once a static export hydrates.
 */
export function DocumentShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <html
      lang={localeHtmlLang[locale]}
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexMono.variable}`}
    >
      <head><script dangerouslySetInnerHTML={{ __html: `(function(){var m=window.matchMedia('(prefers-color-scheme: dark)');function saved(){try{return localStorage.getItem('skymythos-theme')}catch(e){return null}}function apply(){var s=saved();document.documentElement.dataset.siteTheme=(s==='light'||s==='dark')?s:(m.matches?'dark':'light')}apply();m.addEventListener('change',function(){if(!document.documentElement.hasAttribute('data-site-theme-chosen'))apply()});window.addEventListener('storage',function(e){if(e.key==='skymythos-theme'){document.documentElement.removeAttribute('data-site-theme-chosen');apply()}})})()` }} /></head>
      <body>{children}</body>
    </html>
  );
}
