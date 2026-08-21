-- Liar Game phase 2 core RPCs. Run after schema.sql and seed.sql.
-- Every public entry point derives identity from auth.uid(); player keys are a
-- second possession check, never an identity source.

create or replace function public.liar_validate_settings(
  p_categories text[], p_difficulty text, p_liar_count integer, p_guess_limit integer
) returns text[]
language plpgsql immutable
set search_path = pg_catalog, public
as $$
declare v_categories text[];
begin
  if p_categories is null
     or p_difficulty is null
     or p_liar_count is null
     or p_guess_limit is null then
    raise exception using message = 'INVALID_GAME_SETTINGS', errcode = 'P0001';
  end if;
  select array_agg(x order by first_pos) into v_categories
  from (
    select x, min(pos) first_pos
    from unnest(p_categories) with ordinality u(x, pos)
    group by x
  ) s;
  if coalesce(cardinality(v_categories), 0) < 1
     or not (v_categories <@ array['음식','장소','직업','동물','물건','인물','기타']::text[])
     or array_position(v_categories, null) is not null
     or p_difficulty not in ('all','easy','normal','hard')
     or p_liar_count not between 1 and 3
     or p_guess_limit not between 1 and 3 then
    raise exception using message = 'INVALID_GAME_SETTINGS', errcode = 'P0001';
  end if;
  return v_categories;
end;
$$;

create or replace function public.liar_expire_room(p_room_id uuid)
returns boolean
language plpgsql
set search_path = pg_catalog, public
as $$
declare v_expired boolean;
begin
  update public.liar_rooms
  set status = 'expired', expired_at = coalesce(expired_at, now())
  where id = p_room_id and (status = 'expired' or now() >= expires_at)
  returning true into v_expired;
  if coalesce(v_expired, false) then
    update public.liar_players
    set membership_status = 'left', ready = false,
        left_at = coalesce(left_at, now())
    where room_id = p_room_id and membership_status = 'active';
  end if;
  return coalesce(v_expired, false);
end;
$$;

create or replace function public.liar_clear_expired_membership(p_auth_user_id uuid)
returns void
language plpgsql
set search_path = pg_catalog, public
as $$
declare v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype;
begin
  select * into v_player from public.liar_players
  where auth_user_id = p_auth_user_id and membership_status = 'active'
  for update;
  if not found then return; end if;
  select * into v_room from public.liar_rooms where id = v_player.room_id for update;
  if v_room.status = 'expired' or now() >= v_room.expires_at then
    perform public.liar_expire_room(v_room.id);
  else
    raise exception using message = 'ALREADY_IN_ACTIVE_ROOM', errcode = 'P0001';
  end if;
end;
$$;

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
  if v_auth is null then raise exception using message='AUTH_REQUIRED', errcode='P0001'; end if;
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
  if v_auth is null then raise exception using message='AUTH_REQUIRED', errcode='P0001'; end if;
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

create or replace function public.liar_leave_room(p_player_key uuid)
returns bigint language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED', errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select * into v_player from public.liar_players where auth_user_id=v_auth and player_key=p_player_key and membership_status='active' for update;
  if not found then raise exception using message='NOT_ROOM_MEMBER', errcode='P0001'; end if;
  select * into v_room from public.liar_rooms where id=v_player.room_id for update;
  if v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  if v_room.host_player_id=v_player.id then
    update public.liar_vote_stages as vs
    set status='closed',closed_at=coalesce(vs.closed_at,now())
    where vs.round_id=v_room.current_round_id and vs.status='open';
    update public.liar_rounds as rd
    set status='FORCE_ENDED',force_ended_at=now(),finished_at=coalesce(rd.finished_at,now()),version=rd.version+1
    where rd.id=v_room.current_round_id and rd.status<>'FORCE_ENDED';
    update public.liar_games as gm
    set status='force_ended',finished_at=coalesce(gm.finished_at,now())
    where gm.id=v_room.current_game_id and gm.status in ('setup','active');
    update public.liar_players as lp
    set membership_status='left',ready=false,left_at=coalesce(lp.left_at,now())
    where lp.room_id=v_room.id and lp.membership_status='active';
    update public.liar_rooms as rm
    set status='expired',expired_at=now(),last_activity_at=now(),current_round_id=null,
        current_game_id=null,version=rm.version+1
    where rm.id=v_room.id returning rm.version into v_room.version;
  else
    update public.liar_players as lp set membership_status='left',ready=false,left_at=coalesce(lp.left_at,now()) where lp.id=v_player.id;
    update public.liar_rooms as rm set last_activity_at=now(),expires_at=now()+interval '24 hours',version=rm.version+1 where rm.id=v_room.id returning rm.version into v_room.version;
  end if;
  return v_room.version;
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
  where auth.uid() is not null and lp.auth_user_id=auth.uid()
    and lp.membership_status='active' and rm.status='active' and now()<rm.expires_at
  order by rm.last_activity_at desc;
