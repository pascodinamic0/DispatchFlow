# DispatchFlow

**Request. Track. Deliver.** — Internal logistics and procurement operations platform for organizations operating across multiple cities, branches, and provinces.

DispatchFlow replaces fragmented WhatsApp coordination, manual follow-ups, and poor shipment visibility with a structured operational workflow designed for emerging markets and distributed teams.

## Core features

- Multi-branch request management
- Procurement tracking
- Inter-city shipment tracking
- Real-time operational timeline
- Role-based access control
- Delivery confirmation workflows
- Activity and audit logs
- Mobile-first responsive dashboard
- In-app, email, and push notifications
- Team invites and SSO (Google)

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Supabase (Auth + PostgreSQL)
- Zustand, TanStack Query, React Hook Form, Zod

## Getting started

```bash
npm install
cp .env.local.example .env.local
# Add your Supabase URL and anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy **Project URL** and **anon key** into `.env.local`.
3. Run migrations in the SQL editor (in order):
   - `supabase/migrations/20250522000000_initial_schema.sql`
   - `supabase/migrations/20250522000001_seed_default_org.sql` (optional — onboarding can create the org)
   - `supabase/migrations/20250522000002_onboarding_org_insert.sql`
   - `supabase/migrations/20250522000003_inventory.sql`
   - `supabase/migrations/20250522000004_settings_policies.sql`
   - `supabase/migrations/20250522000005_extended_features.sql`
   - `supabase/migrations/20250522000006_invite_select_policy.sql`
   - `supabase/migrations/20250522000007_notifications_realtime.sql`
   - `supabase/migrations/20250522000008_fix_profiles_rls_recursion.sql`
   - `supabase/migrations/20250522000009_fix_onboarding_rls.sql`
4. Verify: `node scripts/verify-supabase.mjs`
5. Enable Email auth in Authentication → Providers.
6. Set **Site URL** to `http://localhost:3000` and add redirect URL `http://localhost:3000/auth/callback`.
7. Optional: enable **Google** under Authentication → Providers for SSO.
8. Optional: add `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, and VAPID keys to `.env.local` for invites, email, and push (see `.env.local.example`).

## Project structure

```
app/              # Routes (auth + dashboard route groups)
components/       # Shared UI and layout
features/         # Feature modules (auth, requests, …)
hooks/            # Shared React hooks
lib/              # Utilities, Supabase clients, navigation
services/         # API / data access layer
store/            # Zustand stores
types/            # TypeScript types (incl. Database)
supabase/         # SQL migrations
```

## Scripts

| Command         | Description            |
|-----------------|------------------------|
| `npm run dev`   | Dev server (Turbopack) |
| `npm run build` | Production build       |
| `npm run lint`  | ESLint                 |

## Deploy on Vercel

Project: **`pascal-dignys-projects/dispatch-flow`** (GitHub: `pascodinamic0/DispatchFlow`).

**Production URL (use this exact host):**

`https://dispatch-flow-one.vercel.app`

Do **not** use `https://dispatch-flow-pascal-dignys-projects.vercel.app` for invites or Supabase redirects — it shows a **Vercel login** wall to the public.

**Auth / invites:** [docs/SUPABASE_AUTH_URLS.md](docs/SUPABASE_AUTH_URLS.md) · **Vercel:** [docs/VERCEL_LIVE_FIX.md](docs/VERCEL_LIVE_FIX.md)

### Setup checklist

1. Import the repo — **Root Directory** must be empty (repo root).
2. Add env vars from `.env.local.example` (at minimum the two `NEXT_PUBLIC_SUPABASE_*` keys).
3. Set `NEXT_PUBLIC_SITE_URL` to `https://dispatch-flow-one.vercel.app`.
4. In Supabase **Authentication → URL configuration**, set Site URL and redirect URLs to that host (`/auth/callback`, `/auth/confirm`).

### `404: NOT_FOUND`

[Vercel platform error](https://vercel.com/docs/errors/not-found) — wrong hostname or no deployment on that domain.

- Open **Deployments → latest Ready → Visit** and compare the URL in your browser.
- If it differs from the production URL above, update bookmarks and `NEXT_PUBLIC_SITE_URL`.

### Site shows “Authentication Required” / Vercel login wall

**Settings → Deployment Protection** may be blocking public access. For a public app:

- Set **Production** protection to **None** (or “Only Preview Deployments”), then redeploy.
- Or sign in with the Vercel account that owns the project when visiting the URL.

## Vision

DispatchFlow is operational infrastructure for accountability, procurement visibility, logistics coordination, and multi-branch efficiency across Africa and emerging markets.
