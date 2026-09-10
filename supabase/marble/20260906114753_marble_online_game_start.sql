create table private.marble_classic_nodes (
  node_index smallint primary key check (node_index between 0 and 31),
  node_id text not null unique,
  node_type text not null check (node_type in ('START','PROPERTY','EVENT','TAX','BONUS','REST')),
  label text not null,
  price integer,
  base_toll integer,
  build_cost integer,
  max_building_level smallint,
  amount integer,
  skip_turns smallint
);

insert into private.marble_classic_nodes(node_index,node_id,node_type,label,price,base_toll,build_cost,max_building_level,amount,skip_turns) values
(0,'start','START','출발 · 서울',null,null,null,null,null,null),
(1,'tokyo','PROPERTY','도쿄',240,28,120,3,null,null),
(2,'event-east','EVENT','여행 소식',null,null,null,null,null,null),
(3,'singapore','PROPERTY','싱가포르',260,30,130,3,null,null),
(4,'sydney','PROPERTY','시드니',280,34,140,3,null,null),
(5,'tax-airport','TAX','공항 이용료',null,null,null,null,120,null),
(6,'cairo','PROPERTY','카이로',300,38,150,3,null,null),
(7,'athens','PROPERTY','아테네',320,42,160,3,null,null),
(8,'rest','REST','휴식',null,null,null,null,null,1),
(9,'rome','PROPERTY','로마',340,46,170,3,null,null),
(10,'event-europe','EVENT','세계 뉴스',null,null,null,null,null,null),
(11,'paris','PROPERTY','파리',380,52,190,3,null,null),
(12,'london','PROPERTY','런던',400,56,200,3,null,null),
(13,'bonus','BONUS','여행 지원금',null,null,null,null,150,null),
(14,'new-york','PROPERTY','뉴욕',440,64,220,3,null,null),
(15,'mexico-city','PROPERTY','멕시코시티',360,48,180,3,null,null),
(16,'event-america','EVENT','뜻밖의 소식',null,null,null,null,null,null),
(17,'rio','PROPERTY','리우',400,56,200,3,null,null),
(18,'vancouver','PROPERTY','밴쿠버',420,60,210,3,null,null),
(19,'honolulu','PROPERTY','호놀룰루',300,38,150,3,null,null),
(20,'san-francisco','PROPERTY','샌프란시스코',430,62,215,3,null,null),
(21,'los-angeles','PROPERTY','로스앤젤레스',450,66,225,3,null,null),
(22,'las-vegas','PROPERTY','라스베이거스',370,50,185,3,null,null),
(23,'chicago','PROPERTY','시카고',410,58,205,3,null,null),
(24,'toronto','PROPERTY','토론토',390,54,195,3,null,null),
(25,'event-north','EVENT','대륙 횡단 소식',null,null,null,null,null,null),
(26,'reykjavik','PROPERTY','레이캬비크',330,44,165,3,null,null),
(27,'berlin','PROPERTY','베를린',390,54,195,3,null,null),
(28,'dubai','PROPERTY','두바이',430,62,215,3,null,null),
(29,'bangkok','PROPERTY','방콕',350,46,175,3,null,null),
(30,'busan','PROPERTY','부산',300,40,150,3,null,null),
(31,'jeju','PROPERTY','제주',280,36,140,3,null,null);

