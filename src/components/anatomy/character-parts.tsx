import { basePath } from "@/lib/site";

/** Approved flat portraits stay intact; work moves around them, not through artificial limbs. */
export function HumanPortrait({ x, y, width = 96 }: { x: number; y: number; width?: number }) {
  return <image data-character="human" href={`${basePath}/images/characters/person.svg`} x={x} y={y} width={width} height={width * 156 / 120} />;
}

export function AgentPortrait({ x, y, size = 104 }: { x: number; y: number; size?: number }) {
  return <image data-character="agent" href={`${basePath}/images/characters/agent.svg`} x={x} y={y} width={size} height={size} />;
}
