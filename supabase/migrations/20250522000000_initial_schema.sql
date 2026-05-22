-- DispatchFlow initial schema
-- Run via Supabase CLI: supabase db push
-- Or paste into Supabase SQL editor

create extension if not exists "pgcrypto";

create type public.user_role as enum (
  'admin',
  'dispatcher',
  'procurement',
  'requester',
  'viewer'
);

create type public.request_status as enum (
  'draft',
  'submitted',
  'approved',
  'rejected',
  'in_dispatch',
  'delivered',
  'cancelled'
);

create type public.dispatch_status as enum (
  'pending',
  'assigned',
  'in_transit',
  'delivered',
  'failed',
  'cancelled'
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'requester',
  department text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.procurement_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  requester_id uuid not null references public.profiles (id) on delete restrict,
  title text not null,
  description text,
  status public.request_status not null default 'draft',
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  destination text,
  needed_by timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dispatches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_id uuid references public.procurement_requests (id) on delete set null,
  reference_code text not null,
  status public.dispatch_status not null default 'pending',
  assignee_name text,
  origin text,
  destination text,
  scheduled_at timestamptz,
  delivered_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, reference_code)
);

create index idx_profiles_org on public.profiles (organization_id);
create index idx_requests_org_status on public.procurement_requests (organization_id, status);
create index idx_dispatches_org_status on public.dispatches (organization_id, status);

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.procurement_requests enable row level security;
alter table public.dispatches enable row level security;

-- Profiles: users read/update own row; same org members visible to authenticated users
create policy "profiles_select_own_org"
  on public.profiles for select
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

-- Organizations: members can read their org
create policy "organizations_select_member"
  on public.organizations for select
  to authenticated
  using (
    id in (select organization_id from public.profiles where id = auth.uid())
  );

-- Requests: org-scoped CRUD for authenticated members
create policy "requests_select_org"
  on public.procurement_requests for select
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create policy "requests_insert_org"
  on public.procurement_requests for insert
  to authenticated
  with check (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
    and requester_id = auth.uid()
  );

create policy "requests_update_org"
  on public.procurement_requests for update
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

-- Dispatches: org-scoped access
create policy "dispatches_select_org"
  on public.dispatches for select
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create policy "dispatches_insert_org"
  on public.dispatches for insert
  to authenticated
  with check (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create policy "dispatches_update_org"
  on public.dispatches for update
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

-- Auto-create profile stub on signup (extend in app with org assignment)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Profile creation is handled by app onboarding; hook reserved for future use.
  return new;
end;
$$;
