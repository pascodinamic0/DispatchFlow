"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/session";
import { getErrorMessage } from "@/lib/errors";
import { assertPermission, canManageOrganization } from "@/lib/permissions";
import { updateOrganization } from "@/services/profile.service";

export type LogoActionState = {
  error?: string;
  success?: string;
};

export async function saveOrganizationLogoUrl(
  logoUrl: string,
): Promise<LogoActionState> {
  if (!logoUrl.startsWith("http")) {
    return { error: "Invalid logo URL" };
  }

  try {
    const { supabase, profile } = await requireProfile();
    assertPermission(
      canManageOrganization(profile.role),
      "Only admins can update the organization logo",
    );

    await updateOrganization(supabase, profile.organization_id, {
      logoUrl,
    });

    revalidatePath("/settings");
    revalidatePath("/", "layout");
    return { success: "Company logo updated" };
  } catch (error) {
    const message = getErrorMessage(error);
    if (message.includes("logo_url")) {
      return {
        error:
          "Database is missing logo_url. Run scripts/apply-logo-storage.sql in Supabase SQL Editor.",
      };
    }
    return { error: message };
  }
}
