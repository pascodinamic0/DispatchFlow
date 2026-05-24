import Link from "next/link";
import { ArrowRight, Building2, Globe2, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { idealCustomer } from "@/lib/marketing-audience";
import { cn } from "@/lib/utils";

export function LandingAudience() {
  return (
    <section id="audience" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Built for you
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {idealCustomer.headline}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {idealCustomer.oneLiner}
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-3">
                <Building2 className="size-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <h3 className="text-sm font-semibold">Industries we serve</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {idealCustomer.industries.join(" · ")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Globe2 className="size-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <h3 className="text-sm font-semibold">Markets</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {idealCustomer.geographies.slice(0, 4).join(" · ")} — and teams like yours
                    globally.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/blog"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-8 gap-2")}
            >
              Read ops insights
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="size-4 text-primary" aria-hidden />
              Who gets the most value
            </div>
            {idealCustomer.primarySegments.map((segment) => (
              <div
                key={segment.id}
                className="df-card p-5 sm:p-6"
              >
                <h3 className="text-base font-semibold">{segment.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Pain: </span>
                  {segment.pain}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Outcome: </span>
                  {segment.outcome}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {segment.triggers.map((t) => (
                    <li
                      key={t}
                      className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
