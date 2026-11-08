import { createFromSource } from "fumadocs-core/search/server";
import { docsSource } from "@/lib/docs-source";

// 将公开文档索引导出给浏览器；GitHub Pages 与 Node 使用同一检索方式。
export const dynamic = "force-static";
export const { staticGET: GET } = createFromSource(docsSource);
