/**
 * SkyMythos website — Next.js configuration.
 *
 * Static export (`output: 'export'`) emits a fully pre-rendered site into `out/`:
 * every route is compiled to HTML at build time, which is exactly what GitHub Pages
 * needs and what search engines want to crawl. The trade-off is no SSR/ISR and no
 * on-demand image optimisation, so `images.unoptimized` is enabled below.
 *
 * `BASE_PATH` lets the same build target either a project page
 * (https://<user>.github.io/<repo>/) or a custom domain / user page (root).
 * Set it as an environment variable in CI; it defaults to empty (root) so local
 * development and custom-domain deployments need no extra configuration.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const basePath = process.env.BASE_PATH ?? "";

// Derive this file's own directory without relying on `import.meta.dirname`
// (only guaranteed from Node 20.11/21.2 onward); `fileURLToPath` + `dirname`
// works on every ESM-capable Node, matching the >=20.9.0 floor in package.json.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  // Emit `about/index.html` rather than `about.html` so GitHub Pages resolves
  // extension-less URLs without a redirect hop.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Surface lint/type problems as build failures rather than silent warnings.
  typescript: {
    ignoreBuildErrors: false,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  turbopack: {
    // Turbopack infers its project root by walking up from this file looking
    // for a lockfile, and will happily walk past the repo boundary into the
    // user's home directory if a stray `package-lock.json`/`node_modules`
    // lives there (as on this machine). When that happens it resolves its
    // internal virtual modules — e.g. the `next/font/google` shim used by
    // `src/lib/fonts.ts` — against the wrong `node_modules` and fails with
    // "Module not found: Can't resolve '@vercel/turbopack-next/...'". Pinning
    // the root here removes the guesswork (and the "ignored package-lock.json
    // outside the current Git repository" warning) regardless of what else
    // sits above this directory on disk.
    root: projectRoot,
  },
};

export default nextConfig;
