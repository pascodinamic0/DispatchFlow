import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Who is DispatchFlow built for?",
    answer:
      "DispatchFlow is an internal logistics and procurement platform for enterprise operations teams — especially organizations managing multi-branch supply chains across African markets. It is not a consumer marketplace; it is your team's operational system of record.",
  },
  {
    question: "What modules are included?",
    answer:
      "Procurement requests (submit, approve, track), dispatch and shipment management (assign, monitor, deliver), and inventory control (stock levels, movements, alerts). A unified dashboard ties KPIs and recent activity together.",
  },
  {
    question: "How does security and access control work?",
    answer:
      "Authentication is powered by Supabase Auth. Data access uses Postgres Row Level Security (RLS) scoped to your organization. Roles such as admin, dispatcher, procurement, and requester determine what each user can view and change.",
  },
  {
    question: "Can we use it on mobile?",
    answer:
      "Yes. The interface is responsive with touch-friendly lists on smaller screens, bottom navigation in the app shell, and 44px+ tap targets — so field teams can update status without a desktop.",
  },
  {
    question: "How do we get started?",
    answer:
      "Create an account, complete onboarding for your organization, invite teammates, and configure branches. Connect your Supabase project via environment variables for production deployments.",
  },
  {
    question: "Where is our data stored?",
    answer:
      "Application data lives in your Supabase Postgres database. You control the project, region, backups, and compliance posture. See our Privacy Policy for details on processing and your rights.",
  },
] as const;

export function LandingFaq() {
  return (
    <section id="faq" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Questions operations teams ask
          </h2>
          <p className="mt-4 text-muted-foreground">
            Straight answers — no sales theater. Need more detail?{" "}
            <a href="/contact" className="font-medium text-primary hover:underline">
              Contact us
            </a>
            .
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group df-card overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            >
              <summary
                className={cn(
                  "flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-medium text-foreground",
                  "hover:bg-muted/50",
                )}
              >
                {faq.question}
                <ChevronDown
                  className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="border-t border-border px-5 pb-5 pt-2 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
