begin;

alter table public.cant_stop_room_actions
  drop constraint if exists cant_stop_room_actions_action_type_check;

alter table public.cant_stop_room_actions
  add constraint cant_stop_room_actions_action_type_check
  check (action_type in ('set_ready', 'start_game', 'roll_dice'));

create or replace function private.cant_stop_column_height(p_column integer)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case p_column
    when 2 then 3
    when 3 then 5
    when 4 then 7
    when 5 then 9
    when 6 then 11
    when 7 then 13
    when 8 then 11
    when 9 then 9
    when 10 then 7
    when 11 then 5
    when 12 then 3
    else null
  end;
$$;

create or replace function private.cant_stop_simulate_plan(
  p_game_state jsonb,
  p_columns integer[]
)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_runners jsonb := coalesce(p_game_state -> 'runners', '{}'::jsonb);
  v_claimed jsonb := coalesce(p_game_state -> 'claimedColumns', '{}'::jsonb);
  v_active_player text := p_game_state ->> 'activePlayerId';
  v_progress jsonb := coalesce(
    (p_game_state -> 'playerProgress') -> v_active_player,
    '{}'::jsonb
  );
  v_column integer;
  v_key text;
  v_height integer;
  v_position integer;
  v_has_runner boolean;
begin
  if v_active_player is null then
    return null;
  end if;

  foreach v_column in array p_columns loop
    v_key := v_column::text;
    v_height := private.cant_stop_column_height(v_column);

    if v_height is null or v_claimed ? v_key then
      return null;
    end if;

    v_has_runner := v_runners ? v_key;
    v_position := coalesce(
      nullif(v_runners ->> v_key, '')::integer,
      nullif(v_progress ->> v_key, '')::integer,
      0
    );

    if v_position >= v_height then
      return null;
    end if;

    if not v_has_runner and jsonb_object_length(v_runners) >= 3 then
      return null;
    end if;

    v_runners := jsonb_set(
      v_runners,
      array[v_key],
      to_jsonb(v_position + 1),
      true
    );
  end loop;

  return v_runners;
end;
$$;

create or replace function private.cant_stop_legal_pairings(
  p_game_state jsonb,
  p_dice jsonb
)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_result jsonb := '[]'::jsonb;
  v_plans jsonb;
  v_simulated jsonb;
  v_pair record;
begin
  if jsonb_typeof(p_dice) <> 'array' or jsonb_array_length(p_dice) <> 4 then
    raise exception 'INVALID_DICE' using errcode = 'P0001';
  end if;

  for v_pair in
    with raw(sum_a, sum_b) as (
      values
        (
          (p_dice ->> 0)::integer + (p_dice ->> 1)::integer,
          (p_dice ->> 2)::integer + (p_dice ->> 3)::integer
        ),
        (
          (p_dice ->> 0)::integer + (p_dice ->> 2)::integer,
          (p_dice ->> 1)::integer + (p_dice ->> 3)::integer
        ),
        (
          (p_dice ->> 0)::integer + (p_dice ->> 3)::integer,
          (p_dice ->> 1)::integer + (p_dice ->> 2)::integer
        )
    )
    select distinct
      least(sum_a, sum_b) as sum_a,
      greatest(sum_a, sum_b) as sum_b
    from raw
    order by 1, 2
  loop
    v_plans := '[]'::jsonb;
    v_simulated := private.cant_stop_simulate_plan(
      p_game_state,
      array[v_pair.sum_a, v_pair.sum_b]
    );

    if v_simulated is not null then
      v_plans := jsonb_build_array(
        to_jsonb(array[v_pair.sum_a, v_pair.sum_b])
      );
    else
      v_simulated := private.cant_stop_simulate_plan(
        p_game_state,
        array[v_pair.sum_a]
      );
      if v_simulated is not null then
        v_plans := v_plans || jsonb_build_array(
          to_jsonb(array[v_pair.sum_a])
        );
      end if;

      if v_pair.sum_b <> v_pair.sum_a then
        v_simulated := private.cant_stop_simulate_plan(
          p_game_state,
          array[v_pair.sum_b]
        );
        if v_simulated is not null then
          v_plans := v_plans || jsonb_build_array(
            to_jsonb(array[v_pair.sum_b])
          );
        end if;
      end if;
    end if;

    if jsonb_array_length(v_plans) > 0 then
      v_result := v_result || jsonb_build_array(
        jsonb_build_object(
          'sums', to_jsonb(array[v_pair.sum_a, v_pair.sum_b]),
          'plans', v_plans
        )
      );
    end if;
  end loop;

  return v_result;
end;
$$;

