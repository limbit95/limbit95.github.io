begin;

alter table public.no_thanks_room_actions
  drop constraint if exists no_thanks_room_actions_action_type_check;

alter table public.no_thanks_room_actions
  add constraint no_thanks_room_actions_action_type_check
  check (action_type in (
    'set_ready',
    'start_game',
    'refuse_card',
    'take_card',
    'end_game',
    'prepare_rematch'
  ));

create or replace function public.no_thanks_prepare_rematch(
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
  v_room public.no_thanks_rooms%rowtype;
  v_existing public.no_thanks_room_actions%rowtype;
  v_payload jsonb := '{}'::jsonb;
  v_snapshot jsonb;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;
  if p_client_action_id is null or btrim(p_client_action_id) = '' then
    raise exception 'INVALID_ACTION_ID';
  end if;

  select *
    into v_existing
  from public.no_thanks_room_actions
  where room_id = p_room_id
    and client_action_id = p_client_action_id;

  if found then
    if v_existing.actor_user_id <> v_user_id
      or v_existing.action_type <> 'prepare_rematch'
      or v_existing.request_payload <> v_payload then
      raise exception 'ACTION_CONFLICT';
    end if;
    return v_existing.response_snapshot;
  end if;

  select *
    into v_room
  from public.no_thanks_rooms
  where id = p_room_id
  for update;

  if not found
    or v_room.status <> 'playing'
    or coalesce(v_room.game_state ->> 'phase', '') <> 'GAME_OVER' then
    raise exception 'REMATCH_NOT_AVAILABLE';
  end if;
  if v_room.host_user_id <> v_user_id then
    raise exception 'HOST_REQUIRED';
  end if;
  if v_room.version is distinct from p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;
  if not exists (
    select 1
    from public.no_thanks_room_players
    where room_id = p_room_id
      and user_id = v_user_id
      and membership_status = 'active'
  ) then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  update public.no_thanks_room_players
  set is_ready = false,
      cards = '{}'::integer[]
  where room_id = p_room_id;

  delete from public.no_thanks_room_private_state
  where room_id = p_room_id;

  update public.no_thanks_rooms
  set status = 'waiting',
      game_state = null,
      version = version + 1,
      updated_at = now(),
      expires_at = now() + interval '8 hours'
  where id = p_room_id;

  v_snapshot := private.no_thanks_snapshot(p_room_id, v_user_id);

  insert into public.no_thanks_room_actions(
    room_id,
    client_action_id,
    actor_user_id,
    action_type,
    request_payload,
    response_snapshot
  )
  values (
    p_room_id,
    p_client_action_id,
    v_user_id,
    'prepare_rematch',
    v_payload,
    v_snapshot
  );

  return v_snapshot;
end;
$$;

create or replace function public.no_thanks_leave_room(
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
  v_room public.no_thanks_rooms%rowtype;
  v_game_phase text;
  v_next_host uuid;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
    into v_room
  from public.no_thanks_rooms
  where id = p_room_id
  for update;

  if not found then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  v_game_phase := coalesce(v_room.game_state ->> 'phase', '');
  if v_room.status = 'playing' and v_game_phase <> 'GAME_OVER' then
    raise exception 'GAME_IN_PROGRESS';
  end if;
  if v_room.status not in ('waiting', 'playing') then
    raise exception 'ROOM_NOT_FOUND';
  end if;
  if v_room.version is distinct from p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;
  if not exists (
    select 1
    from public.no_thanks_room_players
    where room_id = p_room_id
      and user_id = v_user_id
      and membership_status = 'active'
  ) then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  if v_room.status = 'waiting' and v_room.host_user_id = v_user_id then
    update public.no_thanks_room_players
    set membership_status = 'left',
        left_at = now(),
        is_ready = false
    where room_id = p_room_id
      and membership_status = 'active';

    update public.no_thanks_rooms
    set status = 'closed',
        version = version + 1,
        updated_at = now()
    where id = p_room_id;

    return jsonb_build_object('left', true, 'roomId', p_room_id);
  end if;

  update public.no_thanks_room_players
  set membership_status = 'left',
      left_at = now(),
      is_ready = false
  where room_id = p_room_id
    and user_id = v_user_id;

  if v_room.host_user_id = v_user_id then
    select p.user_id
      into v_next_host
    from public.no_thanks_room_players as p
    where p.room_id = p_room_id
      and p.membership_status = 'active'
    order by p.seat
    limit 1;

    if v_next_host is null then
      update public.no_thanks_rooms
      set status = 'closed',
          version = version + 1,
          updated_at = now()
      where id = p_room_id;
    else
      update public.no_thanks_rooms
      set host_user_id = v_next_host,
          version = version + 1,
          updated_at = now()
      where id = p_room_id;
    end if;
  else
    update public.no_thanks_rooms
    set version = version + 1,
        updated_at = now()
    where id = p_room_id;
  end if;

  return jsonb_build_object('left', true, 'roomId', p_room_id);
end;
$$;

revoke all on function public.no_thanks_prepare_rematch(uuid, bigint, text)
  from public, anon, authenticated;
grant execute on function public.no_thanks_prepare_rematch(uuid, bigint, text)
  to authenticated;

commit;
