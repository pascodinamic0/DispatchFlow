"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  updateDispatchAssignmentAction,
} from "@/features/dispatches/actions/dispatch-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionRunner } from "@/hooks/use-action-runner";
import { canManageDispatches } from "@/lib/permissions";
import type { Dispatch, Profile, UserRole } from "@/types";

type TeamMember = Pick<Profile, "id" | "full_name" | "role">;

type Props = {
  dispatch: Dispatch;
  role: UserRole;
  teamMembers: TeamMember[];
};

function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function DispatchAssignmentForm({ dispatch, role, teamMembers }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { pending, run } = useActionRunner();

  if (!canManageDispatches(role)) return null;
  if (dispatch.status === "delivered" || dispatch.status === "cancelled") {
    return null;
  }

  const suggestedAssignees = teamMembers.filter((m) =>
    ["admin", "dispatcher"].includes(m.role),
  );
  const datalistOptions =
    suggestedAssignees.length > 0 ? suggestedAssignees : teamMembers;

  const showMarkAssigned = dispatch.status === "pending";

  function buildFormData() {
    const form = formRef.current;
    if (!form) return null;
    return new FormData(form);
  }

  function onSave(markAssigned: boolean) {
    const formData = buildFormData();
    if (!formData) return;

    run(
      () =>
        updateDispatchAssignmentAction(dispatch.id, formData, {
          markAssigned,
        }),
      {
        successMessage: markAssigned
          ? "Dispatch marked assigned"
          : "Assignment saved",
        onSuccess: () => router.refresh(),
      },
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
      <div>
        <h3 className="text-sm font-medium text-foreground">Assignment</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          The summary above is read-only. Set the driver, origin, and schedule
          here, then use the status buttons to move the shipment forward.
        </p>
      </div>

      <form ref={formRef} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="assigneeName">Assignee (driver or handler)</Label>
            <Input
              id="assigneeName"
              name="assigneeName"
              list="dispatch-assignees"
              defaultValue={dispatch.assignee_name ?? ""}
              placeholder="Type a name or pick from your team"
              disabled={pending}
              required
            />
            <datalist id="dispatch-assignees">
              {datalistOptions.map((member) => (
                <option key={member.id} value={member.full_name} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              name="origin"
              defaultValue={dispatch.origin ?? ""}
              placeholder="Warehouse, branch…"
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Scheduled</Label>
            <Input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              defaultValue={toDatetimeLocalValue(dispatch.scheduled_at)}
              disabled={pending}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => onSave(false)}
          >
            Save assignment
          </Button>
          {showMarkAssigned ? (
            <Button
              type="button"
              size="sm"
              disabled={pending}
              onClick={() => onSave(true)}
            >
              Save & mark assigned
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
