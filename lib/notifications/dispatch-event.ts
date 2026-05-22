import type { SupabaseClient } from "@supabase/supabase-js";
import {
  dispatchStatusPayload,
  inventoryLowStockPayload,
  requestCancelledPayload,
  requestDeliveredPayload,
  requestInDispatchPayload,
} from "@/lib/notifications/events";
import {
  notifyUsers,
  notifyUsersWithRole,
} from "@/services/notification-delivery.service";
import type { Database, DispatchStatus } from "@/types";

type Client = SupabaseClient<Database>;

export async function notifyDispatchStatusChange(
  supabase: Client,
  input: {
    organizationId: string;
    actorUserId: string;
    dispatchId: string;
    referenceCode: string;
    status: DispatchStatus;
    requesterId?: string | null;
  },
) {
  const payload = dispatchStatusPayload(
    input.referenceCode,
    input.dispatchId,
    input.status,
  );

  const userIds: string[] = [];
  if (input.requesterId) userIds.push(input.requesterId);

  if (userIds.length > 0) {
    await notifyUsers(supabase, {
      organizationId: input.organizationId,
      userIds,
      payload,
      actorUserId: input.actorUserId,
    });
  }

  if (input.status === "failed") {
    await notifyUsersWithRole(supabase, {
      organizationId: input.organizationId,
      roles: ["admin", "dispatcher"],
      payload,
      actorUserId: input.actorUserId,
    });
  }

  if (input.status === "assigned" || input.status === "pending") {
    await notifyUsersWithRole(supabase, {
      organizationId: input.organizationId,
      roles: ["admin", "dispatcher"],
      payload,
      actorUserId: input.actorUserId,
    });
  }
}

export async function notifyRequestInDispatch(
  supabase: Client,
  input: {
    organizationId: string;
    actorUserId: string;
    requestId: string;
    title: string;
    requesterId: string;
  },
) {
  await notifyUsers(supabase, {
    organizationId: input.organizationId,
    userIds: [input.requesterId],
    payload: requestInDispatchPayload(input.title, input.requestId),
    actorUserId: input.actorUserId,
  });
}

export async function notifyRequestCancelled(
  supabase: Client,
  input: {
    organizationId: string;
    actorUserId: string;
    requestId: string;
    title: string;
    requesterId: string;
  },
) {
  await notifyUsers(supabase, {
    organizationId: input.organizationId,
    userIds: [input.requesterId],
    payload: requestCancelledPayload(input.title, input.requestId),
    actorUserId: input.actorUserId,
  });

  await notifyUsersWithRole(supabase, {
    organizationId: input.organizationId,
    roles: ["admin", "procurement"],
    payload: requestCancelledPayload(input.title, input.requestId),
    actorUserId: input.actorUserId,
  });
}

export async function notifyRequestDelivered(
  supabase: Client,
  input: {
    organizationId: string;
    actorUserId: string;
    requestId: string;
    title: string;
    requesterId: string;
  },
) {
  await notifyUsers(supabase, {
    organizationId: input.organizationId,
    userIds: [input.requesterId],
    payload: requestDeliveredPayload(input.title, input.requestId),
    actorUserId: input.actorUserId,
  });
}

export async function notifyInventoryLowStock(
  supabase: Client,
  input: {
    organizationId: string;
    actorUserId: string;
    itemId: string;
    sku: string;
    name: string;
  },
) {
  await notifyUsersWithRole(supabase, {
    organizationId: input.organizationId,
    roles: ["admin", "procurement", "dispatcher"],
    payload: inventoryLowStockPayload(input.sku, input.name, input.itemId),
    actorUserId: input.actorUserId,
  });
}
