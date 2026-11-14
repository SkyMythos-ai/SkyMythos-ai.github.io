const upper = "M202 1Q211 -3 211 8V56Q211 61 206 64L60 128L104 148Q108 150 108 154V197Q108 204 101 201L5 158Q0 156 0 150V99Q0 93 7 90Z";
const lower = "M165 106L249 147Q255 149 255 156V207Q255 212 249 215L46 304Q35 309 35 297V250Q35 244 42 241L202 175L161 156Q157 155 157 150V110Q157 102 165 106Z";
export const companionBodyPath = "M22 9 L59 4 Q70 2 68 14 L64 44 Q63 52 54 54 L39 57 L24 67 Q19 69 21 63 L23 57 L16 58 Q6 59 8 48 L12 21 Q13 11 22 9 Z";
export const brandPaths = [upper, lower] as const;

type Point = { x: number; y: number };
type Pair = { from: Point[]; to: Point[] };
let cached: Pair[] | undefined;

function samplePath(d: string, count: number): Point[] {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  const length = path.getTotalLength();
  return Array.from({ length: count }, (_, index) => {
    const point = path.getPointAtLength(length * index / count);
    return { x: point.x, y: point.y };
  });
}

function clipY(points: Point[], boundary: number, upperHalf: boolean): Point[] {
  const inside = (point: Point) => upperHalf ? point.y <= boundary : point.y >= boundary;
  const result: Point[] = [];
  for (let index = 0; index < points.length; index++) {
    const a = points[index];
    const b = points[(index + 1) % points.length];
    if (inside(a)) result.push(a);
    if (inside(a) !== inside(b)) {
      const t = (boundary - a.y) / (b.y - a.y);
      result.push({ x: a.x + (b.x - a.x) * t, y: boundary });
    }
  }
  return result;
}

function resample(points: Point[], count: number): Point[] {
  const lengths = points.map((point, index) => {
    const next = points[(index + 1) % points.length];
    return Math.hypot(next.x - point.x, next.y - point.y);
  });
  const perimeter = lengths.reduce((sum, length) => sum + length, 0);
  return Array.from({ length: count }, (_, index) => {
    let distance = perimeter * index / count;
    let segment = 0;
    while (segment < lengths.length - 1 && distance > lengths[segment]) distance -= lengths[segment++];
    const a = points[segment];
    const b = points[(segment + 1) % points.length];
    const t = lengths[segment] ? distance / lengths[segment] : 0;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  });
}

function signedArea(points: Point[]): number {
  return points.reduce((area, point, index) => {
    const next = points[(index + 1) % points.length];
    return area + point.x * next.y - next.x * point.y;
  }, 0);
}

function align(from: Point[], target: Point[]): Point[] {
  const to = Math.sign(signedArea(from)) === Math.sign(signedArea(target)) ? target : [...target].reverse();
  let bestOffset = 0;
  let bestScore = Infinity;
  for (let offset = 0; offset < to.length; offset++) {
    let score = 0;
    for (let i = 0; i < from.length; i++) {
      const point = to[(i + offset) % to.length];
      score += (from[i].x - point.x) ** 2 + (from[i].y - point.y) ** 2;
    }
    if (score < bestScore) { bestScore = score; bestOffset = offset; }
  }
  return to.map((_, index) => to[(index + bestOffset) % to.length]);
}

function geometry(): Pair[] {
  if (cached) return cached;
  const body = samplePath(companionBodyPath, 192);
  cached = brandPaths.map((path, index) => {
    const from = samplePath(path, 96);
    const half = clipY(body, index === 0 ? 34 : 33, index === 0).map(point => ({ x: point.x * 3.2, y: point.y * 4.25 }));
    return { from, to: align(from, resample(half, 96)) };
  });
  return cached;
}

export function setCompanionBrandProgress(svg: SVGSVGElement, progress: number): void {
  const value = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const key = value.toFixed(4);
  if (svg.dataset.brandProgress === key) return;
  const paths = [svg.querySelector<SVGPathElement>("[data-brand-upper]"), svg.querySelector<SVGPathElement>("[data-brand-lower]")];
  if (!paths[0] || !paths[1]) return;
  if (value <= .001) {
    paths.forEach((path, index) => path?.setAttribute("d", brandPaths[index]));
  } else {
    geometry().forEach(({ from, to }, index) => {
      const t = value >= .999 ? 1 : value;
      const points = from.map((point, i) => `${(point.x + (to[i].x - point.x) * t).toFixed(2)} ${(point.y + (to[i].y - point.y) * t).toFixed(2)}`);
      paths[index]?.setAttribute("d", `M${points.join("L")}Z`);
    });
  }
  svg.style.setProperty("--brand-morph", String(value));
  svg.dataset.brandProgress = key;
}
