import type { Metadata } from "next";
import { PricingPage } from "@/components/sites/fusion/pricing";

export const metadata: Metadata = {
  title: "价格与合作",
  description:
    "SkyMythos 按 POC 与企业项目单独报价。了解评估范围、费用边界和询价前需要准备的信息。",
};

export default function Page() {
  return <PricingPage />;
}
