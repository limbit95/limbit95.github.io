alter table public.the_game_rooms
  add column if not exists pile_preset text not null default 'standard';

alter table public.the_game_rooms
  drop constraint if exists the_game_rooms_pile_preset_check;

alter table public.the_game_rooms
  add constraint the_game_rooms_pile_preset_check
  check (pile_preset in ('standard', 'one-ascending', 'one-each', 'one-descending'));

alter table public.the_game_games
  alter column ascending_2 drop not null,
  alter column descending_2 drop not null;

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
  select coalesce(case p_pile_id
    when 'ascending-1' then p_card > p_ascending_1 or p_ascending_1 - p_card = 10
    when 'ascending-2' then p_card > p_ascending_2 or p_ascending_2 - p_card = 10
    when 'descending-1' then p_card < p_descending_1 or p_card - p_descending_1 = 10
    when 'descending-2' then p_card < p_descending_2 or p_card - p_descending_2 = 10
    else false
  end, false);
$function$;

create or replace function private.the_game_lobby_snapshot(p_room_id uuid)
returns jsonb
language sql
stable security definer
set search_path to ''
as $function$
  with room_row as (
    select r.*
    from public.the_game_rooms as r
    where r.id = p_room_id
      and private.the_game_is_room_member(r.id)
  ),
  active_players as (
    select p.*
    from public.the_game_room_players as p
    join room_row as r on r.id = p.room_id
    where p.membership_status = 'active'
  ),
  stats as (
    select
      count(*)::integer as player_count,
      coalesce(bool_and(is_ready), false) as all_ready
    from active_players
  )
  select case when exists (select 1 from room_row) then
    jsonb_build_object(
      'room', (
        select jsonb_build_object(
          'id', r.id,
          'code', r.room_code,
          'status', r.status,
          'max_players', r.max_players,
          'version', r.version,
          'host_user_id', r.host_user_id,
          'expires_at', r.expires_at,
          'player_count', s.player_count,
          'all_ready', s.all_ready,
          'can_start', r.status = 'waiting'
            and s.player_count between 1 and r.max_players
            and s.all_ready,
          'pile_preset', r.pile_preset
        )
        from room_row r cross join stats s
      ),
      'self', (
        select jsonb_build_object(
          'user_id', p.user_id,
          'nickname', p.nickname,
          'seat', p.seat,
          'is_ready', p.is_ready,
          'is_host', p.user_id = r.host_user_id
        )
        from active_players p
        cross join room_row r
        where p.user_id = (select auth.uid())
        limit 1
      ),
      'players', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'user_id', p.user_id,
            'nickname', p.nickname,
            'seat', p.seat,
            'is_ready', p.is_ready,
            'is_host', p.user_id = r.host_user_id
          ) order by p.seat
        )
        from active_players p
        cross join room_row r
      ), '[]'::jsonb)
    )
  else null end;
$function$;

create or replace function public.the_game_set_game_settings(
  p_room_id uuid,
  p_pile_preset text,
  p_expected_version bigint
)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_user_id uuid := (select auth.uid());
  v_room public.the_game_rooms%rowtype;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  if p_pile_preset is null or p_pile_preset not in ('standard', 'one-ascending', 'one-each', 'one-descending') then
    raise exception 'INVALID_PILE_PRESET' using errcode = 'P0001';
  end if;

  select * into v_room
  from public.the_game_rooms
  where id = p_room_id
  for update;

  if not found or v_room.expires_at <= now() or v_room.status = 'closed' then
    raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_room.version <> p_expected_version then
    raise exception 'STATE_CHANGED' using errcode = 'P0001';
  end if;
  if v_room.status <> 'waiting' then
    raise exception 'ROOM_ALREADY_STARTED' using errcode = 'P0001';
  end if;
  if v_room.host_user_id <> v_user_id then
    raise exception 'HOST_REQUIRED' using errcode = 'P0001';
  end if;
  if not private.the_game_is_room_member(p_room_id) then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;

  update public.the_game_rooms
  set pile_preset = p_pile_preset,
      updated_at = now()
  where id = p_room_id;

  return private.the_game_lobby_snapshot(p_room_id);
