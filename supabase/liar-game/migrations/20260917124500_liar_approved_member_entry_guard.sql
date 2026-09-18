-- Phase 2-B: keep Liar Game / Drawing Spy entry and resume surfaces aligned
-- with the main site's approved-member access boundary.
--
-- These RPCs are SECURITY DEFINER, so RLS alone is not an authorization
-- boundary. Reuse the site's private.is_approved_member() helper and preserve
-- the existing AUTH_REQUIRED error contract for unauthenticated/unapproved users.

create or replace function public.liar_create_room(
  p_player_key uuid, p_nickname text, p_selected_categories text[],
  p_difficulty text default 'all', p_liar_count integer default 1,
  p_guess_limit integer default 1
) returns table(room_id uuid, room_code text, player_id uuid, game_id uuid, room_version bigint)
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare v_auth uuid := auth.uid(); v_categories text[]; v_room uuid; v_code text;
        v_player uuid; v_game uuid; v_try integer;
begin
  if v_auth is null or not private.is_approved_member() then
    raise exception using message='AUTH_REQUIRED', errcode='P0001';
  end if;
  if p_player_key is null
     or p_nickname is null
     or char_length(btrim(p_nickname)) not between 1 and 20 then
    raise exception using message='INVALID_NICKNAME', errcode='P0001';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(v_auth::text, 0));
  perform public.liar_clear_expired_membership(v_auth);
  v_categories := public.liar_validate_settings(p_selected_categories, p_difficulty, p_liar_count, p_guess_limit);
  for v_try in 1..10 loop
    v_code := (select string_agg(substr('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 1 + floor(random()*36)::int, 1), '') from generate_series(1,6));
    begin
      insert into public.liar_rooms as r(room_code) values (v_code) returning r.id into v_room;
      exit;
    exception when unique_violation then
      if v_try = 10 then raise exception using message='ROOM_CODE_EXHAUSTED', errcode='P0001'; end if;
    end;
  end loop;
  insert into public.liar_players(room_id, auth_user_id, player_key, nickname)
  values(v_room, v_auth, p_player_key, btrim(p_nickname)) returning liar_players.id into v_player;
  insert into public.liar_games(room_id, game_no, status, selected_categories, difficulty, liar_count, guess_limit)
  values(v_room, 1, 'setup', v_categories, p_difficulty, p_liar_count, p_guess_limit) returning liar_games.id into v_game;
  update public.liar_rooms as r set host_player_id=v_player, current_game_id=v_game,
    last_activity_at=now(), expires_at=now()+interval '24 hours', version=r.version+1
  where r.id=v_room;
  return query select v_room, v_code, v_player, v_game, r.version from public.liar_rooms r where r.id=v_room;
end;
$$;

create or replace function public.liar_join_room(p_room_code text, p_player_key uuid, p_nickname text)
returns table(room_id uuid, player_id uuid, game_id uuid, current_round_id uuid, room_version bigint)
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare v_auth uuid:=auth.uid(); v_room public.liar_rooms%rowtype; v_player uuid; v_count integer;
begin
  if v_auth is null or not private.is_approved_member() then
    raise exception using message='AUTH_REQUIRED', errcode='P0001';
  end if;
  if p_player_key is null or p_nickname is null or char_length(btrim(p_nickname)) not between 1 and 20 then raise exception using message='INVALID_NICKNAME', errcode='P0001'; end if;
  perform pg_advisory_xact_lock(hashtextextended(v_auth::text, 0));
  perform public.liar_clear_expired_membership(v_auth);
  select r.* into v_room
  from public.liar_rooms r
  where r.room_code=upper(btrim(p_room_code))
  for update;
  if not found then raise exception using message='ROOM_NOT_FOUND', errcode='P0001'; end if;
  if v_room.status='expired' or now()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED', errcode='P0001';
  end if;
  select count(*) into v_count
  from public.liar_players lp
  where lp.room_id=v_room.id and lp.membership_status='active';
  if v_count >= 12 then raise exception using message='ROOM_FULL', errcode='P0001'; end if;
  select lp.id into v_player
  from public.liar_players lp
  where lp.room_id=v_room.id and lp.auth_user_id=v_auth
  for update;
  if found then
    update public.liar_players as lp set membership_status='active', player_key=p_player_key,
      nickname=btrim(p_nickname), ready=false, left_at=null,
      joined_during_round_id=v_room.current_round_id
    where lp.id=v_player;
  else
    insert into public.liar_players(room_id,auth_user_id,player_key,nickname,joined_during_round_id)
    values(v_room.id,v_auth,p_player_key,btrim(p_nickname),v_room.current_round_id)
    returning liar_players.id into v_player;
  end if;
  update public.liar_rooms as r
  set last_activity_at=now(), expires_at=now()+interval '24 hours', version=r.version+1
  where r.id=v_room.id;
  return query select r.id,v_player,r.current_game_id,r.current_round_id,r.version from public.liar_rooms r where r.id=v_room.id;
end;
$$;

create or replace function public.liar_get_my_active_rooms()
returns table(room_id uuid,room_code text,nickname text,is_host boolean,participant_count bigint,
              game_status text,round_status text,last_activity_at timestamptz,expires_at timestamptz)
language sql security definer stable set search_path=pg_catalog,public
as $$
  select rm.id,rm.room_code::text,lp.nickname::text,rm.host_player_id=lp.id,
         (select count(*) from public.liar_players as members
          where members.room_id=rm.id and members.membership_status='active'),
         gm.status,rd.status,rm.last_activity_at,rm.expires_at
  from public.liar_players as lp
  join public.liar_rooms as rm on rm.id=lp.room_id
  left join public.liar_games as gm on gm.id=rm.current_game_id
  left join public.liar_rounds as rd on rd.id=rm.current_round_id
  where auth.uid() is not null
    and private.is_approved_member()
    and lp.auth_user_id=auth.uid()
    and lp.membership_status='active' and rm.status='active' and now()<rm.expires_at
  order by rm.last_activity_at desc;
$$;

create or replace function public.liar_resume_room(p_room_id uuid,p_player_key uuid)
returns table(room_id uuid,player_id uuid,room_version bigint)
language plpgsql security definer set search_path=pg_catalog,public
as $$
declare v_auth uuid:=auth.uid(); v_room public.liar_rooms%rowtype; v_player public.liar_players%rowtype;
begin
  if v_auth is null or not private.is_approved_member() then
    raise exception using message='AUTH_REQUIRED',errcode='P0001';
  end if;
  if p_room_id is null or p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  perform pg_advisory_xact_lock(hashtextextended(v_auth::text,0));
  select rm.* into v_room from public.liar_rooms as rm where rm.id=p_room_id for update;
  if not found then raise exception using message='ROOM_NOT_FOUND',errcode='P0001'; end if;
  if v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  select lp.* into v_player from public.liar_players as lp
  where lp.room_id=v_room.id and lp.auth_user_id=v_auth and lp.membership_status='active' for update;
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  if exists (
    select 1 from public.liar_players as other
    where other.room_id=v_room.id and other.player_key=p_player_key and other.id<>v_player.id
  ) then
    raise exception using message='PLAYER_KEY_CONFLICT',errcode='P0001';
  end if;
  update public.liar_players as lp set player_key=p_player_key where lp.id=v_player.id;
  update public.liar_rooms as rm
  set last_activity_at=now(),expires_at=now()+interval '24 hours',version=rm.version+1
  where rm.id=v_room.id returning rm.version into v_room.version;
  return query select v_room.id,v_player.id,v_room.version;
end;
$$;

revoke all on function public.liar_create_room(uuid,text,text[],text,integer,integer) from public, anon;
revoke all on function public.liar_join_room(text,uuid,text) from public, anon;
revoke all on function public.liar_get_my_active_rooms() from public, anon;
revoke all on function public.liar_resume_room(uuid,uuid) from public, anon;

grant execute on function public.liar_create_room(uuid,text,text[],text,integer,integer) to authenticated;
grant execute on function public.liar_join_room(text,uuid,text) to authenticated;
grant execute on function public.liar_get_my_active_rooms() to authenticated;
grant execute on function public.liar_resume_room(uuid,uuid) to authenticated;
