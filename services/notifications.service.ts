import type { DbClient } from "@/lib/supabase/types";
import {
  countUnreadNotifications,
  listUserNotifications,
} from "@/services/notification-delivery.service";
import type { AppNotification } from "@/types";


export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  variant: "warning" | "info" | "default";
  read: boolean;
  createdAt: string;
};

function variantForType(type: string): NotificationItem["variant"] {
  if (
    type.includes("failed") ||
    type.includes("rejected") ||
    type.includes("low_stock") ||
    type.includes("cancelled")
  ) {
    return "warning";
  }
  if (type.includes("in_transit") || type.includes("submitted")) {
    return "info";
  }
  return "default";
}

export function mapNotificationRow(row: AppNotification): NotificationItem {
  return {
    id: row.id,
    title: row.title,
    description: row.body,
    href: row.href ?? "/dashboard",
    variant: variantForType(row.type),
    read: Boolean(row.read_at),
    createdAt: row.created_at,
  };
}

export async function getNotificationsForUser(
  supabase: DbClient,
  userId: string,
  limit = 20,
): Promise<NotificationItem[]> {
  try {
    const rows = await listUserNotifications(supabase, userId, limit);
    return rows.map(mapNotificationRow);
  } catch {
    return [];
  }
}

export async function getUnreadNotificationCount(
  supabase: DbClient,
  userId: string,
): Promise<number> {
  try {
    return await countUnreadNotifications(supabase, userId);
  } catch {
    return 0;
  }
}

export async function getHeaderNotifications(
  supabase: DbClient,
  userId: string,
): Promise<{ items: NotificationItem[]; unreadCount: number }> {
  const [items, unreadCount] = await Promise.all([
    getNotificationsForUser(supabase, userId, 15),
    getUnreadNotificationCount(supabase, userId),
  ]);

  return {
    items: items.filter((n) => !n.read).slice(0, 10),
    unreadCount,
  };
}
