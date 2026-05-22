import { SignupForm } from "@/features/auth/components/signup-form";
import { redirectIfAuthenticated } from "@/lib/auth/redirect-if-authenticated";

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function SignupPage({ searchParams }: Props) {
  await redirectIfAuthenticated();
  const { email } = await searchParams;
  return <SignupForm defaultEmail={email?.trim().toLowerCase()} />;
}
