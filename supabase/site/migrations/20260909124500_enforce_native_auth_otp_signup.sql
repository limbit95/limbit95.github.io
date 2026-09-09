begin;

-- Final native Auth OTP enforcement. Apply only after the new signup frontend is live.
-- Auth user creation no longer creates community profile/join-request rows directly.
-- New applicants verify email through Supabase Auth and complete the application only
-- through submit_join_request(), which validates auth.uid() and email_confirmed_at.
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
