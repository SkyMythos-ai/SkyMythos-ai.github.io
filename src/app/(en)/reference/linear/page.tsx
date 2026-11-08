import type { Metadata } from "next";
import LinearHome from "@/components/sites/linear/linear-page";

export const metadata: Metadata = {
  title: "Linear 首页 · 布局参考",
  robots: { index: false, follow: false },
};

export default function LinearReference() {
  return <div lang="en"><LinearHome /></div>;
}
