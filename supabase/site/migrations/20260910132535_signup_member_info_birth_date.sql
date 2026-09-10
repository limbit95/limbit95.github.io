begin;

-- Store the exact birth date privately while preserving legacy birth_year data for
-- existing members. The legacy age_visibility column remains only for rolling
-- compatibility with the previously deployed client and is forced to private.
alter table public.profiles
  add column if not exists birth_date date;

comment on column public.profiles.birth_date is
  '회원 본인 정보로 사용하는 출생연월일. 공개 프로필 RPC에는 노출하지 않는다.';

update public.profiles
   set age_visibility = 'private'
 where age_visibility <> 'private';

-- New signup contract. Keep the previous integer/text overload during the rolling
-- deployment so the currently deployed client can still finish an in-progress signup.
create or replace function public.submit_join_request(
 p_display_name text,
 p_real_name text,
 p_birth_date date,
 p_church_group text,
 p_request_message text,
 p_privacy_consent boolean,
 p_privacy_policy_version text,
 p_rules_consent boolean,
 p_community_rules_version text
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
 v_user_id uuid := auth.uid();
 v_email text;
 v_email_confirmed_at timestamptz;
 v_profile_exists boolean;
 v_request_exists boolean;
 v_now timestamptz := pg_catalog.clock_timestamp();
 v_display_name text := nullif(btrim(p_display_name), '');
 v_real_name text := nullif(btrim(p_real_name), '');
 v_church_group text := nullif(btrim(p_church_group), '');
 v_request_message text := nullif(btrim(p_request_message), '');
 v_privacy_version text := nullif(btrim(p_privacy_policy_version), '');
 v_rules_version text := nullif(btrim(p_community_rules_version), '');
begin
 if v_user_id is null then
   raise exception '로그인된 사용자만 가입 신청을 완료할 수 있습니다.' using errcode='42501';
 end if;

 select lower(u.email), u.email_confirmed_at
   into v_email, v_email_confirmed_at
   from auth.users u
  where u.id = v_user_id;

 if v_email is null then
   raise exception '이메일 계정을 확인할 수 없습니다.' using errcode='23514';
 end if;
 if v_email_confirmed_at is null then
   raise exception '이메일 인증을 먼저 완료해 주세요.' using errcode='23514';
 end if;

 perform pg_catalog.pg_advisory_xact_lock(
   pg_catalog.hashtextextended('submit-join:' || v_user_id::text, 0)
 );
 if v_display_name is null or char_length(v_display_name) > 50
    or v_real_name is null or char_length(v_real_name) > 50
    or v_church_group is null or char_length(v_church_group) > 200
    or v_request_message is null or char_length(v_request_message) > 1000
    or v_privacy_version is null or char_length(v_privacy_version) > 50
    or v_rules_version is null or char_length(v_rules_version) > 50
    or not coalesce(p_privacy_consent, false)
    or not coalesce(p_rules_consent, false)
 then
   raise exception '필수 가입 정보 또는 약관 동의가 누락되었습니다.' using errcode='23514';
 end if;
 if p_birth_date is null
    or p_birth_date < date '1900-01-01'
    or p_birth_date > current_date
 then
   raise exception '출생연월일 범위가 올바르지 않습니다.' using errcode='23514';
 end if;

 select exists(select 1 from public.profiles p where p.id = v_user_id),
        exists(select 1 from public.join_requests j where j.user_id = v_user_id)
   into v_profile_exists, v_request_exists;

 if v_profile_exists and v_request_exists then
   return jsonb_build_object('submitted', true, 'already_submitted', true);
 end if;
 if v_profile_exists <> v_request_exists then
   raise exception '가입 신청 데이터 상태가 일치하지 않습니다.' using errcode='23514';
 end if;

 insert into public.profiles(
   id,display_name,real_name,birth_date,birth_year,age_visibility,role,status
 ) values (
   v_user_id,v_display_name,v_real_name,p_birth_date,
   extract(year from p_birth_date)::integer,'private','member','pending'
 );

 insert into public.join_requests(
   user_id,email,real_name,church_group,request_message,status,
   privacy_consent_at,privacy_policy_version,rules_consent_at,community_rules_version
 ) values (
   v_user_id,v_email,v_real_name,v_church_group,v_request_message,'pending',
   v_now,v_privacy_version,v_now,v_rules_version
 );

 return jsonb_build_object('submitted', true, 'already_submitted', false);
end;
$$;

revoke all on function public.submit_join_request(text,text,date,text,text,boolean,text,boolean,text) from public, anon;
grant execute on function public.submit_join_request(text,text,date,text,text,boolean,text,boolean,text) to authenticated;

-- Age/birth information is no longer part of the public member profile contract.
drop function if exists public.get_public_member_profiles(uuid);
create function public.get_public_member_profiles(p_user_id uuid default null)
returns table(
  id uuid,
  display_name text,
  real_name text,
  bio text,
  avatar_path text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_approved_member() then
    raise exception '승인된 회원만 회원 프로필을 조회할 수 있습니다.'
      using errcode = '42501';
  end if;

  return query
  select
    p.id,
    p.display_name,
    p.real_name,
    p.bio,
    p.avatar_path,
    p.created_at
  from public.profiles as p
  where p.status = 'approved'
    and (p_user_id is null or p.id = p_user_id)
  order by p.display_name, p.id;
end;
$$;

revoke all on function public.get_public_member_profiles(uuid) from public, anon;
grant execute on function public.get_public_member_profiles(uuid) to authenticated;
grant execute on function public.get_public_member_profiles(uuid) to service_role;

drop function if exists public.get_public_member_profiles_by_ids(uuid[]);
create function public.get_public_member_profiles_by_ids(p_user_ids uuid[])
returns table(
  id uuid,
  display_name text,
  real_name text,
  bio text,
  avatar_path text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_approved_member() then
    raise exception '승인된 회원만 회원 프로필을 조회할 수 있습니다.'
      using errcode = '42501';
  end if;

  return query
  select
    p.id,
    p.display_name,
    p.real_name,
    p.bio,
    p.avatar_path,
    p.created_at
  from public.profiles as p
  where p.status = 'approved'
    and p.id = any(coalesce(p_user_ids, '{}'::uuid[]))
  order by p.display_name, p.id;
end;
$$;

revoke all on function public.get_public_member_profiles_by_ids(uuid[]) from public, anon;
grant execute on function public.get_public_member_profiles_by_ids(uuid[]) to authenticated;
grant execute on function public.get_public_member_profiles_by_ids(uuid[]) to service_role;

commit;
