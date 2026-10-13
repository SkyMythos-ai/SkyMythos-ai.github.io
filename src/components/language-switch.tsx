"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { alternateLocale, localeLabels, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/**
 * LanguageSwitch — swaps the locale segment while preserving the current page.
 *
 * This is the second and last reason the shell needs client JavaScript. Two
 * decisions are deliberate:
 *
 * 1. The equivalent page is preserved rather than sending the reader back to the
 *    home page. Both locale trees are generated from the same route list, so a
 *    counterpart always exists.
 *
 * 2. The control is a pair of explicit links, not a dropdown. Two options do not
 *    warrant a menu, and links are keyboard-reachable, middle-clickable and
 *    visible in the page source for crawlers — which is how the alternate tree
 *    gets discovered in the first place.
 */
export function LanguageSwitch({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const other = alternateLocale(locale);

  /**
   * Replace only the leading locale segment. The rest of the path is identical
   * in both trees by construction.
   */
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    segments[0] = other;
  }
  const target = `/${segments.join("/")}`;

  return (
    <Link
      href={target || `/${other}`}
      hrefLang={other === "zh" ? "zh-CN" : "en"}
      aria-label={`${label}: ${localeLabels[other]}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border border-rule",
        "px-2 py-1 text-[0.75rem] leading-none text-ink-2",
        "transition-colors hover:border-rule-strong hover:text-ink",
        className,
      )}
    >
      {/*
        A small globe glyph rather than a flag. A language is not a country, and
        the two locales here are Chinese and English, neither of which maps to a
        single flag.
      */}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-3 w-3 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <circle cx="8" cy="8" r="6.4" />
        <ellipse cx="8" cy="8" rx="2.7" ry="6.4" />
        <path d="M1.6 8h12.8" />
      </svg>
      <span>{localeLabels[other]}</span>
    </Link>
  );
}
