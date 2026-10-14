import type { Locale } from "@/lib/i18n";

/** 明确治理、资源供给与沙箱内执行的不同边界。 */
export function ArchitectureMap({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <figure className="architecture-map">
      <div className="architecture-governance">
        <div className="map-node"><strong>Console</strong><span>{zh ? "任务与运行视图" : "Task and run views"}</span></div>
        <div className="map-arrow" aria-hidden="true">↓</div>
        <div className="map-node map-primary"><strong>Control Plane</strong><span>{zh ? "授权 · 预检 · 任务生命周期" : "Authorisation · preflight · task lifecycle"}</span></div>
        <div className="map-arrow" aria-hidden="true">↓</div>
        <div className="map-node"><strong>Sandbox Provider</strong><span>{zh ? "创建与管理运行环境" : "Provision and manage environments"}</span></div>
      </div>
      <div className="map-handoff"><span>{zh ? "供给沙箱" : "Provision"}</span><span className="hidden md:block" aria-hidden="true">→</span><span className="md:hidden" aria-hidden="true">↓</span></div>
      <div className="map-sandbox">
        <p className="mb-6 text-sm text-signal">{zh ? "任务沙箱 · 一任务一环境" : "Task sandbox · one per task"}</p>
        <div className="map-node map-primary"><strong>Runner / Supervisor</strong><span>{zh ? "依赖调度 · 执行尝试" : "Dependencies · execution attempts"}</span></div>
        <div className="map-arrow" aria-hidden="true">↓</div>
        <div className="grid grid-cols-2 gap-3"><div className="map-node"><strong>Agent A</strong></div><div className="map-node"><strong>Agent B</strong></div></div>
        <div className="map-arrow" aria-hidden="true">↓</div>
        <div className="map-node"><strong>Artifact</strong><span>{zh ? "冻结产物 · 确定性交接" : "Frozen artefacts · deterministic handoff"}</span></div>
      </div>
      <figcaption className="map-foundation">
        <p><strong>Gateway</strong><span>{zh ? "Web / WebSocket → 沙箱接入" : "Web / WebSocket → sandbox access"}</span></p>
        <p><strong>Contracts & Libraries</strong><span>{zh ? "跨组件共享协议与语义" : "Shared protocols and semantics"}</span></p>
      </figcaption>
    </figure>
  );
}
