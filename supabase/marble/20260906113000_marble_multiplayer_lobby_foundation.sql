create table public.marble_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  host_user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'waiting' check (status in ('waiting','playing','closed')),
  theme_key text not null default 'classic',
  max_players smallint not null default 4 check (max_players between 2 and 4),
  version bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '8 hours')
);

create table public.marble_room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.marble_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 20),
  seat smallint not null check (seat between 0 and 3),
  is_ready boolean not null default false,
  membership_status text not null default 'active' check (membership_status in ('active','left')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  unique (room_id, user_id)
);

create unique index marble_room_players_active_seat_idx
  on public.marble_room_players(room_id, seat)
  where membership_status = 'active';

create index marble_room_players_user_idx
  on public.marble_room_players(user_id, membership_status);
create index marble_rooms_status_expiry_idx
  on public.marble_rooms(status, expires_at);

alter table public.marble_rooms enable row level security;
alter table public.marble_room_players enable row level security;

create or replace function public.marble_is_room_member(p_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.marble_room_players rp
    where rp.room_id = p_room_id
      and rp.user_id = auth.uid()
      and rp.membership_status = 'active'
  );
$$;

create policy marble_rooms_member_select
  on public.marble_rooms
  for select
  to authenticated
  using (host_user_id = auth.uid() or public.marble_is_room_member(id));

create policy marble_room_players_member_select
  on public.marble_room_players
  for select
  to authenticated
  using (public.marble_is_room_member(room_id));

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
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select * into v_room
  from public.marble_rooms
  where id = p_room_id;

  if not found or not (v_room.host_user_id = auth.uid() or public.marble_is_room_member(p_room_id)) then
    raise exception 'ROOM_NOT_FOUND';
  end if;

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
  where rp.room_id = p_room_id
    and rp.membership_status = 'active';

  return jsonb_build_object(
    'room', jsonb_build_object(
      'id', v_room.id,
      'roomCode', v_room.room_code,
      'hostUserId', v_room.host_user_id,
      'status', v_room.status,
      'themeKey', v_room.theme_key,
      'maxPlayers', v_room.max_players,
      'version', v_room.version,
      'expiresAt', v_room.expires_at
    ),
    'players', v_players,
    'viewerUserId', auth.uid()
  );
end;
$$;

create or replace function public.marble_create_room(p_nickname text, p_max_players smallint default 4)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_room public.marble_rooms%rowtype;
  v_code text;
  v_nickname text := btrim(coalesce(p_nickname, ''));
  v_attempt integer := 0;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if char_length(v_nickname) < 1 or char_length(v_nickname) > 20 then raise exception 'INVALID_NICKNAME'; end if;
  if p_max_players < 2 or p_max_players > 4 then raise exception 'INVALID_PLAYER_COUNT'; end if;

  if exists (
    select 1 from public.marble_room_players rp
    join public.marble_rooms r on r.id = rp.room_id
    where rp.user_id = v_user
      and rp.membership_status = 'active'
      and r.status in ('waiting','playing')
      and r.expires_at > now()
  ) then
    raise exception 'ACTIVE_ROOM_EXISTS';
  end if;

  loop
    v_attempt := v_attempt + 1;
    v_code := upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 6));
    begin
      insert into public.marble_rooms(room_code, host_user_id, max_players)
      values (v_code, v_user, p_max_players)
      returning * into v_room;
      exit;
    exception when unique_violation then
      if v_attempt >= 8 then raise; end if;
    end;
  end loop;

  insert into public.marble_room_players(room_id, user_id, nickname, seat, is_ready)
  values (v_room.id, v_user, v_nickname, 0, true);

  return public.marble_lobby_snapshot(v_room.id);
end;
$$;

