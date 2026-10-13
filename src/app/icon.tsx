import { ImageResponse } from "next/og";

/**
 * Site icon, generated at build time.
 *
 * Rather than shipping a raster logo, the icon is drawn from the same boundary
 * bracket motif used in the wordmark and the specification seal: two rules
 * enclosing a scope. At 32px a detailed mark turns to mush, so the icon reduces
 * the motif to its minimum — brackets around a single check, which is what the
 * seal inside the hero panel resolves to.
 *
 * `next/og` renders this through Satori at build time, so it costs nothing at
 * runtime and works on a static host.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Metadata routes are dynamic by default, which a static export cannot serve.
 * The icon is a build-time constant, so it is declared static explicitly.
 */
export const dynamic = "force-static";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14171a",
          borderRadius: 6,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="square"
        >
          <path d="M6 2.5H2.5v15H6" />
          <path d="M14 2.5h3.5v15H14" />
          <path d="M7.2 10.2 9.3 12.3 13 8" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
