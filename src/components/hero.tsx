import type { Locale } from "@/lib/i18n";
import { HeroStage } from "@/components/hero-stage";

export function Hero({ locale }: { locale: Locale }) {
  return <HeroStage locale={locale} />;
}
