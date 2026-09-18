begin;

alter table public.cant_stop_room_actions
  drop constraint if exists cant_stop_room_actions_action_type_check;

alter table public.cant_stop_room_actions
  add constraint cant_stop_room_actions_action_type_check
  check (
    action_type in (
      'set_ready',
      'start_game',
      'roll_dice',
      'choose_pairing',
      'continue_turn',
      'stop_turn'
    )
  );

create or replace function private.cant_stop_commit_stop(
  p_game_state jsonb
)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_state jsonb := coalesce(p_game_state, '{}'::jsonb);
  v_active_player text := v_state ->> 'activePlayerId';
  v_player_progress jsonb := coalesce(v_state -> 'playerProgress', '{}'::jsonb);
  v_active_progress jsonb;
  v_claimed jsonb := coalesce(v_state -> 'claimedColumns', '{}'::jsonb);
  v_runners jsonb := coalesce(v_state -> 'runners', '{}'::jsonb);
  v_column record;
  v_player_key text;
  v_other_progress jsonb;
  v_height integer;
  v_claimed_count integer;
  v_turn_count integer;
  v_next_turn_index integer;
  v_next_active_player text;
begin
  if v_active_player is null then
    raise exception 'INVALID_ACTIVE_PLAYER' using errcode = 'P0001';
  end if;

  v_active_progress := coalesce(
    v_player_progress -> v_active_player,
    '{}'::jsonb
  );

  for v_column in
    select key, value::integer as position
    from jsonb_each_text(v_runners)
  loop
    v_height := private.cant_stop_column_height(v_column.key::integer);
    if v_height is null
      or v_column.position < 1
      or v_column.position > v_height
    then
      raise exception 'INVALID_RUNNER_STATE' using errcode = 'P0001';
    end if;

    v_active_progress := jsonb_set(
      v_active_progress,
      array[v_column.key],
      to_jsonb(v_column.position),
      true
    );

    if v_column.position = v_height then
      v_claimed := jsonb_set(
        v_claimed,
        array[v_column.key],
        to_jsonb(v_active_player),
        true
      );

      for v_player_key in
        select player_key
        from jsonb_object_keys(v_player_progress) as keys(player_key)
        where player_key <> v_active_player
      loop
        v_other_progress := coalesce(
          v_player_progress -> v_player_key,
          '{}'::jsonb
        ) - v_column.key;

        v_player_progress := jsonb_set(
          v_player_progress,
          array[v_player_key],
          v_other_progress,
          true
        );
      end loop;
    end if;
  end loop;

  v_player_progress := jsonb_set(
    v_player_progress,
    array[v_active_player],
    v_active_progress,
    true
  );

  select count(*)::integer
  into v_claimed_count
  from jsonb_each_text(v_claimed)
  where value = v_active_player;

  v_state := v_state || jsonb_build_object(
    'playerProgress', v_player_progress,
    'claimedColumns', v_claimed,
    'runners', '{}'::jsonb,
    'latestDice', null,
    'legalPairings', '[]'::jsonb
  );

  if v_claimed_count >= 3 then
    return v_state || jsonb_build_object(
      'phase', 'GAME_OVER',
      'winnerId', v_active_player
    );
  end if;

  v_turn_count := jsonb_array_length(v_state -> 'turnOrder');
  if v_turn_count < 2 then
    raise exception 'INVALID_TURN_ORDER' using errcode = 'P0001';
  end if;

  v_next_turn_index := (
    coalesce((v_state ->> 'turnIndex')::integer, 0) + 1
  ) % v_turn_count;
  v_next_active_player := v_state -> 'turnOrder' ->> v_next_turn_index;

  return v_state || jsonb_build_object(
    'phase', 'TURN_ROLL',
    'turnIndex', v_next_turn_index,
    'activePlayerId', v_next_active_player,
    'winnerId', null
  );
end;
$$;

