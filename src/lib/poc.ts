import type { Locale } from "@/lib/i18n";

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
  locale: Locale = "zh",
): { valid: true; data: PocLead } | { valid: false; errors: PocErrors } {
  const message = (zh: string, en: string) => locale === "zh" ? zh : en;
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
    errors.requestType = message("请选择有效的咨询类型", "Choose a valid enquiry type.");
  if (!data.name || data.name.length > 80)
    errors.name = message("请填写您的姓名（80 字以内）", "Enter your name (up to 80 characters).");
  if (!data.company || data.company.length > 120)
    errors.company = message("请填写公司或组织名称（120 字以内）", "Enter your company or organization (up to 120 characters).");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254)
    errors.email = message("请填写有效的邮箱地址", "Enter a valid email address.");
  if (data.role.length > 80) errors.role = message("职位请控制在 80 字以内", "Keep your role within 80 characters.");
  if (!pocScenarios.some((item) => item === data.scenario))
    errors.scenario = message("请选择希望评估的方向", "Choose an area of interest.");
  if (data.needs.length < 5 || data.needs.length > 2000)
    errors.needs = message("请简要说明希望验证的目标（5–2000 字）", "Describe your goals in 5\u20132,000 characters.");
  if (!data.consent)
    errors.consent =
      data.requestType === "enterprise"
        ? message("请确认同意团队就本次企业项目询价与您联系", "Please agree to be contacted about this enterprise enquiry.")
        : message("请确认同意团队就本次 POC 申请与您联系", "Please agree to be contacted about this POC request.");
  return Object.keys(errors).length
    ? { valid: false, errors }
    : { valid: true, data };
}

const englishScenarioLabels: Record<PocScenario, string> = {
  "数字员工与业务工作": "AI employees and business work",
  "自主研发与工程交付": "Autonomous engineering and delivery",
  "企业知识与经验沉淀": "Enterprise knowledge and experience",
  "自动化与持续执行": "Automations and ongoing execution",
  "多场景综合评估": "Multiple use cases",
};

export function getPocScenarioLabel(scenario: string, locale: Locale = "en"): string {
  if (locale === "zh") return scenario;
  return englishScenarioLabels[scenario as PocScenario] ?? scenario;
}
