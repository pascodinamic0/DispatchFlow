import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShellLoader } from "@/components/layout/dashboard-shell-loader";
import { createClient } from "@/lib/supabase/server";
import { getHeaderNotifications } from "@/services/notifications.service";
import { resolveOrganizationLogoUrl } from "@/lib/storage/organization-logo";
import {
  getOrganizationById,
  getProfileByUserId,
} from "@/services/profile.service";
import type { UserRole } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | null = null;
  let userName: string | null = null;
  let userAvatarUrl: string | null = null;
  let userRole: UserRole | null = null;
  let organizationName: string | null = null;
  let organizationLogoUrl: string | null = null;
  let notifications: Awaited<
    ReturnType<typeof getHeaderNotifications>
  >["items"] = [];
  let unreadCount = 0;

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    userEmail = user.email ?? null;
    userName =
      (user.user_metadata?.full_name as string | undefined) ?? null;

    const profile = await getProfileByUserId(supabase, user.id);
    if (!profile) {
      redirect("/onboarding");
    }

    userName = profile.full_name;
    userAvatarUrl = profile.avatar_url;
    userRole = profile.role;

    const organization = await getOrganizationById(
      supabase,
      profile.organization_id,
    );
    organizationName = organization?.name ?? null;
    organizationLogoUrl = organization
      ? await resolveOrganizationLogoUrl(
          supabase,
          profile.organization_id,
          organization.logo_url,
        )
      : null;

    const headerNotifications = await getHeaderNotifications(
      supabase,
      user.id,
    );
    notifications = headerNotifications.items;
    unreadCount = headerNotifications.unreadCount;
  }

  const cookieStore = await cookies();
  const initialSidebarOpen =
    cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <DashboardShellLoader
      userEmail={userEmail}
      userName={userName}
      userAvatarUrl={userAvatarUrl}
      userRole={userRole}
      organizationName={organizationName}
      organizationLogoUrl={organizationLogoUrl}
      notifications={notifications}
      unreadCount={unreadCount}
      initialSidebarOpen={initialSidebarOpen}
    >
      {children}
    </DashboardShellLoader>
  );
}
