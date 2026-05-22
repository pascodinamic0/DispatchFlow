import { LoginForm } from "@/features/auth/components/login-form";
import { redirectIfAuthenticated } from "@/lib/auth/redirect-if-authenticated";

export default async function LoginPage() {
  await redirectIfAuthenticated();
  return <LoginForm />;
}