$$;

create or replace function public.liar_resume_room(p_room_id uuid,p_player_key uuid)
returns table(room_id uuid,player_id uuid,room_version bigint)
language plpgsql security definer set search_path=pg_catalog,public
as $$
declare v_auth uuid:=auth.uid(); v_room public.liar_rooms%rowtype; v_player public.liar_players%rowtype;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
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

create or replace function public.liar_update_nickname(p_player_key uuid,p_nickname text)
returns bigint language plpgsql security definer set search_path=pg_catalog,public
as $$ declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 if p_nickname is null or char_length(btrim(p_nickname)) not between 1 and 20 then raise exception using message='INVALID_NICKNAME',errcode='P0001'; end if;
 select * into v_player from public.liar_players where auth_user_id=v_auth and player_key=p_player_key and membership_status='active' for update;
 if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select * into v_room from public.liar_rooms where id=v_player.room_id for update;
 if v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 update public.liar_players set nickname=btrim(p_nickname) where id=v_player.id; -- round snapshots intentionally remain immutable.
 update public.liar_rooms set last_activity_at=now(),expires_at=now()+interval '24 hours',version=version+1 where id=v_room.id returning version into v_room.version;
 return v_room.version;
end $$;

create or replace function public.liar_set_ready(p_player_key uuid,p_ready boolean)
returns bigint language plpgsql security definer set search_path=pg_catalog,public
as $$ declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 if p_ready is null then raise exception using message='INVALID_READY',errcode='P0001'; end if;
 select * into v_player from public.liar_players where auth_user_id=v_auth and player_key=p_player_key and membership_status='active' for update;
 if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select * into v_room from public.liar_rooms where id=v_player.room_id for update;
 if v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 if v_room.current_round_id is not null then raise exception using message='INVALID_ROOM_STATE',errcode='P0001'; end if;
 -- ready opts the player into the next round snapshot while no round is active.
 update public.liar_players set ready=p_ready where id=v_player.id;
 update public.liar_rooms set last_activity_at=now(),expires_at=now()+interval '24 hours',version=version+1 where id=v_room.id returning version into v_room.version;
 return v_room.version;
end $$;

create or replace function public.liar_update_game_settings(p_player_key uuid,p_selected_categories text[],p_difficulty text,p_liar_count integer,p_guess_limit integer,p_expected_room_version bigint)
returns bigint language plpgsql security definer set search_path=pg_catalog,public
as $$ declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype; v_game public.liar_games%rowtype; v_categories text[];
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 v_categories:=public.liar_validate_settings(p_selected_categories,p_difficulty,p_liar_count,p_guess_limit);
 select * into v_player from public.liar_players where auth_user_id=v_auth and player_key=p_player_key and membership_status='active';
 if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select * into v_room from public.liar_rooms where id=v_player.room_id for update;
 if v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
 if p_expected_room_version is null or v_room.version<>p_expected_room_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;
 select * into v_game from public.liar_games where id=v_room.current_game_id and room_id=v_room.id for update;
 if not found or v_game.status<>'setup' or v_game.started_at is not null then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;
 update public.liar_games set selected_categories=v_categories,difficulty=p_difficulty,liar_count=p_liar_count,guess_limit=p_guess_limit where id=v_game.id;
 update public.liar_rooms set last_activity_at=now(),expires_at=now()+interval '24 hours',version=version+1 where id=v_room.id returning version into v_room.version;
 return v_room.version;
end $$;

