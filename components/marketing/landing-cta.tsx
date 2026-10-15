"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { brand } from "@/lib/brand";

export function LandingCta() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const show = reduceMotion || inView;

  return (
    <section
      ref={ref}
      className="relative overflow-x-clip bg-[var(--brand-navy)] py-14 text-white sm:py-28"
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
        <p className="text-[13px] font-semibold uppercase tracking-wider text-lime-400">
          {brand.tagline}
        </p>
        <h2
          id="landing-cta-heading"
          className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight sm:text-4xl"
        >
          Ready to run your operations?
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-slate-300 sm:text-lg">
          Create your workspace, invite your team, and replace scattered
          spreadsheets with one platform your whole organization trusts.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center">
          <Link href="/signup" className="df-cta-primary">
            Create free workspace
            <ArrowRight className="size-5" aria-hidden />
          </Link>
          {/* Secondary is button on sm+; quiet text on phone so CTAs don't fight */}
          <Link
            href="/contact"
            className="df-cta-secondary hidden sm:inline-flex"
          >
            Talk to us
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center text-[15px] font-semibold text-slate-300 underline-offset-4 active:text-white sm:hidden"
          >
            Talk to us
          </Link>
        </div>
        <p className="mt-8 text-[13px] leading-relaxed text-slate-500">
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
