import { PocPageContent, getPocMetadata } from "@/components/sites/fusion/poc-page";
type Props = { searchParams: Promise<{ enquiry?: string | string[] }> };
export function generateMetadata({ searchParams }: Props) { return getPocMetadata("en", searchParams); }
export default function Page({ searchParams }: Props) { return <PocPageContent locale="en" searchParams={searchParams} />; }
