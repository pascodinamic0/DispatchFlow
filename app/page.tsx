import type { Metadata } from "next";
import { redirectIfAuthenticated } from "@/lib/auth/redirect-if-authenticated";
import { LandingAppTease } from "@/components/marketing/landing-app-tease";
import { LandingCta } from "@/components/marketing/landing-cta";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingMobileDeck } from "@/components/marketing/landing-mobile-deck";
import { LandingProof } from "@/components/marketing/landing-proof";
import { MarketingShell } from "@/components/marketing/marketing-shell";
import { siteDefaultMetadata } from "@/lib/seo";

export const metadata: Metadata = siteDefaultMetadata;

export default async function HomePage() {
  await redirectIfAuthenticated();

  return (
    <MarketingShell variant="landing">
      {/* Mobile: fixed single-viewport steps (Boutik / iOS) */}
      <LandingMobileDeck />
      {/* Desktop / tablet: classic scroll lander */}
      <div className="hidden md:contents">
        <LandingHero />
        <LandingProof />
        <LandingAppTease />
        <LandingCta />
      </div>
    </MarketingShell>
  );
}
