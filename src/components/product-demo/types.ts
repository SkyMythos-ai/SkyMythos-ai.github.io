export type ProductDemoKind = "employees" | "agent-setup" | "knowledge";
export type BilingualCopy = { zh: string; en: string };

/** 坐标相对真实截图，以 0–1 表示；焦点不改变截图中的产品内容。 */
export interface ProductDemoFrame {
  id: string;
  src: string;
  width: number;
  height: number;
  title: BilingualCopy;
  detail: BilingualCopy;
  focus: readonly [x: number, y: number, width: number, height: number];
  mobileFocus?: readonly [x: number, y: number, width: number, height: number];
  cursor?: readonly [x: number, y: number];
  durationMs: number;
}

export interface ProductDemoStory {
  title: BilingualCopy;
  frames: readonly ProductDemoFrame[];
  poster: number;
}
