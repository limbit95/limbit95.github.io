begin;

create or replace function public.respond_event_organizer_transfer(
  p_request_id bigint,
  p_accept boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_request public.event_organizer_transfer_requests%rowtype;
  v_event public.events%rowtype;
  v_current_status text;
  v_joined_count integer;
  v_promoted_user_id uuid;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception '승인된 회원만 주최자 변경 요청에 응답할 수 있습니다.' using errcode = '42501';
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
  if v_request.to_organizer_id <> v_user_id then
    raise exception '요청을 받은 회원만 응답할 수 있습니다.' using errcode = '42501';
  end if;

  select event.* into v_event
  from public.events as event
  where event.id = v_request.event_id
  for update;

  if not found then
    raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;
  if v_event.organizer_id <> v_request.from_organizer_id then
    raise exception '현재 주최자가 변경되어 이 요청을 처리할 수 없습니다.' using errcode = '23514';
  end if;

  if not p_accept then
    update public.event_organizer_transfer_requests
    set status = 'rejected', responded_at = now()
    where id = p_request_id;

    return jsonb_build_object(
      'request_id', p_request_id,
      'event_id', v_request.event_id,
      'status', 'rejected'
    );
  end if;

  if v_event.series_id is not null or v_event.status not in ('scheduled', 'closed') then
    raise exception '현재 상태에서는 주최자 변경 요청을 수락할 수 없습니다.' using errcode = '23514';
  end if;

  select ep.status into v_current_status
  from public.event_participants as ep
  where ep.event_id = v_request.event_id
    and ep.user_id = v_user_id
  for update;

  if not found or v_current_status <> 'joined' then
    raise exception '현재 활동에 참여 중인 경우에만 주최자 요청을 수락할 수 있습니다.' using errcode = '23514';
  end if;

  perform set_config('app.allow_event_organizer_transfer', 'true', true);
  perform set_config(
    'app.event_organizer_previous_leaves',
    case when v_request.leave_current_after_accept then 'true' else 'false' end,
    true
  );

  update public.events
  set organizer_id = v_user_id
  where id = v_request.event_id;

  perform set_config('app.allow_event_organizer_transfer', 'false', true);
  perform set_config('app.event_organizer_previous_leaves', 'false', true);

  update public.event_organizer_transfer_requests
  set status = 'accepted', responded_at = now()
  where id = p_request_id;

  if v_request.leave_current_after_accept then
    update public.event_participants
    set status = 'cancelled', cancelled_at = now()
    where event_id = v_request.event_id
      and user_id = v_request.from_organizer_id
      and status = 'joined';

    select count(*)::integer into v_joined_count
    from public.event_participants as ep
    where ep.event_id = v_request.event_id
      and ep.status = 'joined';

    if v_event.capacity is null or v_joined_count < v_event.capacity then
      select ep.user_id into v_promoted_user_id
      from public.event_participants as ep
      where ep.event_id = v_request.event_id
        and ep.status = 'waitlisted'
      order by ep.waitlisted_at asc, ep.created_at asc
      for update skip locked
      limit 1;

      if v_promoted_user_id is not null then
        update public.event_participants
        set status = 'joined',
            joined_at = now(),
            waitlisted_at = null,
            cancelled_at = null
        where event_id = v_request.event_id
          and user_id = v_promoted_user_id;

        insert into public.notifications (
          user_id, notification_type, title, body, event_id, target_path
        ) values (
          v_promoted_user_id,
          'waitlist_promoted',
          '활동 참여가 확정되었어요',
          format('대기 중이던 "%s" 활동에 참여할 수 있게 되었습니다.', v_event.title),
          v_request.event_id,
          format('#/activities/%s', v_request.event_id)
        );
      end if;
    end if;
  end if;

  return jsonb_build_object(
    'request_id', p_request_id,
    'event_id', v_request.event_id,
    'creator_id', v_event.created_by,
    'previous_organizer_id', v_request.from_organizer_id,
    'organizer_id', v_user_id,
    'status', 'accepted',
    'left_activity', v_request.leave_current_after_accept
  );
end;
$$;

revoke all on function public.respond_event_organizer_transfer(bigint, boolean)
from public, anon, authenticated;
grant execute on function public.respond_event_organizer_transfer(bigint, boolean)
to authenticated, service_role;

notify pgrst, 'reload schema';

commit;
