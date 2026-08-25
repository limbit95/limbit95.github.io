-- 청파 같이 본 사이트 baseline: 테이블 권한과 Row Level Security
-- 원본 schema.sql에서 SQL 의미 변경 없이 섹션별로 분리한 파일입니다.

begin;

-- ============================================================================
-- 11. 테이블 권한과 Row Level Security
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.join_requests enable row level security;
alter table public.activity_categories enable row level security;
alter table public.profile_interests enable row level security;
alter table public.category_managers enable row level security;
alter table public.event_series enable row level security;
alter table public.events enable row level security;
alter table public.event_participants enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.date_polls enable row level security;
alter table public.date_poll_options enable row level security;
alter table public.date_poll_votes enable row level security;
alter table public.notifications enable row level security;

-- Supabase의 기본 권한 상태에 의존하지 않고 프로젝트 테이블별 권한을 명시한다.
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.join_requests from anon, authenticated;
revoke all on table public.activity_categories from anon, authenticated;
revoke all on table public.profile_interests from anon, authenticated;
revoke all on table public.category_managers from anon, authenticated;
revoke all on table public.event_series from anon, authenticated;
revoke all on table public.events from anon, authenticated;
revoke all on table public.event_participants from anon, authenticated;
revoke all on table public.posts from anon, authenticated;
revoke all on table public.comments from anon, authenticated;
revoke all on table public.date_polls from anon, authenticated;
revoke all on table public.date_poll_options from anon, authenticated;
revoke all on table public.date_poll_votes from anon, authenticated;
revoke all on table public.notifications from anon, authenticated;

grant select, update on table public.profiles to authenticated;
grant select, update on table public.join_requests to authenticated;
grant select, insert, update, delete
    on table public.activity_categories to authenticated;
grant select, insert, delete
    on table public.profile_interests to authenticated;
grant select, insert, update, delete
    on table public.category_managers to authenticated;
grant select, insert, update, delete
    on table public.event_series to authenticated;
grant select, insert, update, delete
    on table public.events to authenticated;

-- 참여 정보는 SELECT만 직접 허용하고 모든 쓰기는 join_event /
-- cancel_event_participation RPC를 통해 수행한다.
grant select on table public.event_participants to authenticated;

grant select, insert, update, delete
    on table public.posts to authenticated;
grant select, insert, update, delete
    on table public.comments to authenticated;
grant select, insert, update, delete
    on table public.date_polls to authenticated;
grant select, insert, update, delete
    on table public.date_poll_options to authenticated;
grant select, insert, delete
    on table public.date_poll_votes to authenticated;
grant select on table public.notifications to authenticated;
grant update (is_read, read_at)
    on table public.notifications to authenticated;

grant usage, select on sequence public.activity_categories_id_seq
    to authenticated;
grant usage, select on sequence public.event_series_id_seq
    to authenticated;
grant usage, select on sequence public.events_id_seq
    to authenticated;
grant usage, select on sequence public.posts_id_seq
    to authenticated;
grant usage, select on sequence public.comments_id_seq
    to authenticated;
grant usage, select on sequence public.date_polls_id_seq
    to authenticated;
grant usage, select on sequence public.date_poll_options_id_seq
    to authenticated;
grant usage, select on sequence public.notifications_id_seq
    to authenticated;

-- --------------------------------------------------------------------------
-- profiles
-- --------------------------------------------------------------------------

-- 모든 사용자는 자신의 원본 프로필만 보고 관리자는 전체 원본 프로필을 본다.
-- 다른 회원의 공개 프로필은 get_public_member_profiles RPC를 사용한다.
create policy profiles_select_policy
on public.profiles
for select
to authenticated
using (
    id = (select auth.uid())
    or private.is_admin()
);

