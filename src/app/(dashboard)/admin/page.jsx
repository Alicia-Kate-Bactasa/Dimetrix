import dynamic from "next/dynamic";
const Admin = dynamic(() => import("@/components/pages/Admin"), { ssr: false });
export default function AdminPage() {
  return <Admin />;
}
