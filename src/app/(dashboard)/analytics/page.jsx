import dynamic from "next/dynamic";
const Analytics = dynamic(() => import("@/components/pages/Analytics"), { ssr: false });
export default function AnalyticsPage() {
  return <Analytics />;
}
