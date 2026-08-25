-- 청파 같이 본 사이트 baseline: 회원가입 프로필 자동 생성
-- 원본 schema.sql에서 SQL 의미 변경 없이 섹션별로 분리한 파일입니다.

begin;

-- ============================================================================
-- 8. 회원가입 프로필 자동 생성
-- ============================================================================

-- Supabase Auth signUp 시 options.data로 전달된 가입 정보를 이용해
-- profiles와 join_requests를 같은 트랜잭션에서 생성한다.
-- 이메일 확인 기능이 켜져 있어 signUp 직후 세션이 없어도 가입 신청이 생성된다.
create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
    v_display_name text;
    v_real_name text;
    v_birth_year integer;
    v_age_visibility text;
    v_church_group text;
    v_request_message text;
    v_privacy_policy_version text;
    v_privacy_consent boolean;
begin
    v_display_name := nullif(btrim(v_metadata ->> 'display_name'), '');
    v_real_name := nullif(btrim(v_metadata ->> 'real_name'), '');
    v_church_group := nullif(btrim(v_metadata ->> 'church_group'), '');
    v_request_message := nullif(btrim(v_metadata ->> 'request_message'), '');
    v_privacy_policy_version :=
        nullif(btrim(v_metadata ->> 'privacy_policy_version'), '');
    v_age_visibility :=
        coalesce(nullif(btrim(v_metadata ->> 'age_visibility'), ''), 'private');
    v_privacy_consent :=
        lower(coalesce(v_metadata ->> 'privacy_consent', 'false'))
        in ('true', '1', 'yes');

    if new.email is null then
        raise exception '이메일 가입만 지원합니다.'
            using errcode = '23514';
    end if;

    if v_display_name is null
       or v_real_name is null
       or v_church_group is null
       or v_request_message is null
       or v_privacy_policy_version is null
       or not v_privacy_consent
    then
        raise exception '필수 가입 정보 또는 개인정보 동의가 누락되었습니다.'
            using errcode = '23514';
    end if;

    if coalesce(v_metadata ->> 'birth_year', '') !~ '^[0-9]{4}$' then
        raise exception '출생연도는 네 자리 숫자여야 합니다.'
            using errcode = '23514';
    end if;

    v_birth_year := (v_metadata ->> 'birth_year')::integer;

    if v_birth_year not between 1900 and 2100 then
        raise exception '출생연도 범위가 올바르지 않습니다.'
            using errcode = '23514';
    end if;

    if v_age_visibility not in ('birth_year', 'age_group', 'private') then
        raise exception '나이 공개 설정이 올바르지 않습니다.'
            using errcode = '23514';
    end if;

    insert into public.profiles (
        id,
        display_name,
        birth_year,
        age_visibility,
        role,
        status
    )
    values (
        new.id,
        v_display_name,
        v_birth_year,
        v_age_visibility,
        'member',
        'pending'
    );

    insert into public.join_requests (
        user_id,
        email,
        real_name,
        church_group,
        request_message,
        status,
        privacy_consent_at,
        privacy_policy_version
    )
    values (
        new.id,
        lower(new.email),
        v_real_name,
        v_church_group,
        v_request_message,
        'pending',
        now(),
        v_privacy_policy_version
    );

    return new;
end;
$$;

revoke all on function private.handle_new_auth_user()
    from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_auth_user();

commit;
