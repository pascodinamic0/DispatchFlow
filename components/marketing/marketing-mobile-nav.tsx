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
import { marketing } from "@/lib/marketing";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string };

type MarketingMobileNavProps = {
  items: readonly NavItem[];
  className?: string;
};

export function MarketingMobileNav({ items, className }: MarketingMobileNavProps) {
  const [open, setOpen] = useState(false);

  const allItems: NavItem[] = [
    ...items,
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    ...marketing.footer.legal,
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "text-slate-200 hover:bg-white/10 hover:text-white",
          className,
        )}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full border-border bg-background sm:max-w-sm"
      >
        <SheetHeader className="border-b border-border pb-4 text-left">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Link href="/" onClick={() => setOpen(false)} className="inline-block">
            <Logo className="max-h-9" />
          </Link>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
          {allItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ variant: "default" }), "w-full")}
          >
            Get started
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
