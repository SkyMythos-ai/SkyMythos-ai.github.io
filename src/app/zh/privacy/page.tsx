import { PrivacyContent } from "@/components/sites/fusion/privacy-page";
import { localizedMetadata } from "@/lib/i18n";
export const metadata = localizedMetadata("zh", "/privacy", '咨询与申请信息使用说明');
export default function Page() { return <PrivacyContent locale="zh" />; }
