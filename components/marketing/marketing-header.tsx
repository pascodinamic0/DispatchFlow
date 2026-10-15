import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MarketingMobileNav } from "@/components/marketing/marketing-mobile-nav";
import { marketing } from "@/lib/marketing";

type MarketingHeaderProps = {
  variant?: "landing" | "page";
};

const extraNav = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function MarketingHeader({ variant = "page" }: MarketingHeaderProps) {
  const desktopNav = [...marketing.nav, ...extraNav];
  void variant;

  return (
    <header className="pt-safe sticky top-0 z-50 border-b border-white/10 bg-[var(--brand-navy)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="flex min-h-10 min-w-0 shrink items-center rounded-xl bg-white px-2 py-1 shadow-sm sm:min-h-11 sm:px-3 sm:py-1.5"
        >
          <Logo className="max-h-7 w-auto max-w-[148px] object-contain object-left sm:max-h-9 sm:max-w-none" priority />
        </Link>

        <nav
          className="ml-auto hidden items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {desktopNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 lg:ml-0">
          <Link
            href="/login"
            className="df-cta-nav hidden text-slate-200 hover:bg-white/10 hover:text-white md:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="df-cta-nav inline-flex bg-lime-400 px-3.5 text-slate-950 shadow-md shadow-lime-400/20 hover:bg-lime-300 sm:px-4"
          >
            <span className="sm:hidden">Start</span>
            <span className="hidden sm:inline">Get started</span>
          </Link>
          <MarketingMobileNav items={marketing.nav} className="lg:hidden" />
        </div>
      </div>
    </header>
  );
}
