create extension if not exists pg_cron with schema pg_catalog;

create or replace function private.create_due_activity_reminders()
returns integer
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_created integer := 0;
begin
  with candidates as (
    select
      ep.user_id,
      e.id as event_id,
      e.title,
      ((e.event_date + e.start_time) at time zone 'Asia/Seoul') as starts_at
    from public.event_participants ep
    join public.events e on e.id = ep.event_id
    join public.profiles p on p.id = ep.user_id
    where ep.status = 'joined'
      and p.status = 'approved'
      and e.status in ('scheduled', 'closed')
  ), inserted as (
    insert into public.notifications(
      user_id, notification_type, kind, title, body,
      event_id, is_read, created_at, target_path, expires_at, dedupe_key
    )
    select
      c.user_id,
      'activity_reminder',
      'activity_reminder',
      '참여 활동이 곧 시작해요',
      c.title || ' · 24시간 이내 시작',
      c.event_id,
      false,
      now(),
      '#/activities/' || c.event_id::text,
      c.starts_at,
      'activity_reminder:' || c.event_id::text
    from candidates c
    where c.starts_at > now()
      and c.starts_at <= now() + interval '24 hours'
    on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing
    returning 1
  )
  select count(*) into v_created from inserted;

  return v_created;
end;
$$;

revoke all on function private.create_due_activity_reminders() from public, anon, authenticated;

select cron.schedule(
  'cheongpa-activity-reminders',
  '*/5 * * * *',
  'select private.create_due_activity_reminders();'
);
