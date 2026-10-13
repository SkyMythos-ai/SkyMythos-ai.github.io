import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

/**
 * Typefaces.
 *
 * IBM Plex was chosen because it was drawn for technical documentation and
 * instrumentation: its Sans carries dense explanatory prose without strain, and
 * its Mono carries machine facts without looking like a novelty terminal font.
 * The pairing maps directly onto the product's own split between human language
 * and machine state, so the type system is doing semantic work rather than
 * decorating. Plex also ships real CJK-adjacent weight structure, so Latin and
 * Chinese headlines sit together without a visible weight mismatch.
 *
 * Both families are self-hosted by `next/font` at build time — no runtime request
 * to Google Fonts, which matters for a site that may be served from an intranet.
 *
 * CJK glyphs are deliberately NOT webfonted. A subset covering the site's Chinese
 * copy would still be megabytes, and the platform-native stacks (PingFang SC,
 * Microsoft YaHei, Noto Sans SC) render Chinese correctly on every target OS.
 * The trade is a slightly less distinctive Chinese headline in exchange for a
 * page that loads instantly in China.
 */

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-plex-sans",
  fallback: [
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei UI",
    "Microsoft YaHei",
    "Noto Sans SC",
    "sans-serif",
  ],
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-plex-mono",
  fallback: ["SFMono-Regular", "Consolas", "Liberation Mono", "monospace"],
});
