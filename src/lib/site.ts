/**
 * Site-wide constants that are not translated.
 */

/**
 * Canonical origin. GitHub Pages project sites serve from a subpath, so this
 * is overridable at build time; the default assumes a custom domain or a user
 * page. `NEXT_PUBLIC_SITE_URL` takes precedence when set in CI.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://skymythos.ai"
).replace(/\/$/, "");

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const productName = "SkyMythos";

/**
 * The repository and console keep `fusion` identifiers for compatibility with
 * deployed data, Kubernetes resources and stored keys. That is an internal
 * detail, deliberately not surfaced on the marketing site.
 */
export const gitRepoUrl = "https://github.com/SkyMythos-ai/fusion-harness";

/** Absolute URL for a locale-relative path, used by metadata and the sitemap. */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${basePath}${path === "/" ? "" : path}`;
}