-- 본인 프로필 또는 관리자가 수정할 수 있다.
-- 비관리자의 role/status 변경은 별도 Trigger가 차단한다.
create policy profiles_update_policy
on public.profiles
for update
to authenticated
using (
    id = (select auth.uid())
    or private.is_admin()
)
with check (
    id = (select auth.uid())
    or private.is_admin()
);

-- profiles INSERT는 Auth Trigger 전용이며 브라우저 INSERT 정책은 두지 않는다.
-- 계정 삭제도 Auth 관리 절차를 통해 처리하므로 DELETE 정책을 두지 않는다.

-- --------------------------------------------------------------------------
-- join_requests
-- --------------------------------------------------------------------------

create policy join_requests_select_policy
on public.join_requests
for select
to authenticated
using (
    user_id = (select auth.uid())
    or private.is_admin()
);

-- 관리자만 가입 신청 상태와 메모를 수정할 수 있다.
create policy join_requests_update_policy
on public.join_requests
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

-- INSERT는 Auth Trigger가, 승인·거절·보류는 관리자 RPC가 수행한다.
-- 일반 사용자를 위한 INSERT/DELETE 정책은 의도적으로 두지 않는다.

-- --------------------------------------------------------------------------
-- activity_categories
-- --------------------------------------------------------------------------

create policy activity_categories_select_policy
on public.activity_categories
for select
to authenticated
using (private.is_approved_member());

create policy activity_categories_insert_policy
on public.activity_categories
for insert
to authenticated
with check (private.is_admin());

create policy activity_categories_update_policy
on public.activity_categories
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy activity_categories_delete_policy
on public.activity_categories
for delete
to authenticated
using (private.is_admin());

-- --------------------------------------------------------------------------
-- profile_interests
-- --------------------------------------------------------------------------

create policy profile_interests_select_policy
on public.profile_interests
for select
to authenticated
using (private.is_approved_member());

create policy profile_interests_insert_policy
on public.profile_interests
for insert
to authenticated
with check (
    private.is_approved_member()
    and (
        user_id = (select auth.uid())
        or private.is_admin()
    )
);

create policy profile_interests_delete_policy
on public.profile_interests
for delete
to authenticated
using (
    private.is_approved_member()
    and (
        user_id = (select auth.uid())
        or private.is_admin()
    )
);

-- 복합키 매핑은 삭제 후 재등록하므로 UPDATE 정책을 두지 않는다.

-- --------------------------------------------------------------------------
-- category_managers
-- --------------------------------------------------------------------------

create policy category_managers_select_policy
on public.category_managers
for select
to authenticated
using (private.is_approved_member());

create policy category_managers_insert_policy
on public.category_managers
for insert
to authenticated
with check (
    private.is_admin()
    and created_by = (select auth.uid())
);

create policy category_managers_update_policy
on public.category_managers
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy category_managers_delete_policy
on public.category_managers
for delete
to authenticated
using (private.is_admin());

-- --------------------------------------------------------------------------
-- event_series
-- --------------------------------------------------------------------------

create policy event_series_select_policy
on public.event_series
for select
to authenticated
using (private.is_approved_member());

create policy event_series_insert_policy
on public.event_series
for insert
to authenticated
with check (
    private.is_approved_member()
    and created_by = (select auth.uid())
    and (
        private.is_admin()
        or private.is_category_manager(category_id)
    )
);

create policy event_series_update_policy
on public.event_series
for update
to authenticated
using (
    private.is_approved_member()
    and (
        private.is_admin()
        or private.is_category_manager(category_id)
    )
)
with check (
    private.is_approved_member()
    and (
        private.is_admin()
        or private.is_category_manager(category_id)
    )
);

create policy event_series_delete_policy
on public.event_series
for delete
to authenticated
using (private.is_admin());

-- --------------------------------------------------------------------------
-- events
-- --------------------------------------------------------------------------

create policy events_select_policy
on public.events
for select
to authenticated
using (private.is_approved_member());

create policy events_insert_policy
on public.events
for insert
to authenticated
with check (
    private.is_approved_member()
    and created_by = (select auth.uid())
    and (
        private.is_admin()
        or private.is_category_manager(category_id)
    )
);

