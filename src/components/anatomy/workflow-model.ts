import { conceptFrame } from "./concept-model";
import { anatomyProgress as p, type AnatomyFrame } from "./types";

/** Work and recorded experience precede human confirmation, employee creation and the next task. */
export function workflowFrame(position: number): AnatomyFrame {
  const x = Math.max(0, Math.min(5, position));
  const work = conceptFrame(x >= 3 ? x : Math.min(x, .32));
  const formationReview = p(x, 1.1, 1.2) * (1 - p(x, 2.82, 2.94));
  return {
    parts: {
      ...work.parts,
      "prior-work": { opacity: p(x, .1, .2) * (1 - p(x, 3.01, 3.08)) },
      "prior-experience": { opacity: p(x, .24, .32) },
      "flow-capture": { opacity: p(x, .32, .4) * (1 - p(x, .85, .98)), shift: p(x, .38, .82) },
      "source-log": { opacity: p(x, .78, .9), shift: 1 - p(x, .78, .9) },
      "source-experience": { opacity: p(x, .86, 1), shift: 1 - p(x, .86, 1) },
      "source-method": { opacity: p(x, 1.25, 1.55), shift: 1 - p(x, 1.25, 1.55) },
      "source-role": { opacity: p(x, 1.4, 1.7), shift: 1 - p(x, 1.4, 1.7) },
      "source-confirmed": { opacity: p(x, 1.8, 2) },
      "formation-review": { opacity: formationReview },
      "formation-pending": { opacity: 1 - p(x, 1.8, 2) },
      "chat-screen": { opacity: (work.parts["chat-screen"].opacity ?? 1) * (1 - formationReview) },
      "human-review": x < 3 ? { opacity: formationReview, shift: p(x, 1.8, 1.88) - p(x, 1.93, 2) } : work.parts["human-review"],
      "flow-develop": { opacity: p(x, 2.02, 2.08) * (1 - p(x, 2.26, 2.34)), shift: p(x, 2.03, 2.27) },
      "skill-record": { opacity: p(x, 2.28, 2.36), shift: 1 },
      "mcp-record": { opacity: p(x, 2.36, 2.44), shift: 1 },
      "agent-visible": { opacity: p(x, 2.5, 2.65), shift: 1 - p(x, 2.5, 2.65) },
      "model-ready": { opacity: 1 - p(x, 2.5, 2.65) },
      "skill-install": { shift: p(x, 2.66, 2.8) },
      "mcp-install": { shift: p(x, 2.8, 2.92) },
      "employee-ready": { opacity: p(x, 2.94, 3), draw: p(x, 2.94, 3) },
      "flow-evidence": { opacity: .25 + .75 * p(x, .1, .32) },
    },
    readout: x < .32 ? ["先在人与模型的协作中，完成真实工作。", "Start with real work between a person and a model."]
      : x < 1.1 ? ["留下工作记录、结果与经验，此时还没有数字员工。", "Keep work records and experience. No employee yet."]
        : x < 1.4 ? ["AI 从记录提出总结与方法候选。", "AI proposes summaries and methods from records."]
          : x < 1.8 ? ["人审核并修改方法：按权限核对行数。", "A person reviews and edits: check access and rows."]
            : x < 2.02 ? ["人确认修改并决定采用职责、方法与工具配置。", "A person confirms the edits and adopts the role, method and tools."]
          : x < 3.04 ? ["基于已确认的经验，形成并配备数字员工。", "Build the employee from confirmed experience."]
            : x < 4.12 ? ["员工就绪后，再承接下一项任务。", "Only the ready employee takes on the next task."]
              : x < 4.84 ? ["成果交还给人，检查本次工作的结果。", "The result returns to the person for review."]
                : ["人完成验收，工作记录与经验继续留下。", "People accept the result; records and experience remain."],
  };
}
