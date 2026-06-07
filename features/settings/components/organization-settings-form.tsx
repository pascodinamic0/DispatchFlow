"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  updateOrganizationSettings,
  type SettingsActionState,
} from "@/features/settings/actions/settings-actions";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { uploadOrganizationLogoAction } from "@/features/settings/actions/upload-actions";
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
      <ImageUploadField
        label="Company logo"
        description="Appears in the sidebar for everyone in your workspace (top-left logo area)."
        currentImageUrl={logoUrl ?? organization.logo_url}
        fallbackLabel={organization.name.slice(0, 2).toUpperCase()}
        action={uploadOrganizationLogoAction}
        imageAlt={`${organization.name} logo`}
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
