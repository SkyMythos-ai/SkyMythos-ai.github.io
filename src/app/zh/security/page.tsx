import { SecurityPage } from "@/components/sites/fusion/security-page";
import { localizedMetadata } from "@/lib/i18n";

export const metadata = localizedMetadata(
  "zh",
  "/security",
  "安全合规",
  "SkyMythos 企业版私有化数据隔离、精细权限管控、关键动作人工把关与全链路审计追溯。",
);

export default function Page() {
  return <SecurityPage locale="zh" />;
}
