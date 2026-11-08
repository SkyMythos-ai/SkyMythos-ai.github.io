import type { Metadata } from "next";

export type Locale = "en" | "zh";

// 语言由URL决定；外链、静态资源和API路径不加语言前缀。
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const match = href.match(/^([^?#]*)(.*)$/);
  const pathname = match?.[1] ?? href;
  const suffix = match?.[2] ?? "";
  if (/^\/(?:_next|sites|api)(?:\/|$)/.test(pathname)) return href;
  const base = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
  return `${locale === "zh" ? `/zh${base === "/" ? "/" : base}` : base}${suffix}`;
}

export function localizedMetadata(
  locale: Locale,
  pathname: string,
  title: string,
  description?: string,
): Metadata {
  return {
    title: pathname === "/" ? { absolute: title } : title,
    ...(description && { description }),
    alternates: {
      canonical: localizeHref(pathname, locale),
      languages: {
        en: localizeHref(pathname, "en"),
        "zh-CN": localizeHref(pathname, "zh"),
        "x-default": localizeHref(pathname, "en"),
      },
    },
  };
}
