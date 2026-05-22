"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProfile } from "@/lib/auth/session";
import { getErrorMessage } from "@/lib/errors";
import { hasResendConfigured, sendEmail } from "@/lib/email/resend";
import { assertPermission, canManageTeamRoles } from "@/lib/permissions";
import { hasAdminClient } from "@/lib/supabase/admin";
import {
  createOrganizationInvite,
  listPendingInvites,
  revokeInvite,
} from "@/services/invites.service";
import { getOrganizationById } from "@/services/profile.service";

const inviteSchema = z.object({
  email: z.string().email("Valid email required"),
  role: z.enum([
    "admin",
    "dispatcher",
    "procurement",
    "requester",
    "viewer",
  ]),
});

export type InviteActionState = {
  error?: string;
  success?: string;
};

export async function inviteTeamMember(
  _prev: InviteActionState,
  formData: FormData,
): Promise<InviteActionState> {
  const parsed = inviteSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const { supabase, user, profile } = await requireProfile();
    assertPermission(
      canManageTeamRoles(profile.role),
      "Only admins can invite teammates",
    );

    if (!hasAdminClient()) {
      return {
        error:
          "Add SUPABASE_SERVICE_ROLE_KEY to .env.local to send invite emails.",
      };
    }

    const organization = await getOrganizationById(
      supabase,
      profile.organization_id,
    );
    if (!organization) return { error: "Organization not found" };

    await createOrganizationInvite(supabase, {
      organizationId: profile.organization_id,
      email: parsed.data.email,
      role: parsed.data.role,
      invitedBy: user.id,
      organizationName: organization.name,
    });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    if (hasResendConfigured()) {
      await sendEmail({
        to: parsed.data.email,
        subject: `You're invited to ${organization.name} on DispatchFlow`,
        html: `
          <p>You've been invited to join <strong>${organization.name}</strong> on DispatchFlow.</p>
          <p>Check your inbox for the Supabase invite link, or sign up at <a href="${siteUrl}/signup">${siteUrl}/signup</a> with this email.</p>
        `,
      });
    }

    revalidatePath("/settings");
    return {
      success: `Invite sent to ${parsed.data.email}`,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function revokeTeamInvite(
  inviteId: string,
): Promise<InviteActionState> {
  try {
    const { supabase, profile } = await requireProfile();
    assertPermission(
      canManageTeamRoles(profile.role),
      "Only admins can revoke invites",
    );

    await revokeInvite(supabase, inviteId, profile.organization_id);
    revalidatePath("/settings");
    return { success: "Invite revoked" };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getTeamInvites() {
  const { supabase, profile } = await requireProfile();
  return listPendingInvites(supabase, profile.organization_id);
}
