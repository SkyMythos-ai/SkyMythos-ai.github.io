import { defineDocs } from "fumadocs-mdx/macro";
import { loader } from "fumadocs-core/source";
import type { Locale } from "./i18n";

const english = defineDocs({ dir: "content/docs/en" });
const chinese = defineDocs({ dir: "content/docs/zh" });

export const docsSource = loader({
  baseUrl: "/docs",
  source: english.toFumadocsSource(),
});

const chineseDocsSource = loader({
  baseUrl: "/zh/docs",
  source: chinese.toFumadocsSource(),
});

export function getDocsSource(locale: Locale) {
  return locale === "zh" ? chineseDocsSource : docsSource;
}
