begin;

alter table public.notifications drop constraint if exists notifications_notification_type_check;
alter table public.notifications add constraint notifications_notification_type_check
check (notification_type = any (array[
    'event_updated'::text,
    'event_cancelled'::text,
    'waitlist_promoted'::text,
    'poll_closed'::text,
    'new_activity'::text,
    'direct_message'::text,
    'activity_reminder'::text,
    'event_participant_joined'::text,
    'event_participant_waitlisted'::text,
    'event_participation_cancelled'::text,
    'join_request_received'::text
]));

alter table public.notifications drop constraint if exists notification_target_check;
alter table public.notifications add constraint notification_target_check
check (
    event_id is not null
    or poll_id is not null
    or message_id is not null
    or target_path is not null
);

create or replace function private.notify_join_request_admins()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.notifications (
        user_id,
        notification_type,
        kind,
        title,
        body,
        target_path,
        dedupe_key
    )
    select
        p.id,
        'join_request_received',
        'join_request_received',
        '새 가입 신청이 접수됐어요',
        format('%s님의 가입 신청을 확인해 주세요.', coalesce(nullif(btrim(new.real_name), ''), '새 회원')),
        '#/admin/approvals?status=pending',
        'join_request:' || new.user_id::text
    from public.profiles as p
    where p.status = 'approved'
      and (
          p.role = 'system_admin'
          or (
              p.role = 'admin'
              and exists (
                  select 1
                  from public.admin_permissions as ap
                  where ap.user_id = p.id
                    and ap.permission = 'members'
              )
          )
      )
    on conflict (user_id, dedupe_key) where dedupe_key is not null do nothing;

    return new;
end;
$$;

revoke all on function private.notify_join_request_admins() from public, anon, authenticated;

drop trigger if exists trg_notify_join_request_admins on public.join_requests;
create trigger trg_notify_join_request_admins
after insert on public.join_requests
for each row execute function private.notify_join_request_admins();

commit;
