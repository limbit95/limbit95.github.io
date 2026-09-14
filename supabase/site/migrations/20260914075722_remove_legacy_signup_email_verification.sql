begin;

-- 회원가입 이메일 인증은 Supabase Auth OTP(signInWithOtp/verifyOtp)를 사용한다.
-- 이전 custom challenge 기반 signup-verification Edge Function에서만 사용하던
-- DB 객체는 현재 애플리케이션 경로에서 참조되지 않으므로 제거한다.
drop function if exists public.claim_signup_email_challenge(uuid, uuid);
drop function if exists public.verify_signup_email_challenge(uuid, text, text);
drop function if exists public.record_signup_email_failure(uuid);
drop function if exists public.create_signup_email_challenge(text, text, text, timestamptz);

drop table if exists public.signup_email_challenges;

commit;
