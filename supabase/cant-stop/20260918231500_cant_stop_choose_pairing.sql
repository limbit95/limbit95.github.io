begin;

alter table public.cant_stop_room_actions
  add column if not exists request_payload jsonb;

alter table public.cant_stop_room_actions
  drop constraint if exists cant_stop_room_actions_action_type_check;

alter table public.cant_stop_room_actions
  add constraint cant_stop_room_actions_action_type_check
  check (action_type in ('set_ready', 'start_game', 'roll_dice', 'choose_pairing'));

create or replace function public.cant_stop_choose_pairing(
  p_room_id uuid,
  p_sums integer[],
  p_columns integer[],
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
  v_replay_payload jsonb;
  v_replay jsonb;
  v_request_payload jsonb;
  v_game_state jsonb;
  v_runners jsonb;
  v_snapshot jsonb;
  v_is_legal boolean;
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
  if p_sums is null
    or array_length(p_sums, 1) <> 2
    or exists (
      select 1
      from unnest(p_sums) as value
      where value not between 2 and 12
    )
  then
    raise exception 'INVALID_PAIRING' using errcode = 'P0001';
  end if;
  if p_columns is null
    or array_length(p_columns, 1) not between 1 and 2
    or exists (
      select 1
      from unnest(p_columns) as value
      where value not between 2 and 12
    )
  then
    raise exception 'INVALID_MOVE_PLAN' using errcode = 'P0001';
  end if;

  v_request_payload := jsonb_build_object(
    'sums', to_jsonb(p_sums),
    'columns', to_jsonb(p_columns)
  );

  perform pg_advisory_xact_lock(
    hashtextextended(p_room_id::text || ':' || v_action_id, 0)
  );

  select
    a.actor_user_id,
    a.action_type,
    a.request_payload,
    a.response_snapshot
  into
    v_replay_actor,
    v_replay_type,
    v_replay_payload,
    v_replay
  from public.cant_stop_room_actions as a
  where a.room_id = p_room_id
    and a.client_action_id = v_action_id;

  if found then
    if v_replay_actor <> v_user_id
      or v_replay_type <> 'choose_pairing'
      or v_replay_payload is distinct from v_request_payload
    then
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

  if v_game_state ->> 'phase' <> 'PAIRING_SELECTION' then
    raise exception 'INVALID_GAME_PHASE' using errcode = 'P0001';
  end if;
  if v_game_state ->> 'activePlayerId' <> v_user_id::text then
    raise exception 'TURN_REQUIRED' using errcode = 'P0001';
  end if;

  select exists (
    select 1
    from jsonb_array_elements(
      coalesce(v_game_state -> 'legalPairings', '[]'::jsonb)
    ) as pairing
    where pairing -> 'sums' = to_jsonb(p_sums)
      and exists (
        select 1
        from jsonb_array_elements(
          coalesce(pairing -> 'plans', '[]'::jsonb)
        ) as plan
        where plan = to_jsonb(p_columns)
      )
  )
  into v_is_legal;

  if not v_is_legal then
    raise exception 'ILLEGAL_PAIRING_CHOICE' using errcode = 'P0001';
  end if;

  v_runners := private.cant_stop_simulate_plan(v_game_state, p_columns);
  if v_runners is null then
    raise exception 'PAIRING_BECAME_INVALID' using errcode = 'P0001';
  end if;

  v_game_state := v_game_state || jsonb_build_object(
    'phase', 'PUSH_OR_STOP',
    'runners', v_runners,
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
    'choose_pairing',
    v_request_payload,
    v_snapshot
  );

  return v_snapshot;
end;
$$;

revoke all on function public.cant_stop_choose_pairing(
  uuid,
  integer[],
  integer[],
  bigint,
  text
) from public, anon, authenticated;

grant execute on function public.cant_stop_choose_pairing(
  uuid,
  integer[],
  integer[],
  bigint,
  text
) to authenticated;

commit;
