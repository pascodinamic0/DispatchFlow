# Fix DispatchFlow on Vercel

## Production URL (use this everywhere)

**https://dispatch-flow-one.vercel.app**

This is the public production domain assigned in Vercel. Invite links, Supabase auth, and `NEXT_PUBLIC_SITE_URL` must use this host.

| URL | Use? |
|-----|------|
| `https://dispatch-flow-one.vercel.app` | **Yes** — public production |
| `https://dispatch-flow-pascal-dignys-projects.vercel.app` | **No** — team-only (Vercel login wall) |
| `https://dispatch-flow.vercel.app` | **No** — different / unrelated project |

If invitees see **“Log in to Vercel”**, the invite `redirectTo` is probably pointing at `dispatch-flow-pascal-dignys-projects.vercel.app` instead of `dispatch-flow-one.vercel.app`. Fix env + Supabase URLs below, then send a **new** invite.

## Vercel project

https://vercel.com/pascal-dignys-projects/dispatch-flow

### Environment variables (Production)

```
NEXT_PUBLIC_SITE_URL=https://dispatch-flow-one.vercel.app
NEXT_PUBLIC_SUPABASE_URL=<your supabase url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
```

Redeploy after saving.

### Domains

**Settings → Domains** — confirm **Production** is assigned to `dispatch-flow-one.vercel.app`.

### Optional: `dispatch-flow-pascal-dignys-projects.vercel.app`

That hostname is useful for preview/team access but is **not** suitable for customer or teammate invite links unless you disable **Deployment Protection** on it.

## Supabase

See [SUPABASE_AUTH_URLS.md](./SUPABASE_AUTH_URLS.md) — Site URL and redirect URLs must use `https://dispatch-flow-one.vercel.app`.
