import type { Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import { ScreenshotZoom } from "@/components/screenshot-zoom";

const dimensions = {
  "keynote-order-delivery": [3200, 1800],
  "keynote-order-execution": [3200, 1800],
  "formation-plan": [1440, 960],
} as const;

/** 响应式预览可取景到交付重点；原图链接与弹窗始终引用未经修改的完整截图。 */
export function ProductMedia({ image, locale, alt, caption, priority = false, focused = false }: {
  image: keyof typeof dimensions; locale: Locale; alt: string; caption: string; priority?: boolean; focused?: boolean;
}) {
  const [width, height] = dimensions[image];
  const preview = focused && image !== "formation-plan" ? `${image}-focus` : image;
  const largeWidth = focused ? 1600 : Math.min(width, 1600);
  return <ScreenshotZoom src={`${basePath}/images/product/${image}.png`} locale={locale} alt={alt} caption={caption} width={width} height={height} media={
    <img src={`${basePath}/images/product/previews/${preview}-1600.webp`} srcSet={`${basePath}/images/product/previews/${preview}-960.webp 960w, ${basePath}/images/product/previews/${preview}-1600.webp ${largeWidth}w`} sizes={priority ? "(max-width: 767px) calc(100vw - 48px), 50vw" : "(max-width: 767px) calc(100vw - 48px), 90vw"} width={width} height={height} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async"/>
  }/>;
}
