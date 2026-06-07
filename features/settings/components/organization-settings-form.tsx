"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  updateOrganizationSettings,
  type SettingsActionState,
} from "@/features/settings/actions/settings-actions";
import { OrganizationLogoUpload } from "@/features/settings/components/organization-logo-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Organization } from "@/types";

const initialState: SettingsActionState = {};

type Props = {
  organization: Organization;
  logoUrl?: string | null;
};

export function OrganizationSettingsForm({
  organization,
  logoUrl,
}: Props) {
  const [state, formAction, pending] = useActionState(
    updateOrganizationSettings,
    initialState,
  );

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success(state.success);
  }, [state.error, state.success]);

  return (
    <div className="space-y-6">
      <OrganizationLogoUpload
        organizationId={organization.id}
        organizationName={organization.name}
        currentLogoUrl={logoUrl ?? organization.logo_url}
      />

      <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Organization name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={organization.name}
          required
          disabled={pending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Workspace ID</Label>
        <Input id="slug" value={organization.slug} disabled readOnly />
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Save organization"}
      </Button>
    </form>
    </div>
  );
}
