-- 청파 같이 본 사이트 baseline: 공통 Trigger 함수와 권한 보호 Trigger
-- 원본 schema.sql에서 SQL 의미 변경 없이 섹션별로 분리한 파일입니다.

begin;

-- ============================================================================
-- 7. 공통 Trigger 함수와 권한 보호 Trigger
-- ============================================================================

-- updated_at 컬럼을 UPDATE 시점에 자동 갱신한다.
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at := now();
    return new;
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger join_requests_set_updated_at
before update on public.join_requests
for each row execute function private.set_updated_at();

create trigger activity_categories_set_updated_at
before update on public.activity_categories
for each row execute function private.set_updated_at();

create trigger event_series_set_updated_at
before update on public.event_series
for each row execute function private.set_updated_at();

create trigger events_set_updated_at
before update on public.events
for each row execute function private.set_updated_at();

create trigger event_participants_set_updated_at
before update on public.event_participants
for each row execute function private.set_updated_at();

create trigger posts_set_updated_at
before update on public.posts
for each row execute function private.set_updated_at();

create trigger comments_set_updated_at
before update on public.comments
for each row execute function private.set_updated_at();

create trigger date_polls_set_updated_at
before update on public.date_polls
for each row execute function private.set_updated_at();

create trigger notifications_set_updated_at
before update on public.notifications
for each row execute function private.set_updated_at();

-- --------------------------------------------------------------------------
-- RLS에서 사용하는 세 가지 핵심 Helper Function
-- SECURITY DEFINER 함수는 빈 search_path를 사용하고 모든 객체를 스키마로 한정한다.
-- --------------------------------------------------------------------------

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.profiles as p
        where p.id = (select auth.uid())
          and p.role = 'admin'
          and p.status = 'approved'
    );
$$;

create or replace function private.is_approved_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.profiles as p
        where p.id = (select auth.uid())
          and p.status = 'approved'
    );
$$;

create or replace function private.is_category_manager(p_category_id bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.category_managers as cm
        join public.profiles as p on p.id = cm.user_id
        join public.activity_categories as c on c.id = cm.category_id
        where cm.category_id = p_category_id
          and cm.user_id = (select auth.uid())
          and p.status = 'approved'
          and c.is_active = true
    );
$$;

revoke all on function private.is_admin() from public, anon, authenticated;
revoke all on function private.is_approved_member() from public, anon, authenticated;
revoke all on function private.is_category_manager(bigint)
    from public, anon, authenticated;

-- RLS 정책 실행에 필요한 최소 권한만 authenticated 역할에 부여한다.
grant execute on function private.is_admin() to authenticated;
grant execute on function private.is_approved_member() to authenticated;
grant execute on function private.is_category_manager(bigint) to authenticated;

-- 일반 사용자가 본인 프로필을 수정하면서 role, status 등 권한 컬럼을
-- 함께 변경하는 것을 RLS와 별도로 한 번 더 차단한다.
create or replace function private.protect_profile_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if auth.uid() is not null and not private.is_admin() then
        if new.role is distinct from old.role
           or new.status is distinct from old.status
           or new.approved_at is distinct from old.approved_at
           or new.approved_by is distinct from old.approved_by
           or new.created_at is distinct from old.created_at
        then
            raise exception '권한 또는 승인 상태 컬럼은 변경할 수 없습니다.'
                using errcode = '42501';
        end if;
    end if;

    return new;
end;
$$;

revoke all on function private.protect_profile_privileged_columns()
    from public, anon, authenticated;

create trigger profiles_protect_privileged_columns
before update on public.profiles
for each row execute function private.protect_profile_privileged_columns();

-- 일반 작성자가 게시판 종류, 작성자, 공지 고정 여부, 조회 수를 조작하지 못하게 한다.
create or replace function private.protect_post_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if auth.uid() is not null and not private.is_admin() then
        if new.board_type is distinct from old.board_type
           or new.author_id is distinct from old.author_id
           or new.is_pinned is distinct from old.is_pinned
           or new.is_important is distinct from old.is_important
           or (
                new.view_count is distinct from old.view_count
                and coalesce(
                    current_setting('app.allow_post_view_update', true),
                    'false'
                ) <> 'true'
           )
           or new.created_at is distinct from old.created_at
        then
            raise exception '게시글의 관리 전용 컬럼은 변경할 수 없습니다.'
                using errcode = '42501';
        end if;
    end if;

    return new;
end;
$$;

revoke all on function private.protect_post_privileged_columns()
    from public, anon, authenticated;

