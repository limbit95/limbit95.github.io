begin;

alter table public.notifications
  drop constraint if exists notifications_notification_type_check;

alter table public.notifications
  add constraint notifications_notification_type_check
  check (
    notification_type = any (array[
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
      'event_organizer_transfer_requested'::text,
      'event_organizer_transferred'::text,
      'event_organizer_transfer_cancelled'::text
    ])
  );

create or replace function public.cancel_event_organizer_transfer_request(p_request_id bigint)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_request public.event_organizer_transfer_requests%rowtype;
  v_event_title text;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception '승인된 회원만 주최자 변경 요청을 취소할 수 있습니다.' using errcode = '42501';
  end if;

  select request.* into v_request
  from public.event_organizer_transfer_requests as request
  where request.id = p_request_id
  for update;

  if not found then
    raise exception '주최자 변경 요청을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;
  if v_request.status <> 'pending' then
    raise exception '이미 처리된 주최자 변경 요청입니다.' using errcode = '23514';
  end if;
  if v_request.from_organizer_id <> v_user_id then
    raise exception '요청한 주최자만 변경 요청을 취소할 수 있습니다.' using errcode = '42501';
  end if;

  select event.title into v_event_title
  from public.events as event
  where event.id = v_request.event_id;

  update public.event_organizer_transfer_requests
  set status = 'cancelled', cancelled_at = now()
  where id = p_request_id;

  insert into public.notifications (
    user_id,
    notification_type,
    kind,
    title,
    body,
    event_id,
    target_path
  ) values (
    v_request.to_organizer_id,
    'event_organizer_transfer_cancelled',
    'event_organizer_transfer_cancelled',
    '주최자 변경 요청이 취소되었어요',
    format('''%s'' 활동의 주최자 변경 요청이 취소되었습니다.', coalesce(v_event_title, '활동')),
    v_request.event_id,
    format('#/activities/%s', v_request.event_id)
  );

  return jsonb_build_object(
    'request_id', p_request_id,
    'event_id', v_request.event_id,
    'status', 'cancelled'
  );
end;
$$;

revoke all on function public.cancel_event_organizer_transfer_request(bigint)
from public, anon, authenticated;
grant execute on function public.cancel_event_organizer_transfer_request(bigint)
to authenticated, service_role;

notify pgrst, 'reload schema';

commit;
