import type { DbClient } from "@/lib/supabase/types";
import { mapSupabaseError } from "@/lib/supabase/errors";
import type { Database, InventoryItem, InventoryMovementType } from "@/types";


export type InventoryItemRow = InventoryItem;

export type InventoryMovementRow = Database["public"]["Tables"]["inventory_movements"]["Row"];

export async function listInventoryItems(
  supabase: DbClient,
  organizationId: string,
  options?: { lowStockOnly?: boolean },
): Promise<InventoryItemRow[]> {
  const query = supabase
    .from("inventory_items")
    .select("*")
    .eq("organization_id", organizationId)
    .order("name", { ascending: true });

  const { data, error } = await query;
  if (error) throw mapSupabaseError(error);

  let items = data ?? [];
  if (options?.lowStockOnly) {
    items = items.filter(
      (item) => Number(item.quantity_on_hand) <= Number(item.reorder_level),
    );
  }
  return items;
}

export async function getInventoryItemById(
  supabase: DbClient,
  id: string,
): Promise<InventoryItemRow | null> {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw mapSupabaseError(error);
  return data;
}

export async function createInventoryItem(
  supabase: DbClient,
  input: {
    organizationId: string;
    sku: string;
    name: string;
    description?: string | null;
    category?: string | null;
    unit?: string;
    quantityOnHand?: number;
    reorderLevel?: number;
    location?: string | null;
  },
): Promise<InventoryItemRow> {
  const { data, error } = await supabase
    .from("inventory_items")
    .insert({
      organization_id: input.organizationId,
      sku: input.sku,
      name: input.name,
      description: input.description ?? null,
      category: input.category ?? null,
      unit: input.unit ?? "ea",
      quantity_on_hand: input.quantityOnHand ?? 0,
      reorder_level: input.reorderLevel ?? 0,
      location: input.location ?? null,
    })
    .select("*")
    .single();

  if (error) throw mapSupabaseError(error);
  return data;
}

export async function listMovementsForItem(
  supabase: DbClient,
  itemId: string,
  limit = 20,
): Promise<InventoryMovementRow[]> {
  const { data, error } = await supabase
    .from("inventory_movements")
    .select("*")
    .eq("item_id", itemId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw mapSupabaseError(error);
  return data ?? [];
}

export async function recordInventoryMovement(
  supabase: DbClient,
  input: {
    organizationId: string;
    itemId: string;
    movementType: InventoryMovementType;
    quantity: number;
    notes?: string | null;
    createdBy: string;
  },
): Promise<InventoryItemRow> {
  const item = await getInventoryItemById(supabase, input.itemId);
  if (!item || item.organization_id !== input.organizationId) {
    throw new Error("Inventory item not found");
  }

  const current = Number(item.quantity_on_hand);
  let next = current;

  if (input.movementType === "in") {
    next = current + input.quantity;
  } else if (input.movementType === "out") {
    next = current - input.quantity;
    if (next < 0) {
      throw new Error("Insufficient stock for this movement");
    }
  } else {
    next = input.quantity;
  }

  const { error: movementError } = await supabase
    .from("inventory_movements")
    .insert({
      organization_id: input.organizationId,
      item_id: input.itemId,
      movement_type: input.movementType,
      quantity: input.quantity,
      notes: input.notes ?? null,
      created_by: input.createdBy,
    });

  if (movementError) throw mapSupabaseError(movementError);

  const { data: updated, error: updateError } = await supabase
    .from("inventory_items")
    .update({
      quantity_on_hand: next,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.itemId)
    .select("*")
    .single();

  if (updateError) throw mapSupabaseError(updateError);
  return updated;
}

export async function countLowStockItems(
  supabase: DbClient,
  organizationId: string,
): Promise<number> {
  const items = await listInventoryItems(supabase, organizationId, {
    lowStockOnly: true,
  });
  return items.length;
}
