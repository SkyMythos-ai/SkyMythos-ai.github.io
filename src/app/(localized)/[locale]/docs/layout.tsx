import type { ReactNode } from "react";
import { toLocale } from "@/lib/i18n";
import { SiteChrome } from "@/components/site-chrome";

/** 文档保持浅色长文阅读面，与营销共享导航但不继承其主题偏好。 */
export default async function DocsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = toLocale(raw);

  return <div className="scope-docs"><SiteChrome locale={locale}>{children}</SiteChrome></div>;
}
