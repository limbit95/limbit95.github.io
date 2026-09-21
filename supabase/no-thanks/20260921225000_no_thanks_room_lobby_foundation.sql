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
  game_state jsonb,
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
  cards integer[] not null default '{}',
  membership_status text not null default 'active'
    check (membership_status in ('active', 'left')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  unique (room_id, user_id)
);

create table public.no_thanks_room_actions (
  room_id uuid not null references public.no_thanks_rooms(id) on delete cascade,
  client_action_id text not null
    check (char_length(btrim(client_action_id)) between 1 and 100),
  actor_user_id uuid not null references auth.users(id) on delete cascade,
  action_type text not null
    check (action_type in ('set_ready', 'start_game')),
  request_payload jsonb not null default '{}'::jsonb,
  response_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  primary key (room_id, client_action_id)
);

create table public.no_thanks_room_private_state (
  room_id uuid primary key references public.no_thanks_rooms(id) on delete cascade,
  draw_deck integer[] not null default '{}',
  excluded_cards integer[] not null default '{}',
  player_counters jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
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

create index no_thanks_rooms_status_expiry_idx
  on public.no_thanks_rooms(status, expires_at);

alter table public.no_thanks_rooms enable row level security;
alter table public.no_thanks_room_players enable row level security;
alter table public.no_thanks_room_actions enable row level security;
alter table public.no_thanks_room_private_state enable row level security;

revoke all on table public.no_thanks_rooms from anon, authenticated;
revoke all on table public.no_thanks_room_players from anon, authenticated;
revoke all on table public.no_thanks_room_actions from anon, authenticated;
revoke all on table public.no_thanks_room_private_state from anon, authenticated;

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

create or replace function private.no_thanks_profile_display_name(p_user_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_name text;
begin
  select btrim(p.display_name)
    into v_name
  from public.profiles as p
  where p.id = p_user_id
    and p.status = 'approved';

  if v_name is null or v_name = '' then
    raise exception 'AUTH_REQUIRED';
  end if;
  return v_name;
end;
$$;

create or replace function private.no_thanks_snapshot(
  p_room_id uuid,
  p_viewer_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_room public.no_thanks_rooms%rowtype;
  v_players jsonb;
  v_counters jsonb;
  v_viewer_counters integer;
begin
  if p_viewer_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;

  if not exists (
    select 1
    from public.no_thanks_room_players as p
    where p.room_id = p_room_id
      and p.user_id = p_viewer_id
      and p.membership_status = 'active'
  ) then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  select *
    into v_room
  from public.no_thanks_rooms
  where id = p_room_id;

  if not found then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'userId', p.user_id,
        'displayName', p.display_name,
        'seat', p.seat,
        'isReady', p.is_ready,
        'cards', to_jsonb(p.cards)
      )
      order by p.seat
    ),
    '[]'::jsonb
  )
    into v_players
  from public.no_thanks_room_players as p
  where p.room_id = p_room_id
    and p.membership_status = 'active';

  select s.player_counters
    into v_counters
  from public.no_thanks_room_private_state as s
  where s.room_id = p_room_id;

  if v_counters is not null and v_counters ? p_viewer_id::text then
    v_viewer_counters := (v_counters ->> p_viewer_id::text)::integer;
  else
    v_viewer_counters := null;
  end if;

  return jsonb_build_object(
    'version', v_room.version,
    'room', jsonb_build_object(
      'id', v_room.id,
      'roomCode', v_room.room_code,
      'hostUserId', v_room.host_user_id,
      'status', v_room.status,
      'maxPlayers', v_room.max_players
    ),
    'players', v_players,
    'game', v_room.game_state,
    'viewer', jsonb_build_object(
      'playerId', p_viewer_id,
      'counters', v_viewer_counters
    )
  );
