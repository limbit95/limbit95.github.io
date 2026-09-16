drop function if exists public.submit_join_request_with_push_opt_in(text,text,date,text,text,boolean,text,boolean,text,boolean);

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
 v_push_opt_in boolean := false;
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

 select lower(u.email),
        u.email_confirmed_at,
        coalesce(lower(u.raw_user_meta_data ->> 'signup_push_opt_in') in ('true','t','1','yes','on'), false)
   into v_email, v_email_confirmed_at, v_push_opt_in
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
   insert into public.push_notification_preferences(user_id, push_opt_in, updated_at)
   values(v_user_id, v_push_opt_in, v_now)
   on conflict (user_id) do update
     set push_opt_in = excluded.push_opt_in,
         updated_at = excluded.updated_at;
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

 insert into public.push_notification_preferences(user_id, push_opt_in, updated_at)
 values(v_user_id, v_push_opt_in, v_now)
 on conflict (user_id) do update
   set push_opt_in = excluded.push_opt_in,
       updated_at = excluded.updated_at;

 return jsonb_build_object('submitted', true, 'already_submitted', false);
end;
$$;

revoke all on function public.submit_join_request(text,text,date,text,text,boolean,text,boolean,text) from public, anon;
grant execute on function public.submit_join_request(text,text,date,text,text,boolean,text,boolean,text) to authenticated;
