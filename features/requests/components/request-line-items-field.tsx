"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LineItemInput } from "@/services/request-line-items.service";

export type InventoryOption = {
  id: string;
  sku: string;
  name: string;
  unit: string;
  quantityOnHand: number;
};

type Props = {
  inventory: InventoryOption[];
  initialItems?: LineItemInput[];
  disabled?: boolean;
};

export function RequestLineItemsField({
  inventory,
  initialItems = [],
  disabled,
}: Props) {
  const [rows, setRows] = useState<LineItemInput[]>(
    initialItems.length > 0
      ? initialItems
      : [{ inventoryItemId: "", quantity: 1 }],
  );

  function updateRow(index: number, patch: Partial<LineItemInput>) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function addRow() {
    setRows((prev) => [...prev, { inventoryItemId: "", quantity: 1 }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  const serialized = JSON.stringify(
    rows.filter((r) => r.inventoryItemId && r.quantity > 0),
  );

  if (inventory.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Add inventory items first to link stock to this request.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Inventory items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={disabled}
          onClick={addRow}
        >
          <Plus className="size-3.5" />
          Add line
        </Button>
      </div>
      <input type="hidden" name="lineItems" value={serialized} readOnly />
      <ul className="space-y-2">
        {rows.map((row, index) => {
          const item = inventory.find((i) => i.id === row.inventoryItemId);
          return (
            <li
              key={index}
              className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_6rem_auto]"
            >
              <select
                value={row.inventoryItemId}
                disabled={disabled}
                onChange={(e) =>
                  updateRow(index, { inventoryItemId: e.target.value })
                }
                className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-label={`Inventory item ${index + 1}`}
              >
                <option value="">Select item…</option>
                {inventory.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.sku} — {inv.name} ({inv.quantityOnHand} {inv.unit})
                  </option>
                ))}
              </select>
              <Input
                type="number"
                min={0.01}
                step="any"
                value={row.quantity}
                disabled={disabled}
                onChange={(e) =>
                  updateRow(index, { quantity: Number(e.target.value) })
                }
                aria-label="Quantity"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled || rows.length === 1}
                onClick={() => removeRow(index)}
                aria-label="Remove line"
              >
                <Trash2 className="size-4 text-muted-foreground" />
              </Button>
              {item ? (
                <p className="col-span-full text-xs text-muted-foreground sm:col-span-3">
                  On hand: {item.quantityOnHand} {item.unit}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
