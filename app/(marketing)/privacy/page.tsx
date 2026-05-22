import type { Metadata } from "next";
import { LegalDocument } from "@/components/marketing/legal-document";
import { PrivacyContent } from "@/components/marketing/legal/privacy-content";
import { marketing } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How DispatchFlow collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      lastUpdated={marketing.legal.privacyLastUpdated}
    >
      <PrivacyContent />
    </LegalDocument>
  );
}
