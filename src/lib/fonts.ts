import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";

/**
 * Typefaces.
 *
 * Jakarta 的几何字形用于品牌、标题与正文；Plex Mono 保留给版本、路径和机器事实。
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

export const siteSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-jakarta",
  adjustFontFallback: false,
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
  adjustFontFallback: false,
  fallback: ["SFMono-Regular", "Consolas", "Liberation Mono", "monospace"],
});
