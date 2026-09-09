begin;

-- Phase 1 (backward compatible): deploy this infrastructure before the Edge Function
-- and new frontend. The auth trigger still accepts the existing signup contract.
alter table public.profiles add column real_name text
    check (real_name is null or char_length(btrim(real_name)) between 1 and 50);
alter table public.join_requests add column rules_consent_at timestamptz;
alter table public.join_requests add column community_rules_version text
    check (community_rules_version is null or char_length(btrim(community_rules_version)) between 1 and 50);

-- Only the real name is copied into the public profile. Existing non-null values win.
update public.profiles as p
set real_name = nullif(btrim(j.real_name), '')
from public.join_requests as j
where p.id = j.user_id
  and p.real_name is null
  and nullif(btrim(j.real_name), '') is not null;

create table public.signup_email_challenges (
    id uuid primary key default gen_random_uuid(),
    email text not null check (email = lower(email) and char_length(email) between 3 and 320),
    code_hash text not null,
    request_ip_hash text not null,
    expires_at timestamptz not null,
    verified_at timestamptz,
    verification_token_hash text,
    consumed_at timestamptz,
    failed_attempts smallint not null default 0 check (failed_attempts between 0 and 5),
    created_at timestamptz not null default now()
);
create index signup_email_challenges_email_created_idx on public.signup_email_challenges (email, created_at desc);
create index signup_email_challenges_ip_created_idx on public.signup_email_challenges (request_ip_hash, created_at desc);
alter table public.signup_email_challenges enable row level security;
revoke all on table public.signup_email_challenges from public, anon, authenticated;
grant all on table public.signup_email_challenges to service_role;
comment on table public.signup_email_challenges is 'Edge Function 전용 단기 이메일 소유권 인증 challenge. 원문 코드와 토큰은 저장하지 않는다.';

-- Backward-compatible trigger for the rollout window. It preserves every old
-- requirement while recording the new fields when the new client supplies them.
create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
 v_metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
 v_display_name text := nullif(btrim(v_metadata ->> 'display_name'), '');
 v_real_name text := nullif(btrim(v_metadata ->> 'real_name'), '');
 v_church_group text := nullif(btrim(v_metadata ->> 'church_group'), '');
 v_request_message text := nullif(btrim(v_metadata ->> 'request_message'), '');
 v_privacy_policy_version text := nullif(btrim(v_metadata ->> 'privacy_policy_version'), '');
 v_rules_version text := nullif(btrim(v_metadata ->> 'community_rules_version'), '');
 v_age_visibility text := coalesce(nullif(btrim(v_metadata ->> 'age_visibility'), ''), 'private');
 v_birth_year integer;
 v_privacy_consent boolean := lower(coalesce(v_metadata ->> 'privacy_consent','false')) in ('true','1','yes');
 v_rules_consent boolean := lower(coalesce(v_metadata ->> 'rules_consent','false')) in ('true','1','yes');
begin
 if new.email is null then raise exception '이메일 가입만 지원합니다.' using errcode='23514'; end if;
 if v_display_name is null or v_real_name is null or v_church_group is null or v_request_message is null
    or v_privacy_policy_version is null or not v_privacy_consent
 then raise exception '필수 가입 정보 또는 개인정보 동의가 누락되었습니다.' using errcode='23514'; end if;
 if coalesce(v_metadata ->> 'birth_year','') !~ '^[0-9]{4}$' then raise exception '출생연도는 네 자리 숫자여야 합니다.' using errcode='23514'; end if;
 v_birth_year := (v_metadata ->> 'birth_year')::integer;
 if v_birth_year not between 1900 and extract(year from now())::integer then raise exception '출생연도 범위가 올바르지 않습니다.' using errcode='23514'; end if;
 if v_age_visibility not in ('birth_year','age_group','private') then raise exception '나이 공개 설정이 올바르지 않습니다.' using errcode='23514'; end if;
 insert into public.profiles(id,display_name,real_name,birth_year,age_visibility,role,status)
 values(new.id,v_display_name,v_real_name,v_birth_year,v_age_visibility,'member','pending');
 insert into public.join_requests(user_id,email,real_name,church_group,request_message,status,privacy_consent_at,privacy_policy_version,rules_consent_at,community_rules_version)
 values(new.id,lower(new.email),v_real_name,v_church_group,v_request_message,'pending',now(),v_privacy_policy_version,
   case when v_rules_consent and v_rules_version is not null then now() else null end,
   case when v_rules_consent then v_rules_version else null end);
 return new;
end;
$$;
revoke all on function private.handle_new_auth_user() from public, anon, authenticated;

