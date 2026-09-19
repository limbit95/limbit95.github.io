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
      'stop_turn',
      'prepare_rematch',
      'end_game'
    )
  );

create or replace function public.cant_stop_end_game(
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
    if v_replay_actor <> v_user_id or v_replay_type <> 'end_game' then
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
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
  end if;
  if v_room.status <> 'playing'
    or v_room.game_state is null
    or coalesce(v_room.game_state ->> 'phase', '') = 'GAME_OVER'
  then
    raise exception 'GAME_NOT_PLAYING' using errcode = 'P0001';
  end if;
  if v_room.host_user_id <> v_user_id then
    raise exception 'GAME_END_HOST_REQUIRED' using errcode = 'P0001';
  end if;

  v_game_state := v_room.game_state || jsonb_build_object(
    'phase', 'GAME_OVER',
    'winnerId', null,
    'endReason', 'MANUAL',
    'endedById', v_user_id::text,
    'runners', '{}'::jsonb,
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
    'end_game',
    '{}'::jsonb,
    v_snapshot
  );

  return v_snapshot;
end;
$$;

revoke all on function public.cant_stop_end_game(uuid, bigint, text)
  from public, anon, authenticated;
grant execute on function public.cant_stop_end_game(uuid, bigint, text)
  to authenticated;

commit;
