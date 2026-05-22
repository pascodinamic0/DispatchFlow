import Link from "next/link";
import { Suspense } from "react";
import { DispatchFilters } from "@/features/dispatches/components/dispatch-filters";
import { DispatchList } from "@/features/dispatches/components/dispatch-list";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { requireProfile } from "@/lib/auth/session";
import { canManageDispatches } from "@/lib/permissions";
import { listDispatches } from "@/services/dispatches.service";
import { DISPATCH_STATUSES } from "@/lib/constants/statuses";
import type { DispatchStatus } from "@/types";

const validStatuses = new Set<string>(DISPATCH_STATUSES);

export default async function DispatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const { supabase, profile } = await requireProfile();

  const status =
    statusParam && validStatuses.has(statusParam)
      ? (statusParam as DispatchStatus)
      : undefined;

  const dispatches = await listDispatches(supabase, profile.organization_id, {
    status,
  });
  const canCreate = canManageDispatches(profile.role);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispatches"
        description="Assign drivers, track deliveries, and close the loop."
        action={
          canCreate ? (
            <Link
              href="/dispatches/new"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              New dispatch
            </Link>
          ) : undefined
        }
      />

      <Suspense fallback={<div className="h-9" />}>
        <DispatchFilters />
      </Suspense>

      <DispatchList dispatches={dispatches} />
    </div>
  );
}
