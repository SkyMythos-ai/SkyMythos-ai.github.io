import type { ReactNode } from "react";
import { toLocale } from "@/lib/i18n";
import { SiteChrome } from "@/components/site-chrome";

/** 营销页采用已确认的深石墨视觉，首页与内页共用同一材质和信号色。 */
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
    <div className="scope-dark scope-marketing">
      <SiteChrome locale={locale}>{children}</SiteChrome>
    </div>
  );
}
