-- Splendor phase 2: private room-scoped invalidation broadcasts.

create or replace function private.splendor_can_receive_room_topic(p_topic text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and private.is_approved_member()
    and exists (
      select 1
      from public.splendor_room_players p
      join public.splendor_rooms r on r.id = p.room_id
      where p.user_id = (select auth.uid())
        and p.membership_status = 'active'
        and r.status in ('waiting','playing')
        and r.expires_at > now()
        and p_topic = 'splendor-room:' || p.room_id::text
    );
$$;

revoke all on function private.splendor_can_receive_room_topic(text) from public, anon;
grant execute on function private.splendor_can_receive_room_topic(text) to authenticated;

drop policy if exists "splendor active room members can receive broadcasts" on realtime.messages;
create policy "splendor active room members can receive broadcasts"
on realtime.messages
for select
to authenticated
using (
  extension = 'broadcast'
  and private.splendor_can_receive_room_topic(realtime.topic())
);

create or replace function private.splendor_broadcast_room_state_changed()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.send(
    jsonb_build_object('room_id', new.id, 'version', new.version),
    'state_changed',
    'splendor-room:' || new.id::text,
    true
  );
  return null;
end;
$$;

revoke all on function private.splendor_broadcast_room_state_changed() from public, anon, authenticated;

drop trigger if exists splendor_broadcast_room_state_changed on public.splendor_rooms;
create trigger splendor_broadcast_room_state_changed
after update of version on public.splendor_rooms
for each row
when (new.version is distinct from old.version)
execute function private.splendor_broadcast_room_state_changed();
