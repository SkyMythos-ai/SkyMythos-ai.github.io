import type { Locale } from "@/lib/i18n";
import { LocaleProvider } from "@/components/locale-provider";
import localFont from "next/font/local";
import "@/app/globals.css";
import "@/app/fusion-theme.css";
import "@/app/docs-theme.css";

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

export function AppDocument({
  children, locale,
}: Readonly<{ children: React.ReactNode; locale: Locale }>) {
  return (
    <html
      lang={locale === "zh" ? "zh-CN" : "en"}
      suppressHydrationWarning
      className={`${inter.variable} ${berkeley.variable}`}
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t;try{t=localStorage.getItem('skymythos-theme')}catch(e){}document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'})()`,
          }}
        />
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
