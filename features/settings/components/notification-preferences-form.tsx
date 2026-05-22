"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  updateNotificationPreferences,
  type SettingsActionState,
} from "@/features/settings/actions/settings-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/types";

const initialState: SettingsActionState = {};

type Props = {
  profile: Profile;
  vapidPublicKey: string | null;
};

export function NotificationPreferencesForm({
  profile,
  vapidPublicKey,
}: Props) {
  const [state, formAction, pending] = useActionState(
    updateNotificationPreferences,
    initialState,
  );

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) toast.success(state.success);
  }, [state.error, state.success]);

  return (
    <form action={formAction} className="space-y-4">
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="emailNotifications"
          defaultChecked={profile.email_notifications_enabled}
          disabled={pending}
          className="size-4 rounded border-input"
        />
        <span>Email notifications for approvals, dispatches, and alerts</span>
      </label>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="pushNotifications"
          defaultChecked={profile.push_notifications_enabled}
          disabled={pending}
          className="size-4 rounded border-input"
        />
        <span>Browser push notifications (when enabled in this browser)</span>
      </label>

      {vapidPublicKey ? (
        <PushSubscribeButton vapidPublicKey={vapidPublicKey} />
      ) : (
        <p className="text-xs text-muted-foreground">
          Add VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to enable browser push.
        </p>
      )}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Save preferences"}
      </Button>
    </form>
  );
}

function PushSubscribeButton({ vapidPublicKey }: { vapidPublicKey: string }) {
  async function enablePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      toast.error("Push is not supported in this browser");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Notification permission denied");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const json = subscription.toJSON();
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: json.keys,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save push subscription");
      }

      toast.success("Browser push enabled for this device");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not enable push",
      );
    }
  }

  return (
    <div className="space-y-2">
      <Label>Device</Label>
      <Button type="button" variant="outline" size="sm" onClick={enablePush}>
        Enable push on this browser
      </Button>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}
