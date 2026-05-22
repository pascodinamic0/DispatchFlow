# Fix DispatchFlow on Vercel (NOT_FOUND / auth wall)

Verified via Vercel API on **2026-05-22**:

| URL | Status |
|-----|--------|
| `https://dispatch-flow-one.vercel.app` | **404 NOT_FOUND** (broken — do not use) |
| `https://dispatch-flow.vercel.app` | Wrong project / not linked |
| `https://dispatch-flow-pascal-dignys-projects.vercel.app` | **App deployed** — blocked by **Deployment Protection** |

Builds are **READY**. The app code is fine. Fix is **Vercel project settings only**.

## Step 1 — Open the correct project

https://vercel.com/pascal-dignys-projects/dispatch-flow

## Step 2 — Turn off Deployment Protection (required)

1. **Settings → Deployment Protection**
2. Under **Production**, set protection to **None** (public site)
3. Save

Without this, visitors see Vercel login / SSO, not DispatchFlow.

## Step 3 — Use the working production URL

**https://dispatch-flow-pascal-dignys-projects.vercel.app**

Click **Deployments → Production (latest Ready) → Visit** and confirm the hostname matches.

## Step 4 — Remove or fix the broken domain (if you added it)

If you use **`dispatch-flow-one.vercel.app`** and see `404 NOT_FOUND`:

1. **Settings → Domains**
2. Remove `dispatch-flow-one.vercel.app`, **or** wait until DNS shows “Valid Configuration”
3. Prefer the default `dispatch-flow-pascal-dignys-projects.vercel.app`

## Step 5 — Environment variables

In **Settings → Environment Variables** (Production):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` = `https://dispatch-flow-pascal-dignys-projects.vercel.app`

Redeploy after changes.

## Step 6 — Supabase auth URLs

**Authentication → URL configuration**:

- Site URL: `https://dispatch-flow-pascal-dignys-projects.vercel.app`
- Redirect: `https://dispatch-flow-pascal-dignys-projects.vercel.app/auth/callback`
