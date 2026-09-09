begin;

-- Finalize the native Supabase Auth OTP rollout after the new signup frontend is live.
-- Auth user creation no longer creates a community profile or join request directly.
-- New applicants must first verify their email and then call submit_join_request(),
-- which derives auth.uid()/email server-side and requires email_confirmed_at.
create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.email is null then
    raise exception '이메일 가입만 지원합니다.' using errcode = '23514';
  end if;

  return new;
end;
$$;
revoke all on function private.handle_new_auth_user() from public, anon, authenticated;

commit;
