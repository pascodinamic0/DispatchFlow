"use client";

import { useActionState } from "react";
import {
  updateDraftRequest,
  type RequestActionState,
} from "@/features/requests/actions/request-actions";
import { RequestLineItemsField } from "@/features/requests/components/request-line-items-field";
import type { InventoryOption } from "@/features/requests/components/request-line-items-field";
import type { LineItemInput } from "@/services/request-line-items.service";
import type { ProcurementRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: RequestActionState = {};

type Props = {
  request: ProcurementRequest;
  inventory: InventoryOption[];
  lineItems: LineItemInput[];
};

export function EditRequestForm({ request, inventory, lineItems }: Props) {
  const [state, formAction, pending] = useActionState(
    updateDraftRequest,
    initialState,
  );

  const neededBy = request.needed_by
    ? new Date(request.needed_by).toISOString().slice(0, 10)
    : "";

  return (
    <form action={formAction} className="mx-auto max-w-lg space-y-4">
      <input type="hidden" name="requestId" value={request.id} />
      {state.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={request.title}
          required
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={request.description ?? ""}
          disabled={pending}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      <RequestLineItemsField
        inventory={inventory}
        initialItems={lineItems}
        disabled={pending}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            name="priority"
            defaultValue={request.priority}
            disabled={pending}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="neededBy">Needed by</Label>
          <Input
            id="neededBy"
            name="neededBy"
            type="date"
            defaultValue={neededBy}
            disabled={pending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination / site</Label>
        <Input
          id="destination"
          name="destination"
          defaultValue={request.destination ?? ""}
          disabled={pending}
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save draft"}
      </Button>
    </form>
  );
}
