import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { PriorityText } from "@/components/shared/priority-text";
import { RequestStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from "@/components/ui/data-table";
import type { RequestWithRequester } from "@/types";
import { formatDate } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";

type RequestListProps = {
  requests: RequestWithRequester[];
  newRequestHref?: string;
};

export function RequestList({
  requests,
  newRequestHref = "/requests/new",
}: RequestListProps) {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No procurement requests"
        description="Create your first request to start tracking approvals and dispatches."
        action={
          <Link href={newRequestHref} className={buttonVariants()}>
            New request
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <DataTable>
          <DataTableHeader>
            <DataTableRow className="hover:bg-transparent">
              <DataTableHead>Title</DataTableHead>
              <DataTableHead>Requested by</DataTableHead>
              <DataTableHead>Date</DataTableHead>
              <DataTableHead>Priority</DataTableHead>
              <DataTableHead>Status</DataTableHead>
            </DataTableRow>
          </DataTableHeader>
          <DataTableBody>
            {requests.map((request) => (
              <DataTableRow key={request.id}>
                <DataTableCell>
                  <Link
                    href={`/requests/${request.id}`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {request.title}
                  </Link>
                  {request.destination ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {request.destination}
                    </p>
                  ) : null}
                </DataTableCell>
                <DataTableCell className="text-muted-foreground">
                  {request.requester?.full_name ?? "—"}
                </DataTableCell>
                <DataTableCell className="text-muted-foreground tabular-nums">
                  {formatDate(request.created_at)}
                </DataTableCell>
                <DataTableCell>
                  <PriorityText priority={request.priority} />
                </DataTableCell>
                <DataTableCell>
                  <RequestStatusBadge status={request.status} />
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </div>

      <ul className="divide-y divide-border md:hidden">
        {requests.map((request) => (
          <li key={request.id}>
            <Link
              href={`/requests/${request.id}`}
              className="df-transition flex min-h-[72px] flex-col gap-2 px-4 py-4 active:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-foreground">{request.title}</p>
                <RequestStatusBadge status={request.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                {request.requester?.full_name ?? "Unknown"} ·{" "}
                {formatDate(request.created_at)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
