import { FusionHome } from "@/components/sites/fusion/home";
import { localizedMetadata } from "@/lib/i18n";

export const metadata = localizedMetadata("en", "/", 'SkyMythos.ai · Let AI deliver. Keep the capability.', 'The AI-Native Harness for enterprises. Let digital employees use tools, deliver results, and turn verified experience into reusable organizational capability.');
export default function Home() { return <FusionHome locale="en" />; }
