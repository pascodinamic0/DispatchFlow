import type { SupabaseClient } from "@supabase/supabase-js";
import { ORGANIZATION_LOGOS_BUCKET } from "@/lib/storage/constants";
import type { Database } from "@/types/database";

type StorageClient = SupabaseClient<Database>;

export async function resolveOrganizationLogoUrl(
  supabase: StorageClient,
  organizationId: string,
  storedUrl?: string | null,
): Promise<string | null> {
  if (storedUrl) return storedUrl;

  const { data, error } = await supabase.storage
    .from(ORGANIZATION_LOGOS_BUCKET)
    .list(organizationId, { limit: 10 });

  if (error || !data?.length) return null;

  const logoFile = data.find((file) => file.name.startsWith("logo."));
  if (!logoFile) return null;

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(ORGANIZATION_LOGOS_BUCKET)
    .getPublicUrl(`${organizationId}/${logoFile.name}`);

  return publicUrl;
}
