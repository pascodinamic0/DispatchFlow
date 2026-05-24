import Link from "next/link";
import { BarChart3, Shield, Smartphone, Zap } from "lucide-react";

const proofPoints = [
  {
    icon: BarChart3,
    metric: "3 modules",
    label: "One system of record",
    detail: "Procurement, dispatch, and inventory — not three tools duct-taped together.",
  },
  {
    icon: Shield,
    metric: "RLS by org",
    label: "Data you can defend",
    detail: "Postgres Row Level Security so each organization only sees its own operations data.",
  },
  {
    icon: Smartphone,
    metric: "Field-ready",
    label: "Status from the road",
    detail: "Touch-friendly updates for dispatchers and requesters — no desktop required.",
  },
  {
    icon: Zap,
    metric: "150ms UX",
    label: "Calm, not cluttered",
    detail: "Status pills, clear tables, and fast transitions — operators actually adopt it.",
  },
] as const;

const scenarios = [
  {
    title: "Multi-branch distributor",
    body: "Central procurement approves spend; branch managers see incoming stock and local inventory without calling HQ.",
  },
  {
    title: "NGO supply chain",
    body: "Field requesters submit needs with priority; dispatchers assign vehicles; leadership tracks in-transit loads across regions.",
  },
  {
    title: "Growing manufacturer",
    body: "Internal transfers between plants replace ad-hoc spreadsheets — with delivery confirmation updating stock automatically.",
  },
] as const;

export function LandingProof() {
  return (
    <section id="proof" className="bg-[var(--brand-navy)] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">
            Proof & fit
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Why operations teams trust one platform
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Belief before signup: clear mechanism, real constraints solved, and security your IT
            team can explain in one sentence.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {proofPoints.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <item.icon className="size-6 text-blue-400" aria-hidden />
              <p className="mt-4 text-2xl font-bold">{item.metric}</p>
              <p className="mt-1 text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-center text-lg font-semibold">Typical deployments</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {scenarios.map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <h4 className="font-semibold">{s.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-slate-400">
          Want the full playbook?{" "}
          <Link href="/blog" className="font-medium text-blue-300 hover:text-white hover:underline">
            Read the DispatchFlow blog
          </Link>{" "}
          — written for ops leaders, not tourists.
        </p>
      </div>
    </section>
  );
}
