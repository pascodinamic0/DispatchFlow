"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mobileNav } from "@/lib/navigation";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-40 flex border-t border-border bg-card px-1 py-1 safe-area-pb md:hidden"
      aria-label="Mobile navigation"
    >
      {mobileNav.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "df-transition flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-[0.6875rem] font-medium",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="size-5 stroke-[1.75]" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
