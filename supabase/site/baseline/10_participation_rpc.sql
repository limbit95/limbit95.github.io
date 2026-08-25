-- 청파 같이 본 사이트 baseline: 활동 참여·취소 RPC
-- 원본 schema.sql에서 SQL 의미 변경 없이 섹션별로 분리한 파일입니다.

begin;

-- ============================================================================
-- 10. 활동 참여·취소 RPC
-- ============================================================================

-- 활동 행을 FOR UPDATE로 잠근 뒤 현재 참여 인원을 계산한다.
-- 정원이 남으면 joined, 정원이 가득 차면 waitlisted로 저장한다.
-- 동일 사용자의 중복 참여는 복합 PK와 함수 검증으로 이중 방지한다.
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
        raise exception '승인된 회원만 활동에 참여할 수 있습니다.'
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

    if v_event.status <> 'scheduled' then
        raise exception '현재 참여 신청을 받을 수 없는 활동입니다.'
            using errcode = '23514';
    end if;

    if now() > v_event.registration_deadline then
        raise exception '참여 신청이 마감되었습니다.'
            using errcode = '23514';
    end if;

    select ep.status
    into v_existing_status
    from public.event_participants as ep
    where ep.event_id = p_event_id
      and ep.user_id = v_user_id
    for update;

    if found and v_existing_status in ('joined', 'waitlisted') then
        raise exception '이미 참여 또는 대기 신청한 활동입니다.'
            using errcode = '23505';
    end if;

    select count(*)::integer
    into v_joined_count
    from public.event_participants as ep
    where ep.event_id = p_event_id
      and ep.status = 'joined';

    if v_event.capacity is null or v_joined_count < v_event.capacity then
        v_new_status := 'joined';
    else
        v_new_status := 'waitlisted';
    end if;

    insert into public.event_participants (
        event_id,
        user_id,
        status,
        joined_at,
        waitlisted_at,
        cancelled_at
    )
    values (
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

    return v_new_status;
end;
$$;

-- 본인의 참여 또는 대기 신청만 취소할 수 있다.
-- joined 참여자가 취소하면 가장 먼저 대기한 한 명을 같은 트랜잭션에서 승격한다.
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

-- 조회 수는 작성자가 view_count를 직접 수정하지 않고 이 함수로만 증가시킨다.
create or replace function public.increment_post_view(p_post_id bigint)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_view_count bigint;
begin
    if not private.is_approved_member() then
        raise exception '승인된 회원만 게시글을 조회할 수 있습니다.'
            using errcode = '42501';
    end if;

    -- protect_post_privileged_columns Trigger가 이 RPC의 원자적 증가만 허용한다.
    perform set_config('app.allow_post_view_update', 'true', true);

    update public.posts
    set view_count = view_count + 1
    where id = p_post_id
      and status = 'published'
    returning view_count into v_view_count;

    if not found then
        raise exception '게시글을 찾을 수 없습니다.'
            using errcode = 'P0002';
    end if;

    return v_view_count;
end;
$$;

revoke all on function public.join_event(bigint)
    from public, anon, authenticated;
revoke all on function public.cancel_event_participation(bigint)
    from public, anon, authenticated;
revoke all on function public.increment_post_view(bigint)
    from public, anon, authenticated;

grant execute on function public.join_event(bigint) to authenticated;
grant execute on function public.cancel_event_participation(bigint) to authenticated;
grant execute on function public.increment_post_view(bigint) to authenticated;

-- 활동의 핵심 정보가 변경되면 참여자와 대기자에게 사이트 내 알림을 생성한다.
create or replace function private.notify_event_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_type text;
    v_title text;
    v_body text;
begin
    if new.status = 'cancelled' and old.status <> 'cancelled' then
        v_type := 'event_cancelled';
        v_title := '참여 중인 활동이 취소되었어요';
        v_body := format('"%s" 활동이 취소되었습니다.', new.title);
    else
        v_type := 'event_updated';
        v_title := '참여 중인 활동 정보가 변경되었어요';
        v_body := format('"%s" 활동의 일정 또는 안내를 확인해 주세요.', new.title);
    end if;

    insert into public.notifications (
        user_id,
        notification_type,
        title,
        body,
        event_id
    )
    select
        ep.user_id,
        v_type,
        v_title,
        v_body,
        new.id
    from public.event_participants as ep
    where ep.event_id = new.id
      and ep.status in ('joined', 'waitlisted')
      and (
          auth.uid() is null
          or ep.user_id <> auth.uid()
      );

    return new;
end;
$$;

revoke all on function private.notify_event_change()
    from public, anon, authenticated;

create trigger events_notify_participants
after update of
    title,
    description,
    event_date,
    start_time,
    end_time,
    location_name,
    location_url,
    capacity,
    fee_text,
    difficulty,
    preparation,
    participant_notice,
    registration_deadline,
    status
on public.events
for each row
when (
    old.title is distinct from new.title
    or old.description is distinct from new.description
    or old.event_date is distinct from new.event_date
    or old.start_time is distinct from new.start_time
    or old.end_time is distinct from new.end_time
    or old.location_name is distinct from new.location_name
    or old.location_url is distinct from new.location_url
    or old.capacity is distinct from new.capacity
    or old.fee_text is distinct from new.fee_text
    or old.difficulty is distinct from new.difficulty
    or old.preparation is distinct from new.preparation
    or old.participant_notice is distinct from new.participant_notice
    or old.registration_deadline is distinct from new.registration_deadline
    or old.status is distinct from new.status
)
execute function private.notify_event_change();

-- 단일 선택 날짜 투표에서 한 사용자가 여러 후보를 선택하는 것을 방지한다.
create or replace function private.validate_date_poll_vote()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_status text;
    v_closes_at timestamptz;
    v_allow_multiple boolean;
begin
    select p.status, p.closes_at, p.allow_multiple
    into v_status, v_closes_at, v_allow_multiple
    from public.date_polls as p
    where p.id = new.poll_id
    for share;

    if not found then
        raise exception '날짜 투표를 찾을 수 없습니다.'
            using errcode = 'P0002';
    end if;

    if v_status <> 'open' or now() > v_closes_at then
        raise exception '종료된 날짜 투표에는 참여할 수 없습니다.'
            using errcode = '23514';
    end if;

    if not v_allow_multiple
       and exists (
            select 1
            from public.date_poll_votes as v
            where v.poll_id = new.poll_id
              and v.user_id = new.user_id
       )
    then
        raise exception '이 투표에서는 하나의 날짜만 선택할 수 있습니다.'
            using errcode = '23505';
    end if;

    return new;
end;
$$;

revoke all on function private.validate_date_poll_vote()
    from public, anon, authenticated;

create trigger date_poll_votes_validate
before insert on public.date_poll_votes
for each row execute function private.validate_date_poll_vote();

-- 날짜 투표가 종료되면 투표 참여자에게 사이트 내 알림을 생성한다.
create or replace function private.notify_date_poll_closed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if new.status = 'closed' and old.status <> 'closed' then
        insert into public.notifications (
            user_id,
            notification_type,
            title,
            body,
            poll_id,
            event_id
        )
        select distinct
            v.user_id,
            'poll_closed',
            '날짜 투표 결과가 정해졌어요',
            format('"%s" 날짜 투표 결과를 확인해 주세요.', new.title),
            new.id,
            new.result_event_id
        from public.date_poll_votes as v
        where v.poll_id = new.id
          and (
              auth.uid() is null
              or v.user_id <> auth.uid()
          );
    end if;

    return new;
end;
$$;

revoke all on function private.notify_date_poll_closed()
    from public, anon, authenticated;

create trigger date_polls_notify_closed
after update of status on public.date_polls
for each row
when (old.status is distinct from new.status)
execute function private.notify_date_poll_closed();

commit;
