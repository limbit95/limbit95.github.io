alter table public.marble_game_players
  add column if not exists forfeited boolean not null default false;

create or replace function private.marble_game_snapshot(p_room_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_room public.marble_rooms%rowtype;
  v_game public.marble_games%rowtype;
  v_players jsonb;
  v_properties jsonb;
  v_viewer_player_id text;
  v_winner_player_id text;
begin
  select * into v_room from public.marble_rooms where id = p_room_id;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;

  select * into v_game from public.marble_games where id = v_room.current_game_id and room_id = p_room_id;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', gp.room_player_id::text,
    'userId', gp.user_id,
    'name', gp.nickname,
    'seat', gp.seat,
    'positionIndex', gp.position_index,
    'positionNodeId', n.node_id,
    'money', gp.money,
    'bankrupt', gp.bankrupt,
    'forfeited', gp.forfeited,
    'skipTurns', gp.skip_turns
  ) order by gp.seat), '[]'::jsonb)
  into v_players
  from public.marble_game_players gp
  join private.marble_classic_nodes n on n.node_index = gp.position_index
  where gp.game_id = v_game.id;

  select coalesce(jsonb_object_agg(p.node_id, jsonb_build_object(
    'ownerId', owner.room_player_id::text,
    'ownerSeat', p.owner_seat,
    'buildingLevel', p.building_level
  )), '{}'::jsonb)
  into v_properties
  from public.marble_game_properties p
  left join public.marble_game_players owner
    on owner.game_id = p.game_id and owner.seat = p.owner_seat
  where p.game_id = v_game.id;

  select gp.room_player_id::text into v_viewer_player_id
  from public.marble_game_players gp
  where gp.game_id = v_game.id and gp.user_id = auth.uid();

  if v_game.winner_seat is not null then
    select gp.room_player_id::text into v_winner_player_id
    from public.marble_game_players gp
    where gp.game_id = v_game.id and gp.seat = v_game.winner_seat;
  end if;

  return jsonb_build_object(
    'room', jsonb_build_object(
      'id', v_room.id,
      'roomCode', v_room.room_code,
      'status', v_room.status,
      'version', v_room.version,
      'currentGameId', v_room.current_game_id
    ),
    'game', jsonb_build_object(
      'id', v_game.id,
      'status', v_game.status,
      'phase', v_game.phase,
      'turn', v_game.turn_number,
      'currentSeat', v_game.current_seat,
      'version', v_game.version,
      'pendingChoice', v_game.pending_choice,
      'lastRoll', v_game.last_roll,
      'lastEvents', v_game.last_events,
      'winnerSeat', v_game.winner_seat,
      'winnerPlayerId', v_winner_player_id,
      'rulesetVersion', v_game.ruleset_version
    ),
    'players', v_players,
    'properties', v_properties,
    'viewerUserId', auth.uid(),
    'viewerPlayerId', v_viewer_player_id
  );
end;
$$;

