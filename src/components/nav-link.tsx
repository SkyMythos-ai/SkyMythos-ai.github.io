"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * NavLink — the only reason navigation needs to run on the client.
 *
 * The active state depends on the current pathname, which a statically exported
 * page cannot know at build time. The cost is one tiny client component per link
 * rather than the whole header.
 *
 * A link with `exact` matches only its own path, so "Product" does not stay lit
 * on every route. Non-exact links match their path and any child route, which is
 * what "Documentation" should do.
 */
export function NavLink({
  href,
  children,
  exact = false,
}: {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
}) {
  const pathname = usePathname();

  const normalised = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";

  const active = exact
    ? normalised === target
    : normalised === target || normalised.startsWith(`${target}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative rounded-sm px-2.5 py-1.5 text-[0.8125rem] transition-colors",
        active ? "font-medium text-ink" : "text-ink-3 hover:text-ink",
      )}
    >
      {children}
      {/*
        The active marker is a 1px rule sitting on the header's own bottom
        border — the link underlines itself into the masthead, which is how a
        spec sheet marks the section you are reading.
      */}
      {active ? (
        <span
          aria-hidden="true"
          className="absolute inset-x-2.5 -bottom-[8.5px] h-px bg-ink"
        />
      ) : null}
    </Link>
  );
}
