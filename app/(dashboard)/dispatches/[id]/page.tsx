import Link from "next/link";
import { notFound } from "next/navigation";
import { DispatchActionsPanel } from "@/features/dispatches/components/dispatch-actions-panel";
import { DispatchAssignmentForm } from "@/features/dispatches/components/dispatch-assignment-form";
import { DispatchStatusBadge } from "@/components/shared/status-badge";
import { DetailMetadata } from "@/components/shared/detail-metadata";
import { formatDateTime } from "@/lib/format";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { requireProfile } from "@/lib/auth/session";
import { getDispatchById } from "@/services/dispatches.service";
import { listProfilesInOrganization } from "@/services/profile.service";

export default async function DispatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, profile } = await requireProfile();
  const [dispatch, teamMembers] = await Promise.all([
    getDispatchById(supabase, id),
    listProfilesInOrganization(supabase, profile.organization_id),
  ]);

  if (!dispatch || dispatch.organization_id !== profile.organization_id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={dispatch.reference_code}
        description={
          dispatch.request?.title
            ? `Linked to: ${dispatch.request.title}`
            : "Standalone dispatch"
        }
        action={
          <Link
            href="/dispatches"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to list
          </Link>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-base font-medium">Shipment</CardTitle>
          <DispatchStatusBadge status={dispatch.status} />
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <DetailMetadata
            items={[
              { label: "Assignee", value: dispatch.assignee_name ?? "—" },
              { label: "Origin", value: dispatch.origin ?? "—" },
              { label: "Destination", value: dispatch.destination ?? "—" },
              {
                label: "Scheduled",
                value: dispatch.scheduled_at
                  ? formatDateTime(dispatch.scheduled_at)
                  : "—",
              },
              {
                label: "Delivered",
                value: dispatch.delivered_at
                  ? formatDateTime(dispatch.delivered_at)
                  : "—",
              },
              { label: "Created", value: formatDateTime(dispatch.created_at) },
            ]}
          />
          {dispatch.notes ? (
            <p className="text-muted-foreground">{dispatch.notes}</p>
          ) : null}
          {dispatch.request_id ? (
            <Link
              href={`/requests/${dispatch.request_id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              View linked request
            </Link>
          ) : null}
          <DispatchAssignmentForm
            dispatch={dispatch}
            role={profile.role}
            teamMembers={teamMembers}
          />
          <DispatchActionsPanel dispatch={dispatch} role={profile.role} />
        </CardContent>
      </Card>
    </div>
  );
}
