import { EMPLOYEE_SCENE_DURATION, type EmployeeScene } from "@/content/employee-story";

type Point = readonly [number, number];

type Parts = Record<string, SVGElement>;

type Attributes = Record<string, number | string>;

function sceneParts(svg: SVGSVGElement, prefix: string): Parts {
  return Object.fromEntries(Array.from(svg.querySelectorAll<SVGElement>("[data-part]"))
    .filter((element) => element.dataset.part?.startsWith(prefix))
    .map((element) => [element.dataset.part!.slice(prefix.length), element]));
}

/** 按确认稿分镜计算，不累计位置；暂停或倒回仍得到相同画面。 */
function createIdentityPainter(svg: SVGSVGElement): (seconds: number) => void {
  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  const curve = (value: number) => {
    const x = clamp(value);
    if (x === 0 || x === 1)
      return x;
    let low = 0;
    let high = 1;
    let u = x;
    for (let index = 0; index < 12; index += 1) {
      u = (low + high) / 2;
      const inverse = 1 - u;
      const estimate = 3 * inverse * inverse * u * 0.22 + 3 * inverse * u * u * 0.36 + u * u * u;
      if (estimate < x)
        low = u;
      else
        high = u;
    }
    return 1 - Math.pow(1 - u, 3);
  };
  const progress = (time: number, start: number, end: number) => curve((time - start) / (end - start));
  const interpolate = (from: number, to: number, amount: number) => from + (to - from) * amount;
  const parts = sceneParts(svg, "identity-");
  return (rawTime: number) => {
    const time = Math.max(0, Math.min(12, Number(rawTime) || 0));
    const set = (name: string, attributes: Attributes) => {
      const element = parts[name];
      if (!element)
        return;
      Object.keys(attributes).forEach((attribute) => element.setAttribute(attribute, String(attributes[attribute])));
    };
    const move = (name: string, x: number, y: number, opacity: number, scale = 1) => set(name, { transform: `translate(${x.toFixed(3)} ${y.toFixed(3)}) scale(${scale.toFixed(4)})`, opacity: clamp(opacity).toFixed(4) });
    const firstInput = progress(time, 0.95, 2.2);
    const secondInput = progress(time, 9.05, 10.2);
    const feed = time < 6 ? firstInput : secondInput;
    const feedVisible = time < 6
      ? progress(time, 0.8, 1.12) * (1 - progress(time, 1.9, 2.24))
      : progress(time, 8.95, 9.2) * (1 - progress(time, 9.85, 10.22));
    move('input', interpolate(141, 263, feed), interpolate(166, 234, feed), feedVisible, interpolate(1, 0.7, feed));
    move('task-one', 106, interpolate(153, 137, progress(time, 0, 0.8)), progress(time, 0, 0.65) * (1 - progress(time, 4.9, 5.55)));
    move('task-two', 106, interpolate(150, 137, progress(time, 7.95, 8.6)), progress(time, 7.95, 8.55));
    const processing = progress(time, 1.8, 2.35) * (1 - progress(time, 4.45, 5.1));
    const reusedProcessing = progress(time, 9.05, 9.65);
    set('process', { opacity: Math.max(processing, reusedProcessing) });
    const resultTravel = progress(time, 2.35, 3.3);
    const feedbackReturn = progress(time, 4.95, 5.65);
    move('feedback', interpolate(interpolate(389, 509, resultTravel), 407, feedbackReturn), interpolate(interpolate(253, 160, resultTravel), 278, feedbackReturn), progress(time, 2.35, 2.75) * (1 - progress(time, 5.45, 5.85)), interpolate(interpolate(0.68, 1, resultTravel), 0.5, feedbackReturn));
    const verified = progress(time, 3.2, 3.7) * (1 - progress(time, 4.85, 5.25));
    const reusedVerified = progress(time, 10.05, 10.65);
    move('verify', 509, 160, Math.max(verified, reusedVerified));
    const clampMotion = progress(time, 3.4, 4.35);
    set('verify-left', { transform: `translate(${interpolate(-14, 0, clampMotion)} ${interpolate(-8, 0, clampMotion)})` });
    set('verify-right', { transform: `translate(${interpolate(14, 0, clampMotion)} ${interpolate(8, 0, clampMotion)})` });
    set('check', { transform: `translate(25 47) scale(${interpolate(0.65, 1, progress(time, 3.8, 4.45))})`, opacity: Math.max(progress(time, 3.8, 4.15), reusedVerified) });
    const finalOutputTravel = progress(time, 9.9, 10.75);
    move('result', interpolate(389, 509, finalOutputTravel), interpolate(253, 160, finalOutputTravel), progress(time, 9.9, 10.3), interpolate(0.68, 1, finalOutputTravel));
    const memoryIn = progress(time, 5.2, 6.25);
    move('memory', 148, interpolate(428, 414, memoryIn), progress(time, 5.1, 5.75));
    for (let index = 0; index < 3; index += 1) {
      const formed = progress(time, 5.55 + index * 0.3, 6.85 + index * 0.25);
      const finalY = 6 - index * 13;
      move(`record-${index}`, interpolate(259, 0, formed), interpolate(-136, finalY, formed), progress(time, 5.55 + index * 0.3, 6.1 + index * 0.3), 1);
    }
    set('memory-label', { opacity: progress(time, 5.75, 6.4), transform: `translate(0 ${interpolate(9, 0, progress(time, 5.75, 6.45))})` });
    const skillIn = progress(time, 5.5, 6.45);
    move('skill', 493, interpolate(427, 412, skillIn), progress(time, 5.35, 5.95));
    const leftJoin = progress(time, 5.85, 7.0);
    move('skill-left', interpolate(-86, 0, leftJoin), interpolate(-134, 0, leftJoin), progress(time, 5.85, 6.3));
    const rightJoin = progress(time, 6.15, 7.25);
    move('skill-right', interpolate(-86, 0, rightJoin), interpolate(-134, 0, rightJoin), progress(time, 6.15, 6.6));
    const insert = progress(time, 6.65, 7.75);
    move('skill-insert', 0, interpolate(-29, 0, insert), progress(time, 6.6, 7.15));
    set('skill-label', { opacity: progress(time, 6.0, 6.65), transform: `translate(0 ${interpolate(9, 0, progress(time, 6.0, 6.7))})` });
    const memoryCall = progress(time, 8.15, 9.25);
    const skillCall = progress(time, 8.5, 9.55);
    move('memory-call', interpolate(148, 233, memoryCall), interpolate(386, 276, memoryCall), progress(time, 8.1, 8.4) * (1 - progress(time, 9.03, 9.38)), interpolate(0.85, 0.7, memoryCall));
    move('skill-call', interpolate(493, 410, skillCall), interpolate(390, 276, skillCall), progress(time, 8.45, 8.75) * (1 - progress(time, 9.33, 9.68)), interpolate(0.85, 0.7, skillCall));
    move('memory-dock', -87, 30, progress(time, 8.95, 9.35));
    move('skill-dock', 89, 30, progress(time, 9.25, 9.65));
    svg.setAttribute('data-phase', time < 2 ? 'identity' : time < 5 ? 'verify' : time < 8 ? 'retain' : time < 10.5 ? 'reuse' : 'result');
    svg.setAttribute('data-time', time.toFixed(3));
  };
}

