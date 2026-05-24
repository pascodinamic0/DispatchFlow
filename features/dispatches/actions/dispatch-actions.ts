"use server";

import { redirect } from "next/navigation";
import {
  createDispatchSchema,
  updateDispatchAssignmentSchema,
} from "@/features/dispatches/schemas/dispatch-schema";
import { revalidateDispatches } from "@/lib/cache/revalidate";
import { requireProfile } from "@/lib/auth/session";
import { getErrorMessage } from "@/lib/errors";
import {
  assertPermission,
  canManageDispatches,
  canTransitionDispatch,
} from "@/lib/permissions";
import { dispatchCreatedPayload } from "@/lib/notifications/events";
import {
  notifyUsers,
  notifyUsersWithRole,
} from "@/services/notification-delivery.service";
import {
  createDispatch,
  generateReferenceCode,
  getDispatchById,
  updateDispatch,
} from "@/services/dispatches.service";
import { getRequestById, updateRequestStatus } from "@/services/requests.service";
import type { DispatchStatus } from "@/types";

export type DispatchActionState = {
  error?: string;
};

export async function createDispatchAction(
  _prev: DispatchActionState,
  formData: FormData,
): Promise<DispatchActionState> {
  const parsed = createDispatchSchema.safeParse({
    requestId: formData.get("requestId"),
    origin: formData.get("origin"),
    destination: formData.get("destination"),
    assigneeName: formData.get("assigneeName"),
    scheduledAt: formData.get("scheduledAt"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const { supabase, profile } = await requireProfile();
    assertPermission(
      canManageDispatches(profile.role),
      "You do not have permission to create dispatches",
    );

    const requestId = parsed.data.requestId || null;
    let destination = parsed.data.destination || null;

    if (requestId) {
      const request = await getRequestById(supabase, requestId);
      if (!request || request.organization_id !== profile.organization_id) {
        return { error: "Linked request not found" };
      }
      if (request.status !== "approved") {
        return { error: "Only approved requests can be dispatched" };
      }
      destination = destination ?? request.destination;
    }

    const dispatch = await createDispatch(supabase, {
      organizationId: profile.organization_id,
      requestId,
      referenceCode: generateReferenceCode(),
      origin: parsed.data.origin || null,
      destination,
      assigneeName: parsed.data.assigneeName || null,
      scheduledAt: parsed.data.scheduledAt
        ? new Date(parsed.data.scheduledAt).toISOString()
        : null,
      notes: parsed.data.notes || null,
      status: parsed.data.assigneeName ? "assigned" : "pending",
    });

    if (requestId) {
      const linked = await getRequestById(supabase, requestId);
      await updateRequestStatus(supabase, requestId, "in_dispatch");
      if (linked) {
        await notifyUsers(supabase, {
          organizationId: profile.organization_id,
          userIds: [linked.requester_id],
          payload: dispatchCreatedPayload(
            dispatch.reference_code,
            dispatch.id,
          ),
        });
      }
    } else {
      await notifyUsersWithRole(supabase, {
        organizationId: profile.organization_id,
        roles: ["admin", "dispatcher"],
        payload: dispatchCreatedPayload(
          dispatch.reference_code,
          dispatch.id,
        ),
      });
    }

    revalidateDispatches(undefined, requestId ?? undefined);
    redirect(`/dispatches/${dispatch.id}`);
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function createDispatchFromRequest(
  requestId: string,
): Promise<DispatchActionState & { dispatchId?: string }> {
  try {
    const { supabase, profile } = await requireProfile();
    assertPermission(
      canManageDispatches(profile.role),
      "You do not have permission to create dispatches",
    );

    const request = await getRequestById(supabase, requestId);
    if (!request || request.organization_id !== profile.organization_id) {
      return { error: "Request not found" };
    }
    if (request.status !== "approved") {
      return { error: "Request must be approved before dispatch" };
    }

    const dispatch = await createDispatch(supabase, {
      organizationId: profile.organization_id,
      requestId,
      referenceCode: generateReferenceCode(),
      destination: request.destination,
      status: "pending",
    });

    await updateRequestStatus(supabase, requestId, "in_dispatch");

    await notifyUsers(supabase, {
      organizationId: profile.organization_id,
      userIds: [request.requester_id],
      payload: dispatchCreatedPayload(
        dispatch.reference_code,
        dispatch.id,
      ),
    });

    revalidateDispatches(undefined, requestId);
    return { dispatchId: dispatch.id };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updateDispatchStatusAction(
  dispatchId: string,
  status: DispatchStatus,
  assigneeName?: string,
): Promise<DispatchActionState> {
  try {
    const { supabase, profile } = await requireProfile();
    assertPermission(
      canManageDispatches(profile.role),
      "You do not have permission to update dispatches",
    );

    const dispatch = await getDispatchById(supabase, dispatchId);
    if (!dispatch || dispatch.organization_id !== profile.organization_id) {
      return { error: "Dispatch not found" };
    }

    assertPermission(
      canTransitionDispatch(profile.role, dispatch.status, status),
      `Cannot change status from ${dispatch.status} to ${status}`,
    );

    if (
      status === "assigned" &&
      !assigneeName?.trim() &&
      !dispatch.assignee_name?.trim()
    ) {
      return {
        error:
          "Add an assignee in the assignment section below before marking as assigned.",
      };
    }

    const patch: Parameters<typeof updateDispatch>[2] = { status };
    if (assigneeName !== undefined) {
      patch.assigneeName = assigneeName || null;
    }
    if (status === "delivered") {
      patch.deliveredAt = new Date().toISOString();
    }

    await updateDispatch(supabase, dispatchId, patch);

    if (status === "delivered" && dispatch.request_id) {
      await updateRequestStatus(supabase, dispatch.request_id, "delivered");
    }

    revalidateDispatches(dispatchId, dispatch.request_id ?? undefined);
    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updateDispatchAssignmentAction(
  dispatchId: string,
  formData: FormData,
  options?: { markAssigned?: boolean },
): Promise<DispatchActionState> {
  const parsed = updateDispatchAssignmentSchema.safeParse({
    assigneeName: formData.get("assigneeName"),
    origin: formData.get("origin"),
    scheduledAt: formData.get("scheduledAt"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const { supabase, profile } = await requireProfile();
    assertPermission(
      canManageDispatches(profile.role),
      "You do not have permission to update dispatches",
    );

    const dispatch = await getDispatchById(supabase, dispatchId);
    if (!dispatch || dispatch.organization_id !== profile.organization_id) {
      return { error: "Dispatch not found" };
    }

    if (dispatch.status === "delivered" || dispatch.status === "cancelled") {
      return { error: "This dispatch can no longer be edited" };
    }

    const assigneeName = parsed.data.assigneeName.trim();
    const scheduledAt = parsed.data.scheduledAt
      ? new Date(parsed.data.scheduledAt).toISOString()
      : null;

    const nextStatus =
      options?.markAssigned && dispatch.status === "pending"
        ? "assigned"
        : dispatch.status;

    if (
      options?.markAssigned &&
      dispatch.status === "pending" &&
      !canTransitionDispatch(profile.role, dispatch.status, "assigned")
    ) {
      return { error: "Cannot mark this dispatch as assigned" };
    }

    await updateDispatch(supabase, dispatchId, {
      assigneeName,
      origin: parsed.data.origin?.trim() || null,
      scheduledAt,
      status: nextStatus,
    });

    revalidateDispatches(dispatchId, dispatch.request_id ?? undefined);
    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
