import { FusionHome } from "@/components/sites/fusion/home";
import { localizedMetadata } from "@/lib/i18n";

export const metadata = localizedMetadata("zh", "/", 'SkyMythos.ai · 让 AI 完成工作，让能力留在企业', '企业的 AI-Native Harness。让数字员工承接目标、调用工具、交付成果，将有效经验与知识积累为企业能力。');
export default function Home() { return <FusionHome locale="zh" />; }
