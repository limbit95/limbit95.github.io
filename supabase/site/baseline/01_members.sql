-- 청파 같이 본 사이트 baseline: 핵심 회원 테이블
-- 원본 schema.sql에서 SQL 의미 변경 없이 섹션별로 분리한 파일입니다.

begin;

-- ============================================================================
-- 1. 핵심 회원 테이블
-- ============================================================================

-- Auth 사용자와 1:1로 연결되는 서비스 프로필이다.
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    display_name text not null
        check (char_length(btrim(display_name)) between 1 and 50),
    birth_year integer
        check (birth_year is null or birth_year between 1900 and 2100),
    age_visibility text not null default 'private'
        check (age_visibility in ('birth_year', 'age_group', 'private')),
    bio text not null default ''
        check (char_length(bio) <= 500),
    avatar_path text,
    role text not null default 'member'
        check (role in ('member', 'admin')),
    status text not null default 'pending'
        check (status in ('pending', 'approved', 'rejected', 'suspended')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    approved_at timestamptz,
    approved_by uuid references public.profiles(id) on delete set null,
    constraint profiles_approval_state_check check (
        (status = 'approved' and approved_at is not null)
        or status <> 'approved'
    )
);

-- 가입 승인에 필요한 비공개 정보이다. 본인과 관리자만 조회할 수 있다.
create table public.join_requests (
    user_id uuid primary key references auth.users(id) on delete cascade,
    email text not null
        check (char_length(email) between 3 and 320 and position('@' in email) > 1),
    real_name text not null
        check (char_length(btrim(real_name)) between 1 and 50),
    church_group text not null
        check (char_length(btrim(church_group)) between 1 and 200),
    request_message text not null
        check (char_length(btrim(request_message)) between 1 and 1000),
    status text not null default 'pending'
        check (status in ('pending', 'approved', 'rejected', 'held')),
    admin_note text
        check (admin_note is null or char_length(admin_note) <= 1000),
    privacy_consent_at timestamptz not null,
    privacy_policy_version text not null
        check (char_length(btrim(privacy_policy_version)) between 1 and 50),
    requested_at timestamptz not null default now(),
    reviewed_at timestamptz,
    reviewed_by uuid references public.profiles(id) on delete set null,
    updated_at timestamptz not null default now()
);

create unique index join_requests_email_lower_uidx
    on public.join_requests (lower(email));

create index profiles_status_idx
    on public.profiles (status);

create index profiles_role_status_idx
    on public.profiles (role, status);

create index join_requests_status_requested_at_idx
    on public.join_requests (status, requested_at desc);

-- FK 대상 행의 삭제·변경 검사와 관리자 이력 조회를 위한 인덱스이다.
create index profiles_approved_by_idx
    on public.profiles (approved_by)
    where approved_by is not null;

create index join_requests_reviewed_by_idx
    on public.join_requests (reviewed_by)
    where reviewed_by is not null;

commit;
