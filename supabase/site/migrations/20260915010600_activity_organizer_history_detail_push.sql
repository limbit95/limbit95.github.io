begin;

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
    'service_notice'::text,
    'event_organizer_changed'::text
  ]));

create or replace function public.list_event_organizer_history(p_event_id bigint)
returns table (
  history_id bigint,
  previous_organizer_id uuid,
  previous_organizer_name text,
  organizer_id uuid,
  organizer_name text,
  previous_organizer_left boolean,
  changed_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not private.is_approved_member() then
    raise exception '승인된 회원만 주최자 변경 내역을 확인할 수 있습니다.' using errcode = '42501';
  end if;

  if not exists (select 1 from public.events e where e.id = p_event_id) then
    raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;

  return query
  select
    history.id as history_id,
    history.previous_organizer_id,
    coalesce(nullif(btrim(previous_profile.display_name), ''), '회원') as previous_organizer_name,
    history.organizer_id,
    coalesce(nullif(btrim(organizer_profile.display_name), ''), '회원') as organizer_name,
    history.previous_organizer_left,
    history.changed_at
  from public.event_organizer_history history
  left join public.profiles previous_profile on previous_profile.id = history.previous_organizer_id
  left join public.profiles organizer_profile on organizer_profile.id = history.organizer_id
  where history.event_id = p_event_id
    and history.change_type = 'transfer'
  order by history.changed_at desc, history.id desc;
end;
$$;

revoke all on function public.list_event_organizer_history(bigint) from public, anon, authenticated;
grant execute on function public.list_event_organizer_history(bigint) to authenticated, service_role;

create or replace function private.notify_event_organizer_transfer()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.change_type <> 'transfer' then
    return new;
  end if;

  insert into public.notifications (
    user_id, notification_type, kind, title, body,
    event_id, target_path, dedupe_key
  ) values (
    new.organizer_id,
    'event_organizer_changed',
    'event_organizer_changed',
    '활동 주최자가 변경됐어요',
    format('''%s'' 활동의 주최자로 지정되었습니다.', new.event_title),
    new.event_id,
    format('#/activities/%s', new.event_id),
    'event_organizer_changed:' || new.id::text
  )
  on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing;

  return new;
end;
$$;

revoke all on function private.notify_event_organizer_transfer() from public, anon, authenticated;

drop trigger if exists event_organizer_history_notify_new_organizer on public.event_organizer_history;
create trigger event_organizer_history_notify_new_organizer
after insert on public.event_organizer_history
for each row execute function private.notify_event_organizer_transfer();

notify pgrst, 'reload schema';

commit;
