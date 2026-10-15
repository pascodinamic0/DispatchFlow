import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { cn } from "@/lib/utils";

type MarketingShellProps = {
  children: React.ReactNode;
  /** Hide anchor nav on subpages (terms, privacy, etc.) */
  variant?: "landing" | "page";
};

export function MarketingShell({
  children,
  variant = "page",
}: MarketingShellProps) {
  const isLanding = variant === "landing";

  return (
    <div
      className={cn(
        "flex flex-col overflow-x-clip bg-background",
        /* Mobile landing: one fixed Boutik viewport — no page scroll */
        isLanding
          ? "h-dvh max-h-dvh overflow-hidden md:h-auto md:max-h-none md:min-h-svh md:overflow-x-clip"
          : "min-h-svh",
      )}
      data-marketing-shell={variant}
    >
      <MarketingHeader variant={variant} />
      {/* pb-safe on mobile page variant: footer hidden below md.
          Landing mobile: deck owns the viewport; no extra body pad. */}
      <main
        className={cn(
          "flex-1 overflow-x-clip",
          isLanding
            ? "flex min-h-0 flex-col overflow-hidden pb-0 md:block md:overflow-x-clip md:overflow-y-visible"
            : "pb-safe md:pb-0",
        )}
      >
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
