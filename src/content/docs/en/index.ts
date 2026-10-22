import type { DocCorpus } from "@/content/types";
import { gettingStartedEn } from "./getting-started";
import { conceptsEn } from "./concepts";
import { guidesEn } from "./guides";
import { connectionsEn } from "./connections";
import { managementEn } from "./management";
import { operationsEn } from "./operations";
import { referenceEn } from "./reference";

/**
 * English documentation corpus.
 *
 * Mirrors the Chinese tree route for route — same slugs, same section ids, same
 * reading order — so the language switcher can map a reader to the equivalent
 * page rather than dropping them at the home page. Section membership does not
 * change a page's stable URL slug.
 */
export const enDocs: DocCorpus = {
  locale: "en",
  sections: [
    {
      id: "getting-started",
      title: "Getting started",
      description: "Enter the workbench, choose an entry point and review your first result.",
    },
    {
      id: "guides",
      title: "Complete and reuse work",
      description: "Create, review and resume work; organize knowledge, employees and reusable capabilities.",
    },
    {
      id: "management",
      title: "Manage enterprise AI",
      description: "Manage membership and access; review recorded usage, estimated costs and monthly model quotas.",
    },
    {
      id: "operations",
      title: "Deployment and operations",
      description: "Prepare infrastructure, connect models and tools, maintain environments and validate business workflows.",
    },
    {
      id: "concepts",
      title: "Core concepts",
      description: "Boundaries between employees, tasks, execution environments, delivery evidence, knowledge and memory.",
    },
    {
      id: "reference",
      title: "Reference",
      description: "Canonical domain vocabulary and frequently asked questions.",
    },
  ],
  pages: [
    ...gettingStartedEn,
    ...guidesEn,
    ...managementEn,
    ...operationsEn,
    ...connectionsEn,
    ...conceptsEn,
    ...referenceEn,
  ],
};
