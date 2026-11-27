import { SolutionsHubPage } from "@/components/sites/fusion/solutions-pages";
import { localizedMetadata } from "@/lib/i18n";

export const metadata = localizedMetadata(
  "zh",
  "/solutions",
  "解决方案",
  "覆盖 HR、财务、销售、法务、市场与运营、产品、软件研发、IT 与管理的企业级数字员工解决方案。",
);

export default function Page() {
  return <SolutionsHubPage locale="zh" />;
}
