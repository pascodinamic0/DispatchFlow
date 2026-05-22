import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { brand } from "@/lib/brand";
import { marketing } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the DispatchFlow team.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h1 className="df-page-title text-4xl tracking-tight sm:text-5xl">
            Contact us
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Questions about onboarding, security reviews, or enterprise deployment —
            we&apos;re here to help.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="df-card">
            <CardHeader>
              <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="size-5" aria-hidden />
              </div>
              <CardTitle>General & support</CardTitle>
              <CardDescription>
                Account help, onboarding, and product questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={`mailto:${marketing.company.supportEmail}`}
                className="text-lg font-medium text-primary hover:underline"
              >
                {marketing.company.supportEmail}
              </a>
            </CardContent>
          </Card>

          <Card className="df-card">
            <CardHeader>
              <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageSquare className="size-5" aria-hidden />
              </div>
              <CardTitle>Legal & privacy</CardTitle>
              <CardDescription>
                Terms, data processing, and compliance inquiries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={`mailto:${marketing.company.legalEmail}`}
                className="text-lg font-medium text-primary hover:underline"
              >
                {marketing.company.legalEmail}
              </a>
              <p className="mt-4 text-sm text-muted-foreground">
                See our{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Ready to try {brand.name}?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create your workspace
          </Link>
        </p>
      </section>
    </>
  );
}
