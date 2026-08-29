create or replace function private.the_game_is_card_playable(
  p_card smallint,
  p_pile_id text,
  p_ascending_1 smallint,
  p_ascending_2 smallint,
  p_descending_1 smallint,
  p_descending_2 smallint
)
returns boolean
language sql
immutable
set search_path to ''
as $function$
  select case p_pile_id
    when 'ascending-1' then p_ascending_1 is null or p_card > p_ascending_1 or p_ascending_1 - p_card = 10
    when 'ascending-2' then p_ascending_2 is null or p_card > p_ascending_2 or p_ascending_2 - p_card = 10
    when 'descending-1' then p_descending_1 is null or p_card < p_descending_1 or p_card - p_descending_1 = 10
    when 'descending-2' then p_descending_2 is null or p_card < p_descending_2 or p_card - p_descending_2 = 10
    else false
  end;
$function$;

create or replace function private.the_game_game_snapshot(p_room_id uuid)
returns jsonb
language plpgsql
stable security definer
set search_path to ''
as $function$
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
      'piles', (
        select coalesce(jsonb_agg(
          jsonb_build_object('id', pile_id, 'direction', direction, 'value', pile_value)
          order by pile_order
        ), '[]'::jsonb)
        from (values
          (1, 'ascending-1'::text, 'ascending'::text, v_game.ascending_1),
          (2, 'ascending-2'::text, 'ascending'::text, v_game.ascending_2),
          (3, 'descending-1'::text, 'descending'::text, v_game.descending_1),
          (4, 'descending-2'::text, 'descending'::text, v_game.descending_2)
        ) as pile_rows(pile_order, pile_id, direction, pile_value)
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
$function$;
