-- 청파 같이 본 사이트 baseline: 게시판과 댓글
-- 원본 schema.sql에서 SQL 의미 변경 없이 섹션별로 분리한 파일입니다.

begin;

-- ============================================================================
-- 4. 게시판과 댓글
-- ============================================================================

create table public.posts (
    id bigint generated always as identity primary key,
    board_type text not null
        check (board_type in ('notice', 'free')),
    title text not null
        check (char_length(btrim(title)) between 1 and 200),
    content text not null
        check (char_length(btrim(content)) between 1 and 20000),
    author_id uuid not null references public.profiles(id) on delete restrict,
    is_pinned boolean not null default false,
    is_important boolean not null default false,
    view_count bigint not null default 0
        check (view_count >= 0),
    status text not null default 'published'
        check (status in ('published', 'hidden', 'deleted')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- target_type과 target_id로 게시글 또는 활동에 댓글을 연결한다.
-- 다형 관계이므로 별도 Trigger가 대상 존재 여부를 검증한다.
create table public.comments (
    id bigint generated always as identity primary key,
    target_type text not null
        check (target_type in ('post', 'event')),
    target_id bigint not null,
    author_id uuid not null references public.profiles(id) on delete restrict,
    content text not null
        check (char_length(btrim(content)) between 1 and 3000),
    status text not null default 'published'
        check (status in ('published', 'hidden', 'deleted')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index posts_board_status_created_idx
    on public.posts (board_type, status, is_pinned desc, created_at desc);

create index posts_author_created_idx
    on public.posts (author_id, created_at desc);

create index posts_title_search_idx
    on public.posts using gin (to_tsvector('simple', title));

create index comments_target_created_idx
    on public.comments (target_type, target_id, status, created_at);

create index comments_author_created_idx
    on public.comments (author_id, created_at desc);

commit;
