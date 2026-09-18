create table private.the_game_action_log (
  game_id uuid not null references public.the_game_games(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  client_action_id uuid not null,
  action_type text not null check (action_type in ('play_card', 'end_turn')),
  request jsonb not null,
  game_version_before bigint not null check (game_version_before >= 0),
  game_version_after bigint not null check (game_version_after >= 0),
  response jsonb not null,
  created_at timestamptz not null default now(),
  primary key (game_id, user_id, client_action_id)
);

create index the_game_action_log_user_idx
  on private.the_game_action_log(user_id);

revoke all on table private.the_game_action_log from public, anon, authenticated;

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
set search_path = ''
as $$
  select case p_pile_id
    when 'ascending-1' then p_card > p_ascending_1 or p_ascending_1 - p_card = 10
    when 'ascending-2' then p_card > p_ascending_2 or p_ascending_2 - p_card = 10
    when 'descending-1' then p_card < p_descending_1 or p_card - p_descending_1 = 10
    when 'descending-2' then p_card < p_descending_2 or p_card - p_descending_2 = 10
    else false
  end;
$$;

revoke all on function private.the_game_is_card_playable(smallint, text, smallint, smallint, smallint, smallint)
  from public, anon, authenticated;

create or replace function private.the_game_can_complete_minimum(p_game_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_game public.the_game_games%rowtype;
  v_cards smallint[];
  v_required smallint;
  v_needed smallint;
  v_len integer;
  v_i integer;
  v_j integer;
  v_first_pile text;
  v_second_pile text;
  v_a1 smallint;
  v_a2 smallint;
  v_d1 smallint;
  v_d2 smallint;
begin
  select * into v_game
  from public.the_game_games
  where id = p_game_id;

  if not found or v_game.status <> 'playing' then
    return false;
  end if;

  v_required := case when v_game.draw_count > 0 then 2 else 1 end;
  v_needed := greatest(0, v_required - v_game.cards_played_this_turn);

  if v_needed = 0 then
    return true;
  end if;

  select h.cards into v_cards
  from private.the_game_player_hands h
  join public.the_game_game_players gp
    on gp.game_id = h.game_id
   and gp.user_id = h.user_id
  where h.game_id = p_game_id
    and gp.seat = v_game.current_seat;

  v_cards := coalesce(v_cards, '{}'::smallint[]);
  v_len := cardinality(v_cards);

  if v_len < v_needed then
    return false;
  end if;

  for v_i in 1..v_len loop
    foreach v_first_pile in array array['ascending-1','ascending-2','descending-1','descending-2']::text[] loop
      if not private.the_game_is_card_playable(
        v_cards[v_i], v_first_pile,
        v_game.ascending_1, v_game.ascending_2,
        v_game.descending_1, v_game.descending_2
      ) then
        continue;
      end if;

      if v_needed = 1 then
        return true;
      end if;

      v_a1 := v_game.ascending_1;
      v_a2 := v_game.ascending_2;
      v_d1 := v_game.descending_1;
      v_d2 := v_game.descending_2;

      case v_first_pile
        when 'ascending-1' then v_a1 := v_cards[v_i];
        when 'ascending-2' then v_a2 := v_cards[v_i];
        when 'descending-1' then v_d1 := v_cards[v_i];
        when 'descending-2' then v_d2 := v_cards[v_i];
      end case;

      for v_j in 1..v_len loop
        if v_j = v_i then
          continue;
        end if;

        foreach v_second_pile in array array['ascending-1','ascending-2','descending-1','descending-2']::text[] loop
          if private.the_game_is_card_playable(
            v_cards[v_j], v_second_pile,
            v_a1, v_a2, v_d1, v_d2
          ) then
            return true;
          end if;
        end loop;
      end loop;
    end loop;
  end loop;

  return false;
end;
$$;

revoke all on function private.the_game_can_complete_minimum(uuid)
  from public, anon, authenticated;

create or replace function private.the_game_evaluate_state(p_game_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_game public.the_game_games%rowtype;
  v_remaining integer;
  v_outcome text;
begin
  select * into v_game
  from public.the_game_games
  where id = p_game_id
  for update;

  if not found then
    raise exception 'GAME_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_game.status <> 'playing' then
    return v_game.status;
  end if;

  select v_game.draw_count + coalesce(sum(gp.hand_count), 0)::integer
  into v_remaining
  from public.the_game_game_players gp
  where gp.game_id = p_game_id;

  if v_remaining = 0 then
    v_outcome := 'won';
  elsif not private.the_game_can_complete_minimum(p_game_id) then
    v_outcome := 'lost';
  else
    return 'playing';
  end if;

  update public.the_game_games
  set status = v_outcome,
      finished_at = coalesce(finished_at, now()),
      updated_at = now()
  where id = p_game_id;

  update public.the_game_rooms
  set status = 'finished',
      version = version + 1,
      updated_at = now()
  where id = v_game.room_id
    and status = 'playing';

  return v_outcome;
end;
$$;

revoke all on function private.the_game_evaluate_state(uuid)
  from public, anon, authenticated;

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
      'status', (select r.status from public.the_game_rooms r where r.id = p_room_id),
      'version', (select r.version from public.the_game_rooms r where r.id = p_room_id)
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

create or replace function public.the_game_play_card(
  p_room_id uuid,
  p_card smallint,
  p_pile_id text,
  p_expected_version bigint,
  p_client_action_id uuid
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
  v_player public.the_game_game_players%rowtype;
  v_hand smallint[];
  v_request jsonb;
  v_existing private.the_game_action_log%rowtype;
  v_response jsonb;
  v_before_version bigint;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if p_client_action_id is null then
    raise exception 'INVALID_ACTION_ID' using errcode = 'P0001';
  end if;
  if p_card is null or p_card < 2 or p_card > 99 then
    raise exception 'INVALID_CARD' using errcode = 'P0001';
  end if;
  if p_pile_id is null or p_pile_id not in ('ascending-1','ascending-2','descending-1','descending-2') then
    raise exception 'INVALID_PILE' using errcode = 'P0001';
  end if;

  select * into v_room
  from public.the_game_rooms
  where id = p_room_id
  for update;

  if not found or v_room.current_game_id is null then
    raise exception 'GAME_NOT_FOUND' using errcode = 'P0001';
  end if;

  select * into v_game
  from public.the_game_games
  where id = v_room.current_game_id
    and room_id = p_room_id
  for update;

  if not found then
    raise exception 'GAME_NOT_FOUND' using errcode = 'P0001';
  end if;

  v_request := jsonb_build_object('action','play_card','card',p_card,'pile_id',p_pile_id);

  select * into v_existing
  from private.the_game_action_log
  where game_id = v_game.id
    and user_id = v_user_id
    and client_action_id = p_client_action_id;

  if found then
    if v_existing.action_type <> 'play_card' or v_existing.request <> v_request then
      raise exception 'CLIENT_ACTION_REUSED' using errcode = 'P0001';
    end if;
    return v_existing.response;
  end if;

  if v_room.status <> 'playing' or v_game.status <> 'playing' then
    raise exception 'GAME_NOT_PLAYING' using errcode = 'P0001';
  end if;
  if p_expected_version is null or v_game.version <> p_expected_version then
    raise exception 'STATE_CHANGED' using errcode = 'P0001';
  end if;
  if not private.the_game_is_room_member(p_room_id) then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;

  select * into v_player
  from public.the_game_game_players
  where game_id = v_game.id
    and user_id = v_user_id;

  if not found then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;
  if v_player.seat <> v_game.current_seat then
    raise exception 'NOT_YOUR_TURN' using errcode = 'P0001';
  end if;

  select cards into v_hand
  from private.the_game_player_hands
  where game_id = v_game.id
    and user_id = v_user_id
  for update;

  if not found or not (p_card = any(coalesce(v_hand, '{}'::smallint[]))) then
    raise exception 'CARD_NOT_IN_HAND' using errcode = 'P0001';
  end if;

  if not private.the_game_is_card_playable(
    p_card, p_pile_id,
    v_game.ascending_1, v_game.ascending_2,
    v_game.descending_1, v_game.descending_2
  ) then
    raise exception 'CARD_NOT_PLAYABLE' using errcode = 'P0001';
  end if;

  v_before_version := v_game.version;

  update private.the_game_player_hands
  set cards = array_remove(cards, p_card)
  where game_id = v_game.id
    and user_id = v_user_id;

  update public.the_game_game_players
  set hand_count = hand_count - 1
  where id = v_player.id;

  update public.the_game_games
  set ascending_1 = case when p_pile_id = 'ascending-1' then p_card else ascending_1 end,
      ascending_2 = case when p_pile_id = 'ascending-2' then p_card else ascending_2 end,
      descending_1 = case when p_pile_id = 'descending-1' then p_card else descending_1 end,
      descending_2 = case when p_pile_id = 'descending-2' then p_card else descending_2 end,
      cards_played_this_turn = cards_played_this_turn + 1,
      version = version + 1,
      updated_at = now()
  where id = v_game.id;

  perform private.the_game_evaluate_state(v_game.id);
  v_response := private.the_game_game_snapshot(p_room_id);

  insert into private.the_game_action_log(
    game_id, user_id, client_action_id, action_type, request,
    game_version_before, game_version_after, response
  ) values (
    v_game.id, v_user_id, p_client_action_id, 'play_card', v_request,
    v_before_version, (v_response #>> '{game,version}')::bigint, v_response
  );

  return v_response;
end;
$$;

revoke all on function public.the_game_play_card(uuid, smallint, text, bigint, uuid) from public, anon;
grant execute on function public.the_game_play_card(uuid, smallint, text, bigint, uuid) to authenticated, service_role;

create or replace function public.the_game_end_turn(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid
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
  v_player public.the_game_game_players%rowtype;
  v_hand smallint[];
  v_deck smallint[];
  v_required smallint;
  v_to_draw integer;
  v_i integer;
  v_card smallint;
  v_next_seat smallint;
  v_request jsonb := jsonb_build_object('action','end_turn');
  v_existing private.the_game_action_log%rowtype;
  v_response jsonb;
  v_before_version bigint;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if p_client_action_id is null then
    raise exception 'INVALID_ACTION_ID' using errcode = 'P0001';
  end if;

  select * into v_room
  from public.the_game_rooms
  where id = p_room_id
  for update;

  if not found or v_room.current_game_id is null then
    raise exception 'GAME_NOT_FOUND' using errcode = 'P0001';
  end if;

  select * into v_game
  from public.the_game_games
  where id = v_room.current_game_id
    and room_id = p_room_id
  for update;

  if not found then
    raise exception 'GAME_NOT_FOUND' using errcode = 'P0001';
  end if;

  select * into v_existing
  from private.the_game_action_log
  where game_id = v_game.id
    and user_id = v_user_id
    and client_action_id = p_client_action_id;

  if found then
    if v_existing.action_type <> 'end_turn' or v_existing.request <> v_request then
      raise exception 'CLIENT_ACTION_REUSED' using errcode = 'P0001';
    end if;
    return v_existing.response;
  end if;

  if v_room.status <> 'playing' or v_game.status <> 'playing' then
    raise exception 'GAME_NOT_PLAYING' using errcode = 'P0001';
  end if;
  if p_expected_version is null or v_game.version <> p_expected_version then
    raise exception 'STATE_CHANGED' using errcode = 'P0001';
  end if;
  if not private.the_game_is_room_member(p_room_id) then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;

  select * into v_player
  from public.the_game_game_players
  where game_id = v_game.id
    and user_id = v_user_id;

  if not found then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;
  if v_player.seat <> v_game.current_seat then
    raise exception 'NOT_YOUR_TURN' using errcode = 'P0001';
  end if;

  v_required := case when v_game.draw_count > 0 then 2 else 1 end;
  if v_game.cards_played_this_turn < v_required then
    raise exception 'MINIMUM_NOT_MET' using errcode = 'P0001';
  end if;

  select cards into v_hand
  from private.the_game_player_hands
  where game_id = v_game.id
    and user_id = v_user_id
  for update;

  select cards into v_deck
  from private.the_game_draw_piles
  where game_id = v_game.id
  for update;

  v_hand := coalesce(v_hand, '{}'::smallint[]);
  v_deck := coalesce(v_deck, '{}'::smallint[]);
  v_to_draw := least(greatest(v_game.hand_size - cardinality(v_hand), 0), cardinality(v_deck));

  if v_to_draw > 0 then
    for v_i in 1..v_to_draw loop
      v_card := v_deck[cardinality(v_deck)];
      v_deck := trim_array(v_deck, 1);
      v_hand := array_append(v_hand, v_card);
    end loop;
  end if;

  update private.the_game_player_hands
  set cards = v_hand
  where game_id = v_game.id
    and user_id = v_user_id;

  update private.the_game_draw_piles
  set cards = v_deck
  where game_id = v_game.id;

  update public.the_game_game_players
  set hand_count = cardinality(v_hand)::smallint
  where id = v_player.id;

  if cardinality(v_deck) > 0 then
    select gp.seat into v_next_seat
    from public.the_game_game_players gp
    where gp.game_id = v_game.id
    order by case
      when gp.seat > v_game.current_seat then gp.seat - v_game.current_seat
      else gp.seat + 5 - v_game.current_seat
    end
    limit 1;
  else
    select gp.seat into v_next_seat
    from public.the_game_game_players gp
    where gp.game_id = v_game.id
      and gp.hand_count > 0
    order by case
      when gp.seat > v_game.current_seat then gp.seat - v_game.current_seat
      else gp.seat + 5 - v_game.current_seat
    end
    limit 1;
  end if;

  v_before_version := v_game.version;

  update public.the_game_games
  set draw_count = cardinality(v_deck)::smallint,
      current_seat = coalesce(v_next_seat, current_seat),
      turn_number = turn_number + 1,
      cards_played_this_turn = 0,
      version = version + 1,
      updated_at = now()
  where id = v_game.id;

  perform private.the_game_evaluate_state(v_game.id);
  v_response := private.the_game_game_snapshot(p_room_id);

  insert into private.the_game_action_log(
    game_id, user_id, client_action_id, action_type, request,
    game_version_before, game_version_after, response
  ) values (
    v_game.id, v_user_id, p_client_action_id, 'end_turn', v_request,
    v_before_version, (v_response #>> '{game,version}')::bigint, v_response
  );

  return v_response;
end;
$$;

revoke all on function public.the_game_end_turn(uuid, bigint, uuid) from public, anon;
grant execute on function public.the_game_end_turn(uuid, bigint, uuid) to authenticated, service_role;

create or replace function public.the_game_get_my_active_game()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_room_id uuid;
begin
  if (select auth.uid()) is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  select g.room_id into v_room_id
  from public.the_game_game_players gp
  join public.the_game_room_players rp
    on rp.id = gp.room_player_id
   and rp.membership_status = 'active'
  join public.the_game_games g on g.id = gp.game_id
  join public.the_game_rooms r on r.id = g.room_id and r.current_game_id = g.id
  where gp.user_id = (select auth.uid())
    and g.status in ('playing','won','lost')
    and r.status in ('playing','finished')
    and r.expires_at > now()
  order by g.started_at desc
  limit 1;

  if v_room_id is null then
    return null;
  end if;

  return private.the_game_game_snapshot(v_room_id);
end;
$$;

create or replace function public.the_game_leave_room(p_room_id uuid, p_expected_version bigint)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_room public.the_game_rooms%rowtype;
  v_next_host uuid;
  v_new_version bigint;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  select * into v_room
  from public.the_game_rooms
  where id = p_room_id
  for update;

  if not found then
    raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001';
  end if;
  if p_expected_version is null or v_room.version <> p_expected_version then
    raise exception 'STATE_CHANGED' using errcode = 'P0001';
  end if;
  if v_room.status = 'playing' then
    raise exception 'GAME_IN_PROGRESS' using errcode = 'P0001';
  end if;
  if not private.the_game_is_room_member(p_room_id) then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;

  update public.the_game_room_players
  set membership_status = 'left',
      is_ready = false,
      left_at = now()
  where room_id = p_room_id
    and user_id = v_user_id
    and membership_status = 'active';

  select p.user_id into v_next_host
  from public.the_game_room_players as p
  where p.room_id = p_room_id
    and p.membership_status = 'active'
  order by p.seat
  limit 1;

  update public.the_game_rooms
  set host_user_id = case
        when v_room.host_user_id = v_user_id and v_next_host is not null then v_next_host
        else host_user_id
      end,
      status = case
        when v_next_host is null then 'closed'
        else status
      end,
      version = version + 1,
      updated_at = now()
  where id = p_room_id
  returning version into v_new_version;

  return jsonb_build_object(
    'left', true,
    'room_id', p_room_id,
    'room_closed', v_next_host is null,
    'host_user_id', case
      when v_room.host_user_id = v_user_id and v_next_host is not null then v_next_host
      else v_room.host_user_id
    end,
    'version', v_new_version
  );
end;
$$;