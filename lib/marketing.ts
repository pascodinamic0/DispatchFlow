import { brand } from "@/lib/brand";

export const marketing = {
  company: {
    name: brand.name,
    tagline: brand.tagline,
    supportEmail: "support@dispatchflow.app",
    legalEmail: "legal@dispatchflow.app",
    address: "Enterprise operations platform",
  },
  legal: {
    termsLastUpdated: "May 22, 2025",
    privacyLastUpdated: "May 22, 2025",
  },
  nav: [
    { label: "Features", href: "/#features" },
    { label: "How it works", href: "/#workflow" },
    { label: "Who it's for", href: "/#audience" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/#faq" },
  ] as const,
  footer: {
    product: [
      { label: "Features", href: "/#features" },
      { label: "Workflow", href: "/#workflow" },
      { label: "Sign up", href: "/signup" },
      { label: "Sign in", href: "/login" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  stats: [
    { value: "3", label: "Core modules", suffix: "" },
    { value: "5", label: "Role types", suffix: "" },
    { value: "24/7", label: "Ops visibility", suffix: "" },
    { value: "100%", label: "RLS-secured data", suffix: "" },
  ] as const,
} as const;
