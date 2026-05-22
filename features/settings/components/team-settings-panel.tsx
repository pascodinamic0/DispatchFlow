"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateTeamMemberRole } from "@/features/settings/actions/settings-actions";
import { formatRole } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import type { Profile, UserRole } from "@/types";

const ROLES: UserRole[] = [
  "admin",
  "dispatcher",
  "procurement",
  "requester",
  "viewer",
];

type Props = {
  team: Profile[];
  currentUserId: string;
};

export function TeamSettingsPanel({ team, currentUserId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onRoleChange(profileId: string, role: UserRole) {
    const formData = new FormData();
    formData.set("profileId", profileId);
    formData.set("role", role);
    startTransition(async () => {
      try {
        const result = await updateTeamMemberRole({}, formData);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success(result.success ?? "Role updated");
        router.refresh();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  }

  return (
    <ul className="divide-y divide-border">
      {team.map((member) => (
        <li
          key={member.id}
          className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="font-medium">
              {member.full_name}
              {member.id === currentUserId ? (
                <span className="ml-2 text-xs text-muted-foreground">(you)</span>
              ) : null}
            </p>
            <p className="text-sm text-muted-foreground">
              {member.department ?? "No department"}
            </p>
          </div>
          <select
            name="role"
            defaultValue={member.role}
            disabled={pending}
            onChange={(e) =>
              onRoleChange(member.id, e.target.value as UserRole)
            }
            className="h-9 min-w-[10rem] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
            aria-label={`Role for ${member.full_name}`}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {formatRole(role)}
              </option>
            ))}
          </select>
        </li>
      ))}
    </ul>
  );
}
