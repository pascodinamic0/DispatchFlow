import { brand } from "@/lib/brand";

const steps = [
  {
    step: "01",
    title: "Request",
    description: "Teams submit procurement needs with priority, destination, and deadlines.",
  },
  {
    step: "02",
    title: "Track",
    description: "Approvers and dispatchers monitor status, assignments, and shipment timelines.",
  },
  {
    step: "03",
    title: "Deliver",
    description: "Close the loop with delivery confirmation and inventory updates.",
  },
] as const;

export function LandingWorkflow() {
  return (
    <section id="workflow" className="border-y border-border bg-card py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {brand.tagline}
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            One platform, three steps
          </h2>
        </div>
        <ol className="relative mt-14 grid gap-8 md:grid-cols-3">
          <div
            className="pointer-events-none absolute top-12 right-[16%] left-[16%] hidden h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 md:block"
            aria-hidden
          />
          {steps.map((item) => (
            <li
              key={item.step}
              className="relative rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-card)] transition-shadow duration-150 hover:shadow-md"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {item.step}
              </span>
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
