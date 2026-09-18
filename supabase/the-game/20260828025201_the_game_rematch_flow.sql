create or replace function private.the_game_game_snapshot(p_room_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_game public.the_game_games%rowtype;
  v_hand smallint[];
  v_self public.the_game_game_players%rowtype;
  v_required smallint;
  v_remaining integer;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if not private.the_game_is_room_member(p_room_id) then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;

  select g.* into v_game
  from public.the_game_games g
  join public.the_game_rooms r on r.current_game_id = g.id
  where r.id = p_room_id
  order by g.started_at desc
  limit 1;

  if not found then
    return null;
  end if;

  select gp.* into v_self
  from public.the_game_game_players gp
  where gp.game_id = v_game.id and gp.user_id = v_user_id;

  if not found then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;

  select h.cards into v_hand
  from private.the_game_player_hands h
  where h.game_id = v_game.id and h.user_id = v_user_id;

  v_required := case when v_game.draw_count > 0 then 2 else 1 end;

  select v_game.draw_count + coalesce(sum(gp.hand_count), 0)::integer
  into v_remaining
  from public.the_game_game_players gp
  where gp.game_id = v_game.id;

  return jsonb_build_object(
    'room', jsonb_build_object(
      'id', p_room_id,
      'code', (select r.room_code from public.the_game_rooms r where r.id = p_room_id),
      'status', (select r.status from public.the_game_rooms r where r.id = p_room_id),
      'version', (select r.version from public.the_game_rooms r where r.id = p_room_id),
      'host_user_id', (select r.host_user_id from public.the_game_rooms r where r.id = p_room_id)
    ),
    'game', jsonb_build_object(
      'id', v_game.id,
      'status', v_game.status,
      'version', v_game.version,
      'hand_size', v_game.hand_size,
      'current_seat', v_game.current_seat,
      'turn_number', v_game.turn_number,
      'cards_played_this_turn', v_game.cards_played_this_turn,
      'required_cards', v_required,
      'can_end_turn', v_game.status = 'playing' and v_game.cards_played_this_turn >= v_required,
      'draw_count', v_game.draw_count,
      'remaining_cards', v_remaining,
      'piles', jsonb_build_array(
        jsonb_build_object('id','ascending-1','direction','ascending','value',v_game.ascending_1),
        jsonb_build_object('id','ascending-2','direction','ascending','value',v_game.ascending_2),
        jsonb_build_object('id','descending-1','direction','descending','value',v_game.descending_1),
        jsonb_build_object('id','descending-2','direction','descending','value',v_game.descending_2)
      ),
      'started_at', v_game.started_at,
      'finished_at', v_game.finished_at,
      'result', case
        when v_game.status in ('won','lost') then jsonb_build_object(
          'outcome', v_game.status,
          'remaining_cards', v_remaining,
          'cards_played', 98 - v_remaining,
          'reason', case when v_game.status = 'won' then 'all_cards_played' else 'minimum_cards_unplayable' end
        )
        else null
      end
    ),
    'self', jsonb_build_object(
      'user_id', v_self.user_id,
      'nickname', v_self.nickname,
      'seat', v_self.seat,
      'hand', coalesce(to_jsonb(v_hand), '[]'::jsonb),
      'hand_count', v_self.hand_count,
      'is_current', v_self.seat = v_game.current_seat
    ),
    'players', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'user_id', gp.user_id,
          'nickname', gp.nickname,
          'seat', gp.seat,
          'hand_count', gp.hand_count,
          'is_current', gp.seat = v_game.current_seat
        ) order by gp.seat
      )
      from public.the_game_game_players gp
      where gp.game_id = v_game.id
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.the_game_prepare_rematch(
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
  v_room public.the_game_rooms%rowtype;
  v_game public.the_game_games%rowtype;
  v_active_count integer;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  select * into v_room
  from public.the_game_rooms
  where id = p_room_id
  for update;

  if not found or v_room.expires_at <= now() or v_room.status = 'closed' then
    raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001';
  end if;
  if p_expected_version is null or v_room.version <> p_expected_version then
    raise exception 'STATE_CHANGED' using errcode = 'P0001';
  end if;
  if v_room.host_user_id <> v_user_id then
    raise exception 'HOST_REQUIRED' using errcode = 'P0001';
  end if;
  if v_room.status <> 'finished' or v_room.current_game_id is null then
    raise exception 'GAME_NOT_FINISHED' using errcode = 'P0001';
  end if;
  if not private.the_game_is_room_member(p_room_id) then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;

  select * into v_game
  from public.the_game_games
  where id = v_room.current_game_id
    and room_id = p_room_id
  for update;

  if not found or v_game.status not in ('won','lost') then
    raise exception 'GAME_NOT_FINISHED' using errcode = 'P0001';
  end if;

  select count(*)::integer into v_active_count
  from public.the_game_room_players
  where room_id = p_room_id
    and membership_status = 'active';

  if v_active_count < 2 then
    raise exception 'NOT_ENOUGH_PLAYERS_FOR_REMATCH' using errcode = 'P0001';
  end if;

  update public.the_game_room_players
  set is_ready = false
  where room_id = p_room_id
    and membership_status = 'active';

  delete from private.the_game_action_log where game_id = v_game.id;
  delete from private.the_game_player_hands where game_id = v_game.id;
  delete from private.the_game_draw_piles where game_id = v_game.id;

  update public.the_game_rooms
  set status = 'waiting',
      current_game_id = null,
      version = version + 1,
      updated_at = now(),
      expires_at = greatest(expires_at, now() + interval '8 hours')
  where id = p_room_id;

  return private.the_game_lobby_snapshot(p_room_id);
end;
$$;

revoke all on function public.the_game_prepare_rematch(uuid, bigint) from public;
revoke all on function public.the_game_prepare_rematch(uuid, bigint) from anon;
grant execute on function public.the_game_prepare_rematch(uuid, bigint) to authenticated;