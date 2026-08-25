-- 청파 같이 본 사이트 baseline: 2차 기능: 날짜 투표
-- 원본 schema.sql에서 SQL 의미 변경 없이 섹션별로 분리한 파일입니다.

begin;

-- ============================================================================
-- 5. 2차 기능: 날짜 투표
-- ============================================================================

create table public.date_polls (
    id bigint generated always as identity primary key,
    category_id bigint not null
        references public.activity_categories(id) on delete restrict,
    title text not null
        check (char_length(btrim(title)) between 1 and 150),
    description text not null default ''
        check (char_length(description) <= 3000),
    allow_multiple boolean not null default true,
    closes_at timestamptz not null,
    status text not null default 'open'
        check (status in ('open', 'closed', 'cancelled')),
    selected_option_id bigint,
    result_event_id bigint references public.events(id) on delete set null,
    created_by uuid not null references public.profiles(id) on delete restrict,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.date_poll_options (
    id bigint generated always as identity primary key,
    poll_id bigint not null references public.date_polls(id) on delete cascade,
    option_start timestamptz not null,
    option_end timestamptz,
    label text
        check (label is null or char_length(label) <= 100),
    created_at timestamptz not null default now(),
    unique (id, poll_id),
    unique (poll_id, option_start),
    constraint date_poll_option_time_check
        check (option_end is null or option_end > option_start)
);

-- 선택된 후보가 반드시 같은 투표에 속하도록 복합 외래키로 검증한다.
alter table public.date_polls
    add constraint date_polls_selected_option_fk
    foreign key (selected_option_id, id)
    references public.date_poll_options(id, poll_id)
    on delete restrict;

-- 복수 선택 투표를 지원하므로 사용자는 서로 다른 후보에 각각 한 번 투표할 수 있다.
create table public.date_poll_votes (
    poll_id bigint not null,
    option_id bigint not null,
    user_id uuid not null references public.profiles(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (option_id, user_id),
    foreign key (option_id, poll_id)
        references public.date_poll_options(id, poll_id)
        on delete cascade
);

create index date_polls_status_closes_idx
    on public.date_polls (status, closes_at);

create index date_polls_category_created_idx
    on public.date_polls (category_id, created_at desc);

create index date_polls_creator_idx
    on public.date_polls (created_by, created_at desc);

create index date_polls_result_event_idx
    on public.date_polls (result_event_id)
    where result_event_id is not null;

create index date_polls_selected_option_idx
    on public.date_polls (selected_option_id)
    where selected_option_id is not null;

create index date_poll_options_poll_start_idx
    on public.date_poll_options (poll_id, option_start);

create index date_poll_votes_poll_user_idx
    on public.date_poll_votes (poll_id, user_id);

create index date_poll_votes_user_idx
    on public.date_poll_votes (user_id);

commit;
