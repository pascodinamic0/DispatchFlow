import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, MapPin, Truck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const highlights = [
  "Multi-branch procurement workflows",
  "Real-time dispatch status tracking",
  "Inventory tied to your organization",
] as const;

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--brand-navy)] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% -10%, #2563eb40 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 100% 50%, #3b82f620 0%, transparent 45%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Built for African enterprise operations
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.35rem]">
                <span className="block text-white">Request.</span>
                <span className="block text-white">Track.</span>
                <span className="block bg-gradient-to-r from-[#60a5fa] to-[#2563eb] bg-clip-text text-transparent">
                  Deliver.
                </span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-slate-300">
                Stop losing requests in email, dispatch status in WhatsApp, and
                inventory in spreadsheets. {brand.name} gives your operations team
                one system of record — procurement, shipments, and stock — built
                for multi-branch enterprises across Africa.
              </p>
            </div>

            <ul className="space-y-2.5">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-emerald-400"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 shadow-lg shadow-primary/30",
                )}
              >
                Start your workspace
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#product"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white",
                )}
              >
                See the platform
              </Link>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <ClipboardList className="size-4 text-primary" aria-hidden />
                Procurement
              </li>
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-primary" aria-hidden />
                Dispatches
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" aria-hidden />
                Branches
              </li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="size-2.5 rounded-full bg-red-400/90" />
                <span className="size-2.5 rounded-full bg-amber-400/90" />
                <span className="size-2.5 rounded-full bg-emerald-400/90" />
                <span className="ml-2 text-xs text-slate-400">Operations dashboard</span>
              </div>
              <Image
                src={brand.marketing.heroDashboard.src}
                alt={brand.marketing.heroDashboard.alt}
                width={brand.marketing.heroDashboard.width}
                height={brand.marketing.heroDashboard.height}
                className="h-auto w-full object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
