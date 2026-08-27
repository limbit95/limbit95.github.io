-- Splendor phase 2: lobby RPC functions.

create or replace function private.splendor_generate_room_code()
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
    result := result || substr(alphabet, 1 + floor(random() * length(alphabet))::integer, 1);
  end loop;
  return result;
end;
$$;

revoke all on function private.splendor_generate_room_code() from public, anon, authenticated;

create or replace function private.splendor_lobby_snapshot(p_room_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with room_row as (
    select r.*
    from public.splendor_rooms as r
    where r.id = p_room_id
      and private.splendor_is_room_member(r.id)
  ),
  active_players as (
    select p.*
    from public.splendor_room_players as p
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
          'ruleset_key', r.ruleset_key,
          'version', r.version,
          'host_user_id', r.host_user_id,
          'expires_at', r.expires_at,
          'player_count', s.player_count,
          'all_ready', s.all_ready,
          'can_start', r.status = 'waiting' and s.player_count between 2 and r.max_players and s.all_ready
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
$$;

revoke all on function private.splendor_lobby_snapshot(uuid) from public, anon, authenticated;

create or replace function public.splendor_get_my_active_room()
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

  select p.room_id into v_room_id
  from public.splendor_room_players p
  join public.splendor_rooms r on r.id = p.room_id
  where p.user_id = (select auth.uid())
    and p.membership_status = 'active'
    and r.status in ('waiting','playing')
    and r.expires_at > now()
  order by p.joined_at desc
  limit 1;

  if v_room_id is null then
    return null;
  end if;

  return private.splendor_lobby_snapshot(v_room_id);
end;
$$;

create or replace function public.splendor_get_lobby_snapshot(p_room_id uuid)
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
  if not private.splendor_is_room_member(p_room_id) then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;
  return private.splendor_lobby_snapshot(p_room_id);
end;
$$;

create or replace function public.splendor_create_room(p_nickname text)
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

  update public.splendor_room_players p
  set membership_status = 'left', left_at = now()
  where p.user_id = v_user_id
    and p.membership_status = 'active'
    and exists (
      select 1 from public.splendor_rooms r
      where r.id = p.room_id
        and (r.status in ('finished','closed') or r.expires_at <= now())
    );

  if exists (
    select 1
    from public.splendor_room_players p
    join public.splendor_rooms r on r.id = p.room_id
    where p.user_id = v_user_id
      and p.membership_status = 'active'
      and r.status in ('waiting','playing')
      and r.expires_at > now()
  ) then
    raise exception 'ACTIVE_ROOM_EXISTS' using errcode = 'P0001';
  end if;

  for v_attempt in 1..20 loop
    v_code := private.splendor_generate_room_code();
    begin
      insert into public.splendor_rooms(room_code, host_user_id)
      values (v_code, v_user_id)
      returning id into v_room_id;
      exit;
    exception when unique_violation then
      v_room_id := null;
    end;
  end loop;

  if v_room_id is null then
    raise exception 'ROOM_CODE_GENERATION_FAILED' using errcode = 'P0001';
  end if;

  insert into public.splendor_room_players(room_id, user_id, nickname, seat, is_ready)
  values (v_room_id, v_user_id, v_nickname, 1, false);

  return private.splendor_lobby_snapshot(v_room_id);
end;
$$;

create or replace function public.splendor_join_room(p_room_code text, p_nickname text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_code text := upper(btrim(coalesce(p_room_code, '')));
  v_nickname text := btrim(coalesce(p_nickname, ''));
  v_room public.splendor_rooms%rowtype;
  v_count integer;
  v_seat integer;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if char_length(v_nickname) not between 1 and 20 then
    raise exception 'INVALID_NICKNAME' using errcode = 'P0001';
  end if;
  if v_code !~ '^[A-Z0-9]{6}$' then
    raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001';
  end if;

  select * into v_room
  from public.splendor_rooms
  where room_code = v_code
  for update;

  if not found or v_room.expires_at <= now() or v_room.status = 'closed' then
    raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001';
  end if;
  if v_room.status <> 'waiting' then
    raise exception 'ROOM_ALREADY_STARTED' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.splendor_room_players p
    where p.room_id = v_room.id
      and p.user_id = v_user_id
      and p.membership_status = 'active'
  ) then
    update public.splendor_room_players
    set nickname = v_nickname
    where room_id = v_room.id and user_id = v_user_id and membership_status = 'active';
    return private.splendor_lobby_snapshot(v_room.id);
  end if;

  update public.splendor_room_players p
  set membership_status = 'left', left_at = now()
  where p.user_id = v_user_id
    and p.membership_status = 'active'
    and exists (
      select 1 from public.splendor_rooms r
      where r.id = p.room_id
        and (r.status in ('finished','closed') or r.expires_at <= now())
    );

  if exists (
    select 1 from public.splendor_room_players p
    join public.splendor_rooms r on r.id = p.room_id
    where p.user_id = v_user_id
      and p.membership_status = 'active'
      and r.status in ('waiting','playing')
      and r.expires_at > now()
  ) then
    raise exception 'ACTIVE_ROOM_EXISTS' using errcode = 'P0001';
  end if;

  select count(*)::integer into v_count
  from public.splendor_room_players
  where room_id = v_room.id and membership_status = 'active';

  if v_count >= v_room.max_players then
    raise exception 'ROOM_FULL' using errcode = 'P0001';
  end if;

  select gs into v_seat
  from generate_series(1, v_room.max_players) as gs
  where not exists (
    select 1 from public.splendor_room_players p
    where p.room_id = v_room.id
      and p.seat = gs
      and p.membership_status = 'active'
  )
  order by gs
  limit 1;

  if v_seat is null then
    raise exception 'ROOM_FULL' using errcode = 'P0001';
  end if;

  insert into public.splendor_room_players(room_id, user_id, nickname, seat, is_ready)
  values (v_room.id, v_user_id, v_nickname, v_seat, false);

  update public.splendor_rooms
  set version = version + 1, updated_at = now()
  where id = v_room.id;

  return private.splendor_lobby_snapshot(v_room.id);
end;
$$;

create or replace function public.splendor_set_ready(
  p_room_id uuid,
  p_ready boolean,
  p_expected_version bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_room public.splendor_rooms%rowtype;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  select * into v_room from public.splendor_rooms where id = p_room_id for update;
  if not found then raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001'; end if;
  if v_room.version <> p_expected_version then raise exception 'STATE_CHANGED' using errcode = 'P0001'; end if;
  if v_room.status <> 'waiting' then raise exception 'ROOM_ALREADY_STARTED' using errcode = 'P0001'; end if;
  if not private.splendor_is_room_member(p_room_id) then raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001'; end if;

  update public.splendor_room_players
  set is_ready = p_ready
  where room_id = p_room_id
    and user_id = v_user_id
    and membership_status = 'active';

  update public.splendor_rooms
  set version = version + 1, updated_at = now()
  where id = p_room_id;

  return private.splendor_lobby_snapshot(p_room_id);
end;
$$;

create or replace function public.splendor_update_nickname(
  p_room_id uuid,
  p_nickname text,
  p_expected_version bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_nickname text := btrim(coalesce(p_nickname, ''));
  v_room public.splendor_rooms%rowtype;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if char_length(v_nickname) not between 1 and 20 then
    raise exception 'INVALID_NICKNAME' using errcode = 'P0001';
  end if;

  select * into v_room from public.splendor_rooms where id = p_room_id for update;
  if not found then raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001'; end if;
  if v_room.version <> p_expected_version then raise exception 'STATE_CHANGED' using errcode = 'P0001'; end if;
  if v_room.status <> 'waiting' then raise exception 'ROOM_ALREADY_STARTED' using errcode = 'P0001'; end if;
  if not private.splendor_is_room_member(p_room_id) then raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001'; end if;

  update public.splendor_room_players
  set nickname = v_nickname
  where room_id = p_room_id
    and user_id = v_user_id
    and membership_status = 'active';

  update public.splendor_rooms
  set version = version + 1, updated_at = now()
  where id = p_room_id;

  return private.splendor_lobby_snapshot(p_room_id);
end;
$$;

create or replace function public.splendor_leave_room(
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
  v_room public.splendor_rooms%rowtype;
  v_next_host uuid;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  select * into v_room from public.splendor_rooms where id = p_room_id for update;
  if not found then raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001'; end if;
  if v_room.version <> p_expected_version then raise exception 'STATE_CHANGED' using errcode = 'P0001'; end if;
  if not private.splendor_is_room_member(p_room_id) then raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001'; end if;
  if v_room.status <> 'waiting' then raise exception 'ROOM_ALREADY_STARTED' using errcode = 'P0001'; end if;

  update public.splendor_room_players
  set membership_status = 'left', left_at = now(), is_ready = false
  where room_id = p_room_id
    and user_id = v_user_id
    and membership_status = 'active';

  if v_room.host_user_id = v_user_id then
    select user_id into v_next_host
    from public.splendor_room_players
    where room_id = p_room_id and membership_status = 'active'
    order by seat, joined_at
    limit 1;
  end if;

  if v_room.host_user_id = v_user_id and v_next_host is null then
    update public.splendor_rooms
    set status = 'closed', version = version + 1, updated_at = now()
    where id = p_room_id;
  elsif v_room.host_user_id = v_user_id then
    update public.splendor_rooms
    set host_user_id = v_next_host, version = version + 1, updated_at = now()
    where id = p_room_id;
  else
    update public.splendor_rooms
    set version = version + 1, updated_at = now()
    where id = p_room_id;
  end if;

  return jsonb_build_object('left', true, 'room_id', p_room_id, 'new_host_user_id', v_next_host);
end;
$$;

revoke all on function public.splendor_get_my_active_room() from public, anon;
revoke all on function public.splendor_get_lobby_snapshot(uuid) from public, anon;
revoke all on function public.splendor_create_room(text) from public, anon;
revoke all on function public.splendor_join_room(text, text) from public, anon;
revoke all on function public.splendor_set_ready(uuid, boolean, bigint) from public, anon;
revoke all on function public.splendor_update_nickname(uuid, text, bigint) from public, anon;
revoke all on function public.splendor_leave_room(uuid, bigint) from public, anon;

grant execute on function public.splendor_get_my_active_room() to authenticated;
grant execute on function public.splendor_get_lobby_snapshot(uuid) to authenticated;
grant execute on function public.splendor_create_room(text) to authenticated;
grant execute on function public.splendor_join_room(text, text) to authenticated;
grant execute on function public.splendor_set_ready(uuid, boolean, bigint) to authenticated;
grant execute on function public.splendor_update_nickname(uuid, text, bigint) to authenticated;
grant execute on function public.splendor_leave_room(uuid, bigint) to authenticated;
