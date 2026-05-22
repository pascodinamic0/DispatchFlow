import { cn } from "@/lib/utils";
import type { RequestPriority } from "@/lib/constants/priorities";

export function PriorityText({ priority }: { priority: RequestPriority | string }) {
  return (
    <span
      className={cn(
        "text-xs capitalize",
        priority === "urgent" && "font-medium text-destructive",
        priority === "high" && "text-amber-700 dark:text-amber-400",
      )}
    >
      {priority}
    </span>
  );
}
