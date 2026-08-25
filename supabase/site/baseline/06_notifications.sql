-- 청파 같이 본 사이트 baseline: 2차 기능: 사이트 내 활동 변경 알림
-- 원본 schema.sql에서 SQL 의미 변경 없이 섹션별로 분리한 파일입니다.

begin;

-- ============================================================================
-- 6. 2차 기능: 사이트 내 활동 변경 알림
-- ============================================================================

create table public.notifications (
    id bigint generated always as identity primary key,
    user_id uuid not null references public.profiles(id) on delete cascade,
    notification_type text not null
        check (
            notification_type in (
                'event_updated',
                'event_cancelled',
                'waitlist_promoted',
                'poll_closed'
            )
        ),
    title text not null
        check (char_length(btrim(title)) between 1 and 200),
    body text not null
        check (char_length(body) <= 1000),
    event_id bigint references public.events(id) on delete cascade,
    poll_id bigint references public.date_polls(id) on delete cascade,
    is_read boolean not null default false,
    read_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint notification_read_state_check check (
        (is_read = true and read_at is not null)
        or
        (is_read = false and read_at is null)
    ),
    constraint notification_target_check check (
        event_id is not null or poll_id is not null
    )
);

create index notifications_user_unread_idx
    on public.notifications (user_id, is_read, created_at desc);

create index notifications_event_idx
    on public.notifications (event_id, created_at desc)
    where event_id is not null;

create index notifications_poll_idx
    on public.notifications (poll_id, created_at desc)
    where poll_id is not null;

commit;