create or replace function public.cant_stop_continue_turn(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_action_id text := btrim(coalesce(p_client_action_id, ''));
  v_room public.cant_stop_rooms%rowtype;
  v_replay_actor uuid;
  v_replay_type text;
  v_replay jsonb;
  v_game_state jsonb;
  v_snapshot jsonb;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if char_length(v_action_id) not between 1 and 100 then
    raise exception 'INVALID_ACTION_ID' using errcode = 'P0001';
  end if;
  if not private.cant_stop_is_room_member(p_room_id) then
    raise exception 'NOT_ROOM_MEMBER' using errcode = 'P0001';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(p_room_id::text || ':' || v_action_id, 0)
  );

  select a.actor_user_id, a.action_type, a.response_snapshot
  into v_replay_actor, v_replay_type, v_replay
  from public.cant_stop_room_actions as a
  where a.room_id = p_room_id
    and a.client_action_id = v_action_id;

  if found then
    if v_replay_actor <> v_user_id or v_replay_type <> 'continue_turn' then
      raise exception 'ACTION_ID_CONFLICT' using errcode = 'P0001';
    end if;
    return v_replay;
  end if;

  select r.*
  into v_room
  from public.cant_stop_rooms as r
  where r.id = p_room_id
  for update;

  if not found then
    raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_room.status <> 'playing' or v_room.game_state is null then
    raise exception 'GAME_NOT_PLAYING' using errcode = 'P0001';
  end if;
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
  end if;

  v_game_state := v_room.game_state;

  if v_game_state ->> 'phase' <> 'PUSH_OR_STOP' then
    raise exception 'INVALID_GAME_PHASE' using errcode = 'P0001';
  end if;
  if v_game_state ->> 'activePlayerId' <> v_user_id::text then
    raise exception 'TURN_REQUIRED' using errcode = 'P0001';
  end if;

  v_game_state := v_game_state || jsonb_build_object(
    'phase', 'TURN_ROLL',
    'latestDice', null,
    'legalPairings', '[]'::jsonb
  );

  update public.cant_stop_rooms
  set game_state = v_game_state,
      version = version + 1,
      updated_at = now()
  where id = p_room_id;

  v_snapshot := private.cant_stop_room_snapshot(p_room_id);

  insert into public.cant_stop_room_actions(
    room_id,
    client_action_id,
    actor_user_id,
    action_type,
    request_payload,
    response_snapshot
  )
  values (
    p_room_id,
    v_action_id,
    v_user_id,
    'continue_turn',
    '{}'::jsonb,
    v_snapshot
  );

  return v_snapshot;
end;
$$;

create or replace function public.cant_stop_stop_turn(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_action_id text := btrim(coalesce(p_client_action_id, ''));
  v_room public.cant_stop_rooms%rowtype;
  v_replay_actor uuid;
  v_replay_type text;
  v_replay jsonb;
  v_game_state jsonb;
  v_snapshot jsonb;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if char_length(v_action_id) not between 1 and 100 then
    raise exception 'INVALID_ACTION_ID' using errcode = 'P0001';
  end if;
  if not private.cant_stop_is_room_member(p_room_id) then
    raise exception 'NOT_ROOM_MEMBER' using errcode = 'P0001';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(p_room_id::text || ':' || v_action_id, 0)
  );

  select a.actor_user_id, a.action_type, a.response_snapshot
  into v_replay_actor, v_replay_type, v_replay
  from public.cant_stop_room_actions as a
  where a.room_id = p_room_id
    and a.client_action_id = v_action_id;

  if found then
    if v_replay_actor <> v_user_id or v_replay_type <> 'stop_turn' then
      raise exception 'ACTION_ID_CONFLICT' using errcode = 'P0001';
    end if;
    return v_replay;
  end if;

  select r.*
  into v_room
  from public.cant_stop_rooms as r
  where r.id = p_room_id
  for update;

  if not found then
    raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_room.status <> 'playing' or v_room.game_state is null then
    raise exception 'GAME_NOT_PLAYING' using errcode = 'P0001';
  end if;
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
  end if;

  v_game_state := v_room.game_state;

  if v_game_state ->> 'phase' <> 'PUSH_OR_STOP' then
    raise exception 'INVALID_GAME_PHASE' using errcode = 'P0001';
  end if;
  if v_game_state ->> 'activePlayerId' <> v_user_id::text then
    raise exception 'TURN_REQUIRED' using errcode = 'P0001';
  end if;

  v_game_state := private.cant_stop_commit_stop(v_game_state);

  update public.cant_stop_rooms
  set game_state = v_game_state,
      version = version + 1,
      updated_at = now()
  where id = p_room_id;

  v_snapshot := private.cant_stop_room_snapshot(p_room_id);

  insert into public.cant_stop_room_actions(
    room_id,
    client_action_id,
    actor_user_id,
    action_type,
    request_payload,
    response_snapshot
  )
  values (
    p_room_id,
    v_action_id,
    v_user_id,
    'stop_turn',
    '{}'::jsonb,
    v_snapshot
  );

  return v_snapshot;
end;
$$;

revoke all on function private.cant_stop_commit_stop(jsonb)
  from public, anon, authenticated;

revoke all on function public.cant_stop_continue_turn(uuid, bigint, text)
  from public, anon, authenticated;
grant execute on function public.cant_stop_continue_turn(uuid, bigint, text)
  to authenticated;

revoke all on function public.cant_stop_stop_turn(uuid, bigint, text)
  from public, anon, authenticated;
grant execute on function public.cant_stop_stop_turn(uuid, bigint, text)
  to authenticated;

commit;
