begin;

-- A browser reopen can retain the incomplete native Auth OTP session while the
-- signup UI intentionally treats that tab as unverified. In that state the
-- email-availability guard is called with the authenticated Postgres role, so
-- it needs the same lookup permission already available to anon callers.
grant execute on function public.get_signup_email_status(text) to authenticated;

commit;
