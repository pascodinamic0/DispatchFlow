"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/session";
import { getErrorMessage } from "@/lib/errors";
import { assertPermission, canManageOrganization } from "@/lib/permissions";
import {
  AVATARS_BUCKET,
  ORGANIZATION_LOGOS_BUCKET,
} from "@/lib/storage/constants";
import { getLogoStorageSetupStatus } from "@/lib/storage/setup-status";
import { uploadImageToBucket } from "@/lib/storage/upload-image";
import {
  updateOrganization,
  updateProfile,
} from "@/services/profile.service";

export type UploadActionState = {
  error?: string;
  success?: string;
  imageUrl?: string;
};

export async function uploadOrganizationLogoAction(
  _prev: UploadActionState,
  formData: FormData,
): Promise<UploadActionState> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { error: "Choose an image file" };
  }

  try {
    const { supabase, profile } = await requireProfile();
    assertPermission(
      canManageOrganization(profile.role),
      "Only admins can update the organization logo",
    );

    const setup = await getLogoStorageSetupStatus(supabase);
    if (!setup.ready) {
      return {
        error:
          "Logo storage is not set up. Run scripts/apply-logo-storage.sql in the Supabase SQL Editor, then try again.",
      };
    }

    const logoUrl = await uploadImageToBucket(supabase, {
      bucket: ORGANIZATION_LOGOS_BUCKET,
      path: `${profile.organization_id}/logo`,
      file,
    });

    if (setup.hasLogoUrlColumn) {
      await updateOrganization(supabase, profile.organization_id, {
        logoUrl,
      });
    }

    revalidatePath("/settings");
    revalidatePath("/", "layout");
    return { success: "Company logo updated", imageUrl: logoUrl };
  } catch (error) {
    const message = getErrorMessage(error);
    if (message.includes("logo_url") || message.includes("schema cache")) {
      return {
        error:
          "Database is missing logo_url. Run scripts/apply-logo-storage.sql in Supabase SQL Editor.",
      };
    }
    return { error: message };
  }
}

export async function uploadProfileAvatarAction(
  _prev: UploadActionState,
  formData: FormData,
): Promise<UploadActionState> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { error: "Choose an image file" };
  }

  try {
    const { supabase, user } = await requireProfile();

    const setup = await getLogoStorageSetupStatus(supabase);
    if (!setup.hasAvatarsBucket) {
      return {
        error:
          "Avatar storage is not set up. Run scripts/apply-logo-storage.sql in the Supabase SQL Editor, then try again.",
      };
    }

    const avatarUrl = await uploadImageToBucket(supabase, {
      bucket: AVATARS_BUCKET,
      path: `${user.id}/avatar`,
      file,
    });

    await updateProfile(supabase, user.id, { avatarUrl });

    revalidatePath("/settings");
    revalidatePath("/", "layout");
    return { success: "Profile photo updated", imageUrl: avatarUrl };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
