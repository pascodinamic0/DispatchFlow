"use client";

import { useActionState } from "react";
import {
  completeInvitedOnboarding,
  type OnboardingActionState,
} from "@/features/onboarding/actions/complete-onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRole } from "@/lib/format";
import type { UserRole } from "@/types";

const initialState: OnboardingActionState = {};

type Props = {
  organizationName: string;
  role: UserRole;
};

export function InvitedOnboardingForm({ organizationName, role }: Props) {
  const [state, formAction, pending] = useActionState(
    completeInvitedOnboarding,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <p className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
        You&apos;ve been invited to join <strong>{organizationName}</strong> as{" "}
        <strong>{formatRole(role)}</strong>.
      </p>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          required
          placeholder="Your name"
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department (optional)</Label>
        <Input
          id="department"
          name="department"
          placeholder="e.g. Operations"
          disabled={pending}
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Joining…" : "Join workspace"}
      </Button>
    </form>
  );
}
