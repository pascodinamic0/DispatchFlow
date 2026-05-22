"use client";

import { useActionState } from "react";
import {
  recordStockMovementAction,
  type InventoryActionState,
} from "@/features/inventory/actions/inventory-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: InventoryActionState = {};

type Props = {
  itemId: string;
};

export function StockMovementForm({ itemId }: Props) {
  const [state, formAction, pending] = useActionState(
    recordStockMovementAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="itemId" value={itemId} />

      {state.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="movementType">Movement type</Label>
          <select
            id="movementType"
            name="movementType"
            required
            disabled={pending}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            defaultValue="in"
          >
            <option value="in">Stock in</option>
            <option value="out">Stock out</option>
            <option value="adjustment">Set quantity</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min={0.01}
            step="any"
            required
            disabled={pending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" name="notes" placeholder="Reason for adjustment" disabled={pending} />
      </div>

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Recording…" : "Record movement"}
      </Button>
    </form>
  );
}
