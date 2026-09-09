begin;

-- Final native Auth OTP enforcement. Apply only after the new signup frontend is live.
-- Unverified password signups can no longer create community application rows by
-- supplying the legacy metadata contract directly. Native auth_otp users still create
-- only auth.users here and finish their application through submit_join_request().
create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
 v_metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
 v_signup_flow text := nullif(btrim(v_metadata ->> 'signup_flow'), '');
 v_trusted_signup_source text := nullif(btrim(coalesce(new.raw_app_meta_data, '{}'::jsonb) ->> 'community_signup_source'), '');
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

 -- Native frontend: email ownership is verified by Supabase Auth. Application data
 -- remains deferred until submit_join_request() validates email_confirmed_at.
 if v_signup_flow = 'auth_otp' then
   return new;
 end if;

 -- The Admin create-user API can run this INSERT trigger before email_confirmed_at is
 -- populated even when email_confirm=true. Only a server-controlled app_metadata marker
 -- may bypass that timing gap; ordinary browser signups cannot set raw_app_meta_data.
 if new.email_confirmed_at is null and coalesce(v_trusted_signup_source, '') <> 'admin_create' then
   raise exception '이메일 인증 후 가입 신청을 완료해 주세요.' using errcode='23514';
 end if;

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

commit;