create table public.marble_games (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null unique references public.marble_rooms(id) on delete cascade,
  status text not null default 'playing' check (status in ('playing','finished','abandoned')),
  phase text not null default 'WAITING_ROLL' check (phase in ('WAITING_ROLL','WAITING_CHOICE','TURN_END','FINISHED')),
  ruleset_version smallint not null default 1,
  current_seat smallint not null check (current_seat between 0 and 3),
  turn_number integer not null default 1 check (turn_number >= 1),
  event_cursor integer not null default 0 check (event_cursor >= 0),
  pending_choice jsonb,
  last_roll jsonb,
  last_events jsonb not null default '[]'::jsonb,
  winner_seat smallint,
  version bigint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.marble_rooms add column current_game_id uuid references public.marble_games(id) on delete set null;

create table public.marble_game_players (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.marble_games(id) on delete cascade,
  room_player_id uuid not null references public.marble_room_players(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  seat smallint not null check (seat between 0 and 3),
  position_index smallint not null default 0 check (position_index between 0 and 31),
  money integer not null default 1500 check (money >= 0),
  bankrupt boolean not null default false,
  skip_turns smallint not null default 0 check (skip_turns >= 0),
  unique(game_id, user_id),
  unique(game_id, seat),
  unique(game_id, room_player_id)
);

create table public.marble_game_properties (
  game_id uuid not null references public.marble_games(id) on delete cascade,
  node_id text not null,
  owner_seat smallint,
  building_level smallint not null default 0 check (building_level between 0 and 3),
  primary key(game_id, node_id)
);

create index marble_game_players_user_idx on public.marble_game_players(user_id, game_id);
create index marble_games_room_version_idx on public.marble_games(room_id, version);

alter table public.marble_games enable row level security;
alter table public.marble_game_players enable row level security;
alter table public.marble_game_properties enable row level security;

create or replace function public.marble_is_game_member(p_game_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.marble_games g
    join public.marble_room_players rp on rp.room_id = g.room_id
    where g.id = p_game_id
      and rp.user_id = auth.uid()
      and rp.membership_status = 'active'
  );
$$;

create policy marble_games_member_select on public.marble_games
  for select to authenticated using (public.marble_is_room_member(room_id));
create policy marble_game_players_member_select on public.marble_game_players
  for select to authenticated using (public.marble_is_game_member(game_id));
create policy marble_game_properties_member_select on public.marble_game_properties
  for select to authenticated using (public.marble_is_game_member(game_id));

grant select on public.marble_games to authenticated;
grant select on public.marble_game_players to authenticated;
grant select on public.marble_game_properties to authenticated;

create or replace function private.marble_game_snapshot(p_room_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_room public.marble_rooms%rowtype;
  v_game public.marble_games%rowtype;
  v_players jsonb;
  v_properties jsonb;
  v_viewer_player_id text;
  v_winner_player_id text;
begin
  select * into v_room from public.marble_rooms where id = p_room_id;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;

  select * into v_game from public.marble_games where id = v_room.current_game_id and room_id = p_room_id;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', gp.room_player_id::text,
    'userId', gp.user_id,
    'name', gp.nickname,
    'seat', gp.seat,
    'positionIndex', gp.position_index,
    'positionNodeId', n.node_id,
    'money', gp.money,
    'bankrupt', gp.bankrupt,
    'skipTurns', gp.skip_turns
  ) order by gp.seat), '[]'::jsonb)
  into v_players
  from public.marble_game_players gp
  join private.marble_classic_nodes n on n.node_index = gp.position_index
  where gp.game_id = v_game.id;

  select coalesce(jsonb_object_agg(p.node_id, jsonb_build_object(
    'ownerId', owner.room_player_id::text,
    'ownerSeat', p.owner_seat,
    'buildingLevel', p.building_level
  )), '{}'::jsonb)
  into v_properties
  from public.marble_game_properties p
  left join public.marble_game_players owner
    on owner.game_id = p.game_id and owner.seat = p.owner_seat
  where p.game_id = v_game.id;

  select gp.room_player_id::text into v_viewer_player_id
  from public.marble_game_players gp
  where gp.game_id = v_game.id and gp.user_id = auth.uid();

  if v_game.winner_seat is not null then
    select gp.room_player_id::text into v_winner_player_id
    from public.marble_game_players gp
    where gp.game_id = v_game.id and gp.seat = v_game.winner_seat;
  end if;

  return jsonb_build_object(
    'room', jsonb_build_object(
      'id', v_room.id,
      'roomCode', v_room.room_code,
      'status', v_room.status,
      'version', v_room.version,
      'currentGameId', v_room.current_game_id
    ),
    'game', jsonb_build_object(
      'id', v_game.id,
      'status', v_game.status,
      'phase', v_game.phase,
      'turn', v_game.turn_number,
      'currentSeat', v_game.current_seat,
      'version', v_game.version,
      'pendingChoice', v_game.pending_choice,
      'lastRoll', v_game.last_roll,
      'lastEvents', v_game.last_events,
      'winnerSeat', v_game.winner_seat,
      'winnerPlayerId', v_winner_player_id,
      'rulesetVersion', v_game.ruleset_version
    ),
    'players', v_players,
    'properties', v_properties,
    'viewerUserId', auth.uid(),
    'viewerPlayerId', v_viewer_player_id
  );
end;
$$;

