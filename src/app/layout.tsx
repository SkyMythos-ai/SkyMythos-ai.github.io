import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./fusion-theme.css";
import "./docs-theme.css";

const inter = localFont({
  src: "../../public/sites/linear/inter-variable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});
const berkeley = localFont({
  src: "../../public/sites/linear/berkeley-mono-variable.woff2",
  variable: "--font-berkeley",
  display: "swap",
  weight: "100 900",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "SkyMythos.ai · 让 AI 完成工作，让能力留在企业",
    template: "%s · SkyMythos.ai",
  },
  description:
    "企业的 AI-Native Harness。让数字员工承接目标、调用工具、交付成果，将有效经验与知识积累为企业能力。",
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: process.env.NODE_ENV === "production",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${inter.variable} ${berkeley.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t;try{t=localStorage.getItem('skymythos-theme')}catch(e){}document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
