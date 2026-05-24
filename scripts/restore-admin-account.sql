-- Restore admin: pascal@digni-digital-llc.com
-- Run in Supabase Dashboard → SQL Editor
-- Project: btodphgragwfojbmcdkj (DispatchFlow)

-- ─── 1) Diagnose ─────────────────────────────────────────────────────────────
select
  u.id as auth_user_id,
  u.email,
  u.created_at as auth_created_at,
  p.id as profile_id,
  p.full_name,
  p.role,
  o.id as organization_id,
  o.name as organization_name
from auth.users u
left join public.profiles p on p.id = u.id
left join public.organizations o on o.id = p.organization_id
where lower(u.email) = lower('pascal@digni-digital-llc.com');

-- ─── 2) Restore profile (when auth user EXISTS but profile is missing) ─────
-- Pick your org: change the WHERE on organizations if you have several.
insert into public.profiles (
  id,
  organization_id,
  full_name,
  role,
  department
)
select
  u.id,
  o.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', 'Pascal Digny'),
  'admin'::public.user_role,
  null
from auth.users u
cross join lateral (
  select id
  from public.organizations
  where lower(name) like '%digni%'
  order by created_at
  limit 1
) o
where lower(u.email) = lower('pascal@digni-digital-llc.com')
on conflict (id) do update
set
  role = 'admin'::public.user_role,
  organization_id = excluded.organization_id,
  full_name = excluded.full_name,
  updated_at = now();

-- If no org name match, use your first / only organization instead:
-- cross join (select id from public.organizations order by created_at limit 1) o

-- ─── 3) Promote to admin (profile already exists) ────────────────────────────
update public.profiles
set role = 'admin'::public.user_role,
    updated_at = now()
where id = (
  select id from auth.users where lower(email) = lower('pascal@digni-digital-llc.com')
);

-- ─── 4) Verify ─────────────────────────────────────────────────────────────
select u.email, p.full_name, p.role, o.name as organization
from auth.users u
join public.profiles p on p.id = u.id
join public.organizations o on o.id = p.organization_id
where lower(u.email) = lower('pascal@digni-digital-llc.com');
