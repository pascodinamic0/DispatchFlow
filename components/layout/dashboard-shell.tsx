"use client";

import { useEffect } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSidebarWidthCSSValue } from "@/lib/sidebar";
import { useUiStore } from "@/store/ui-store";
import type { NotificationItem } from "@/services/notifications.service";
import type { UserRole } from "@/types";

type DashboardShellProps = {
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

export function DashboardShell({
  children,
  userEmail,
  userName,
  userAvatarUrl,
  userRole,
  organizationName,
  organizationLogoUrl,
  notifications = [],
  unreadCount = 0,
  initialSidebarOpen = true,
}: DashboardShellProps) {
  const {
    sidebarOpen,
    sidebarWidth,
    setSidebarOpen,
    toggleSidebar,
    hydrated,
    hydrateSidebarPreferences,
  } = useUiStore();

  useEffect(() => {
    if (!hydrated) {
      useUiStore.setState({ sidebarOpen: initialSidebarOpen });
    }
    hydrateSidebarPreferences();
  }, [hydrateSidebarPreferences, hydrated, initialSidebarOpen]);

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
      style={
        {
          "--sidebar-width": getSidebarWidthCSSValue(sidebarWidth),
        } as React.CSSProperties
      }
    >
      <AppSidebar
        userName={userName}
        userEmail={userEmail}
        userAvatarUrl={userAvatarUrl}
        userRole={userRole}
        organizationName={organizationName}
        organizationLogoUrl={organizationLogoUrl}
      />
      <SidebarInset className="bg-background">
        <DashboardHeader
          userEmail={userEmail}
          userName={userName}
          userAvatarUrl={userAvatarUrl}
          notifications={notifications}
          unreadCount={unreadCount}
        />
        <main className="flex-1 p-4 pb-20 sm:p-6 md:pb-6">{children}</main>
        <MobileNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
