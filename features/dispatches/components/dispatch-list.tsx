import Link from "next/link";
import { Truck } from "lucide-react";
import { DispatchStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from "@/components/ui/data-table";
import type { DispatchWithRequest } from "@/types";
import { formatDate } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";

type DispatchListProps = {
  dispatches: DispatchWithRequest[];
  newDispatchHref?: string;
};

export function DispatchList({
  dispatches,
  newDispatchHref = "/dispatches/new",
}: DispatchListProps) {
  if (dispatches.length === 0) {
    return (
      <EmptyState
        icon={Truck}
        title="No dispatches yet"
        description="Create a dispatch from an approved request or add one manually."
        action={
          <Link href={newDispatchHref} className={buttonVariants()}>
            New dispatch
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
              <DataTableHead>Reference</DataTableHead>
              <DataTableHead>Request</DataTableHead>
              <DataTableHead>Destination</DataTableHead>
              <DataTableHead>Date</DataTableHead>
              <DataTableHead>Status</DataTableHead>
            </DataTableRow>
          </DataTableHeader>
          <DataTableBody>
            {dispatches.map((dispatch) => (
              <DataTableRow key={dispatch.id}>
                <DataTableCell>
                  <Link
                    href={`/dispatches/${dispatch.id}`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {dispatch.reference_code}
                  </Link>
                </DataTableCell>
                <DataTableCell className="max-w-[200px] truncate text-muted-foreground">
                  {dispatch.request?.title ?? "—"}
                </DataTableCell>
                <DataTableCell className="text-muted-foreground">
                  {dispatch.destination ?? "—"}
                </DataTableCell>
                <DataTableCell className="tabular-nums text-muted-foreground">
                  {formatDate(dispatch.created_at)}
                </DataTableCell>
                <DataTableCell>
                  <DispatchStatusBadge status={dispatch.status} />
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </div>

      <ul className="divide-y divide-border md:hidden">
        {dispatches.map((dispatch) => (
          <li key={dispatch.id}>
            <Link
              href={`/dispatches/${dispatch.id}`}
              className="df-transition flex min-h-[72px] flex-col gap-2 px-4 py-4 active:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">{dispatch.reference_code}</p>
                <DispatchStatusBadge status={dispatch.status} />
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {dispatch.request?.title ?? "Standalone"} ·{" "}
                {formatDate(dispatch.created_at)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
