-- Liar Game phase 1 Realtime: private, room-scoped invalidation signals only.
-- Apply after schema.sql/functions-core.sql. Base game rows remain RPC-only.

create or replace function public.liar_can_receive_realtime_topic(p_topic text)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.liar_players as lp
      join public.liar_rooms as lr on lr.id = lp.room_id
      where lp.auth_user_id = auth.uid()
        and lp.membership_status = 'active'
        and lr.status = 'active'
        and pg_catalog.now() < lr.expires_at
        and p_topic = 'liar-room:' || lp.room_id::text
    );
$$;

revoke all on function public.liar_can_receive_realtime_topic(text)
from public, anon, authenticated;
grant execute on function public.liar_can_receive_realtime_topic(text)
to authenticated;

drop policy if exists "liar active room members can receive broadcasts"
on realtime.messages;
create policy "liar active room members can receive broadcasts"
on realtime.messages
for select
to authenticated
using (
  extension = 'broadcast'
  and public.liar_can_receive_realtime_topic(realtime.topic())
);

create or replace function public.liar_broadcast_room_state_changed()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  perform realtime.send(
    pg_catalog.jsonb_build_object(
      'room_id', new.id,
      'version', new.version
    ),
    'state_changed',
    'liar-room:' || new.id::text,
    true
  );
  return null;
end;
$$;

revoke all on function public.liar_broadcast_room_state_changed()
from public, anon, authenticated;

drop trigger if exists liar_broadcast_room_state_changed
on public.liar_rooms;
create trigger liar_broadcast_room_state_changed
after update of version on public.liar_rooms
for each row
when (new.version is distinct from old.version)
execute function public.liar_broadcast_room_state_changed();
