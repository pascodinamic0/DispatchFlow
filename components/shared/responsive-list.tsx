import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";

type ResponsiveListShellProps = {
  empty: {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
  };
  table: ReactNode;
  mobile: ReactNode;
  hasItems: boolean;
};

export function ResponsiveListShell({
  empty,
  table,
  mobile,
  hasItems,
}: ResponsiveListShellProps) {
  if (!hasItems) {
    return (
      <EmptyState
        icon={empty.icon}
        title={empty.title}
        description={empty.description}
        action={empty.action}
      />
    );
  }

  return (
    <>
      <div className="hidden md:block">{table}</div>
      {mobile}
    </>
  );
}

export function MobileList({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-border md:hidden">{children}</ul>;
}

export function MobileListItem({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="df-transition flex min-h-[72px] flex-col gap-2 px-4 py-4 active:bg-muted/50"
      >
        {children}
      </Link>
    </li>
  );
}
