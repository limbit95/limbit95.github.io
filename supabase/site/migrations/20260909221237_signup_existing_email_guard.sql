begin;

-- Signup uses passwordless OTP before the community application is created.
-- Return only whether an email already belongs to a completed/legacy account so
-- the signup UI can avoid turning OTP verification into a login for that user.
-- auth_otp users without a profile/join request are incomplete signup shells and
-- remain eligible to resume the signup flow.
create or replace function public.get_signup_email_status(p_email text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(nullif(btrim(p_email), ''));
  v_user_id uuid;
  v_signup_flow text;
begin
  if v_email is null then
    return 'invalid';
  end if;

  select u.id,
         nullif(btrim(coalesce(u.raw_user_meta_data ->> 'signup_flow', '')), '')
    into v_user_id, v_signup_flow
    from auth.users u
   where lower(u.email) = v_email
   limit 1;

  if v_user_id is null then
    return 'available';
  end if;

  if exists(select 1 from public.profiles p where p.id = v_user_id)
     or exists(select 1 from public.join_requests j where j.user_id = v_user_id)
     or coalesce(v_signup_flow, '') <> 'auth_otp'
  then
    return 'registered';
  end if;

  return 'available';
end;
$$;

revoke all on function public.get_signup_email_status(text) from public, anon, authenticated;
grant execute on function public.get_signup_email_status(text) to anon;

commit;
