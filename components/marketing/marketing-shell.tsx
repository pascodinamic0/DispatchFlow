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
    <div className="flex min-h-svh flex-col overflow-x-clip bg-background">
      <MarketingHeader variant={variant} />
      {/* pb-safe on mobile: footer is hidden below md, so main owns home-indicator inset */}
      <main className="flex-1 overflow-x-clip pb-safe md:pb-0">{children}</main>
      <MarketingFooter />
    </div>
  );
}