create policy events_update_policy
on public.events
for update
to authenticated
using (
    private.is_approved_member()
    and (
        private.is_admin()
        or private.is_category_manager(category_id)
    )
)
with check (
    private.is_approved_member()
    and (
        private.is_admin()
        or private.is_category_manager(category_id)
    )
);

create policy events_delete_policy
on public.events
for delete
to authenticated
using (private.is_admin());

-- --------------------------------------------------------------------------
-- event_participants
-- --------------------------------------------------------------------------

create policy event_participants_select_policy
on public.event_participants
for select
to authenticated
using (private.is_approved_member());

-- 정원과 중복 검사를 우회하지 못하도록 브라우저 INSERT/UPDATE/DELETE
-- 정책과 테이블 권한을 모두 두지 않는다. 쓰기는 RPC만 가능하다.

-- --------------------------------------------------------------------------
-- posts
-- --------------------------------------------------------------------------

create policy posts_select_policy
on public.posts
for select
to authenticated
using (
    private.is_approved_member()
    and (
        status = 'published'
        or author_id = (select auth.uid())
        or private.is_admin()
    )
);

create policy posts_insert_policy
on public.posts
for insert
to authenticated
with check (
    private.is_approved_member()
    and author_id = (select auth.uid())
    and status = 'published'
    and (
        (
            board_type = 'free'
            and (
                private.is_admin()
                or (is_pinned = false and is_important = false)
            )
        )
        or
        (
            board_type = 'notice'
            and private.is_admin()
        )
    )
);

create policy posts_update_policy
on public.posts
for update
to authenticated
using (
    private.is_admin()
    or (
        private.is_approved_member()
        and board_type = 'free'
        and author_id = (select auth.uid())
    )
)
with check (
    private.is_admin()
    or (
        private.is_approved_member()
        and board_type = 'free'
        and author_id = (select auth.uid())
    )
);

create policy posts_delete_policy
on public.posts
for delete
to authenticated
using (
    private.is_admin()
    or (
        private.is_approved_member()
        and board_type = 'free'
        and author_id = (select auth.uid())
    )
);

-- --------------------------------------------------------------------------
-- comments
-- --------------------------------------------------------------------------

create policy comments_select_policy
on public.comments
for select
to authenticated
using (
    private.is_approved_member()
    and (
        status = 'published'
        or author_id = (select auth.uid())
        or private.is_admin()
    )
);

create policy comments_insert_policy
on public.comments
for insert
to authenticated
with check (
    private.is_approved_member()
    and author_id = (select auth.uid())
    and status = 'published'
);

create policy comments_update_policy
on public.comments
for update
to authenticated
using (
    private.is_admin()
    or (
        private.is_approved_member()
        and author_id = (select auth.uid())
    )
)
with check (
    private.is_admin()
    or (
        private.is_approved_member()
        and author_id = (select auth.uid())
    )
);

create policy comments_delete_policy
on public.comments
for delete
to authenticated
using (
    private.is_admin()
    or (
        private.is_approved_member()
        and author_id = (select auth.uid())
    )
);

-- --------------------------------------------------------------------------
-- date_polls
-- --------------------------------------------------------------------------

create policy date_polls_select_policy
on public.date_polls
for select
to authenticated
using (private.is_approved_member());

create policy date_polls_insert_policy
on public.date_polls
for insert
to authenticated
with check (
    private.is_approved_member()
    and created_by = (select auth.uid())
    and (
        private.is_admin()
        or private.is_category_manager(category_id)
    )
);

create policy date_polls_update_policy
on public.date_polls
for update
to authenticated
using (
    private.is_approved_member()
    and (
        private.is_admin()
        or private.is_category_manager(category_id)
    )
)
with check (
    private.is_approved_member()
    and (
        private.is_admin()
        or private.is_category_manager(category_id)
    )
);

