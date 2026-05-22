import Link from "next/link";
import { Package } from "lucide-react";
import { StockStatusBadge } from "@/components/shared/stock-status-badge";
import {
  MobileList,
  MobileListItem,
  ResponsiveListShell,
} from "@/components/shared/responsive-list";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
} from "@/components/ui/data-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { InventoryItem } from "@/types";

function isLowStock(item: InventoryItem) {
  return Number(item.quantity_on_hand) <= Number(item.reorder_level);
}

export function InventoryList({ items }: { items: InventoryItem[] }) {
  return (
    <ResponsiveListShell
      hasItems={items.length > 0}
      empty={{
        icon: Package,
        title: "No inventory items",
        description:
          "Add stock items to track quantities, locations, and reorder levels.",
        action: (
          <Link href="/inventory/new" className={buttonVariants()}>
            Add item
          </Link>
        ),
      }}
      table={
        <DataTable>
          <DataTableHeader>
            <DataTableRow className="hover:bg-transparent">
              <DataTableHead>Item</DataTableHead>
              <DataTableHead>SKU</DataTableHead>
              <DataTableHead>Location</DataTableHead>
              <DataTableHead>On hand</DataTableHead>
              <DataTableHead>Status</DataTableHead>
            </DataTableRow>
          </DataTableHeader>
          <DataTableBody>
            {items.map((item) => {
              const qty = Number(item.quantity_on_hand);
              const lowStock = isLowStock(item);

              return (
                <DataTableRow key={item.id}>
                  <DataTableCell>
                    <Link
                      href={`/inventory/${item.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    {item.category ? (
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    ) : null}
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground">{item.sku}</DataTableCell>
                  <DataTableCell className="text-muted-foreground">
                    {item.location ?? "—"}
                  </DataTableCell>
                  <DataTableCell
                    className={cn(
                      "font-medium tabular-nums",
                      lowStock && "text-destructive",
                    )}
                  >
                    {qty} {item.unit}
                  </DataTableCell>
                  <DataTableCell>
                    <StockStatusBadge lowStock={lowStock} />
                  </DataTableCell>
                </DataTableRow>
              );
            })}
          </DataTableBody>
        </DataTable>
      }
      mobile={
        <MobileList>
          {items.map((item) => {
            const qty = Number(item.quantity_on_hand);
            const lowStock = isLowStock(item);

            return (
              <MobileListItem key={item.id} href={`/inventory/${item.id}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "font-medium tabular-nums",
                        lowStock && "text-destructive",
                      )}
                    >
                      {qty} {item.unit}
                    </p>
                    {lowStock ? (
                      <span className="text-xs text-destructive">Low stock</span>
                    ) : null}
                  </div>
                </div>
              </MobileListItem>
            );
          })}
        </MobileList>
      }
    />
  );
}
