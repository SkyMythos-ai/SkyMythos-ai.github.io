import type { Metadata, Viewport } from "next";
import { siteUrl, basePath, productName } from "@/lib/site";
import { localeHtmlLang, localePath, locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";

/**
 * Shared metadata construction.
 *
 * Every page builds its head from here so canonical URLs, hreflang alternates
 * and Open Graph tags stay consistent — a page that hand-rolls its metadata is
 * how a static site ends up with broken canonical tags and duplicate indexing.
 */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f8fc",
  colorScheme: "light",
};

/**
 * Open Graph and Twitter cards are generated per route by the `opengraph-image`
 * file convention, so only the reference lives here.
 */
export function buildMetadata({
  locale,
  title,
  description,
  /** Locale-relative path, e.g. `/docs/preflight`. Used for canonical + hreflang. */
  path,
  keywords,
  type = "website",
  publishedTime,
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const dictionary = getDictionary(locale);
  const localizedPath = (target: Locale) => `${basePath}${localePath(target, path).replace(/\/$/, "")}/`;
  const canonical = localizedPath(locale);

  /**
   * hreflang alternates point at the equivalent page in each locale. Because
   * both trees are generated from the same route list, every page has a true
   * counterpart — a 1:1 mapping, not an approximate one.
   */
  const languages = Object.fromEntries(
    locales.map((other) => [
      localeHtmlLang[other],
      localizedPath(other),
    ]),
  );

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": localizedPath("zh"),
      },
    },
    openGraph: {
      type,
      siteName: productName,
      title,
      description,
      url: canonical,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: locale === "zh" ? "en_US" : "zh_CN",
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
  };
}

/**
 * JSON-LD description of the product itself. Emitted once on the home page of
 * each locale so that a search engine has an explicit, structured statement of
 * what this is, rather than inferring it from page copy.
 */
export function softwareApplicationJsonLd(locale: Locale) {
  const dictionary = getDictionary(locale);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: productName,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "AI Infrastructure",
    operatingSystem: "Linux, Kubernetes",
    description: dictionary.meta.description,
    url: siteUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description:
        locale === "zh"
          ? "私有化部署，企业授权"
          : "Private deployment, enterprise licence",
    },
    featureList:
      locale === "zh"
        ? [
            "版本化 Flow 与 WorkNode 编排",
            "一任务一 Sandbox 隔离执行",
            "Artifact 与 Unit Gate 确定性交付",
            "执行恢复与定向返工",
            "项目知识与个人记忆",
            "Skill 与 MCP 能力市场",
            "OpenTelemetry 全链路可观测",
          ]
        : [
            "Versioned flow and work node orchestration",
            "One sandbox per task, isolated execution",
            "Deterministic delivery via artefacts and unit gates",
            "Execution resume and targeted rework",
            "Project knowledge and personal memory",
            "Skill and MCP capability marketplace",
            "End-to-end OpenTelemetry observability",
          ],
  };
}

/** Breadcrumb trail for documentation pages. Improves SERP presentation. */
export function breadcrumbJsonLd(
  locale: Locale,
  trail: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${basePath}/${locale}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
