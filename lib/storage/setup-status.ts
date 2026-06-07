import type { SupabaseClient } from "@supabase/supabase-js";
import {
  AVATARS_BUCKET,
  ORGANIZATION_LOGOS_BUCKET,
} from "@/lib/storage/constants";
import type { Database } from "@/types/database";

type StorageClient = SupabaseClient<Database>;

export type LogoStorageSetupStatus = {
  hasLogoUrlColumn: boolean;
  hasOrganizationLogosBucket: boolean;
  hasAvatarsBucket: boolean;
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

  const { error: orgBucketError } = await supabase.storage
    .from(ORGANIZATION_LOGOS_BUCKET)
    .list("", { limit: 1 });

  const hasOrganizationLogosBucket = bucketExists(orgBucketError);

  const { error: avatarBucketError } = await supabase.storage
    .from(AVATARS_BUCKET)
    .list("", { limit: 1 });

  const hasAvatarsBucket = bucketExists(avatarBucketError);

  return {
    hasLogoUrlColumn,
    hasOrganizationLogosBucket,
    hasAvatarsBucket,
    ready: hasLogoUrlColumn && hasOrganizationLogosBucket && hasAvatarsBucket,
  };
}

function bucketExists(error: { message: string } | null): boolean {
  if (!error) return true;
  const message = error.message.toLowerCase();
  return !message.includes("not found") && !message.includes("bucket not found");
}
