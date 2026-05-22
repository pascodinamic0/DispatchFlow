import type {
  Dispatch,
  InventoryItem,
  ProcurementRequest,
  Profile,
} from "@/types";

export type RequestWithRequester = ProcurementRequest & {
  requester: Pick<Profile, "full_name"> | null;
};

export type DispatchWithRequest = Dispatch & {
  request: Pick<ProcurementRequest, "id" | "title" | "status"> | null;
};

export type InventoryOption = Pick<
  InventoryItem,
  "id" | "name" | "sku" | "unit" | "quantity_on_hand"
>;
