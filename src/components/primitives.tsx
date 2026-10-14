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
 * `index` adds a chapter number above the rail label in mono — the `01`, `02`,
 * `03` that make the marketing argument read as a sequence of chapters rather
 * than as a list of equally-weighted sections. It is optional because the manual
 * genuinely has no sequence to assert: a reader opens the page that answers
 * their question, and numbering it would imply an order that does not exist.
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
  /** Chapter number, e.g. "01". Rendered above the rail label. */
  index,
  /** Render a hairline above the section to separate it from the previous band. */
  divided = false,
  /** Constrain inner content width. `wide` is for the pipeline and tables. */
  width = "default",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  rail?: string;
  index?: string;
  divided?: boolean;
  width?: "default" | "wide";
}) {
  return (
    <section
      id={id}
      className={cn(
        "site-section px-6 md:px-10 lg:px-14",
        divided && "border-t border-rule",
        className,
      )}
    >
      <div
        className={cn(
          // Generous but not airy: the spec-sheet reading wants breathing room
          // between bands without letting the page lose its instrument feel.
          // Widened for the marketing ground, where a chapter has to occupy a
          // full viewport's worth of attention rather than sit in a document.
          "site-section__inner mx-auto grid gap-x-10 gap-y-6 py-16 md:py-20 lg:py-24",
          rail
            ? "lg:grid-cols-[9rem_minmax(0,1fr)]"
            : "lg:grid-cols-[minmax(0,1fr)]",
          width === "wide" ? "max-w-[90rem]" : "max-w-[76rem]",
        )}
      >
        {rail || index ? (
          <div className="lg:pt-1">
            {index ? (
              <span className="fact-sm mb-2 block text-ink-4">{index}</span>
            ) : null}
            {rail ? <span className="rail-label block">{rail}</span> : null}
          </div>
        ) : null}
        <div className="site-section__content min-w-0" data-reveal>{children}</div>
      </div>
    </section>
  );
}

/**
 * SectionHeading — heading plus lede, with the one consistent measure.
 *
 * Kept as a pair so the vertical gap between a heading and its explanatory text
 * never varies across the site. The heading uses the fluid `text-chapter` token:
 * on the marketing ground this is the step that makes a chapter read as a
 * chapter, and the gap between it and body text is what gives a long scroll its
 * sense of altitude.
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
    <div className={cn("mb-12 md:mb-16", className)}>
      <h2 className="text-chapter max-w-[24ch] font-semibold">{title}</h2>
      {lede ? (
        <p className="measure mt-5 text-[1.0625rem] leading-[1.7] text-ink-2">
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
