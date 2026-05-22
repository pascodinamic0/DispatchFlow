"use client";

import {
  ChevronDown,
  LogOut,
  Monitor,
  Moon,
  Sun,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { DashboardSearch } from "@/components/layout/dashboard-search";
import { NotificationsBell } from "@/components/layout/notifications-bell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { NotificationItem } from "@/services/notifications.service";

type DashboardHeaderProps = {
  userEmail?: string | null;
  userName?: string | null;
  notifications?: NotificationItem[];
  unreadCount?: number;
};

export function DashboardHeader({
  userEmail,
  userName,
  notifications = [],
  unreadCount = 0,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const initials =
    userName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    userEmail?.slice(0, 2).toUpperCase() ||
    "DF";
  const displayName = userName ?? "Team member";

  async function handleSignOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  }

  function handleThemeChange(mode: "light" | "dark" | "system") {
    setTheme(mode);
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/80 bg-card/95 px-3 shadow-sm backdrop-blur-sm supports-[backdrop-filter]:bg-card/80 sm:gap-3 sm:px-4 lg:px-6">
      <SidebarTrigger
        className="-ml-0.5 shrink-0 text-muted-foreground md:hidden"
        aria-label="Open menu"
      />

      <div className="flex min-w-0 flex-1 items-center">
        <DashboardSearch />
      </div>

      <div
        className="relative z-10 flex shrink-0 items-center gap-1 rounded-xl border border-border/60 bg-muted/30 p-1 sm:gap-1.5"
        role="toolbar"
        aria-label="Notifications and account"
      >
        <NotificationsBell
          initialItems={notifications}
          initialUnreadCount={unreadCount}
        />

        <Separator
          orientation="vertical"
          className="hidden h-6 sm:block"
          decorative
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            aria-label="Account menu"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-9 shrink-0 touch-manipulation gap-2 rounded-lg px-2 text-foreground hover:bg-background/80",
              "lg:min-w-[8.5rem] lg:justify-start",
            )}
          >
            <Avatar className="size-7 shrink-0">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[7.5rem] truncate text-sm font-medium lg:inline">
              {displayName}
            </span>
            <ChevronDown className="hidden size-4 shrink-0 text-muted-foreground lg:inline" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium">{displayName}</p>
                  {userEmail ? (
                    <p className="truncate text-xs text-muted-foreground">
                      {userEmail}
                    </p>
                  ) : null}
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link href="/settings" />}
                className="cursor-pointer"
              >
                <User className="mr-2 size-4" />
                Profile & settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Appearance
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleThemeChange("light")}
              >
                <Sun className="mr-2 size-4" />
                Light
                {theme === "light" ? (
                  <span className="ml-auto text-xs text-primary">Active</span>
                ) : null}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleThemeChange("dark")}
              >
                <Moon className="mr-2 size-4" />
                Dark
                {theme === "dark" ? (
                  <span className="ml-auto text-xs text-primary">Active</span>
                ) : null}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleThemeChange("system")}
              >
                <Monitor className="mr-2 size-4" />
                System
                {theme === "system" ? (
                  <span className="ml-auto text-xs text-primary">Active</span>
                ) : null}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
