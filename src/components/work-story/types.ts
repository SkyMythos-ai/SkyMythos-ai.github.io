export type StoryKind = "overview" | "assets" | "governance";
export interface StoryFlow { opacity: number; progress: number }
export interface StoryFrame {
  t: number;
  cycle: number;
  duration: number;
  parts: Record<string, number>;
  flows: Record<string, StoryFlow>;
  caption: string;
  scenario: string;
  resetting: boolean;
}
