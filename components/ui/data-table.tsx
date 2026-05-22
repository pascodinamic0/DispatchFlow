import { cn } from "@/lib/utils";

function DataTable({
  className,
  children,
}: React.ComponentProps<"table">) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border bg-card shadow-[var(--shadow-card)]", className)}>
      <table className="w-full min-w-[640px] border-collapse text-sm">
        {children}
      </table>
    </div>
  );
}

function DataTableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn(
        "sticky top-0 z-10 border-b border-border bg-muted/50 backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

function DataTableBody(props: React.ComponentProps<"tbody">) {
  return <tbody {...props} />;
}

function DataTableRow({
  className,
  ...props
}: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "df-transition border-b border-border/80 last:border-0 hover:bg-muted/40",
        className,
      )}
      {...props}
    />
  );
}

function DataTableHead({
  className,
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
}

function DataTableCell({
  className,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td
      className={cn("px-4 py-3.5 align-middle text-foreground", className)}
      {...props}
    />
  );
}

export {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableHead,
  DataTableCell,
};
