revoke execute on function public.send_direct_message(uuid, text) from anon;
revoke execute on function public.mark_direct_message_read(bigint) from anon;
revoke execute on function public.sync_my_activity_reminders() from anon;

grant execute on function public.send_direct_message(uuid, text) to authenticated;
grant execute on function public.mark_direct_message_read(bigint) to authenticated;
grant execute on function public.sync_my_activity_reminders() to authenticated;
