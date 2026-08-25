-- 청파 같이 본 사이트 baseline: 활동 카테고리와 담당자
-- 원본 schema.sql에서 SQL 의미 변경 없이 섹션별로 분리한 파일입니다.

begin;

-- ============================================================================
-- 2. 활동 카테고리와 담당자
-- ============================================================================

create table public.activity_categories (
    id bigint generated always as identity primary key,
    name text not null unique
        check (char_length(btrim(name)) between 1 and 50),
    icon text not null
        check (char_length(icon) between 1 and 50),
    color text not null
        check (color ~ '^#[0-9A-Fa-f]{6}$'),
    description text not null default ''
        check (char_length(description) <= 500),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 사용자의 관심 활동을 N:M 관계로 저장한다.
create table public.profile_interests (
    user_id uuid not null references public.profiles(id) on delete cascade,
    category_id bigint not null
        references public.activity_categories(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (user_id, category_id)
);

-- 활동 담당자는 role 값이 아니라 이 매핑 테이블로 카테고리별 관리한다.
create table public.category_managers (
    category_id bigint not null
        references public.activity_categories(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    created_at timestamptz not null default now(),
    created_by uuid not null references public.profiles(id) on delete restrict,
    primary key (category_id, user_id)
);

create index profile_interests_category_idx
    on public.profile_interests (category_id, user_id);

create index category_managers_user_idx
    on public.category_managers (user_id, category_id);

create index category_managers_created_by_idx
    on public.category_managers (created_by);

commit;
