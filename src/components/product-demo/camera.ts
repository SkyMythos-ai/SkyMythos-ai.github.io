import type { ProductDemoFrame } from "./types";

/** 按真实截图的像素坐标取景，限制在原图之内，不生成或挪动产品控件。 */
export function productDemoCamera(frame: ProductDemoFrame, width: number, height: number, action = false) {
  const [x, y, w, h] = width < 640 && frame.mobileFocus ? frame.mobileFocus : frame.focus;
  const fit = Math.max(width / frame.width, height / frame.height);
  const focus = Math.min(width / (frame.width * w * 1.12), height / (frame.height * h * 1.12));
  const scale = Math.max(fit * (width < 640 ? 2.6 : 1), Math.min(focus, fit * (width < 640 ? 4.2 : 2.8)));
  const clamp = (value: number, size: number, source: number) => Math.min(0, Math.max(size - source * scale, value));
  const point = frame.cursor ?? [x + w / 2, y + h / 2];
  const center = action ? point : [x + w / 2, y + h / 2];
  const left = clamp(width / 2 - center[0] * frame.width * scale, width, frame.width);
  const top = clamp(height / 2 - center[1] * frame.height * scale, height, frame.height);
  return { scale, left, top, cursorX: left + point[0] * frame.width * scale, cursorY: top + point[1] * frame.height * scale };
}
