"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * Slim page-sheet only — no blog/legal link farm (Boutik / iOS lander rule).
 * Landing variant has no hamburger at all; this is for /about, /blog, etc.
 */
const sheetLinks = [
  { label: "Product", href: "/#product" },
  { label: "Proof", href: "/#proof" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

type MarketingMobileNavProps = {
  className?: string;
};

export function MarketingMobileNav({ className }: MarketingMobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "min-h-11 min-w-11 text-slate-200 hover:bg-white/10 hover:text-white",
          className,
        )}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full border-border bg-background pt-safe pb-safe sm:max-w-sm"
      >
        <SheetHeader className="border-b border-border pb-4 text-left">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Link href="/" onClick={() => setOpen(false)} className="inline-block">
            <Logo className="max-h-9" />
          </Link>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
          {sheetLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 cursor-pointer items-center rounded-xl px-3 text-base font-medium text-foreground active:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "min-h-12 w-full cursor-pointer text-base font-semibold",
            )}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="df-cta-primary"
          >
            Get started
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
