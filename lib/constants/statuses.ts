import type { DispatchStatus, RequestStatus } from "@/types";

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  draft: "Draft",
  submitted: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  in_dispatch: "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const DISPATCH_STATUS_LABELS: Record<DispatchStatus, string> = {
  pending: "Pending",
  assigned: "Assigned",
  in_transit: "In transit",
  delivered: "Delivered",
  failed: "Failed",
  cancelled: "Cancelled",
};

export const DISPATCH_STATUSES = [
  "pending",
  "assigned",
  "in_transit",
  "delivered",
  "failed",
  "cancelled",
] as const satisfies readonly DispatchStatus[];

export const REQUEST_STATUSES = [
  "draft",
  "submitted",
  "approved",
  "rejected",
  "in_dispatch",
  "delivered",
  "cancelled",
] as const satisfies readonly RequestStatus[];
