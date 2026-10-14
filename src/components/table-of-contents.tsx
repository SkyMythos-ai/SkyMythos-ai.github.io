"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { TocEntry } from "@/lib/headings";

/**
 * TableOfContents — the on-this-page index.
 *
 * Tracks the reader's position with an IntersectionObserver rather than a scroll
 * listener. A scroll listener would fire on every frame and force a layout read
 * each time; the observer only runs when a heading actually crosses a boundary.
 *
 * The active entry is decided by which heading is highest in the viewport among
 * those currently visible, falling back to the last heading scrolled past — which
 * is what makes the marker behave correctly at the very bottom of a page, where
 * no heading is intersecting any more.
 */
export function TableOfContents({
  entries,
  label,
}: {
  entries: TocEntry[];
  label: string;
}) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (entries.length === 0) return;

    const elements = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (observerEntries) => {
        const visible = observerEntries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          );

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
          return;
        }

        /**
         * Nothing is intersecting. If the reader is past the last heading, hold
         * it as active; otherwise clear, so the marker does not linger on a
         * heading the reader has scrolled back above.
         */
        const scrollY = window.scrollY;
        const lastPassed = elements
          .filter((element) => element.offsetTop <= scrollY + 160)
          .pop();
        setActiveId(lastPassed ? lastPassed.id : "");
      },
      // Trigger when a heading enters the band below the sticky masthead.
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [entries]);

  // A short page has no need for an index — it would be longer than the value
  // it adds.
  if (entries.length < 3) {
    return <div className="no-print hidden w-[15rem] shrink-0 xl:block" />;
  }

  /*
    The vertical padding and the top offset match `DocsSidebar` and the article
    between them, so the three column labels sit on one line across the page.
    Any drift here shows up immediately as a label hovering above or below its
    neighbours.
  */
  return (
    <aside className="no-print hidden w-[15rem] shrink-0 xl:block xl:w-[16rem]">
      <nav
        aria-label={label}
        className="site-sticky-rail sticky overflow-y-auto py-10 pl-6 md:py-12"
      >
        <span className="rail-label">{label}</span>

        <ul className="mt-4 space-y-px border-l border-rule">
          {entries.map((entry) => {
            const active = entry.id === activeId;
            return (
              <li key={entry.id}>
                <a
                  href={`#${entry.id}`}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "-ml-px block border-l py-1.5 text-[0.8125rem] leading-snug transition-colors",
                    entry.level === 3 ? "pl-6" : "pl-3",
                    active
                      ? "border-ink font-medium text-ink"
                      : "border-transparent text-ink-2 hover:border-rule-strong hover:text-ink",
                  )}
                >
                  {entry.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