create or replace function public.liar_start_round(p_player_key uuid,p_expected_room_version bigint)
returns table(round_id uuid,round_no integer,room_version bigint,round_version bigint)
language plpgsql security definer set search_path=pg_catalog,public
as $$
declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype; v_game public.liar_games%rowtype;
 v_count integer; v_max integer; v_round_no integer; v_round uuid; v_word public.liar_words%rowtype; v_last_word uuid; v_candidates integer;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select lp.* into v_player from public.liar_players lp where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active';
 if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select rm.* into v_room from public.liar_rooms rm where rm.id=v_player.room_id for update;
 if v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
 if p_expected_room_version is null or v_room.version<>p_expected_room_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;
 if v_room.current_round_id is not null then raise exception using message='INVALID_ROOM_STATE',errcode='P0001'; end if;
 select g.* into v_game from public.liar_games g where g.id=v_room.current_game_id and g.room_id=v_room.id for update;
 if not found or v_game.status not in ('setup','active') then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;
 select count(*) into v_count from public.liar_players lp where lp.room_id=v_room.id and lp.membership_status='active' and lp.ready;
 -- TODO(PRODUCTION): 정식 배포 전에 최소 준비 인원을 4명으로 복구할 것.
 -- 2~6명 규칙도 다시 4~6명으로 복구할 것.
 if v_count<2 then raise exception using message='NOT_ENOUGH_READY_PLAYERS',errcode='P0001'; end if;
 if v_count>12 then raise exception using message='TOO_MANY_READY_PLAYERS',errcode='P0001'; end if;
 v_max:=case when v_count<=6 then 1 when v_count<=9 then 2 else 3 end;
 if v_game.liar_count>v_max then raise exception using message='INVALID_LIAR_COUNT',errcode='P0001'; end if;
 select coalesce(max(r.round_no),0)+1 into v_round_no from public.liar_rounds r where r.game_id=v_game.id;
 select r.word_id into v_last_word from public.liar_rounds r where r.game_id=v_game.id order by r.round_no desc limit 1;
 select count(*) into v_candidates from public.liar_words w where w.enabled and w.category=any(v_game.selected_categories) and (v_game.difficulty='all' or w.difficulty=v_game.difficulty);
 if v_candidates=0 then raise exception using message='WORD_POOL_EMPTY',errcode='P0001'; end if;
 select * into v_word from public.liar_words w where w.enabled and w.category=any(v_game.selected_categories)
   and (v_game.difficulty='all' or w.difficulty=v_game.difficulty)
   and (v_candidates=1 or w.id is distinct from v_last_word) order by random() limit 1;
 insert into public.liar_rounds(game_id,room_id,round_no,status,word_id,category_snapshot,word_snapshot,current_speaker_index)
 values(v_game.id,v_room.id,v_round_no,'ROLE_REVEAL',v_word.id,v_word.category,v_word.word,null)
 returning liar_rounds.id into v_round;
 with shuffled as (
   select p.id,p.nickname,row_number() over(order by random())-1 as turn_order
   from public.liar_players p where p.room_id=v_room.id and p.membership_status='active' and p.ready
 ), assigned as (
   select shuffled.*,row_number() over(order by random()) as liar_order from shuffled
 )
 insert into public.liar_round_players(round_id,player_id,nickname_snapshot,role,turn_order)
 select v_round,a.id,a.nickname,case when a.liar_order<=v_game.liar_count then 'liar' else 'citizen' end,a.turn_order from assigned a;
 update public.liar_players as lp set ready=false where lp.room_id=v_room.id and lp.membership_status='active';
 update public.liar_games as g set status='active',started_at=coalesce(g.started_at,now()) where g.id=v_game.id;
 update public.liar_rooms as rm set current_round_id=v_round,last_activity_at=now(),expires_at=now()+interval '24 hours',version=rm.version+1 where rm.id=v_room.id returning rm.version into v_room.version;
 return query select v_round,v_round_no,v_room.version,r.version from public.liar_rounds r where r.id=v_round;
end $$;

create or replace function public.liar_mark_role_checked(p_player_key uuid)
returns timestamptz language plpgsql security definer set search_path=pg_catalog,public
as $$ declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype; v_round public.liar_rounds%rowtype; v_checked timestamptz;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select lp.* into v_player
 from public.liar_players lp
 where lp.auth_user_id=v_auth
   and lp.player_key=p_player_key
   and lp.membership_status='active';
 if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select * into v_room from public.liar_rooms where id=v_player.room_id for update;
 if v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 select * into v_round from public.liar_rounds where id=v_room.current_round_id for update;
 if not found or v_round.status<>'ROLE_REVEAL' then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
 update public.liar_round_players rp set role_checked_at=coalesce(role_checked_at,now())
 where rp.round_id=v_round.id and rp.player_id=v_player.id returning role_checked_at into v_checked;
 if not found then raise exception using message='NOT_ROUND_PARTICIPANT',errcode='P0001'; end if;
 update public.liar_rooms set last_activity_at=now(),expires_at=now()+interval '24 hours',version=version+1 where id=v_room.id;
 update public.liar_rounds set version=version+1 where id=v_round.id;
 return v_checked;
