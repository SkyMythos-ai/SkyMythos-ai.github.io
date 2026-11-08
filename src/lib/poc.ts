export const pocScenarios = [
  "数字员工与业务工作",
  "自主研发与工程交付",
  "企业知识与经验沉淀",
  "自动化与持续执行",
  "多场景综合评估",
] as const;
export type PocScenario = (typeof pocScenarios)[number];
export type PocEnquiry = "poc" | "enterprise";
export type PocLead = {
  requestType?: PocEnquiry;
  name: string;
  company: string;
  email: string;
  role: string;
  scenario: string;
  needs: string;
  consent: boolean;
};
export type PocField = keyof PocLead;
export type PocErrors = Partial<Record<PocField, string>>;
export type PocChannel =
  | { mode: "webhook" }
  | { mode: "email"; email: string }
  | { mode: "unconfigured" };

export function validatePoc(
  value: unknown,
): { valid: true; data: PocLead } | { valid: false; errors: PocErrors } {
  const input =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};
  const text = (key: string) =>
    typeof input[key] === "string" ? input[key].trim() : "";
  const data: PocLead = {
    ...(input.requestType === "enterprise"
      ? { requestType: "enterprise" as const }
      : {}),
    name: text("name"),
    company: text("company"),
    email: text("email"),
    role: text("role"),
    scenario: text("scenario"),
    needs: text("needs"),
    consent: input.consent === true,
  };
  const errors: PocErrors = {};
  if (
    input.requestType !== undefined &&
    input.requestType !== "poc" &&
    input.requestType !== "enterprise"
  )
    errors.requestType = "请选择有效的咨询类型";
  if (!data.name || data.name.length > 80)
    errors.name = "请填写您的姓名（80 字以内）";
  if (!data.company || data.company.length > 120)
    errors.company = "请填写公司或组织名称（120 字以内）";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254)
    errors.email = "请填写有效的邮箱地址";
  if (data.role.length > 80) errors.role = "职位请控制在 80 字以内";
  if (!pocScenarios.some((item) => item === data.scenario))
    errors.scenario = "请选择希望评估的方向";
  if (data.needs.length < 5 || data.needs.length > 2000)
    errors.needs = "请简要说明希望验证的目标（5–2000 字）";
  if (!data.consent)
    errors.consent =
      data.requestType === "enterprise"
        ? "请确认同意团队就本次企业项目询价与您联系"
        : "请确认同意团队就本次 POC 申请与您联系";
  return Object.keys(errors).length
    ? { valid: false, errors }
    : { valid: true, data };
}
