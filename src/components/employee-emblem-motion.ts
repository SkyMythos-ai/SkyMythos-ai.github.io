import type { Locale } from "@/lib/i18n";
import { EMPLOYEE_SCENE_DURATION, type EmployeeScene } from "@/content/employee-story";
import { createKnowledgePainter } from "@/components/employee-knowledge-visual";

type Point = [number, number];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const progress = (t: number, start: number, end: number) => { const p = clamp((t-start)/(end-start)); return p*p*(3-2*p); };
const during = (t: number, start: number, end: number) => progress(t,start,start+.2)*(1-progress(t,end-.2,end));
function curve(points: [Point, Point, Point, Point], p: number): Point {
  const q=1-p, [a,b,c,d]=points;
  return [q*q*q*a[0]+3*q*q*p*b[0]+3*q*p*p*c[0]+p*p*p*d[0],q*q*q*a[1]+3*q*q*p*b[1]+3*q*p*p*c[1]+p*p*p*d[1]];
}

/** 唯一外部时钟驱动确定性分镜；图形内容的形成与复用就是动作本身。 */
export function createEmblemPainter(svg: SVGSVGElement, scene: EmployeeScene["id"], locale: Locale) {
  const parts = new Map(Array.from(svg.querySelectorAll<SVGElement>("[data-motion]")).map(e=>[e.dataset.motion!,e]));
  const attr = (name: string, key: string, value: string | number) => parts.get(name)?.setAttribute(key,String(value));
  const opacity = (name: string, value: number) => attr(name,"opacity",clamp(value).toFixed(3));
  const draw = (name: string, value: number) => attr(name,"stroke-dasharray",`${(clamp(value)*100).toFixed(2)} 100`);
  const move = (name: string, point: Point) => attr(name,"transform",`translate(${point[0].toFixed(2)} ${point[1].toFixed(2)})`);
  function travelling(name: string, t: number, start: number, end: number, points: [Point, Point, Point, Point]) {
    move(name,curve(points,progress(t,start,end)));
    opacity(name,during(t,start-.1,end+.2));
  }
  function caption(t: number, phases: Array<[number,string,string]>) {
    const phase = phases.findLast(([at])=>t>=at) ?? phases[0];
    const element = parts.get("caption");
    const text = phase[locale === "zh" ? 1 : 2];
    if (element && element.textContent !== text) element.textContent=text;
    svg.dataset.stage=String(phase[0]);
  }

  function identity(t: number) {
    travelling("task-first",t,.15,1.7,[[176,282],[202,282],[213,267],[235,267]]);
    travelling("task-next",t,7.6,8.7,[[176,282],[202,282],[213,267],[235,267]]);
    draw("work-thread",progress(t,.15,1.7));
    opacity("identity-response",.1+.6*(during(t,1.3,3.4)+during(t,8.3,10.1)));
    draw("result-thread",progress(t,1.8,2.8));
    const first = progress(t,2.25,3.3);
    const second = 1-progress(t,8.7,9.2)+progress(t,9.3,10.4);
    opacity("result-content",first*second);
    draw("result-check",progress(t,3.1,3.7)*(1-progress(t,8.7,9.2)+progress(t,10.1,10.6)));
    travelling("feedback-evidence",t,3.4,5.4,[[522,265],[578,206],[562,176],[492,179]]);
    draw("feedback-check",progress(t,4.25,4.85));
    draw("memory-thread",progress(t,3.4,5.4));
    opacity("memory-record",progress(t,5.0,5.8));
    draw("learning-loop",progress(t,5.0,6.5));
    opacity("skill-method",progress(t,5.8,6.7));
    draw("skill-function",progress(t,5.8,6.7));
    travelling("memory-reuse",t,7.9,8.8,[[433,189],[409,200],[397,214],[379,231]]);
    travelling("skill-reuse",t,7.9,8.8,[[268,393],[281,369],[280,346],[291,331]]);
    const task=parts.get("task-label");
    if(task) task.textContent=locale === "zh" ? (t>=7.5 ? "下一次任务" : "工作任务") : (t>=7.5 ? "Next task" : "Task");
    caption(t,[[0,"Agent 自主执行任务","The agent gets to work"],[3.4,"工作反馈经过验证","Validate feedback from real work"],[5.8,"沉淀为 Memory 与 Skill","Retain Memory. Form a Skill."],[7.6,"调用经验与方法，再次完成工作","Use experience in the next task"],[10.6,"让经验与方法，参与下一次工作","Bring experience into the next task"]]);
  }

  function collaboration(t: number) {
    travelling("goal-packet",t,0,1.0,[[320,135],[320,169],[320,197],[320,234]]);
    opacity("hub-response",.08+.6*(during(t,.7,2.2)+during(t,8.1,9.7)));
    const routes: Array<[string,number,number,[Point,Point,Point,Point]]> = [
      ["a",.9,2.2,[[253,239],[229,216],[208,191],[171,172]]],
      ["b",1.1,2.4,[[391,239],[426,211],[450,194],[487,180]]],
      ["c",5.4,6.6,[[246,302],[218,347],[173,359],[153,390]]],
      ["d",5.55,6.8,[[392,302],[420,350],[470,362],[488,394]]],
    ];
    for(const [name,start,end,points] of routes) {
      draw(`dispatch-${name}`,progress(t,start,end));
      travelling(`packet-${name}`,t,start,end,points);
      opacity(`status-${name}`,.15+.85*during(t,end-.2,end+2.0));
      draw(`ready-${name}`,progress(t,end+1.1,end+1.5));
    }
    opacity("plan-sheet",progress(t,2.1,2.65));
    opacity("plan-lines",progress(t,2.65,4.15));
    draw("produce-plan",progress(t,2.15,2.8));
    opacity("code-sheet",progress(t,2.3,2.85));
    draw("produce-code",progress(t,2.35,3.0));
    draw("code-glyph",progress(t,2.75,3.8));
    for(let i=0;i<3;i++)draw(`code-line-${i}`,progress(t,3.4+i*.35,4+i*.35));
    draw("return-plan",progress(t,4.3,5.0));
    draw("return-code",progress(t,4.6,5.3));
    travelling("plan-packet",t,4.3,5.0,[[172,272],[185,272],[199,272],[212,272]]);
    travelling("code-packet",t,4.6,5.3,[[470,272],[456,272],[441,272],[428,272]]);
    draw("produce-review",progress(t,6.6,7.25));
    draw("produce-test",progress(t,6.8,7.45));
    opacity("review-note",progress(t,6.25,7.0));
    draw("review-check",progress(t,7.2,7.7));
    opacity("test-note",progress(t,6.55,7.3));
    draw("test-check",progress(t,7.45,8.0));
    travelling("review-packet",t,8.1,8.85,[[262,372],[283,378],[283,390],[294,404]]);
    travelling("test-packet",t,8.3,9.0,[[380,370],[359,379],[357,390],[347,404]]);
    opacity("delivered",progress(t,9.0,9.4));
    draw("deliver-check",progress(t,9.1,9.75));
    caption(t,[[0,"一个目标，交给协作中枢","One goal enters the team"],[1.0,"分发任务，多 Agent 并行工作","Dispatch work to multiple agents"],[2.65,"方案与代码，逐步形成","Plan and code take shape"],[5.4,"交接成果，审查与验证","Hand off, review and verify"],[9.0,"多 Agent 分工，汇成一次交付","Many agents. One shared delivery."]]);
  }

  const knowledge = scene === "experience" ? createKnowledgePainter(svg,locale) : null;
  return (seconds: number) => {
    const time=Math.max(0,Math.min(EMPLOYEE_SCENE_DURATION/1000,seconds));
    svg.dataset.time=time.toFixed(3);
    if(scene === "identity")identity(time);
    else if(scene === "collaboration")collaboration(time);
    else knowledge?.(time);
  };
}
