import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MarketingMobileNav } from "@/components/marketing/marketing-mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { marketing } from "@/lib/marketing";
import { cn } from "@/lib/utils";

type MarketingHeaderProps = {
  variant?: "landing" | "page";
};

const extraNav = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function MarketingHeader({ variant = "page" }: MarketingHeaderProps) {
  const desktopNav =
    variant === "landing"
      ? [...marketing.nav, ...extraNav]
      : [...marketing.nav, ...extraNav];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--brand-navy)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-lg bg-white px-3 py-1.5 shadow-sm"
        >
          <Logo className="max-h-9 w-auto" priority />
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {desktopNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden text-slate-200 hover:bg-white/10 hover:text-white sm:inline-flex",
            )}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "shadow-md",
            )}
          >
            Get started
          </Link>
          <MarketingMobileNav items={marketing.nav} className="lg:hidden" />
        </div>
      </div>
    </header>
  );
}
