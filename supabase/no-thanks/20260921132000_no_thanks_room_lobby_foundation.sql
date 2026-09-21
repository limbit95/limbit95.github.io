begin;

create table public.no_thanks_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique
    check (room_code ~ '^[A-HJ-NP-Z2-9]{6}$'),
  host_user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'waiting'
    check (status in ('waiting', 'playing', 'closed')),
  max_players smallint not null default 7
    check (max_players between 3 and 7),
  version bigint not null default 0
    check (version >= 0),
  public_game_state jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '8 hours')
);

create table public.no_thanks_room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.no_thanks_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null
    check (char_length(btrim(display_name)) between 1 and 50),
  seat smallint not null
    check (seat between 0 and 6),
  is_ready boolean not null default false,
  membership_status text not null default 'active'
    check (membership_status in ('active', 'left')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  unique (room_id, user_id)
);

create table public.no_thanks_room_private_players (
  room_id uuid not null,
  user_id uuid not null,
  counters smallint not null
    check (counters >= 0),
  primary key (room_id, user_id),
  foreign key (room_id, user_id)
    references public.no_thanks_room_players(room_id, user_id)
    on delete cascade
);

create table public.no_thanks_room_secrets (
  room_id uuid primary key references public.no_thanks_rooms(id) on delete cascade,
  draw_deck smallint[] not null,
  excluded_cards smallint[] not null,
  created_at timestamptz not null default now(),
  check (cardinality(draw_deck) between 0 and 23),
  check (cardinality(excluded_cards) = 9)
);

create table public.no_thanks_room_actions (
  room_id uuid not null references public.no_thanks_rooms(id) on delete cascade,
  client_action_id text not null
    check (char_length(btrim(client_action_id)) between 1 and 100),
  actor_user_id uuid not null references auth.users(id) on delete cascade,
  action_type text not null
    check (action_type in ('set_ready', 'start_game')),
  response_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  primary key (room_id, client_action_id)
);

create unique index no_thanks_room_players_active_seat_uidx
  on public.no_thanks_room_players(room_id, seat)
  where membership_status = 'active';

create unique index no_thanks_room_players_active_user_uidx
  on public.no_thanks_room_players(user_id)
  where membership_status = 'active';

create index no_thanks_room_players_room_idx
  on public.no_thanks_room_players(room_id)
  where membership_status = 'active';

create index no_thanks_rooms_host_user_idx
  on public.no_thanks_rooms(host_user_id);

create index no_thanks_rooms_status_expiry_idx
  on public.no_thanks_rooms(status, expires_at);

create index no_thanks_room_actions_actor_idx
  on public.no_thanks_room_actions(actor_user_id, created_at desc);

alter table public.no_thanks_rooms enable row level security;
alter table public.no_thanks_room_players enable row level security;
alter table public.no_thanks_room_private_players enable row level security;
alter table public.no_thanks_room_secrets enable row level security;
alter table public.no_thanks_room_actions enable row level security;

revoke all on table public.no_thanks_rooms from anon, authenticated;
revoke all on table public.no_thanks_room_players from anon, authenticated;
revoke all on table public.no_thanks_room_private_players from anon, authenticated;
revoke all on table public.no_thanks_room_secrets from anon, authenticated;
revoke all on table public.no_thanks_room_actions from anon, authenticated;

grant select on table public.no_thanks_rooms to authenticated;
grant select on table public.no_thanks_room_players to authenticated;

create or replace function private.no_thanks_generate_room_code()
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

create or replace function private.no_thanks_is_room_member(p_room_id uuid)
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
      from public.no_thanks_room_players as p
      where p.room_id = p_room_id
        and p.user_id = (select auth.uid())
        and p.membership_status = 'active'
    );
$$;

create or replace function private.no_thanks_room_snapshot(p_room_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_room public.no_thanks_rooms%rowtype;
  v_players jsonb;
  v_player_count integer;
  v_all_ready boolean;
  v_viewer_counters smallint;
begin
  if (select auth.uid()) is null or not private.is_approved_member() then
    return null;
  end if;

  select r.*
  into v_room
  from public.no_thanks_rooms as r
  where r.id = p_room_id
    and private.no_thanks_is_room_member(r.id);

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
          'displayName', p.display_name,
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
  from public.no_thanks_room_players as p
  where p.room_id = p_room_id
    and p.membership_status = 'active';

  select pp.counters
  into v_viewer_counters
  from public.no_thanks_room_private_players as pp
  where pp.room_id = p_room_id
    and pp.user_id = (select auth.uid());

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
        and v_player_count between 3 and v_room.max_players
        and v_all_ready
    ),
    'players', v_players,
    'game', v_room.public_game_state,
    'viewer', jsonb_build_object(
      'playerId', (select auth.uid()),
      'counters', v_viewer_counters
    )
  );
