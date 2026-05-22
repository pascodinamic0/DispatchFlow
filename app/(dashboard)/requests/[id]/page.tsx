import Link from "next/link";
import { notFound } from "next/navigation";
import { RequestActionsPanel } from "@/features/requests/components/request-actions-panel";
import {
  DispatchStatusBadge,
  RequestStatusBadge,
} from "@/components/shared/status-badge";
import { DetailMetadata } from "@/components/shared/detail-metadata";
import { formatDate, formatDateTime } from "@/lib/format";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { requireProfile } from "@/lib/auth/session";
import { getDispatchesForRequest } from "@/services/dispatches.service";
import { listLineItemsForRequest } from "@/services/request-line-items.service";
import { getRequestById } from "@/services/requests.service";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user, profile } = await requireProfile();
  const request = await getRequestById(supabase, id);

  if (!request || request.organization_id !== profile.organization_id) {
    notFound();
  }

  const [dispatches, lineItems] = await Promise.all([
    getDispatchesForRequest(supabase, id),
    listLineItemsForRequest(supabase, id).catch(() => []),
  ]);
  const isOwner = request.requester_id === user.id;

  return (
    <div className="space-y-6">
      <PageHeader
        title={request.title}
        description={`Requested by ${request.requester?.full_name ?? "Unknown"}`}
        action={
          <Link
            href="/requests"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to list
          </Link>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-base font-medium">Details</CardTitle>
          <RequestStatusBadge status={request.status} />
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {request.description ? (
            <p className="text-muted-foreground">{request.description}</p>
          ) : null}
          <DetailMetadata
            items={[
              { label: "Priority", value: <span className="capitalize">{request.priority}</span> },
              { label: "Destination", value: request.destination ?? "—" },
              {
                label: "Needed by",
                value: request.needed_by ? formatDate(request.needed_by) : "—",
              },
              { label: "Created", value: formatDateTime(request.created_at) },
            ]}
          />
          <RequestActionsPanel
            request={request}
            profile={profile}
            isOwner={isOwner}
          />
        </CardContent>
      </Card>

      {lineItems.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Inventory items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {lineItems.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <p className="font-medium">
                      {row.item?.sku} — {row.item?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      On hand: {row.item?.quantity_on_hand} {row.item?.unit}
                    </p>
                  </div>
                  <span className="font-medium tabular-nums">
                    × {Number(row.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {dispatches.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Dispatches</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {dispatches.map((d) => (
                <li key={d.id}>
                  <Link
                    href={`/dispatches/${d.id}`}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/50"
                  >
                    <span className="font-medium">{d.reference_code}</span>
                    <DispatchStatusBadge status={d.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
