"use server";

import { revalidatePath } from "next/cache";
import {
  organizationSettingsSchema,
  profileSettingsSchema,
  teamRoleSchema,
} from "@/features/settings/schemas/settings-schema";
import { requireProfile } from "@/lib/auth/session";
import { getErrorMessage } from "@/lib/errors";
import {
  assertPermission,
  canManageOrganization,
  canManageTeamRoles,
} from "@/lib/permissions";
import {
  listProfilesInOrganization,
  updateOrganization,
  updateProfile,
} from "@/services/profile.service";

export type SettingsActionState = {
  error?: string;
  success?: string;
};

export async function updateProfileSettings(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = profileSettingsSchema.safeParse({
    fullName: formData.get("fullName"),
    department: formData.get("department") || undefined,
    phone: formData.get("phone") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const { supabase, user } = await requireProfile();
    await updateProfile(supabase, user.id, {
      fullName: parsed.data.fullName,
      department: parsed.data.department?.trim() || null,
      phone: parsed.data.phone?.trim() || null,
    });
    revalidatePath("/settings");
    revalidatePath("/", "layout");
    return { success: "Profile updated" };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updateOrganizationSettings(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = organizationSettingsSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const { supabase, profile } = await requireProfile();
    assertPermission(
      canManageOrganization(profile.role),
      "Only admins can update organization settings",
    );

    await updateOrganization(supabase, profile.organization_id, {
      name: parsed.data.name,
    });
    revalidatePath("/settings");
    return { success: "Organization updated" };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updateTeamMemberRole(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = teamRoleSchema.safeParse({
    profileId: formData.get("profileId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const { supabase, profile } = await requireProfile();
    assertPermission(
      canManageTeamRoles(profile.role),
      "Only admins can change team roles",
    );

    const members = await listProfilesInOrganization(
      supabase,
      profile.organization_id,
    );
    const target = members.find((m) => m.id === parsed.data.profileId);
    if (!target) {
      return { error: "Team member not found" };
    }

    const adminCount = members.filter((m) => m.role === "admin").length;
    if (
      target.role === "admin" &&
      parsed.data.role !== "admin" &&
      adminCount <= 1
    ) {
      return { error: "Your organization must have at least one admin" };
    }

    await updateProfile(supabase, parsed.data.profileId, {
      role: parsed.data.role,
    });
    revalidatePath("/settings");
    return { success: "Role updated" };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updateNotificationPreferences(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  try {
    const { supabase, user } = await requireProfile();
    await updateProfile(supabase, user.id, {
      emailNotificationsEnabled: formData.get("emailNotifications") === "on",
      pushNotificationsEnabled: formData.get("pushNotifications") === "on",
    });
    revalidatePath("/settings");
    return { success: "Notification preferences saved" };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
