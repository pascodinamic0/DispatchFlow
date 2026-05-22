import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { createClient } from "@/lib/supabase/server";
import { getHeaderNotifications } from "@/services/notifications.service";
import { getProfileByUserId } from "@/services/profile.service";
import type { UserRole } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | null = null;
  let userName: string | null = null;
  let userRole: UserRole | null = null;
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
    userRole = profile.role;
    const headerNotifications = await getHeaderNotifications(
      supabase,
      user.id,
    );
    notifications = headerNotifications.items;
    unreadCount = headerNotifications.unreadCount;
  }

  return (
    <DashboardShell
      userEmail={userEmail}
      userName={userName}
      userRole={userRole}
      notifications={notifications}
      unreadCount={unreadCount}
    >
      {children}
    </DashboardShell>
  );
}
