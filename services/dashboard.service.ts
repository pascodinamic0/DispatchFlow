import type { DbClient } from "@/lib/supabase/types";
import { countDispatchesByStatus, listDispatches } from "@/services/dispatches.service";
import { countLowStockItems } from "@/services/inventory.service";
import { countRequestsByStatus, listRequests } from "@/services/requests.service";
import type { RequestStatus } from "@/types";
import type { RequestWithRequester } from "@/types";
import type { Dispatch } from "@/types";


export type DashboardSnapshot = {
  pendingRequests: number;
  inTransit: number;
  delayedDispatches: number;
  deliveredToday: number;
  lowStockItems: number;
  requestStatusBreakdown: { status: RequestStatus; count: number }[];
  recentRequests: RequestWithRequester[];
  recentDispatches: Dispatch[];
  recentActivity: {
    id: string;
    label: string;
    detail: string;
    at: string;
    type: "request" | "dispatch";
  }[];
};

export async function getDashboardSnapshot(
  supabase: DbClient,
  organizationId: string,
): Promise<DashboardSnapshot> {
  const [requestCounts, dispatchCounts, recentRequests, recentDispatches, lowStockItems] =
    await Promise.all([
      countRequestsByStatus(supabase, organizationId),
      countDispatchesByStatus(supabase, organizationId),
      listRequests(supabase, organizationId, { limit: 5 }),
      listDispatches(supabase, organizationId, { limit: 5 }),
      countLowStockItems(supabase, organizationId).catch(() => 0),
    ]);

  const pendingRequests =
    (requestCounts.submitted ?? 0) + (requestCounts.draft ?? 0);

  const inTransit = dispatchCounts.in_transit ?? 0;
  const delayedDispatches = dispatchCounts.failed ?? 0;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const { data: deliveredTodayRows, error: deliveredError } = await supabase
    .from("dispatches")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("status", "delivered")
    .gte("delivered_at", startOfToday.toISOString());

  if (deliveredError) {
    throw deliveredError;
  }

  const deliveredToday = deliveredTodayRows?.length ?? 0;

  const requestStatusBreakdown = (
    Object.entries(requestCounts) as [RequestStatus, number][]
  )
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({ status, count }));

  const recentActivity = [
    ...recentRequests.map((r) => ({
      id: `req-${r.id}`,
      label: r.title,
      detail: `Request · ${r.status.replace(/_/g, " ")}`,
      at: r.created_at,
      type: "request" as const,
    })),
    ...recentDispatches.map((d) => ({
      id: `disp-${d.id}`,
      label: d.reference_code,
      detail: `Dispatch · ${d.status.replace(/_/g, " ")}`,
      at: d.updated_at,
      type: "dispatch" as const,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  return {
    pendingRequests,
    inTransit,
    delayedDispatches,
    deliveredToday,
    lowStockItems,
    requestStatusBreakdown,
    recentRequests,
    recentDispatches,
    recentActivity,
  };
}
