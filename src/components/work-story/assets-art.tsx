import type { Locale } from "@/lib/i18n";
import { HumanPortrait, AgentPortrait } from "@/components/anatomy/character-parts";
import { Label, Part, Panel, Arrowhead, Transfer } from "./drawing";

export function AssetsArt({ locale, idPrefix, mobile }: { locale: Locale; idPrefix: string; mobile: boolean }) {
  const tx = (zh: string, en: string) => locale === "zh" ? zh : en;
  const marker = `${idPrefix}-${mobile ? "m" : "d"}-arrow`;
  const human = mobile ? [267, 25] : [366, 25];
  const skill = mobile ? [20, 245, 310] : [20, 240, 340];
  const task = mobile ? [20, 435, 205] : [410, 262, 170];
  const [sx, sy, sw] = skill, [nx, ny, nw] = task;
  const flows = mobile ? [
    ["review", "M247 78H256"], ["form", "M295 165V230H175V233"],
    ["reuse", "M175 415V422"], ["execute", "M237 460H256"],
  ] : [
    ["review", "M272 78H354"], ["form", "M395 165V200H190V228"],
    ["reuse", "M372 309H397"], ["execute", "M495 339V352"],
  ];
  return <svg viewBox={mobile ? "0 0 350 520" : "0 0 600 450"} data-layout={mobile ? "mobile" : "desktop"} aria-hidden="true">
    <Arrowhead id={marker}/>
    <Panel x={20} y={15} width={mobile ? 215 : 240} height={153}/>
    <Label x={38} y={47}>{tx("工作记录", "Work records")}</Label>
    {[["record-one", "需求与约束", "Requirements"], ["record-two", "变更与检查", "Changes and checks"], ["record-three", "经验与纠正", "Experience and corrections"]].map(([name, zh, en], i) => <Part key={name} name={name}><Label x={38} y={80 + i * 30} size={15} tone="muted">{tx(zh, en)}</Label></Part>)}
    <HumanPortrait x={human[0]} y={human[1]} width={55}/>
    <Label x={human[0] + 27} y={131} size={15} middle>{tx("人审核修改", "Review + edit")}</Label>
    <Part name="confirmed"><Label x={human[0] + 27} y={155} size={14} middle tone="accent">{tx("确认并采用", "Adopted")}</Label></Part>
    <Part name="candidate"><Label x={38} y={193} size={15} tone="muted">{tx("AI 候选：导出并核对结果", "AI draft: export + check")}</Label></Part>
    <Part name="human-edit"><path d={`M38 188H${locale === "zh" ? 218 : 199}`} stroke="var(--diagram-muted)"/><Label x={38} y={219} size={15} tone="accent">{tx("人修改：沿用权限 + 核对行数", "Human edit: access + row count")}</Label></Part>
    <Part name="skill"><Panel x={sx} y={sy} width={sw} height={158} accent/><Label x={sx + 18} y={sy + 33} size={18}>Skill</Label></Part>
    {[["method-one", "权限校验", "Access checks"], ["method-two", "CSV / Excel 导出", "CSV / Excel export"], ["method-three", "行数与结果核对", "Row and result checks"]].map(([name, zh, en], i) => <Part name={name} key={name}><Label x={sx + 18} y={sy + 63 + i * 25} size={15}>{tx(zh, en)}</Label></Part>)}
    <Part name="provenance"><Label x={sx + 18} y={sy + 140} size={13} tone="muted">{tx("来源保留 / 版本示例 v1", "Sources retained / Example v1")}</Label></Part>
    <Part name="reused"><Label x={sx + sw - 85} y={sy + 113} size={13} tone="accent">{tx("已复用", "Reused")}</Label></Part>
    <Part name="next-task"><Panel x={nx} y={ny} width={nw} height={mobile ? 56 : 65}/><Label x={nx + 15} y={ny + 24} size={15}>{tx("下一项任务", "Next task")}</Label></Part>
    <Part name="reference"><Label x={nx + 15} y={ny + 45} size={13} tone="accent">{tx("按授权引用 Skill", "Authorised Skill ref")}</Label></Part>
    <Part name="executor"><circle cx={mobile ? 294 : 495} cy={mobile ? 461 : 389} r={34} fill="var(--diagram-soft)" stroke="var(--diagram-line)"/><AgentPortrait x={mobile ? 269 : 470} y={mobile ? 436 : 364} size={50}/></Part>
    <Part name="next-delivery"><Label x={mobile ? 294 : 495} y={mobile ? 515 : 443} size={14} middle tone="accent">{tx("新交付", "Delivered")}</Label></Part>
    {flows.map(([name, d]) => <Transfer key={name} name={name} d={d} marker={marker}/>)}
  </svg>;
}
