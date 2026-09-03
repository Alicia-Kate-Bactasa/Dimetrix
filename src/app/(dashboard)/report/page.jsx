import dynamic from "next/dynamic";
const Report = dynamic(() => import("@/components/pages/Report"), { ssr: false });
export default function ReportPage() {
  return <Report />;
}
