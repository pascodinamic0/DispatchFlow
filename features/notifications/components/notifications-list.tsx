"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/features/notifications/actions/notification-actions";
import { formatDateTime } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/services/notifications.service";

type Props = {
  initialItems: NotificationItem[];
};

export function NotificationsList({ initialItems }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const unread = initialItems.filter((n) => !n.read).length;

  function onOpen(item: NotificationItem) {
    startTransition(async () => {
      try {
        if (!item.read) {
          await markNotificationReadAction(item.id);
        }
        router.push(item.href);
        router.refresh();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  }

  function onMarkAllRead() {
    startTransition(async () => {
      try {
        const result = await markAllNotificationsReadAction();
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("All notifications marked as read");
        router.refresh();
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  }

  if (initialItems.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No notifications yet. Activity on requests, dispatches, and inventory
          will appear here.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {unread > 0 ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={onMarkAllRead}
          >
            Mark all as read
          </Button>
        </div>
      ) : null}

      <ul className="space-y-2">
        {initialItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              disabled={pending}
              onClick={() => onOpen(item)}
              className={cn(
                "df-card w-full rounded-xl border border-border/80 px-4 py-3 text-left shadow-[var(--shadow-card)] transition-colors hover:bg-muted/40",
                !item.read && "border-primary/30 bg-primary/5",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <time className="mt-1 block text-xs text-muted-foreground">
                    {formatDateTime(item.createdAt)}
                  </time>
                </div>
                {!item.read ? (
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                ) : null}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
