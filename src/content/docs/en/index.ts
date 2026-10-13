import type { DocCorpus } from "@/content/types";
import { gettingStartedEn } from "./getting-started";
import { conceptsEn } from "./concepts";
import { guidesEn } from "./guides";
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
        "Environment requirements, deployment steps, and a full walkthrough of a first task.",
    },
    {
      id: "concepts",
      title: "Core concepts",
      description:
        "The domain model behind tasks, flows, sandboxes, artefacts, knowledge and memory — and the reason for each constraint.",
    },
    {
      id: "guides",
      title: "Guides",
      description:
        "How to create a task, observe execution, handle failure, and reuse capability.",
    },
    {
      id: "operations",
      title: "Platform operations",
      description:
        "Roles and permissions, deployment-level configuration, and how verification is graded.",
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
    ...operationsEn,
    ...referenceEn,
  ],
};
