import Image from "next/image";
import { basePath } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Wordmark({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "large";
}) {
  return (
    <span className={cn("inline-flex shrink-0 items-center align-middle", size === "large" ? "h-9 w-52" : "h-7 w-36 lg:w-44", className)}>
      <span aria-hidden="true" className="brand-logo-light h-full w-full items-center gap-2">
        <Image src={`${basePath}/brand/logo-mark.svg`} alt="" width={256} height={306} loading="eager" className="h-full w-auto shrink-0" />
        <Image src={`${basePath}/brand/logo-wordmark.svg`} alt="" width={906} height={154} loading="eager" className="legacy-wordmark-light h-auto min-w-0 flex-1" />
        <Image src={`${basePath}/brand/logo-wordmark-dark.svg`} alt="" width={906} height={154} loading="eager" className="legacy-wordmark-dark h-auto min-w-0 flex-1" />
      </span>
      <span className="sr-only">SkyMythos.ai</span>
    </span>
  );
}
