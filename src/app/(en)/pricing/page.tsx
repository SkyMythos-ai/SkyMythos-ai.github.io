import { PricingPage } from "@/components/sites/fusion/pricing";
import { localizedMetadata } from "@/lib/i18n";

export const metadata = localizedMetadata(
  "en",
  "/pricing",
  "Pricing & Licensing",
  "Self-hosted private deployment for SkyMythos Enterprise, licensed annually by active team seats with scoped pilot options.",
);

export default function Page() {
  return <PricingPage locale="en" />;
}
