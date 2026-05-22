-- Onboarding: org creation, invite acceptance, and org reads before profile exists

create or replace function public.create_organization(p_name text, p_slug text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  if exists (select 1 from public.profiles where id = auth.uid()) then
    raise exception 'Profile already exists' using errcode = '42501';
  end if;

  insert into public.organizations (name, slug)
  values (trim(p_name), p_slug)
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.create_organization(text, text) from public;
grant execute on function public.create_organization(text, text) to authenticated;

drop policy if exists "organizations_insert_authenticated" on public.organizations;
create policy "organizations_insert_authenticated"
  on public.organizations for insert
  to authenticated
  with check (true);

drop policy if exists "organizations_select_member" on public.organizations;
create policy "organizations_select_member"
  on public.organizations for select
  to authenticated
  using (id = public.auth_user_organization_id());

drop policy if exists "organizations_select_invitee" on public.organizations;
create policy "organizations_select_invitee"
  on public.organizations for select
  to authenticated
  using (
    exists (
      select 1
      from public.organization_invites i
      where i.organization_id = organizations.id
        and i.status = 'pending'
        and i.expires_at > now()
        and lower(i.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

drop policy if exists "org_invites_select_invitee_email" on public.organization_invites;
create policy "org_invites_select_invitee_email"
  on public.organization_invites for select
  to authenticated
  using (
    status = 'pending'
    and expires_at > now()
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

drop policy if exists "org_invites_update_invitee_accept" on public.organization_invites;
create policy "org_invites_update_invitee_accept"
  on public.organization_invites for update
  to authenticated
  using (
    status = 'pending'
    and expires_at > now()
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  with check (status = 'accepted');
