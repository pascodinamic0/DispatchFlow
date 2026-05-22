import { InviteTeamPanel } from "@/features/settings/components/invite-team-panel";
import { NotificationPreferencesForm } from "@/features/settings/components/notification-preferences-form";
import { OrganizationSettingsForm } from "@/features/settings/components/organization-settings-form";
import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { TeamSettingsPanel } from "@/features/settings/components/team-settings-panel";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRole } from "@/lib/format";
import { requireProfile } from "@/lib/auth/session";
import {
  canManageOrganization,
  canManageTeamRoles,
} from "@/lib/permissions";
import { listPendingInvites } from "@/services/invites.service";
import {
  getOrganizationById,
  listProfilesInOrganization,
} from "@/services/profile.service";

export default async function SettingsPage() {
  const { supabase, user, profile } = await requireProfile();
  const [organization, team, invites] = await Promise.all([
    getOrganizationById(supabase, profile.organization_id),
    listProfilesInOrganization(supabase, profile.organization_id),
    canManageTeamRoles(profile.role)
      ? listPendingInvites(supabase, profile.organization_id).catch(() => [])
      : Promise.resolve([]),
  ]);

  const showOrgSettings =
    canManageOrganization(profile.role) && organization != null;
  const showTeam = canManageTeamRoles(profile.role);
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Organization profile, notifications, invites, and team access."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="df-card border-border/80 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Your profile</CardTitle>
            <CardDescription>Role: {formatRole(profile.role)}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileSettingsForm
              profile={profile}
              userEmail={user.email ?? null}
            />
          </CardContent>
        </Card>

        <Card className="df-card border-border/80 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Email and browser push delivery.</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationPreferencesForm
              profile={profile}
              vapidPublicKey={vapidPublicKey}
            />
          </CardContent>
        </Card>

        {showOrgSettings && organization ? (
          <Card className="df-card border-border/80 shadow-[var(--shadow-card)] lg:col-span-2">
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>
                Workspace name visible to your team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationSettingsForm organization={organization} />
            </CardContent>
          </Card>
        ) : null}
      </div>

      {showTeam ? (
        <>
          <Card className="df-card border-border/80 shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Invite teammates</CardTitle>
              <CardDescription>
                Sends a Supabase invite email and records the role for onboarding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InviteTeamPanel invites={invites} />
            </CardContent>
          </Card>

          <Card className="df-card border-border/80 shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Team & roles</CardTitle>
              <CardDescription>
                Manage who can approve requests, run dispatches, and adjust
                inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamSettingsPanel team={team} currentUserId={user.id} />
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
