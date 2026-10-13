/**
 * Locale configuration.
 *
 * Two locales, both fully pre-rendered at build time. `zh` is the default:
 * the product's own documentation, domain vocabulary and target market are
 * Chinese-first, and the repository's canonical docs are written in Chinese.
 * English exists for overseas evaluation and procurement review, not as an
 * afterthought translation layer — both trees carry the same page structure.
 */

export const locales = ["zh", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";

export const localeLabels: Record<Locale, string> = {
  zh: "中文",
  en: "English",
};

/** BCP-47 tags for `lang` attributes and `hreflang` links. */
export const localeHtmlLang: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en",
};

export const localeOgLocale: Record<Locale, string> = {
  zh: "zh_CN",
  en: "en_US",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Resolve a locale from a route segment, falling back to the default.
 * Used by `generateStaticParams` consumers and the sitemap builder.
 */
export function toLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}

/** The other locale, for the language switcher. */
export function alternateLocale(locale: Locale): Locale {
  return locale === "zh" ? "en" : "zh";
}

/**
 * Prefix an app-relative path with a locale segment.
 * `localePath('zh', '/docs/preflight')` → `/zh/docs/preflight`
 */
export function localePath(locale: Locale, path = "/"): string {
  const normalised = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalised}`;
}
