import type { Locale } from "@/lib/i18n";

const BLUE = "#3156ff";
const INK = "#22304a";
const EDGE = "#d9e2f2";
const SOURCE = "#d97757";

/** 原件与动画副本共用相同内容，来源编号在索引、命中和引用中保持一致。 */
function SourcePage({ title, number }: { title: string; number: number }) {
  return <>
    <path d="M10 0h114l18 18v64q0 10-10 10H10Q0 92 0 82V10Q0 0 10 0Z" fill="#fff" stroke={EDGE}/>
    <path d="M124 0v11q0 7 7 7h11" fill="#edf3ff" stroke={EDGE}/>
    <path d="M14 17h12v15H14zM17 21h6m-6 4h5" stroke="#7489ae" strokeWidth="1.2"/>
    <text x="32" y="29" className="knowledge-item-label" fill={INK} fontSize="16" fontWeight="500">{title}</text>
    <path d="M15 47h110M15 58h87M15 69h99" stroke="#c4d0e6" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="118" cy="77" r="3" fill={SOURCE}/>
    <text x="15" y="84" className="knowledge-source-label" fill="#687b9e" fontSize="12">[{number}]</text>
  </>;
}

/** 可插入 640×560 SVG 的知识库宣传图；默认显示完整成果，不建立独立时钟。 */
export function KnowledgeVisual({ locale, prefix }: { locale: Locale; prefix: string }) {
  const zh = locale === "zh";
  const names = zh ? ["项目文档", "技术决策", "工作经验"] : ["Documents", "Decisions", "Work notes"];
  const sourceYs = [83, 211, 339];
  const rowYs = [216, 282, 348];
  const shadow = `${prefix}-knowledge-shadow`;
  const glass = `${prefix}-knowledge-glass`;

  return <g data-knowledge-visual="true" fontFamily="var(--font-sans), sans-serif">
    <defs>
      <filter id={shadow} x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#4b659a" floodOpacity=".14"/></filter>
      <linearGradient id={glass} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset=".48" stopColor="#f5f8ff"/><stop offset="1" stopColor="#e4edff"/></linearGradient>
    </defs>

    {/* 原始资料一直存在，进入索引和任务的都是副本。 */}
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(38 ${sourceYs[i]})`} filter={`url(#${shadow})`}>
      <rect x="5" y="6" width="142" height="92" rx="10" fill="#e0e9fa" stroke="#cddaf1"/>
      <SourcePage title={names[i]} number={i + 1}/>
    </g>)}
    <text x="40" y="62" className="knowledge-action-label" fill="#607292" fontSize="15">{zh ? "来源" : "Sources"}</text>

    <g fill="none" stroke={EDGE} strokeWidth="1.3">
      <path d="M180 129C199 129 195 241 220 241"/>
      <path d="M180 257C198 257 198 307 220 307"/>
      <path d="M180 385C200 385 199 373 220 373"/>
    </g>

    {/* 偏移底板、索引脊和固定标题形成资料库，不依赖书页轮廓。 */}
    <path d="M220 115h48l13 13h135q17 0 17 17v269q0 17-17 17H230q-15 0-15-15V130q0-15 5-15Z" fill="#d3e0fa" stroke="#b7c9eb"/>
    <path d="M426 151v246M429 152v245" stroke="#edf3ff" strokeWidth="1.2"/>
    <rect x="205" y="119" width="218" height="302" rx="15" fill={`url(#${glass})`} stroke={EDGE} filter={`url(#${shadow})`}/>
    <rect x="210" y="125" width="207" height="290" rx="11" stroke="#fff" strokeWidth="1.2"/>
    <rect x="205" y="140" width="5" height="258" rx="2.5" fill="#90abef"/>
    <path d="M207 159v27M207 200v27M207 241v27" stroke="#dce6ff" strokeWidth="2" strokeLinecap="round"/>
    <g transform="translate(224 140)" stroke={BLUE} strokeWidth="1.6" fill="none">
      <rect width="25" height="29" rx="4"/><path d="M7 8h12M7 14h12M7 20h8"/>
    </g>
    <text x="260" y="155" className="knowledge-title-label" fill={INK} fontSize={zh ? "24" : "21"} fontWeight="600">{zh ? "知识库" : "Knowledge"}</text>
    <text x="224" y="190" className="knowledge-secondary-label" fill="#607292" fontSize="14">{zh ? "有来源 · 可检索" : "Sourced · Searchable"}</text>
    <path d="M224 202h180" stroke={EDGE}/>
    {[0, 1, 2].map((i) => <g key={i} data-motion={`kb-row-${i}`} transform={`translate(220 ${rowYs[i]})`}>
      <rect width="188" height="52" rx="8" fill={i === 0 ? "#eaf0ff" : "#fff"} stroke={i === 0 ? "#a7bafa" : EDGE}/>
      <path d="M12 14h13v18H12zM15 19h7m-7 5h7" stroke={i === 0 ? BLUE : "#8295b5"} strokeWidth="1.2"/>
      <text x="35" y="23" className="knowledge-item-label" fill={INK} fontSize="16" fontWeight="500">{names[i]}</text>
      <path d="M35 36h93" stroke="#c5d2e9" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="178" y="32" textAnchor="end" className="knowledge-source-label" fill={SOURCE} fontSize="14">[{i + 1}]</text>
    </g>)}
    <rect data-motion="kb-hit" x="220" y="216" width="188" height="52" rx="8" fill="none" stroke={BLUE} strokeWidth="1.8"/>

    {/* 任务与引用内容是同一个工作面，检索后直接获得有来源的实际片段。 */}
    <g filter={`url(#${shadow})`}>
      <rect x="460" y="184" width="148" height="250" rx="14" fill="#e0e9fa" stroke="#cddaf1"/>
      <rect x="456" y="178" width="148" height="250" rx="14" fill="#fff" stroke={EDGE}/>
      <path d="M471 181h118" stroke="#f2f6ff" strokeWidth="2"/>
      <path d="M456 232h148" stroke={EDGE}/>
    </g>
    <g transform="translate(472 194)" stroke={BLUE} strokeWidth="1.4"><circle cx="8" cy="8" r="7"/><path d="m13 13 6 6"/></g>
    <text x="498" y="212" className="knowledge-title-label" fill={INK} fontSize="20" fontWeight="500">{zh ? "任务" : "Task"}</text>
    <text x="471" y="256" className="knowledge-action-label" fill="#607292" fontSize="15">{zh ? "检索" : "Retrieve"}</text>
    <path data-motion="kb-query-line" d="M470 242C448 215 434 216 408 242" pathLength="100" stroke={BLUE} strokeWidth="1.5" fill="none"/>
    <g data-motion="kb-query" opacity="0"><circle r="7" fill="#fff" stroke={BLUE} strokeWidth="1.5"/><path d="m5 5 5 5" stroke={BLUE} strokeWidth="1.5"/></g>

    <g data-motion="kb-excerpt">
      <rect x="468" y="272" width="124" height="113" rx="8" fill="#f4f7ff" stroke="#c9d7f5"/>
      <text x="479" y="295" className="knowledge-excerpt-label" fill={INK} fontSize="15" fontWeight="500">{zh ? "项目约定" : "Rules"}</text>
      <text data-motion="kb-result-line-0" x="479" y="320" className="knowledge-excerpt-label" fill="#4c6085" fontSize="14">{zh ? "先审查变更" : "Review"}</text>
      <text data-motion="kb-result-line-1" x="479" y="343" className="knowledge-excerpt-label" fill="#4c6085" fontSize="14">{zh ? "再测试交付" : "Test & ship"}</text>
      <g data-motion="kb-result-line-2"><circle cx="482" cy="365" r="3" fill={SOURCE}/><text x="493" y="372" className="knowledge-source-label" fill="#65789b" fontSize="14">{zh ? "来源 [1]" : "[1]"}</text></g>
    </g>
    <g data-motion="kb-complete" transform="translate(474 405)"><path d="m0-3 4 4 8-9" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><text x="20" y="2" className="knowledge-action-label" fill="#4c6085" fontSize="14">{zh ? "带来源" : "Cited"}</text></g>

    {/* 资料入库副本缩小成为索引；查询返回另一份副本，原件从不移动。 */}
    {[0, 1, 2].map((i) => <g key={i} data-motion={`kb-ingest-${i}`} opacity="0" transform={`translate(38 ${sourceYs[i]})`}><SourcePage title={names[i]} number={i + 1}/></g>)}
    <g data-motion="kb-citation-copy" opacity="0" transform="translate(38 83)"><SourcePage title={names[0]} number={1}/></g>
  </g>;
}

