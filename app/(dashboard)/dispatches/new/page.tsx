import { redirect } from "next/navigation";
import { CreateDispatchForm } from "@/features/dispatches/components/create-dispatch-form";
import { PageHeader } from "@/components/layout/page-header";
import { requireProfile } from "@/lib/auth/session";
import { canManageDispatches } from "@/lib/permissions";
import { listRequests } from "@/services/requests.service";

export default async function NewDispatchPage({
  searchParams,
}: {
  searchParams: Promise<{ requestId?: string; destination?: string }>;
}) {
  const { supabase, profile } = await requireProfile();
  if (!canManageDispatches(profile.role)) {
    redirect("/dispatches");
  }

  const approvedRequests = await listRequests(supabase, profile.organization_id, {
    status: "approved",
  });

  const params = await searchParams;

  return (
    <div className="space-y-6">
      <PageHeader
        title="New dispatch"
        description="Create a delivery assignment linked to a request or standalone."
      />
      <CreateDispatchForm
        requestId={params.requestId}
        defaultDestination={params.destination ?? null}
        approvedRequests={approvedRequests.map((r) => ({
          id: r.id,
          title: r.title,
          destination: r.destination,
        }))}
      />
    </div>
  );
}
