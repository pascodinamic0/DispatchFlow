import { NotificationsList } from "@/features/notifications/components/notifications-list";
import { PageHeader } from "@/components/layout/page-header";
import { requireProfile } from "@/lib/auth/session";
import { getNotificationsForUser } from "@/services/notifications.service";

export default async function NotificationsPage() {
  const { supabase, user } = await requireProfile();
  const items = await getNotificationsForUser(supabase, user.id, 50);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Updates across requests, dispatches, and inventory for your role."
      />
      <NotificationsList initialItems={items} />
    </div>
  );
}
