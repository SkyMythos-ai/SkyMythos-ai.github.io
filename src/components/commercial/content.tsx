import "server-only";

import Link from "next/link";
import parse, { attributesToProps, domToReact, Element, type HTMLReactParserOptions } from "html-react-parser";
import { HeroLifecycle } from "@/components/hero-lifecycle/figure";
import { ProductDemo } from "@/components/commercial/product-demo";
import { basePath } from "@/lib/site";
import { commercialSlugs } from "@/lib/commercial-routes";
import { getProductImages } from "@/lib/product-reference";
import { HarnessHome } from "@/components/commercial/harness-home";
import { ProductCapturePlayer } from "@/components/commercial/product-capture-player";
import { createPages, type CommercialPage } from "@/content/commercial/pages";

const commercialBase = `${basePath}/zh/`;

/** 只解析仓内作者稿；产品 HTML 从专用 Server renderer 输出，不能穿过此解析边界。 */
export function CommercialContent({ html }: { html: string }) {
  const images = getProductImages();
  const resolved = html.replace(/\{\{PRODUCT_(IMAGE|WIDTH|HEIGHT):(workbench|delivery|methods|management)\}\}/g, (_marker, field: string, name: keyof typeof images) => {
    const image = images[name];
    return String(field === "IMAGE" ? image.src : field === "WIDTH" ? image.width : image.height);
  });
  const options: HTMLReactParserOptions = {
    replace(node) {
      if (node.type === "comment") {
        const marker = node.data.trim();
        if (marker === "LIFECYCLE") return <HeroLifecycle key="lifecycle-b" locale="zh" />;
        const name = marker.replace("CAPABILITY:", "");
        if (name === "delivery" || name === "methods" || name === "management") return <div className="product-reference-example" key={`product-${name}`}><ProductCapturePlayer name={name}><ProductDemo name={name} playback /></ProductCapturePlayer><a href={images[name].src} target="_blank" rel="noopener">查看完整产品原图 ↗</a></div>;
      }
      if (node instanceof Element && node.name === "a") {
        const { href, ...attributes } = node.attribs;
        if (href?.startsWith(commercialBase) && !("data-zoom" in attributes)) {
          const props = attributesToProps(attributes);
          return <Link {...props} href={basePath ? href.slice(basePath.length) : href}>{domToReact(node.children as Parameters<typeof domToReact>[0], options)}</Link>;
        }
      }
    },
  };
  return <>{parse(resolved, options)}</>;
}

/** 作者内容与统一路由清单分开；不在 layout 中读取请求路径或引入动态请求。 */
export function getCommercialPages(): CommercialPage[] {
  const pages = createPages({ base: commercialBase, lifecycle: "<!-- LIFECYCLE -->", productImages: getProductImages() });
  const paths = new Set(pages.map(page => page.path.replace(/\/$/, "")));
  if (paths.size !== pages.length || paths.size !== commercialSlugs.length || commercialSlugs.some(slug => !paths.has(slug))) {
    throw new Error("商业作者稿与权威路由清单不一致，停止生成。");
  }
  return pages;
}

export function CommercialHome() {
  return <HarnessHome />;
}

export function CommercialBreadcrumbs({ page }: { page: CommercialPage }) {
  const sections = { product: "产品", solutions: "解决方案", security: "安全", resources: "资源" };
  const parent = `${page.section}/`;
  return <nav className="breadcrumb wrap" aria-label="面包屑"><ol>
    <li><Link href="/zh/">首页</Link></li>
    {page.path !== parent && <li><Link href={`/zh/${parent}`}>{sections[page.section]}</Link></li>}
    <li><span aria-current="page">{page.label}</span></li>
  </ol></nav>;
}
