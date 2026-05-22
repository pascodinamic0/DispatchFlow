import { redirectIfAuthenticated } from "@/lib/auth/redirect-if-authenticated";
import { LandingCta } from "@/components/marketing/landing-cta";
import { LandingFaq } from "@/components/marketing/landing-faq";
import { LandingFeatures } from "@/components/marketing/landing-features";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingProductShowcase } from "@/components/marketing/landing-product-showcase";
import { LandingRoles } from "@/components/marketing/landing-roles";
import { LandingStats } from "@/components/marketing/landing-stats";
import { LandingTrust } from "@/components/marketing/landing-trust";
import { LandingWorkflow } from "@/components/marketing/landing-workflow";
import { MarketingShell } from "@/components/marketing/marketing-shell";

export default async function HomePage() {
  await redirectIfAuthenticated();

  return (
    <MarketingShell variant="landing">
      <LandingHero />
      <LandingStats />
      <LandingProductShowcase />
      <LandingFeatures />
      <LandingWorkflow />
      <LandingRoles />
      <LandingTrust />
      <LandingFaq />
      <LandingCta />
    </MarketingShell>
  );
}
