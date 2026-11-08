import { LocalizedDocumentationLayout } from "@/components/docs/layout";

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
  return <LocalizedDocumentationLayout locale="en">{children}</LocalizedDocumentationLayout>;
}
