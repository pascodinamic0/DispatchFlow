-- Organization updates (admin only)
create policy "organizations_update_admin"
  on public.organizations for update
  to authenticated
  using (
    id in (
      select organization_id from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    id in (
      select organization_id from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins may update team member profiles (e.g. role) within their org
create policy "profiles_update_admin_org"
  on public.profiles for update
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    organization_id in (
      select organization_id from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
