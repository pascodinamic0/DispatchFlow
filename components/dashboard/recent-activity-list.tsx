import { ClipboardList, Truck } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import type { DashboardSnapshot } from "@/services/dashboard.service";

type RecentActivityListProps = {
  items: DashboardSnapshot["recentActivity"];
};

export function RecentActivityList({ items }: RecentActivityListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No recent activity yet.</p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const href =
          item.type === "request"
            ? `/requests/${item.id.replace(/^req-/, "")}`
            : `/dispatches/${item.id.replace(/^disp-/, "")}`;
        return (
          <li key={item.id}>
            <Link
              href={href}
              className="flex gap-3 rounded-lg px-1 py-1 hover:bg-muted/60"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {item.type === "request" ? (
                  <ClipboardList className="size-4" />
                ) : (
                  <Truck className="size-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <time className="shrink-0 text-xs text-muted-foreground">
                {formatDateTime(item.at)}
              </time>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