end;
$function$;

revoke all on function public.the_game_set_game_settings(uuid, text, bigint) from public;
grant execute on function public.the_game_set_game_settings(uuid, text, bigint) to authenticated, service_role;

create or replace function public.the_game_start_game(p_room_id uuid, p_expected_version bigint)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_user_id uuid := (select auth.uid());
  v_room public.the_game_rooms%rowtype;
  v_game_id uuid;
  v_player_count integer;
  v_all_ready boolean;
  v_hand_size smallint;
  v_deck smallint[];
  v_round integer;
  v_player record;
  v_card smallint;
  v_deck_length integer;
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
  if v_room.version <> p_expected_version then
    raise exception 'STATE_CHANGED' using errcode = 'P0001';
  end if;
  if v_room.status <> 'waiting' then
    raise exception 'ROOM_ALREADY_STARTED' using errcode = 'P0001';
  end if;
  if v_room.host_user_id <> v_user_id then
    raise exception 'HOST_REQUIRED' using errcode = 'P0001';
  end if;

  select count(*)::integer, coalesce(bool_and(p.is_ready), false)
  into v_player_count, v_all_ready
  from public.the_game_room_players p
  where p.room_id = p_room_id and p.membership_status = 'active';

  if v_player_count < 2 or v_player_count > v_room.max_players then
    raise exception 'INVALID_PLAYER_COUNT' using errcode = 'P0001';
  end if;
  if not v_all_ready then
    raise exception 'PLAYERS_NOT_READY' using errcode = 'P0001';
  end if;

  v_hand_size := case when v_player_count = 2 then 7 else 6 end;

  select array_agg(n::smallint order by random())
  into v_deck
  from generate_series(2, 99) as n;

  insert into public.the_game_games(
    room_id,
    hand_size,
    current_seat,
    draw_count,
    ascending_1,
    ascending_2,
    descending_1,
    descending_2
  ) values (
    p_room_id,
    v_hand_size,
    (select min(p.seat) from public.the_game_room_players p where p.room_id = p_room_id and p.membership_status = 'active'),
    98 - (v_player_count * v_hand_size),
    1,
    case when v_room.pile_preset in ('standard', 'one-descending') then 1 else null end,
    100,
    case when v_room.pile_preset in ('standard', 'one-ascending') then 100 else null end
  ) returning id into v_game_id;

  for v_player in
    select p.id as room_player_id, p.user_id, p.nickname, p.seat
    from public.the_game_room_players p
    where p.room_id = p_room_id and p.membership_status = 'active'
    order by p.seat
  loop
    insert into public.the_game_game_players(game_id, room_player_id, user_id, nickname, seat, hand_count)
    values (v_game_id, v_player.room_player_id, v_player.user_id, v_player.nickname, v_player.seat, v_hand_size);

    insert into private.the_game_player_hands(game_id, user_id, cards)
    values (v_game_id, v_player.user_id, '{}'::smallint[]);
  end loop;

  for v_round in 1..v_hand_size loop
    for v_player in
      select p.user_id, p.seat
      from public.the_game_room_players p
      where p.room_id = p_room_id and p.membership_status = 'active'
      order by p.seat
    loop
      v_deck_length := array_length(v_deck, 1);
      v_card := v_deck[v_deck_length];
      v_deck := v_deck[1:v_deck_length - 1];

      update private.the_game_player_hands h
      set cards = array_append(h.cards, v_card)
      where h.game_id = v_game_id and h.user_id = v_player.user_id;
    end loop;
  end loop;

  insert into private.the_game_draw_piles(game_id, cards)
  values (v_game_id, coalesce(v_deck, '{}'::smallint[]));

  update public.the_game_rooms
  set status = 'playing',
      current_game_id = v_game_id,
      version = version + 1,
      updated_at = now(),
      expires_at = greatest(expires_at, now() + interval '8 hours')
  where id = p_room_id;

  return private.the_game_game_snapshot(p_room_id);
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
        where pile_value is not null
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
