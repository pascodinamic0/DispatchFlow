"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  ClipboardList,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const highlights = [
  "Multi-branch procurement workflows",
  "Live dispatch status — not WhatsApp threads",
  "Inventory tied to every delivery confirmation",
] as const;

const kpi = [
  { label: "In transit", value: "12", delta: "+3 today" },
  { label: "Open requests", value: "28", delta: "4 urgent" },
  { label: "Low stock", value: "6", delta: "SKUs" },
] as const;

const dispatches = [
  {
    code: "DSP-1842",
    route: "Kinshasa → Lubumbashi",
    status: "In transit",
    tone: "lime" as const,
  },
  {
    code: "DSP-1839",
    route: "HQ → Goma branch",
    status: "Loading",
    tone: "amber" as const,
  },
  {
    code: "REQ-9041",
    route: "Spare parts · Priority high",
    status: "Approved",
    tone: "sky" as const,
  },
] as const;

const bars = [42, 58, 48, 72, 68, 88];
const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];

const toneClass = {
  lime: "bg-lime-400/15 text-lime-300 ring-lime-400/30",
  amber: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
  sky: "bg-sky-400/15 text-sky-300 ring-sky-400/30",
} as const;

export function LandingHero() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const inView = useInView(heroRef, { once: true, margin: "-60px 0px" });
  const { scrollY } = useScroll();
  const yGlow = useTransform(scrollY, [0, 480], [0, reduceMotion ? 0 : 90]);
  const [liveAt, setLiveAt] = useState<string | null>(null);

  useEffect(() => {
    const stamp = () =>
      setLiveAt(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Africa/Kinshasa",
        }).format(new Date()) + " CAT",
      );
    stamp();
    if (reduceMotion) return;
    const id = window.setInterval(stamp, 1000);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const show = !reduceMotion && inView;

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-[var(--brand-navy)] text-white"
      aria-labelledby="landing-hero-heading"
    >
      <motion.div
        className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-lime-400/10 blur-3xl"
        style={{ y: yGlow }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div className="space-y-8">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={show || reduceMotion ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-lime-400/25 bg-lime-400/10 px-3 py-1.5 text-xs font-medium text-lime-200"
            >
              <span className="relative flex size-2" aria-hidden>
                {!reduceMotion && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime-400 opacity-60" />
                )}
                <span className="relative inline-flex size-2 rounded-full bg-lime-400" />
              </span>
              Live ops preview
              {liveAt ? (
                <span className="font-mono text-[10px] text-lime-300/80">
                  · {liveAt}
                </span>
              ) : null}
            </motion.div>

            <div className="space-y-5">
              <motion.h1
                id="landing-hero-heading"
                className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.35rem]"
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={show || reduceMotion ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="block text-white">Request.</span>
                <span className="block text-white">Track.</span>
                <span className="block bg-gradient-to-r from-lime-300 via-lime-400 to-emerald-400 bg-clip-text text-transparent">
                  Deliver.
                </span>
              </motion.h1>
              <motion.p
                className="max-w-lg text-lg leading-relaxed text-slate-300"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={show || reduceMotion ? { opacity: 1 } : {}}
                transition={{ duration: 0.45, delay: 0.2 }}
              >
                Stop losing requests in email, dispatch status in WhatsApp, and
                inventory in spreadsheets. {brand.name} is one system of record
                for multi-branch enterprises — procurement, shipments, and stock.
              </motion.p>
            </div>

            <motion.ul
              className="space-y-2.5"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={show || reduceMotion ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.28 }}
            >
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-slate-300"
                >
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime-400"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </motion.ul>

            <motion.div
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={show || reduceMotion ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.36 }}
            >
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "cursor-pointer gap-2 bg-lime-400 text-slate-950 shadow-lg shadow-lime-400/25 hover:bg-lime-300 focus-visible:ring-lime-400",
                )}
              >
                Start your workspace
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="#product"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "cursor-pointer border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white",
                )}
              >
                See the app shell
              </Link>
            </motion.div>

            <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <ClipboardList className="size-4 text-lime-400" aria-hidden />
                Procurement
              </li>
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-lime-400" aria-hidden />
                Dispatches
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-lime-400" aria-hidden />
                Branches
              </li>
            </ul>
          </div>

          <motion.div
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
            animate={
              show || reduceMotion ? { opacity: 1, y: 0, scale: 1 } : {}
            }
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div
              className="absolute -inset-3 rounded-3xl bg-lime-400/15 blur-2xl"
              aria-hidden
            />
            <div className="relative z-10 overflow-hidden rounded-2xl border border-white/12 bg-[#0f172a]/90 shadow-2xl shadow-black/40 ring-1 ring-lime-400/20 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex items-center gap-1.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-red-400/90" />
                  <span className="size-2.5 rounded-full bg-amber-400/90" />
                  <span className="size-2.5 rounded-full bg-emerald-400/90" />
                </div>
                <span className="font-mono text-[11px] tracking-wide text-slate-400">
                  {brand.name} · Ops console
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-400/10 px-2 py-0.5 text-[10px] font-medium text-lime-300 ring-1 ring-lime-400/25">
                  <span
                    className={cn(
                      "size-1.5 rounded-full bg-lime-400",
                      !reduceMotion && "animate-pulse",
                    )}
                    aria-hidden
                  />
                  LIVE
                </span>
              </div>

              <div className="space-y-4 p-4 sm:p-5">
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {kpi.map((s, i) => (
                    <motion.div
                      key={s.label}
                      className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={show || reduceMotion ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.45 + i * 0.07, duration: 0.35 }}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        {s.label}
                      </p>
                      <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-white sm:text-2xl">
                        {s.value}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium text-lime-400/90">
                        {s.delta}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="text-xs font-semibold text-white">
                      Active pipeline
                    </p>
                    <Package className="size-3.5 text-slate-500" aria-hidden />
                  </div>
                  <ul className="space-y-2">
                    {dispatches.map((row, i) => (
                      <motion.li
                        key={row.code}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
                        initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                        animate={
                          show || reduceMotion ? { opacity: 1, x: 0 } : {}
                        }
                        transition={{ delay: 0.55 + i * 0.08, duration: 0.35 }}
                      >
                        <div className="min-w-0">
                          <p className="font-mono text-[12px] font-medium text-white">
                            {row.code}
                          </p>
                          <p className="truncate text-[11px] text-slate-400">
                            {row.route}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
                            toneClass[row.tone],
                          )}
                        >
                          {row.status}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold text-white">
                    Monthly throughput
                  </p>
                  <div
                    className="flex h-20 items-end gap-2 px-0.5"
                    role="img"
                    aria-label="Bar chart of monthly dispatch throughput rising through October"
                  >
                    {bars.map((h, i) => (
                      <div
                        key={months[i]}
                        className="flex flex-1 flex-col items-center gap-1"
                      >
                        <motion.div
                          className={cn(
                            "w-full rounded-t-md",
                            h === 88
                              ? "bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.45)]"
                              : "bg-slate-600/80",
                          )}
                          style={{ height: `${h}%` }}
                          initial={
                            reduceMotion ? false : { scaleY: 0, originY: 1 }
                          }
                          animate={
                            show || reduceMotion ? { scaleY: 1 } : {}
                          }
                          transition={{
                            delay: 0.7 + i * 0.05,
                            duration: 0.45,
                            ease: "easeOut",
                          }}
                        />
                        <span className="font-mono text-[9px] text-slate-500">
                          {months[i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
