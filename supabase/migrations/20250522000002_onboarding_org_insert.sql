-- Allow authenticated users to bootstrap the default org during onboarding
create policy "organizations_insert_authenticated"
  on public.organizations for insert
  to authenticated
  with check (true);
