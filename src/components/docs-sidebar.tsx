"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import type { DocNavGroup } from "@/content/types";

/**
 * DocsSidebar — the manual contents.
 *
 * A client component only so it can read the current pathname for the active
 * state; the link tree itself is fully static and pre-rendered.
 *
 * Every section is expanded rather than collapsed into an accordion. With five
 * sections and sixteen pages, collapsing would hide more than it saves, and a
 * reader who cannot see the shape of the manual cannot tell where they are in it.
 *
 * The weight runs the opposite way to a marketing nav: page titles are set in
 * ink and section names are set small, dim and mono. Sixteen destinations matter
 * more to a reader than the five labels that group them, so the group names are
 * typographic structure — the same voice as the rail labels elsewhere on the
 * site — rather than the loudest thing in the column. Setting both at the same
 * size, as this did, made the five group names shout and the sixteen pages
 * whisper.
 *
 * The active page is marked with a rule and ink colour rather than a filled
 * background: on a ruled editorial layout, a solid block would read as a
 * different kind of object than the surrounding text.
 */
export function DocsSidebar({
  locale,
  nav,
  activeSlug,
  label,
}: {
  locale: Locale;
  nav: DocNavGroup[];
  activeSlug: string;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="docs-sidebar no-print hidden w-[15rem] shrink-0 lg:block xl:w-[16rem]">
      <nav
        aria-label={label}
        className="site-sticky-rail sticky overflow-y-auto py-10 pr-6 md:py-12"
      >
        <span className="rail-label">{label}</span>

        <ul className="mt-6 space-y-7">
          {nav.map((group) => (
            <li key={group.id}>
              <span className="rail-label block">{group.title}</span>

              <ul className="mt-2.5 space-y-px border-l border-rule">
                {group.pages.map((page) => {
                  const href = localePath(locale, `/docs/${page.slug}`);
                  const active =
                    pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

                  return (
                    <li key={page.slug}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "-ml-px block border-l py-1.5 pl-3 text-[0.8125rem] leading-snug transition-colors",
                          active
                            ? "border-ink font-medium text-ink"
                            : "border-transparent text-ink-2 hover:border-rule-strong hover:text-ink",
                        )}
                      >
                        {page.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
