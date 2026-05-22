import { Database, Lock, Smartphone, Zap } from "lucide-react";

const items = [
  {
    icon: Lock,
    title: "Row Level Security",
    description: "Organization-scoped data isolation at the database layer.",
  },
  {
    icon: Database,
    title: "Supabase Postgres",
    description: "Reliable, auditable storage with migrations you control.",
  },
  {
    icon: Smartphone,
    title: "Mobile-ready ops",
    description: "Field-friendly UI for status updates on the move.",
  },
  {
    icon: Zap,
    title: "Fast, focused UX",
    description: "150ms transitions, clear status pills, zero clutter.",
  },
] as const;

export function LandingTrust() {
  return (
    <section className="border-t border-border bg-card py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-md text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Enterprise-grade by default
            </h2>
            <p className="mt-3 text-muted-foreground">
              Security and clarity are not add-ons. They are how DispatchFlow is
              built — so your team can trust every screen.
            </p>
          </div>
          <ul className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item.title} className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-4" aria-hidden />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
