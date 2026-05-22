"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/session";
import { getErrorMessage } from "@/lib/errors";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notification-delivery.service";

export async function markNotificationReadAction(
  notificationId: string,
): Promise<{ error?: string }> {
  try {
    const { supabase, user } = await requireProfile();
    await markNotificationRead(supabase, notificationId, user.id);
    revalidatePath("/", "layout");
    revalidatePath("/notifications");
    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function markAllNotificationsReadAction(): Promise<{
  error?: string;
}> {
  try {
    const { supabase, user } = await requireProfile();
    await markAllNotificationsRead(supabase, user.id);
    revalidatePath("/", "layout");
    revalidatePath("/notifications");
    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