end $$;

create or replace function public.liar_get_my_round_role(p_player_key uuid)
returns table(role text,category text,word text)
language plpgsql security definer stable set search_path=pg_catalog,public
as $$ declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select lp.* into v_player
 from public.liar_players lp
 where lp.auth_user_id=v_auth
   and lp.player_key=p_player_key
   and lp.membership_status='active';
 if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select rm.* into v_room from public.liar_rooms rm where rm.id=v_player.room_id;
 if not found or v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 return query select rp.role,r.category_snapshot,case when rp.role='citizen' then r.word_snapshot else null end
 from public.liar_round_players rp join public.liar_rounds r on r.id=rp.round_id
 where rp.round_id=v_room.current_round_id and rp.player_id=v_player.id;
 if not found then raise exception using message='NOT_ROUND_PARTICIPANT',errcode='P0001'; end if;
end $$;

create or replace function public.liar_get_room_snapshot(p_player_key uuid)
returns jsonb language plpgsql security definer stable set search_path=pg_catalog,public
as $$ declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype; v_result jsonb;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select * into v_player from public.liar_players where auth_user_id=v_auth and player_key=p_player_key and membership_status='active';
 if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select * into v_room from public.liar_rooms where id=v_player.room_id;
 if v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  select jsonb_build_object(
  'room',jsonb_build_object('id',r.id,'room_code',r.room_code,'status',r.status,'host_player_id',r.host_player_id,'current_game_id',r.current_game_id,'current_round_id',r.current_round_id,'version',r.version,'expires_at',r.expires_at),
  'me',jsonb_build_object('player_id',v_player.id,'nickname',v_player.nickname,'is_host',r.host_player_id=v_player.id),
  'game',(select jsonb_build_object('id',g.id,'game_no',g.game_no,'status',g.status,'selected_categories',g.selected_categories,'difficulty',g.difficulty,'liar_count',g.liar_count,'guess_limit',g.guess_limit,'started_at',g.started_at) from public.liar_games g where g.id=r.current_game_id),
  'players',(select coalesce(jsonb_agg(jsonb_build_object('id',p.id,'nickname',p.nickname,'ready',p.ready,'membership_status',p.membership_status) order by p.joined_at),'[]'::jsonb) from public.liar_players p where p.room_id=r.id and p.membership_status='active'),
  'round',(select jsonb_build_object('id',x.id,'round_no',x.round_no,'status',x.status,'current_speaker_index',x.current_speaker_index,'version',x.version) from public.liar_rounds x where x.id=r.current_round_id),
  'round_players',(select coalesce(jsonb_agg(jsonb_build_object('id',rp.id,'player_id',rp.player_id,'nickname_snapshot',rp.nickname_snapshot,'turn_order',rp.turn_order,'role_checked',rp.role_checked_at is not null) order by rp.turn_order),'[]'::jsonb) from public.liar_round_players rp where rp.round_id=r.current_round_id)
 ) into v_result from public.liar_rooms r where r.id=v_room.id;
 return v_result;
end $$;

create or replace function public.liar_start_speaking(p_player_key uuid,p_expected_round_version bigint)
returns bigint language plpgsql security definer set search_path=pg_catalog,public
as $$ declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype; v_round public.liar_rounds%rowtype;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select * into v_player from public.liar_players where auth_user_id=v_auth and player_key=p_player_key and membership_status='active'; if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select * into v_room from public.liar_rooms where id=v_player.room_id for update; if v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
 select * into v_round from public.liar_rounds where id=v_room.current_round_id for update;
 if not found or v_round.status<>'ROLE_REVEAL' then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
 if p_expected_round_version is null or v_round.version<>p_expected_round_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;
 if exists(select 1 from public.liar_round_players where round_id=v_round.id and role_checked_at is null) then raise exception using message='ROLE_NOT_CONFIRMED',errcode='P0001'; end if;
 update public.liar_rounds set status='SPEAKING',current_speaker_index=0,version=version+1 where id=v_round.id returning version into v_round.version;
 update public.liar_rooms set last_activity_at=now(),expires_at=now()+interval '24 hours',version=version+1 where id=v_room.id;
 return v_round.version;
end $$;

