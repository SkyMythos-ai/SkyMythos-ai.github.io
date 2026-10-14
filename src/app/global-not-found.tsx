import type { Metadata } from "next";
import { plexSans, plexMono } from "@/lib/fonts";
import { productName } from "@/lib/site";
import { NotFoundView } from "@/components/not-found-view";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: `404 · 页面不存在 | Page not found · ${productName}`,
  robots: { index: false, follow: true },
};

/**
 * Global not found — used when a URL matches no route at all.
 *
 * This is not a duplicate of `not-found.tsx`. GitHub Pages serves this file for
 * any unmatched path, and for a while it was the one page on the site that
 * shipped without a stylesheet: `app/not-found.tsx` sits at the root of `app/`,
 * while every layout in this project lives inside a route group, so nothing was
 * ever composed around it. The page rendered as unstyled HTML — the wordmark's
 * bracket SVG blew up to fill the viewport, because with no CSS it has no height
 * constraint to hold it to `1.1em`.
 *
 * `global-not-found` is the convention Next provides for exactly this shape of
 * app: it "bypasses your app's normal rendering", which is what makes it work
 * where a layout cannot. The cost is that it has to bring its own document,
 * stylesheet and font variables — nothing is inherited.
 *
 * The two files stay in sync by sharing `NotFoundView` for the body. If a third
 * 404 ever appears, it should reuse that too rather than restate the copy.
 */
export default function GlobalNotFound() {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexMono.variable}`}
    >
      <body>
        <NotFoundView />
      </body>
    </html>
  );
}
