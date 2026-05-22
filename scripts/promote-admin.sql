-- Run in Supabase Dashboard → SQL Editor (project btodphgragwfojbmcdkj)
-- Promotes the signed-up user to org admin (highest role in DispatchFlow).

update public.profiles
set role = 'admin',
    updated_at = now()
where id = (
  select id from auth.users where lower(email) = lower('pascal@digni-digital-llc.com')
);

-- Verify (should show role = admin)
select u.email, p.full_name, p.role, o.name as organization
from auth.users u
join public.profiles p on p.id = u.id
join public.organizations o on o.id = p.organization_id
where lower(u.email) = lower('pascal@digni-digital-llc.com');
