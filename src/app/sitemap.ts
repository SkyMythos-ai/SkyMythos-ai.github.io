import type { MetadataRoute } from "next";
import { locales, localeHtmlLang } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";
import { docRoutes } from "@/content/registry";

/** See `robots.ts` — metadata routes must opt into static generation. */
export const dynamic = "force-static";

/**
 * Sitemap.
 *
 * Generated from the same route registry the pages are built from, so a page
 * cannot exist without appearing here — the usual cause of an orphaned page in a
 * static export is a hand-maintained sitemap that drifts.
 *
 * Every entry carries `alternates.languages`, which is how a search engine learns
 * that the Chinese and English versions are the same page in two languages
 * rather than duplicate content competing with itself.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  /** Marketing routes, shared by both locales. */
  const marketingPaths = ["/", "/concept", "/architecture", "/docs"];

  /** Documentation routes, derived from the content registry. */
  const docsPaths = docRoutes().map((route) => `/docs/${route}`);

  const allPaths = [...marketingPaths, ...docsPaths];

  return allPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path === "/" ? "" : path}`),
      lastModified: now,
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/docs" ? 0.8 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((other) => [
            localeHtmlLang[other],
            absoluteUrl(`/${other}${path === "/" ? "" : path}`),
          ]),
        ),
      },
    })),
  );
}
