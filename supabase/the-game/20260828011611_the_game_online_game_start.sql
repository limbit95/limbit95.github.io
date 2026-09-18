create table public.the_game_games (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.the_game_rooms(id) on delete cascade,
  status text not null default 'playing' check (status in ('playing','won','lost')),
  hand_size smallint not null check (hand_size between 1 and 8),
  current_seat smallint not null check (current_seat between 1 and 5),
  turn_number integer not null default 1 check (turn_number >= 1),
  cards_played_this_turn smallint not null default 0 check (cards_played_this_turn >= 0),
  draw_count smallint not null check (draw_count between 0 and 98),
  ascending_1 smallint not null default 1 check (ascending_1 between 1 and 99),
  ascending_2 smallint not null default 1 check (ascending_2 between 1 and 99),
  descending_1 smallint not null default 100 check (descending_1 between 2 and 100),
  descending_2 smallint not null default 100 check (descending_2 between 2 and 100),
  version bigint not null default 0,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  finished_at timestamptz
);

create index the_game_games_room_idx on public.the_game_games(room_id, started_at desc);

create table public.the_game_game_players (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.the_game_games(id) on delete cascade,
  room_player_id uuid not null references public.the_game_room_players(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  seat smallint not null check (seat between 1 and 5),
  hand_count smallint not null default 0 check (hand_count between 0 and 8),
  created_at timestamptz not null default now(),
  unique(game_id, user_id),
  unique(game_id, seat)
);

create index the_game_game_players_user_idx on public.the_game_game_players(user_id, game_id);
create index the_game_game_players_room_player_idx on public.the_game_game_players(room_player_id);

create table private.the_game_draw_piles (
  game_id uuid primary key references public.the_game_games(id) on delete cascade,
  cards smallint[] not null,
  created_at timestamptz not null default now()
);

create table private.the_game_player_hands (
  game_id uuid not null references public.the_game_games(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  cards smallint[] not null default '{}'::smallint[],
  created_at timestamptz not null default now(),
  primary key(game_id, user_id)
);

alter table public.the_game_rooms add column current_game_id uuid;
alter table public.the_game_rooms
  add constraint the_game_rooms_current_game_id_fkey
  foreign key(current_game_id) references public.the_game_games(id) on delete set null;
create index the_game_rooms_current_game_idx on public.the_game_rooms(current_game_id);

alter table public.the_game_games enable row level security;
alter table public.the_game_game_players enable row level security;

revoke all on table public.the_game_games from anon, authenticated;
revoke all on table public.the_game_game_players from anon, authenticated;
grant select on table public.the_game_games to authenticated;
grant select on table public.the_game_game_players to authenticated;
grant select, insert, update, delete on table public.the_game_games to service_role;
grant select, insert, update, delete on table public.the_game_game_players to service_role;

revoke all on table private.the_game_draw_piles from public, anon, authenticated;
revoke all on table private.the_game_player_hands from public, anon, authenticated;

create or replace function private.the_game_is_game_member(p_game_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and private.is_approved_member()
    and exists (
      select 1
      from public.the_game_game_players gp
      where gp.game_id = p_game_id
        and gp.user_id = (select auth.uid())
    );
$$;

revoke execute on function private.the_game_is_game_member(uuid) from public, anon, authenticated;

create policy "the game members can read games"
on public.the_game_games
for select
to authenticated
using ((select private.the_game_is_game_member(id)));

create policy "the game members can read game players"
on public.the_game_game_players
for select
to authenticated
using ((select private.the_game_is_game_member(game_id)));

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
      'required_cards', case when v_game.draw_count > 0 then 2 else 1 end,
      'draw_count', v_game.draw_count,
      'piles', jsonb_build_array(
        jsonb_build_object('id','ascending-1','direction','ascending','value',v_game.ascending_1),
        jsonb_build_object('id','ascending-2','direction','ascending','value',v_game.ascending_2),
        jsonb_build_object('id','descending-1','direction','descending','value',v_game.descending_1),
        jsonb_build_object('id','descending-2','direction','descending','value',v_game.descending_2)
      ),
      'started_at', v_game.started_at
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

revoke execute on function private.the_game_game_snapshot(uuid) from public, anon, authenticated;

create or replace function public.the_game_start_game(p_room_id uuid, p_expected_version bigint)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
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
    room_id, hand_size, current_seat, draw_count
  ) values (
    p_room_id,
    v_hand_size,
    (select min(p.seat) from public.the_game_room_players p where p.room_id = p_room_id and p.membership_status = 'active'),
    98 - (v_player_count * v_hand_size)
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
$$;

create or replace function public.the_game_get_game_snapshot(p_room_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if not private.the_game_is_room_member(p_room_id) then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;
  return private.the_game_game_snapshot(p_room_id);
end;
$$;

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
  join public.the_game_games g on g.id = gp.game_id
  join public.the_game_rooms r on r.id = g.room_id and r.current_game_id = g.id
  where gp.user_id = (select auth.uid())
    and g.status = 'playing'
    and r.status = 'playing'
    and r.expires_at > now()
  order by g.started_at desc
  limit 1;

  if v_room_id is null then
    return null;
  end if;

  return private.the_game_game_snapshot(v_room_id);
end;
$$;

revoke execute on function public.the_game_start_game(uuid, bigint) from public, anon;
revoke execute on function public.the_game_get_game_snapshot(uuid) from public, anon;
revoke execute on function public.the_game_get_my_active_game() from public, anon;
grant execute on function public.the_game_start_game(uuid, bigint) to authenticated;
grant execute on function public.the_game_get_game_snapshot(uuid) to authenticated;
grant execute on function public.the_game_get_my_active_game() to authenticated;

DO $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'the_game_games'
  ) then
    alter publication supabase_realtime add table public.the_game_games;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'the_game_game_players'
  ) then
    alter publication supabase_realtime add table public.the_game_game_players;
  end if;
end
$$;