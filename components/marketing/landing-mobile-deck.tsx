"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  ClipboardCheck,
  Shield,
  Smartphone,
  Truck,
  Zap,
} from "lucide-react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const STEPS = ["hero", "proof", "tease", "cta"] as const;

const proofPoints = [
  { icon: BarChart3, metric: "3 modules", label: "One system of record" },
  { icon: Shield, metric: "RLS by org", label: "Data you can defend" },
  { icon: Smartphone, metric: "Field-ready", label: "Status from the road" },
  { icon: Zap, metric: "Calm UX", label: "Operators adopt it" },
] as const;

const teaseScreens = [
  {
    id: "requests" as const,
    label: "Requests",
    icon: ClipboardCheck,
    title: "Procurement that survives the week",
    image: brand.marketing.showcaseRequests,
  },
  {
    id: "dispatch" as const,
    label: "Dispatch",
    icon: Truck,
    title: "Shipments you can actually track",
    image: brand.marketing.showcaseDispatch,
  },
];

const kpi = [
  { label: "Transit", value: "12" },
  { label: "Requests", value: "28" },
  { label: "Low stock", value: "6" },
] as const;

/**
 * Boutik / iOS lander: ONE fixed viewport per step, no body scroll.
 * Desktop keeps the classic scrolling sections (md:hidden here).
 */
