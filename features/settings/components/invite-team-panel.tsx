"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  inviteTeamMember,
  revokeTeamInvite,
  type InviteActionState,
} from "@/features/settings/actions/invite-actions";
import { formatRole } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OrganizationInvite, UserRole } from "@/types";

const initialState: InviteActionState = {};

const ROLES: UserRole[] = [
  "requester",
  "procurement",
  "dispatcher",
  "admin",
  "viewer",
];

type Props = {
  invites: OrganizationInvite[];
};

export function InviteTeamPanel({ invites }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    inviteTeamMember,
    initialState,
  );
  const [revokePending, startRevoke] = useTransition();

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success(state.success);
  }, [state.error, state.success]);

  function onRevoke(inviteId: string) {
    startRevoke(async () => {
      try {
        const result = await revokeTeamInvite(inviteId);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success(result.success ?? "Invite revoked");
        router.refresh();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  }

  return (
    <div className="space-y-6">
      <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="inviteEmail">Email</Label>
          <Input
            id="inviteEmail"
            name="email"
            type="email"
            required
            placeholder="colleague@company.com"
            disabled={pending}
          />
        </div>
        <div className="space-y-2 sm:w-40">
          <Label htmlFor="inviteRole">Role</Label>
          <select
            id="inviteRole"
            name="role"
            defaultValue="requester"
            disabled={pending}
            className="flex h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {formatRole(role)}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send invite"}
        </Button>
      </form>

      {invites.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {invites.map((invite) => (
            <li
              key={invite.id}
              className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{invite.email}</p>
                <p className="text-xs text-muted-foreground">
                  {formatRole(invite.role)} · expires{" "}
                  {new Date(invite.expires_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={revokePending}
                onClick={() => onRevoke(invite.id)}
              >
                Revoke
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No pending invites.</p>
      )}
    </div>
  );
}
