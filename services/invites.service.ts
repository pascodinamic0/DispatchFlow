import type { DbClient } from "@/lib/supabase/types";
import { createAdminClient, hasAdminClient } from "@/lib/supabase/admin";
import { mapSupabaseError } from "@/lib/supabase/errors";
import {
  assertSiteUrlConfiguredForInvites,
  getAuthConfirmUrl,
} from "@/lib/site-url";
import type { Database, Profile, UserRole } from "@/types";


export type OrganizationInvite =
  Database["public"]["Tables"]["organization_invites"]["Row"];

export async function listPendingInvites(
  supabase: DbClient,
  organizationId: string,
): Promise<OrganizationInvite[]> {
  const { data, error } = await supabase
    .from("organization_invites")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw mapSupabaseError(error);
  return data ?? [];
}

export async function getPendingInviteByEmail(
  supabase: DbClient,
  email: string,
): Promise<
  (OrganizationInvite & { organization: { id: string; name: string } }) | null
> {
  const normalized = email.trim().toLowerCase();
  const { data, error } = await supabase
    .from("organization_invites")
    .select("*, organization:organizations(id, name)")
    .eq("status", "pending")
    .eq("email", normalized)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw mapSupabaseError(error);
  if (!data) return null;

  const row = data as OrganizationInvite & {
    organization: { id: string; name: string } | { id: string; name: string }[] | null;
  };
  const orgRaw = row.organization;
  const org = Array.isArray(orgRaw) ? orgRaw[0] : orgRaw;
  if (!org) return null;

  return { ...row, organization: org };
}

export async function createOrganizationInvite(
  supabase: DbClient,
  input: {
    organizationId: string;
    email: string;
    role: UserRole;
    invitedBy: string;
    organizationName: string;
  },
): Promise<OrganizationInvite> {
  const email = input.email.trim().toLowerCase();

  const { data, error } = await supabase
    .from("organization_invites")
    .insert({
      organization_id: input.organizationId,
      email,
      role: input.role,
      invited_by: input.invitedBy,
    })
    .select("*")
    .single();

  if (error) throw mapSupabaseError(error);

  if (hasAdminClient()) {
    assertSiteUrlConfiguredForInvites();
    const admin = createAdminClient();

    await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: getAuthConfirmUrl("/onboarding"),
      data: {
        organization_id: input.organizationId,
        organization_name: input.organizationName,
        role: input.role,
        invited: true,
      },
    });
  }

  return data;
}

export async function acceptInvite(
  supabase: DbClient,
  inviteId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("organization_invites")
    .update({ status: "accepted" })
    .eq("id", inviteId);

  if (error) throw mapSupabaseError(error);

  void userId;
}

export async function revokeInvite(
  supabase: DbClient,
  inviteId: string,
  organizationId: string,
): Promise<void> {
  const { error } = await supabase
    .from("organization_invites")
    .update({ status: "revoked" })
    .eq("id", inviteId)
    .eq("organization_id", organizationId)
    .eq("status", "pending");

  if (error) throw mapSupabaseError(error);
}

export async function resolveInviteForNewUser(
  supabase: DbClient,
  userId: string,
  email: string,
  fullName: string,
): Promise<Profile | null> {
  const invite = await getPendingInviteByEmail(supabase, email);
  if (!invite) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      organization_id: invite.organization_id,
      full_name: fullName,
      role: invite.role,
    })
    .select("*")
    .single();

  if (error) throw mapSupabaseError(error);

  await acceptInvite(supabase, invite.id, userId);
  return profile;
}
