import type { Metadata } from "next";
import { AppDocument } from "@/components/app-document";

export const metadata: Metadata = {
  metadataBase: new URL("https://skymythos.ai"),
  title: { default: 'SkyMythos.ai · Let AI deliver. Keep the capability.', template: "%s · SkyMythos.ai" },
  description: 'The AI-Native Harness for enterprises. Let digital employees use tools, deliver results, and turn verified experience into reusable organizational capability.',
  robots: { index: process.env.NODE_ENV === "production", follow: process.env.NODE_ENV === "production" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppDocument locale="en">{children}</AppDocument>;
}
