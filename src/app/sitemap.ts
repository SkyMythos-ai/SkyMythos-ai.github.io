import type { MetadataRoute } from "next";
import { localeHtmlLang } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";
import { docRoutes } from "@/content/registry";
import { availableLocalesForPath, commercialSlugs, localizedRoutePath } from "@/lib/commercial-routes";

/** See `robots.ts` — metadata routes must opt into static generation. */
export const dynamic = "force-static";

/** 从真实路由与语言能力生成 sitemap；中文商业页不产生不存在的英文镜像。 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const marketingPaths = ["/", "/concept", "/architecture", "/docs"];
  const docsPaths = docRoutes().map((route) => `/docs/${route}`);
  const commercialPaths = commercialSlugs.map((slug) => `/${slug}`);
  const allPaths = [...new Set([...marketingPaths, ...docsPaths, ...commercialPaths])];

  return allPaths.flatMap((path) => {
    const availableLocales = availableLocalesForPath(path);
    return availableLocales.map((locale) => ({
      url: absoluteUrl(localizedRoutePath(locale, path)),
      lastModified: now,
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/docs" ? 0.8 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          availableLocales.map((other) => [
            localeHtmlLang[other],
            absoluteUrl(localizedRoutePath(other, path)),
          ]),
        ),
      },
    }));
  });
}
