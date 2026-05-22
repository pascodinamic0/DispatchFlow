-- Default organization for first-time user onboarding
insert into public.organizations (name, slug)
values ('DispatchFlow', 'dispatchflow')
on conflict (slug) do nothing;
