alter table public.push_notification_preferences
  add column if not exists push_opt_in boolean not null default false;

comment on column public.push_notification_preferences.push_opt_in is
  'Whether the member asked to be guided toward enabling push notifications during onboarding.';
