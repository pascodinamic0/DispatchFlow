"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { onboardingSchema } from "@/features/onboarding/schemas/onboarding-schema";
import { requireUser } from "@/lib/auth/session";
import { getErrorMessage } from "@/lib/errors";
import {
  getPendingInviteByEmail,
  resolveInviteForNewUser,
} from "@/services/invites.service";
import {
  createOrganization,
  createProfile,
  getProfileByUserId,
} from "@/services/profile.service";
import type { UserRole } from "@/types";

export type OnboardingActionState = {
  error?: string;
};

export async function completeInvitedOnboarding(
  _prev: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const fullName = formData.get("fullName");
  const department = formData.get("department");

  if (typeof fullName !== "string" || fullName.trim().length < 2) {
    return { error: "Full name is required" };
  }

  try {
    const { supabase, user } = await requireUser();
    const existing = await getProfileByUserId(supabase, user.id);
    if (existing) redirect("/dashboard");

    const email = user.email;
    if (!email) return { error: "Email is required to accept an invite" };

    let profile = await resolveInviteForNewUser(
      supabase,
      user.id,
      email,
      fullName.trim(),
    );

    if (!profile) {
      const meta = user.user_metadata as Record<string, unknown> | undefined;
      if (meta?.invited && meta.organization_id && meta.role) {
        const { data, error } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            organization_id: meta.organization_id as string,
            full_name: fullName.trim(),
            role: meta.role as UserRole,
            department:
              typeof department === "string" ? department.trim() || null : null,
          })
          .select("*")
          .single();
        if (error) throw error;
        profile = data;
      } else {
        return { error: "Invite not found or expired" };
      }
    }

    if (department && typeof department === "string") {
      await supabase
        .from("profiles")
        .update({ department: department.trim() || null })
        .eq("id", user.id);
    }
  } catch (error) {
    return { error: getErrorMessage(error) };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function completeOnboarding(
  _prev: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const parsed = onboardingSchema.safeParse({
    organizationName: formData.get("organizationName"),
    fullName: formData.get("fullName"),
    role: formData.get("role"),
    department: formData.get("department"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const { supabase, user } = await requireUser();
    const existing = await getProfileByUserId(supabase, user.id);

    if (existing) {
      redirect("/dashboard");
    }

    const email = user.email;
    if (email) {
      const invitedProfile = await resolveInviteForNewUser(
        supabase,
        user.id,
        email,
        parsed.data.fullName,
      );
      if (invitedProfile) {
        revalidatePath("/", "layout");
        redirect("/dashboard");
      }
    }

    const meta = user.user_metadata as Record<string, unknown> | undefined;
    if (meta?.invited && meta.organization_id && meta.role) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          organization_id: meta.organization_id as string,
          full_name: parsed.data.fullName,
          role: meta.role as UserRole,
          department: parsed.data.department || null,
        })
        .select("*")
        .single();

      if (error) throw error;
      void profile;
      revalidatePath("/", "layout");
      redirect("/dashboard");
    }

    const organizationId = await createOrganization(
      supabase,
      parsed.data.organizationName,
    );

    await createProfile(supabase, {
      userId: user.id,
      organizationId,
      fullName: parsed.data.fullName,
      role: parsed.data.role,
      department: parsed.data.department || null,
    });
  } catch (error) {
    return { error: getErrorMessage(error) };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
