import {
  BarChart3,
  Bell,
  ClipboardList,
  Package,
  Shield,
  Truck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: ClipboardList,
    title: "Procurement requests",
    description:
      "Submit, approve, and track internal requests with status badges and priority levels.",
  },
  {
    icon: Truck,
    title: "Dispatch & shipments",
    description:
      "Assign drivers, monitor in-transit loads, and follow timelines from origin to delivery.",
  },
  {
    icon: Package,
    title: "Inventory control",
    description:
      "Stock levels, movements, and low-stock alerts tied to your organization.",
  },
  {
    icon: BarChart3,
    title: "Operations dashboard",
    description:
      "KPI cards, status charts, and recent activity — aligned to your design system.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Stay on top of approvals, delays, and deliveries without leaving the platform.",
  },
  {
    icon: Shield,
    title: "Role-based access",
    description:
      "Admin, dispatcher, procurement, and requester roles with Supabase RLS security.",
  },
] as const;

export function LandingFeatures() {
  return (
    <section id="features" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything your ops team needs
          </h2>
          <p className="mt-4 text-muted-foreground">
            Procurement, logistics, and inventory in one coherent system — with
            the calm, structured UI your operators deserve.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="df-card border-border/80 shadow-[var(--shadow-card)] transition-shadow duration-150 hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-5" aria-hidden />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
