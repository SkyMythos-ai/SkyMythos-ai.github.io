import Image, { type ImageProps } from "next/image";
import assetDimensions from "./asset-dimensions.json";

type AssetImageProps = Omit<ImageProps, "src" | "width" | "height"> & {
  src: string;
};
const dimensions: Record<string, number[]> = assetDimensions;

/** 使用原站素材的真实尺寸；保留已优化 SVG、AVIF 和 PNG，不重复转换。 */
export function AssetImage({ src, alt, ...props }: AssetImageProps) {
  const [width, height] = dimensions[src] || [16, 16];
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      {...props}
    />
  );
}