create trigger posts_protect_privileged_columns
before update on public.posts
for each row execute function private.protect_post_privileged_columns();

-- 댓글 작성자가 대상이나 작성자 ID를 다른 값으로 바꾸지 못하게 한다.
create or replace function private.protect_comment_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if auth.uid() is not null and not private.is_admin() then
        if new.target_type is distinct from old.target_type
           or new.target_id is distinct from old.target_id
           or new.author_id is distinct from old.author_id
           or new.created_at is distinct from old.created_at
        then
            raise exception '댓글의 작성자 또는 대상은 변경할 수 없습니다.'
                using errcode = '42501';
        end if;
    end if;

    return new;
end;
$$;

revoke all on function private.protect_comment_identity()
    from public, anon, authenticated;

create trigger comments_protect_identity
before update on public.comments
for each row execute function private.protect_comment_identity();

-- 댓글의 다형 대상이 실제로 존재하는지 검증한다.
create or replace function private.validate_comment_target()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if new.target_type = 'post' then
        if not exists (
            select 1
            from public.posts as p
            where p.id = new.target_id
              and p.status = 'published'
        ) then
            raise exception '댓글 대상 게시글이 존재하지 않습니다.'
                using errcode = '23503';
        end if;
    elsif new.target_type = 'event' then
        if not exists (
            select 1
            from public.events as e
            where e.id = new.target_id
        ) then
            raise exception '댓글 대상 활동이 존재하지 않습니다.'
                using errcode = '23503';
        end if;
    else
        raise exception '지원하지 않는 댓글 대상입니다.'
            using errcode = '23514';
    end if;

    return new;
end;
$$;

revoke all on function private.validate_comment_target()
    from public, anon, authenticated;

create trigger comments_validate_target
before insert or update of target_type, target_id on public.comments
for each row execute function private.validate_comment_target();

-- 다형 관계는 FK의 ON DELETE CASCADE를 사용할 수 없으므로 대상 삭제 시
-- 연결 댓글을 같은 트랜잭션에서 정리한다.
create or replace function private.delete_polymorphic_comments()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    delete from public.comments
    where target_type = case
            when tg_table_name = 'posts' then 'post'
            else 'event'
        end
      and target_id = old.id;

    return old;
end;
$$;

revoke all on function private.delete_polymorphic_comments()
    from public, anon, authenticated;

create trigger posts_delete_comments
after delete on public.posts
for each row execute function private.delete_polymorphic_comments();

create trigger events_delete_comments
after delete on public.events
for each row execute function private.delete_polymorphic_comments();

-- 신청 마감이 활동 시작 이후로 설정되는 것을 방지한다.
create or replace function private.validate_event_schedule()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
    v_event_start timestamptz;
begin
    v_event_start :=
        (new.event_date + new.start_time) at time zone 'Asia/Seoul';

    if new.registration_deadline > v_event_start then
        raise exception '참여 신청 마감은 활동 시작 시각보다 늦을 수 없습니다.'
            using errcode = '23514';
    end if;

    if new.series_id is not null
       and not exists (
            select 1
            from public.event_series as s
            where s.id = new.series_id
              and s.category_id = new.category_id
       )
    then
        raise exception '반복 일정과 개별 활동의 카테고리가 일치하지 않습니다.'
            using errcode = '23514';
    end if;

    return new;
end;
$$;

revoke all on function private.validate_event_schedule()
    from public, anon, authenticated;

create trigger events_validate_schedule
before insert or update of
    event_date, start_time, registration_deadline, series_id, category_id
on public.events
for each row execute function private.validate_event_schedule();

-- 참여자가 있는 활동의 정원을 현재 참여 인원보다 작게 낮추지 못하게 한다.
create or replace function private.prevent_capacity_underflow()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_joined_count integer;
begin
    if new.capacity is not null
       and new.capacity is distinct from old.capacity
    then
        select count(*)::integer
        into v_joined_count
        from public.event_participants as ep
        where ep.event_id = old.id
          and ep.status = 'joined';

        if v_joined_count > new.capacity then
            raise exception '현재 참여 인원보다 정원을 작게 변경할 수 없습니다.'
                using errcode = '23514';
        end if;
    end if;

    return new;
end;
$$;

revoke all on function private.prevent_capacity_underflow()
    from public, anon, authenticated;

create trigger events_prevent_capacity_underflow
before update of capacity on public.events
for each row execute function private.prevent_capacity_underflow();

commit;
