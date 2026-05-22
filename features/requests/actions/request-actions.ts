"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createRequestSchema } from "@/features/requests/schemas/request-schema";
import { requireProfile } from "@/lib/auth/session";
import { getErrorMessage } from "@/lib/errors";
import {
  notifyRequestCancelled,
  notifyRequestDelivered,
} from "@/lib/notifications/dispatch-event";
import {
  requestApprovedPayload,
  requestRejectedPayload,
  requestSubmittedPayload,
} from "@/lib/notifications/events";
import {
  assertPermission,
  canCreateRequests,
  canTransitionRequest,
} from "@/lib/permissions";
import {
  notifyUsers,
  notifyUsersWithRole,
} from "@/services/notification-delivery.service";
import { revalidateRequests } from "@/lib/cache/revalidate";
import {
  parseLineItemsFromFormData,
  replaceRequestLineItems,
} from "@/services/request-line-items.service";
import {
  createRequest,
  getRequestById,
  updateRequest,
  updateRequestStatus,
} from "@/services/requests.service";
import type { RequestStatus } from "@/types";

export type RequestActionState = {
  error?: string;
  requestId?: string;
};

function parseRequestForm(formData: FormData) {
  return createRequestSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority") ?? "normal",
    destination: formData.get("destination"),
    neededBy: formData.get("neededBy"),
  });
}

