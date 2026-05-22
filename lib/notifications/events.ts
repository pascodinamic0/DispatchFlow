import type { NotificationPayload } from "@/services/notification-delivery.service";

export function requestSubmittedPayload(
  title: string,
  requestId: string,
): NotificationPayload {
  return {
    type: "request.submitted",
    title: "New request submitted",
    body: `"${title}" is awaiting approval.`,
    href: `/requests/${requestId}`,
  };
}

export function requestApprovedPayload(
  title: string,
  requestId: string,
): NotificationPayload {
  return {
    type: "request.approved",
    title: "Request approved",
    body: `"${title}" was approved and can move to dispatch.`,
    href: `/requests/${requestId}`,
  };
}

export function requestRejectedPayload(
  title: string,
  requestId: string,
): NotificationPayload {
  return {
    type: "request.rejected",
    title: "Request rejected",
    body: `"${title}" was rejected.`,
    href: `/requests/${requestId}`,
  };
}

export function requestCancelledPayload(
  title: string,
  requestId: string,
): NotificationPayload {
  return {
    type: "request.cancelled",
    title: "Request cancelled",
    body: `"${title}" was cancelled.`,
    href: `/requests/${requestId}`,
  };
}

export function requestDeliveredPayload(
  title: string,
  requestId: string,
): NotificationPayload {
  return {
    type: "request.delivered",
    title: "Request delivered",
    body: `"${title}" was marked delivered.`,
    href: `/requests/${requestId}`,
  };
}

export function requestInDispatchPayload(
  title: string,
  requestId: string,
): NotificationPayload {
  return {
    type: "request.in_dispatch",
    title: "Request in dispatch",
    body: `"${title}" is now in dispatch.`,
    href: `/requests/${requestId}`,
  };
}

export function dispatchCreatedPayload(
  referenceCode: string,
  dispatchId: string,
): NotificationPayload {
  return {
    type: "dispatch.created",
    title: "Dispatch created",
    body: `${referenceCode} was created.`,
    href: `/dispatches/${dispatchId}`,
  };
}

export function dispatchStatusPayload(
  referenceCode: string,
  dispatchId: string,
  status: string,
): NotificationPayload {
  const label = status.replace(/_/g, " ");
  return {
    type: `dispatch.${status}`,
    title: `Dispatch ${label}`,
    body: `${referenceCode} is now ${label}.`,
    href: `/dispatches/${dispatchId}`,
  };
}

export function inventoryLowStockPayload(
  sku: string,
  name: string,
  itemId: string,
): NotificationPayload {
  return {
    type: "inventory.low_stock",
    title: "Low stock alert",
    body: `${sku} — ${name} is at or below reorder level.`,
    href: `/inventory/${itemId}`,
  };
}
