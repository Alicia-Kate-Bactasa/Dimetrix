import dynamic from "next/dynamic";
const ForgotPassword = dynamic(() => import("@/components/pages/ForgotPassword"), { ssr: false });
export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
