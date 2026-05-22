import type { DbClient } from "@/lib/supabase/types";
import { mapSupabaseError } from "@/lib/supabase/errors";
import type { Database, InventoryItem } from "@/types";


export type RequestLineItem = Database["public"]["Tables"]["request_line_items"]["Row"];

export type RequestLineItemWithInventory = RequestLineItem & {
  item: Pick<
    InventoryItem,
    "id" | "sku" | "name" | "unit" | "quantity_on_hand"
  > | null;
};

export type LineItemInput = {
  inventoryItemId: string;
  quantity: number;
  notes?: string | null;
};

export async function listLineItemsForRequest(
  supabase: DbClient,
  requestId: string,
): Promise<RequestLineItemWithInventory[]> {
  const { data, error } = await supabase
    .from("request_line_items")
    .select(
      "*, item:inventory_items(id, sku, name, unit, quantity_on_hand)",
    )
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });

  if (error) throw mapSupabaseError(error);
  return (data ?? []) as RequestLineItemWithInventory[];
}

export async function replaceRequestLineItems(
  supabase: DbClient,
  input: {
    organizationId: string;
    requestId: string;
    items: LineItemInput[];
  },
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("request_line_items")
    .delete()
    .eq("request_id", input.requestId);

  if (deleteError) throw mapSupabaseError(deleteError);

  if (input.items.length === 0) return;

  const rows = input.items.map((item) => ({
    organization_id: input.organizationId,
    request_id: input.requestId,
    inventory_item_id: item.inventoryItemId,
    quantity: item.quantity,
    notes: item.notes ?? null,
  }));

  const { error } = await supabase.from("request_line_items").insert(rows);
  if (error) throw mapSupabaseError(error);
}

export function parseLineItemsFromFormData(formData: FormData): LineItemInput[] {
  const raw = formData.get("lineItems");
  if (!raw || typeof raw !== "string" || raw === "[]") return [];

  try {
    const parsed = JSON.parse(raw) as LineItemInput[];
    return parsed.filter(
      (row) =>
        row.inventoryItemId &&
        typeof row.quantity === "number" &&
        row.quantity > 0,
    );
  } catch {
    return [];
  }
}
