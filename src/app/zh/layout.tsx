import type { Metadata } from "next";
import { AppDocument } from "@/components/app-document";

export const metadata: Metadata = {
  metadataBase: new URL("https://skymythos.ai"),
  title: { default: 'SkyMythos.ai · 让 AI 完成工作，让能力留在企业', template: "%s · SkyMythos.ai" },
  description: '企业的 AI-Native Harness。让数字员工承接目标、调用工具、交付成果，将有效经验与知识积累为企业能力。',
  robots: { index: process.env.NODE_ENV === "production", follow: process.env.NODE_ENV === "production" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppDocument locale="zh">{children}</AppDocument>;
}