create policy date_polls_delete_policy
on public.date_polls
for delete
to authenticated
using (
    private.is_approved_member()
    and (
        private.is_admin()
        or private.is_category_manager(category_id)
    )
);

-- --------------------------------------------------------------------------
-- date_poll_options
-- --------------------------------------------------------------------------

create policy date_poll_options_select_policy
on public.date_poll_options
for select
to authenticated
using (private.is_approved_member());

create policy date_poll_options_insert_policy
on public.date_poll_options
for insert
to authenticated
with check (
    private.is_approved_member()
    and exists (
        select 1
        from public.date_polls as p
        where p.id = poll_id
          and (
              private.is_admin()
              or private.is_category_manager(p.category_id)
          )
    )
);

create policy date_poll_options_update_policy
on public.date_poll_options
for update
to authenticated
using (
    private.is_approved_member()
    and exists (
        select 1
        from public.date_polls as p
        where p.id = poll_id
          and (
              private.is_admin()
              or private.is_category_manager(p.category_id)
          )
    )
)
with check (
    private.is_approved_member()
    and exists (
        select 1
        from public.date_polls as p
        where p.id = poll_id
          and (
              private.is_admin()
              or private.is_category_manager(p.category_id)
          )
    )
);

create policy date_poll_options_delete_policy
on public.date_poll_options
for delete
to authenticated
using (
    private.is_approved_member()
    and exists (
        select 1
        from public.date_polls as p
        where p.id = poll_id
          and (
              private.is_admin()
              or private.is_category_manager(p.category_id)
          )
    )
);

-- --------------------------------------------------------------------------
-- date_poll_votes
-- --------------------------------------------------------------------------

create policy date_poll_votes_select_policy
on public.date_poll_votes
for select
to authenticated
using (private.is_approved_member());

create policy date_poll_votes_insert_policy
on public.date_poll_votes
for insert
to authenticated
with check (
    private.is_approved_member()
    and user_id = (select auth.uid())
    and exists (
        select 1
        from public.date_polls as p
        where p.id = poll_id
          and p.status = 'open'
          and now() <= p.closes_at
    )
);

create policy date_poll_votes_delete_policy
on public.date_poll_votes
for delete
to authenticated
using (
    private.is_admin()
    or (
        private.is_approved_member()
        and user_id = (select auth.uid())
    )
);

-- 투표 변경은 기존 표를 삭제한 뒤 새 표를 등록하므로 UPDATE 정책을 두지 않는다.

-- --------------------------------------------------------------------------
-- notifications
-- --------------------------------------------------------------------------

create policy notifications_select_policy
on public.notifications
for select
to authenticated
using (
    private.is_approved_member()
    and user_id = (select auth.uid())
);

create policy notifications_update_policy
on public.notifications
for update
to authenticated
using (
    private.is_approved_member()
    and user_id = (select auth.uid())
)
with check (
    private.is_approved_member()
    and user_id = (select auth.uid())
);

-- 알림 INSERT는 DB Trigger/RPC만 수행하며 사용자는 삭제할 수 없다.

-- 작성자 ID와 생성일은 일반 활동 담당자가 수정할 수 없다.
create or replace function private.protect_creator_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if auth.uid() is not null and not private.is_admin() then
        if new.created_by is distinct from old.created_by
           or new.created_at is distinct from old.created_at
        then
            raise exception '작성자와 생성일은 변경할 수 없습니다.'
                using errcode = '42501';
        end if;
    end if;

    return new;
end;
$$;

revoke all on function private.protect_creator_identity()
    from public, anon, authenticated;

create trigger event_series_protect_creator
before update on public.event_series
for each row execute function private.protect_creator_identity();

create trigger events_protect_creator
before update on public.events
for each row execute function private.protect_creator_identity();

create trigger date_polls_protect_creator
before update on public.date_polls
for each row execute function private.protect_creator_identity();

commit;
