import type { DocCorpus } from "@/content/types";
import { gettingStartedEn } from "./getting-started";
import { conceptsEn } from "./concepts";
import { guidesEn } from "./guides";
import { connectionsEn } from "./connections";
import { operationsEn } from "./operations";
import { referenceEn } from "./reference";

/**
 * English documentation corpus.
 *
 * Mirrors the Chinese tree route for route — same slugs, same section ids, same
 * reading order — so the language switcher can map a reader to the equivalent
 * page rather than dropping them at the home page. The prose is written for an
 * overseas reader evaluating the product, not derived sentence by sentence from
 * the Chinese.
 */
export const enDocs: DocCorpus = {
  locale: "en",
  sections: [
    {
      id: "getting-started",
      title: "Getting started",
      description:
        "Start in the real workbench, check connections and complete your first task.",
    },
    {
      id: "concepts",
      title: "Core concepts",
      description:
        "Boundaries between employees, tasks, open execution, delivery evidence, knowledge and memory.",
    },
    {
      id: "guides",
      title: "Guides",
      description:
        "Create and review tasks, resume work, train employees and publish knowledge.",
    },
    {
      id: "operations",
      title: "Platform operations",
      description:
        "Team access, model and tool connections, and actual business acceptance.",
    },
    {
      id: "reference",
      title: "Reference",
      description: "Canonical domain vocabulary and frequently asked questions.",
    },
  ],
  pages: [
    ...gettingStartedEn,
    ...conceptsEn,
    ...guidesEn,
    ...connectionsEn,
    ...operationsEn,
    ...referenceEn,
  ],
};