export function LandingMobileDeck() {
  const [index, setIndex] = useState(0);
  const [teaseId, setTeaseId] = useState<"requests" | "dispatch">("requests");
  const touchRef = useRef<{ y: number; x: number; active: boolean }>({
    y: 0,
    x: 0,
    active: false,
  });
  const indexRef = useRef(index);
  indexRef.current = index;

  const go = useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(STEPS.length - 1, next)));
  }, []);

  const goNext = useCallback(() => go(indexRef.current + 1), [go]);
  const goPrev = useCallback(() => go(indexRef.current - 1), [go]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("df-mobile-deck");
    document.body.classList.add("df-mobile-deck");
    return () => {
      root.classList.remove("df-mobile-deck");
      document.body.classList.remove("df-mobile-deck");
    };
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    touchRef.current = { y: e.clientY, x: e.clientX, active: true };
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!touchRef.current.active) return;
    touchRef.current.active = false;
    const dy = e.clientY - touchRef.current.y;
    const dx = e.clientX - touchRef.current.x;
    if (Math.abs(dy) < 48 || Math.abs(dy) < Math.abs(dx) * 1.2) return;
    if (dy < 0) goNext();
    else goPrev();
  };

  const onPointerCancel = () => {
    touchRef.current.active = false;
  };

  const tease = teaseScreens.find((s) => s.id === teaseId) ?? teaseScreens[0];
  const step = STEPS[index];

  return (
    <div
      className="relative flex h-full min-h-0 flex-col md:hidden"
      data-landing-mobile-deck=""
      data-step={step}
      data-step-index={index}
    >
      <div
        className="relative min-h-0 flex-1 touch-pan-x overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        role="region"
        aria-roledescription="carousel"
        aria-label="DispatchFlow product tour"
      >
        {/* —— Hero —— */}
        <section
          className={cn(
            "absolute inset-0 flex flex-col justify-between bg-[var(--brand-navy)] px-4 pb-2 pt-3 text-white transition-transform duration-300 ease-out",
            index === 0
              ? "translate-y-0"
              : index > 0
                ? "-translate-y-full"
                : "translate-y-full",
          )}
          aria-labelledby="mobile-hero-heading"
          aria-hidden={index !== 0}
        >
          <div className="min-h-0 space-y-3.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/25 bg-lime-400/10 px-3 py-1 text-[12px] font-semibold text-lime-200">
              <span className="size-1.5 rounded-full bg-lime-400" aria-hidden />
              Live ops preview
            </div>
            <h1
              id="mobile-hero-heading"
              className="text-[2.25rem] font-bold leading-[1.02] tracking-tight"
            >
              <span className="block">Request.</span>
              <span className="block">Track.</span>
              <span className="block bg-gradient-to-r from-lime-300 via-lime-400 to-emerald-400 bg-clip-text text-transparent">
                Deliver.
              </span>
            </h1>
            <p className="max-w-sm text-[15px] leading-snug text-slate-300">
              One system of record for multi-branch procurement, dispatch, and
              inventory — not WhatsApp threads and spreadsheets.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {kpi.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] px-2.5 py-2.5"
                >
                  <p className="text-[11px] font-medium text-slate-400">
                    {s.label}
                  </p>
                  <p className="text-xl font-bold tabular-nums text-white">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0 space-y-3 pt-3">
            <Link href="/signup" className="df-cta-primary">
              Start your workspace
              <ArrowRight className="size-5" aria-hidden />
            </Link>
            <button type="button" onClick={goNext} className="df-cta-secondary">
              See why teams switch
              <ChevronDown className="size-5" aria-hidden />
            </button>
          </div>
        </section>

        {/* —— Proof —— */}
        <section
          className={cn(
            "absolute inset-0 flex flex-col justify-between bg-[var(--brand-navy)] px-4 pb-2 pt-3 text-white transition-transform duration-300 ease-out",
            index === 1
              ? "translate-y-0"
              : index > 1
                ? "-translate-y-full"
                : "translate-y-full",
          )}
          aria-labelledby="mobile-proof-heading"
          aria-hidden={index !== 1}
        >
          <div className="min-h-0 space-y-3.5">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-lime-400/90">
              Proof & fit
            </p>
            <h2
              id="mobile-proof-heading"
              className="text-[1.6rem] font-bold leading-tight tracking-tight"
            >
              Why ops teams trust one platform
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {proofPoints.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5"
                >
                  <item.icon className="size-5 text-lime-400" aria-hidden />
                  <p className="mt-3 font-mono text-lg font-bold tabular-nums">
                    {item.metric}
                  </p>
                  <p className="mt-0.5 text-[13px] font-semibold leading-snug text-slate-200">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0 pt-3">
            <button type="button" onClick={goNext} className="df-cta-primary">
              See the app shell
              <ChevronDown className="size-5" aria-hidden />
            </button>
          </div>
        </section>

        {/* —— Tease —— */}
        <section
          className={cn(
            "absolute inset-0 flex flex-col justify-between bg-background px-4 pb-2 pt-3 transition-transform duration-300 ease-out",
            index === 2
              ? "translate-y-0"
              : index > 2
                ? "-translate-y-full"
                : "translate-y-full",
          )}
          aria-labelledby="mobile-tease-heading"
          aria-hidden={index !== 2}
        >
          <div className="min-h-0 space-y-3">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-primary">
              App shell
            </p>
            <h2
              id="mobile-tease-heading"
              className="text-[1.5rem] font-bold leading-tight tracking-tight text-foreground"
            >
              Two screens. Zero spreadsheet archaeology.
            </h2>
            <div
              className="flex gap-2"
              role="tablist"
              aria-label="App preview screens"
            >
              {teaseScreens.map((screen) => {
                const selected = screen.id === teaseId;
                return (
                  <button
                    key={screen.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setTeaseId(screen.id)}
                    className={cn(
                      "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors",
                      selected
                        ? "bg-[var(--brand-navy)] text-lime-300"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <screen.icon className="size-4" aria-hidden />
                    {screen.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[14px] font-medium text-foreground">
              {tease.title}
            </p>
            <div className="overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-[var(--shadow-card)] ring-1 ring-black/5">
              <div className="flex items-center justify-between border-b border-border bg-[var(--brand-navy)] px-3 py-2.5">
                <p className="text-[13px] font-semibold text-white">
                  {tease.label}
                </p>
                <span className="rounded-full bg-lime-400/15 px-2 py-0.5 text-[11px] font-semibold text-lime-300 ring-1 ring-lime-400/25">
                  Live
                </span>
              </div>
              <Image
                src={tease.image.src}
                alt={tease.image.alt}
                width={tease.image.width}
                height={tease.image.height}
                className="h-[min(26vh,168px)] w-full object-cover object-left-top"
                sizes="390px"
                priority={index === 2}
              />
            </div>
          </div>
          <div className="shrink-0 pt-3">
            <button type="button" onClick={goNext} className="df-cta-primary">
              Ready to run ops?
              <ChevronDown className="size-5" aria-hidden />
            </button>
          </div>
        </section>

        {/* —— CTA —— */}
        <section
          className={cn(
            "absolute inset-0 flex flex-col justify-between bg-[var(--brand-navy)] px-4 pb-2 pt-3 text-white transition-transform duration-300 ease-out",
            index === 3 ? "translate-y-0" : "translate-y-full",
          )}
          aria-labelledby="mobile-cta-heading"
          aria-hidden={index !== 3}
        >
          <div className="min-h-0 space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-lime-400">
              {brand.tagline}
            </p>
            <h2
              id="mobile-cta-heading"
              className="text-[1.7rem] font-bold leading-tight tracking-tight"
            >
              Ready to run your operations?
            </h2>
            <p className="text-[15px] leading-snug text-slate-300">
              Create your workspace, invite your team, and replace scattered
              spreadsheets with one platform.
            </p>
          </div>
          <div className="shrink-0 space-y-3 pt-3">
            <Link href="/signup" className="df-cta-primary">
              Create free workspace
              <ArrowRight className="size-5" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 w-full items-center justify-center text-[15px] font-semibold text-slate-300"
            >
              Talk to us
            </Link>
            <p className="text-center text-[12px] leading-relaxed text-slate-500">
              By signing up you agree to our{" "}
              <Link href="/terms" className="text-slate-400 underline-offset-2">
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-slate-400 underline-offset-2"
              >
                Privacy
              </Link>
              .
            </p>
          </div>
        </section>
      </div>

      <div
        className={cn(
          "flex shrink-0 items-center justify-center gap-2 pb-safe pt-2",
          step === "tease" ? "bg-background" : "bg-[var(--brand-navy)]",
        )}
        role="tablist"
        aria-label="Tour steps"
      >
        {STEPS.map((id, i) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to ${id}`}
            onClick={() => go(i)}
            className={cn(
              "h-2.5 min-h-[10px] rounded-full transition-all",
              i === index
                ? "w-6 bg-lime-400"
                : step === "tease"
                  ? "w-2.5 bg-slate-300"
                  : "w-2.5 bg-white/25",
            )}
          />
        ))}
      </div>
    </div>
  );
}
