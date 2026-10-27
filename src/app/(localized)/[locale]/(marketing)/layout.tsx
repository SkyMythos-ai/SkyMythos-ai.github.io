import type { ReactNode } from "react";
import { toLocale } from "@/lib/i18n";
import { SiteChrome } from "@/components/site-chrome";
import { CommercialChrome } from "@/components/commercial/chrome";
import { MarketingChromeBoundary } from "@/components/commercial/chrome-boundary";

export default async function MarketingLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = toLocale(raw);

  return (
    <div className="scope-marketing">
      {locale === "zh" ? <MarketingChromeBoundary
        commercial={<CommercialChrome>{children}</CommercialChrome>}
        legacy={<SiteChrome locale={locale}>{children}</SiteChrome>}
      /> : <SiteChrome locale={locale}>{children}</SiteChrome>}
    </div>
  );
}