const ease = (value: number) => { const p = Math.max(0, Math.min(1, value)); return p * p * (3 - 2 * p); };
const phase = (t: number, start: number, end: number) => ease((t - start) / (end - start));

/** 从所在 SVG 缓存本幕元素；外部给定 0–12 秒，任意暂停、倒回均得到确定画面。 */
export function createKnowledgePainter(svg: SVGSVGElement, locale: Locale): (seconds: number) => void {
  const parts = new Map(Array.from(svg.querySelectorAll<SVGElement>('[data-motion^="kb-"]')).map((element) => [element.dataset.motion!, element]));
  const caption = svg.querySelector<SVGElement>('[data-motion="caption"]');
  const set = (name: string, attribute: string, value: number | string) => parts.get(name)?.setAttribute(attribute, String(value));
  const opacity = (name: string, value: number) => set(name, "opacity", Math.max(0, Math.min(1, value)).toFixed(3));
  return (seconds: number) => {
    const t = Math.max(0, Math.min(12, seconds));
    const sourceYs = [83, 211, 339];
    for (let i = 0; i < 3; i++) {
      const start = .2 + i * .8;
      const p = phase(t, start, start + 1.65);
      const x = 38 + (229 - 38) * p;
      const y = sourceYs[i] + (229 + i * 66 - sourceYs[i]) * p - Math.sin(p * Math.PI) * 14;
      set(`kb-ingest-${i}`, "transform", `translate(${x} ${y}) scale(${1 - .78 * p})`);
      opacity(`kb-ingest-${i}`, phase(t, start, start + .2) * (1 - phase(t, start + 1.35, start + 1.7)));
      opacity(`kb-row-${i}`, phase(t, start + 1.2, start + 1.8));
    }
    const query = phase(t, 4.4, 5.5);
    set("kb-query-line", "stroke-dasharray", `${query * 100} 100`);
    // 与可见查询曲线使用同一组控制点，命中精确落在第一索引行。
    const q = 1 - query;
    const x = q*q*q*470 + 3*q*q*query*448 + 3*q*query*query*434 + query*query*query*408;
    const y = q*q*q*242 + 3*q*q*query*215 + 3*q*query*query*216 + query*query*query*242;
    set("kb-query", "transform", `translate(${x} ${y})`);
    opacity("kb-query", phase(t, 4.25, 4.5) * (1 - phase(t, 5.5, 5.8)));
    opacity("kb-hit", phase(t, 5.35, 5.9));

    const copy = phase(t, 6.2, 8.4);
    // 检索返回从命中的索引行出发；紧凑副本沿工作区移动，避开固定库标题。
    set("kb-citation-copy", "transform", `translate(${238 + 232 * copy} ${216 + 58 * copy + Math.sin(copy * Math.PI) * 17}) scale(${.68 + .17 * copy})`);
    opacity("kb-citation-copy", phase(t, 6.1, 6.4) * (1 - phase(t, 8.2, 8.6)));
    opacity("kb-excerpt", phase(t, 8.3, 8.65));
    for (let i = 0; i < 3; i++) {
      opacity(`kb-result-line-${i}`, phase(t, 8.65 + i * .5, 9.05 + i * .5));
      set(`kb-result-line-${i}`, "transform", `translate(0 ${(1 - phase(t, 8.65 + i * .5, 9.05 + i * .5)) * 4})`);
    }
    opacity("kb-complete", phase(t, 10.2, 10.7));
    if (caption) {
      const phrases = locale === "zh"
        ? [[0, "保留来源，组织知识"], [4.4, "检索命中相关资料"], [6.2, "复制片段，原始资料保留"], [8.5, "带着来源，回到工作"]] as const
        : [[0, "Keep sources. Organize knowledge."], [4.4, "Retrieve the relevant source"], [6.2, "Copy the passage. Keep the source."], [8.5, "Bring cited knowledge into work"]] as const;
      caption.textContent = (phrases.findLast(([at]) => t >= at) ?? phrases[0])[1];
    }
  };
}
