import { getCapabilities } from "@/components/sites/fusion/content";
import { ProductDetail } from "@/components/sites/fusion/product-page";
import { localizedMetadata } from "@/lib/i18n";
import { notFound } from "next/navigation";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getCapabilities("en").map(item => ({ slug: item.slug })); }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = getCapabilities("en").find(item => item.slug === slug);
  if (!item) notFound();
  return localizedMetadata("en", `/product/${slug}`, item.name, item.summary);
}
export default async function Page({ params }: Props) {
  return <ProductDetail slug={(await params).slug} locale="en" />;
}
