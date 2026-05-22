import type { DbClient } from "@/lib/supabase/types";
import { hasResendConfigured, sendEmail } from "@/lib/email/resend";
import { mapSupabaseError } from "@/lib/supabase/errors";
import type { UserRole } from "@/types";


export type NotificationPayload = {
  type: string;
  title: string;
  body: string;
  href?: string;
};

export async function createUserNotification(
  supabase: DbClient,
  input: {
    organizationId: string;
    userId: string;
    payload: NotificationPayload;
  },
) {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      organization_id: input.organizationId,
      user_id: input.userId,
      type: input.payload.type,
      title: input.payload.title,
      body: input.payload.body,
      href: input.payload.href ?? null,
    })
    .select("*")
    .single();

  if (error) throw mapSupabaseError(error);
  return data;
}

export async function listUserNotifications(
  supabase: DbClient,
  userId: string,
  limit = 20,
) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw mapSupabaseError(error);
  return data ?? [];
}

export async function countUnreadNotifications(
  supabase: DbClient,
  userId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw mapSupabaseError(error);
  return count ?? 0;
}

export async function markAllNotificationsRead(
  supabase: DbClient,
  userId: string,
) {
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw mapSupabaseError(error);
}

export async function markNotificationRead(
  supabase: DbClient,
  notificationId: string,
  userId: string,
) {
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) throw mapSupabaseError(error);
}

export async function deliverNotificationChannels(
  supabase: DbClient,
  notification: {
    id: string;
    user_id: string;
    title: string;
    body: string;
    href: string | null;
    email_sent_at: string | null;
    push_sent_at: string | null;
  },
  recipient: {
    email: string | null;
    emailNotificationsEnabled: boolean;
    pushNotificationsEnabled: boolean;
  },
  siteUrl: string,
) {
  const updates: { email_sent_at?: string; push_sent_at?: string } = {};

  if (
    hasResendConfigured() &&
    recipient.email &&
    recipient.emailNotificationsEnabled &&
    !notification.email_sent_at
  ) {
    const link = notification.href
      ? `${siteUrl}${notification.href}`
      : `${siteUrl}/dashboard`;
    const sent = await sendEmail({
      to: recipient.email,
      subject: `[DispatchFlow] ${notification.title}`,
      html: `
        <div style="font-family:Inter,system-ui,sans-serif;max-width:520px">
          <h2 style="color:#0B1220">${notification.title}</h2>
          <p style="color:#334155">${notification.body}</p>
          <p><a href="${link}" style="color:#2563EB">Open in DispatchFlow</a></p>
        </div>
      `,
    });
    if (sent) updates.email_sent_at = new Date().toISOString();
  }

  if (
    recipient.pushNotificationsEnabled &&
    !notification.push_sent_at &&
    process.env.VAPID_PUBLIC_KEY &&
    process.env.VAPID_PRIVATE_KEY
  ) {
    const pushed = await sendWebPushToUser(supabase, notification.user_id, {
      title: notification.title,
      body: notification.body,
      url: notification.href ? `${siteUrl}${notification.href}` : siteUrl,
    });
    if (pushed) updates.push_sent_at = new Date().toISOString();
  }

  if (Object.keys(updates).length > 0) {
    await supabase
      .from("notifications")
      .update(updates)
      .eq("id", notification.id);
  }
}

async function sendWebPushToUser(
  supabase: DbClient,
  userId: string,
  payload: { title: string; body: string; url: string },
): Promise<boolean> {
  try {
    const webpush = await import("web-push");
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT ?? "mailto:ops@dispatchflow.app",
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );

    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", userId);

    if (!subs?.length) return false;

    let sent = false;
    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        );
        sent = true;
      } catch {
        // expired subscription — ignore
      }
    }
    return sent;
  } catch {
    return false;
  }
}

export async function notifyUsers(
  supabase: DbClient,
  input: {
    organizationId: string;
    userIds: string[];
    payload: NotificationPayload;
    actorUserId?: string;
  },
) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const uniqueIds = [
    ...new Set(
      input.userIds.filter((id) => id && id !== input.actorUserId),
    ),
  ];
  if (uniqueIds.length === 0) return;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email_notifications_enabled, push_notifications_enabled")
    .in("id", uniqueIds);

  // Profile rows hold channel prefs; emails come from Supabase Auth (admin API).
  // Use supabase.auth.admin only in invite; for notify pass emails from caller or use RPC.
  // Simpler: get user emails from profiles join — profiles don't have email.
  // We need emails from auth.users — only admin client can list users.

  const { createAdminClient, hasAdminClient } = await import(
    "@/lib/supabase/admin"
  );
  const emailByUserId = new Map<string, string>();

  if (hasAdminClient()) {
    const admin = createAdminClient();
    for (const userId of uniqueIds) {
      const { data } = await admin.auth.admin.getUserById(userId);
      if (data.user?.email) {
        emailByUserId.set(userId, data.user.email);
      }
    }
  }

  for (const userId of uniqueIds) {
    const notification = await createUserNotification(supabase, {
      organizationId: input.organizationId,
      userId,
      payload: input.payload,
    });

    const profile = profiles?.find((p) => p.id === userId);
    await deliverNotificationChannels(
      supabase,
      notification,
      {
        email: emailByUserId.get(userId) ?? null,
        emailNotificationsEnabled:
          profile?.email_notifications_enabled ?? true,
        pushNotificationsEnabled:
          profile?.push_notifications_enabled ?? true,
      },
      siteUrl,
    );
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/", "layout");
  revalidatePath("/notifications");
}

export async function notifyUsersWithRole(
  supabase: DbClient,
  input: {
    organizationId: string;
    roles: UserRole[];
    payload: NotificationPayload;
    actorUserId?: string;
  },
) {
  const { data: members } = await supabase
    .from("profiles")
    .select("id")
    .eq("organization_id", input.organizationId)
    .in("role", input.roles);

  await notifyUsers(supabase, {
    organizationId: input.organizationId,
    userIds: (members ?? []).map((m) => m.id),
    payload: input.payload,
    actorUserId: input.actorUserId,
  });
}
