import type { Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import { consoleScreens, consoleScreenTitle, type ConsoleScreen } from "@/content/console-screens";
import { ScreenshotZoom } from "@/components/screenshot-zoom";

export function ConsoleFigure({ screen, locale }: { screen: ConsoleScreen; locale: Locale }) {
  const title = consoleScreenTitle(screen, locale);
  const { file, width, height } = consoleScreens[screen];
  return <ScreenshotZoom src={`${basePath}/images/product/${file}`} alt={title} caption={title} locale={locale} width={width} height={height}/>;
}
