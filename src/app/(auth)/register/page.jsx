import dynamic from "next/dynamic";
const Register = dynamic(() => import("@/components/pages/Register"), { ssr: false });
export default function RegisterPage() {
  return <Register />;
}
