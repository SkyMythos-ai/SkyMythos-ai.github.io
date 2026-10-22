import type { ReactNode } from "react";
import { toLocale } from "@/lib/i18n";
import { SiteChrome } from "@/components/site-chrome";

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
      <SiteChrome locale={locale}>{children}</SiteChrome>
    </div>
  );
}
