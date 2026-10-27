import { locales, type Locale } from "@/lib/i18n";

/** 商业导航栏目；页面文案 registry 复用此类型，不引入页面内容到客户端路由模块。 */
export type CommercialSection = "product" | "solutions" | "security" | "resources";

/** 中文商业内页的构建清单；首页由显式 page 路由负责，不放入 catch-all 参数。 */
export const commercialSlugs: readonly string[] = [
  "product",
  "product/work-delivery",
  "product/methods",
  "product/governance",
  "product/architecture",
  "solutions",
  "solutions/engineering",
  "solutions/team-reuse",
  "solutions/enterprise-adoption",
  "security",
  "resources",
  "resources/how-it-works",
];

const commercialSlugSet = new Set(commercialSlugs);
const chineseOnly: readonly Locale[] = ["zh"];
const noLocales: readonly Locale[] = [];

function routeSlug(path: string): string {
  return path.replace(/^\/+|\/+$/g, "");
}

/**
 * 已存在页面的 locale-relative 路径 → 真正对应的语言，不读取页面内容或文件系统。
 * '/product/' → ['zh']，'/concept' 与 '/docs/preflight' → ['zh', 'en']。
 * docs 命名空间沿用双语内容 registry 的同路由合同；未知营销页 → []，不伪造镜像。
 */
export function availableLocalesForPath(path: string): readonly Locale[] {
  const slug = routeSlug(path);
  if (commercialSlugSet.has(slug)) return chineseOnly;
  if (
    slug === "" ||
    slug === "concept" ||
    slug === "architecture" ||
    slug === "docs" ||
    slug.startsWith("docs/")
  ) return locales;
  return noLocales;
}

/** locale-relative 路径 → 带部署前缀与尾斜线的站内 URL，例如 ('zh', '/product', '/site') → '/site/zh/product/'。 */
export function localizedRoutePath(locale: Locale, path: string, basePath = ""): string {
  const prefix = basePath.replace(/\/+$/, "");
  const slug = routeSlug(path);
  return `${prefix}/${locale}/${slug ? `${slug}/` : ""}`;
}

/**
 * 当前 pathname（可含或不含 basePath）→ 原生语言链接与是否为对等页。
 * 对等页保留调用方提供的 query/hash；无翻译时回目标语言首页并丢弃失效后缀。
 * '/zh/product/' → en: '/en/'；'/site/zh/docs/a/' + '?q=1#b' → '/site/en/docs/a/?q=1#b'。
 */
export function languageSwitchDestination({
  pathname,
  targetLocale,
  basePath = "",
  suffix = "",
}: {
  pathname: string;
  targetLocale: Locale;
  basePath?: string;
  suffix?: string;
}): { href: string; isEquivalent: boolean } {
  const prefix = basePath.replace(/\/+$/, "");
  const appPath = prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`))
    ? pathname.slice(prefix.length) || "/"
    : pathname;
  const path = appPath.replace(/^\/(zh|en)(?=\/|$)/, "") || "/";
  const isEquivalent = availableLocalesForPath(path).includes(targetLocale);
  return {
    href: `${localizedRoutePath(targetLocale, isEquivalent ? path : "/", prefix)}${isEquivalent ? suffix : ""}`,
    isEquivalent,
  };
}
