import dynamic from "next/dynamic";
const Login = dynamic(() => import("@/components/pages/Login"), { ssr: false });
export default function LoginPage() {
  return <Login />;
}
