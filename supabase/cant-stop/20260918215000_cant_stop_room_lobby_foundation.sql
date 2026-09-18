begin;

create table public.cant_stop_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique
    check (room_code ~ '^[A-HJ-NP-Z2-9]{6}$'),
  host_user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'waiting'
    check (status in ('waiting', 'playing', 'closed')),
  max_players smallint not null default 4
    check (max_players between 2 and 4),
  version bigint not null default 0
    check (version >= 0),
  game_state jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '8 hours')
);

create table public.cant_stop_room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.cant_stop_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null
    check (char_length(btrim(nickname)) between 1 and 20),
  seat smallint not null
    check (seat between 0 and 3),
  is_ready boolean not null default false,
  membership_status text not null default 'active'
    check (membership_status in ('active', 'left')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  unique (room_id, user_id)
);

create table public.cant_stop_room_actions (
  room_id uuid not null references public.cant_stop_rooms(id) on delete cascade,
  client_action_id text not null
    check (char_length(btrim(client_action_id)) between 1 and 100),
  actor_user_id uuid not null references auth.users(id) on delete cascade,
  action_type text not null
    check (action_type in ('set_ready', 'start_game')),
  response_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  primary key (room_id, client_action_id)
);

create unique index cant_stop_room_players_active_seat_uidx
  on public.cant_stop_room_players(room_id, seat)
  where membership_status = 'active';

create unique index cant_stop_room_players_active_user_uidx
  on public.cant_stop_room_players(user_id)
  where membership_status = 'active';

create index cant_stop_room_players_room_idx
  on public.cant_stop_room_players(room_id)
  where membership_status = 'active';

create index cant_stop_rooms_host_user_idx
  on public.cant_stop_rooms(host_user_id);

create index cant_stop_rooms_status_expiry_idx
  on public.cant_stop_rooms(status, expires_at);

create index cant_stop_room_actions_actor_idx
  on public.cant_stop_room_actions(actor_user_id, created_at desc);

alter table public.cant_stop_rooms enable row level security;
alter table public.cant_stop_room_players enable row level security;
alter table public.cant_stop_room_actions enable row level security;

revoke all on table public.cant_stop_rooms from anon, authenticated;
revoke all on table public.cant_stop_room_players from anon, authenticated;
revoke all on table public.cant_stop_room_actions from anon, authenticated;

grant select on table public.cant_stop_rooms to authenticated;
grant select on table public.cant_stop_room_players to authenticated;

create or replace function private.cant_stop_generate_room_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i integer;
begin
  for i in 1..6 loop
    result := result || substr(
      alphabet,
      1 + floor(random() * length(alphabet))::integer,
      1
    );
  end loop;
  return result;
end;
$$;

create or replace function private.cant_stop_is_room_member(p_room_id uuid)
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
      from public.cant_stop_room_players as p
      where p.room_id = p_room_id
        and p.user_id = (select auth.uid())
        and p.membership_status = 'active'
    );
$$;

create or replace function private.cant_stop_room_snapshot(p_room_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_room public.cant_stop_rooms%rowtype;
  v_players jsonb;
  v_player_count integer;
  v_all_ready boolean;
begin
  if (select auth.uid()) is null or not private.is_approved_member() then
    return null;
  end if;

  select r.*
  into v_room
  from public.cant_stop_rooms as r
  where r.id = p_room_id
    and private.cant_stop_is_room_member(r.id);

  if not found then
    return null;
  end if;

  select
    count(*)::integer,
    coalesce(bool_and(p.is_ready), false),
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', p.user_id,
          'userId', p.user_id,
          'displayName', p.nickname,
          'nickname', p.nickname,
          'seat', p.seat,
          'isReady', p.is_ready,
          'connected', true,
          'isHost', p.user_id = v_room.host_user_id
        )
        order by p.seat
      ),
      '[]'::jsonb
    )
  into v_player_count, v_all_ready, v_players
  from public.cant_stop_room_players as p
  where p.room_id = p_room_id
    and p.membership_status = 'active';

  return jsonb_build_object(
    'version', v_room.version,
    'room', jsonb_build_object(
      'id', v_room.id,
      'roomCode', v_room.room_code,
      'hostUserId', v_room.host_user_id,
      'status', v_room.status,
      'maxPlayers', v_room.max_players,
      'version', v_room.version,
      'expiresAt', v_room.expires_at,
      'playerCount', v_player_count,
      'allReady', v_all_ready,
      'canStart',
        v_room.status = 'waiting'
        and v_player_count between 2 and v_room.max_players
        and v_all_ready
    ),
    'players', v_players,
    'game', v_room.game_state,
    'viewerUserId', (select auth.uid())
  );
