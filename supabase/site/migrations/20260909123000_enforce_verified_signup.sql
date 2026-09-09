begin;

-- Phase 4: apply only after signup-verification and the new frontend are deployed.
-- The Edge Function binds a server-chosen Auth user UUID to the consumed DB challenge
-- before creating auth.users; caller-controlled raw_user_meta_data is never accepted
-- as proof of email ownership.
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
 if not exists (
   select 1 from public.signup_email_challenges c
    where c.auth_user_id = new.id and c.email = lower(new.email)
      and c.verified_at is not null and c.consumed_at is not null
 ) then
   raise exception '서버에서 확인된 이메일 인증이 필요합니다.' using errcode='23514';
 end if;
 if v_display_name is null or v_real_name is null or v_church_group is null or v_request_message is null
    or v_privacy_policy_version is null or v_rules_version is null or not v_privacy_consent or not v_rules_consent
 then raise exception '필수 가입 정보 또는 약관 동의가 누락되었습니다.' using errcode='23514'; end if;
 if coalesce(v_metadata ->> 'birth_year','') !~ '^[0-9]{4}$' then raise exception '출생연도는 네 자리 숫자여야 합니다.' using errcode='23514'; end if;
 v_birth_year := (v_metadata ->> 'birth_year')::integer;
 if v_birth_year not between 1900 and extract(year from now())::integer then raise exception '출생연도 범위가 올바르지 않습니다.' using errcode='23514'; end if;
 if v_age_visibility not in ('birth_year','age_group','private') then raise exception '나이 공개 설정이 올바르지 않습니다.' using errcode='23514'; end if;
 insert into public.profiles(id,display_name,real_name,birth_year,age_visibility,role,status)
 values(new.id,v_display_name,v_real_name,v_birth_year,v_age_visibility,'member','pending');
 insert into public.join_requests(user_id,email,real_name,church_group,request_message,status,privacy_consent_at,privacy_policy_version,rules_consent_at,community_rules_version)
 values(new.id,lower(new.email),v_real_name,v_church_group,v_request_message,'pending',now(),v_privacy_policy_version,now(),v_rules_version);
 return new;
end;
$$;
revoke all on function private.handle_new_auth_user() from public, anon, authenticated;

commit;
