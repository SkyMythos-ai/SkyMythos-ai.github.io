import type { Metadata } from "next";
import { productName } from "@/lib/site";
import { NotFoundView } from "@/components/not-found-view";

/**
 * The 404 carries its own title. Without one, the browser tab shows the raw URL
 * — and because this is the page a mistyped address lands on, that is exactly
 * where a readable title helps most. Both languages are included, since this
 * route cannot know which tree the reader meant to reach.
 */
export const metadata: Metadata = {
  title: `404 · 页面不存在 | Page not found · ${productName}`,
  robots: { index: false, follow: true },
};

/**
 * Not found, for `notFound()` thrown inside a route segment.
 *
 * This file sits at the root of `app/`, so no layout wraps it — every layout in
 * this project lives inside a route group (`(gateway)`, `(localized)`), and a
 * group's layout only applies within that group's subtree. So this file and
 * `global-not-found.tsx` are the two places where a 404 can be produced, and
 * neither inherits the furniture the rest of the site has.
 *
 * The body is shared with `global-not-found.tsx` via `NotFoundView`.
 */
export default function NotFound() {
  return <NotFoundView />;
}
