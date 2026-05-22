import { MarketingShell } from "@/components/marketing/marketing-shell";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingShell variant="page">{children}</MarketingShell>;
}
