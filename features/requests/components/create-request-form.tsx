"use client";

import { useActionState } from "react";
import {
  saveRequest,
  type RequestActionState,
} from "@/features/requests/actions/request-actions";
import { RequestLineItemsField } from "@/features/requests/components/request-line-items-field";
import type { InventoryOption } from "@/features/requests/components/request-line-items-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: RequestActionState = {};

type Props = {
  inventory: InventoryOption[];
};

export function CreateRequestForm({ inventory }: Props) {
  const [state, formAction, pending] = useActionState(saveRequest, initialState);

  return (
    <form action={formAction} className="mx-auto max-w-lg space-y-4">
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
          required
          placeholder="e.g. Office supplies — Q2"
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          disabled={pending}
          placeholder="What do you need and why?"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      <RequestLineItemsField inventory={inventory} disabled={pending} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            name="priority"
            defaultValue="normal"
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
          <Input id="neededBy" name="neededBy" type="date" disabled={pending} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination / site</Label>
        <Input
          id="destination"
          name="destination"
          placeholder="e.g. Kinshasa HQ"
          disabled={pending}
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" name="intent" value="submit" disabled={pending}>
          {pending ? "Submitting…" : "Submit request"}
        </Button>
        <Button
          type="submit"
          name="intent"
          value="draft"
          variant="outline"
          disabled={pending}
        >
          Save draft
        </Button>
      </div>
    </form>
  );
}
