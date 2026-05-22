import { redirect } from "next/navigation";
import { CreateRequestForm } from "@/features/requests/components/create-request-form";
import { PageHeader } from "@/components/layout/page-header";
import { requireProfile } from "@/lib/auth/session";
import { canCreateRequests } from "@/lib/permissions";
import { listInventoryItems } from "@/services/inventory.service";

export default async function NewRequestPage() {
  const { supabase, profile } = await requireProfile();
  if (!canCreateRequests(profile.role)) {
    redirect("/requests");
  }

  const inventory = await listInventoryItems(
    supabase,
    profile.organization_id,
  ).catch(() => []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="New procurement request"
        description="Save a draft or submit for approval. Link inventory items if needed."
      />
      <CreateRequestForm
        inventory={inventory.map((item) => ({
          id: item.id,
          sku: item.sku,
          name: item.name,
          unit: item.unit,
          quantityOnHand: Number(item.quantity_on_hand),
        }))}
      />
    </div>
  );
}
