import type { Database } from "./database";

export type {
  Database,
  DispatchStatus,
  InventoryMovementType,
  Json,
  RequestStatus,
  UserRole,
} from "./database";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProcurementRequest =
  Database["public"]["Tables"]["procurement_requests"]["Row"];
export type Dispatch = Database["public"]["Tables"]["dispatches"]["Row"];
export type InventoryItem =
  Database["public"]["Tables"]["inventory_items"]["Row"];
export type InventoryMovement =
  Database["public"]["Tables"]["inventory_movements"]["Row"];
export type AppNotification =
  Database["public"]["Tables"]["notifications"]["Row"];
export type OrganizationInvite =
  Database["public"]["Tables"]["organization_invites"]["Row"];
export type RequestLineItem =
  Database["public"]["Tables"]["request_line_items"]["Row"];

export type {
  DispatchWithRequest,
  InventoryOption,
  RequestWithRequester,
} from "./entities";
