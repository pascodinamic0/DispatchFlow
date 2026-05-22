import Image from "next/image";
import {
  BarChart3,
  ClipboardCheck,
  Package,
  Truck,
} from "lucide-react";
import { brand } from "@/lib/brand";

const pillars = [
  {
    icon: ClipboardCheck,
    title: "Requests & approvals",
    description:
      "Priority levels, destinations, and status pills — from draft through delivered.",
  },
  {
    icon: Truck,
    title: "Dispatch control",
    description:
      "Assign drivers, monitor in-transit loads, and close deliveries with confidence.",
  },
  {
    icon: Package,
    title: "Inventory sync",
    description:
      "Stock movements and low-stock signals connected to your operational reality.",
  },
  {
    icon: BarChart3,
    title: "Executive visibility",
    description:
      "KPI cards and activity feeds your leadership actually uses every morning.",
  },
] as const;

export function LandingProductShowcase() {
  return (
    <section id="product" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Platform preview
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Designed for operators, not tourists
          </h2>
          <p className="mt-4 text-muted-foreground">
            Navy sidebar, blue accents, soft status badges, and spacious tables —
            the same system your team uses inside the app.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="df-card overflow-hidden p-1">
              <Image
                src={brand.marketing.showcaseRequests.src}
                alt={brand.marketing.showcaseRequests.alt}
                width={brand.marketing.showcaseRequests.width}
                height={brand.marketing.showcaseRequests.height}
                className="rounded-[calc(var(--radius-xl)-4px)] object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden w-[42%] overflow-hidden rounded-xl border border-border bg-card shadow-xl sm:block">
              <Image
                src={brand.marketing.showcaseDispatch.src}
                alt={brand.marketing.showcaseDispatch.alt}
                width={320}
                height={200}
                className="h-auto w-full object-cover object-top"
              />
            </div>
            <div className="absolute -left-4 top-8 hidden rounded-xl border border-border bg-card px-4 py-3 shadow-lg sm:block">
              <p className="text-xs font-medium text-muted-foreground">Live status</p>
              <p className="text-sm font-semibold text-success">12 dispatches in transit</p>
            </div>
          </div>

          <ul className="order-1 space-y-6 lg:order-2">
            {pillars.map((item, index) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] transition-shadow duration-150 hover:shadow-md"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="size-5" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-0.5 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
