import type { Metadata } from "next";
import { Suspense } from "react";
import { localizedMetadata, type Locale } from "@/lib/i18n";
import { getPocChannel } from "@/lib/poc-server";
import { SiteShell } from "./site-shell";
import { PocContent } from "./poc-content";

export type PocSearchParams = Promise<{ enquiry?: string | string[] }>;

type PocPageProps = { locale?: Locale; searchParams: PocSearchParams };

export async function getPocMetadata(
  locale: Locale,
  searchParams: PocSearchParams,
): Promise<Metadata> {
  const zh = locale === "zh";
  const staticHosting = process.env.GITHUB_PAGES === "true";
  const enterprise = !staticHosting && (await searchParams).enquiry === "enterprise";
  const title = staticHosting
    ? zh ? "POC 与企业项目咨询" : "POC & enterprise enquiries"
    : enterprise
      ? zh ? "咨询企业项目报价" : "Discuss an enterprise project"
      : zh ? "申请 POC" : "Request a POC";
  return localizedMetadata(
    locale,
    "/poc",
    title,
    zh
      ? "联系 SkyMythos 团队，评估场景、环境与交付范围，获取 POC 或企业项目报价。"
      : "Contact the SkyMythos team to assess your use case, environment and delivery scope for a POC or enterprise project quote.",
  );
}

export async function PocPageContent({ locale = "en", searchParams }: PocPageProps) {
  const staticHosting = process.env.GITHUB_PAGES === "true";
  const initialEnquiry =
    !staticHosting && (await searchParams).enquiry === "enterprise" ? "enterprise" : "poc";

  return (
    <SiteShell>
      <Suspense fallback={<main id="main-content">{locale === "zh" ? "正在准备咨询页面…" : "Preparing the enquiry form…"}</main>}>
        <PocContent
          channel={staticHosting ? { mode: "unconfigured" } : getPocChannel()}
          initialEnquiry={initialEnquiry}
          staticHosting={staticHosting}
        />
      </Suspense>
    </SiteShell>
  );
}
