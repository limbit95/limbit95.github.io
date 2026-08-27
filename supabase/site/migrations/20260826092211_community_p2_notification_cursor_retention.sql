create index if not exists notifications_user_id_desc_idx
  on public.notifications(user_id, id desc);

create or replace function private.cleanup_notification_retention()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_deleted integer;
begin
  delete from public.notifications as n
  where (
      n.expires_at is not null
      and n.expires_at < now() - interval '30 days'
    )
    or (
      n.is_read
      and n.created_at < now() - interval '90 days'
    )
    or n.created_at < now() - interval '365 days';

  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

select cron.schedule(
  'cheongpa-notification-retention',
  '15 18 * * *',
  'select private.cleanup_notification_retention();'
);
