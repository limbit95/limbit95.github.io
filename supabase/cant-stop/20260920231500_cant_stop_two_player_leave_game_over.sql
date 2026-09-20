begin;

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
  v_active_count integer;
  v_game_state jsonb;
  v_turn_order jsonb;
  v_next_turn_order jsonb;
  v_player_progress jsonb;
  v_claimed_columns jsonb;
  v_turn_index integer;
  v_next_turn_index integer;
  v_next_active_player text;
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
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
  end if;
  if not private.cant_stop_is_room_member(p_room_id) then
    raise exception 'NOT_ROOM_MEMBER' using errcode = 'P0001';
  end if;

  v_game_over := v_room.status = 'playing'
    and coalesce(v_room.game_state ->> 'phase', '') = 'GAME_OVER';

  if v_room.status = 'playing' and not v_game_over then
    if v_room.host_user_id = v_user_id then
      raise exception 'ACTIVE_HOST_MUST_END_GAME' using errcode = 'P0001';
    end if;

    v_game_state := coalesce(v_room.game_state, '{}'::jsonb);

    if coalesce(v_game_state ->> 'activePlayerId', '') <> v_user_id::text then
      raise exception 'LEAVE_TURN_REQUIRED' using errcode = 'P0001';
    end if;

    select count(*)::integer
    into v_active_count
    from public.cant_stop_room_players as p
    where p.room_id = p_room_id
      and p.membership_status = 'active';

    if v_active_count < 2 then
      raise exception 'ROOM_NOT_LEAVABLE' using errcode = 'P0001';
    end if;

    v_turn_order := coalesce(v_game_state -> 'turnOrder', '[]'::jsonb);

    select coalesce(
      jsonb_agg(to_jsonb(turn_item.player_id) order by turn_item.ordinality),
      '[]'::jsonb
    )
    into v_next_turn_order
    from jsonb_array_elements_text(v_turn_order)
      with ordinality as turn_item(player_id, ordinality)
    where turn_item.player_id <> v_user_id::text;

    if jsonb_array_length(v_next_turn_order) < 1 then
      raise exception 'ROOM_NOT_LEAVABLE' using errcode = 'P0001';
    end if;

    v_turn_index := coalesce((v_game_state ->> 'turnIndex')::integer, 0);
    v_next_turn_index := v_turn_index % jsonb_array_length(v_next_turn_order);
    v_next_active_player := v_next_turn_order ->> v_next_turn_index;

    v_player_progress := coalesce(
      v_game_state -> 'playerProgress',
      '{}'::jsonb
    ) - v_user_id::text;

    select coalesce(
      jsonb_object_agg(claimed.key, claimed.value),
      '{}'::jsonb
    )
    into v_claimed_columns
    from jsonb_each(
      coalesce(v_game_state -> 'claimedColumns', '{}'::jsonb)
    ) as claimed
    where claimed.value <> to_jsonb(v_user_id::text);

    if v_active_count = 2 then
      v_game_state := (
        v_game_state
        - 'endReason'
        - 'endedById'
      ) || jsonb_build_object(
        'phase', 'GAME_OVER',
        'turnOrder', v_next_turn_order,
        'turnIndex', 0,
        'activePlayerId', v_next_active_player,
        'playerProgress', v_player_progress,
        'claimedColumns', v_claimed_columns,
        'runners', '{}'::jsonb,
        'latestDice', null,
        'legalPairings', '[]'::jsonb,
        'winnerId', null,
        'endReason', 'PLAYER_LEFT',
        'endedById', v_user_id::text
      );
    else
      v_game_state := (
        v_game_state
        - 'endReason'
        - 'endedById'
      ) || jsonb_build_object(
        'phase', 'TURN_ROLL',
        'turnOrder', v_next_turn_order,
        'turnIndex', v_next_turn_index,
        'activePlayerId', v_next_active_player,
        'playerProgress', v_player_progress,
        'claimedColumns', v_claimed_columns,
        'runners', '{}'::jsonb,
        'latestDice', null,
        'legalPairings', '[]'::jsonb,
        'winnerId', null
      );
    end if;

    update public.cant_stop_room_players
    set membership_status = 'left',
        is_ready = false,
        left_at = now()
    where room_id = p_room_id
      and user_id = v_user_id
      and membership_status = 'active';

    update public.cant_stop_rooms
    set game_state = v_game_state,
        version = version + 1,
        updated_at = now()
    where id = p_room_id;

    return null;
  end if;

  if v_room.status <> 'waiting' and not v_game_over then
    raise exception 'ROOM_NOT_LEAVABLE' using errcode = 'P0001';
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

revoke all on function public.cant_stop_leave_room(uuid, bigint)
  from public, anon, authenticated;
grant execute on function public.cant_stop_leave_room(uuid, bigint)
  to authenticated;

commit;
