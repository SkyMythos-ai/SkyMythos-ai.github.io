import { notFound } from "next/navigation";
import { getRoleSlugs, getRoleSolution } from "@/components/sites/fusion/solutions-data";
import { RoleSolutionDetailPage } from "@/components/sites/fusion/solutions-pages";
import { localizedMetadata } from "@/lib/i18n";

type Props = { params: Promise<{ role: string }> };

export function generateStaticParams() {
  return getRoleSlugs().map((role) => ({ role }));
}

export async function generateMetadata({ params }: Props) {
  const { role } = await params;
  const item = getRoleSolution(role, "zh");
  if (!item) notFound();
  return localizedMetadata("zh", `/solutions/${role}`, `${item.name}解决方案`, item.summary);
}

export default async function Page({ params }: Props) {
  return <RoleSolutionDetailPage slug={(await params).role} locale="zh" />;
}