create or replace function public.marble_join_room(p_room_code text, p_nickname text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_room public.marble_rooms%rowtype;
  v_nickname text := btrim(coalesce(p_nickname, ''));
  v_seat smallint;
  v_existing public.marble_room_players%rowtype;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if char_length(v_nickname) < 1 or char_length(v_nickname) > 20 then raise exception 'INVALID_NICKNAME'; end if;

  select * into v_room
  from public.marble_rooms
  where room_code = upper(btrim(coalesce(p_room_code, '')))
    and status = 'waiting'
    and expires_at > now()
  for update;

  if not found then raise exception 'ROOM_NOT_FOUND'; end if;

  select * into v_existing
  from public.marble_room_players
  where room_id = v_room.id and user_id = v_user;

  if found and v_existing.membership_status = 'active' then
    update public.marble_room_players set nickname = v_nickname where id = v_existing.id;
    return public.marble_lobby_snapshot(v_room.id);
  end if;

  select gs::smallint into v_seat
  from generate_series(0, v_room.max_players - 1) gs
  where not exists (
    select 1 from public.marble_room_players rp
    where rp.room_id = v_room.id
      and rp.seat = gs
      and rp.membership_status = 'active'
  )
  order by gs
  limit 1;

  if v_seat is null then raise exception 'ROOM_FULL'; end if;

  if v_existing.id is not null then
    update public.marble_room_players
    set nickname = v_nickname,
        seat = v_seat,
        is_ready = false,
        membership_status = 'active',
        joined_at = now(),
        left_at = null
    where id = v_existing.id;
  else
    insert into public.marble_room_players(room_id, user_id, nickname, seat, is_ready)
    values (v_room.id, v_user, v_nickname, v_seat, false);
  end if;

  update public.marble_rooms
  set version = version + 1, updated_at = now()
  where id = v_room.id;

  return public.marble_lobby_snapshot(v_room.id);
end;
$$;

create or replace function public.marble_get_my_active_room()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_room_id uuid;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;

  select rp.room_id into v_room_id
  from public.marble_room_players rp
  join public.marble_rooms r on r.id = rp.room_id
  where rp.user_id = auth.uid()
    and rp.membership_status = 'active'
    and r.status in ('waiting','playing')
    and r.expires_at > now()
  order by rp.joined_at desc
  limit 1;

  if v_room_id is null then return null; end if;
  return public.marble_lobby_snapshot(v_room_id);
end;
$$;

create or replace function public.marble_get_lobby_snapshot(p_room_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.marble_lobby_snapshot(p_room_id);
$$;

create or replace function public.marble_set_ready(p_room_id uuid, p_ready boolean, p_expected_version bigint)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_room public.marble_rooms%rowtype;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;

  select * into v_room from public.marble_rooms where id = p_room_id for update;
  if not found or v_room.status <> 'waiting' then raise exception 'ROOM_NOT_WAITING'; end if;
  if v_room.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if not public.marble_is_room_member(p_room_id) then raise exception 'NOT_ROOM_MEMBER'; end if;

  update public.marble_room_players
  set is_ready = case when user_id = v_room.host_user_id then true else p_ready end
  where room_id = p_room_id and user_id = auth.uid() and membership_status = 'active';

  update public.marble_rooms set version = version + 1, updated_at = now() where id = p_room_id;
  return public.marble_lobby_snapshot(p_room_id);
end;
$$;

create or replace function public.marble_leave_room(p_room_id uuid, p_expected_version bigint)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_room public.marble_rooms%rowtype;
  v_next_host uuid;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;

  select * into v_room from public.marble_rooms where id = p_room_id for update;
  if not found then raise exception 'ROOM_NOT_FOUND'; end if;
  if v_room.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if not public.marble_is_room_member(p_room_id) then raise exception 'NOT_ROOM_MEMBER'; end if;

  update public.marble_room_players
  set membership_status = 'left', is_ready = false, left_at = now()
  where room_id = p_room_id and user_id = auth.uid() and membership_status = 'active';

  if v_room.host_user_id = auth.uid() then
    select user_id into v_next_host
    from public.marble_room_players
    where room_id = p_room_id and membership_status = 'active'
    order by seat
    limit 1;
  else
    v_next_host := v_room.host_user_id;
  end if;

  if v_next_host is null then
    update public.marble_rooms
    set status = 'closed', version = version + 1, updated_at = now()
    where id = p_room_id;
    return null;
  end if;

  update public.marble_rooms
  set host_user_id = v_next_host, version = version + 1, updated_at = now()
  where id = p_room_id;

  update public.marble_room_players
  set is_ready = true
  where room_id = p_room_id and user_id = v_next_host and membership_status = 'active';

  return public.marble_lobby_snapshot(p_room_id);
end;
$$;

grant execute on function public.marble_is_room_member(uuid) to authenticated;
grant execute on function public.marble_lobby_snapshot(uuid) to authenticated;
grant execute on function public.marble_create_room(text, smallint) to authenticated;
grant execute on function public.marble_join_room(text, text) to authenticated;
grant execute on function public.marble_get_my_active_room() to authenticated;
grant execute on function public.marble_get_lobby_snapshot(uuid) to authenticated;
grant execute on function public.marble_set_ready(uuid, boolean, bigint) to authenticated;
grant execute on function public.marble_leave_room(uuid, bigint) to authenticated;

grant select on public.marble_rooms to authenticated;
grant select on public.marble_room_players to authenticated;

alter publication supabase_realtime add table public.marble_rooms;
alter publication supabase_realtime add table public.marble_room_players;
