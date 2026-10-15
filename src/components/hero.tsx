import type { Locale } from "@/lib/i18n";
import { HeroStage } from "@/components/hero-stage";
import { EmployeeScene } from "@/components/employee-scene";
import { getEmployeeStory } from "@/content/employee-story";

export function Hero({ locale }: { locale: Locale }) {
  return <HeroStage locale={locale} visuals={getEmployeeStory(locale).map(scene => <EmployeeScene key={scene.id} scene={scene.id} locale={locale}/>)} />;
}
