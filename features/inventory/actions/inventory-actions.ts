"use server";

import { redirect } from "next/navigation";
import { revalidateInventory } from "@/lib/cache/revalidate";
import {
  createInventoryItemSchema,
  stockMovementSchema,
} from "@/features/inventory/schemas/inventory-schema";
import { requireProfile } from "@/lib/auth/session";
import { getErrorMessage } from "@/lib/errors";
import { assertPermission, canManageInventory } from "@/lib/permissions";
import { notifyInventoryLowStock } from "@/lib/notifications/dispatch-event";
import {
  createInventoryItem,
  getInventoryItemById,
  recordInventoryMovement,
} from "@/services/inventory.service";

export type InventoryActionState = {
  error?: string;
};

export async function createInventoryItemAction(
  _prev: InventoryActionState,
  formData: FormData,
): Promise<InventoryActionState> {
  const parsed = createInventoryItemSchema.safeParse({
    sku: formData.get("sku"),
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    unit: formData.get("unit") ?? "ea",
    quantityOnHand: formData.get("quantityOnHand") ?? 0,
    reorderLevel: formData.get("reorderLevel") ?? 0,
    location: formData.get("location"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const { supabase, profile } = await requireProfile();
    assertPermission(
      canManageInventory(profile.role),
      "You do not have permission to manage inventory",
    );

    const item = await createInventoryItem(supabase, {
      organizationId: profile.organization_id,
      sku: parsed.data.sku,
      name: parsed.data.name,
      description: parsed.data.description || null,
      category: parsed.data.category || null,
      unit: parsed.data.unit,
      quantityOnHand: 0,
      reorderLevel: parsed.data.reorderLevel,
      location: parsed.data.location || null,
    });

    if (parsed.data.quantityOnHand > 0) {
      await recordInventoryMovement(supabase, {
        organizationId: profile.organization_id,
        itemId: item.id,
        movementType: "in",
        quantity: parsed.data.quantityOnHand,
        notes: "Opening balance",
        createdBy: profile.id,
      });
    }

    revalidateInventory();
    redirect(`/inventory/${item.id}`);
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function recordStockMovementAction(
  _prev: InventoryActionState,
  formData: FormData,
): Promise<InventoryActionState> {
  const parsed = stockMovementSchema.safeParse({
    itemId: formData.get("itemId"),
    movementType: formData.get("movementType"),
    quantity: formData.get("quantity"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const { supabase, user, profile } = await requireProfile();
    assertPermission(
      canManageInventory(profile.role),
      "You do not have permission to adjust inventory",
    );

    const item = await getInventoryItemById(supabase, parsed.data.itemId);
    if (!item || item.organization_id !== profile.organization_id) {
      return { error: "Item not found" };
    }

    await recordInventoryMovement(supabase, {
      organizationId: profile.organization_id,
      itemId: parsed.data.itemId,
      movementType: parsed.data.movementType,
      quantity: parsed.data.quantity,
      notes: parsed.data.notes || null,
      createdBy: user.id,
    });

    const updated = await getInventoryItemById(supabase, parsed.data.itemId);
    if (
      updated &&
      Number(updated.quantity_on_hand) <= Number(updated.reorder_level)
    ) {
      await notifyInventoryLowStock(supabase, {
        organizationId: profile.organization_id,
        actorUserId: user.id,
        itemId: updated.id,
        sku: updated.sku,
        name: updated.name,
      });
    }

    revalidateInventory(parsed.data.itemId);
    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
