create or replace function public.marble_end_game(p_room_id uuid, p_expected_version bigint)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_room public.marble_rooms%rowtype;
  v_game public.marble_games%rowtype;
  v_player_id text;
  v_event_type text;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;

  select * into v_room
  from public.marble_rooms
  where id = p_room_id
  for update;

  if not found then raise exception 'ROOM_NOT_FOUND'; end if;
  if not public.marble_is_room_member(p_room_id) then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;

  select * into v_game
  from public.marble_games
  where id = v_room.current_game_id and room_id = p_room_id
  for update;

  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  if v_room.status = 'closed' or v_game.status = 'abandoned' then
    return private.marble_game_snapshot(p_room_id);
  end if;

  if v_game.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;

  select gp.room_player_id::text into v_player_id
  from public.marble_game_players gp
  where gp.game_id = v_game.id and gp.user_id = auth.uid();

  if v_player_id is null then raise exception 'NOT_GAME_MEMBER'; end if;

  if v_game.status = 'playing' then
    v_event_type := 'GAME_ABANDONED';
    update public.marble_games
    set status = 'abandoned',
        phase = 'FINISHED',
        pending_choice = null,
        last_events = jsonb_build_array(jsonb_build_object(
          'type', v_event_type,
          'playerId', v_player_id
        )),
        version = version + 1,
        updated_at = now()
    where id = v_game.id;
  elsif v_game.status = 'finished' then
    v_event_type := 'GAME_SESSION_CLOSED';
    update public.marble_games
    set last_events = jsonb_build_array(jsonb_build_object(
          'type', v_event_type,
          'playerId', v_player_id
        )),
        version = version + 1,
        updated_at = now()
    where id = v_game.id;
  else
    raise exception 'GAME_NOT_ACTIVE';
  end if;

  update public.marble_rooms
  set status = 'closed',
      version = version + 1,
      updated_at = now()
  where id = p_room_id;

  return private.marble_game_snapshot(p_room_id);
end;
$$;

revoke all on function public.marble_end_game(uuid,bigint) from public, anon;
grant execute on function public.marble_end_game(uuid,bigint) to authenticated;
