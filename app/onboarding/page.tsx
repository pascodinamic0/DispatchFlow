import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { InvitedOnboardingForm } from "@/features/onboarding/components/invited-onboarding-form";
import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";
import { requireUser } from "@/lib/auth/session";
import { getPendingInviteByEmail } from "@/services/invites.service";
import { getProfileByUserId } from "@/services/profile.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UserRole } from "@/types";

export default async function OnboardingPage() {
  const { supabase, user } = await requireUser();
  const profile = await getProfileByUserId(supabase, user.id);

  if (profile) {
    redirect("/dashboard");
  }

  const invite = user.email
    ? await getPendingInviteByEmail(supabase, user.email)
    : null;

  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const invitedViaAuth =
    meta?.invited && meta.organization_name && meta.organization_id && meta.role;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[var(--brand-surface)] p-4">
      <Link href="/" className="mb-8">
        <Logo className="max-h-12" />
      </Link>
      <Card className="w-full max-w-md border-border/80 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to DispatchFlow</CardTitle>
          <CardDescription>
            {invite || invitedViaAuth
              ? "Complete your profile to join your team workspace."
              : "Create your organization workspace and profile to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invite ? (
            <InvitedOnboardingForm
              organizationName={invite.organization.name}
              role={invite.role}
            />
          ) : invitedViaAuth ? (
            <InvitedOnboardingForm
              organizationName={String(meta.organization_name)}
              role={meta.role as UserRole}
            />
          ) : (
            <OnboardingForm />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
