create or replace function public.submit_join_request_with_push_opt_in(
 p_display_name text,
 p_real_name text,
 p_birth_date date,
 p_church_group text,
 p_request_message text,
 p_privacy_consent boolean,
 p_privacy_policy_version text,
 p_rules_consent boolean,
 p_community_rules_version text,
 p_push_opt_in boolean
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception '로그인된 사용자만 가입 신청을 완료할 수 있습니다.' using errcode='42501';
  end if;

  v_result := public.submit_join_request(
    p_display_name,
    p_real_name,
    p_birth_date,
    p_church_group,
    p_request_message,
    p_privacy_consent,
    p_privacy_policy_version,
    p_rules_consent,
    p_community_rules_version
  );

  insert into public.push_notification_preferences(
    user_id,
    push_opt_in,
    updated_at
  ) values (
    v_user_id,
    coalesce(p_push_opt_in, false),
    now()
  )
  on conflict (user_id) do update
    set push_opt_in = excluded.push_opt_in,
        updated_at = excluded.updated_at;

  return v_result || jsonb_build_object('push_opt_in_saved', true);
end;
$$;

revoke all on function public.submit_join_request_with_push_opt_in(text,text,date,text,text,boolean,text,boolean,text,boolean) from public, anon;
grant execute on function public.submit_join_request_with_push_opt_in(text,text,date,text,text,boolean,text,boolean,text,boolean) to authenticated;
