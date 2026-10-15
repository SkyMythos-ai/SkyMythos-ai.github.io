import type { Locale } from "@/lib/i18n";
import type { EmployeeScene as StoryScene } from "@/content/employee-story";
import { IdentityVisual } from "@/components/employee-work-visual";
import { CollaborationVisual } from "@/components/employee-collaboration-visual";
import { KnowledgeVisual } from "@/components/employee-knowledge-visual";
import { MachineArt } from "@/components/employee-machine-art";

/** 几何只在服务端构造；客户端收到完整 SVG 与可直接写入的运动向量。 */
export function EmployeeScene({ scene, locale }: { scene: StoryScene["id"]; locale: Locale }) {
  return <div className="employee-scene" data-illustration={scene} aria-hidden="true">
    <svg className="employee-emblem" viewBox={scene === "collaboration" ? "64 125 512 360" : "0 80 640 450"} fill="none" data-emblem={scene} data-time="11.800" data-locale={locale}>
      <MachineArt scene={scene} art={scene === "identity" ? <IdentityVisual locale={locale}/> : scene === "collaboration" ? <CollaborationVisual locale={locale}/> : <KnowledgeVisual locale={locale}/>}/>
    </svg>
  </div>;
}
