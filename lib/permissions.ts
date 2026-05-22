import type { DispatchStatus, RequestStatus, UserRole } from "@/types";

const PROCUREMENT_ROLES: UserRole[] = ["admin", "procurement"];
const DISPATCH_ROLES: UserRole[] = ["admin", "dispatcher"];
const INVENTORY_ROLES: UserRole[] = ["admin", "procurement", "dispatcher"];
const REQUEST_WRITE_ROLES: UserRole[] = ["admin", "requester", "procurement"];

export function canApproveRequests(role: UserRole): boolean {
  return PROCUREMENT_ROLES.includes(role);
}

export function canManageDispatches(role: UserRole): boolean {
  return DISPATCH_ROLES.includes(role);
}

export function canManageInventory(role: UserRole): boolean {
  return INVENTORY_ROLES.includes(role);
}

export function canCreateRequests(role: UserRole): boolean {
  return REQUEST_WRITE_ROLES.includes(role);
}

export function canManageOrganization(role: UserRole): boolean {
  return role === "admin";
}

export function canManageTeamRoles(role: UserRole): boolean {
  return role === "admin";
}

export function canTransitionRequest(
  role: UserRole,
  from: RequestStatus,
  to: RequestStatus,
  isOwner: boolean,
): boolean {
  if (role === "admin") return true;
  if (role === "viewer") return false;

  if (to === "cancelled") {
    return isOwner && (from === "draft" || from === "submitted");
  }

  if (role === "procurement") {
    if (from === "submitted" && (to === "approved" || to === "rejected")) return true;
    if (from === "approved" && to === "in_dispatch") return true;
  }

  if (role === "requester" && isOwner) {
    if (from === "draft" && to === "submitted") return true;
  }

  if (role === "dispatcher" && from === "in_dispatch" && to === "delivered") {
    return true;
  }

  return false;
}

export function canTransitionDispatch(
  role: UserRole,
  from: DispatchStatus,
  to: DispatchStatus,
): boolean {
  if (role === "admin" || role === "dispatcher") {
    const allowed: Record<DispatchStatus, DispatchStatus[]> = {
      pending: ["assigned", "cancelled"],
      assigned: ["in_transit", "cancelled", "failed"],
      in_transit: ["delivered", "failed", "cancelled"],
      delivered: [],
      failed: ["pending", "cancelled"],
      cancelled: [],
    };
    return allowed[from]?.includes(to) ?? false;
  }
  return false;
}

export function assertPermission(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}
