begin;

create table if not exists public.push_notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  new_activity_scope text not null default 'interest_only'
    check (new_activity_scope in ('none', 'interest_only', 'all')),
  created_activity_participation_enabled boolean not null default true,
  joined_activity_updates_enabled boolean not null default true,
  service_notices_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.push_notification_preferences enable row level security;
revoke all on public.push_notification_preferences from anon, authenticated;
grant select, insert, update on public.push_notification_preferences to authenticated;

drop policy if exists push_notification_preferences_select_own on public.push_notification_preferences;
create policy push_notification_preferences_select_own
  on public.push_notification_preferences
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists push_notification_preferences_insert_own on public.push_notification_preferences;
create policy push_notification_preferences_insert_own
  on public.push_notification_preferences
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists push_notification_preferences_update_own on public.push_notification_preferences;
create policy push_notification_preferences_update_own
  on public.push_notification_preferences
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

insert into public.push_notification_preferences(user_id)
select p.id
from public.profiles p
on conflict (user_id) do nothing;

alter table public.notifications drop constraint if exists notifications_notification_type_check;
alter table public.notifications add constraint notifications_notification_type_check
  check (notification_type = any (array[
    'event_updated'::text,
    'event_cancelled'::text,
    'waitlist_promoted'::text,
    'poll_closed'::text,
    'new_activity'::text,
    'direct_message'::text,
    'activity_reminder'::text,
    'event_participant_joined'::text,
    'event_participant_waitlisted'::text,
    'event_participation_cancelled'::text,
    'join_request_received'::text,
    'service_notice'::text
  ]));

-- 기존의 광범위한 활동 변경 알림을 실제 참석에 중요한 변경만 알리도록 좁힌다.
create or replace function private.notify_event_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_changed_labels text[] := array[]::text[];
begin
  if new.status = 'cancelled' and old.status is distinct from 'cancelled' then
    insert into public.notifications(
      user_id, notification_type, kind, title, body,
      event_id, is_read, created_at, target_path
    )
    select
      ep.user_id,
      'event_cancelled',
      'event_cancelled',
      '참여 활동이 취소됐어요',
      new.title || ' 활동이 취소되었습니다.',
      new.id,
      false,
      now(),
      '#/activities/' || new.id::text
    from public.event_participants ep
    where ep.event_id = new.id
      and ep.status in ('joined', 'waitlisted')
      and (auth.uid() is null or ep.user_id <> auth.uid());

    return new;
  end if;

  if new.category_id is distinct from old.category_id then
    v_changed_labels := array_append(v_changed_labels, '카테고리');
  end if;
  if new.event_date is distinct from old.event_date then
    v_changed_labels := array_append(v_changed_labels, '날짜');
  end if;
  if new.start_time is distinct from old.start_time
      or new.end_time is distinct from old.end_time then
    v_changed_labels := array_append(v_changed_labels, '시간');
  end if;
  if new.location_name is distinct from old.location_name
      or new.location_url is distinct from old.location_url then
    v_changed_labels := array_append(v_changed_labels, '장소');
  end if;

  if coalesce(array_length(v_changed_labels, 1), 0) > 0 then
    insert into public.notifications(
      user_id, notification_type, kind, title, body,
      event_id, is_read, created_at, target_path
    )
    select
      ep.user_id,
      'event_updated',
      'event_updated',
      '참여 활동 정보가 변경됐어요',
      new.title || ' · ' || array_to_string(v_changed_labels, ', ') || ' 정보가 변경되었습니다.',
      new.id,
      false,
      now(),
      '#/activities/' || new.id::text
    from public.event_participants ep
    where ep.event_id = new.id
      and ep.status in ('joined', 'waitlisted')
      and (auth.uid() is null or ep.user_id <> auth.uid());
  end if;

  return new;
end;
$$;

revoke all on function private.notify_event_change() from public, anon, authenticated;

drop trigger if exists trg_notify_event_participant_changes on public.events;
drop trigger if exists events_notify_participants on public.events;
create trigger events_notify_participants
  after update of category_id, event_date, start_time, end_time, location_name, location_url, status
  on public.events
  for each row execute function private.notify_event_change();

create or replace function private.notify_important_notice()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_should_notify boolean := false;
begin
  if tg_op = 'INSERT' then
    v_should_notify := new.board_type = 'notice'
      and new.status = 'published'
      and new.is_important = true;
  else
    v_should_notify := new.board_type = 'notice'
      and new.status = 'published'
      and new.is_important = true
      and not (
        old.board_type = 'notice'
        and old.status = 'published'
        and old.is_important = true
      );
  end if;

  if v_should_notify then
    insert into public.notifications(
      user_id, notification_type, kind, title, body,
      is_read, created_at, target_path, dedupe_key
    )
    select
      p.id,
      'service_notice',
      'service_notice',
      '중요 공지가 등록됐어요',
      new.title,
      false,
      now(),
      '#/notice/' || new.id::text,
      'service_notice:' || new.id::text
    from public.profiles p
    where p.status = 'approved'
    on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing;
  end if;

  return new;
end;
$$;

revoke all on function private.notify_important_notice() from public;

drop trigger if exists trg_notify_important_notice on public.posts;
create trigger trg_notify_important_notice
  after insert or update on public.posts
  for each row execute function private.notify_important_notice();

commit;
