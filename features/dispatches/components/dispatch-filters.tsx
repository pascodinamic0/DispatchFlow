"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { DISPATCH_STATUS_LABELS } from "@/lib/constants/statuses";
import { cn } from "@/lib/utils";
import type { DispatchStatus } from "@/types";

const filters: { value: DispatchStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: DISPATCH_STATUS_LABELS.pending },
  { value: "assigned", label: DISPATCH_STATUS_LABELS.assigned },
  { value: "in_transit", label: DISPATCH_STATUS_LABELS.in_transit },
  { value: "delivered", label: DISPATCH_STATUS_LABELS.delivered },
];

export function DispatchFilters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("status") ?? "all";

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {filters.map((filter) => {
        const params = new URLSearchParams(searchParams.toString());
        if (filter.value === "all") {
          params.delete("status");
        } else {
          params.set("status", filter.value);
        }
        const href = params.toString() ? `${pathname}?${params}` : pathname;
        const active = current === filter.value;

        return (
          <Link
            key={filter.value}
            href={href}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
