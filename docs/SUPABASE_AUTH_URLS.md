# Supabase auth URLs for DispatchFlow

Invite links use `redirectTo` from your app URL. If Supabase still sends users to **localhost**, fix **both** Vercel env and Supabase dashboard.

## 1. Vercel (Production environment variables)

```
NEXT_PUBLIC_SITE_URL=https://dispatch-flow-pascal-dignys-projects.vercel.app
```

Redeploy after saving.

## 2. Supabase → Authentication → URL configuration

**Site URL:**

```
https://dispatch-flow-pascal-dignys-projects.vercel.app
```

**Redirect URLs** (add each line):

```
https://dispatch-flow-pascal-dignys-projects.vercel.app/**
https://dispatch-flow-pascal-dignys-projects.vercel.app/auth/callback
https://dispatch-flow-pascal-dignys-projects.vercel.app/auth/confirm
http://localhost:3000/**
http://localhost:3000/auth/callback
http://localhost:3000/auth/confirm
```

If invite links still open **localhost** with `#access_token=...`, your **Site URL** above is still `http://localhost:3000`. Change it to production and save, then send a **new** invite.

Keep localhost entries for local development.

## 3. Re-send invites

Old invite emails still contain the old `redirect_to` (localhost). After updating URLs:

1. **Settings → Team** → revoke old invite (optional)
2. Send a **new invite** to the teammate

## 4. Fallback for invited users

If the Supabase email link fails, they can open:

```
https://dispatch-flow-pascal-dignys-projects.vercel.app/signup?email=their@email.com
```

Use the **same invited email**, set a password, then complete onboarding.
