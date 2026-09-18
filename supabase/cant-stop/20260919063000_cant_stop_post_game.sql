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
      'prepare_rematch'
    )
  );

create or replace function public.cant_stop_leave_room(
  p_room_id uuid,
  p_expected_version bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_room public.cant_stop_rooms%rowtype;
  v_next_host uuid;
  v_game_over boolean;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  select r.*
  into v_room
  from public.cant_stop_rooms as r
  where r.id = p_room_id
  for update;

  if not found then
    raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001';
  end if;

  v_game_over := v_room.status = 'playing'
    and coalesce(v_room.game_state ->> 'phase', '') = 'GAME_OVER';

  if v_room.status <> 'waiting' and not v_game_over then
    raise exception 'ROOM_NOT_LEAVABLE' using errcode = 'P0001';
  end if;
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
  end if;
  if not private.cant_stop_is_room_member(p_room_id) then
    raise exception 'NOT_ROOM_MEMBER' using errcode = 'P0001';
  end if;

  update public.cant_stop_room_players
  set membership_status = 'left',
      is_ready = false,
      left_at = now()
  where room_id = p_room_id
    and user_id = v_user_id
    and membership_status = 'active';

  if v_room.host_user_id = v_user_id then
    select p.user_id
    into v_next_host
    from public.cant_stop_room_players as p
    where p.room_id = p_room_id
      and p.membership_status = 'active'
    order by p.seat
    limit 1;
  else
    v_next_host := v_room.host_user_id;
  end if;

  if v_next_host is null then
    update public.cant_stop_rooms
    set status = 'closed',
        version = version + 1,
        updated_at = now()
    where id = p_room_id;
    return null;
  end if;

  update public.cant_stop_rooms
  set host_user_id = v_next_host,
      version = version + 1,
      updated_at = now()
  where id = p_room_id;

  if v_room.status = 'waiting' then
    update public.cant_stop_room_players
    set is_ready = true
    where room_id = p_room_id
      and user_id = v_next_host
      and membership_status = 'active';
  end if;

  return null;
end;
$$;

create or replace function public.cant_stop_prepare_rematch(
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
    if v_replay_actor <> v_user_id or v_replay_type <> 'prepare_rematch' then
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
    or coalesce(v_room.game_state ->> 'phase', '') <> 'GAME_OVER'
  then
    raise exception 'GAME_NOT_OVER' using errcode = 'P0001';
  end if;
  if v_room.host_user_id <> v_user_id then
    raise exception 'HOST_REQUIRED' using errcode = 'P0001';
  end if;
  if not private.cant_stop_is_room_member(p_room_id) then
    raise exception 'NOT_ROOM_MEMBER' using errcode = 'P0001';
  end if;

  update public.cant_stop_room_players
  set is_ready = (user_id = v_user_id)
  where room_id = p_room_id
    and membership_status = 'active';

  update public.cant_stop_rooms
  set status = 'waiting',
      game_state = null,
      version = version + 1,
      updated_at = now(),
      expires_at = now() + interval '8 hours'
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
    'prepare_rematch',
    '{}'::jsonb,
    v_snapshot
  );

  return v_snapshot;
end;
$$;

revoke all on function public.cant_stop_prepare_rematch(uuid, bigint, text)
  from public, anon, authenticated;
grant execute on function public.cant_stop_prepare_rematch(uuid, bigint, text)
  to authenticated;

commit;
