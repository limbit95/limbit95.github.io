begin;

-- Native Supabase Auth OTP rollout.
-- Existing production signup remains compatible until the new frontend is deployed:
-- legacy signups still submit their full metadata through auth.signUp(), while the
-- new auth_otp flow creates only auth.users at this stage and submits application
-- data later through submit_join_request().
create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
 v_metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
 v_signup_flow text := nullif(btrim(v_metadata ->> 'signup_flow'), '');
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
 if new.email is null then
   raise exception '이메일 가입만 지원합니다.' using errcode='23514';
 end if;

 -- New frontend: Supabase Auth owns email OTP verification. Application rows are
 -- intentionally deferred until the authenticated user calls submit_join_request().
 if v_signup_flow = 'auth_otp' then
   return new;
 end if;

 -- Legacy frontend compatibility during the staged rollout.
 if v_display_name is null or v_real_name is null or v_church_group is null or v_request_message is null
    or v_privacy_policy_version is null or not v_privacy_consent
 then
   raise exception '필수 가입 정보 또는 개인정보 동의가 누락되었습니다.' using errcode='23514';
 end if;
 if coalesce(v_metadata ->> 'birth_year','') !~ '^[0-9]{4}$' then
   raise exception '출생연도는 네 자리 숫자여야 합니다.' using errcode='23514';
 end if;
 v_birth_year := (v_metadata ->> 'birth_year')::integer;
 if v_birth_year not between 1900 and extract(year from now())::integer then
   raise exception '출생연도 범위가 올바르지 않습니다.' using errcode='23514';
 end if;
 if v_age_visibility not in ('birth_year','age_group','private') then
   raise exception '나이 공개 설정이 올바르지 않습니다.' using errcode='23514';
 end if;
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

create or replace function public.submit_join_request(
 p_display_name text,
 p_real_name text,
 p_birth_year integer,
 p_age_visibility text,
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

 -- Serialize final application submission per Auth user so retries remain idempotent.
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
 if p_birth_year is null or p_birth_year not between 1900 and extract(year from current_date)::integer then
   raise exception '출생연도 범위가 올바르지 않습니다.' using errcode='23514';
 end if;
 if p_age_visibility not in ('birth_year','age_group','private') then
   raise exception '나이 공개 설정이 올바르지 않습니다.' using errcode='23514';
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

 insert into public.profiles(id,display_name,real_name,birth_year,age_visibility,role,status)
 values(v_user_id,v_display_name,v_real_name,p_birth_year,p_age_visibility,'member','pending');

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
revoke all on function public.submit_join_request(text,text,integer,text,text,text,boolean,text,boolean,text) from public, anon;
grant execute on function public.submit_join_request(text,text,integer,text,text,text,boolean,text,boolean,text) to authenticated;

commit;
