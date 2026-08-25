-- 청파 같이 본 사이트 baseline: 관리자 RPC
-- 원본 schema.sql에서 SQL 의미 변경 없이 섹션별로 분리한 파일입니다.

begin;

-- ============================================================================
-- 9. 관리자 RPC
-- ============================================================================

-- 가입 신청을 승인하며 profiles와 join_requests를 원자적으로 갱신한다.
create or replace function public.admin_approve_join_request(
    p_user_id uuid,
    p_admin_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_admin_id uuid := auth.uid();
    v_request_status text;
begin
    if not private.is_admin() then
        raise exception '관리자만 가입을 승인할 수 있습니다.'
            using errcode = '42501';
    end if;

    select jr.status
    into v_request_status
    from public.join_requests as jr
    where jr.user_id = p_user_id
    for update;

    if not found then
        raise exception '가입 신청을 찾을 수 없습니다.'
            using errcode = 'P0002';
    end if;

    if v_request_status not in ('pending', 'held') then
        raise exception '승인 대기 또는 보류 중인 가입 신청만 승인할 수 있습니다.'
            using errcode = '23514';
    end if;

    update public.profiles
    set status = 'approved',
        approved_at = now(),
        approved_by = v_admin_id
    where id = p_user_id;

    update public.join_requests
    set status = 'approved',
        admin_note = nullif(btrim(p_admin_note), ''),
        reviewed_at = now(),
        reviewed_by = v_admin_id
    where user_id = p_user_id;
end;
$$;

-- 가입 신청을 rejected 또는 held로 처리한다.
create or replace function public.admin_review_join_request(
    p_user_id uuid,
    p_decision text,
    p_admin_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_admin_id uuid := auth.uid();
    v_request_status text;
begin
    if not private.is_admin() then
        raise exception '관리자만 가입 신청을 검토할 수 있습니다.'
            using errcode = '42501';
    end if;

    if p_decision is null or p_decision not in ('rejected', 'held') then
        raise exception '처리 상태는 rejected 또는 held만 가능합니다.'
            using errcode = '22023';
    end if;

    select jr.status
    into v_request_status
    from public.join_requests as jr
    where jr.user_id = p_user_id
    for update;

    if not found then
        raise exception '가입 신청을 찾을 수 없습니다.'
            using errcode = 'P0002';
    end if;

    if v_request_status not in ('pending', 'held') then
        raise exception '승인 대기 또는 보류 중인 가입 신청만 검토할 수 있습니다.'
            using errcode = '23514';
    end if;

    update public.profiles
    set status = case
            when p_decision = 'rejected' then 'rejected'
            else 'pending'
        end,
        approved_at = null,
        approved_by = null
    where id = p_user_id;

    update public.join_requests
    set status = p_decision,
        admin_note = nullif(btrim(p_admin_note), ''),
        reviewed_at = now(),
        reviewed_by = v_admin_id
    where user_id = p_user_id;
end;
$$;

-- 승인 회원의 일반 관리자 권한을 부여하거나 회수한다.
create or replace function public.admin_set_member_role(
    p_user_id uuid,
    p_role text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_current_role text;
    v_current_status text;
    v_admin_count integer;
begin
    if not private.is_admin() then
        raise exception '관리자만 역할을 변경할 수 있습니다.'
            using errcode = '42501';
    end if;

    if p_role is null or p_role not in ('member', 'admin') then
        raise exception '지원하지 않는 역할입니다.'
            using errcode = '22023';
    end if;

    -- 역할 변경과 정지 처리를 같은 잠금 키로 직렬화해 마지막 관리자 보호
    -- 검사가 동시 요청에서도 일관되게 동작하도록 한다.
    perform pg_catalog.pg_advisory_xact_lock(73624721);

    select p.role, p.status
    into v_current_role, v_current_status
    from public.profiles as p
    where p.id = p_user_id
    for update;

    if not found then
        raise exception '회원을 찾을 수 없습니다.'
            using errcode = 'P0002';
    end if;

    if v_current_status <> 'approved' then
        raise exception '승인 회원에게만 관리자 역할을 부여할 수 있습니다.'
            using errcode = '23514';
    end if;

    if v_current_role = 'admin' and p_role = 'member' then
        select count(*)::integer
        into v_admin_count
        from public.profiles as p
        where p.role = 'admin'
          and p.status = 'approved';

        if v_admin_count <= 1 then
            raise exception '마지막 관리자의 권한은 회수할 수 없습니다.'
                using errcode = '23514';
        end if;
    end if;

    update public.profiles
    set role = p_role
    where id = p_user_id;
end;
$$;

-- 기존 회원의 이용 정지 또는 정지 해제를 처리한다.
create or replace function public.admin_set_member_status(
    p_user_id uuid,
    p_status text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_role text;
    v_current_status text;
    v_admin_count integer;
begin
    if not private.is_admin() then
        raise exception '관리자만 회원 상태를 변경할 수 있습니다.'
            using errcode = '42501';
    end if;

    if p_status is null or p_status not in ('approved', 'suspended') then
        raise exception '회원 상태는 approved 또는 suspended만 가능합니다.'
            using errcode = '22023';
    end if;

    perform pg_catalog.pg_advisory_xact_lock(73624721);

    select p.role, p.status
    into v_role, v_current_status
    from public.profiles as p
    where p.id = p_user_id
    for update;

    if not found then
        raise exception '회원을 찾을 수 없습니다.'
            using errcode = 'P0002';
    end if;

    if v_current_status not in ('approved', 'suspended') then
        raise exception '가입 승인 전 상태는 가입 신청 관리 RPC로 처리해야 합니다.'
            using errcode = '23514';
    end if;

    if v_role = 'admin'
       and v_current_status = 'approved'
       and p_status = 'suspended'
    then
        select count(*)::integer
        into v_admin_count
        from public.profiles as p
        where p.role = 'admin'
          and p.status = 'approved';

        if v_admin_count <= 1 then
            raise exception '마지막 관리자는 이용 정지할 수 없습니다.'
                using errcode = '23514';
        end if;
    end if;

    update public.profiles
    set status = p_status,
        approved_at = case
            when p_status = 'approved' then coalesce(approved_at, now())
            else approved_at
        end,
        approved_by = case
            when p_status = 'approved' then coalesce(approved_by, auth.uid())
            else approved_by
        end
    where id = p_user_id;
end;
$$;

-- 카테고리별 활동 담당자 권한을 부여하거나 해제한다.
create or replace function public.admin_set_category_manager(
    p_user_id uuid,
    p_category_id bigint,
    p_enabled boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    if not private.is_admin() then
        raise exception '관리자만 활동 담당자를 변경할 수 있습니다.'
            using errcode = '42501';
    end if;

    if p_enabled is null then
        raise exception '담당자 권한 적용 여부가 필요합니다.'
            using errcode = '22023';
    end if;

    if p_enabled then
        if not exists (
            select 1
            from public.profiles as p
            where p.id = p_user_id
              and p.status = 'approved'
        ) then
            raise exception '승인 회원만 활동 담당자로 지정할 수 있습니다.'
                using errcode = '23514';
        end if;

        if not exists (
            select 1
            from public.activity_categories as c
            where c.id = p_category_id
              and c.is_active = true
        ) then
            raise exception '활성화된 카테고리를 찾을 수 없습니다.'
                using errcode = 'P0002';
        end if;

        insert into public.category_managers (
            category_id,
            user_id,
            created_by
        )
        values (
            p_category_id,
            p_user_id,
            auth.uid()
        )
        on conflict (category_id, user_id) do nothing;
    else
        delete from public.category_managers
        where category_id = p_category_id
          and user_id = p_user_id;
    end if;
end;
$$;

-- 관리자 RPC의 기본 공개 실행 권한을 모두 제거한다.
revoke all on function public.admin_approve_join_request(uuid, text)
    from public, anon, authenticated;
revoke all on function public.admin_review_join_request(uuid, text, text)
    from public, anon, authenticated;
revoke all on function public.admin_set_member_role(uuid, text)
    from public, anon, authenticated;
revoke all on function public.admin_set_member_status(uuid, text)
    from public, anon, authenticated;
revoke all on function public.admin_set_category_manager(uuid, bigint, boolean)
    from public, anon, authenticated;

grant execute on function public.admin_approve_join_request(uuid, text)
    to authenticated;
grant execute on function public.admin_review_join_request(uuid, text, text)
    to authenticated;
grant execute on function public.admin_set_member_role(uuid, text)
    to authenticated;
grant execute on function public.admin_set_member_status(uuid, text)
    to authenticated;
grant execute on function public.admin_set_category_manager(uuid, bigint, boolean)
    to authenticated;

-- 승인 회원에게는 공개 가능한 프로필 필드만 반환한다.
-- 정확한 출생연도는 age_visibility 설정이 birth_year인 경우에만 노출한다.
create or replace function public.get_public_member_profiles(
    p_user_id uuid default null
)
returns table (
    id uuid,
    display_name text,
    birth_year integer,
    age_group text,
    bio text,
    avatar_path text,
    created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
    if not private.is_approved_member() then
        raise exception '승인된 회원만 회원 프로필을 조회할 수 있습니다.'
            using errcode = '42501';
    end if;

    return query
    select
        p.id,
        p.display_name,
        case
            when p.age_visibility = 'birth_year' then p.birth_year
            else null
        end as birth_year,
        case
            when p.age_visibility = 'age_group' and p.birth_year is not null
                then (
                    ((extract(year from current_date)::integer - p.birth_year) / 10) * 10
                )::text || '대'
            else null
        end as age_group,
        p.bio,
        p.avatar_path,
        p.created_at
    from public.profiles as p
    where p.status = 'approved'
      and (p_user_id is null or p.id = p_user_id)
    order by p.display_name, p.id;
end;
$$;

revoke all on function public.get_public_member_profiles(uuid)
    from public, anon, authenticated;
grant execute on function public.get_public_member_profiles(uuid)
    to authenticated;

-- 활동 카드와 마이페이지가 PostgREST 중첩 행 제한의 영향을 받지 않고
-- 정확한 참여·대기 인원과 본인 상태를 조회하도록 집계 결과만 반환한다.
create or replace function public.get_event_participation_summaries(
    p_event_ids bigint[]
)
returns table (
    event_id bigint,
    joined_count bigint,
    waitlisted_count bigint,
    my_status text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
    if not private.is_approved_member() then
        raise exception '승인된 회원만 참여 현황을 조회할 수 있습니다.'
            using errcode = '42501';
    end if;

    return query
    with requested_events as (
        select distinct requested_id as event_id
        from pg_catalog.unnest(
            coalesce(p_event_ids, array[]::bigint[])
        ) as requested_id
    )
    select
        requested.event_id,
        count(*) filter (where ep.status = 'joined')::bigint
            as joined_count,
        count(*) filter (where ep.status = 'waitlisted')::bigint
            as waitlisted_count,
        max(ep.status) filter (
            where ep.user_id = (select auth.uid())
        ) as my_status
    from requested_events as requested
    join public.events as e on e.id = requested.event_id
    left join public.event_participants as ep
        on ep.event_id = requested.event_id
    group by requested.event_id
    order by requested.event_id;
end;
$$;

revoke all on function public.get_event_participation_summaries(bigint[])
    from public, anon, authenticated;
grant execute on function public.get_event_participation_summaries(bigint[])
    to authenticated;

commit;
