import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

type MarketingShellProps = {
  children: React.ReactNode;
  /** Hide anchor nav on subpages (terms, privacy, etc.) */
  variant?: "landing" | "page";
};

export function MarketingShell({
  children,
  variant = "page",
}: MarketingShellProps) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <MarketingHeader variant={variant} />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
