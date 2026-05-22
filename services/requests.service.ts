import type { DbClient } from "@/lib/supabase/types";
import { mapSupabaseError } from "@/lib/supabase/errors";
import type {
  Database,
  ProcurementRequest,
  RequestStatus,
  RequestWithRequester,
} from "@/types";

export async function listRequests(
  supabase: DbClient,
  organizationId: string,
  options?: { status?: RequestStatus; limit?: number },
): Promise<RequestWithRequester[]> {
  let query = supabase
    .from("procurement_requests")
    .select("*, requester:profiles!requester_id(full_name)")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw mapSupabaseError(error);
  return (data ?? []) as RequestWithRequester[];
}

export async function getRequestById(
  supabase: DbClient,
  id: string,
): Promise<RequestWithRequester | null> {
  const { data, error } = await supabase
    .from("procurement_requests")
    .select("*, requester:profiles!requester_id(full_name)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw mapSupabaseError(error);
  return data as RequestWithRequester | null;
}

export async function createRequest(
  supabase: DbClient,
  input: {
    organizationId: string;
    requesterId: string;
    title: string;
    description?: string | null;
    priority: ProcurementRequest["priority"];
    destination?: string | null;
    neededBy?: string | null;
    status?: RequestStatus;
  },
): Promise<ProcurementRequest> {
  const { data, error } = await supabase
    .from("procurement_requests")
    .insert({
      organization_id: input.organizationId,
      requester_id: input.requesterId,
      title: input.title,
      description: input.description ?? null,
      priority: input.priority,
      destination: input.destination ?? null,
      needed_by: input.neededBy ?? null,
      status: input.status ?? "draft",
    })
    .select("*")
    .single();

  if (error) throw mapSupabaseError(error);
  return data;
}

export async function updateRequestStatus(
  supabase: DbClient,
  id: string,
  status: RequestStatus,
): Promise<ProcurementRequest> {
  const { data, error } = await supabase
    .from("procurement_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw mapSupabaseError(error);
  return data;
}

export async function updateRequest(
  supabase: DbClient,
  id: string,
  patch: {
    title?: string;
    description?: string | null;
    priority?: ProcurementRequest["priority"];
    destination?: string | null;
    neededBy?: string | null;
  },
): Promise<ProcurementRequest> {
  const update: Database["public"]["Tables"]["procurement_requests"]["Update"] =
    { updated_at: new Date().toISOString() };

  if (patch.title !== undefined) update.title = patch.title;
  if (patch.description !== undefined) update.description = patch.description;
  if (patch.priority !== undefined) update.priority = patch.priority;
  if (patch.destination !== undefined) update.destination = patch.destination;
  if (patch.neededBy !== undefined) update.needed_by = patch.neededBy;

  const { data, error } = await supabase
    .from("procurement_requests")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw mapSupabaseError(error);
  return data;
}

export async function countRequestsByStatus(
  supabase: DbClient,
  organizationId: string,
): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("procurement_requests")
    .select("status")
    .eq("organization_id", organizationId);

  if (error) throw mapSupabaseError(error);

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}
