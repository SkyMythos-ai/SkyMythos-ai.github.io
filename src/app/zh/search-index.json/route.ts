import { createFromSource } from "fumadocs-core/search/server";
import { getDocsSource } from "@/lib/docs-source";

export const dynamic = "force-static";
export const { staticGET: GET } = createFromSource(getDocsSource("zh"));