/** 按确认稿分镜计算，不累计位置；暂停或倒回仍得到相同画面。 */
function createCollaborationPainter(svg: SVGSVGElement): (seconds: number) => void {
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const round = (n: number) => Number(n.toFixed(4));
  const blend = (a: number, b: number, u: number) => a + (b - a) * u;
  // cubic-bezier(.22,.8,.2,1)，任意时间点均可重建，无独立时钟。
  function ease(u: number) {
    u = clamp(u);
    if (u === 0 || u === 1)
      return u;
    let lo = 0, hi = 1, v = u;
    for (let i = 0; i < 11; i++) {
      v = (lo + hi) / 2;
      const x = 3 * (1 - v) * (1 - v) * v * .22 + 3 * (1 - v) * v * v * .2 + v * v * v;
      if (x < u)
        lo = v;
      else
        hi = v;
    }
    return 3 * (1 - v) * (1 - v) * v * .8 + 3 * (1 - v) * v * v + v * v * v;
  }
  const progress = (t: number, start: number, duration: number) => ease((t - start) / duration);
  const windowAlpha = (t: number, start: number, end: number, fade = .26) => progress(t, start, fade) * (1 - progress(t, end - fade, fade));
  const parts = sceneParts(svg, "collab-");
  return (time: number) => {
    const t = Math.max(0, Math.min(12, Number(time) || 0));
    const set = (name: string, opacity: number, transform?: string) => {
      const node = parts[name];
      if (!node)
        return;
      node.setAttribute('opacity', String(round(opacity)));
      if (transform !== undefined)
        node.setAttribute('transform', transform);
    };
    const arrive = (name: string, start: number, duration: number, dx = 0, dy = 10) => {
      const u = progress(t, start, duration);
      set(name, u, `translate(${round(dx * (1 - u))} ${round(dy * (1 - u))})`);
    };
    const token = (name: string, start: number, duration: number, route: (u: number) => Point) => {
      const u = progress(t, start, duration);
      const xy = route(u);
      set(name, windowAlpha(t, start, start + duration, .17), `translate(${round(xy[0])} ${round(xy[1])})`);
    };
    const bezier = (a: Point, b: Point, c: Point, d: Point, u: number) => {
      const v = 1 - u;
      const coordinate = (i: 0 | 1) => v * v * v * a[i] + 3 * v * v * u * b[i] + 3 * v * u * u * c[i] + u * u * u * d[i];
      return [coordinate(0), coordinate(1)] as const;
    };
    svg.dataset.time = String(round(t));
    svg.dataset.phase = t < 2 ? 'goal' : t < 5 ? 'parallel' : t < 8 ? 'checks' : t < 10.5 ? 'integrate' : 'delivered';
    // 主体始终在场；不同工作内容按真实交接顺序形成。
    ['plan-unit', 'code-unit', 'review-unit', 'test-unit', 'hub'].forEach(name => set(name, 1));
    set('goal', 1 - .34 * progress(t, 1.1, .7), `translate(0 ${round(-3 * progress(t, 1.1, .7))})`);
    token('goal-token', .35, 1.35, u => [320, blend(78, 227, u)]);
    token('plan-token', 1.8, .9, u => bezier([249, 235], [225, 235], [240, 161], [210, 161], u));
    token('code-token', 1.85, .95, u => bezier([391, 235], [421, 235], [407, 171], [430, 171], u));
    set('route-plan', .72 * windowAlpha(t, 1.8, 5.0, .6));
    set('route-code', .72 * windowAlpha(t, 1.85, 5.0, .6));
    arrive('plan-root', 2.3, .8, -5, 7);
    arrive('plan-a', 2.75, .65, 0, 8);
    arrive('plan-b', 3.02, .65, 0, 8);
    arrive('plan-c', 3.29, .65, 0, 8);
    // 保留状态标记的绝对落位，避免父组坐标与动画坐标耦合。
    const planReady = progress(t, 4.1, .6);
    set('plan-ready', planReady, `translate(203 ${round(196 + 6 * (1 - planReady))})`);
    arrive('code-line-1', 2.5, .7, 8, 0);
    arrive('code-line-2', 2.9, .7, 8, 0);
    arrive('code-line-3', 3.3, .7, 8, 0);
    const codeReady = progress(t, 4.15, .6);
    set('code-ready', codeReady, `translate(582 ${round(216 + 4 * (1 - codeReady))})`);
    // 方案进入审查，代码进入验证；四角各司其职，非同一动画复制。
    token('review-token', 4.95, 1.15, u => bezier([108, 211], [30, 255], [36, 319], [80, 382], u));
    token('test-token', 5.05, 1.1, u => bezier([529, 227], [607, 260], [607, 329], [562, 380], u));
    arrive('review-source', 5.9, .6, -7, 0);
    arrive('review-diff', 6.4, .7, 7, 0);
    const reviewPass = progress(t, 7.1, .6);
    set('review-pass', reviewPass, `translate(192 ${round(430 + 5 * (1 - reviewPass))})`);
    for (let i = 1; i <= 3; i++) {
      const u = progress(t, 5.95 + (i - 1) * .42, .9);
      set('test-bar-' + i, u, `translate(445 0) scale(${round(u)} 1) translate(-445 0)`);
    }
    const testPass = progress(t, 7.25, .55);
    set('test-pass', testPass, `translate(580 ${round(425 + 4 * (1 - testPass))})`);
    token('return-review', 8, 1.0, u => bezier([216, 398], [243, 398], [223, 287], [249, 287], u));
    token('return-test', 8.15, 1.0, u => bezier([429, 395], [398, 395], [415, 287], [391, 287], u));
    set('route-review', .72 * windowAlpha(t, 7.8, 9.4, .45));
    set('route-test', .72 * windowAlpha(t, 7.95, 9.55, .45));
    arrive('output', 8.7, .9, 0, -14);
    arrive('output-plan', 8.9, .65, -10, 0);
    arrive('output-code', 9.08, .65, 10, 0);
    arrive('output-review', 9.37, .65, -7, 7);
    arrive('output-test', 9.57, .65, 7, 7);
    arrive('output-caption', 10.0, .7, 0, 8);
  };
}

