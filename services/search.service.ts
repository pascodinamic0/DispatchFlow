import type { DbClient } from "@/lib/supabase/types";
import { mapSupabaseError } from "@/lib/supabase/errors";
export type SearchResult = {
  requests: { id: string; title: string; status: string }[];
  dispatches: { id: string; reference_code: string; status: string }[];
};

export async function searchOperations(
  supabase: DbClient,
  organizationId: string,
  query: string,
  limit = 10,
): Promise<SearchResult> {
  const term = query.trim();
  if (!term) {
    return { requests: [], dispatches: [] };
  }

  const pattern = `%${term}%`;

  const [requestsRes, dispatchesRes] = await Promise.all([
    supabase
      .from("procurement_requests")
      .select("id, title, status")
      .eq("organization_id", organizationId)
      .or(`title.ilike.${pattern},description.ilike.${pattern}`)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("dispatches")
      .select("id, reference_code, status")
      .eq("organization_id", organizationId)
      .or(
        `reference_code.ilike.${pattern},destination.ilike.${pattern},assignee_name.ilike.${pattern}`,
      )
      .order("updated_at", { ascending: false })
      .limit(limit),
  ]);

  if (requestsRes.error) throw mapSupabaseError(requestsRes.error);
  if (dispatchesRes.error) throw mapSupabaseError(dispatchesRes.error);

  return {
    requests: requestsRes.data ?? [],
    dispatches: dispatchesRes.data ?? [],
  };
}
