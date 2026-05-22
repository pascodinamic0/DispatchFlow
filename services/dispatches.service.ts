import type { DbClient } from "@/lib/supabase/types";
import { mapSupabaseError } from "@/lib/supabase/errors";
import type { Dispatch, DispatchStatus, DispatchWithRequest } from "@/types";

export async function listDispatches(
  supabase: DbClient,
  organizationId: string,
  options?: { status?: DispatchStatus; limit?: number },
): Promise<DispatchWithRequest[]> {
  let query = supabase
    .from("dispatches")
    .select("*, request:procurement_requests!request_id(id, title, status)")
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
  return (data ?? []) as DispatchWithRequest[];
}

export async function getDispatchById(
  supabase: DbClient,
  id: string,
): Promise<DispatchWithRequest | null> {
  const { data, error } = await supabase
    .from("dispatches")
    .select("*, request:procurement_requests!request_id(id, title, status)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw mapSupabaseError(error);
  return data as DispatchWithRequest | null;
}

export async function createDispatch(
  supabase: DbClient,
  input: {
    organizationId: string;
    requestId?: string | null;
    referenceCode: string;
    origin?: string | null;
    destination?: string | null;
    assigneeName?: string | null;
    scheduledAt?: string | null;
    notes?: string | null;
    status?: DispatchStatus;
  },
): Promise<Dispatch> {
  const { data, error } = await supabase
    .from("dispatches")
    .insert({
      organization_id: input.organizationId,
      request_id: input.requestId ?? null,
      reference_code: input.referenceCode,
      origin: input.origin ?? null,
      destination: input.destination ?? null,
      assignee_name: input.assigneeName ?? null,
      scheduled_at: input.scheduledAt ?? null,
      notes: input.notes ?? null,
      status: input.status ?? "pending",
    })
    .select("*")
    .single();

  if (error) throw mapSupabaseError(error);
  return data;
}

export async function updateDispatch(
  supabase: DbClient,
  id: string,
  patch: {
    status?: DispatchStatus;
    assigneeName?: string | null;
    origin?: string | null;
    destination?: string | null;
    scheduledAt?: string | null;
    deliveredAt?: string | null;
    notes?: string | null;
  },
): Promise<Dispatch> {
  const { data, error } = await supabase
    .from("dispatches")
    .update({
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.assigneeName !== undefined
        ? { assignee_name: patch.assigneeName }
        : {}),
      ...(patch.origin !== undefined ? { origin: patch.origin } : {}),
      ...(patch.destination !== undefined
        ? { destination: patch.destination }
        : {}),
      ...(patch.scheduledAt !== undefined
        ? { scheduled_at: patch.scheduledAt }
        : {}),
      ...(patch.deliveredAt !== undefined
        ? { delivered_at: patch.deliveredAt }
        : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw mapSupabaseError(error);
  return data;
}

export async function countDispatchesByStatus(
  supabase: DbClient,
  organizationId: string,
): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("dispatches")
    .select("status")
    .eq("organization_id", organizationId);

  if (error) throw mapSupabaseError(error);

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

export function generateReferenceCode(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DSP-${y}${m}${d}-${rand}`;
}

export async function getDispatchesForRequest(
  supabase: DbClient,
  requestId: string,
): Promise<Dispatch[]> {
  const { data, error } = await supabase
    .from("dispatches")
    .select("*")
    .eq("request_id", requestId)
    .order("created_at", { ascending: false });

  if (error) throw mapSupabaseError(error);
  return data ?? [];
}
