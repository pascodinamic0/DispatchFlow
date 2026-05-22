import Link from "next/link";
import { brand } from "@/lib/brand";
import { marketing } from "@/lib/marketing";

export function TermsContent() {
  return (
    <>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of{" "}
        {brand.name} (&quot;Service&quot;, &quot;we&quot;, &quot;us&quot;), an internal
        logistics and procurement platform. By creating an account or using the Service,
        you agree to these Terms on behalf of yourself and the organization you represent.
      </p>

      <h2>1. The Service</h2>
      <p>
        {brand.name} provides tools for procurement requests, dispatch and shipment
        tracking, inventory management, dashboards, notifications, and related operational
        workflows. The Service is intended for business and internal enterprise use, not
        for consumer resale or public marketplace activity.
      </p>

      <h2>2. Accounts and organizations</h2>
      <p>
        You must provide accurate registration information and keep credentials secure.
        Each workspace is associated with an organization. Administrators are responsible
        for inviting users, assigning roles, and ensuring teammates comply with these
        Terms and applicable law.
      </p>
      <ul>
        <li>You may not share accounts or circumvent role-based access controls.</li>
        <li>You must notify us promptly of unauthorized access at{" "}
          <a href={`mailto:${marketing.company.supportEmail}`}>
            {marketing.company.supportEmail}
          </a>
          .
        </li>
        <li>We may suspend accounts that pose a security risk or violate these Terms.</li>
      </ul>

      <h2>3. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for unlawful purposes or in violation of export, sanctions, or anti-corruption laws.</li>
        <li>Probe, scan, or test vulnerabilities without written authorization.</li>
        <li>Upload malware, scrape data at scale, or interfere with Service availability.</li>
        <li>Misrepresent shipment status, inventory, or approvals in a way that defrauds third parties.</li>
        <li>Reverse engineer the Service except where permitted by applicable law.</li>
      </ul>

      <h2>4. Your data</h2>
      <p>
        You retain ownership of operational data you submit (requests, dispatches, inventory
        records, etc.). You grant us a limited license to host, process, and display that
        data solely to provide and improve the Service. Our handling of personal information
        is described in the{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>5. Third-party infrastructure</h2>
      <p>
        The Service may rely on third-party providers (including Supabase for authentication
        and database hosting). Your use of those components may be subject to their terms.
        We are not responsible for outages or changes caused solely by third-party providers,
        though we work to maintain reliable operations.
      </p>

      <h2>6. Availability and changes</h2>
      <p>
        We strive for high availability but do not guarantee uninterrupted access. We may
        modify features, APIs, or these Terms with reasonable notice where practicable.
        Continued use after changes become effective constitutes acceptance of the updated
        Terms.
      </p>

      <h2>7. Fees</h2>
      <p>
        If paid plans are introduced, pricing and billing terms will be presented before
        charges apply. Unless otherwise stated, fees are non-refundable except where required
        by law.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
        OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO
        NOT WARRANT THAT THE SERVICE WILL MEET YOUR REGULATORY OBLIGATIONS; YOU REMAIN
        RESPONSIBLE FOR COMPLIANCE IN YOUR JURISDICTION.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOST PROFITS, DATA, OR
        GOODWILL. OUR AGGREGATE LIABILITY FOR CLAIMS ARISING FROM THE SERVICE SHALL NOT
        EXCEED THE GREATER OF (A) AMOUNTS YOU PAID US IN THE TWELVE MONTHS BEFORE THE CLAIM
        OR (B) ONE HUNDRED U.S. DOLLARS.
      </p>

      <h2>10. Termination</h2>
      <p>
        You may stop using the Service at any time. We may terminate or suspend access for
        material breach, legal requirement, or prolonged inactivity of paid accounts where
        applicable. Upon termination, your right to access ends; export provisions in your
        organization settings or support requests may apply before deletion.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These Terms are governed by the laws applicable to the operator of {brand.name},
        without regard to conflict-of-law principles. Disputes shall be resolved in courts
        of competent jurisdiction unless mandatory local consumer protections apply.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these Terms:{" "}
        <a href={`mailto:${marketing.company.legalEmail}`}>
          {marketing.company.legalEmail}
        </a>
        .
      </p>
    </>
  );
}
