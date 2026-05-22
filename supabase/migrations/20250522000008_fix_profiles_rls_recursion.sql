-- Fix infinite RLS recursion on profiles: policies must not SELECT from profiles
-- while evaluating access to profiles. Use security definer helpers instead.

create or replace function public.auth_user_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from public.profiles where id = auth.uid();
$$;

create or replace function public.auth_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

revoke all on function public.auth_user_organization_id() from public;
revoke all on function public.auth_user_role() from public;
grant execute on function public.auth_user_organization_id() to authenticated;
grant execute on function public.auth_user_role() to authenticated;

drop policy if exists "profiles_select_own_org" on public.profiles;
create policy "profiles_select_own_org"
  on public.profiles for select
  to authenticated
  using (
    id = auth.uid()
    or (
      public.auth_user_organization_id() is not null
      and organization_id = public.auth_user_organization_id()
    )
  );

drop policy if exists "profiles_update_admin_org" on public.profiles;
create policy "profiles_update_admin_org"
  on public.profiles for update
  to authenticated
  using (
    public.auth_user_role() = 'admin'
    and organization_id = public.auth_user_organization_id()
  )
  with check (
    public.auth_user_role() = 'admin'
    and organization_id = public.auth_user_organization_id()
  );