create or replace function public.liar_move_speaker(p_player_key uuid,p_direction text,p_expected_round_version bigint)
returns table(current_speaker_index smallint,round_version bigint)
language plpgsql security definer set search_path=pg_catalog,public
as $$ declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype; v_round public.liar_rounds%rowtype; v_count integer; v_new integer;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select * into v_player from public.liar_players where auth_user_id=v_auth and player_key=p_player_key and membership_status='active'; if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select * into v_room from public.liar_rooms where id=v_player.room_id for update; if v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
 select * into v_round from public.liar_rounds where id=v_room.current_round_id for update;
 if not found or v_round.status<>'SPEAKING' then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
 if p_expected_round_version is null or v_round.version<>p_expected_round_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;
 select count(*) into v_count from public.liar_round_players rp where rp.round_id=v_round.id;
 if p_direction is null or upper(p_direction) not in ('NEXT','PREVIOUS') then raise exception using message='INVALID_DIRECTION',errcode='P0001'; end if;
 v_new:=v_round.current_speaker_index + case when upper(p_direction)='NEXT' then 1 else -1 end;
 if v_new<0 or v_new>=v_count then raise exception using message='SPEAKER_INDEX_OUT_OF_RANGE',errcode='P0001'; end if;
 update public.liar_rounds as r set current_speaker_index=v_new,version=r.version+1 where r.id=v_round.id returning r.current_speaker_index,r.version into current_speaker_index,round_version;
 update public.liar_rooms set last_activity_at=now(),expires_at=now()+interval '24 hours',version=version+1 where id=v_room.id;
 return next;
end $$;

create or replace function public.liar_finish_speaking(p_player_key uuid,p_expected_round_version bigint)
returns bigint language plpgsql security definer set search_path=pg_catalog,public
as $$ declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype; v_round public.liar_rounds%rowtype; v_count integer;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select * into v_player from public.liar_players where auth_user_id=v_auth and player_key=p_player_key and membership_status='active'; if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select * into v_room from public.liar_rooms where id=v_player.room_id for update; if v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
 select * into v_round from public.liar_rounds where id=v_room.current_round_id for update;
 if not found or v_round.status<>'SPEAKING' then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
 if p_expected_round_version is null or v_round.version<>p_expected_round_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;
 select count(*) into v_count from public.liar_round_players where round_id=v_round.id;
 if v_round.current_speaker_index<>v_count-1 then raise exception using message='SPEAKING_NOT_FINISHED',errcode='P0001'; end if;
 -- Preserve the last index so clients can still identify the final speaker.
 update public.liar_rounds set status='DISCUSSION',version=version+1 where id=v_round.id returning version into v_round.version;
 update public.liar_rooms set last_activity_at=now(),expires_at=now()+interval '24 hours',version=version+1 where id=v_room.id;
 return v_round.version;
end $$;

-- Helpers are not API surface. Public entry points are granted in rls.sql.
revoke all on function public.liar_validate_settings(text[],text,integer,integer) from public, anon, authenticated;
revoke all on function public.liar_expire_room(uuid) from public, anon, authenticated;
revoke all on function public.liar_clear_expired_membership(uuid) from public, anon, authenticated;
revoke all on function public.liar_create_room(uuid,text,text[],text,integer,integer) from public, anon, authenticated;
revoke all on function public.liar_join_room(text,uuid,text) from public, anon, authenticated;
revoke all on function public.liar_leave_room(uuid) from public, anon, authenticated;
revoke all on function public.liar_get_my_active_rooms() from public, anon, authenticated;
revoke all on function public.liar_resume_room(uuid,uuid) from public, anon, authenticated;
revoke all on function public.liar_update_nickname(uuid,text) from public, anon, authenticated;
revoke all on function public.liar_set_ready(uuid,boolean) from public, anon, authenticated;
revoke all on function public.liar_update_game_settings(uuid,text[],text,integer,integer,bigint) from public, anon, authenticated;
revoke all on function public.liar_start_round(uuid,bigint) from public, anon, authenticated;
revoke all on function public.liar_mark_role_checked(uuid) from public, anon, authenticated;
revoke all on function public.liar_get_my_round_role(uuid) from public, anon, authenticated;
revoke all on function public.liar_get_room_snapshot(uuid) from public, anon, authenticated;
revoke all on function public.liar_start_speaking(uuid,bigint) from public, anon, authenticated;
revoke all on function public.liar_move_speaker(uuid,text,bigint) from public, anon, authenticated;
revoke all on function public.liar_finish_speaking(uuid,bigint) from public, anon, authenticated;
