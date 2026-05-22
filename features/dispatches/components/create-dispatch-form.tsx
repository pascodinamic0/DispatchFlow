"use client";

import { useActionState } from "react";
import {
  createDispatchAction,
  type DispatchActionState,
} from "@/features/dispatches/actions/dispatch-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: DispatchActionState = {};

type ApprovedRequest = {
  id: string;
  title: string;
  destination: string | null;
};

type Props = {
  requestId?: string;
  defaultDestination?: string | null;
  approvedRequests?: ApprovedRequest[];
};

export function CreateDispatchForm({
  requestId,
  defaultDestination,
  approvedRequests = [],
}: Props) {
  const [state, formAction, pending] = useActionState(
    createDispatchAction,
    initialState,
  );

  return (
    <form action={formAction} className="mx-auto max-w-lg space-y-4">
      {state.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      {requestId ? (
        <input type="hidden" name="requestId" value={requestId} />
      ) : approvedRequests.length > 0 ? (
        <div className="space-y-2">
          <Label htmlFor="requestId">Linked request (optional)</Label>
          <select
            id="requestId"
            name="requestId"
            disabled={pending}
            defaultValue=""
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            <option value="">Standalone dispatch</option>
            {approvedRequests.map((request) => (
              <option key={request.id} value={request.id}>
                {request.title}
                {request.destination ? ` → ${request.destination}` : ""}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          No approved requests available. You can still create a standalone
          dispatch below.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="origin">Origin</Label>
          <Input id="origin" name="origin" placeholder="Warehouse A" disabled={pending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            name="destination"
            defaultValue={defaultDestination ?? ""}
            placeholder="Delivery site"
            disabled={pending}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="assigneeName">Assignee</Label>
          <Input id="assigneeName" name="assigneeName" placeholder="Driver name" disabled={pending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="scheduledAt">Scheduled</Label>
          <Input id="scheduledAt" name="scheduledAt" type="datetime-local" disabled={pending} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          disabled={pending}
          className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create dispatch"}
      </Button>
    </form>
  );
}
