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
    'event_organizer_transfer_requested'::text,
    'event_organizer_transferred'::text,
    'event_organizer_transfer_cancelled'::text,
    'event_organizer_transfer_accepted'::text,
    'event_organizer_transfer_rejected'::text
  ]));

create or replace function private.notify_event_participation_to_organizer(
  p_event_id bigint,
  p_actor_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_organizer_id uuid;
  v_event_title text;
  v_actor_name text;
  v_notification_type text;
  v_title text;
  v_body text;
begin
  select event.organizer_id, event.title
  into v_organizer_id, v_event_title
  from public.events as event
  where event.id = p_event_id;

  if not found then
    raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;

  if v_organizer_id = p_actor_id then
    return;
  end if;

  select coalesce(nullif(btrim(profile.display_name), ''), '회원')
  into v_actor_name
  from public.profiles as profile
  where profile.id = p_actor_id;

  v_actor_name := coalesce(v_actor_name, '회원');

  case p_status
    when 'joined' then
      v_notification_type := 'event_participant_joined';
      v_title := '새로운 활동 참여';
      v_body := format('%s님이 ''%s'' 활동에 참여했습니다.', v_actor_name, v_event_title);
    when 'waitlisted' then
      v_notification_type := 'event_participant_waitlisted';
      v_title := '새로운 대기 신청';
      v_body := format('%s님이 ''%s'' 활동에 대기 신청했습니다.', v_actor_name, v_event_title);
    when 'cancelled' then
      v_notification_type := 'event_participation_cancelled';
      v_title := '활동 참여 취소';
      v_body := format('%s님이 ''%s'' 활동 참여를 취소했습니다.', v_actor_name, v_event_title);
    else
      raise exception '지원하지 않는 참여 상태입니다.' using errcode = '23514';
  end case;

  insert into public.notifications (
    user_id,
    notification_type,
    kind,
    title,
    body,
    event_id,
    target_path
  ) values (
    v_organizer_id,
    v_notification_type,
    v_notification_type,
    v_title,
    v_body,
    p_event_id,
    format('#/activities/%s', p_event_id)
  );
end;
$$;

revoke all on function private.notify_event_participation_to_organizer(bigint, uuid, text)
from public, anon, authenticated;

create or replace function private.notify_event_organizer_transfer_response(
  p_request_id bigint,
  p_event_id bigint,
  p_requester_id uuid,
  p_responder_id uuid,
  p_accepted boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event_title text;
  v_responder_name text;
  v_notification_type text;
  v_title text;
  v_body text;
begin
  select event.title
  into v_event_title
  from public.events as event
  where event.id = p_event_id;

  if not found then
    raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;

  select coalesce(nullif(btrim(profile.display_name), ''), '회원')
  into v_responder_name
  from public.profiles as profile
  where profile.id = p_responder_id;

  v_responder_name := coalesce(v_responder_name, '회원');

  if p_accepted then
    v_notification_type := 'event_organizer_transfer_accepted';
    v_title := '주최자 변경 요청이 수락됐어요';
    v_body := format('%s님이 ''%s'' 활동의 주최자 변경 요청을 수락했습니다.', v_responder_name, v_event_title);
  else
    v_notification_type := 'event_organizer_transfer_rejected';
    v_title := '주최자 변경 요청이 거절됐어요';
    v_body := format('%s님이 ''%s'' 활동의 주최자 변경 요청을 거절했습니다.', v_responder_name, v_event_title);
  end if;

  insert into public.notifications (
    user_id,
    notification_type,
    kind,
    title,
    body,
    event_id,
    target_path,
    dedupe_key
  ) values (
    p_requester_id,
    v_notification_type,
    v_notification_type,
    v_title,
    v_body,
    p_event_id,
    format('#/activities/%s', p_event_id),
    format('event_organizer_transfer_response:%s', p_request_id)
  )
  on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing;
end;
$$;

revoke all on function private.notify_event_organizer_transfer_response(bigint, bigint, uuid, uuid, boolean)
from public, anon, authenticated;

create or replace function public.join_event(p_event_id bigint)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_event public.events%rowtype;
  v_existing_status text;
  v_joined_count integer;
  v_new_status text;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception '승인된 회원만 활동에 참여할 수 있습니다.' using errcode = '42501';
  end if;

  select event.* into v_event
  from public.events as event
  where event.id = p_event_id
  for update;

  if not found then
    raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;
  if v_event.status <> 'scheduled' then
    raise exception '현재 참여 신청을 받을 수 없는 활동입니다.' using errcode = '23514';
  end if;
  if now() > v_event.registration_deadline then
    raise exception '참여 신청이 마감되었습니다.' using errcode = '23514';
  end if;

  select participant.status into v_existing_status
  from public.event_participants as participant
  where participant.event_id = p_event_id
    and participant.user_id = v_user_id
  for update;

  if found and v_existing_status in ('joined', 'waitlisted') then
    raise exception '이미 참여 또는 대기 신청한 활동입니다.' using errcode = '23505';
  end if;

  select count(*)::integer into v_joined_count
  from public.event_participants as participant
  where participant.event_id = p_event_id
    and participant.status = 'joined';

  v_new_status := case
    when v_event.capacity is null or v_joined_count < v_event.capacity then 'joined'
    else 'waitlisted'
  end;

  insert into public.event_participants (
    event_id,
    user_id,
    status,
    joined_at,
    waitlisted_at,
    cancelled_at
  ) values (
    p_event_id,
    v_user_id,
    v_new_status,
    case when v_new_status = 'joined' then now() else null end,
    case when v_new_status = 'waitlisted' then now() else null end,
    null
  )
  on conflict (event_id, user_id) do update
  set status = excluded.status,
      joined_at = excluded.joined_at,
      waitlisted_at = excluded.waitlisted_at,
      cancelled_at = null;

  perform private.notify_event_participation_to_organizer(
    p_event_id,
    v_user_id,
    v_new_status
  );

  return v_new_status;
end;
$$;

revoke all on function public.join_event(bigint)
from public, anon, authenticated;
grant execute on function public.join_event(bigint)
to authenticated, service_role;

create or replace function public.cancel_event_participation(p_event_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_event public.events%rowtype;
  v_current_status text;
  v_promoted_user_id uuid;
  v_joined_count integer;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception '승인된 회원만 참여를 취소할 수 있습니다.' using errcode = '42501';
  end if;

  select event.* into v_event
  from public.events as event
  where event.id = p_event_id
  for update;

  if not found then
    raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;

  if v_event.status not in ('scheduled', 'closed') then
    raise exception '현재 참여 취소를 처리할 수 없는 활동입니다.' using errcode = '23514';
  end if;

  if now() > v_event.registration_deadline then
    raise exception '참여 취소 가능 시간이 지났습니다.' using errcode = '23514';
  end if;

  select participant.status into v_current_status
  from public.event_participants as participant
  where participant.event_id = p_event_id
    and participant.user_id = v_user_id
  for update;

  if not found or v_current_status = 'cancelled' then
    raise exception '취소할 참여 정보가 없습니다.' using errcode = 'P0002';
  end if;

  if v_event.series_id is null
     and v_event.organizer_id = v_user_id
     and v_current_status = 'joined'
     and exists (
       select 1
       from public.event_participants as other_participant
       where other_participant.event_id = p_event_id
         and other_participant.user_id <> v_user_id
         and other_participant.status = 'joined'
     ) then
    raise exception '다른 참여자가 있는 활동의 주최자는 먼저 주최자를 변경해야 합니다.'
      using errcode = '23514';
  end if;

  update public.event_participants
  set status = 'cancelled', cancelled_at = now()
  where event_id = p_event_id
    and user_id = v_user_id;

  perform private.notify_event_participation_to_organizer(
    p_event_id,
    v_user_id,
    'cancelled'
  );

  if v_current_status = 'joined' then
    select count(*)::integer into v_joined_count
    from public.event_participants as participant
    where participant.event_id = p_event_id
      and participant.status = 'joined';

    if v_event.capacity is null or v_joined_count < v_event.capacity then
      select participant.user_id into v_promoted_user_id
      from public.event_participants as participant
      where participant.event_id = p_event_id
        and participant.status = 'waitlisted'
      order by participant.waitlisted_at asc, participant.created_at asc
      for update skip locked
      limit 1;

      if v_promoted_user_id is not null then
        update public.event_participants
        set status = 'joined',
            joined_at = now(),
            waitlisted_at = null,
            cancelled_at = null
        where event_id = p_event_id
          and user_id = v_promoted_user_id;

        insert into public.notifications (
          user_id,
          notification_type,
          title,
          body,
          event_id
        ) values (
          v_promoted_user_id,
          'waitlist_promoted',
          '활동 참여가 확정되었어요',
          format('대기 중이던 "%s" 활동에 참여할 수 있게 되었습니다.', v_event.title),
          p_event_id
        );
      end if;
    end if;
  end if;
end;
$$;

revoke all on function public.cancel_event_participation(bigint)
from public, anon, authenticated;
grant execute on function public.cancel_event_participation(bigint)
to authenticated, service_role;

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

    perform private.notify_event_organizer_transfer_response(
      p_request_id,
      v_request.event_id,
      v_request.from_organizer_id,
      v_user_id,
      false
    );

    return jsonb_build_object(
      'request_id', p_request_id,
      'event_id', v_request.event_id,
      'status', 'rejected'
    );
  end if;

  if v_event.series_id is not null or v_event.status not in ('scheduled', 'closed') then
    raise exception '현재 상태에서는 주최자 변경 요청을 수락할 수 없습니다.' using errcode = '23514';
  end if;

  select participant.status into v_current_status
  from public.event_participants as participant
  where participant.event_id = v_request.event_id
    and participant.user_id = v_user_id
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
    from public.event_participants as participant
    where participant.event_id = v_request.event_id
      and participant.status = 'joined';

    if v_event.capacity is null or v_joined_count < v_event.capacity then
      select participant.user_id into v_promoted_user_id
      from public.event_participants as participant
      where participant.event_id = v_request.event_id
        and participant.status = 'waitlisted'
      order by participant.waitlisted_at asc, participant.created_at asc
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
          user_id,
          notification_type,
          title,
          body,
          event_id,
          target_path
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

  perform private.notify_event_organizer_transfer_response(
    p_request_id,
    v_request.event_id,
    v_request.from_organizer_id,
    v_user_id,
    true
  );

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