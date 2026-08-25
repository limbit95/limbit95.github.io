-- 청파 같이 본 사이트 baseline: 반복 일정과 개별 활동 일정
-- 원본 schema.sql에서 SQL 의미 변경 없이 섹션별로 분리한 파일입니다.

begin;

-- ============================================================================
-- 3. 반복 일정과 개별 활동 일정
-- ============================================================================

-- 반복 일정의 공통 원본이다.
-- recurrence_rule에는 RFC 5545 RRULE 형식의 규칙 문자열을 저장한다.
create table public.event_series (
    id bigint generated always as identity primary key,
    category_id bigint not null
        references public.activity_categories(id) on delete restrict,
    title text not null
        check (char_length(btrim(title)) between 1 and 150),
    description text not null
        check (char_length(btrim(description)) between 1 and 5000),
    start_date date not null,
    end_date date,
    start_time time not null,
    end_time time,
    timezone text not null default 'Asia/Seoul'
        check (timezone = 'Asia/Seoul'),
    recurrence_rule text not null
        check (char_length(btrim(recurrence_rule)) between 1 and 500),
    location_name text not null
        check (char_length(btrim(location_name)) between 1 and 200),
    location_url text,
    capacity integer
        check (capacity is null or capacity > 0),
    fee_text text not null default '무료'
        check (char_length(fee_text) <= 200),
    difficulty text
        check (difficulty is null or char_length(difficulty) <= 100),
    preparation text not null default ''
        check (char_length(preparation) <= 1000),
    beginner_friendly boolean not null default true,
    participant_notice text not null default ''
        check (char_length(participant_notice) <= 2000),
    status text not null default 'active'
        check (status in ('active', 'paused', 'completed', 'cancelled')),
    created_by uuid not null references public.profiles(id) on delete restrict,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint event_series_date_range_check
        check (end_date is null or end_date >= start_date),
    constraint event_series_time_range_check
        check (end_time is null or end_time > start_time)
);

create table public.events (
    id bigint generated always as identity primary key,
    series_id bigint references public.event_series(id) on delete set null,
    category_id bigint not null
        references public.activity_categories(id) on delete restrict,
    title text not null
        check (char_length(btrim(title)) between 1 and 150),
    description text not null
        check (char_length(btrim(description)) between 1 and 5000),
    event_date date not null,
    start_time time not null,
    end_time time,
    location_name text not null
        check (char_length(btrim(location_name)) between 1 and 200),
    location_url text,
    capacity integer
        check (capacity is null or capacity > 0),
    fee_text text not null default '무료'
        check (char_length(fee_text) <= 200),
    difficulty text
        check (difficulty is null or char_length(difficulty) <= 100),
    preparation text not null default ''
        check (char_length(preparation) <= 1000),
    beginner_friendly boolean not null default true,
    participant_notice text not null default ''
        check (char_length(participant_notice) <= 2000),
    registration_deadline timestamptz not null,
    status text not null default 'scheduled'
        check (status in ('scheduled', 'closed', 'completed', 'cancelled')),
    created_by uuid not null references public.profiles(id) on delete restrict,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint events_time_range_check
        check (end_time is null or end_time > start_time)
);

-- 한 사용자는 한 활동에 한 행만 가질 수 있다.
-- 취소 후 재참여할 때에는 기존 행의 상태를 RPC가 변경한다.
create table public.event_participants (
    event_id bigint not null references public.events(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    status text not null
        check (status in ('joined', 'cancelled', 'waitlisted')),
    joined_at timestamptz,
    waitlisted_at timestamptz,
    cancelled_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (event_id, user_id),
    constraint event_participant_timestamp_check check (
        (status = 'joined' and joined_at is not null and cancelled_at is null)
        or
        (status = 'waitlisted' and waitlisted_at is not null and cancelled_at is null)
        or
        (status = 'cancelled' and cancelled_at is not null)
    )
);

create index event_series_category_status_idx
    on public.event_series (category_id, status, start_date);

create index event_series_creator_idx
    on public.event_series (created_by, created_at desc);

create index events_upcoming_idx
    on public.events (event_date, start_time)
    where status in ('scheduled', 'closed');

create index events_category_date_idx
    on public.events (category_id, event_date, start_time);

create index events_creator_idx
    on public.events (created_by, created_at desc);

-- 활동 제목 검색은 프론트엔드의 textSearch(simple) 조건과 같은 표현식을 쓴다.
create index events_title_search_idx
    on public.events using gin (to_tsvector('simple', title));

create unique index events_series_occurrence_uidx
    on public.events (series_id, event_date, start_time)
    where series_id is not null;

create index event_participants_event_status_idx
    on public.event_participants (event_id, status, waitlisted_at, joined_at);

create index event_participants_user_status_idx
    on public.event_participants (user_id, status, event_id);

commit;
