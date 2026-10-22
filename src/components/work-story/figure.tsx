import type { Locale } from "@/lib/i18n";
import { OverviewArt } from "./overview-art";
import { AssetsArt } from "./assets-art";
import { GovernanceArt } from "./governance-art";
import { StoryPlayback } from "./playback";
import type { StoryKind } from "./types";

const descriptions = {
  overview: { zh: "人提出目标，SkyBot 组织协作，产物与检查依据交回人。", en: "People set goals. SkyBot coordinates. Outputs and checks return for human review." },
  assets: { zh: "AI 从记录提出总结与方法候选；人审核、修改、确认并决定采用后，形成 Skill。来源与版本保留，后续任务按授权引用。", en: "AI proposes summaries and methods from records. People review, edit, confirm and decide adoption before a Skill is formed. Sources and versions stay as later tasks reuse it with permission." },
  governance: { zh: "保留可读运行与已记录消耗，对新的 Task 检查模型策略。", en: "Keep accessible runs and recorded usage. Check model policies for new Tasks." },
};
const captions = {
  overview: { zh: "协作示意。授权、记录与计量贯穿工作。", en: "Illustrated workflow. Access, records and metering apply throughout." },
  assets: { zh: "订单导出为示例。版本与引用是概念示意，不表示已创建真实资产。", en: "Order export is an example. Versions and references illustrate the concept, not a published asset." },
  governance: { zh: "仅分析有权读取且已记录的运行。费用是估算；Task 月额度准入不是全入口实时硬封顶。", en: "Only accessible, recorded runs are included. Costs are estimates; Task admission is not a real-time spending cap across all entry points." },
};

export function WorkStoryFigure({ kind, locale, idPrefix = `work-story-${kind}` }: { kind: StoryKind; locale: Locale; idPrefix?: string }) {
  const Art = kind === "overview" ? OverviewArt : kind === "assets" ? AssetsArt : GovernanceArt;
  return <figure className={`work-story work-story-${kind}`}>
    <StoryPlayback kind={kind} locale={locale} description={descriptions[kind][locale]}>
      <Art locale={locale} idPrefix={idPrefix} mobile={false}/>
      <Art locale={locale} idPrefix={idPrefix} mobile={true}/>
    </StoryPlayback>
    <figcaption>{captions[kind][locale]}</figcaption>
  </figure>;
}
