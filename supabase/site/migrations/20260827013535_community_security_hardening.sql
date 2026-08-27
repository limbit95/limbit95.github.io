-- Community finalization security hardening.
-- Keep behavior unchanged while reducing unnecessary Data API exposure.
-- Some legacy helper functions exist only on the long-lived hosted project, so
-- harden them conditionally to keep clean local rebuilds reproducible.

do $$
begin
  if to_regprocedure('public.set_updated_at()') is not null then
    execute 'alter function public.set_updated_at() set search_path = ''''';
  end if;

  if to_regprocedure('public.is_admin()') is not null then
    execute 'alter function public.is_admin() set search_path = ''''';
    execute 'revoke execute on function public.is_admin() from public, anon';
    execute 'grant execute on function public.is_admin() to authenticated, service_role';
  end if;

  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated, service_role';
  end if;

  if to_regprocedure('public.send_direct_message(uuid,text)') is not null then
    execute 'alter function public.send_direct_message(uuid, text) set search_path = ''''';
  end if;

  if to_regprocedure('public.mark_direct_message_read(bigint)') is not null then
    execute 'alter function public.mark_direct_message_read(bigint) set search_path = ''''';
  end if;
end;
$$;

revoke select on table public.direct_messages from anon;
