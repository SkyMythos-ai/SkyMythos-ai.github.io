import { LocalizedDocumentationLayout } from "@/components/docs/layout";

export default function DocumentationLayout({ children }: { children: React.ReactNode }) {
  return <LocalizedDocumentationLayout locale="zh">{children}</LocalizedDocumentationLayout>;
}