end;
$$;

create policy no_thanks_rooms_member_select
  on public.no_thanks_rooms
  for select
  to authenticated
  using (private.no_thanks_is_room_member(id));

create policy no_thanks_room_players_member_select
  on public.no_thanks_room_players
  for select
  to authenticated
  using (private.no_thanks_is_room_member(room_id));

create or replace function public.no_thanks_create_room(
  p_max_players smallint default 7
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_display_name text;
  v_room_id uuid;
  v_code text;
  v_attempt integer;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  select btrim(p.display_name)
  into v_display_name
  from public.profiles as p
  where p.id = v_user_id
    and p.status = 'approved';

  if coalesce(v_display_name, '') = '' then
    raise exception 'PROFILE_DISPLAY_NAME_REQUIRED' using errcode = 'P0001';
  end if;

  if p_max_players is null or p_max_players not between 3 and 7 then
    raise exception 'INVALID_MAX_PLAYERS' using errcode = 'P0001';
  end if;

  update public.no_thanks_room_players as p
  set membership_status = 'left',
      is_ready = false,
      left_at = now()
  where p.user_id = v_user_id
    and p.membership_status = 'active'
    and exists (
      select 1
      from public.no_thanks_rooms as r
      where r.id = p.room_id
        and (r.status = 'closed' or r.expires_at <= now())
    );

  if exists (
    select 1
    from public.no_thanks_room_players as p
    join public.no_thanks_rooms as r on r.id = p.room_id
    where p.user_id = v_user_id
      and p.membership_status = 'active'
      and r.status in ('waiting', 'playing')
      and r.expires_at > now()
  ) then
    raise exception 'ACTIVE_ROOM_EXISTS' using errcode = 'P0001';
  end if;

  for v_attempt in 1..20 loop
    v_code := private.no_thanks_generate_room_code();
    begin
      insert into public.no_thanks_rooms(room_code, host_user_id, max_players)
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

  insert into public.no_thanks_room_players(
    room_id,
    user_id,
    display_name,
    seat,
    is_ready
  )
  values (
    v_room_id,
    v_user_id,
    v_display_name,
    0,
    true
  );

  return private.no_thanks_room_snapshot(v_room_id);
end;
$$;

create or replace function public.no_thanks_join_room(
  p_room_code text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_display_name text;
  v_room public.no_thanks_rooms%rowtype;
  v_existing public.no_thanks_room_players%rowtype;
  v_seat smallint;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  select btrim(p.display_name)
  into v_display_name
  from public.profiles as p
  where p.id = v_user_id
    and p.status = 'approved';

  if coalesce(v_display_name, '') = '' then
    raise exception 'PROFILE_DISPLAY_NAME_REQUIRED' using errcode = 'P0001';
  end if;

  update public.no_thanks_room_players as p
  set membership_status = 'left',
      is_ready = false,
      left_at = now()
  where p.user_id = v_user_id
    and p.membership_status = 'active'
    and exists (
      select 1
      from public.no_thanks_rooms as r
      where r.id = p.room_id
        and (r.status = 'closed' or r.expires_at <= now())
    );

  select r.*
  into v_room
  from public.no_thanks_rooms as r
  where r.room_code = upper(btrim(coalesce(p_room_code, '')))
    and r.status = 'waiting'
    and r.expires_at > now()
  for update;

  if not found then
    raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001';
  end if;

  if exists (
    select 1
    from public.no_thanks_room_players as p
    join public.no_thanks_rooms as r on r.id = p.room_id
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
  from public.no_thanks_room_players as p
  where p.room_id = v_room.id
    and p.user_id = v_user_id;

  if found and v_existing.membership_status = 'active' then
    update public.no_thanks_room_players
    set display_name = v_display_name
    where id = v_existing.id;

    update public.no_thanks_rooms
    set version = version + 1,
        updated_at = now()
    where id = v_room.id;

    return private.no_thanks_room_snapshot(v_room.id);
  end if;

  select gs::smallint
  into v_seat
  from generate_series(0, v_room.max_players - 1) as gs
  where not exists (
    select 1
    from public.no_thanks_room_players as p
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
    update public.no_thanks_room_players
    set display_name = v_display_name,
        seat = v_seat,
        is_ready = false,
        membership_status = 'active',
        joined_at = now(),
        left_at = null
    where id = v_existing.id;
  else
    insert into public.no_thanks_room_players(
      room_id,
      user_id,
      display_name,
      seat,
      is_ready
    )
    values (
      v_room.id,
      v_user_id,
      v_display_name,
      v_seat,
      false
    );
  end if;

  update public.no_thanks_rooms
  set version = version + 1,
      updated_at = now()
  where id = v_room.id;

  return private.no_thanks_room_snapshot(v_room.id);
end;
$$;

create or replace function public.no_thanks_get_my_active_room()
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
  from public.no_thanks_room_players as p
  join public.no_thanks_rooms as r on r.id = p.room_id
  where p.user_id = (select auth.uid())
    and p.membership_status = 'active'
    and r.status in ('waiting', 'playing')
    and r.expires_at > now()
  order by p.joined_at desc
  limit 1;

  if v_room_id is null then
    return null;
  end if;

  return private.no_thanks_room_snapshot(v_room_id);
end;
$$;

create or replace function public.no_thanks_get_lobby_snapshot(p_room_id uuid)
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

  v_snapshot := private.no_thanks_room_snapshot(p_room_id);
  if v_snapshot is null then
    raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001';
  end if;

  return v_snapshot;
end;
$$;

create or replace function public.no_thanks_set_ready(
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
  v_room public.no_thanks_rooms%rowtype;
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

  if not private.no_thanks_is_room_member(p_room_id) then
    raise exception 'NOT_ROOM_MEMBER' using errcode = 'P0001';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(p_room_id::text || ':' || v_action_id, 0)
  );

  select a.actor_user_id, a.action_type, a.response_snapshot
  into v_replay_actor, v_replay_type, v_replay
  from public.no_thanks_room_actions as a
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
  from public.no_thanks_rooms as r
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

  if not private.no_thanks_is_room_member(p_room_id) then
    raise exception 'NOT_ROOM_MEMBER' using errcode = 'P0001';
  end if;

  update public.no_thanks_room_players
  set is_ready = case
    when user_id = v_room.host_user_id then true
    else coalesce(p_ready, false)
  end
  where room_id = p_room_id
    and user_id = v_user_id
    and membership_status = 'active';

  update public.no_thanks_rooms
  set version = version + 1,
      updated_at = now()
  where id = p_room_id;

  v_snapshot := private.no_thanks_room_snapshot(p_room_id);

  insert into public.no_thanks_room_actions(
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
  v_next_host uuid;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  select r.*
  into v_room
  from public.no_thanks_rooms as r
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

  if not private.no_thanks_is_room_member(p_room_id) then
    raise exception 'NOT_ROOM_MEMBER' using errcode = 'P0001';
  end if;

  update public.no_thanks_room_players
  set membership_status = 'left',
      is_ready = false,
      left_at = now()
  where room_id = p_room_id
    and user_id = v_user_id
    and membership_status = 'active';

  if v_room.host_user_id = v_user_id then
    select p.user_id
    into v_next_host
    from public.no_thanks_room_players as p
    where p.room_id = p_room_id
      and p.membership_status = 'active'
    order by p.seat
    limit 1;
  else
    v_next_host := v_room.host_user_id;
  end if;

  if v_next_host is null then
    update public.no_thanks_rooms
    set status = 'closed',
        version = version + 1,
        updated_at = now()
    where id = p_room_id;

    return null;
  end if;

  update public.no_thanks_rooms
  set host_user_id = v_next_host,
      version = version + 1,
      updated_at = now()
  where id = p_room_id;

  update public.no_thanks_room_players
  set is_ready = true
  where room_id = p_room_id
    and user_id = v_next_host
    and membership_status = 'active';

  return null;
end;
$$;

create or replace function public.no_thanks_start_game(
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
  v_room public.no_thanks_rooms%rowtype;
  v_replay_actor uuid;
  v_replay_type text;
  v_replay jsonb;
  v_player_count integer;
  v_all_ready boolean;
  v_turn_order uuid[];
  v_all_cards smallint[];
  v_initial_counters smallint;
  v_game_players jsonb;
  v_game_state jsonb;
  v_snapshot jsonb;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  if char_length(v_action_id) not between 1 and 100 then
    raise exception 'INVALID_ACTION_ID' using errcode = 'P0001';
  end if;

  if not private.no_thanks_is_room_member(p_room_id) then
    raise exception 'NOT_ROOM_MEMBER' using errcode = 'P0001';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(p_room_id::text || ':' || v_action_id, 0)
  );

  select a.actor_user_id, a.action_type, a.response_snapshot
  into v_replay_actor, v_replay_type, v_replay
  from public.no_thanks_room_actions as a
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
  from public.no_thanks_rooms as r
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

  if not private.no_thanks_is_room_member(p_room_id) then
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
  from public.no_thanks_room_players as p
  where p.room_id = p_room_id
    and p.membership_status = 'active';

  if v_player_count < 3 or v_player_count > v_room.max_players then
    raise exception 'INVALID_PLAYER_COUNT' using errcode = 'P0001';
  end if;

  if not v_all_ready then
    raise exception 'PLAYERS_NOT_READY' using errcode = 'P0001';
  end if;

  select array_agg(card order by sort_key)
  into v_all_cards
  from (
    select gs::smallint as card, random() as sort_key
    from generate_series(3, 35) as gs
  ) as shuffled;

  v_initial_counters := case
    when v_player_count between 3 and 5 then 11
    when v_player_count = 6 then 9
    else 7
  end;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', p.user_id,
        'cards', '[]'::jsonb
      )
      order by array_position(v_turn_order, p.user_id)
    ),
    '[]'::jsonb
  )
  into v_game_players
  from public.no_thanks_room_players as p
  where p.room_id = p_room_id
    and p.membership_status = 'active';

  delete from public.no_thanks_room_private_players
  where room_id = p_room_id;

  delete from public.no_thanks_room_secrets
  where room_id = p_room_id;

  insert into public.no_thanks_room_private_players(
    room_id,
    user_id,
    counters
  )
  select
    p_room_id,
    p.user_id,
    v_initial_counters
  from public.no_thanks_room_players as p
  where p.room_id = p_room_id
    and p.membership_status = 'active';

  insert into public.no_thanks_room_secrets(
    room_id,
    draw_deck,
    excluded_cards
  )
  values (
    p_room_id,
    v_all_cards[2:24],
    v_all_cards[25:33]
  );

  v_game_state := jsonb_build_object(
    'phase', 'PLAYING',
    'turnOrder', to_jsonb(v_turn_order),
    'turnIndex', 0,
    'activePlayerId', v_turn_order[1],
    'currentCard', v_all_cards[1],
    'centerCounters', 0,
    'deckRemaining', 23,
    'excludedCount', 9,
    'players', v_game_players,
    'winners', '[]'::jsonb,
    'finalScores', null,
    'endReason', null
  );

  update public.no_thanks_rooms
  set status = 'playing',
      public_game_state = v_game_state,
      version = version + 1,
      updated_at = now()
  where id = p_room_id;

  v_snapshot := private.no_thanks_room_snapshot(p_room_id);

  insert into public.no_thanks_room_actions(
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

revoke all on function private.no_thanks_generate_room_code()
  from public, anon, authenticated;
revoke all on function private.no_thanks_is_room_member(uuid)
  from public, anon, authenticated;
revoke all on function private.no_thanks_room_snapshot(uuid)
  from public, anon, authenticated;

grant execute on function private.no_thanks_is_room_member(uuid)
  to authenticated;

revoke all on function public.no_thanks_create_room(smallint)
  from public, anon, authenticated;
revoke all on function public.no_thanks_join_room(text)
  from public, anon, authenticated;
revoke all on function public.no_thanks_get_my_active_room()
  from public, anon, authenticated;
revoke all on function public.no_thanks_get_lobby_snapshot(uuid)
  from public, anon, authenticated;
revoke all on function public.no_thanks_set_ready(uuid, boolean, bigint, text)
  from public, anon, authenticated;
revoke all on function public.no_thanks_leave_room(uuid, bigint)
  from public, anon, authenticated;
revoke all on function public.no_thanks_start_game(uuid, bigint, text)
  from public, anon, authenticated;

grant execute on function public.no_thanks_create_room(smallint)
  to authenticated;
grant execute on function public.no_thanks_join_room(text)
  to authenticated;
grant execute on function public.no_thanks_get_my_active_room()
  to authenticated;
grant execute on function public.no_thanks_get_lobby_snapshot(uuid)
  to authenticated;
grant execute on function public.no_thanks_set_ready(uuid, boolean, bigint, text)
  to authenticated;
grant execute on function public.no_thanks_leave_room(uuid, bigint)
  to authenticated;
grant execute on function public.no_thanks_start_game(uuid, bigint, text)
  to authenticated;

alter publication supabase_realtime add table public.no_thanks_rooms;
alter publication supabase_realtime add table public.no_thanks_room_players;

commit;
