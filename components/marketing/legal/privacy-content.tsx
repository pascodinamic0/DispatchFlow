import Link from "next/link";
import { brand } from "@/lib/brand";
import { marketing } from "@/lib/marketing";

export function PrivacyContent() {
  return (
    <>
      <p>
        This Privacy Policy explains how {brand.name} (&quot;we&quot;, &quot;us&quot;)
        collects, uses, and protects information when you use our internal logistics and
        procurement platform (&quot;Service&quot;). It applies to workspace administrators,
        employees, and other users invited to an organization.
      </p>

      <h2>1. Information we collect</h2>
      <h3>Account and profile</h3>
      <p>
        When you register or are invited, we process email address, display name, role,
        organization membership, and authentication identifiers managed through Supabase Auth.
      </p>
      <h3>Operational data</h3>
      <p>
        Data you enter in the course of operations, including procurement requests, dispatch
        records, inventory movements, branch assignments, comments, and status updates.
      </p>
      <h3>Technical data</h3>
      <p>
        We may collect logs, device/browser type, IP address, and timestamps for security,
        debugging, and abuse prevention. Session cookies are used to keep you signed in.
      </p>

      <h2>2. How we use information</h2>
      <ul>
        <li>Provide, secure, and maintain the Service</li>
        <li>Enforce organization-scoped access via database Row Level Security</li>
        <li>Send in-app and email notifications you configure or that are operationally necessary</li>
        <li>Improve reliability, fix defects, and develop features</li>
        <li>Comply with legal obligations and respond to lawful requests</li>
      </ul>

      <h2>3. Legal bases (where applicable)</h2>
      <p>
        For users in jurisdictions requiring a legal basis (such as the EU/UK), we rely on
        contract performance (providing the Service), legitimate interests (security and
        product improvement), and consent where required (e.g., optional marketing emails).
      </p>

      <h2>4. Sharing and processors</h2>
      <p>
        We do not sell personal information. We share data with service providers who process
        it on our behalf under contractual safeguards, including:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — authentication, Postgres database, and related infrastructure
        </li>
        <li>
          <strong>Hosting providers</strong> — application delivery (e.g., Vercel or equivalent)
        </li>
        <li>
          <strong>Email providers</strong> — transactional messages when enabled
        </li>
      </ul>
      <p>
        Your organization&apos;s administrators control which users can see operational data
        within the workspace.
      </p>

      <h2>5. International transfers</h2>
      <p>
        Data may be processed in regions where our infrastructure providers operate. Where
        required, we implement appropriate safeguards (such as standard contractual clauses)
        for cross-border transfers.
      </p>

      <h2>6. Retention</h2>
      <p>
        We retain information while your organization maintains an active workspace and as
        needed for legal, audit, or security purposes. Administrators may request deletion
        of user accounts; residual backups may persist for a limited period.
      </p>

      <h2>7. Security</h2>
      <p>
        We use industry-standard measures including TLS in transit, access controls, and
        organization-scoped Row Level Security. No method of transmission or storage is
        100% secure; report concerns to{" "}
        <a href={`mailto:${marketing.company.supportEmail}`}>
          {marketing.company.supportEmail}
        </a>
        .
      </p>

      <h2>8. Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, delete, restrict,
        or port personal data, and to object to certain processing. Contact us to exercise
        these rights. You may also lodge a complaint with your local data protection authority.
      </p>

      <h2>9. Children</h2>
      <p>
        The Service is not directed to individuals under 16. We do not knowingly collect data
        from children.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update this Policy and will revise the &quot;Last updated&quot; date. Material
        changes will be communicated through the Service or email where appropriate.
      </p>

      <h2>11. Contact</h2>
      <p>
        Privacy inquiries:{" "}
        <a href={`mailto:${marketing.company.legalEmail}`}>
          {marketing.company.legalEmail}
        </a>
        . See also our <Link href="/terms">Terms of Service</Link>.
      </p>
    </>
  );
}
