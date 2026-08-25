-- Liar Game Realtime: private room-scoped invalidation, ephemeral discussion chat,
-- and ephemeral Drawing Spy live-stroke streaming.

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

create or replace function public.liar_can_receive_discussion_chat_topic(p_topic text)
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
        and p_topic = 'liar-chat:' || lp.room_id::text
    );
$$;

create or replace function public.liar_can_send_discussion_chat_topic(p_topic text)
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
      join public.liar_rounds as rd on rd.id = lr.current_round_id and rd.room_id = lr.id
      join public.liar_round_players as rp on rp.round_id = rd.id and rp.player_id = lp.id
      where lp.auth_user_id = auth.uid()
        and lp.membership_status = 'active'
        and lr.status = 'active'
        and pg_catalog.now() < lr.expires_at
        and rd.status = 'DISCUSSION'
        and p_topic = 'liar-chat:' || lp.room_id::text
    );
$$;

create or replace function public.liar_can_receive_drawing_topic(p_topic text)
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
        and p_topic = 'liar-drawing:' || lp.room_id::text
    );
$$;

create or replace function public.liar_can_send_drawing_topic(p_topic text)
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
      join public.liar_rounds as rd on rd.id = lr.current_round_id and rd.room_id = lr.id
      join lateral (
        select rp.player_id
        from public.liar_round_players as rp
        where rp.round_id = rd.id
          and (
            coalesce(rd.current_vote_stage, 0) = 0
            or exists (
              select 1
              from public.liar_vote_stages as vs
              where vs.round_id = rd.id
                and vs.stage_no = rd.current_vote_stage
                and vs.kind = 'runoff'
                and vs.status = 'open'
                and rp.id = any(vs.candidate_round_player_ids)
            )
          )
        order by rp.turn_order
        offset coalesce(rd.current_speaker_index, 0)
        limit 1
      ) as current_drawer on current_drawer.player_id = lp.id
      where lp.auth_user_id = auth.uid()
        and lp.membership_status = 'active'
        and lr.status = 'active'
        and pg_catalog.now() < lr.expires_at
        and rd.status = 'DRAWING'
        and rd.game_mode_snapshot = 'drawing_spy'
        and p_topic = 'liar-drawing:' || lp.room_id::text
    );
$$;

revoke all on function public.liar_can_receive_realtime_topic(text)
from public, anon, authenticated;
revoke all on function public.liar_can_receive_discussion_chat_topic(text)
from public, anon, authenticated;
revoke all on function public.liar_can_send_discussion_chat_topic(text)
from public, anon, authenticated;
revoke all on function public.liar_can_receive_drawing_topic(text)
from public, anon, authenticated;
revoke all on function public.liar_can_send_drawing_topic(text)
from public, anon, authenticated;
grant execute on function public.liar_can_receive_realtime_topic(text)
to authenticated;
grant execute on function public.liar_can_receive_discussion_chat_topic(text)
to authenticated;
grant execute on function public.liar_can_send_discussion_chat_topic(text)
to authenticated;
grant execute on function public.liar_can_receive_drawing_topic(text)
to authenticated;
grant execute on function public.liar_can_send_drawing_topic(text)
to authenticated;

drop policy if exists "liar active room members can receive broadcasts"
on realtime.messages;
create policy "liar active room members can receive broadcasts"
on realtime.messages
for select
to authenticated
using (
  extension = 'broadcast'
  and (
    public.liar_can_receive_realtime_topic(realtime.topic())
    or public.liar_can_receive_discussion_chat_topic(realtime.topic())
    or public.liar_can_receive_drawing_topic(realtime.topic())
  )
);

-- Only current round participants may send ephemeral client broadcasts:
-- DISCUSSION participants can send chat, while only the authoritative current
-- Drawing Spy drawer can send live stroke fragments.
drop policy if exists "liar active room members can send broadcasts"
on realtime.messages;
create policy "liar active room members can send broadcasts"
on realtime.messages
for insert
to authenticated
with check (
  extension = 'broadcast'
  and (
    public.liar_can_send_discussion_chat_topic(realtime.topic())
    or public.liar_can_send_drawing_topic(realtime.topic())
  )
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
