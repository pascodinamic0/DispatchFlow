"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { BarChart3, Shield, Smartphone, Zap } from "lucide-react";

const proofPoints = [
  {
    icon: BarChart3,
    metric: "3 modules",
    label: "One system of record",
    detail:
      "Procurement, dispatch, and inventory — not three tools duct-taped together.",
  },
  {
    icon: Shield,
    metric: "RLS by org",
    label: "Data you can defend",
    detail:
      "Postgres Row Level Security so each organization only sees its own operations data.",
  },
  {
    icon: Smartphone,
    metric: "Field-ready",
    label: "Status from the road",
    detail:
      "Touch-friendly updates for dispatchers and requesters — no desktop required.",
  },
  {
    icon: Zap,
    metric: "Calm UX",
    label: "Operators adopt it",
    detail:
      "Status pills, clear tables, and fast transitions — built for daily ops, not demos.",
  },
] as const;

const scenarios = [
  {
    title: "Multi-branch distributor",
    body: "Central procurement approves spend; branch managers see incoming stock without calling HQ.",
  },
  {
    title: "NGO supply chain",
    body: "Field requesters submit needs; dispatchers assign vehicles; leadership tracks in-transit loads.",
  },
  {
    title: "Growing manufacturer",
    body: "Internal transfers replace ad-hoc spreadsheets — delivery confirmation updates stock automatically.",
  },
] as const;

export function LandingProof() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const show = reduceMotion || inView;

  return (
    <section
      id="proof"
      ref={ref}
      className="overflow-x-clip bg-[var(--brand-navy)] py-14 text-white sm:py-28"
      aria-labelledby="landing-proof-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-lime-400/90">
            Proof & fit
          </p>
          <h2
            id="landing-proof-heading"
            className="mt-2 text-[1.75rem] font-bold leading-tight tracking-tight sm:text-4xl"
          >
            Why operations teams trust one platform
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-300 sm:text-base">
            Clear mechanism, real constraints solved, and security your IT team
            can explain in one sentence.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {proofPoints.map((item, i) => (
            <motion.div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors duration-200 active:border-lime-400/30 active:bg-white/[0.06] sm:p-6 sm:hover:border-lime-400/30 sm:hover:bg-white/[0.06]"
              initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
              animate={show ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                delay: 0.06 * i,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <item.icon className="size-6 text-lime-400" aria-hidden />
              <p className="mt-4 font-mono text-xl font-bold tabular-nums sm:text-2xl">
                {item.metric}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 hidden sm:mt-16 sm:block">
          <h3 className="text-center text-base font-semibold sm:text-lg">
            Typical deployments
          </h3>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-3 md:gap-5">
            {scenarios.map((s, i) => (
              <motion.div
                key={s.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors duration-200 active:border-white/20 sm:hover:border-white/20"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={show ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
              >
                <h4 className="font-semibold text-lime-100">{s.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
