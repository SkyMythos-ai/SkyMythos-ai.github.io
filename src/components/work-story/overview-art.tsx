import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { HumanPortrait, AgentPortrait } from "@/components/anatomy/character-parts";

function Text({ x, y, children, size = 18, muted = false, accent = false, middle = false }: { x: number; y: number; children: ReactNode; size?: number; muted?: boolean; accent?: boolean; middle?: boolean }) {
  return <text x={x} y={y} fontSize={size} fill={accent ? "#aec9c2" : muted ? "#abb8c5" : "#edf1f5"} textAnchor={middle ? "middle" : "start"}>{children}</text>;
}
function Part({ name, children }: { name: string; children: ReactNode }) { return <g data-part={name}>{children}</g>; }
function Document({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return <><path d={`M${x + 8} ${y}H${x + width - 22}L${x + width} ${y + 22}V${y + height - 8}Q${x + width} ${y + height} ${x + width - 8} ${y + height}H${x + 8}Q${x} ${y + height} ${x} ${y + height - 8}V${y + 8}Q${x} ${y} ${x + 8} ${y}Z`} fill="#1b2732" stroke="#718594"/><path d={`M${x + width - 22} ${y}V${y + 22}H${x + width}`} fill="none" stroke="#718594"/></>;
}

export function OverviewArt({ locale, idPrefix, mobile }: { locale: Locale; idPrefix: string; mobile: boolean }) {
  const tx = (zh: string, en: string) => locale === "zh" ? zh : en;
  const prefix = `${idPrefix}-${mobile ? "m" : "d"}`;
  const paths = mobile ? [
    ["goal", "M75 139H113"], ["reuse", "M155 65V94"], ["delegate", "M185 125H202V68H213"],
    ["verify", "M240 99V142"], ["deliver", "M240 212V223"], ["return", "M78 299H10V192H40"],
  ] : [
    ["goal", "M92 181H177"], ["reuse", "M228 91V127"], ["delegate", "M279 178H334V121H390"],
    ["verify", "M428 189V222"], ["deliver", "M473 260H525V215H569"], ["return", "M663 325V358H49V298"],
  ];
  return <svg viewBox={mobile ? "0 0 350 405" : "0 0 760 450"} data-layout={mobile ? "mobile" : "desktop"} aria-hidden="true">
    <defs><marker id={`${prefix}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L8 5L1 9" fill="none" stroke="#aec9c2" strokeWidth="1.4"/></marker></defs>
    {mobile ? <>
      <rect x="105" y="0" width="230" height="42" rx="10" fill="#17212a" stroke="#425564"/>
      <Text x={120} y={18} size={15} accent>{tx("企业资产按授权复用", "Authorised asset reuse")}</Text><Text x={120} y={37} size={15} muted>{tx("知识 / Skill / Flow", "Knowledge / Skill / Flow")}</Text>
      <HumanPortrait x={15} y={98} width={49}/><Text x={40} y={184} size={16} middle>{tx("人", "Person")}</Text>
      <Part name="goal"><Text x={40} y={84} size={15} middle>{tx("目标", "Goal")}</Text></Part>
      <AgentPortrait x={125} y={106} size={60}/><Text x={155} y={184} size={16} middle>SkyBot</Text>
      <AgentPortrait x={220} y={48} size={40}/><Text x={282} y={76} size={15} middle>{tx("研发", "Build")}</Text>
      <AgentPortrait x={220} y={154} size={40}/><Text x={282} y={183} size={15} middle>{tx("核验", "Check")}</Text>
      <Part name="built"><Text x={282} y={99} size={15} accent middle>{tx("产物", "Output")}</Text></Part>
      <Part name="checked"><Text x={282} y={207} size={15} accent middle>{tx("依据", "Evidence")}</Text></Part>
      <Part name="delivery"><Document x={90} y={235} width={240} height={125}/><Text x={107} y={266}>{tx("当前交付", "Current delivery")}</Text></Part>
      <Part name="delivery-output"><Text x={107} y={293} size={16} muted>{tx("订单导出产物", "Order export output")}</Text></Part>
      <Part name="delivery-checks"><Text x={107} y={318} size={16} muted>{tx("检查依据", "Verification evidence")}</Text></Part>
      <Part name="delivery-review"><Text x={107} y={344} size={16} accent>{tx("人已审阅确认", "Accepted by a person")}</Text></Part>
      <Part name="accepted"><Text x={42} y={218} size={15} middle accent>{tx("已审阅", "Accepted")}</Text></Part>
      <Part name="archive"><Text x={210} y={387} size={15} middle accent>{tx("已确认交付留存", "Accepted delivery retained")}</Text></Part>
    </> : <>
      <rect x="173" y="99" width="311" height="239" rx="12" fill="#131c25" stroke="#354655"/>
      <rect x="185" y="19" width="310" height="64" rx="10" fill="#17212a" stroke="#425564"/>
      <Text x={203} y={45} size={18} accent>{tx("企业资产按授权复用", "Authorised asset reuse")}</Text><Text x={203} y={70} size={17} muted>{tx("知识 / Skill / Flow / 角色", "Knowledge / Skill / Flow / Roles")}</Text>
      <HumanPortrait x={20} y={139} width={58}/><Text x={49} y={242} middle>{tx("人", "Person")}</Text><Text x={49} y={267} size={16} muted middle>{tx("目标与验收", "Goal & review")}</Text>
      <Part name="goal"><Text x={49} y={120} size={16} middle>{tx("订单导出", "Order export")}</Text></Part>
      <AgentPortrait x={190} y={140} size={76}/><Text x={228} y={242} middle>SkyBot</Text>
      <AgentPortrait x={403} y={96} size={50}/><Text x={428} y={176} size={17} middle>{tx("研发员工", "Developer")}</Text>
      <AgentPortrait x={403} y={235} size={50}/><Text x={428} y={315} size={17} middle>{tx("核验员工", "Reviewer")}</Text>
      <Part name="built"><Text x={514} y={132} size={16} middle accent>{tx("产物", "Output")}</Text></Part>
      <Part name="checked"><Text x={514} y={296} size={16} middle accent>{tx("依据", "Evidence")}</Text></Part>
      <Part name="delivery"><Document x={582} y={119} width={162} height={194}/><Text x={598} y={155} size={18}>{tx("当前交付", "Delivery")}</Text></Part>
      <Part name="delivery-output"><Text x={598} y={197} size={17} muted>{tx("订单导出产物", "Export output")}</Text></Part>
      <Part name="delivery-checks"><Text x={598} y={230} size={17} muted>{tx("检查依据", "Checks")}</Text></Part>
      <Part name="delivery-review"><Text x={598} y={263} size={17} accent>{tx("人已审阅确认", "Accepted")}</Text></Part>
      <Part name="accepted"><Text x={49} y={291} size={16} middle accent>{tx("已审阅", "Accepted")}</Text></Part>
      <Part name="archive"><Text x={663} y={388} size={16} middle accent>{tx("已确认交付留存", "Delivery retained")}</Text></Part>
      <Text x={190} y={393} size={16} muted>{tx("模型与工具支撑执行", "Models and tools enable execution")}</Text>
      <path d="M20 415H740" fill="none" stroke="#354655"/><Text x={20} y={438} size={16} muted>{tx("授权、记录与计量贯穿工作", "Access, records and metering apply throughout")}</Text>
    </>}
    {paths.map(([name, d]) => <g key={name}>
      <g className="story-transfer" data-flow={name} opacity="0"><path data-route="" d={d} fill="none" stroke="#aec9c2" strokeWidth="1.5" markerEnd={`url(#${prefix}-arrow)`}/><g data-packet=""><rect x="-10" y="-8" width="20" height="16" rx="3" fill="#253b40" stroke="#aec9c2"/><path d="M-5 -2H5M-5 3H2" fill="none" stroke="#aec9c2"/></g></g>
      <path className="static-route" d={d} fill="none" stroke="#718594" strokeWidth="1.2" markerEnd={`url(#${prefix}-arrow)`}/>
    </g>)}
  </svg>;
}
