import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { commercialSlugs } from "@/lib/commercial-routes";
import { buildMetadata } from "@/lib/metadata";
import { CommercialBreadcrumbs, CommercialContent, getCommercialPages } from "@/components/commercial/content";

interface CommercialPageProps {
  params: Promise<{ locale: string; slug: string[] }>;
}

export const dynamicParams = false;

/**
 * 平铺返回完整中文参数，不为英文父分支返回空数组：Next 静态导出拒绝任何一次空结果。
 * 框架以子项覆盖父参数并按完整路径去重，因此父 zh/en 两次调用最终只生成这十二个中文页。
 */
export function generateStaticParams() {
  return commercialSlugs.map(slug => ({ locale: "zh", slug: slug.split("/") }));
}

function findPage(locale: string, slug: string[]) {
  if (locale !== "zh") notFound();
  const path = `${slug.join("/")}/`;
  const page = getCommercialPages().find(candidate => candidate.path === path);
  if (!page) notFound();
  return page;
}

export async function generateMetadata({ params }: CommercialPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = findPage(locale, slug);
  return buildMetadata({ locale: "zh", title: page.title, description: page.description, path: `/${page.path}` });
}

export default async function CommercialPage({ params }: CommercialPageProps) {
  const { locale, slug } = await params;
  const page = findPage(locale, slug);
  return <div className={`inner-page page-${page.section}`} data-commercial-page={page.path}>
    <CommercialBreadcrumbs page={page} />
    <CommercialContent html={page.body} />
  </div>;
}
