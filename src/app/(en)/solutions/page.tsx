import { SolutionsHubPage } from "@/components/sites/fusion/solutions-pages";
import { localizedMetadata } from "@/lib/i18n";

export const metadata = localizedMetadata(
  "en",
  "/solutions",
  "Role Solutions",
  "Enterprise AI employee workflows across HR, Finance, Sales, Legal, Operations, Product, Engineering and IT Admin.",
);

export default function Page() {
  return <SolutionsHubPage locale="en" />;
}
