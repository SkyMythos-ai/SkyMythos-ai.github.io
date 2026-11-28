import defaultMdxComponents from "fumadocs-ui/mdx";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Callout } from "fumadocs-ui/components/callout";
import { Card, Cards } from "fumadocs-ui/components/card";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import type { MDXComponents } from "mdx/types";
import type { Locale } from "@/lib/i18n";
import {
  DocScreenshot,
  type DocScreenshotProps,
} from "./doc-screenshot";
import {
  DomainModelDiagram,
  EngineeringFlowDiagram,
  HarnessClosedLoopDiagram,
  KnowledgeLifecycleDiagram,
  SystemArchitectureDiagram,
} from "./diagrams";

export function getMDXComponents(
  locale: Locale = "en",
  components?: MDXComponents,
) {
  return {
    ...defaultMdxComponents,
    Accordion,
    Accordions,
    Callout,
    Card,
    Cards,
    Step,
    Steps,
    Tab,
    Tabs,
    DocScreenshot: (props: Omit<DocScreenshotProps, "locale">) => (
      <DocScreenshot locale={locale} {...props} />
    ),
    HarnessClosedLoopDiagram: () => <HarnessClosedLoopDiagram locale={locale} />,
    DomainModelDiagram: () => <DomainModelDiagram locale={locale} />,
    SystemArchitectureDiagram: () => (
      <SystemArchitectureDiagram locale={locale} />
    ),
    KnowledgeLifecycleDiagram: () => (
      <KnowledgeLifecycleDiagram locale={locale} />
    ),
    EngineeringFlowDiagram: () => <EngineeringFlowDiagram locale={locale} />,
    ...components,
  } satisfies MDXComponents;
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
