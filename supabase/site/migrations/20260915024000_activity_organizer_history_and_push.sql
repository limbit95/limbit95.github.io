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
    'event_organizer_transferred'::text
  ]));

create or replace function public.list_event_organizer_history(p_event_id bigint)
returns table (
  id bigint,
  previous_organizer_id uuid,
  previous_organizer_name text,
  organizer_id uuid,
  organizer_name text,
  changed_by uuid,
  changed_by_name text,
  previous_organizer_left boolean,
  changed_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not private.is_approved_member() then
    raise exception '승인된 회원만 주최자 변경 이력을 확인할 수 있습니다.'
      using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.events as event
    where event.id = p_event_id
  ) then
    raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;

  return query
  select
    history.id,
    history.previous_organizer_id,
    previous_organizer.display_name as previous_organizer_name,
    history.organizer_id,
    organizer.display_name as organizer_name,
    history.changed_by,
    changed_by.display_name as changed_by_name,
    history.previous_organizer_left,
    history.changed_at
  from public.event_organizer_history as history
  left join public.profiles as previous_organizer
    on previous_organizer.id = history.previous_organizer_id
  left join public.profiles as organizer
    on organizer.id = history.organizer_id
  left join public.profiles as changed_by
    on changed_by.id = history.changed_by
  where history.event_id = p_event_id
    and history.change_type = 'transfer'
  order by history.changed_at desc, history.id desc;
end;
$$;

revoke all on function public.list_event_organizer_history(bigint)
from public, anon, authenticated;
grant execute on function public.list_event_organizer_history(bigint)
to authenticated, service_role;

create or replace function public.transfer_event_organizer(
    p_event_id bigint,
    p_new_organizer_id uuid,
    p_leave_current boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
    v_event public.events%rowtype;
    v_new_organizer_status text;
begin
    if v_user_id is null or not private.is_approved_member() then
        raise exception '승인된 회원만 주최자를 변경할 수 있습니다.' using errcode = '42501';
    end if;

    select e.* into v_event
    from public.events as e
    where e.id = p_event_id
    for update;

    if not found then
        raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';
    end if;

    if v_event.series_id is not null then
        raise exception '반복 활동 일정의 주최자는 개별 변경할 수 없습니다.' using errcode = '23514';
    end if;

    if v_event.status not in ('scheduled', 'closed') then
        raise exception '현재 상태에서는 주최자를 변경할 수 없습니다.' using errcode = '23514';
    end if;

    if v_event.organizer_id <> v_user_id then
        raise exception '현재 주최자만 주최자를 변경할 수 있습니다.' using errcode = '42501';
    end if;

    if p_new_organizer_id is null or p_new_organizer_id = v_user_id then
        raise exception '다른 참여자를 새 주최자로 선택해주세요.' using errcode = '23514';
    end if;

    select ep.status into v_new_organizer_status
    from public.event_participants as ep
    where ep.event_id = p_event_id
      and ep.user_id = p_new_organizer_id
    for update;

    if not found or v_new_organizer_status <> 'joined' then
        raise exception '현재 참여 중인 회원에게만 주최자를 넘길 수 있습니다.' using errcode = '23514';
    end if;

    perform set_config('app.allow_event_organizer_transfer', 'true', true);
    perform set_config(
      'app.event_organizer_previous_leaves',
      case when p_leave_current then 'true' else 'false' end,
      true
    );

    update public.events
    set organizer_id = p_new_organizer_id
    where id = p_event_id;

    perform set_config('app.allow_event_organizer_transfer', 'false', true);
    perform set_config('app.event_organizer_previous_leaves', 'false', true);

    if p_leave_current then
        perform public.cancel_event_participation(p_event_id);
    end if;

    insert into public.notifications (
        user_id,
        notification_type,
        kind,
        title,
        body,
        event_id,
        target_path
    ) values (
        p_new_organizer_id,
        'event_organizer_transferred',
        'event_organizer_transferred',
        '활동 주최자가 되었어요',
        format('''%s'' 활동의 새 주최자로 지정되었습니다.', v_event.title),
        p_event_id,
        format('#/activities/%s', p_event_id)
    );

    return jsonb_build_object(
        'event_id', p_event_id,
        'creator_id', v_event.created_by,
        'previous_organizer_id', v_user_id,
        'organizer_id', p_new_organizer_id,
        'left_activity', p_leave_current
    );
end;
$$;

revoke all on function public.transfer_event_organizer(bigint, uuid, boolean)
from public, anon, authenticated;
grant execute on function public.transfer_event_organizer(bigint, uuid, boolean)
to authenticated, service_role;

notify pgrst, 'reload schema';

commit;
