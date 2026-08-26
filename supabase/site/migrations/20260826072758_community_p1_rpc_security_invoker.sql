alter function public.replace_my_profile_interests(bigint[])
  security invoker;

alter function public.create_recurring_event(jsonb, jsonb)
  security invoker;

revoke all on function public.sync_my_activity_reminders()
  from public, anon, authenticated;
