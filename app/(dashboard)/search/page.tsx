import Link from "next/link";
import { ClipboardList, Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import {
  DispatchStatusBadge,
  RequestStatusBadge,
} from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/session";
import { searchOperations } from "@/services/search.service";
import type { DispatchStatus, RequestStatus } from "@/types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const { supabase, profile } = await requireProfile();

  const results = query
    ? await searchOperations(supabase, profile.organization_id, query)
    : { requests: [], dispatches: [] };

  const total = results.requests.length + results.dispatches.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Search"
        description={
          query
            ? `Results for “${query}” — ${total} match${total === 1 ? "" : "es"}`
            : "Enter a term in the header search bar."
        }
      />

      {!query ? (
        <p className="text-sm text-muted-foreground">
          Search procurement requests by title or description, and dispatches by
          reference, destination, or assignee.
        </p>
      ) : total === 0 ? (
        <p className="text-sm text-muted-foreground">
          No requests or dispatches matched your search.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="df-card border-border/80 shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="size-4 text-primary" />
                Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.requests.length === 0 ? (
                <p className="text-sm text-muted-foreground">No requests found.</p>
              ) : (
                <ul className="space-y-2">
                  {results.requests.map((request) => (
                    <li key={request.id}>
                      <Link
                        href={`/requests/${request.id}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-muted/60"
                      >
                        <span className="truncate text-sm font-medium">
                          {request.title}
                        </span>
                        <RequestStatusBadge
                          status={request.status as RequestStatus}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="df-card border-border/80 shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Truck className="size-4 text-primary" />
                Dispatches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.dispatches.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No dispatches found.
                </p>
              ) : (
                <ul className="space-y-2">
                  {results.dispatches.map((dispatch) => (
                    <li key={dispatch.id}>
                      <Link
                        href={`/dispatches/${dispatch.id}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-muted/60"
                      >
                        <span className="text-sm font-medium">
                          {dispatch.reference_code}
                        </span>
                        <DispatchStatusBadge
                          status={dispatch.status as DispatchStatus}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
