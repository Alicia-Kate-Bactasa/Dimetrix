import dynamic from "next/dynamic";
const ResetPassword = dynamic(() => import("@/components/pages/ResetPassword"), { ssr: false });
export default function ResetPasswordPage() {
  return <ResetPassword />;
}
