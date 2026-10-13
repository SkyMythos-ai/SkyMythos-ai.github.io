/**
 * Wordmark.
 *
 * Typographic rather than a drawn logo. The name is a compound of *sky* and
 * *mythos* — the product's premise is turning an intent that exists only as a
 * description into a durable, provable record — and a wordmark set in the same
 * technical sans as the rest of the site says that more honestly than a
 * constructed glyph would.
 *
 * The mark that carries meaning is the ruled bracket: it is the same boundary
 * motif used for the specification panel and the seal, where it denotes an
 * enclosing, frozen scope. Here it encloses the name.
 *
 * Rendered as text so it scales with user font-size settings, stays legible at
 * any zoom level, and costs nothing to load.
 */
export function Wordmark({
  className,
  /** Larger setting for the footer lockup. */
  size = "default",
}: {
  className?: string;
  size?: "default" | "large";
}) {
  return (
    <span
      className={[
        "inline-flex select-none items-center gap-[0.42em] font-sans font-semibold tracking-[-0.025em] text-ink",
        size === "large" ? "text-[1.0625rem]" : "text-[0.9375rem]",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Boundary brackets: the frozen-scope motif. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 10 20"
        className={size === "large" ? "h-[1.15em] w-auto" : "h-[1.1em] w-auto"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      >
        <path d="M8 1H1v18h7" />
      </svg>
      <span>SkyMythos</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 10 20"
        className={size === "large" ? "h-[1.15em] w-auto" : "h-[1.1em] w-auto"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      >
        <path d="M2 1h7v18H2" />
      </svg>
    </span>
  );
}
