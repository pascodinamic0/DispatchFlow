"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function LandingCta() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const show = reduceMotion || inView;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--brand-navy)] py-20 text-white sm:py-28"
      aria-labelledby="landing-cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 100%, rgba(163,230,53,0.18) 0%, transparent 55%)",
        }}
      />
      <motion.div
        className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-lime-400">
          {brand.tagline}
        </p>
        <h2
          id="landing-cta-heading"
          className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Ready to run your operations?
        </h2>
        <p className="mt-4 text-lg text-slate-300">
          Create your workspace, invite your team, and replace scattered
          spreadsheets with one platform your whole organization trusts.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "cursor-pointer gap-2 bg-lime-400 text-slate-950 shadow-lg shadow-lime-400/25 hover:bg-lime-300 focus-visible:ring-lime-400",
            )}
          >
            Create free workspace
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "cursor-pointer border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white",
            )}
          >
            Talk to us
          </Link>
        </div>
        <p className="mt-8 text-xs text-slate-500">
          By signing up you agree to our{" "}
          <Link
            href="/terms"
            className="cursor-pointer text-slate-400 underline-offset-4 hover:text-white hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="cursor-pointer text-slate-400 underline-offset-4 hover:text-white hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </motion.div>
    </section>
  );
}
