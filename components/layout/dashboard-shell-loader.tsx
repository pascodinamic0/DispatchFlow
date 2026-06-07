"use client";

import { useEffect, useState } from "react";
import { DashboardChromeSkeleton } from "@/components/layout/dashboard-chrome-skeleton";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import type { NotificationItem } from "@/services/notifications.service";
import type { UserRole } from "@/types";

type Props = {
  children: React.ReactNode;
  userEmail?: string | null;
  userName?: string | null;
  userAvatarUrl?: string | null;
  userRole?: UserRole | null;
  organizationName?: string | null;
  organizationLogoUrl?: string | null;
  notifications?: NotificationItem[];
  unreadCount?: number;
  initialSidebarOpen?: boolean;
};

export function DashboardShellLoader({
  children,
  initialSidebarOpen = true,
  ...props
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <DashboardChromeSkeleton>{children}</DashboardChromeSkeleton>;
  }

  return (
    <DashboardShell initialSidebarOpen={initialSidebarOpen} {...props}>
      {children}
    </DashboardShell>
  );
}
