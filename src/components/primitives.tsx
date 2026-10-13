import { cn } from "@/lib/cn";

/**
 * Section — the vertical rhythm primitive.
 *
 * Every band of every page is built from this, so spacing is decided once rather
 * than re-specified per section. The `rail` prop is not decoration: it renders a
 * hanging label in the left gutter that names which part of the domain model the
 * section is about, and the grid guarantees that label aligns to the same column
 * on every page. That alignment is the structural spine of the site.
 *
 * The two-column grid collapses to one only below `lg`; the label moves above the
 * content rather than disappearing, because it carries meaning, not ornament.
 */
export function Section({
  children,
  className,
  id,
  /** Hanging label text. Rendered in the left gutter on wide viewports. */
  rail,
  /** Render a hairline above the section to separate it from the previous band. */
  divided = false,
  /** Constrain inner content width. `wide` is for the pipeline and tables. */
  width = "default",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  rail?: string;
  divided?: boolean;
  width?: "default" | "wide";
}) {
  return (
    <section
      id={id}
      className={cn(
        "px-6 md:px-10 lg:px-14",
        divided && "border-t border-rule",
        className,
      )}
    >
      <div
        className={cn(
          // Generous but not airy: the spec-sheet reading wants breathing room
          // between bands without letting the page lose its instrument feel.
          "mx-auto grid gap-x-10 gap-y-6 py-12 md:py-14 lg:py-16",
          rail
            ? "lg:grid-cols-[9rem_minmax(0,1fr)]"
            : "lg:grid-cols-[minmax(0,1fr)]",
          width === "wide" ? "max-w-[90rem]" : "max-w-[76rem]",
        )}
      >
        {rail ? (
          <div className="lg:pt-1">
            <span className="rail-label block">{rail}</span>
          </div>
        ) : null}
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

/**
 * SectionHeading — heading plus lede, with the one consistent measure.
 *
 * Kept as a pair so the vertical gap between a heading and its explanatory text
 * never varies across the site.
 */
export function SectionHeading({
  title,
  lede,
  className,
}: {
  title: string;
  lede?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 md:mb-12", className)}>
      <h2 className="text-[1.75rem] leading-[1.22] tracking-[-0.02em] md:text-[2.05rem]">
        {title}
      </h2>
      {lede ? (
        <p className="measure mt-4 text-[0.9375rem] leading-[1.7] text-ink-3">
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Rule — a horizontal hairline. Exists as a component so that no page in the
 * site invents its own border colour or weight.
 */
export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-rule", className)} />;
}
