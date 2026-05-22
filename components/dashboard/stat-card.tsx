import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconClassName?: string;
  className?: string;
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "df-card border-border/80 py-0 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pt-5 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg",
            iconClassName ?? "bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-[1.125rem] stroke-[1.75]" aria-hidden />
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <p className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
          {value}
        </p>
        {description ? (
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
