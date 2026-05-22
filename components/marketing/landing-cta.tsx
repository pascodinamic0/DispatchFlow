import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function LandingCta() {
  return (
    <section className="relative overflow-hidden bg-[var(--brand-navy)] py-20 text-white sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, #2563eb35 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          {brand.tagline}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to run your operations?
        </h2>
        <p className="mt-4 text-lg text-slate-300">
          Create your workspace, invite your team, and replace scattered spreadsheets
          with one platform your whole organization trusts.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "gap-2 shadow-lg shadow-primary/30",
            )}
          >
            Create free workspace
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white",
            )}
          >
            Talk to us
          </Link>
        </div>
        <p className="mt-8 text-xs text-slate-500">
          By signing up you agree to our{" "}
          <Link href="/terms" className="text-slate-400 underline-offset-4 hover:text-white hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-slate-400 underline-offset-4 hover:text-white hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