/** 按确认稿分镜计算，不累计位置；暂停或倒回仍得到相同画面。 */
function createKnowledgePainter(svg: SVGSVGElement): (seconds: number) => void {
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const progress = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
  // 按时间求解 cubic-bezier(.32,.72,0,1)，与帧数无关。
  function ease(value: number) {
    const x = clamp(value);
    if (x === 0 || x === 1)
      return x;
    const bezier = (s: number, a: number, b: number) => 3 * (1 - s) * (1 - s) * s * a + 3 * (1 - s) * s * s * b + s * s * s;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 14; i += 1) {
      const mid = (lo + hi) / 2;
      if (bezier(mid, .32, 0) < x)
        lo = mid;
      else
        hi = mid;
    }
    return bezier((lo + hi) / 2, .72, 1);
  }
  const between = (a: number, b: number, n: number) => a + (b - a) * n;
  const parts = sceneParts(svg, "");
  return (rawTime: number) => {
    const t = Math.max(0, Math.min(12, Number(rawTime) || 0));
    const set = (key: string, transform: string | null, opacity: number | null) => {
      const node = parts[key];
      if (!node)
        return;
      if (transform != null)
        node.setAttribute('transform', transform);
      if (opacity != null)
        node.setAttribute('opacity', String(opacity));
    };
    const organized = ease(progress(t, 0, 3));
    set('index', `translate(290 ${between(136, 128, organized)})`, 1);
    ([['practice', 96, .35], ['decisions', 66, .15], ['docs', 36, 0]] as const).forEach(([key, y, delay]) => {
      const settle = ease(progress(t, delay, 2.9));
      set(`layer-${key}`, `translate(0 ${y + 12 * (1 - settle)})`, .65 + .35 * settle);
    });
    ([
      ['docs', 119, 96, 392, 221, .25, 1.9],
      ['decisions', 171, 224, 414, 251, .7, 2.35],
      ['practice', 122, 351, 419, 293, 1.05, 2.85],
    ] as const).forEach(([key, sx, sy, ex, ey, start, end]) => {
      const n = ease(progress(t, start, end));
      const alpha = ease(progress(t, start, start + .25)) * (1 - ease(progress(t, end - .2, end + .2)));
      const x = between(sx, ex, n);
      const y = between(sy, ey, n) - 21 * Math.sin(Math.PI * n);
      set(`packet-${key}`, `translate(${x} ${y}) scale(${between(1, .86, n)})`, alpha);
    });
    const queryUp = ease(progress(t, 3.05, 4.65));
    const scan = ease(progress(t, 4.65, 5.55));
    const qx = between(329, 379, queryUp) + 24 * scan;
    const qy = between(446, 239, queryUp) + 10 * scan;
    const queryAlpha = ease(progress(t, 3.02, 3.3)) * (1 - ease(progress(t, 5.65, 6.05)));
    set('query', `translate(${qx} ${qy})`, queryAlpha);
    const hit = ease(progress(t, 4.6, 5.65));
    set('selected', `translate(426 ${between(269, 261, hit)})`, hit);
    const copy = ease(progress(t, 6.1, 8.9));
    const copyX = between(405, 517, copy) + 38 * Math.sin(Math.PI * copy);
    const copyY = between(250, 489, copy);
    const copyScale = between(1.03, 1, copy);
    set('citation', `translate(${copyX} ${copyY}) scale(${copyScale})`, ease(progress(t, 6.05, 6.35)));
    const answer = ease(progress(t, 9, 10.45));
    set('answer', `translate(23 ${between(8, 0, answer)})`, answer);
    svg.dataset.phase = t < 3 ? 'index' : t < 6 ? 'retrieve' : t < 9 ? 'copy-citation' : t < 10.5 ? 'compose' : 'hold';
  };
}

/** 全部动作只读取 HeroStage 给定的秒数，更新 transform、opacity 和 data。 */
export function createEmblemPainter(svg: SVGSVGElement, scene: EmployeeScene["id"]): (seconds: number) => void {
  const paint = scene === "identity" ? createIdentityPainter(svg)
    : scene === "collaboration" ? createCollaborationPainter(svg)
      : createKnowledgePainter(svg);
  return (seconds: number) => {
    const time = Math.max(0, Math.min(EMPLOYEE_SCENE_DURATION / 1000, Number(seconds) || 0));
    paint(time);
    svg.dataset.time = time.toFixed(3);
  };
}