create or replace function public.cant_stop_start_game(
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
  v_player_count integer;
  v_all_ready boolean;
  v_turn_order uuid[];
  v_player_progress jsonb;
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
    if v_replay_actor <> v_user_id or v_replay_type <> 'start_game' then
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
  if v_room.status <> 'waiting' then
    raise exception 'ROOM_NOT_WAITING' using errcode = 'P0001';
  end if;
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
  end if;
  if not private.cant_stop_is_room_member(p_room_id) then
    raise exception 'NOT_ROOM_MEMBER' using errcode = 'P0001';
  end if;
  if v_room.host_user_id <> v_user_id then
    raise exception 'HOST_REQUIRED' using errcode = 'P0001';
  end if;

  select
    count(*)::integer,
    coalesce(bool_and(p.is_ready), false),
    array_agg(p.user_id order by random()),
    coalesce(
      jsonb_object_agg(p.user_id::text, '{}'::jsonb),
      '{}'::jsonb
    )
  into v_player_count, v_all_ready, v_turn_order, v_player_progress
  from public.cant_stop_room_players as p
  where p.room_id = p_room_id
    and p.membership_status = 'active';

  if v_player_count < 2 or v_player_count > v_room.max_players then
    raise exception 'INVALID_PLAYER_COUNT' using errcode = 'P0001';
  end if;
  if not v_all_ready then
    raise exception 'PLAYERS_NOT_READY' using errcode = 'P0001';
  end if;

  v_game_state := jsonb_build_object(
    'phase', 'TURN_ROLL',
    'turnOrder', to_jsonb(v_turn_order),
    'turnIndex', 0,
    'activePlayerId', v_turn_order[1],
    'playerProgress', v_player_progress,
    'claimedColumns', '{}'::jsonb,
    'runners', '{}'::jsonb,
    'latestDice', null,
    'legalPairings', '[]'::jsonb,
    'winnerId', null
  );

  update public.cant_stop_rooms
  set status = 'playing',
      game_state = v_game_state,
      version = version + 1,
      updated_at = now()
  where id = p_room_id;

  v_snapshot := private.cant_stop_room_snapshot(p_room_id);

  insert into public.cant_stop_room_actions(
    room_id,
    client_action_id,
    actor_user_id,
    action_type,
    response_snapshot
  )
  values (
    p_room_id,
    v_action_id,
    v_user_id,
    'start_game',
    v_snapshot
  );

  return v_snapshot;
end;
$$;

create or replace function public.cant_stop_roll_dice(
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
  v_dice jsonb;
  v_legal_pairings jsonb;
  v_turn_count integer;
  v_next_turn_index integer;
  v_next_active_player text;
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
    if v_replay_actor <> v_user_id or v_replay_type <> 'roll_dice' then
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

  if v_game_state ->> 'phase' <> 'TURN_ROLL' then
    raise exception 'INVALID_GAME_PHASE' using errcode = 'P0001';
  end if;
  if v_game_state ->> 'activePlayerId' <> v_user_id::text then
    raise exception 'TURN_REQUIRED' using errcode = 'P0001';
  end if;

  v_dice := jsonb_build_array(
    1 + floor(random() * 6)::integer,
    1 + floor(random() * 6)::integer,
    1 + floor(random() * 6)::integer,
    1 + floor(random() * 6)::integer
  );

  v_legal_pairings := private.cant_stop_legal_pairings(v_game_state, v_dice);

  if jsonb_array_length(v_legal_pairings) = 0 then
    v_turn_count := jsonb_array_length(v_game_state -> 'turnOrder');
    if v_turn_count < 2 then
      raise exception 'INVALID_TURN_ORDER' using errcode = 'P0001';
    end if;

    v_next_turn_index := (
      coalesce((v_game_state ->> 'turnIndex')::integer, 0) + 1
    ) % v_turn_count;
    v_next_active_player := v_game_state -> 'turnOrder' ->> v_next_turn_index;

    v_game_state := v_game_state || jsonb_build_object(
      'phase', 'TURN_ROLL',
      'turnIndex', v_next_turn_index,
      'activePlayerId', v_next_active_player,
      'runners', '{}'::jsonb,
      'latestDice', null,
      'legalPairings', '[]'::jsonb
    );
  else
    v_game_state := v_game_state || jsonb_build_object(
      'phase', 'PAIRING_SELECTION',
      'latestDice', v_dice,
      'legalPairings', v_legal_pairings
    );
  end if;

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
    response_snapshot
  )
  values (
    p_room_id,
    v_action_id,
    v_user_id,
    'roll_dice',
    v_snapshot
  );

  return v_snapshot;
end;
$$;

revoke all on function private.cant_stop_column_height(integer)
  from public, anon, authenticated;
revoke all on function private.cant_stop_simulate_plan(jsonb, integer[])
  from public, anon, authenticated;
revoke all on function private.cant_stop_legal_pairings(jsonb, jsonb)
  from public, anon, authenticated;

revoke all on function public.cant_stop_roll_dice(uuid, bigint, text)
  from public, anon, authenticated;
grant execute on function public.cant_stop_roll_dice(uuid, bigint, text)
  to authenticated;

commit;