end;
$$;

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
  v_room_code text;
  v_attempt integer;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;
  if p_max_players < 3 or p_max_players > 7 then
    raise exception 'INVALID_PLAYER_LIMIT';
  end if;
  if exists (
    select 1 from public.no_thanks_room_players
    where user_id = v_user_id and membership_status = 'active'
  ) then
    raise exception 'ACTIVE_ROOM_EXISTS';
  end if;

  v_display_name := private.no_thanks_profile_display_name(v_user_id);

  for v_attempt in 1..20 loop
    v_room_code := private.no_thanks_generate_room_code();
    begin
      insert into public.no_thanks_rooms(room_code, host_user_id, max_players)
      values (v_room_code, v_user_id, p_max_players)
      returning id into v_room_id;
      exit;
    exception when unique_violation then
      if v_attempt = 20 then raise; end if;
    end;
  end loop;

  insert into public.no_thanks_room_players(
    room_id, user_id, display_name, seat, is_ready
  )
  values (v_room_id, v_user_id, v_display_name, 0, false);

  return private.no_thanks_snapshot(v_room_id, v_user_id);
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
  v_count integer;
  v_seat integer;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;

  v_display_name := private.no_thanks_profile_display_name(v_user_id);

  select *
    into v_room
  from public.no_thanks_rooms
  where room_code = upper(btrim(p_room_code))
  for update;

  if not found or v_room.status <> 'waiting' or v_room.expires_at <= now() then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  if exists (
    select 1 from public.no_thanks_room_players
    where user_id = v_user_id and membership_status = 'active'
  ) then
    raise exception 'ACTIVE_ROOM_EXISTS';
  end if;

  select count(*)
    into v_count
  from public.no_thanks_room_players
  where room_id = v_room.id and membership_status = 'active';

  if v_count >= v_room.max_players then
    raise exception 'ROOM_FULL';
  end if;

  select seat
    into v_seat
  from generate_series(0, v_room.max_players - 1) as seat
  where not exists (
    select 1
    from public.no_thanks_room_players as p
    where p.room_id = v_room.id
      and p.membership_status = 'active'
      and p.seat = seat
  )
  order by seat
  limit 1;

  insert into public.no_thanks_room_players(
    room_id, user_id, display_name, seat, is_ready, membership_status, left_at
  )
  values (v_room.id, v_user_id, v_display_name, v_seat, false, 'active', null)
  on conflict (room_id, user_id) do update
    set display_name = excluded.display_name,
        seat = excluded.seat,
        is_ready = false,
        membership_status = 'active',
        left_at = null;

  update public.no_thanks_rooms
  set version = version + 1,
      updated_at = now()
  where id = v_room.id;

  return private.no_thanks_snapshot(v_room.id, v_user_id);
end;
$$;

create or replace function public.no_thanks_get_my_active_room()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_room_id uuid;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;

  select p.room_id
    into v_room_id
  from public.no_thanks_room_players as p
  join public.no_thanks_rooms as r on r.id = p.room_id
  where p.user_id = v_user_id
    and p.membership_status = 'active'
    and r.status <> 'closed'
  order by p.joined_at desc
  limit 1;

  if v_room_id is null then return null; end if;
  return private.no_thanks_snapshot(v_room_id, v_user_id);
end;
$$;

