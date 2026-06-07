"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { OrgLogo } from "@/components/brand/org-logo";
import { SidebarLayoutControls } from "@/components/layout/sidebar-layout-controls";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatRole } from "@/lib/format";
import { mainNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

type AppSidebarProps = {
  userName?: string | null;
  userEmail?: string | null;
  userAvatarUrl?: string | null;
  userRole?: UserRole | null;
  organizationName?: string | null;
  organizationLogoUrl?: string | null;
};

export function AppSidebar({
  userName,
  userEmail,
  userAvatarUrl,
  userRole,
  organizationName,
  organizationLogoUrl,
}: AppSidebarProps) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      <SidebarHeader
        className={cn(
          "gap-0 border-b border-sidebar-border p-0",
          isCollapsed
            ? "flex items-center justify-center px-1.5 py-2"
            : "flex-row items-center gap-2 px-3 py-2.5",
        )}
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href="/dashboard"
                aria-label="Dashboard"
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-lg outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent focus-visible:ring-2",
                  isCollapsed ? "size-10" : "min-h-10 min-w-0 flex-1",
                )}
              />
            }
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-lg bg-white/95 shadow-sm",
                isCollapsed ? "size-10 p-1.5" : "h-10 w-full px-3 py-2",
              )}
            >
              <OrgLogo
                logoUrl={organizationLogoUrl}
                organizationName={organizationName}
                className={cn(
                  "object-contain",
                  isCollapsed
                    ? "size-6 max-w-6"
                    : "h-7 w-auto max-w-[min(180px,100%)]",
                )}
                priority
              />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            hidden={!isCollapsed || isMobile}
            className="px-3 py-2 text-sm font-medium"
          >
            {organizationName ?? "Dashboard"}
          </TooltipContent>
        </Tooltip>
        <SidebarLayoutControls />
      </SidebarHeader>
      <SidebarContent className="group-data-[collapsible=icon]:items-center">
        <SidebarGroup className="w-full px-2 group-data-[collapsible=icon]:px-1">
          <SidebarGroupLabel className="px-2 text-xs font-medium text-sidebar-foreground/50">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1">
              {mainNav.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem
                    key={item.href}
                    className="w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                  >
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={{
                        children: item.title,
                        className: "px-3 py-2 text-sm font-medium",
                      }}
                      className={cn(
                        "h-10 gap-3 text-[0.9375rem] font-medium text-sidebar-foreground/85",
                        "group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!w-10 group-data-[collapsible=icon]:!min-w-10 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!gap-0 group-data-[collapsible=icon]:!p-0",
                        "[&_svg]:size-5",
                        "hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        active &&
                          "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                      )}
                    >
                      <item.icon className="shrink-0" />
                      <span className="truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
        <div className="flex w-full items-center gap-3 rounded-lg bg-sidebar-accent/50 p-2 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <UserAvatar
            userName={userName}
            userEmail={userEmail}
            avatarUrl={userAvatarUrl}
            className="size-9 group-data-[collapsible=icon]:size-10"
            fallbackClassName="bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground group-data-[collapsible=icon]:text-sm"
          />
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium leading-tight">
              {userName ?? "Team member"}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/65">
              {userRole ? formatRole(userRole) : "Member"}
            </p>
          </div>
          <MoreHorizontal
            className="size-5 shrink-0 text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden"
            aria-hidden
          />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