create or replace function public.marble_forfeit_game(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_room public.marble_rooms%rowtype;
  v_game public.marble_games%rowtype;
  v_actor public.marble_game_players%rowtype;
  v_candidate public.marble_game_players%rowtype;
  v_request jsonb := jsonb_build_object('action', 'forfeit');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_membership_status text;
  v_events jsonb := '[]'::jsonb;
  v_active integer;
  v_winner smallint;
  v_winner_id text;
  v_next_host uuid;
  v_cursor smallint;
  v_turn integer;
  v_checks integer;
  v_max_checks integer;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;

  select * into v_room
  from public.marble_rooms
  where id = p_room_id
  for update;

  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;

  select * into v_game
  from public.marble_games
  where id = v_room.current_game_id and room_id = p_room_id
  for update;

  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(v_game.id, v_user, p_client_action_id, 'forfeit', v_request);
  if v_replay is not null then return v_replay; end if;

  if v_game.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;

  select * into v_actor
  from public.marble_game_players
  where game_id = v_game.id and user_id = v_user;

  if not found then raise exception 'NOT_GAME_MEMBER'; end if;

  select membership_status into v_membership_status
  from public.marble_room_players
  where id = v_actor.room_player_id;

  if v_membership_status is distinct from 'active' then raise exception 'NOT_ROOM_MEMBER'; end if;

  v_before := v_game.version;

  if v_game.status = 'finished' or v_actor.bankrupt then
    update public.marble_room_players
    set membership_status = 'left', is_ready = false, left_at = now()
    where id = v_actor.room_player_id and membership_status = 'active';

    if v_room.host_user_id = v_user then
      select rp.user_id into v_next_host
      from public.marble_room_players rp
      left join public.marble_game_players gp
        on gp.game_id = v_game.id and gp.room_player_id = rp.id
      where rp.room_id = p_room_id
        and rp.membership_status = 'active'
        and coalesce(gp.bankrupt, false) = false
      order by rp.seat
      limit 1;
    end if;

    update public.marble_rooms
    set host_user_id = coalesce(v_next_host, host_user_id),
        version = version + 1,
        updated_at = now()
    where id = p_room_id;

    v_response := private.marble_game_snapshot(p_room_id);
    perform private.marble_record_action(v_game.id, v_user, p_client_action_id, 'forfeit', v_request, v_before, v_response);
    return v_response;
  end if;

  if v_game.status <> 'playing' or v_room.status <> 'playing' then raise exception 'GAME_NOT_PLAYING'; end if;

  update public.marble_game_players
  set money = 0,
      bankrupt = true,
      forfeited = true,
      skip_turns = 0
  where id = v_actor.id;

  update public.marble_game_properties
  set owner_seat = null,
      building_level = 0
  where game_id = v_game.id and owner_seat = v_actor.seat;

  update public.marble_room_players
  set membership_status = 'left', is_ready = false, left_at = now()
  where id = v_actor.room_player_id and membership_status = 'active';

  v_events := jsonb_build_array(jsonb_build_object(
    'type', 'PLAYER_FORFEITED',
    'playerId', v_actor.room_player_id::text
  ));

  select count(*)::integer into v_active
  from public.marble_game_players
  where game_id = v_game.id and not bankrupt;

  if v_room.host_user_id = v_user then
    select rp.user_id into v_next_host
    from public.marble_room_players rp
    join public.marble_game_players gp
      on gp.game_id = v_game.id and gp.room_player_id = rp.id
    where rp.room_id = p_room_id
      and rp.membership_status = 'active'
      and not gp.bankrupt
    order by rp.seat
    limit 1;
  end if;

  if v_active <= 1 then
    select seat, room_player_id::text
    into v_winner, v_winner_id
    from public.marble_game_players
    where game_id = v_game.id and not bankrupt
    order by seat
    limit 1;

    if v_winner_id is not null then
      v_events := v_events || jsonb_build_array(jsonb_build_object(
        'type', 'GAME_FINISHED',
        'winnerPlayerId', v_winner_id
      ));
    end if;

    update public.marble_games
    set status = 'finished',
        phase = 'FINISHED',
        pending_choice = null,
        winner_seat = v_winner,
        last_events = v_events,
        version = version + 1,
        updated_at = now()
    where id = v_game.id;

    update public.marble_rooms
    set status = 'closed',
        host_user_id = coalesce(v_next_host, host_user_id),
        version = version + 1,
        updated_at = now()
    where id = p_room_id;
  elsif v_actor.seat = v_game.current_seat then
    v_cursor := v_game.current_seat;
    v_turn := v_game.turn_number;
    select count(*)::integer * 4 into v_max_checks
    from public.marble_game_players
    where game_id = v_game.id;

    for v_checks in 1..v_max_checks loop
      select * into v_candidate
      from public.marble_game_players
      where game_id = v_game.id and seat > v_cursor
      order by seat
      limit 1;

      if not found then
        select * into v_candidate
        from public.marble_game_players
        where game_id = v_game.id
        order by seat
        limit 1;
      end if;

      v_cursor := v_candidate.seat;
      v_turn := v_turn + 1;

      if v_candidate.bankrupt then continue; end if;

      if v_candidate.skip_turns > 0 then
        update public.marble_game_players
        set skip_turns = skip_turns - 1
        where id = v_candidate.id;
        v_events := v_events || jsonb_build_array(jsonb_build_object(
          'type', 'TURN_SKIPPED',
          'playerId', v_candidate.room_player_id::text
        ));
        continue;
      end if;

      update public.marble_games
      set current_seat = v_candidate.seat,
          turn_number = v_turn,
          phase = 'WAITING_ROLL',
          pending_choice = null,
          last_events = v_events,
          version = version + 1,
          updated_at = now()
      where id = v_game.id;
      exit;
    end loop;

    if not found then raise exception 'NO_ACTIVE_PLAYER'; end if;

    update public.marble_rooms
    set host_user_id = coalesce(v_next_host, host_user_id),
        version = version + 1,
        updated_at = now()
    where id = p_room_id;
  else
    update public.marble_games
    set last_events = v_events,
        version = version + 1,
        updated_at = now()
    where id = v_game.id;

    update public.marble_rooms
    set host_user_id = coalesce(v_next_host, host_user_id),
        version = version + 1,
        updated_at = now()
    where id = p_room_id;
  end if;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id, v_user, p_client_action_id, 'forfeit', v_request, v_before, v_response);
  return v_response;
end;
$$;

revoke all on function public.marble_forfeit_game(uuid,bigint,uuid) from public, anon;
grant execute on function public.marble_forfeit_game(uuid,bigint,uuid) to authenticated;

revoke execute on function public.marble_end_game(uuid,bigint) from authenticated;
