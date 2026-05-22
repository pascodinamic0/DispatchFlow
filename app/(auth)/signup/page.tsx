import { SignupForm } from "@/features/auth/components/signup-form";
import { redirectIfAuthenticated } from "@/lib/auth/redirect-if-authenticated";

export default async function SignupPage() {
  await redirectIfAuthenticated();
  return <SignupForm />;
}
