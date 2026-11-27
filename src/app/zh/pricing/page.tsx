import { PricingPage } from "@/components/sites/fusion/pricing";
import { localizedMetadata } from "@/lib/i18n";

export const metadata = localizedMetadata(
  "zh",
  "/pricing",
  "定价与席位授权",
  "SkyMythos 企业版私有化部署与团队席位年度授权方案，支持先行开展真实业务场景试点。",
);

export default function Page() {
  return <PricingPage locale="zh" />;
}
