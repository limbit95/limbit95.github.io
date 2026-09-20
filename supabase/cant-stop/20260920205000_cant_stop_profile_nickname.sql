begin;

alter table public.cant_stop_room_players
  drop constraint if exists cant_stop_room_players_nickname_check;

alter table public.cant_stop_room_players
  add constraint cant_stop_room_players_nickname_check
  check (char_length(btrim(nickname)) between 1 and 50);

create or replace function private.cant_stop_enforce_profile_nickname()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nickname text;
begin
  select btrim(p.display_name)
  into v_nickname
  from public.profiles as p
  where p.id = new.user_id;

  if char_length(coalesce(v_nickname, '')) not between 1 and 50 then
    raise exception 'PROFILE_NICKNAME_REQUIRED' using errcode = 'P0001';
  end if;

  new.nickname := v_nickname;
  return new;
end;
$$;

drop trigger if exists cant_stop_room_players_profile_nickname
  on public.cant_stop_room_players;

create trigger cant_stop_room_players_profile_nickname
before insert or update of nickname, user_id
on public.cant_stop_room_players
for each row
execute function private.cant_stop_enforce_profile_nickname();

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
  v_nickname text := btrim(coalesce((
    select profile.display_name
    from public.profiles as profile
    where profile.id = (select auth.uid())
  ), ''));
  v_room_id uuid;
  v_code text;
  v_attempt integer;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if char_length(v_nickname) not between 1 and 50 then
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
  v_nickname text := btrim(coalesce((
    select profile.display_name
    from public.profiles as profile
    where profile.id = (select auth.uid())
  ), ''));
  v_room public.cant_stop_rooms%rowtype;
  v_existing public.cant_stop_room_players%rowtype;
  v_seat smallint;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if char_length(v_nickname) not between 1 and 50 then
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

create or replace function public.cant_stop_join_room_by_invite(
  p_invite_token text,
  p_nickname text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_nickname text := btrim(coalesce((
    select profile.display_name
    from public.profiles as profile
    where profile.id = (select auth.uid())
  ), ''));
  v_token text := lower(btrim(coalesce(p_invite_token, '')));
  v_invite jsonb;
  v_room_id uuid;
  v_room public.cant_stop_rooms%rowtype;
  v_existing public.cant_stop_room_players%rowtype;
  v_seat smallint;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if char_length(v_nickname) not between 1 and 50 then
    raise exception 'INVALID_NICKNAME' using errcode = 'P0001';
  end if;
  if v_token !~ '^[a-f0-9]{64}$' then
    raise exception 'INVALID_INVITE_TOKEN' using errcode = 'P0001';
  end if;

  v_invite := public.site_invite_resolve(v_token);

  if coalesce(v_invite ->> 'target_type', '') <> 'game_room'
    or coalesce(v_invite -> 'metadata' ->> 'game_id', '') <> 'cant-stop'
    or coalesce(v_invite -> 'metadata' ->> 'platform_version', '') <> '1'
  then
    raise exception 'GAME_INVITE_MISMATCH' using errcode = 'P0001';
  end if;

  begin
    v_room_id := (v_invite ->> 'target_id')::uuid;
  exception
    when invalid_text_representation then
      raise exception 'GAME_INVITE_MISMATCH' using errcode = 'P0001';
  end;

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
  where r.id = v_room_id
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

update public.cant_stop_room_players as room_player
set nickname = btrim(profile.display_name)
from public.profiles as profile
where profile.id = room_player.user_id
  and char_length(btrim(coalesce(profile.display_name, ''))) between 1 and 50
  and room_player.nickname is distinct from btrim(profile.display_name);

revoke all on function private.cant_stop_enforce_profile_nickname()
  from public, anon, authenticated;

commit;
