import { SecurityPage } from "@/components/sites/fusion/security-page";
import { localizedMetadata } from "@/lib/i18n";

export const metadata = localizedMetadata(
  "en",
  "/security",
  "Security & Compliance",
  "Self-hosted private isolation, granular RBAC, human review gates and full-chain auditability for SkyMythos Enterprise.",
);

export default function Page() {
  return <SecurityPage locale="en" />;
}
