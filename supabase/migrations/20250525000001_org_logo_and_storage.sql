-- Organization logo + Supabase Storage for brand assets

alter table public.organizations
  add column if not exists logo_url text;

-- Public buckets for logos and profile avatars (displayed in the app shell)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'organization-logos',
    'organization-logos',
    true,
    2097152,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'avatars',
    'avatars',
    true,
    2097152,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Organization logos: org members read; admins write to their org folder
create policy "organization_logos_select"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'organization-logos');

create policy "organization_logos_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'organization-logos'
    and (storage.foldername(name))[1] in (
      select organization_id::text from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "organization_logos_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'organization-logos'
    and (storage.foldername(name))[1] in (
      select organization_id::text from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "organization_logos_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'organization-logos'
    and (storage.foldername(name))[1] in (
      select organization_id::text from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Profile avatars: org members read; each user writes their own folder
create policy "avatars_select"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'avatars');

create policy "avatars_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
