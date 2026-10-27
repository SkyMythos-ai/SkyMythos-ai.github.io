import type { Metadata, Viewport } from "next";
import { siteUrl, basePath, productName } from "@/lib/site";
import { localeHtmlLang, localeOgLocale, type Locale } from "@/lib/i18n";
import { availableLocalesForPath, localizedRoutePath } from "@/lib/commercial-routes";
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
  themeColor: "#f4f5f6",
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
  const localizedPath = (target: Locale) => localizedRoutePath(target, path, basePath);
  const canonical = localizedPath(locale);
  const availableLocales = availableLocalesForPath(path);

  // 中文独有商业页没有英文镜像；x-default 指向同一内容的中文页，而不是英文首页。
  const languages = Object.fromEntries(
    availableLocales.map((other) => [
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
        "x-default": availableLocales.includes("zh") ? localizedPath("zh") : canonical,
      },
    },
    openGraph: {
      type,
      siteName: productName,
      title,
      description,
      url: canonical,
      locale: localeOgLocale[locale],
      alternateLocale: availableLocales
        .filter((other) => other !== locale)
        .map((other) => localeOgLocale[other]),
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
    featureList:
      locale === "zh"
        ? [
            "对话协作、研发任务与独立自动化运行",
            "长期数字员工与可复用角色",
            "版本化流程与工作方法",
            "研发任务 Sandbox 与个人云环境分别治理",
            "产物、检查与交付证据",
            "有来源的知识与员工经验",
            "按授权接入模型与业务系统",
            "成员使用记录与 Token、估算费用分析",
            "模型启停与任务月额度准入",
          ]
        : [
            "Conversations, engineering tasks and independent automation runs",
            "Long-lived digital employees and reusable roles",
            "Versioned flows and working methods",
            "Separate governance for task Sandboxes and personal environments",
            "Outputs, checks and delivery evidence",
            "Sourced knowledge and employee experience",
            "Authorised model and business-system integrations",
            "Member usage records, tokens and estimated costs",
            "Model availability and monthly task-admission allowances",
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
