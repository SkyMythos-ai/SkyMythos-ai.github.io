import { PrivacyContent } from "@/components/sites/fusion/privacy-page";
import { localizedMetadata } from "@/lib/i18n";
export const metadata = localizedMetadata("en", "/privacy", 'Enquiry information & privacy');
export default function Page() { return <PrivacyContent locale="en" />; }
