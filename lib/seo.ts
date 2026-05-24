import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

export function getMetadataBase(): URL {
  return new URL(getSiteUrl());
}

const defaultDescription =
  "DispatchFlow unifies procurement requests, shipment tracking, and inventory for enterprise operations teams — especially multi-branch logistics across Africa.";

export function buildPageMetadata({
  title,
  description = defaultDescription,
  path = "",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const base = getMetadataBase();
  const url = path ? new URL(path, base).toString() : base.toString();
  const fullTitle = title ? `${title} | ${brand.name}` : brand.name;

  return {
    title: title ?? brand.name,
    description,
    metadataBase: base,
    alternates: { canonical: path || "/" },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: brand.name,
      title: fullTitle,
      description,
      images: [
        {
          url: "/marketing-hero-dashboard.png",
          width: 800,
          height: 500,
          alt: brand.marketing.heroDashboard.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/marketing-hero-dashboard.png"],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export const siteDefaultMetadata: Metadata = buildPageMetadata({
  description: `${brand.tagline} — ${defaultDescription}`,
});
