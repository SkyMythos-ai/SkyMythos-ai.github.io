import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Metadata routes are dynamic by default, which a static export cannot serve.
 * robots.txt is computed entirely from build-time constants, so it is declared
 * static explicitly.
 */
export const dynamic = "force-static";

/**
 * robots.txt.
 *
 * Everything is public and intended to be indexed, so there is nothing to
 * disallow. The sitemap reference is the part that matters: it is how a crawler
 * discovers both locale trees without having to guess at the `/zh` and `/en`
 * prefixes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