async function saveRequestFromForm(
  formData: FormData,
  status: "draft" | "submitted",
): Promise<RequestActionState> {
  const parsed = parseRequestForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const { supabase, user, profile } = await requireProfile();
    assertPermission(canCreateRequests(profile.role), "You cannot create requests");

    const neededBy = parsed.data.neededBy
      ? new Date(parsed.data.neededBy).toISOString()
      : null;

    const request = await createRequest(supabase, {
      organizationId: profile.organization_id,
      requesterId: user.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      priority: parsed.data.priority,
      destination: parsed.data.destination || null,
      neededBy,
      status,
    });

    const lineItems = parseLineItemsFromFormData(formData);
    if (lineItems.length > 0) {
      await replaceRequestLineItems(supabase, {
        organizationId: profile.organization_id,
        requestId: request.id,
        items: lineItems,
      });
    }

    if (status === "submitted") {
      await notifyUsersWithRole(supabase, {
        organizationId: profile.organization_id,
        roles: ["admin", "procurement"],
        payload: requestSubmittedPayload(request.title, request.id),
        actorUserId: user.id,
      });
    }

    revalidateRequests();
    return { requestId: request.id };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

async function transitionRequest(
  requestId: string,
  to: RequestStatus,
): Promise<RequestActionState> {
  try {
    const { supabase, user, profile } = await requireProfile();
    const request = await getRequestById(supabase, requestId);

    if (!request || request.organization_id !== profile.organization_id) {
      return { error: "Request not found" };
    }

    const isOwner = request.requester_id === user.id;
    assertPermission(
      canTransitionRequest(profile.role, request.status, to, isOwner),
      "You do not have permission for this action",
    );

    await updateRequestStatus(supabase, requestId, to);

    const ctx = {
      organizationId: profile.organization_id,
      actorUserId: user.id,
      requestId,
      title: request.title,
      requesterId: request.requester_id,
    };

    if (to === "submitted") {
      await notifyUsersWithRole(supabase, {
        organizationId: ctx.organizationId,
        roles: ["admin", "procurement"],
        payload: requestSubmittedPayload(ctx.title, ctx.requestId),
        actorUserId: ctx.actorUserId,
      });
    }
    if (to === "approved") {
      await notifyUsers(supabase, {
        organizationId: ctx.organizationId,
        userIds: [ctx.requesterId],
        payload: requestApprovedPayload(ctx.title, ctx.requestId),
        actorUserId: ctx.actorUserId,
      });
    }
    if (to === "rejected") {
      await notifyUsers(supabase, {
        organizationId: ctx.organizationId,
        userIds: [ctx.requesterId],
        payload: requestRejectedPayload(ctx.title, ctx.requestId),
        actorUserId: ctx.actorUserId,
      });
    }
    if (to === "cancelled") {
      await notifyRequestCancelled(supabase, ctx);
    }
    if (to === "delivered") {
      await notifyRequestDelivered(supabase, ctx);
    }

    revalidateRequests(requestId);
    revalidatePath("/dispatches");
    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function saveRequest(
  _prev: RequestActionState,
  formData: FormData,
): Promise<RequestActionState> {
  const intent = formData.get("intent");
  const status = intent === "draft" ? "draft" : "submitted";
  const result = await saveRequestFromForm(formData, status);
  if (result.error) return result;

  if (status === "draft" && result.requestId) {
    redirect(`/requests/${result.requestId}`);
  }
  redirect("/requests");
}

/** @deprecated use saveRequest */
export async function saveDraftRequest(
  prev: RequestActionState,
  formData: FormData,
) {
  formData.set("intent", "draft");
  return saveRequest(prev, formData);
}

/** @deprecated use saveRequest */
export async function createProcurementRequest(
  prev: RequestActionState,
  formData: FormData,
) {
  formData.set("intent", "submit");
  return saveRequest(prev, formData);
}

export async function updateDraftRequest(
  _prev: RequestActionState,
  formData: FormData,
): Promise<RequestActionState> {
  const requestId = formData.get("requestId");
  if (typeof requestId !== "string" || !requestId) {
    return { error: "Request not found" };
  }

  const parsed = parseRequestForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const { supabase, user, profile } = await requireProfile();
    const request = await getRequestById(supabase, requestId);

    if (!request || request.organization_id !== profile.organization_id) {
      return { error: "Request not found" };
    }
    if (request.status !== "draft" || request.requester_id !== user.id) {
      return { error: "Only your draft requests can be edited" };
    }

    const neededBy = parsed.data.neededBy
      ? new Date(parsed.data.neededBy).toISOString()
      : null;

    await updateRequest(supabase, requestId, {
      title: parsed.data.title,
      description: parsed.data.description || null,
      priority: parsed.data.priority,
      destination: parsed.data.destination || null,
      neededBy,
    });

    const lineItems = parseLineItemsFromFormData(formData);
    await replaceRequestLineItems(supabase, {
      organizationId: profile.organization_id,
      requestId,
      items: lineItems,
    });

    revalidateRequests(requestId);
    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function submitDraftRequest(
  requestId: string,
): Promise<RequestActionState> {
  try {
    const { supabase, user, profile } = await requireProfile();
    const request = await getRequestById(supabase, requestId);

    if (!request || request.organization_id !== profile.organization_id) {
      return { error: "Request not found" };
    }

    const isOwner = request.requester_id === user.id;
    assertPermission(
      canTransitionRequest(profile.role, request.status, "submitted", isOwner),
      "You cannot submit this request",
    );

    await updateRequestStatus(supabase, requestId, "submitted");

    await notifyUsersWithRole(supabase, {
      organizationId: profile.organization_id,
      roles: ["admin", "procurement"],
      payload: requestSubmittedPayload(request.title, requestId),
      actorUserId: user.id,
    });

    revalidateRequests(requestId);
    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function approveRequest(requestId: string) {
  return transitionRequest(requestId, "approved");
}

export async function rejectRequest(requestId: string) {
  return transitionRequest(requestId, "rejected");
}

export async function cancelRequest(requestId: string) {
  return transitionRequest(requestId, "cancelled");
}

export async function markRequestDelivered(requestId: string) {
  return transitionRequest(requestId, "delivered");
}

export async function submitRequestStatus(
  requestId: string,
  status: RequestStatus,
): Promise<RequestActionState> {
  return transitionRequest(requestId, status);
}