create or replace function public.marble_lobby_snapshot(p_room_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_room public.marble_rooms%rowtype;
  v_players jsonb;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_room from public.marble_rooms where id = p_room_id;
  if not found or not (v_room.host_user_id = auth.uid() or public.marble_is_room_member(p_room_id)) then raise exception 'ROOM_NOT_FOUND'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', rp.id,
    'userId', rp.user_id,
    'nickname', rp.nickname,
    'seat', rp.seat,
    'isReady', rp.is_ready,
    'joinedAt', rp.joined_at
  ) order by rp.seat), '[]'::jsonb)
  into v_players
  from public.marble_room_players rp
  where rp.room_id = p_room_id and rp.membership_status = 'active';

  return jsonb_build_object(
    'room', jsonb_build_object(
      'id', v_room.id,
      'roomCode', v_room.room_code,
      'hostUserId', v_room.host_user_id,
      'status', v_room.status,
      'themeKey', v_room.theme_key,
      'maxPlayers', v_room.max_players,
      'version', v_room.version,
      'expiresAt', v_room.expires_at,
      'currentGameId', v_room.current_game_id
    ),
    'players', v_players,
    'viewerUserId', auth.uid()
  );
end;
$$;

create or replace function public.marble_start_game(p_room_id uuid, p_expected_version bigint)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_room public.marble_rooms%rowtype;
  v_game_id uuid;
  v_player_count integer;
  v_all_ready boolean;
  v_first_seat smallint;
  v_first_player_id text;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_room from public.marble_rooms where id = p_room_id for update;
  if not found or v_room.expires_at <= now() or v_room.status = 'closed' then raise exception 'ROOM_NOT_FOUND'; end if;
  if v_room.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_room.status <> 'waiting' then raise exception 'ROOM_ALREADY_STARTED'; end if;
  if v_room.host_user_id <> v_user then raise exception 'HOST_REQUIRED'; end if;

  select count(*)::integer, coalesce(bool_and(is_ready), false), min(seat)
  into v_player_count, v_all_ready, v_first_seat
  from public.marble_room_players
  where room_id = p_room_id and membership_status = 'active';

  if v_player_count < 2 or v_player_count > v_room.max_players then raise exception 'INVALID_PLAYER_COUNT'; end if;
  if not v_all_ready then raise exception 'PLAYERS_NOT_READY'; end if;

  insert into public.marble_games(room_id, current_seat)
  values (p_room_id, v_first_seat)
  returning id into v_game_id;

  insert into public.marble_game_players(game_id, room_player_id, user_id, nickname, seat)
  select v_game_id, id, user_id, nickname, seat
  from public.marble_room_players
  where room_id = p_room_id and membership_status = 'active'
  order by seat;

  insert into public.marble_game_properties(game_id, node_id)
  select v_game_id, node_id
  from private.marble_classic_nodes
  where node_type = 'PROPERTY';

  select room_player_id::text into v_first_player_id
  from public.marble_game_players
  where game_id = v_game_id and seat = v_first_seat;

  update public.marble_games
  set last_events = jsonb_build_array(jsonb_build_object('type','GAME_STARTED','playerId',v_first_player_id))
  where id = v_game_id;

  update public.marble_rooms
  set status = 'playing', current_game_id = v_game_id, version = version + 1,
      updated_at = now(), expires_at = greatest(expires_at, now() + interval '8 hours')
  where id = p_room_id;

  return private.marble_game_snapshot(p_room_id);
end;
$$;

create or replace function public.marble_get_game_snapshot(p_room_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, private, pg_temp
as $$
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.marble_is_room_member(p_room_id) then raise exception 'NOT_ROOM_MEMBER'; end if;
  return private.marble_game_snapshot(p_room_id);
end;
$$;

create or replace function public.marble_get_my_active_game()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_room_id uuid;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  select rp.room_id into v_room_id
  from public.marble_room_players rp
  join public.marble_rooms r on r.id = rp.room_id
  where rp.user_id = auth.uid() and rp.membership_status = 'active'
    and r.status = 'playing' and r.current_game_id is not null and r.expires_at > now()
  order by rp.joined_at desc limit 1;
  if v_room_id is null then return null; end if;
  return private.marble_game_snapshot(v_room_id);
end;
$$;

revoke all on function public.marble_is_game_member(uuid) from public, anon;
revoke all on function public.marble_start_game(uuid, bigint) from public, anon;
revoke all on function public.marble_get_game_snapshot(uuid) from public, anon;
revoke all on function public.marble_get_my_active_game() from public, anon;
grant execute on function public.marble_is_game_member(uuid) to authenticated;
grant execute on function public.marble_start_game(uuid, bigint) to authenticated;
grant execute on function public.marble_get_game_snapshot(uuid) to authenticated;
grant execute on function public.marble_get_my_active_game() to authenticated;

alter publication supabase_realtime add table public.marble_games;
