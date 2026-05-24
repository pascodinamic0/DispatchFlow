import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { positioning } from "@/lib/marketing-audience";

const broken = [
  "Requests live in email threads — approvers miss context and priority",
  "Dispatch status in WhatsApp — no audit trail when something slips",
  "Inventory in separate sheets — stock counts disagree with what shipped",
  "Leadership reports built by hand every week — always a day late",
] as const;

const fixed = [
  "One request queue with priority, destination, and approval history",
  "Dispatch board with assignments and in-transit updates from the field",
  "Inventory movements tied to deliveries and branch stock levels",
  "Dashboard KPIs and activity feed — the same numbers ops sees daily",
] as const;

export function LandingContrast() {
  return (
    <section id="why-different" className="border-y border-border bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Why teams switch
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Why scattered tools fail at scale
          </h2>
          <p className="mt-4 text-muted-foreground">{positioning.problem}</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-danger/20 bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex items-center gap-2 text-danger">
              <XCircle className="size-5" aria-hidden />
              <h3 className="text-lg font-semibold text-foreground">The broken default</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {broken.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-success/25 bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="size-5" aria-hidden />
              <h3 className="text-lg font-semibold text-foreground">
                How DispatchFlow is different
              </h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{positioning.mechanism}</p>
            <ul className="mt-6 space-y-4">
              {fixed.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm font-medium text-foreground">
          {positioning.outcome}
        </p>
      </div>
    </section>
  );
}
