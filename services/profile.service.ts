import type { DbClient } from "@/lib/supabase/types";
import { slugify } from "@/lib/slug";
import { mapSupabaseError } from "@/lib/supabase/errors";
import type { Database, Organization, Profile, UserRole } from "@/types";


export async function getProfileByUserId(
  supabase: DbClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw mapSupabaseError(error);
  return data;
}

export async function createOrganization(
  supabase: DbClient,
  name: string,
): Promise<string> {
  const baseSlug = slugify(name);

  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;
    const { data, error } = await supabase.rpc("create_organization", {
      p_name: name.trim(),
      p_slug: slug,
    });

    if (!error && data) return data;
    if (error?.code !== "23505") throw mapSupabaseError(error ?? { message: "Failed to create organization" });
  }

  throw mapSupabaseError({
    message: "Could not create organization. Try a different name.",
    code: "23505",
  });
}

export async function createProfile(
  supabase: DbClient,
  input: {
    userId: string;
    organizationId: string;
    fullName: string;
    role: UserRole;
    department?: string | null;
  },
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: input.userId,
      organization_id: input.organizationId,
      full_name: input.fullName,
      role: input.role,
      department: input.department ?? null,
    })
    .select("*")
    .single();

  if (error) throw mapSupabaseError(error);
  return data;
}

export async function getOrganizationById(
  supabase: DbClient,
  organizationId: string,
): Promise<Organization | null> {
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", organizationId)
    .maybeSingle();

  if (error) throw mapSupabaseError(error);
  return data;
}

export async function updateOrganization(
  supabase: DbClient,
  organizationId: string,
  patch: { name: string },
): Promise<Organization> {
  const { data, error } = await supabase
    .from("organizations")
    .update({ name: patch.name.trim(), updated_at: new Date().toISOString() })
    .eq("id", organizationId)
    .select("*")
    .single();

  if (error) throw mapSupabaseError(error);
  return data;
}

export async function updateProfile(
  supabase: DbClient,
  userId: string,
  patch: {
    fullName?: string;
    department?: string | null;
    phone?: string | null;
    role?: UserRole;
    emailNotificationsEnabled?: boolean;
    pushNotificationsEnabled?: boolean;
  },
): Promise<Profile> {
  const update: Database["public"]["Tables"]["profiles"]["Update"] = {
    updated_at: new Date().toISOString(),
  };
  if (patch.fullName !== undefined) update.full_name = patch.fullName.trim();
  if (patch.department !== undefined) update.department = patch.department;
  if (patch.phone !== undefined) update.phone = patch.phone;
  if (patch.role !== undefined) update.role = patch.role;
  if (patch.emailNotificationsEnabled !== undefined) {
    update.email_notifications_enabled = patch.emailNotificationsEnabled;
  }
  if (patch.pushNotificationsEnabled !== undefined) {
    update.push_notifications_enabled = patch.pushNotificationsEnabled;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw mapSupabaseError(error);
  return data;
}

export async function listProfilesInOrganization(
  supabase: DbClient,
  organizationId: string,
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("organization_id", organizationId)
    .order("full_name", { ascending: true });

  if (error) throw mapSupabaseError(error);
  return data ?? [];
}
