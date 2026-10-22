import type { Locale } from "@/lib/i18n";
import { HumanPortrait } from "@/components/anatomy/character-parts";
import { Label, Part, Panel, Arrowhead, Transfer } from "./drawing";

export function GovernanceArt({ locale, idPrefix, mobile }: { locale: Locale; idPrefix: string; mobile: boolean }) {
  const tx = (zh: string, en: string) => locale === "zh" ? zh : en;
  const marker = `${idPrefix}-${mobile ? "m" : "d"}-arrow`;
  const [px, py, pw] = mobile ? [20, 290, 310] : [630, 30, 250];
  const flows = mobile ? [
    ["measure", "M175 150V165"], ["usage", "M323 185H343V275H298"],
    ["admit", "M120 263V277H160"], ["decision-allow", "M175 372V411H90V429"], ["decision-deny", "M175 372V411H260V429"],
  ] : [
    ["attribute", "M58 230V184H145V165"], ["measure", "M288 87H320"], ["usage", "M515 86H617"],
    ["admit", "M530 276H585V114H617"], ["decision-allow", "M755 153V222H675V251"], ["decision-deny", "M755 153V222H838V251"],
  ];
  const mx = mobile ? 90 : 345, ex = mobile ? 260 : 345;
  return <svg viewBox={mobile ? "0 0 350 500" : "0 0 900 350"} data-layout={mobile ? "mobile" : "desktop"} aria-hidden="true">
    <Arrowhead id={marker}/>
    <Part name="run"><Panel x={20} y={15} width={mobile ? 310 : 255} height={140}/><Label x={38} y={47} size={18}>{tx("运行记录", "Run record")}</Label><Label x={38} y={78} size={15} tone="muted">{tx("成员 / 工作区 / 模型", "Member / Workspace / Model")}</Label><Label x={38} y={108} size={15} tone="muted">{tx("订单导出", "Order export")}</Label></Part>
    <Part name="recorded"><Label x={38} y={136} size={13} tone="accent">{tx("已记录，供后续检查", "Recorded for later checks")}</Label></Part>
    <Part name="tokens"><Label x={mx} y={mobile ? 188 : 55} middle={mobile} size={18}>{tx("Token 用量", "Token usage")}</Label><Label x={mx} y={mobile ? 214 : 80} middle={mobile} size={14} tone="muted">{tx("输入 / 输出", "Input / Output")}</Label></Part>
    <Part name="estimate"><Label x={ex} y={mobile ? 188 : 120} middle={mobile} size={18}>{tx("估算费用", "Estimated cost")}</Label><Label x={ex} y={mobile ? 214 : 145} middle={mobile} size={13} tone="muted">{tx("完整 / 部分 / 未知", "Full / Partial / Unknown")}</Label></Part>
    {!mobile && <><HumanPortrait x={30} y={235} width={52}/><Label x={104} y={276} size={15}>{tx("任务发起成员", "Task owner")}</Label></>}
    <Part name="request"><Label x={mobile ? 120 : 345} y={mobile ? 254 : 280} middle={mobile} size={16}>{tx("新的 Task 请求", "New Task request")}</Label></Part>
    <Panel x={px} y={py} width={pw} height={mobile ? 72 : 115} accent/>
    <Label x={px + pw / 2} y={py + 32} size={20} middle>{tx("模型策略", "Model policy")}</Label><Label x={px + pw / 2} y={py + 58} size={14} tone="muted" middle>{tx("启停与月额度", "Availability and allowance")}</Label>
    <Part name="condition"><text x={mobile ? 175 : 755} y={mobile ? 396 : 185} textAnchor="middle" fill="var(--diagram-accent)" fontSize={13} data-scenario=""/></Part>
    <g className="static-condition"><Label x={mobile ? 175 : 755} y={mobile ? 396 : 185} size={13} middle tone="muted">{tx("不同条件，不同准入结果", "Different conditions, different decisions")}</Label></g>
    <Part name="allowed"><Label x={mobile ? 90 : 675} y={mobile ? 453 : 280} size={18} middle tone="accent">{tx("允许创建", "Allow creation")}</Label><Label x={mobile ? 90 : 675} y={mobile ? 480 : 307} size={13} middle tone="muted">{tx("可用，额度未达", "Within allowance")}</Label></Part>
    <Part name="denied"><Label x={mobile ? 260 : 838} y={mobile ? 453 : 280} size={18} middle>{tx("拒绝创建", "Reject creation")}</Label><Label x={mobile ? 260 : 838} y={mobile ? 480 : 307} size={13} middle tone="muted">{tx("本例模型禁用", "Model disabled")}</Label></Part>
    {flows.map(([name, d]) => <Transfer key={name} name={name} d={d} marker={marker}/>)}
  </svg>;
}