end;
$$;

create policy cant_stop_rooms_member_select
  on public.cant_stop_rooms
  for select
  to authenticated
  using (private.cant_stop_is_room_member(id));

create policy cant_stop_room_players_member_select
  on public.cant_stop_room_players
  for select
  to authenticated
  using (private.cant_stop_is_room_member(room_id));

create or replace function public.cant_stop_create_room(
  p_nickname text,
  p_max_players smallint default 4
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_nickname text := btrim(coalesce(p_nickname, ''));
  v_room_id uuid;
  v_code text;
  v_attempt integer;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if char_length(v_nickname) not between 1 and 20 then
    raise exception 'INVALID_NICKNAME' using errcode = 'P0001';
  end if;
  if p_max_players is null or p_max_players not between 2 and 4 then
    raise exception 'INVALID_MAX_PLAYERS' using errcode = 'P0001';
  end if;

  update public.cant_stop_room_players as p
  set membership_status = 'left',
      is_ready = false,
      left_at = now()
  where p.user_id = v_user_id
    and p.membership_status = 'active'
    and exists (
      select 1
      from public.cant_stop_rooms as r
      where r.id = p.room_id
        and (r.status = 'closed' or r.expires_at <= now())
    );

  if exists (
    select 1
    from public.cant_stop_room_players as p
    join public.cant_stop_rooms as r on r.id = p.room_id
    where p.user_id = v_user_id
      and p.membership_status = 'active'
      and r.status in ('waiting', 'playing')
      and r.expires_at > now()
  ) then
    raise exception 'ACTIVE_ROOM_EXISTS' using errcode = 'P0001';
  end if;

  for v_attempt in 1..20 loop
    v_code := private.cant_stop_generate_room_code();
    begin
      insert into public.cant_stop_rooms(room_code, host_user_id, max_players)
      values (v_code, v_user_id, p_max_players)
      returning id into v_room_id;
      exit;
    exception when unique_violation then
      v_room_id := null;
    end;
  end loop;

  if v_room_id is null then
    raise exception 'ROOM_CODE_EXHAUSTED' using errcode = 'P0001';
  end if;

  insert into public.cant_stop_room_players(
    room_id,
    user_id,
    nickname,
    seat,
    is_ready
  )
  values (
    v_room_id,
    v_user_id,
    v_nickname,
    0,
    true
  );

  return private.cant_stop_room_snapshot(v_room_id);
end;
$$;

create or replace function public.cant_stop_join_room(
  p_room_code text,
  p_nickname text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_nickname text := btrim(coalesce(p_nickname, ''));
  v_room public.cant_stop_rooms%rowtype;
  v_existing public.cant_stop_room_players%rowtype;
  v_seat smallint;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if char_length(v_nickname) not between 1 and 20 then
    raise exception 'INVALID_NICKNAME' using errcode = 'P0001';
  end if;

  update public.cant_stop_room_players as p
  set membership_status = 'left',
      is_ready = false,
      left_at = now()
  where p.user_id = v_user_id
    and p.membership_status = 'active'
    and exists (
      select 1
      from public.cant_stop_rooms as r
      where r.id = p.room_id
        and (r.status = 'closed' or r.expires_at <= now())
    );

  select r.*
  into v_room
  from public.cant_stop_rooms as r
  where r.room_code = upper(btrim(coalesce(p_room_code, '')))
    and r.status = 'waiting'
    and r.expires_at > now()
  for update;

  if not found then
    raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001';
  end if;

  if exists (
    select 1
    from public.cant_stop_room_players as p
    join public.cant_stop_rooms as r on r.id = p.room_id
    where p.user_id = v_user_id
      and p.membership_status = 'active'
      and p.room_id <> v_room.id
      and r.status in ('waiting', 'playing')
      and r.expires_at > now()
  ) then
    raise exception 'ACTIVE_ROOM_EXISTS' using errcode = 'P0001';
  end if;

  select p.*
  into v_existing
  from public.cant_stop_room_players as p
  where p.room_id = v_room.id
    and p.user_id = v_user_id;

  if found and v_existing.membership_status = 'active' then
    update public.cant_stop_room_players
    set nickname = v_nickname
    where id = v_existing.id;

    update public.cant_stop_rooms
    set version = version + 1,
        updated_at = now()
    where id = v_room.id;

    return private.cant_stop_room_snapshot(v_room.id);
  end if;

  select gs::smallint
  into v_seat
  from generate_series(0, v_room.max_players - 1) as gs
  where not exists (
    select 1
    from public.cant_stop_room_players as p
    where p.room_id = v_room.id
      and p.seat = gs
      and p.membership_status = 'active'
  )
  order by gs
  limit 1;

  if v_seat is null then
    raise exception 'ROOM_FULL' using errcode = 'P0001';
  end if;

  if v_existing.id is not null then
    update public.cant_stop_room_players
    set nickname = v_nickname,
        seat = v_seat,
        is_ready = false,
        membership_status = 'active',
        joined_at = now(),
        left_at = null
    where id = v_existing.id;
  else
    insert into public.cant_stop_room_players(
      room_id,
      user_id,
      nickname,
      seat,
      is_ready
    )
    values (
      v_room.id,
      v_user_id,
      v_nickname,
      v_seat,
      false
    );
  end if;

  update public.cant_stop_rooms
  set version = version + 1,
      updated_at = now()
  where id = v_room.id;

  return private.cant_stop_room_snapshot(v_room.id);
end;
$$;

create or replace function public.cant_stop_get_my_active_room()
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

  select p.room_id
  into v_room_id
  from public.cant_stop_room_players as p
  join public.cant_stop_rooms as r on r.id = p.room_id
  where p.user_id = (select auth.uid())
    and p.membership_status = 'active'
    and r.status in ('waiting', 'playing')
    and r.expires_at > now()
  order by p.joined_at desc
  limit 1;

  if v_room_id is null then
    return null;
  end if;

  return private.cant_stop_room_snapshot(v_room_id);
end;
$$;

create or replace function public.cant_stop_get_lobby_snapshot(p_room_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_snapshot jsonb;
begin
  if (select auth.uid()) is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  v_snapshot := private.cant_stop_room_snapshot(p_room_id);
  if v_snapshot is null then
    raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001';
  end if;
  return v_snapshot;
end;
$$;

create or replace function public.cant_stop_set_ready(
  p_room_id uuid,
  p_ready boolean,
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

  perform pg_advisory_xact_lock(
    hashtextextended(p_room_id::text || ':' || v_action_id, 0)
  );

  select a.actor_user_id, a.action_type, a.response_snapshot
  into v_replay_actor, v_replay_type, v_replay
  from public.cant_stop_room_actions as a
  where a.room_id = p_room_id
    and a.client_action_id = v_action_id;

  if found then
    if v_replay_actor <> v_user_id or v_replay_type <> 'set_ready' then
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
  if v_room.status <> 'waiting' then
    raise exception 'ROOM_NOT_WAITING' using errcode = 'P0001';
  end if;
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
  end if;
  if not private.cant_stop_is_room_member(p_room_id) then
    raise exception 'NOT_ROOM_MEMBER' using errcode = 'P0001';
  end if;

  update public.cant_stop_room_players
  set is_ready = case
    when user_id = v_room.host_user_id then true
    else coalesce(p_ready, false)
  end
  where room_id = p_room_id
    and user_id = v_user_id
    and membership_status = 'active';

  update public.cant_stop_rooms
  set version = version + 1,
      updated_at = now()
  where id = p_room_id;

  v_snapshot := private.cant_stop_room_snapshot(p_room_id);

  insert into public.cant_stop_room_actions(
    room_id,
    client_action_id,
    actor_user_id,
    action_type,
    response_snapshot
  )
  values (
    p_room_id,
    v_action_id,
    v_user_id,
    'set_ready',
    v_snapshot
  );

  return v_snapshot;
end;
$$;

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
  if v_room.status <> 'waiting' then
    raise exception 'ROOM_NOT_WAITING' using errcode = 'P0001';
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

  update public.cant_stop_room_players
  set is_ready = true
  where room_id = p_room_id
    and user_id = v_next_host
    and membership_status = 'active';

  return null;
end;
$$;

create or replace function public.cant_stop_start_game(
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
  v_player_count integer;
  v_all_ready boolean;
  v_turn_order uuid[];
  v_game_state jsonb;
  v_snapshot jsonb;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if char_length(v_action_id) not between 1 and 100 then
    raise exception 'INVALID_ACTION_ID' using errcode = 'P0001';
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
    if v_replay_actor <> v_user_id or v_replay_type <> 'start_game' then
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
  if v_room.status <> 'waiting' then
    raise exception 'ROOM_NOT_WAITING' using errcode = 'P0001';
  end if;
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT' using errcode = 'P0001';
  end if;
  if not private.cant_stop_is_room_member(p_room_id) then
    raise exception 'NOT_ROOM_MEMBER' using errcode = 'P0001';
  end if;
  if v_room.host_user_id <> v_user_id then
    raise exception 'HOST_REQUIRED' using errcode = 'P0001';
  end if;

  select
    count(*)::integer,
    coalesce(bool_and(p.is_ready), false),
    array_agg(p.user_id order by random())
  into v_player_count, v_all_ready, v_turn_order
  from public.cant_stop_room_players as p
  where p.room_id = p_room_id
    and p.membership_status = 'active';

  if v_player_count < 2 or v_player_count > v_room.max_players then
    raise exception 'INVALID_PLAYER_COUNT' using errcode = 'P0001';
  end if;
  if not v_all_ready then
    raise exception 'PLAYERS_NOT_READY' using errcode = 'P0001';
  end if;

  v_game_state := jsonb_build_object(
    'phase', 'TURN_ROLL',
    'turnOrder', to_jsonb(v_turn_order),
    'turnIndex', 0,
    'activePlayerId', v_turn_order[1],
    'claimedColumns', '{}'::jsonb,
    'runners', '{}'::jsonb,
    'latestDice', null,
    'legalPairings', '[]'::jsonb,
    'winnerId', null
  );

  update public.cant_stop_rooms
  set status = 'playing',
      game_state = v_game_state,
      version = version + 1,
      updated_at = now()
  where id = p_room_id;

  v_snapshot := private.cant_stop_room_snapshot(p_room_id);

  insert into public.cant_stop_room_actions(
    room_id,
    client_action_id,
    actor_user_id,
    action_type,
    response_snapshot
  )
  values (
    p_room_id,
    v_action_id,
    v_user_id,
    'start_game',
    v_snapshot
  );

  return v_snapshot;
end;
$$;

revoke all on function private.cant_stop_generate_room_code()
  from public, anon, authenticated;
revoke all on function private.cant_stop_is_room_member(uuid)
  from public, anon, authenticated;
revoke all on function private.cant_stop_room_snapshot(uuid)
  from public, anon, authenticated;

grant execute on function private.cant_stop_is_room_member(uuid)
  to authenticated;

revoke all on function public.cant_stop_create_room(text, smallint)
  from public, anon, authenticated;
revoke all on function public.cant_stop_join_room(text, text)
  from public, anon, authenticated;
revoke all on function public.cant_stop_get_my_active_room()
  from public, anon, authenticated;
revoke all on function public.cant_stop_get_lobby_snapshot(uuid)
  from public, anon, authenticated;
revoke all on function public.cant_stop_set_ready(uuid, boolean, bigint, text)
  from public, anon, authenticated;
revoke all on function public.cant_stop_leave_room(uuid, bigint)
  from public, anon, authenticated;
revoke all on function public.cant_stop_start_game(uuid, bigint, text)
  from public, anon, authenticated;

grant execute on function public.cant_stop_create_room(text, smallint)
  to authenticated;
grant execute on function public.cant_stop_join_room(text, text)
  to authenticated;
grant execute on function public.cant_stop_get_my_active_room()
  to authenticated;
grant execute on function public.cant_stop_get_lobby_snapshot(uuid)
  to authenticated;
grant execute on function public.cant_stop_set_ready(uuid, boolean, bigint, text)
  to authenticated;
grant execute on function public.cant_stop_leave_room(uuid, bigint)
  to authenticated;
grant execute on function public.cant_stop_start_game(uuid, bigint, text)
  to authenticated;

alter publication supabase_realtime add table public.cant_stop_rooms;
alter publication supabase_realtime add table public.cant_stop_room_players;

commit;
