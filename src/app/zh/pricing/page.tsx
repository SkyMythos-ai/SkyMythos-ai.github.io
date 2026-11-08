import { PricingPage } from "@/components/sites/fusion/pricing";
import { localizedMetadata } from "@/lib/i18n";
export const metadata = localizedMetadata("zh", "/pricing", '价格与合作', 'POC 与企业项目，按实际范围单独报价。');
export default function Page() { return <PricingPage locale="zh" />; }
