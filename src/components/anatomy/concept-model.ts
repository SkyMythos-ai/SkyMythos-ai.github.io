import { anatomyProgress as p, type AnatomyFrame } from "./types";

/** 六个休止位置分别表示 Chat、沉淀、Agent、员工、委派和人的验收。 */
export function conceptFrame(position: number): AnatomyFrame {
  const x = Math.max(0, Math.min(5, position));
  return {
    parts: {
      "chat-reply-one": { opacity: p(x, .03, .12), draw: p(x, .03, .12) },
      "chat-user-two": { opacity: p(x, .14, .22), draw: p(x, .14, .22) },
      "chat-reply-two": { opacity: p(x, .24, .32), draw: p(x, .24, .32) },
      "human-chat": { shift: p(x, .02, .08) - p(x, .08, .14) + p(x, .16, .22) - p(x, .22, .28) + p(x, 3.08, 3.16) - p(x, 3.16, 3.24) },
      "skill-record": { opacity: p(x, .36, .48), shift: p(x, .52, .98) },
      "mcp-record": { opacity: p(x, .46, .58), shift: p(x, .52, .98) },
      "agent-position": { shift: 1 },
      "agent-foundation": { opacity: p(x, 1.06, 1.3) },
      "agent-body": { opacity: p(x, 1.3, 1.55), shift: 1 - p(x, 1.3, 1.64) },
      "agent-head": { opacity: p(x, 1.55, 1.74), shift: 1 - p(x, 1.55, 1.9) },
      "agent-arms": { opacity: p(x, 1.72, 1.93), shift: 1 + p(x, 3.45, 3.75) - p(x, 4.15, 4.45) },
      "skill-install": { shift: p(x, 2.12, 2.48) },
      "mcp-install": { shift: p(x, 2.5, 2.9) },
      "skill-use": { shift: p(x, 3.8, 4) },
      "mcp-use": { shift: p(x, 3.76, 3.85) - p(x, 3.85, 3.94) },
      "employee-ready": { opacity: p(x, 2.92, 3), draw: p(x, 2.92, 3) },
      "delegated-work": { opacity: p(x, 3.08, 3.18), shift: p(x, 3.28, 3.75) - p(x, 4.15, 4.65) },
      "agent-result": { opacity: p(x, 3.82, 4), draw: p(x, 3.82, 4) },
      "chat-screen": { opacity: 1 - p(x, 4.65, 4.69) },
      "review-screen": { opacity: p(x, 4.65, 4.69) },
      "review-pending": { opacity: 1 - p(x, 4.84, 5) },
      "human-review": { shift: p(x, 4.72, 4.8) - p(x, 4.84, 4.92) },
      "human-approved": { opacity: p(x, 4.84, 5), draw: p(x, 4.84, 5) },
    },
    readout: x < .34 ? ["人和大模型通过多轮 Chat 完成真实工作", "A person and a model complete real work through repeated chat"]
      : x < 1.04 ? ["把有效方法沉淀为 Skill，把工具接入沉淀为 MCP", "Capture working methods as a Skill and tool access as MCP"]
        : x < 2.04 ? ["先形成独立 Agent，方法与工具仍然分开放置", "Form the Agent while the Skill and MCP remain separate"]
          : x < 3.04 ? ["同一 Agent 组合 Skill 与 MCP，成为数字员工", "Combine the same Agent with the Skill and MCP to make an employee"]
            : x < 4.12 ? ["人指派下一项任务，数字员工接手并执行", "The person assigns the next task and the employee executes it"]
              : x < 4.84 ? ["员工返回成果，由人接收并检查", "The employee returns the result for the person to inspect"]
                : ["人完成审批验收，协作闭环结束", "The person approves and accepts the result"],
  };
}
