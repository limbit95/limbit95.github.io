create or replace function public.remove_or_cancel_event(p_event_id bigint)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.events%rowtype;
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception '승인된 회원만 활동을 관리할 수 있습니다.' using errcode = '42501';
  end if;

  select * into v_event
  from public.events
  where id = p_event_id
  for update;

  if not found then
    raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;

  if not (
    private.has_admin_permission('community')
    or private.is_category_manager(v_event.category_id)
    or (
      v_event.series_id is null
      and v_event.organizer_id = v_user_id
      and v_event.status in ('scheduled', 'closed')
    )
  ) then
    raise exception '이 활동을 삭제할 권한이 없습니다.' using errcode = '42501';
  end if;

  if v_event.series_id is not null or exists (
    select 1 from public.event_participants participant
    where participant.event_id = p_event_id
      and participant.user_id <> v_event.organizer_id
  ) or exists (
    select 1 from public.notifications notification
    where notification.event_id = p_event_id
      and notification.notification_type <> 'new_activity'
  ) then
    if v_event.status <> 'cancelled' then
      update public.events set status = 'cancelled' where id = p_event_id;
    end if;
    return jsonb_build_object('action', 'cancelled', 'event_id', p_event_id);
  end if;

  delete from public.events where id = p_event_id;
  return jsonb_build_object('action', 'deleted', 'event_id', p_event_id);
end;
$$;

delete from public.notifications
where poll_id is not null
   or notification_type = 'poll_closed';

alter table public.notifications
  drop constraint if exists notification_target_check,
  drop constraint if exists notifications_notification_type_check,
  drop constraint if exists notifications_poll_id_fkey;

alter table public.notifications
  drop column if exists poll_id;

alter table public.notifications
  add constraint notification_target_check check (
    event_id is not null
    or message_id is not null
    or target_path is not null
  ),
  add constraint notifications_notification_type_check check (
    notification_type = any (array[
      'event_updated'::text,
      'event_cancelled'::text,
      'waitlist_promoted'::text,
      'new_activity'::text,
      'direct_message'::text,
      'activity_reminder'::text,
      'event_participant_joined'::text,
      'event_participant_waitlisted'::text,
      'event_participation_cancelled'::text,
      'join_request_received'::text,
      'service_notice'::text,
      'event_organizer_transfer_requested'::text,
      'event_organizer_transferred'::text,
      'event_organizer_transfer_cancelled'::text,
      'event_organizer_transfer_accepted'::text,
      'event_organizer_transfer_rejected'::text
    ])
  );

drop trigger if exists date_polls_notify_closed on public.date_polls;
drop function if exists private.notify_date_poll_closed();

drop table if exists public.date_poll_votes;
drop table if exists public.date_poll_options;
drop table if exists public.date_polls;
