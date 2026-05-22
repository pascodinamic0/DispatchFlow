"use client";

import { useActionState } from "react";
import {
  completeOnboarding,
  type OnboardingActionState,
} from "@/features/onboarding/actions/complete-onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/types";

const roles: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrator" },
  { value: "requester", label: "Requester" },
  { value: "procurement", label: "Procurement" },
  { value: "dispatcher", label: "Dispatcher" },
  { value: "viewer", label: "Viewer" },
];

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

const initialState: OnboardingActionState = {};

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(
    completeOnboarding,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="organizationName">Organization name</Label>
        <Input
          id="organizationName"
          name="organizationName"
          required
          placeholder="e.g. Acme Logistics DRC"
          disabled={pending}
        />
        <p className="text-xs text-muted-foreground">
          Creates your company workspace. Colleagues can join the same org later.
        </p>
      </div>

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
        <Label htmlFor="role">Your role</Label>
        <select
          id="role"
          name="role"
          required
          disabled={pending}
          className={selectClassName}
          defaultValue="admin"
        >
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
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
        {pending ? "Setting up…" : "Complete setup"}
      </Button>
    </form>
  );
}
