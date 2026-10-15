import type { Metadata } from "next";
import { redirectIfAuthenticated } from "@/lib/auth/redirect-if-authenticated";
import { LandingAppTease } from "@/components/marketing/landing-app-tease";
import { LandingCta } from "@/components/marketing/landing-cta";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingProof } from "@/components/marketing/landing-proof";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { siteDefaultMetadata } from "@/lib/seo";

export const metadata: Metadata = siteDefaultMetadata;

export default async function HomePage() {
  await redirectIfAuthenticated();

  return (
    <MarketingShell variant="landing">
      <LandingHero />
      <LandingProof />
      <LandingAppTease />
      <LandingCta />
    </MarketingShell>
  );
}
