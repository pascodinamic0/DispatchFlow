import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getNotificationsForUser,
  getUnreadNotificationCount,
} from "@/services/notifications.service";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ items: [], unreadCount: 0 });
  }

  const [items, unreadCount] = await Promise.all([
    getNotificationsForUser(supabase, user.id, 20),
    getUnreadNotificationCount(supabase, user.id),
  ]);

  return NextResponse.json({
    items: items.filter((n) => !n.read).slice(0, 12),
    unreadCount,
  });
}
