import { PricingPage } from "@/components/sites/fusion/pricing";
import { localizedMetadata } from "@/lib/i18n";
export const metadata = localizedMetadata("en", "/pricing", 'Pricing & cooperation', 'POC and enterprise projects are quoted separately, based on agreed scope.');
export default function Page() { return <PricingPage locale="en" />; }
