import Image from "next/image";
import { basePath } from "@/lib/site";
import { cn } from "@/lib/cn";

/** 图标保持官方品牌蓝，字标随页面底色切换，不依赖系统主题。 */
export function Wordmark({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "large";
}) {
  return (
    <span className={cn("inline-flex shrink-0 items-center align-middle", size === "large" ? "h-9 w-52" : "h-7 w-36 lg:w-44", className)}>
      {(["light", "dark"] as const).map((theme) => (
        <span key={theme} aria-hidden="true" className={`brand-logo-${theme} h-full w-full items-center gap-2`}>
          <Image src={`${basePath}/brand/logo-mark.svg`} alt="" width={256} height={306} loading="eager" className="h-full w-auto shrink-0" />
          <Image src={`${basePath}/brand/logo-wordmark${theme === "dark" ? "-dark" : ""}.svg`} alt="" width={906} height={154} loading="eager" className="h-auto min-w-0 flex-1" />
        </span>
      ))}
      <span className="sr-only">SkyMythos.ai</span>
    </span>
  );
}
