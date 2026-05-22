import {
  AlertTriangle,
  ClipboardList,
  Package,
  Plus,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { RecentActivityList } from "@/components/dashboard/recent-activity-list";
import { RequestStatusChart } from "@/components/dashboard/request-status-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { RequestStatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/session";
import { canCreateRequests } from "@/lib/permissions";
import { getDashboardSnapshot } from "@/services/dashboard.service";

export default async function DashboardPage() {
  const { supabase, profile } = await requireProfile();
  const snapshot = await getDashboardSnapshot(supabase, profile.organization_id);
  const canCreate = canCreateRequests(profile.role);

  const stats = [
    {
      title: "Pending requests",
      value: String(snapshot.pendingRequests),
      description: "Draft or awaiting approval",
      icon: ClipboardList,
      iconClassName: "bg-primary/10 text-primary",
    },
    {
      title: "In transit",
      value: String(snapshot.inTransit),
      description: "Active shipments on the road",
      icon: Truck,
      iconClassName: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    },
    {
      title: "Delayed / failed",
      value: String(snapshot.delayedDispatches),
      description: "Needs dispatcher attention",
      icon: AlertTriangle,
      iconClassName: "bg-destructive/15 text-destructive",
    },
    {
      title: "Delivered today",
      value: String(snapshot.deliveredToday),
      description: "Completed since midnight",
      icon: Package,
      iconClassName: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of procurement requests and field dispatches."
        action={
          canCreate ? (
            <Link
              href="/requests/new"
              className={cn(buttonVariants({ variant: "default" }), "gap-2")}
            >
              <Plus className="size-4" />
              New request
            </Link>
          ) : undefined
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="df-card border-border/80 shadow-[var(--shadow-card)] lg:col-span-1">
          <CardHeader>
            <CardTitle>Requests by status</CardTitle>
            <CardDescription>Distribution across your pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <RequestStatusChart data={snapshot.requestStatusBreakdown} />
          </CardContent>
        </Card>

        <Card className="df-card border-border/80 shadow-[var(--shadow-card)] lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest requests and dispatches</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivityList items={snapshot.recentActivity} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="df-card border-border/80 shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between px-5 pt-5">
            <div>
              <CardTitle className="font-semibold">Recent requests</CardTitle>
              <CardDescription>Latest procurement submissions</CardDescription>
            </div>
            <Link
              href="/requests"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {snapshot.recentRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No requests yet.{" "}
                <Link
                  href="/requests/new"
                  className="font-medium text-primary hover:underline"
                >
                  Create one
                </Link>
                .
              </p>
            ) : (
              <ul className="space-y-3">
                {snapshot.recentRequests.map((request) => (
                  <li key={request.id}>
                    <Link
                      href={`/requests/${request.id}`}
                      className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-muted/60"
                    >
                      <span className="truncate text-sm font-medium">
                        {request.title}
                      </span>
                      <RequestStatusBadge status={request.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="df-card border-border/80 shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between px-5 pt-5">
            <div>
              <CardTitle className="font-semibold">Dispatch queue</CardTitle>
              <CardDescription>Assignments and delivery status</CardDescription>
            </div>
            <Link
              href="/dispatches"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {snapshot.recentDispatches.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No dispatches yet. They appear when requests move into dispatch.
              </p>
            ) : (
              <ul className="space-y-3">
                {snapshot.recentDispatches.map((dispatch) => (
                  <li key={dispatch.id}>
                    <Link
                      href={`/dispatches/${dispatch.id}`}
                      className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm hover:bg-muted/60"
                    >
                      <span className="font-medium">{dispatch.reference_code}</span>
                      <span className="capitalize text-muted-foreground">
                        {dispatch.status.replace("_", " ")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {snapshot.lowStockItems > 0 ? (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <p className="text-sm">
              <span className="font-semibold">{snapshot.lowStockItems}</span> inventory
              item{snapshot.lowStockItems === 1 ? "" : "s"} below reorder level.
            </p>
            <Link
              href="/inventory"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Review inventory
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
