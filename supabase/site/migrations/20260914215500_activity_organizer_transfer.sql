-- Treat the current standalone activity owner as the organizer and allow that
-- responsibility to move only through the domain RPC below. The original
-- events.created_by column remains the single authority used by the existing
-- member ownership policies, so edit/cancel permissions move with the organizer.

begin;

create or replace function private.enforce_event_management_boundary()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_is_owner boolean;
  v_is_community_manager boolean;
  v_organizer_transfer_allowed boolean := coalesce(
    current_setting('app.allow_event_organizer_transfer', true),
    'false'
  ) = 'true';
begin
  if v_user_id is null then
    return new;
  end if;

  if new.created_by is distinct from old.created_by
     and not v_organizer_transfer_allowed then
    raise exception '주최자는 주최자 변경 기능을 통해서만 변경할 수 있습니다.' using errcode = '42501';
  end if;

  if new.created_at is distinct from old.created_at then
    raise exception '생성일은 변경할 수 없습니다.' using errcode = '42501';
  end if;

  if new.series_id is distinct from old.series_id then
    raise exception '반복 활동 연결은 생성 후 변경할 수 없습니다.' using errcode = '42501';
  end if;

  if old.series_id is not null
     and new.category_id is distinct from old.category_id then
    raise exception '반복 활동 일정의 카테고리는 개별 변경할 수 없습니다.' using errcode = '42501';
  end if;

  if new.category_id is distinct from old.category_id and not exists (
    select 1 from public.activity_categories category
    where category.id = new.category_id and category.is_active
  ) then
    raise exception '활성 카테고리만 선택할 수 있습니다.' using errcode = '42501';
  end if;

  v_is_owner := old.series_id is null and old.created_by = v_user_id;
  v_is_community_manager := private.has_admin_permission('community');

  if v_is_community_manager then
    return new;
  end if;

  if old.series_id is not null then
    if not private.is_category_manager(old.category_id) then
      raise exception '반복 활동 일정은 해당 카테고리 담당자만 변경할 수 있습니다.'
        using errcode = '42501';
    end if;
    return new;
  end if;

  if v_is_owner then
    if new.status is distinct from old.status and new.status <> 'cancelled' then
      raise exception '활동 주최자는 일정 취소 외의 상태를 변경할 수 없습니다.' using errcode = '42501';
    end if;
    return new;
  end if;

  if not private.is_category_manager(old.category_id)
     or not private.is_category_manager(new.category_id) then
    raise exception '담당 중인 카테고리 안에서만 다른 회원의 활동을 변경할 수 있습니다.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_event_management_boundary()
from public, anon, authenticated;

-- A current organizer cannot leave an active activity while another confirmed
-- participant remains. The UI guides this case into transfer_event_organizer,
-- but the database guard keeps the invariant even for direct RPC calls.
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
        raise exception '승인된 회원만 참여를 취소할 수 있습니다.'
            using errcode = '42501';
    end if;

    select e.*
    into v_event
    from public.events as e
    where e.id = p_event_id
    for update;

    if not found then
        raise exception '활동을 찾을 수 없습니다.'
            using errcode = 'P0002';
    end if;

    if v_event.status not in ('scheduled', 'closed') then
        raise exception '현재 참여 취소를 처리할 수 없는 활동입니다.'
            using errcode = '23514';
    end if;

    if now() > v_event.registration_deadline then
        raise exception '참여 취소 가능 시간이 지났습니다.'
            using errcode = '23514';
    end if;

    select ep.status
    into v_current_status
    from public.event_participants as ep
    where ep.event_id = p_event_id
      and ep.user_id = v_user_id
    for update;

    if not found or v_current_status = 'cancelled' then
        raise exception '취소할 참여 정보가 없습니다.'
            using errcode = 'P0002';
    end if;

    if v_event.series_id is null
       and v_event.created_by = v_user_id
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
    set status = 'cancelled',
        cancelled_at = now()
    where event_id = p_event_id
      and user_id = v_user_id;

    if v_current_status = 'joined' then
        select count(*)::integer
        into v_joined_count
        from public.event_participants as ep
        where ep.event_id = p_event_id
          and ep.status = 'joined';

        if v_event.capacity is null or v_joined_count < v_event.capacity then
            select ep.user_id
            into v_promoted_user_id
            from public.event_participants as ep
            where ep.event_id = p_event_id
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
                where event_id = p_event_id
                  and user_id = v_promoted_user_id;

                insert into public.notifications (
                    user_id,
                    notification_type,
                    title,
                    body,
                    event_id
                )
                values (
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
        raise exception '승인된 회원만 주최자를 변경할 수 있습니다.'
            using errcode = '42501';
    end if;

    select e.*
    into v_event
    from public.events as e
    where e.id = p_event_id
    for update;

    if not found then
        raise exception '활동을 찾을 수 없습니다.'
            using errcode = 'P0002';
    end if;

    if v_event.series_id is not null then
        raise exception '반복 활동 일정의 주최자는 개별 변경할 수 없습니다.'
            using errcode = '23514';
    end if;

    if v_event.status not in ('scheduled', 'closed') then
        raise exception '현재 상태에서는 주최자를 변경할 수 없습니다.'
            using errcode = '23514';
    end if;

    if v_event.created_by <> v_user_id then
        raise exception '현재 주최자만 주최자를 변경할 수 있습니다.'
            using errcode = '42501';
    end if;

    if p_new_organizer_id is null or p_new_organizer_id = v_user_id then
        raise exception '다른 참여자를 새 주최자로 선택해주세요.'
            using errcode = '23514';
    end if;

    select ep.status
    into v_new_organizer_status
    from public.event_participants as ep
    where ep.event_id = p_event_id
      and ep.user_id = p_new_organizer_id
    for update;

    if not found or v_new_organizer_status <> 'joined' then
        raise exception '현재 참여 중인 회원에게만 주최자를 넘길 수 있습니다.'
            using errcode = '23514';
    end if;

    perform set_config('app.allow_event_organizer_transfer', 'true', true);

    update public.events
    set created_by = p_new_organizer_id
    where id = p_event_id;

    perform set_config('app.allow_event_organizer_transfer', 'false', true);

    if p_leave_current then
        perform public.cancel_event_participation(p_event_id);
    end if;

    return jsonb_build_object(
        'event_id', p_event_id,
        'previous_organizer_id', v_user_id,
        'organizer_id', p_new_organizer_id,
        'left_activity', p_leave_current
    );
end;
$$;

revoke all on function public.cancel_event_participation(bigint)
from public, anon, authenticated;
grant execute on function public.cancel_event_participation(bigint) to authenticated;

revoke all on function public.transfer_event_organizer(bigint, uuid, boolean)
from public, anon, authenticated;
grant execute on function public.transfer_event_organizer(bigint, uuid, boolean) to authenticated;

commit;
