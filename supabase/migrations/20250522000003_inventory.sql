create type public.inventory_movement_type as enum ('in', 'out', 'adjustment');

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  sku text not null,
  name text not null,
  description text,
  category text,
  unit text not null default 'ea',
  quantity_on_hand numeric not null default 0 check (quantity_on_hand >= 0),
  reorder_level numeric not null default 0 check (reorder_level >= 0),
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sku)
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  item_id uuid not null references public.inventory_items (id) on delete cascade,
  movement_type public.inventory_movement_type not null,
  quantity numeric not null check (quantity > 0),
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_inventory_items_org on public.inventory_items (organization_id);
create index idx_inventory_movements_item on public.inventory_movements (item_id, created_at desc);

alter table public.inventory_items enable row level security;
alter table public.inventory_movements enable row level security;

create policy "inventory_items_select_org"
  on public.inventory_items for select
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create policy "inventory_items_insert_org"
  on public.inventory_items for insert
  to authenticated
  with check (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create policy "inventory_items_update_org"
  on public.inventory_items for update
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create policy "inventory_movements_select_org"
  on public.inventory_movements for select
  to authenticated
  using (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );

create policy "inventory_movements_insert_org"
  on public.inventory_movements for insert
  to authenticated
  with check (
    organization_id in (
      select organization_id from public.profiles where id = auth.uid()
    )
  );
