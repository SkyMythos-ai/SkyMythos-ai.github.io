import type { ReactNode } from "react";
import { getDictionary } from "@/content/dictionary";
import type { Locale } from "@/lib/i18n";
import { Masthead } from "@/components/masthead";
import { Colophon } from "@/components/colophon";
import { MotionEntrance } from "@/components/motion-entrance";

/**
 * SiteChrome — the masthead, the main column and the colophon.
 *
 * Extracted from the locale layout so the two grounds can each wrap the same
 * furniture in a different scope. The locale layout owns the document element
 * and nothing else; the ground is decided one level down, per route group,
 * because that is the level at which the marketing/manual split actually exists.
 *
 * The skip link is part of the chrome rather than the layout for the same
 * reason: it is a control the reader uses, and it has to be styled against
 * whichever ground it lands on.
 */
export function SiteChrome({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const dictionary = getDictionary(locale);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="skip-link sr-only focus:not-sr-only"
      >
        {dictionary.nav.skipToContent}
      </a>

      <Masthead locale={locale} />
      <MotionEntrance />

      <main id="main" className="flex-1">
        {children}
      </main>

      <Colophon locale={locale} />
    </div>
  );
}
