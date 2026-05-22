import { cn } from "@/lib/utils";
import { statusBadgeBase } from "@/lib/status-styles";

const stockStyles = {
  low: "bg-red-500/12 text-red-700 dark:text-red-400",
  ok: "bg-emerald-500/12 text-emerald-800 dark:text-emerald-400",
} as const;

export function StockStatusBadge({ lowStock }: { lowStock: boolean }) {
  return (
    <span
      className={cn(
        statusBadgeBase,
        lowStock ? stockStyles.low : stockStyles.ok,
      )}
    >
      {lowStock ? "Low stock" : "OK"}
    </span>
  );
}
