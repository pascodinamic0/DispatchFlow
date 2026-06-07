import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  projectRef: string;
  hasLogoUrlColumn: boolean;
  hasOrganizationLogosBucket: boolean;
  hasAvatarsBucket: boolean;
};

export function LogoSetupBanner({
  projectRef,
  hasLogoUrlColumn,
  hasOrganizationLogosBucket,
  hasAvatarsBucket,
}: Props) {
  if (hasLogoUrlColumn && hasOrganizationLogosBucket && hasAvatarsBucket) {
    return null;
  }

  const sqlUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

  return (
    <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
      <div className="flex flex-wrap items-start gap-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="font-medium text-foreground">Logo uploads need a one-time database setup</p>
          <p className="text-muted-foreground">
            Your Supabase project is missing{" "}
            {[
              !hasLogoUrlColumn ? "the logo_url column" : null,
              !hasOrganizationLogosBucket ? "the organization-logos bucket" : null,
              !hasAvatarsBucket ? "the avatars bucket" : null,
            ]
              .filter(Boolean)
              .join(", ")}
            . Run{" "}
            <code className="text-xs">scripts/apply-logo-storage.sql</code> in the SQL
            Editor, or run{" "}
            <code className="text-xs">node scripts/setup-logo-storage.mjs</code> locally.
          </p>
        </div>
        <Link
          href={sqlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
        >
          Open SQL Editor
        </Link>
      </div>
    </div>
  );
}
