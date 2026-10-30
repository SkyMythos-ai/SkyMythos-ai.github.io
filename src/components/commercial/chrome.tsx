import type { ReactNode } from "react";
import Link from "next/link";
import parse from "html-react-parser";
import { ThemeToggle } from "@/components/site-theme";
import { LanguageSwitch } from "@/components/language-switch";
import { CommercialRuntime } from "@/components/commercial/runtime";
import { CommercialNavigation, CommercialWordmark, CommercialHeaderAction } from "@/components/commercial/navigation";
import { commercialDialogs } from "@/content/commercial/dialogs";
import { basePath } from "@/lib/site";
import "@/styles/commercial.css";

function Brand({ footer = false }: { footer?: boolean }) {
  return <Link className="brand" href="/zh/" aria-label={footer ? "返回 SkyMythos 首页" : "SkyMythos 首页"}>
    <img src={`${basePath}/brand/logo-mark.svg`} width="27" height="32" alt="" />
    <CommercialWordmark />
  </Link>;
}

function CommercialHeader() {
  return <header className="masthead"><div className="nav-inner wrap">
    <Brand />
    <button className="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" hidden>菜单</button>
    <CommercialNavigation />
    <LanguageSwitch locale="zh" label="切换语言" className="commercial-language" />
    <ThemeToggle />
    <CommercialHeaderAction />
  </div></header>;
}

function CommercialContact() {
  return <section className="contact section" id="contact" aria-labelledby="contact-title">
    <span className="legacy-anchor" id="pilot" /><span className="legacy-anchor" id="first-use" />
    <div className="wrap contact-inner"><div><p className="eyebrow">从一项真实工作开始</p><h2 id="contact-title">看看 AI 如何成为<br />你们的工作能力。</h2><p>围绕工作场景、现有系统与治理要求，梳理值得验证的第一步。</p></div><div className="contact-action"><a className="button" href="#contact" data-contact>预约演示<span aria-hidden="true">↗</span></a><p>仅在本地预览预约信息，<br />不发送、不保存，不构成实际预约。</p><noscript><p>预约弹窗需要 JavaScript。本页面没有连接销售或信息收集服务。</p></noscript></div></div>
  </section>;
}

/** 中文商业页独享外壳；文档、英文和旧显式页面不受其 reset 或控制器影响。 */
export function CommercialChrome({ children }: { children: ReactNode }) {
  return <div id="commercial-site" className="commercial-site">
    <a className="skip-link" href="#main">跳到正文</a>
    <CommercialHeader />
    <main id="main">{children}<CommercialContact /></main>
    <footer className="footer wrap"><div className="footer-main"><Brand footer /><p>让 AI 完成工作，让能力留在企业。</p><nav aria-label="页脚导航"><Link href="/zh/product/">产品</Link><Link href="/zh/solutions/">解决方案</Link><Link href="/zh/security/">安全</Link><Link href="/zh/resources/">资源</Link></nav></div><div className="footer-bottom"><span>© 2026 SkyMythos.ai</span></div></footer>
    {parse(commercialDialogs)}
    <CommercialRuntime rootId="commercial-site" />
  </div>;
}
