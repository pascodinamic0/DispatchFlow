import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { InventoryList } from "@/features/inventory/components/inventory-list";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { requireProfile } from "@/lib/auth/session";
import { canManageInventory } from "@/lib/permissions";
import { listInventoryItems } from "@/services/inventory.service";

export default async function InventoryPage() {
  const { supabase, profile } = await requireProfile();
  let items: Awaited<ReturnType<typeof listInventoryItems>> = [];
  try {
    items = await listInventoryItems(supabase, profile.organization_id);
  } catch {
    // inventory tables available after migration 20250522000003
  }
  const canCreate = canManageInventory(profile.role);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Stock levels and movement across sites."
        action={
          canCreate ? (
            <Link
              href="/inventory/new"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Add item
            </Link>
          ) : undefined
        }
      />
      <InventoryList items={items} />
    </div>
  );
}
