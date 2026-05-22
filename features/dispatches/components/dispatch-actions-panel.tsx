"use client";

import { updateDispatchStatusAction } from "@/features/dispatches/actions/dispatch-actions";
import { Button } from "@/components/ui/button";
import { DISPATCH_TRANSITION_ACTIONS } from "@/lib/constants/dispatch-transitions";
import { useActionRunner } from "@/hooks/use-action-runner";
import type { Dispatch, UserRole } from "@/types";

type Props = {
  dispatch: Dispatch;
  role: UserRole;
};

export function DispatchActionsPanel({ dispatch, role }: Props) {
  const { pending, run } = useActionRunner();
  const canManage = role === "admin" || role === "dispatcher";
  const actions = DISPATCH_TRANSITION_ACTIONS[dispatch.status] ?? [];

  if (!canManage || actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action.status}
          type="button"
          size="sm"
          variant={action.variant ?? "outline"}
          disabled={pending}
          onClick={() =>
            run(
              () =>
                updateDispatchStatusAction(
                  dispatch.id,
                  action.status,
                  dispatch.assignee_name ?? undefined,
                ),
              { successMessage: "Dispatch updated" },
            )
          }
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
