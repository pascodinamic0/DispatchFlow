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
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const highlights = [
  "Multi-branch procurement workflows",
  "Live dispatch status — not WhatsApp threads",
  "Inventory tied to every delivery confirmation",
] as const;

const kpi = [
  { label: "In transit", short: "Transit", value: "12", delta: "+3 today" },
  { label: "Open requests", short: "Requests", value: "28", delta: "4 urgent" },
  { label: "Low stock", short: "Low stock", value: "6", delta: "SKUs" },
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
      className="relative overflow-x-clip bg-[var(--brand-navy)] text-white"
      aria-labelledby="landing-hero-heading"
    >
      <motion.div
        className="pointer-events-none absolute -right-24 -top-24 size-[min(420px,90vw)] rounded-full bg-lime-400/10 blur-3xl"
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

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div className="space-y-7 sm:space-y-8">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={show || reduceMotion ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-lime-400/25 bg-lime-400/10 px-3.5 py-1.5 text-[13px] font-semibold text-lime-200"
            >
              <span className="relative flex size-2 shrink-0" aria-hidden>
                {!reduceMotion && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime-400 opacity-60" />
                )}
                <span className="relative inline-flex size-2 rounded-full bg-lime-400" />
              </span>
              <span>Live ops preview</span>
              {liveAt ? (
                <span className="font-mono text-[11px] font-medium text-lime-300/80">
                  · {liveAt}
                </span>
              ) : null}
            </motion.div>

            <div className="space-y-4 sm:space-y-5">
              <motion.h1
                id="landing-hero-heading"
                className="text-[2.75rem] font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-[3.35rem]"
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
                className="max-w-lg text-[17px] leading-relaxed text-slate-300 sm:text-lg"
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
              className="space-y-3"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={show || reduceMotion ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.28 }}
            >
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] leading-snug text-slate-300"
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
              <Link href="/signup" className="df-cta-primary">
                Start your workspace
                <ArrowRight className="size-5" aria-hidden />
              </Link>
              <Link href="#product" className="df-cta-secondary">
                See the app shell
              </Link>
            </motion.div>

            <ul className="grid grid-cols-3 gap-2 border-t border-white/10 pt-6 text-[12px] text-slate-400 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 sm:text-sm">
              <li className="flex items-center gap-2">
                <ClipboardList className="size-4 shrink-0 text-lime-400" aria-hidden />
                <span className="leading-tight">Procurement</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="size-4 shrink-0 text-lime-400" aria-hidden />
                <span className="leading-tight">Dispatches</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-lime-400" aria-hidden />
                <span className="leading-tight">Branches</span>
              </li>
            </ul>
          </div>

          <motion.div
            className="relative mx-auto w-full min-w-0 max-w-md lg:max-w-none"
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
              className="absolute -inset-2 rounded-[2rem] bg-lime-400/15 blur-2xl sm:-inset-3 sm:rounded-3xl"
              aria-hidden
            />

            {/* —— Mobile: iPhone-native ops card —— */}
            <div className="relative z-10 overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#0a1220] shadow-2xl shadow-black/50 ring-1 ring-lime-400/20 backdrop-blur-md sm:hidden">
              {/* Status bar + Dynamic Island */}
              <div className="relative grid grid-cols-[1fr_auto_1fr] items-center px-4 pb-1 pt-3">
                <span className="justify-self-start font-mono text-[12px] font-semibold tabular-nums text-white">
                  9:41
                </span>
                <div
                  className="h-[1.55rem] w-[6.5rem] rounded-full bg-black ring-1 ring-white/10"
                  aria-hidden
                />
                <div className="flex items-center justify-end gap-1" aria-hidden>
                  <span className="h-2 w-3.5 rounded-sm bg-white/80" />
                  <span className="h-2.5 w-[18px] rounded-[3px] border border-white/80 p-px">
                    <span className="block h-full w-[70%] rounded-[1px] bg-lime-400" />
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between px-4 pb-3 pt-2">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    {brand.name}
                  </p>
                  <p className="text-sm font-semibold text-white">Ops today</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-400/10 px-2.5 py-1 text-[10px] font-semibold text-lime-300 ring-1 ring-lime-400/25">
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

              <div className="space-y-3 px-3 pb-4">
                {/* Stacked KPI rows — no 3-col crush */}
                <div className="space-y-2">
                  {kpi.map((s, i) => (
                    <motion.div
                      key={s.label}
                      className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3.5 py-3"
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={show || reduceMotion ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.35 }}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium text-slate-400">
                          {s.label}
                        </p>
                        <p className="text-[11px] font-medium text-lime-400/90">
                          {s.delta}
                        </p>
                      </div>
                      <p className="shrink-0 text-2xl font-bold tabular-nums tracking-tight text-white">
                        {s.value}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between px-0.5">
                    <p className="text-xs font-semibold text-white">
                      Active pipeline
                    </p>
                    <Package className="size-3.5 text-slate-500" aria-hidden />
                  </div>
                  <ul className="space-y-2">
                    {dispatches.map((row, i) => (
                      <motion.li
                        key={row.code}
                        className="flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
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

                {/* Compact sparkline — not a full desktop chart */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
                  <p className="mb-2 text-[11px] font-semibold text-slate-300">
                    Throughput · 6 mo
                  </p>
                  <div
                    className="flex h-12 items-end gap-1.5"
                    role="img"
                    aria-label="Monthly dispatch throughput rising through October"
                  >
                    {bars.map((h, i) => (
                      <motion.div
                        key={months[i]}
                        className={cn(
                          "min-w-0 flex-1 rounded-t",
                          h === 88
                            ? "bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.4)]"
                            : "bg-slate-600/70",
                        )}
                        style={{ height: `${h}%` }}
                        initial={
                          reduceMotion ? false : { scaleY: 0, originY: 1 }
                        }
                        animate={
                          show || reduceMotion ? { scaleY: 1 } : {}
                        }
                        transition={{
                          delay: 0.7 + i * 0.04,
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <div className="flex justify-center pb-2 pt-1" aria-hidden>
                <div className="h-1 w-28 rounded-full bg-white/25" />
              </div>
            </div>

            {/* —— Desktop / tablet: ops console —— */}
            <div className="relative z-10 hidden overflow-hidden rounded-2xl border border-white/12 bg-[#0f172a]/90 shadow-2xl shadow-black/40 ring-1 ring-lime-400/20 backdrop-blur-sm sm:block">
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
                      className="min-w-0 rounded-xl border border-white/10 bg-white/[0.04] p-3"
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={show || reduceMotion ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.45 + i * 0.07, duration: 0.35 }}
                    >
                      <p className="truncate font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        {s.short}
                      </p>
                      <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-white sm:text-2xl">
                        {s.value}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-lime-400/90">
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
                        className="flex min-w-0 flex-1 flex-col items-center gap-1"
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