create or replace function public.no_thanks_get_lobby_snapshot(
  p_room_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  return private.no_thanks_snapshot(p_room_id, (select auth.uid()));
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
  v_room public.no_thanks_rooms%rowtype;
  v_existing public.no_thanks_room_actions%rowtype;
  v_payload jsonb := jsonb_build_object('ready', p_ready);
  v_snapshot jsonb;
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
  where room_id = p_room_id and client_action_id = p_client_action_id;

  if found then
    if v_existing.actor_user_id <> v_user_id
      or v_existing.action_type <> 'set_ready'
      or v_existing.request_payload <> v_payload then
      raise exception 'ACTION_CONFLICT';
    end if;
    return v_existing.response_snapshot;
  end if;

  select *
    into v_room
  from public.no_thanks_rooms
  where id = p_room_id
  for update;

  if not found or v_room.status <> 'waiting' then
    raise exception 'ROOM_NOT_FOUND';
  end if;
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;
  if not exists (
    select 1 from public.no_thanks_room_players
    where room_id = p_room_id
      and user_id = v_user_id
      and membership_status = 'active'
  ) then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  update public.no_thanks_room_players
  set is_ready = p_ready
  where room_id = p_room_id and user_id = v_user_id;

  update public.no_thanks_rooms
  set version = version + 1, updated_at = now()
  where id = p_room_id;

  v_snapshot := private.no_thanks_snapshot(p_room_id, v_user_id);

  insert into public.no_thanks_room_actions(
    room_id, client_action_id, actor_user_id, action_type, request_payload, response_snapshot
  )
  values (
    p_room_id, p_client_action_id, v_user_id, 'set_ready', v_payload, v_snapshot
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
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;

  select * into v_room
  from public.no_thanks_rooms
  where id = p_room_id
  for update;

  if not found or v_room.status <> 'waiting' then
    raise exception 'ROOM_NOT_FOUND';
  end if;
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;
  if not exists (
    select 1 from public.no_thanks_room_players
    where room_id = p_room_id
      and user_id = v_user_id
      and membership_status = 'active'
  ) then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  if v_room.host_user_id = v_user_id then
    update public.no_thanks_room_players
    set membership_status = 'left', left_at = now(), is_ready = false
    where room_id = p_room_id and membership_status = 'active';

    update public.no_thanks_rooms
    set status = 'closed', version = version + 1, updated_at = now()
    where id = p_room_id;
  else
    update public.no_thanks_room_players
    set membership_status = 'left', left_at = now(), is_ready = false
    where room_id = p_room_id and user_id = v_user_id;

    update public.no_thanks_rooms
    set version = version + 1, updated_at = now()
    where id = p_room_id;
  end if;

  return jsonb_build_object('left', true, 'roomId', p_room_id);
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
  v_room public.no_thanks_rooms%rowtype;
  v_existing public.no_thanks_room_actions%rowtype;
  v_payload jsonb := '{}'::jsonb;
  v_player_count integer;
  v_unready integer;
  v_initial_counters integer;
  v_turn_order uuid[];
  v_cards integer[];
  v_draw_deck integer[];
  v_excluded integer[];
  v_player_counters jsonb;
  v_public_players jsonb;
  v_game jsonb;
  v_snapshot jsonb;
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
  where room_id = p_room_id and client_action_id = p_client_action_id;

  if found then
    if v_existing.actor_user_id <> v_user_id
      or v_existing.action_type <> 'start_game'
      or v_existing.request_payload <> v_payload then
      raise exception 'ACTION_CONFLICT';
    end if;
    return v_existing.response_snapshot;
  end if;

  select * into v_room
  from public.no_thanks_rooms
  where id = p_room_id
  for update;

  if not found or v_room.status <> 'waiting' then
    raise exception 'ROOM_NOT_FOUND';
  end if;
  if v_room.host_user_id <> v_user_id then
    raise exception 'HOST_REQUIRED';
  end if;
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;

  select count(*)
    into v_player_count
  from public.no_thanks_room_players
  where room_id = p_room_id and membership_status = 'active';

  if v_player_count < 3 or v_player_count > 7 then
    raise exception 'PLAYER_COUNT_REQUIRED';
  end if;

  select count(*)
    into v_unready
  from public.no_thanks_room_players
  where room_id = p_room_id
    and membership_status = 'active'
    and user_id <> v_room.host_user_id
    and is_ready = false;

  if v_unready > 0 then
    raise exception 'PLAYERS_NOT_READY';
  end if;

  select array_agg(user_id order by random())
    into v_turn_order
  from public.no_thanks_room_players
  where room_id = p_room_id and membership_status = 'active';

  select array_agg(card)
    into v_cards
  from (
    select generate_series(3, 35) as card
    order by random()
  ) as shuffled;

  v_draw_deck := v_cards[1:24];
  v_excluded := v_cards[25:33];

  if v_player_count <= 5 then
    v_initial_counters := 11;
  elsif v_player_count = 6 then
    v_initial_counters := 9;
  else
    v_initial_counters := 7;
  end if;

  select jsonb_object_agg(user_id::text, v_initial_counters)
    into v_player_counters
  from public.no_thanks_room_players
  where room_id = p_room_id and membership_status = 'active';

  select jsonb_agg(
    jsonb_build_object('playerId', p.user_id, 'cards', '[]'::jsonb)
    order by p.seat
  )
    into v_public_players
  from public.no_thanks_room_players as p
  where p.room_id = p_room_id and p.membership_status = 'active';

  v_game := jsonb_build_object(
    'phase', 'PLAYING',
    'turnOrder', to_jsonb(v_turn_order),
    'turnIndex', 0,
    'activePlayerId', v_turn_order[1],
    'currentCard', v_draw_deck[1],
    'centerCounters', 0,
    'deckRemaining', 23,
    'excludedCount', 9,
    'players', coalesce(v_public_players, '[]'::jsonb),
    'winners', '[]'::jsonb,
    'finalScores', null,
    'endReason', null
  );

  insert into public.no_thanks_room_private_state(
    room_id, draw_deck, excluded_cards, player_counters, updated_at
  )
  values (
    p_room_id,
    coalesce(v_draw_deck[2:24], '{}'::integer[]),
    v_excluded,
    v_player_counters,
    now()
  )
  on conflict (room_id) do update
    set draw_deck = excluded.draw_deck,
        excluded_cards = excluded.excluded_cards,
        player_counters = excluded.player_counters,
        updated_at = excluded.updated_at;

  update public.no_thanks_rooms
  set status = 'playing',
      game_state = v_game,
      version = version + 1,
      updated_at = now()
  where id = p_room_id;

  v_snapshot := private.no_thanks_snapshot(p_room_id, v_user_id);

  insert into public.no_thanks_room_actions(
    room_id, client_action_id, actor_user_id, action_type, request_payload, response_snapshot
  )
  values (
    p_room_id, p_client_action_id, v_user_id, 'start_game', v_payload, v_snapshot
  );

  return v_snapshot;
end;
$$;

revoke all on function public.no_thanks_create_room(smallint) from public, anon, authenticated;
revoke all on function public.no_thanks_join_room(text) from public, anon, authenticated;
revoke all on function public.no_thanks_get_my_active_room() from public, anon, authenticated;
revoke all on function public.no_thanks_get_lobby_snapshot(uuid) from public, anon, authenticated;
revoke all on function public.no_thanks_set_ready(uuid, boolean, bigint, text) from public, anon, authenticated;
revoke all on function public.no_thanks_leave_room(uuid, bigint) from public, anon, authenticated;
revoke all on function public.no_thanks_start_game(uuid, bigint, text) from public, anon, authenticated;

grant execute on function public.no_thanks_create_room(smallint) to authenticated;
grant execute on function public.no_thanks_join_room(text) to authenticated;
grant execute on function public.no_thanks_get_my_active_room() to authenticated;
grant execute on function public.no_thanks_get_lobby_snapshot(uuid) to authenticated;
grant execute on function public.no_thanks_set_ready(uuid, boolean, bigint, text) to authenticated;
grant execute on function public.no_thanks_leave_room(uuid, bigint) to authenticated;
grant execute on function public.no_thanks_start_game(uuid, bigint, text) to authenticated;

commit;
