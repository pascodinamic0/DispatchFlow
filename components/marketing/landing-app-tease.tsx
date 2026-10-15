"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ClipboardCheck, Truck } from "lucide-react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const screens = [
  {
    id: "requests",
    label: "Requests table",
    icon: ClipboardCheck,
    title: "Procurement that survives the week",
    description:
      "Priority, destination, and status in one calm table — from draft through delivered.",
    image: brand.marketing.showcaseRequests,
  },
  {
    id: "dispatch",
    label: "Dispatch timeline",
    icon: Truck,
    title: "Shipments you can actually track",
    description:
      "Assign drivers, watch in-transit loads, and close deliveries without chasing chats.",
    image: brand.marketing.showcaseDispatch,
  },
] as const;

export function LandingAppTease() {
  const [active, setActive] = useState<(typeof screens)[number]["id"]>(
    "requests",
  );
  const current = screens.find((s) => s.id === active) ?? screens[0];
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const show = reduceMotion || inView;

  return (
    <section
      id="product"
      ref={ref}
      className="relative overflow-hidden border-y border-border bg-background py-20 sm:py-28"
      aria-labelledby="landing-tease-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            App shell
          </p>
          <h2
            id="landing-tease-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Two screens. Zero spreadsheet archaeology.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A taste of the operator UI — navy chrome, lime status energy, and
            tables built for real volume.
          </p>
        </div>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="App preview screens"
        >
          {screens.map((screen) => {
            const selected = screen.id === active;
            return (
              <button
                key={screen.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`tease-panel-${screen.id}`}
                id={`tease-tab-${screen.id}`}
                onClick={() => setActive(screen.id)}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "bg-[var(--brand-navy)] text-lime-300 shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                )}
              >
                <screen.icon className="size-4" aria-hidden />
                {screen.label}
              </button>
            );
          })}
        </div>

        <motion.div
          key={current.id}
          id={`tease-panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`tease-tab-${current.id}`}
          className="mt-10 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35 }}
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
              {current.title}
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              {current.description}
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span
                  className="size-1.5 rounded-full bg-lime-500"
                  aria-hidden
                />
                Keyboard-friendly focus and clear status contrast
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="size-1.5 rounded-full bg-lime-500"
                  aria-hidden
                />
                Mobile-first density for field updates
              </li>
            </ul>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-3 rounded-3xl bg-lime-400/10 blur-2xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] ring-1 ring-black/5">
              <div className="flex items-center gap-2 border-b border-border bg-[var(--brand-navy)] px-4 py-2.5">
                <span className="size-2 rounded-full bg-red-400/90" aria-hidden />
                <span className="size-2 rounded-full bg-amber-400/90" aria-hidden />
                <span className="size-2 rounded-full bg-lime-400/90" aria-hidden />
                <span className="ml-2 font-mono text-[11px] text-slate-400">
                  {brand.name} / {current.label}
                </span>
              </div>
              <Image
                src={current.image.src}
                alt={current.image.alt}
                width={current.image.width}
                height={current.image.height}
                className="h-auto w-full object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
