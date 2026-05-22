-- Notification preferences on profiles
alter table public.profiles
  add column if not exists email_notifications_enabled boolean not null default true,
  add column if not exists push_notifications_enabled boolean not null default true;

-- In-app + delivery tracking
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  href text,
  read_at timestamptz,
  email_sent_at timestamptz,
  push_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_notifications_user_unread
  on public.notifications (user_id, created_at desc)
  where read_at is null;

-- Web push subscriptions
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

-- Team invites (pending until accepted at onboarding)
create type public.invite_status as enum ('pending', 'accepted', 'revoked');

create table public.organization_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  email text not null,
  role public.user_role not null default 'requester',
  invited_by uuid not null references public.profiles (id) on delete cascade,
  status public.invite_status not null default 'pending',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '14 days')
);

create unique index idx_org_invites_pending_email
  on public.organization_invites (organization_id, lower(email))
  where status = 'pending';

-- Inventory line items on procurement requests
create table public.request_line_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_id uuid not null references public.procurement_requests (id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items (id) on delete restrict,
  quantity numeric not null check (quantity > 0),
  notes text,
  created_at timestamptz not null default now(),
  unique (request_id, inventory_item_id)
);

create index idx_request_line_items_request on public.request_line_items (request_id);

alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.organization_invites enable row level security;
alter table public.request_line_items enable row level security;

create policy "notifications_select_own"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

create policy "notifications_update_own"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notifications_insert_org"
  on public.notifications for insert
  to authenticated
  with check (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create policy "push_subscriptions_own"
  on public.push_subscriptions for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "org_invites_select_org"
  on public.organization_invites for select
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create policy "org_invites_insert_admin"
  on public.organization_invites for insert
  to authenticated
  with check (
    organization_id in (
      select organization_id from public.profiles
      where id = auth.uid() and role = 'admin'
    )
    and invited_by = auth.uid()
  );

create policy "org_invites_update_admin"
  on public.organization_invites for update
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "request_line_items_select_org"
  on public.request_line_items for select
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create policy "request_line_items_insert_org"
  on public.request_line_items for insert
  to authenticated
  with check (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create policy "request_line_items_update_org"
  on public.request_line_items for update
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create policy "request_line_items_delete_org"
  on public.request_line_items for delete
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );
