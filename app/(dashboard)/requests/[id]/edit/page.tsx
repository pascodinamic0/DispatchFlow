import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EditRequestForm } from "@/features/requests/components/edit-request-form";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { requireProfile } from "@/lib/auth/session";
import { listLineItemsForRequest } from "@/services/request-line-items.service";
import { getRequestById } from "@/services/requests.service";
import { listInventoryItems } from "@/services/inventory.service";

export default async function EditRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user, profile } = await requireProfile();
  const request = await getRequestById(supabase, id);

  if (!request || request.organization_id !== profile.organization_id) {
    notFound();
  }

  if (request.status !== "draft" || request.requester_id !== user.id) {
    redirect(`/requests/${id}`);
  }

  const [lineItems, inventory] = await Promise.all([
    listLineItemsForRequest(supabase, id),
    listInventoryItems(supabase, profile.organization_id).catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit draft"
        description={request.title}
        action={
          <Link
            href={`/requests/${id}`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back
          </Link>
        }
      />
      <EditRequestForm
        request={request}
        inventory={inventory.map((item) => ({
          id: item.id,
          sku: item.sku,
          name: item.name,
          unit: item.unit,
          quantityOnHand: Number(item.quantity_on_hand),
        }))}
        lineItems={lineItems.map((row) => ({
          inventoryItemId: row.inventory_item_id,
          quantity: Number(row.quantity),
          notes: row.notes,
        }))}
      />
    </div>
  );
}
