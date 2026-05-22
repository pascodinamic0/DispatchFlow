/**
 * Canonical app URL for auth redirects and invite emails.
 * Prefer NEXT_PUBLIC_SITE_URL; fall back to Vercel hostnames in production.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    const host = production.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }

  return "http://localhost:3000";
}

export function getAuthCallbackUrl(next = "/dashboard"): string {
  const base = getSiteUrl();
  const path = next.startsWith("/") ? next : `/${next}`;
  return `${base}/auth/callback?next=${encodeURIComponent(path)}`;
}

/** Invite emails use hash tokens (#access_token) — must land on a client page, not the server callback route. */
export function getAuthConfirmUrl(next = "/onboarding"): string {
  const base = getSiteUrl();
  const path = next.startsWith("/") ? next : `/${next}`;
  return `${base}/auth/confirm?next=${encodeURIComponent(path)}`;
}

/** Warn when production deploy would send localhost links in emails. */
export function assertSiteUrlConfiguredForInvites(): void {
  const url = getSiteUrl();

  if (process.env.VERCEL && (url.includes("localhost") || url.includes("127.0.0.1"))) {
    throw new Error(
      "Set NEXT_PUBLIC_SITE_URL in Vercel to your production URL (e.g. https://dispatch-flow-pascal-dignys-projects.vercel.app) before sending invites.",
    );
  }
}
