-- Invited users can read their pending invite before profile exists
create policy "org_invites_select_invitee_email"
  on public.organization_invites for select
  to authenticated
  using (
    status = 'pending'
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
