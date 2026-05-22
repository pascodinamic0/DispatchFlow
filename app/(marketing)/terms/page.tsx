import type { Metadata } from "next";
import { LegalDocument } from "@/components/marketing/legal-document";
import { TermsContent } from "@/components/marketing/legal/terms-content";
import { marketing } from "@/lib/marketing";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the DispatchFlow platform.",
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      lastUpdated={marketing.legal.termsLastUpdated}
    >
      <TermsContent />
    </LegalDocument>
  );
}
