/**
 * TraceField — the hero backdrop.
 *
 * This is the one illustration on the site that is pure atmosphere, and the
 * reason it is drawn rather than photographed is that the product's claim is
 * itself a shape: many loose inputs compile into one frozen specification, and
 * that specification is what the work is then driven from. So the figure is
 * literally that — twelve noisy traces entering from the left, converging
 * through a single gate, leaving as five clean ones. A reader should be able to
 * read the story off the backdrop before reading a word of the copy.
 *
 * It is drawn rather than shipped as a raster for the usual reasons — it stays
 * sharp on any display, costs no bytes as a file, inherits the palette from the
 * ground it sits on so it cannot drift out of the design system, and it can be
 * reasoned about in a diff.
 *
 * The gate point is deliberately left of centre, where the headline column ends,
 * so the convergence lands in the gutter between the copy and the panel rather
 * than behind either. A radial mask dissolves every edge, which keeps it from
 * reading as a bordered picture: the metaphor is meant to be felt behind the
 * content, not framed beside it.
 */

/** Entries spread down the left edge; the count is what makes it read as "many". */
const INPUT_COUNT = 12;
const INPUTS = Array.from({ length: INPUT_COUNT }, (_, i) => 30 + i * 62);

/** Exits are fewer and further apart — the point of the convergence. */
const OUTPUT_COUNT = 5;
const OUTPUTS = Array.from(
  { length: OUTPUT_COUNT },
  (_, i) => 180 + i * 110,
);

/**
 * Where the traces meet. Horizontal placement is tied to the layout rather than
 * chosen: this is the x at which the hero's copy column ends on a 1440px
 * viewport, so the gate sits in the gap.
 */
const GATE_X = 620;
const GATE_Y = 400;

export function TraceField({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{
        maskImage:
          "radial-gradient(ellipse 72% 68% at 46% 50%, #000 22%, transparent 76%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 72% 68% at 46% 50%, #000 22%, transparent 76%)",
      }}
    >
      <defs>
        {/*
          A dot grid rather than a line grid. Lines compete with the traces and
          turn the backdrop into graph paper; dots stay in the background as
          texture and suggest a coordinate space without drawing one.
        */}
        <pattern
          id="trace-grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.085" />
        </pattern>

        <radialGradient id="trace-glow">
          <stop
            offset="0%"
            stopColor="var(--color-signal)"
            stopOpacity="0.28"
          />
          <stop
            offset="100%"
            stopColor="var(--color-signal)"
            stopOpacity="0"
          />
        </radialGradient>
      </defs>

      <rect width="1440" height="800" fill="url(#trace-grid)" />
      <ellipse
        cx={GATE_X}
        cy={GATE_Y}
        rx="310"
        ry="240"
        fill="url(#trace-glow)"
      />

      {/* Inputs: neutral, faint, and many. */}
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.14">
        {INPUTS.map((y) => (
          <path
            key={y}
            d={`M -40 ${y} C 240 ${y}, 400 ${GATE_Y}, ${GATE_X} ${GATE_Y}`}
          />
        ))}
      </g>

      {/* Outputs: the signal colour, brighter, fewer. */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.45"
        className="text-signal"
      >
        {OUTPUTS.map((y) => (
          <path
            key={y}
            d={`M ${GATE_X} ${GATE_Y} C 840 ${GATE_Y}, 1010 ${y}, 1480 ${y}`}
          />
        ))}
      </g>

      {/*
        A single tick at the gate. Everything else in the figure flows; this is
        the one mark that stands still, which is the whole point of a freeze.
      */}
      <line
        x1={GATE_X}
        y1={GATE_Y - 26}
        x2={GATE_X}
        y2={GATE_Y + 26}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.5"
        className="text-signal"
      />
    </svg>
  );
}
