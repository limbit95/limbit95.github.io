-- Community finalization security hardening.
-- Keep behavior unchanged while reducing unnecessary Data API exposure.

alter function public.set_updated_at() set search_path = '';
alter function public.is_admin() set search_path = '';
alter function public.send_direct_message(uuid, text) set search_path = '';
alter function public.mark_direct_message_read(bigint) set search_path = '';

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;

revoke execute on function public.rls_auto_enable() from public, anon, authenticated, service_role;

revoke select on table public.direct_messages from anon;
