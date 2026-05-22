import {
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  Truck,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Requests", href: "/requests", icon: ClipboardList },
  { title: "Dispatches", href: "/dispatches", icon: Truck },
  { title: "Inventory", href: "/inventory", icon: Package },
  { title: "Settings", href: "/settings", icon: Settings },
];

/** Primary items for mobile bottom nav (max 4 slots). */
export const mobileNav: NavItem[] = [
  mainNav[0],
  mainNav[1],
  mainNav[2],
  mainNav[4],
];
