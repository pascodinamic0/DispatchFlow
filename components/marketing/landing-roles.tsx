import {
  Building2,
  PackageSearch,
  ShieldCheck,
  Truck,
  UserCircle,
  Users,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const roles = [
  {
    icon: ShieldCheck,
    title: "Administrator",
    description:
      "Organization setup, user management, branches, and policy configuration.",
  },
  {
    icon: PackageSearch,
    title: "Procurement",
    description:
      "Review requests, approve spend, and coordinate with suppliers and finance.",
  },
  {
    icon: Truck,
    title: "Dispatcher",
    description:
      "Assign vehicles, update shipment status, and resolve in-transit exceptions.",
  },
  {
    icon: UserCircle,
    title: "Requester",
    description:
      "Submit needs from the field with clear priority, quantity, and delivery context.",
  },
  {
    icon: Building2,
    title: "Branch manager",
    description:
      "Visibility across local stock, incoming dispatches, and branch-level KPIs.",
  },
  {
    icon: Users,
    title: "Operations lead",
    description:
      "Cross-team dashboards, SLA awareness, and end-to-end workflow oversight.",
  },
] as const;

export function LandingRoles() {
  return (
    <section id="roles" className="border-y border-border bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Built for your team
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Every role, one source of truth
          </h2>
          <p className="mt-4 text-muted-foreground">
            Role-based access with Supabase Row Level Security — each person sees
            exactly what they need, nothing more.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card
              key={role.title}
              className="df-card border-border/80 bg-card transition-shadow duration-150 hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <role.icon className="size-5" aria-hidden />
                </div>
                <CardTitle className="text-base">{role.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {role.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
