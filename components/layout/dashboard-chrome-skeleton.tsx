export function DashboardChromeSkeleton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh w-full">
      <div
        className="hidden w-16 shrink-0 border-r border-sidebar-border bg-sidebar md:block"
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 flex-col bg-background">
        <div
          className="h-14 shrink-0 border-b border-border/80 bg-card/95"
          aria-hidden
        />
        <main className="flex-1 p-4 pb-20 sm:p-6 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
