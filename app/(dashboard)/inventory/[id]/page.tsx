import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailMetadata } from "@/components/shared/detail-metadata";
import { StockMovementForm } from "@/features/inventory/components/stock-movement-form";
import { formatDateTime } from "@/lib/format";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { requireProfile } from "@/lib/auth/session";
import { canManageInventory } from "@/lib/permissions";
import {
  getInventoryItemById,
  listMovementsForItem,
} from "@/services/inventory.service";

export default async function InventoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, profile } = await requireProfile();
  const item = await getInventoryItemById(supabase, id);

  if (!item || item.organization_id !== profile.organization_id) {
    notFound();
  }

  let movements: Awaited<ReturnType<typeof listMovementsForItem>> = [];
  try {
    movements = await listMovementsForItem(supabase, id);
  } catch {
    // Table may not exist until migration is applied
  }

  const qty = Number(item.quantity_on_hand);
  const reorder = Number(item.reorder_level);
  const canAdjust = canManageInventory(profile.role);

  return (
    <div className="space-y-6">
      <PageHeader
        title={item.name}
        description={item.sku}
        action={
          <Link
            href="/inventory"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to list
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <DetailMetadata
              items={[
                {
                  label: "On hand",
                  value: (
                    <span className="text-lg font-semibold tabular-nums">
                      {qty} {item.unit}
                    </span>
                  ),
                },
                {
                  label: "Reorder level",
                  value: (
                    <span className="tabular-nums">
                      {reorder} {item.unit}
                    </span>
                  ),
                },
                { label: "Category", value: item.category ?? "—" },
                { label: "Location", value: item.location ?? "—" },
              ]}
            />
            {item.description ? (
              <p className="text-muted-foreground">{item.description}</p>
            ) : null}
            {qty <= reorder ? (
              <p className="text-sm font-medium text-destructive">Below reorder level</p>
            ) : null}
          </CardContent>
        </Card>

        {canAdjust ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Adjust stock</CardTitle>
            </CardHeader>
            <CardContent>
              <StockMovementForm itemId={item.id} />
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Recent movements</CardTitle>
        </CardHeader>
        <CardContent>
          {movements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No movements recorded yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {movements.map((m) => (
                <li
                  key={m.id}
                  className="flex justify-between gap-4 border-b border-border/60 pb-2 last:border-0"
                >
                  <span className="capitalize text-muted-foreground">
                    {m.movement_type} · {Number(m.quantity)} {item.unit}
                    {m.notes ? ` — ${m.notes}` : ""}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDateTime(m.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
