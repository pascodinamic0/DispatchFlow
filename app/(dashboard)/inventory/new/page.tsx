import { redirect } from "next/navigation";
import { CreateInventoryForm } from "@/features/inventory/components/create-inventory-form";
import { PageHeader } from "@/components/layout/page-header";
import { requireProfile } from "@/lib/auth/session";
import { canManageInventory } from "@/lib/permissions";

export default async function NewInventoryPage() {
  const { profile } = await requireProfile();
  if (!canManageInventory(profile.role)) {
    redirect("/inventory");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add inventory item"
        description="Register SKU, location, and opening quantity."
      />
      <CreateInventoryForm />
    </div>
  );
}
