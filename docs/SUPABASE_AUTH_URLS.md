# Supabase auth URLs for DispatchFlow

Production host: **https://dispatch-flow-one.vercel.app**

Do **not** use `https://dispatch-flow-pascal-dignys-projects.vercel.app` in invite or auth settings — that URL shows a **Vercel team login** screen to the public.

## 1. Vercel (Production environment variables)

```
NEXT_PUBLIC_SITE_URL=https://dispatch-flow-one.vercel.app
```

Redeploy after saving. New invites use this in `redirectTo` (`/auth/confirm?next=/onboarding`).

## 2. Supabase → Authentication → URL configuration

**Site URL:**

```
https://dispatch-flow-one.vercel.app
```

**Redirect URLs** (add each line):

```
https://dispatch-flow-one.vercel.app/**
https://dispatch-flow-one.vercel.app/auth/callback
https://dispatch-flow-one.vercel.app/auth/confirm
http://localhost:3000/**
http://localhost:3000/auth/callback
http://localhost:3000/auth/confirm
```

If invite links still open **localhost** with `#access_token=...`, Site URL is still `http://localhost:3000` — change it, save, send a **new** invite.

## 3. Re-send invites

Old emails embed the old `redirect_to`. After updating URLs:

1. **Settings → Team** → revoke old invite (optional)
2. Send a **new** invite from the **live** app at https://dispatch-flow-one.vercel.app

## 4. Fallback for invited users

```
https://dispatch-flow-one.vercel.app/signup?email=their@email.com
```

Same invited email, set password, complete onboarding.

## Invite flow (expected)

1. Teammate clicks Supabase invite email
2. Lands on `https://dispatch-flow-one.vercel.app/auth/confirm#access_token=...`
3. App sets session → **onboarding** (password + profile)
4. **Login** works afterward with that email + password
