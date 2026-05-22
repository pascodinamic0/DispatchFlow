import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: "Why DispatchFlow exists and who we build for.",
};

const principles = [
  {
    title: "Operational clarity first",
    body: "Every screen should answer what needs attention now — not impress with decoration.",
  },
  {
    title: "Built for real enterprises",
    body: "Multi-branch logistics, procurement approvals, and inventory that reflects the field.",
  },
  {
    title: "Calm, premium, minimal",
    body: "Structured like the best SaaS dashboards — without crypto aesthetics or noise.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            About {brand.name}
          </p>
          <h1 className="df-page-title mt-2 max-w-2xl text-4xl tracking-tight sm:text-5xl">
            Logistics software that respects how operations actually run
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            We built {brand.name} for teams tired of juggling spreadsheets, chat threads,
            and disconnected tools. One platform for {brand.tagline.toLowerCase()} — with
            the discipline of Stripe-grade product design.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Target className="size-6" aria-hidden />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Our mission</h2>
            <p className="leading-relaxed text-muted-foreground">
              African and global enterprises deserve operations software that is fast,
              trustworthy, and beautiful — not legacy ERPs or hacked-together Notion boards.
              {brand.name} gives procurement, dispatch, and inventory teams a shared system
              of record with role-appropriate access and mobile-friendly workflows.
            </p>
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "gap-2")}
            >
              Start your workspace
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="df-card overflow-hidden p-1">
            <Image
              src={brand.marketing.aboutAnalytics.src}
              alt={brand.marketing.aboutAnalytics.alt}
              width={brand.marketing.aboutAnalytics.width}
              height={brand.marketing.aboutAnalytics.height}
              className="rounded-[calc(var(--radius-xl)-4px)] object-cover object-top"
            />
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {principles.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
