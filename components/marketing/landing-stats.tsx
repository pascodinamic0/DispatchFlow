import { marketing } from "@/lib/marketing";

export function LandingStats() {
  return (
    <section className="border-b border-border bg-card py-10 sm:py-12" aria-label="Platform highlights">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ul className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {marketing.stats.map((stat) => (
            <li key={stat.label} className="text-center md:text-left">
              <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                {stat.value}
                {stat.suffix}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
