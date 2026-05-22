"use client";

import { useEffect } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUiStore } from "@/store/ui-store";
import type { NotificationItem } from "@/services/notifications.service";
import type { UserRole } from "@/types";

type DashboardShellProps = {
  children: React.ReactNode;
  userEmail?: string | null;
  userName?: string | null;
  userRole?: UserRole | null;
  notifications?: NotificationItem[];
  unreadCount?: number;
};

export function DashboardShell({
  children,
  userEmail,
  userName,
  userRole,
  notifications = [],
  unreadCount = 0,
}: DashboardShellProps) {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUiStore();

  useEffect(() => {
    const handler = () => toggleSidebar();
    document.addEventListener("dispatchflow:toggle-sidebar", handler);
    return () =>
      document.removeEventListener("dispatchflow:toggle-sidebar", handler);
  }, [toggleSidebar]);

  return (
    <SidebarProvider
      open={sidebarOpen}
      onOpenChange={setSidebarOpen}
      className="min-h-svh"
    >
      <AppSidebar userName={userName} userRole={userRole} />
      <SidebarInset className="bg-background">
        <DashboardHeader
          userEmail={userEmail}
          userName={userName}
          notifications={notifications}
          unreadCount={unreadCount}
        />
        <main className="flex-1 p-4 pb-20 sm:p-6 md:pb-6">{children}</main>
        <MobileNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
