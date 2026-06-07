import type { SupabaseClient } from "@supabase/supabase-js";
import { ORGANIZATION_LOGOS_BUCKET } from "@/lib/storage/constants";
import type { Database } from "@/types/database";

type StorageClient = SupabaseClient<Database>;

export type LogoStorageSetupStatus = {
  hasLogoUrlColumn: boolean;
  hasOrganizationLogosBucket: boolean;
  ready: boolean;
};

export async function getLogoStorageSetupStatus(
  supabase: StorageClient,
): Promise<LogoStorageSetupStatus> {
  const { error: columnError } = await supabase
    .from("organizations")
    .select("logo_url")
    .limit(0);

  const hasLogoUrlColumn = !columnError?.message?.includes("logo_url");

  const { error: bucketError } = await supabase.storage
    .from(ORGANIZATION_LOGOS_BUCKET)
    .list("", { limit: 1 });

  const hasOrganizationLogosBucket =
    !bucketError ||
    (!bucketError.message.includes("not found") &&
      !bucketError.message.includes("Bucket not found"));

  return {
    hasLogoUrlColumn,
    hasOrganizationLogosBucket,
    ready: hasLogoUrlColumn && hasOrganizationLogosBucket,
  };
}
