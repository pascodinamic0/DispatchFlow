-- Notifications for other users could be inserted (org policy) but INSERT … RETURNING
-- and delivery metadata updates failed: select/update policies only allowed user_id = auth.uid().
-- That surfaced as 42501 → "You do not have permission" after the main action succeeded.

create policy "notifications_select_org"
  on public.notifications for select
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create or replace function public.mark_notification_delivery_sent(
  p_notification_id uuid,
  p_email_sent boolean default false,
  p_push_sent boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_org uuid;
  target_org uuid;
begin
  select organization_id into actor_org
  from public.profiles
  where id = auth.uid();

  if actor_org is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select organization_id into target_org
  from public.notifications
  where id = p_notification_id;

  if target_org is null or target_org <> actor_org then
    raise exception 'notification not found' using errcode = '42501';
  end if;

  update public.notifications
  set
    email_sent_at = case
      when p_email_sent then coalesce(email_sent_at, now())
      else email_sent_at
    end,
    push_sent_at = case
      when p_push_sent then coalesce(push_sent_at, now())
      else push_sent_at
    end
  where id = p_notification_id;
end;
$$;

grant execute on function public.mark_notification_delivery_sent(uuid, boolean, boolean)
  to authenticated;
