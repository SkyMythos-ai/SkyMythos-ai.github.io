import { ImageResponse } from "next/og";

/**
 * Apple touch icon and the fallback `favicon.ico` equivalent.
 *
 * The same bracket-and-check mark as `icon.tsx`, rendered larger so the stroke
 * weight stays proportionate when iOS applies its own masking and rounding.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** See `icon.tsx` — metadata routes must opt into static generation. */
export const dynamic = "force-static";

export default function AppleIcon() {
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
        }}
      >
        <svg
          width="112"
          height="112"
          viewBox="0 0 20 20"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
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
