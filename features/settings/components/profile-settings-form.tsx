"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  updateProfileSettings,
  type SettingsActionState,
} from "@/features/settings/actions/settings-actions";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { uploadProfileAvatarAction } from "@/features/settings/actions/upload-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/types";

const initialState: SettingsActionState = {};

type Props = {
  profile: Profile;
  userEmail: string | null;
};

export function ProfileSettingsForm({ profile, userEmail }: Props) {
  const [state, formAction, pending] = useActionState(
    updateProfileSettings,
    initialState,
  );

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success(state.success);
  }, [state.error, state.success]);

  const initials = profile.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <ImageUploadField
        label="Profile photo"
        description="Appears on your account avatar in the top header and sidebar footer."
        currentImageUrl={profile.avatar_url}
        fallbackLabel={initials}
        action={uploadProfileAvatarAction}
        shape="circle"
        imageAlt={profile.full_name}
      />

      <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={profile.full_name}
          required
          disabled={pending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={userEmail ?? ""} disabled readOnly />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            name="department"
            defaultValue={profile.department ?? ""}
            placeholder="Operations"
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={profile.phone ?? ""}
            placeholder="+243 …"
            disabled={pending}
          />
        </div>
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
    </div>
  );
}