-- Count and insert under per-email and per-IP transaction locks so concurrent requests
-- cannot all observe a count below the limit.
create function public.create_signup_email_challenge(
    p_email text, p_code_hash text, p_request_ip_hash text, p_expires_at timestamptz
) returns uuid
language plpgsql security definer set search_path = ''
as $$
declare v_id uuid;
begin
    if auth.role() <> 'service_role' then
        raise exception 'service_role only' using errcode = '42501';
    end if;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('signup-email:' || p_email, 0));
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('signup-ip:' || p_request_ip_hash, 0));
    if (select count(*) from public.signup_email_challenges
        where email = p_email and created_at >= pg_catalog.clock_timestamp() - interval '15 minutes') >= 3
       or (select count(*) from public.signup_email_challenges
        where request_ip_hash = p_request_ip_hash and created_at >= pg_catalog.clock_timestamp() - interval '15 minutes') >= 10
    then
        raise exception 'SIGNUP_RATE_LIMITED' using errcode = 'P0001';
    end if;
    insert into public.signup_email_challenges(email, code_hash, request_ip_hash, expires_at)
    values (p_email, p_code_hash, p_request_ip_hash, p_expires_at)
    returning id into v_id;
    return v_id;
end;
$$;
revoke all on function public.create_signup_email_challenge(text,text,text,timestamptz) from public, anon, authenticated;
grant execute on function public.create_signup_email_challenge(text,text,text,timestamptz) to service_role;

-- A single UPDATE owns the increment. The sixth and later attempts cannot alter the row.
create function public.record_signup_email_failure(p_challenge_id uuid)
returns smallint
language plpgsql security definer set search_path = ''
as $$
declare v_attempts smallint;
begin
    if auth.role() <> 'service_role' then
        raise exception 'service_role only' using errcode = '42501';
    end if;
    update public.signup_email_challenges
       set failed_attempts = failed_attempts + 1
     where id = p_challenge_id
       and verified_at is null and consumed_at is null
       and expires_at > pg_catalog.clock_timestamp()
       and failed_attempts < 5
    returning failed_attempts into v_attempts;
    return v_attempts;
end;
$$;
revoke all on function public.record_signup_email_failure(uuid) from public, anon, authenticated;
grant execute on function public.record_signup_email_failure(uuid) to service_role;

-- The successful code claim also rechecks the hash and attempt ceiling atomically.
create function public.verify_signup_email_challenge(
    p_challenge_id uuid, p_code_hash text, p_token_hash text
) returns boolean
language plpgsql security definer set search_path = ''
as $$
declare v_id uuid;
begin
    if auth.role() <> 'service_role' then
        raise exception 'service_role only' using errcode = '42501';
    end if;
    update public.signup_email_challenges
       set verified_at = pg_catalog.clock_timestamp(), verification_token_hash = p_token_hash
     where id = p_challenge_id and code_hash = p_code_hash
       and verified_at is null and consumed_at is null
       and expires_at > pg_catalog.clock_timestamp() and failed_attempts < 5
    returning id into v_id;
    return v_id is not null;
end;
$$;
revoke all on function public.verify_signup_email_challenge(uuid,text,text) from public, anon, authenticated;
grant execute on function public.verify_signup_email_challenge(uuid,text,text) to service_role;

-- 승인 회원에게만 반환하는 공개 프로필 RPC의 기존 보안 경계를 유지하면서 실명을 추가한다.
drop function if exists public.get_public_member_profiles(uuid);
create function public.get_public_member_profiles(p_user_id uuid default null)
returns table(id uuid, display_name text, real_name text, birth_year integer, age_group text, bio text, avatar_path text, created_at timestamptz)
language plpgsql stable security definer set search_path=''
as $$ begin
 if not private.is_approved_member() then raise exception '승인된 회원만 회원 프로필을 조회할 수 있습니다.' using errcode='42501'; end if;
 return query select p.id,p.display_name,p.real_name,
   case when p.age_visibility='birth_year' then p.birth_year else null end,
   case when p.age_visibility='age_group' and p.birth_year is not null then (((extract(year from current_date)::integer-p.birth_year)/10)*10)::text||'대' else null end,
   p.bio,p.avatar_path,p.created_at
 from public.profiles p where p.status='approved' and (p_user_id is null or p.id=p_user_id) order by p.display_name,p.id;
end; $$;
revoke all on function public.get_public_member_profiles(uuid) from public, anon, authenticated;
grant execute on function public.get_public_member_profiles(uuid) to authenticated;

drop function if exists public.get_public_member_profiles_by_ids(uuid[]);
create function public.get_public_member_profiles_by_ids(p_user_ids uuid[])
returns table(id uuid, display_name text, real_name text, birth_year integer, age_group text, bio text, avatar_path text, created_at timestamptz)
language plpgsql stable security definer set search_path=''
as $$ begin
 if not private.is_approved_member() then raise exception '승인된 회원만 회원 프로필을 조회할 수 있습니다.' using errcode='42501'; end if;
 return query select p.id,p.display_name,p.real_name,
   case when p.age_visibility='birth_year' then p.birth_year else null end,
   case when p.age_visibility='age_group' and p.birth_year is not null then (((extract(year from current_date)::integer-p.birth_year)/10)*10)::text||'대' else null end,
   p.bio,p.avatar_path,p.created_at
 from public.profiles p where p.status='approved' and p.id=any(coalesce(p_user_ids,'{}'::uuid[])) order by p.display_name,p.id;
end; $$;
revoke all on function public.get_public_member_profiles_by_ids(uuid[]) from public, anon;
grant execute on function public.get_public_member_profiles_by_ids(uuid[]) to authenticated, service_role;

commit;
