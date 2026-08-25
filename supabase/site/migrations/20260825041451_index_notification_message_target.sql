create index if not exists notifications_message_idx
  on public.notifications(message_id)
  where message_id is not null;
