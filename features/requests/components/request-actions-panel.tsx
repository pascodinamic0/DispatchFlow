"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDispatchFromRequest } from "@/features/dispatches/actions/dispatch-actions";
import {
  approveRequest,
  cancelRequest,
  markRequestDelivered,
  rejectRequest,
  submitDraftRequest,
} from "@/features/requests/actions/request-actions";
import { Button } from "@/components/ui/button";
import { useActionRunner } from "@/hooks/use-action-runner";
import { getErrorMessage } from "@/lib/errors";
import {
  canApproveRequests,
  canManageDispatches,
  canTransitionRequest,
} from "@/lib/permissions";
import type { ProcurementRequest, Profile } from "@/types";

type Props = {
  request: ProcurementRequest;
  profile: Profile;
  isOwner: boolean;
};

export function RequestActionsPanel({ request, profile, isOwner }: Props) {
  const router = useRouter();
  const { pending, run, startTransition } = useActionRunner();

  const actions: {
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: "default" | "outline" | "destructive";
  }[] = [];

  if (request.status === "draft" && isOwner) {
    actions.push({
      label: "Submit for approval",
      onClick: () =>
        run(() => submitDraftRequest(request.id), {
          successMessage: "Request submitted",
        }),
      variant: "default",
    });
    actions.push({
      label: "Edit draft",
      href: `/requests/${request.id}/edit`,
      variant: "outline",
    });
  }

  if (
    canApproveRequests(profile.role) &&
    canTransitionRequest(profile.role, request.status, "approved", isOwner)
  ) {
    actions.push({
      label: "Approve",
      onClick: () =>
        run(() => approveRequest(request.id), {
          successMessage: "Request approved",
        }),
      variant: "default",
    });
  }

  if (
    canApproveRequests(profile.role) &&
    canTransitionRequest(profile.role, request.status, "rejected", isOwner)
  ) {
    actions.push({
      label: "Reject",
      onClick: () =>
        run(() => rejectRequest(request.id), {
          successMessage: "Request rejected",
        }),
      variant: "destructive",
    });
  }

  if (canTransitionRequest(profile.role, request.status, "cancelled", isOwner)) {
    actions.push({
      label: "Cancel",
      onClick: () =>
        run(() => cancelRequest(request.id), {
          successMessage: "Request cancelled",
        }),
      variant: "outline",
    });
  }

  if (canManageDispatches(profile.role) && request.status === "approved") {
    actions.push({
      label: "Create dispatch",
      onClick: () =>
        startTransition(async () => {
          try {
            const result = await createDispatchFromRequest(request.id);
            if (result.error) {
              toast.error(result.error);
              return;
            }
            toast.success("Dispatch created");
            if (result.dispatchId) {
              router.push(`/dispatches/${result.dispatchId}`);
            } else {
              router.refresh();
            }
          } catch (error) {
            toast.error(getErrorMessage(error));
          }
        }),
      variant: "default",
    });
  }

  if (
    canTransitionRequest(profile.role, request.status, "delivered", isOwner)
  ) {
    actions.push({
      label: "Mark delivered",
      onClick: () =>
        run(() => markRequestDelivered(request.id), {
          successMessage: "Request marked delivered",
        }),
      variant: "outline",
    });
  }

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 border-t border-border pt-4">
      {actions.map((action) =>
        action.href ? (
          <Button
            key={action.label}
            size="sm"
            variant={action.variant ?? "outline"}
            render={<Link href={action.href} />}
          >
            {action.label}
          </Button>
        ) : (
          <Button
            key={action.label}
            type="button"
            size="sm"
            variant={action.variant ?? "outline"}
            disabled={pending}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ),
      )}
    </div>
  );
}
