import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteShell } from "@/components/sites/fusion/site-shell";
import { PocContent } from "@/components/sites/fusion/poc-content";
import { getPocChannel } from "@/lib/poc-server";

type PageProps = { searchParams: Promise<{ enquiry?: string | string[] }> };

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  return {
    title:
      process.env.GITHUB_PAGES === "true"
        ? "POC 与企业项目咨询"
        : (await searchParams).enquiry === "enterprise"
          ? "咨询企业项目报价"
          : "申请 POC",
    description:
      "联系 SkyMythos 团队，评估场景、环境与交付范围，获取 POC 或企业项目报价。",
  };
}

export default async function PocPage({ searchParams }: PageProps) {
  const staticHosting = process.env.GITHUB_PAGES === "true";
  const initialEnquiry =
    !staticHosting && (await searchParams).enquiry === "enterprise"
      ? "enterprise"
      : "poc";

  return (
    <SiteShell>
      <Suspense fallback={<main id="main-content">正在准备咨询页面…</main>}>
        <PocContent
          channel={staticHosting ? { mode: "unconfigured" } : getPocChannel()}
          initialEnquiry={initialEnquiry}
          staticHosting={staticHosting}
        />
      </Suspense>
    </SiteShell>
  );
}
