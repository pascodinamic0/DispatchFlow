/**
 * DispatchFlow brand & design system tokens.
 * Enterprise operations UI — premium, minimal, globally competitive.
 */

export const brand = {
  name: "DispatchFlow",
  tagline: "Request. Track. Deliver.",
  logo: {
    src: "/dispatchflow-logo.svg",
    alt: "DispatchFlow — Request. Track. Deliver.",
    width: 280,
    height: 56,
  },
  marketing: {
    heroDashboard: {
      src: "/marketing-hero-dashboard.png",
      alt: "DispatchFlow operations dashboard with KPIs and shipment overview",
      width: 800,
      height: 500,
    },
    showcaseRequests: {
      src: "/marketing-showcase-requests.png",
      alt: "DispatchFlow procurement requests table with status badges",
      width: 720,
      height: 480,
    },
    showcaseDispatch: {
      src: "/marketing-showcase-dispatch.png",
      alt: "DispatchFlow shipment tracking timeline and delivery progress",
      width: 720,
      height: 480,
    },
    authPreview: {
      src: "/marketing-auth-preview.png",
      alt: "DispatchFlow mobile-friendly operations summary",
      width: 640,
      height: 400,
    },
    aboutAnalytics: {
      src: "/marketing-about-analytics.png",
      alt: "DispatchFlow reports and analytics dashboard",
      width: 640,
      height: 400,
    },
  },
  colors: {
    primary: "#2563EB",
    navy: "#0B1220",
    background: "#F8FAFC",
    card: "#FFFFFF",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
    muted: "#64748B",
    border: "#E2E8F0",
    foreground: "#0F172A",
  },
} as const;

export type BrandColors = typeof brand.colors;
