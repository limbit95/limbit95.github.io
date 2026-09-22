begin;

alter table public.no_thanks_room_actions
  drop constraint if exists no_thanks_room_actions_action_type_check;

alter table public.no_thanks_room_actions
  add constraint no_thanks_room_actions_action_type_check
  check (
    action_type in (
      'set_ready',
      'start_game',
      'refuse_card',
      'take_card',
      'end_game',
      'prepare_rematch'
    )
  );

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
  v_snapshot jsonb;
  v_turn_player_count integer;
  v_active_player_count integer;
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
      or v_existing.request_payload <> '{}'::jsonb then
      raise exception 'ACTION_CONFLICT';
    end if;
    return v_existing.response_snapshot;
  end if;

  select *
    into v_room
  from public.no_thanks_rooms
  where id = p_room_id
  for update;

  if not found then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  select *
    into v_existing
  from public.no_thanks_room_actions
  where room_id = p_room_id
    and client_action_id = p_client_action_id;

  if found then
    if v_existing.actor_user_id <> v_user_id
      or v_existing.action_type <> 'prepare_rematch'
      or v_existing.request_payload <> '{}'::jsonb then
      raise exception 'ACTION_CONFLICT';
    end if;
    return v_existing.response_snapshot;
  end if;

  if v_room.host_user_id <> v_user_id then
    raise exception 'HOST_REQUIRED';
  end if;
  if v_room.version is distinct from p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;
  if v_room.status <> 'playing'
    or coalesce(v_room.game_state ->> 'phase', '') <> 'GAME_OVER' then
    raise exception 'REMATCH_NOT_READY';
  end if;

  select jsonb_array_length(coalesce(v_room.game_state -> 'turnOrder', '[]'::jsonb))
    into v_turn_player_count;

  select count(*)
    into v_active_player_count
  from public.no_thanks_room_players as p
  where p.room_id = p_room_id
    and p.membership_status = 'active'
    and exists (
      select 1
      from jsonb_array_elements_text(
        coalesce(v_room.game_state -> 'turnOrder', '[]'::jsonb)
      ) as turn_player(player_id)
      where turn_player.player_id = p.user_id::text
    );

  if v_turn_player_count < 3
    or v_turn_player_count > 7
    or v_active_player_count <> v_turn_player_count then
    raise exception 'REMATCH_PLAYERS_CHANGED';
  end if;

  update public.no_thanks_room_players
  set is_ready = false,
      cards = '{}'::integer[]
  where room_id = p_room_id
    and membership_status = 'active';

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
    '{}'::jsonb,
    v_snapshot
  );

  return v_snapshot;
end;
$$;

revoke all on function public.no_thanks_prepare_rematch(uuid, bigint, text)
  from public, anon, authenticated;
grant execute on function public.no_thanks_prepare_rematch(uuid, bigint, text)
  to authenticated;

commit;
