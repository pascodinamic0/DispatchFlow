import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { RequestList } from "@/features/requests/components/request-list";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { requireProfile } from "@/lib/auth/session";
import { canCreateRequests } from "@/lib/permissions";
import { listRequests } from "@/services/requests.service";

export default async function RequestsPage() {
  const { supabase, profile } = await requireProfile();
  const requests = await listRequests(supabase, profile.organization_id);
  const canCreate = canCreateRequests(profile.role);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procurement requests"
        description="Submit and track internal procurement needs."
        action={
          canCreate ? (
            <Link
              href="/requests/new"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              New request
            </Link>
          ) : undefined
        }
      />
      <RequestList requests={requests} />
    </div>
  );
}
