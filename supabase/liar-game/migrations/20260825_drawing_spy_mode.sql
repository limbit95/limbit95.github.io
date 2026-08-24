-- Drawing Spy mode: reuse the existing liar-game engine and replace only the
-- initial SPEAKING phase with a persistent, turn-based DRAWING phase.

alter table public.liar_games
  add column if not exists game_mode text not null default 'classic',
  add column if not exists drawing_time_limit smallint not null default 15,
  add column if not exists drawing_stroke_limit smallint not null default 3;

alter table public.liar_games drop constraint if exists liar_games_game_mode_check;
alter table public.liar_games add constraint liar_games_game_mode_check
  check (game_mode in ('classic','drawing_spy'));
alter table public.liar_games drop constraint if exists liar_games_drawing_time_limit_check;
alter table public.liar_games add constraint liar_games_drawing_time_limit_check
  check (drawing_time_limit between 5 and 60);
alter table public.liar_games drop constraint if exists liar_games_drawing_stroke_limit_check;
alter table public.liar_games add constraint liar_games_drawing_stroke_limit_check
  check (drawing_stroke_limit between 1 and 10);

alter table public.liar_rounds
  add column if not exists game_mode_snapshot text not null default 'classic',
  add column if not exists drawing_time_limit_snapshot smallint not null default 15,
  add column if not exists drawing_stroke_limit_snapshot smallint not null default 3,
  add column if not exists drawing_turn_started_at timestamptz;

alter table public.liar_rounds drop constraint if exists liar_rounds_game_mode_snapshot_check;
alter table public.liar_rounds add constraint liar_rounds_game_mode_snapshot_check
  check (game_mode_snapshot in ('classic','drawing_spy'));
alter table public.liar_rounds drop constraint if exists liar_rounds_drawing_time_limit_snapshot_check;
alter table public.liar_rounds add constraint liar_rounds_drawing_time_limit_snapshot_check
  check (drawing_time_limit_snapshot between 5 and 60);
alter table public.liar_rounds drop constraint if exists liar_rounds_drawing_stroke_limit_snapshot_check;
alter table public.liar_rounds add constraint liar_rounds_drawing_stroke_limit_snapshot_check
  check (drawing_stroke_limit_snapshot between 1 and 10);

alter table public.liar_rounds drop constraint if exists liar_rounds_status_check;
alter table public.liar_rounds add constraint liar_rounds_status_check check (status in (
  'ROLE_REVEAL','SPEAKING','DRAWING','DISCUSSION','VOTING','VOTE_RESULT',
  'RUNOFF_VOTING','LIAR_REVEAL','LIAR_GUESS','ROUND_RESULT','FORCE_ENDED'
));

drop index if exists public.liar_rounds_one_in_progress_per_game_idx;
create unique index liar_rounds_one_in_progress_per_game_idx
on public.liar_rounds (game_id)
where status in (
  'ROLE_REVEAL','SPEAKING','DRAWING','DISCUSSION','VOTING','VOTE_RESULT',
  'RUNOFF_VOTING','LIAR_REVEAL','LIAR_GUESS'
);

create table if not exists public.liar_drawing_strokes (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.liar_rounds(id) on delete cascade,
  round_player_id uuid not null references public.liar_round_players(id) on delete cascade,
  turn_index smallint not null,
  stroke_no smallint not null,
  points jsonb not null,
  created_at timestamptz not null default now(),
  constraint liar_drawing_strokes_player_stroke_key unique (round_id, round_player_id, stroke_no),
  constraint liar_drawing_strokes_turn_index_check check (turn_index >= 0),
  constraint liar_drawing_strokes_stroke_no_check check (stroke_no between 1 and 10),
  constraint liar_drawing_strokes_points_check check (jsonb_typeof(points)='array' and jsonb_array_length(points) between 2 and 400)
);
create index if not exists liar_drawing_strokes_round_turn_idx
  on public.liar_drawing_strokes(round_id,turn_index,stroke_no);

alter table public.liar_drawing_strokes enable row level security;
revoke all on table public.liar_drawing_strokes from anon, authenticated;

-- Snapshot the mode-specific settings at round creation so later setting changes
-- never alter an already-started round.
create or replace function public.liar_snapshot_round_mode_settings()
returns trigger language plpgsql
set search_path=pg_catalog,public
as $$
declare v_game public.liar_games%rowtype;
begin
  select g.* into v_game from public.liar_games g where g.id=new.game_id;
  if not found then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;
  new.game_mode_snapshot:=v_game.game_mode;
  new.drawing_time_limit_snapshot:=v_game.drawing_time_limit;
  new.drawing_stroke_limit_snapshot:=v_game.drawing_stroke_limit;
  return new;
end $$;

revoke all on function public.liar_snapshot_round_mode_settings() from public,anon,authenticated;
drop trigger if exists liar_snapshot_round_mode_settings on public.liar_rounds;
create trigger liar_snapshot_round_mode_settings
before insert on public.liar_rounds
for each row execute function public.liar_snapshot_round_mode_settings();

-- restart/force-end create the next setup Game with the existing classic columns.
-- Copy the mode-specific fields from the preceding Game automatically.
create or replace function public.liar_copy_game_mode_settings()
returns trigger language plpgsql
set search_path=pg_catalog,public
as $$
declare v_prev public.liar_games%rowtype;
begin
  if new.game_no>1 and new.status='setup' then
    select g.* into v_prev
    from public.liar_games g
    where g.room_id=new.room_id and g.game_no<new.game_no
    order by g.game_no desc limit 1;
    if found then
      new.game_mode:=v_prev.game_mode;
      new.drawing_time_limit:=v_prev.drawing_time_limit;
      new.drawing_stroke_limit:=v_prev.drawing_stroke_limit;
    end if;
  end if;
  return new;
end $$;

revoke all on function public.liar_copy_game_mode_settings() from public,anon,authenticated;
drop trigger if exists liar_copy_game_mode_settings on public.liar_games;
create trigger liar_copy_game_mode_settings
before insert on public.liar_games
for each row execute function public.liar_copy_game_mode_settings();

create or replace function public.liar_update_game_settings_v2(
  p_player_key uuid,
  p_selected_categories text[],
  p_difficulty text,
  p_liar_count integer,
  p_guess_limit integer,
  p_show_category_to_liar boolean,
  p_game_mode text,
  p_drawing_time_limit integer,
  p_drawing_stroke_limit integer,
  p_expected_room_version bigint
)
returns bigint language plpgsql security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_game public.liar_games%rowtype;
  v_categories text[];
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  if p_show_category_to_liar is null
     or p_game_mode not in ('classic','drawing_spy')
     or p_drawing_time_limit not between 5 and 60
     or p_drawing_stroke_limit not between 1 and 10 then
    raise exception using message='INVALID_GAME_SETTINGS',errcode='P0001';
  end if;

  v_categories:=public.liar_validate_settings(p_selected_categories,p_difficulty,p_liar_count,p_guess_limit);

  select p.* into v_player from public.liar_players p
  where p.auth_user_id=v_auth and p.player_key=p_player_key and p.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select r.* into v_room from public.liar_rooms r where r.id=v_player.room_id for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
  if p_expected_room_version is null or v_room.version<>p_expected_room_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;

  select g.* into v_game from public.liar_games g
  where g.id=v_room.current_game_id and g.room_id=v_room.id for update;
  if not found or v_game.status<>'setup' or v_game.started_at is not null then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;

  update public.liar_games g
  set selected_categories=v_categories,
      difficulty=p_difficulty,
      liar_count=p_liar_count,
      guess_limit=p_guess_limit,
      show_category_to_liar=p_show_category_to_liar,
      game_mode=p_game_mode,
      drawing_time_limit=p_drawing_time_limit,
      drawing_stroke_limit=p_drawing_stroke_limit
  where g.id=v_game.id;

  update public.liar_rooms r
  set last_activity_at=now(),expires_at=now()+interval '24 hours',version=r.version+1
  where r.id=v_room.id returning r.version into v_room.version;
  return v_room.version;
end $$;

-- Existing UI action name is retained. Classic rounds still enter SPEAKING;
-- Drawing Spy rounds enter DRAWING and start player 0's timer.
create or replace function public.liar_start_speaking(p_player_key uuid,p_expected_round_version bigint)
returns bigint language plpgsql security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_game public.liar_games%rowtype;
  v_next_status text;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select p.* into v_player from public.liar_players p
  where p.auth_user_id=v_auth and p.player_key=p_player_key and p.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select r.* into v_room from public.liar_rooms r where r.id=v_player.room_id for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
  select r.* into v_round from public.liar_rounds r where r.id=v_room.current_round_id for update;
  if not found or v_round.status<>'ROLE_REVEAL' then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
  if p_expected_round_version is null or v_round.version<>p_expected_round_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;
  if exists(select 1 from public.liar_round_players rp where rp.round_id=v_round.id and rp.role_checked_at is null) then
    raise exception using message='ROLE_NOT_CONFIRMED',errcode='P0001';
  end if;
  select g.* into v_game from public.liar_games g where g.id=v_round.game_id and g.room_id=v_room.id;
  if not found then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;

  v_next_status:=case when v_game.game_mode='drawing_spy' then 'DRAWING' else 'SPEAKING' end;
  update public.liar_rounds r
  set status=v_next_status,
      current_speaker_index=0,
      drawing_turn_started_at=case when v_next_status='DRAWING' then now() else null end,
      version=r.version+1
  where r.id=v_round.id returning r.version into v_round.version;
  update public.liar_rooms r
  set last_activity_at=now(),expires_at=now()+interval '24 hours',version=r.version+1
  where r.id=v_room.id;
  return v_round.version;
end $$;

create or replace function public.liar_submit_drawing_stroke(
  p_player_key uuid,
  p_points jsonb,
  p_expected_round_version bigint
)
returns table(round_version bigint,room_version bigint,turn_finished boolean,drawing_finished boolean)
language plpgsql security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_round_player public.liar_round_players%rowtype;
  v_player_count integer;
  v_stroke_count integer;
  v_next_stroke integer;
  v_turn_finished boolean:=false;
  v_drawing_finished boolean:=false;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  if p_points is null or jsonb_typeof(p_points)<>'array' or jsonb_array_length(p_points) not between 2 and 400 then
    raise exception using message='INVALID_DRAWING_STROKE',errcode='P0001';
  end if;
  if exists(
    select 1 from jsonb_array_elements(p_points) p
    where jsonb_typeof(p)<>'object'
       or jsonb_typeof(p->'x')<>'number'
       or jsonb_typeof(p->'y')<>'number'
       or (p->>'x')::numeric<0 or (p->>'x')::numeric>1
       or (p->>'y')::numeric<0 or (p->>'y')::numeric>1
  ) then raise exception using message='INVALID_DRAWING_STROKE',errcode='P0001'; end if;

  select p.* into v_player from public.liar_players p
  where p.auth_user_id=v_auth and p.player_key=p_player_key and p.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select r.* into v_room from public.liar_rooms r where r.id=v_player.room_id for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  select r.* into v_round from public.liar_rounds r where r.id=v_room.current_round_id for update;
  if not found or v_round.status<>'DRAWING' or v_round.game_mode_snapshot<>'drawing_spy' then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
  if p_expected_round_version is null or v_round.version<>p_expected_round_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;
  if v_round.drawing_turn_started_at is null then raise exception using message='INVALID_DRAWING_STATE',errcode='P0001'; end if;
  if now()>v_round.drawing_turn_started_at+make_interval(secs=>v_round.drawing_time_limit_snapshot) then
    raise exception using message='DRAWING_TIME_EXPIRED',errcode='P0001';
  end if;

  select rp.* into v_round_player from public.liar_round_players rp
  where rp.round_id=v_round.id and rp.turn_order=v_round.current_speaker_index;
  if not found then raise exception using message='INVALID_DRAWING_STATE',errcode='P0001'; end if;
  if v_round_player.player_id is distinct from v_player.id then raise exception using message='NOT_CURRENT_DRAWER',errcode='P0001'; end if;

  select count(*) into v_stroke_count from public.liar_drawing_strokes s
  where s.round_id=v_round.id and s.round_player_id=v_round_player.id;
  if v_stroke_count>=v_round.drawing_stroke_limit_snapshot then raise exception using message='DRAWING_STROKE_LIMIT_REACHED',errcode='P0001'; end if;
  v_next_stroke:=v_stroke_count+1;

  insert into public.liar_drawing_strokes(round_id,round_player_id,turn_index,stroke_no,points)
  values(v_round.id,v_round_player.id,v_round.current_speaker_index,v_next_stroke,p_points);

  select count(*) into v_player_count from public.liar_round_players rp where rp.round_id=v_round.id;
  v_turn_finished:=v_next_stroke>=v_round.drawing_stroke_limit_snapshot;
  if v_turn_finished then
    if v_round.current_speaker_index>=v_player_count-1 then
      v_drawing_finished:=true;
      update public.liar_rounds r
      set status='DISCUSSION',current_speaker_index=null,drawing_turn_started_at=null,version=r.version+1
      where r.id=v_round.id returning r.version into v_round.version;
    else
      update public.liar_rounds r
      set current_speaker_index=r.current_speaker_index+1,drawing_turn_started_at=now(),version=r.version+1
      where r.id=v_round.id returning r.version into v_round.version;
    end if;
  else
    update public.liar_rounds r set version=r.version+1
    where r.id=v_round.id returning r.version into v_round.version;
  end if;

  update public.liar_rooms r
  set last_activity_at=now(),expires_at=now()+interval '24 hours',version=r.version+1
  where r.id=v_room.id returning r.version into v_room.version;

  return query select v_round.version,v_room.version,v_turn_finished,v_drawing_finished;
end $$;

create or replace function public.liar_advance_drawing_turn(
  p_player_key uuid,
  p_expected_round_version bigint
)
returns table(round_version bigint,room_version bigint,drawing_finished boolean)
language plpgsql security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_round_player public.liar_round_players%rowtype;
  v_player_count integer;
  v_finished boolean:=false;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select p.* into v_player from public.liar_players p
  where p.auth_user_id=v_auth and p.player_key=p_player_key and p.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select r.* into v_room from public.liar_rooms r where r.id=v_player.room_id for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  select r.* into v_round from public.liar_rounds r where r.id=v_room.current_round_id for update;
  if not found or v_round.status<>'DRAWING' or v_round.game_mode_snapshot<>'drawing_spy' then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
  if p_expected_round_version is null or v_round.version<>p_expected_round_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;

  select rp.* into v_round_player from public.liar_round_players rp
  where rp.round_id=v_round.id and rp.turn_order=v_round.current_speaker_index;
  if not found then raise exception using message='INVALID_DRAWING_STATE',errcode='P0001'; end if;
  if v_player.id<>v_room.host_player_id and v_round_player.player_id is distinct from v_player.id then
    raise exception using message='NOT_CURRENT_DRAWER',errcode='P0001';
  end if;

  select count(*) into v_player_count from public.liar_round_players rp where rp.round_id=v_round.id;
  if v_round.current_speaker_index>=v_player_count-1 then
    v_finished:=true;
    update public.liar_rounds r
    set status='DISCUSSION',current_speaker_index=null,drawing_turn_started_at=null,version=r.version+1
    where r.id=v_round.id returning r.version into v_round.version;
  else
    update public.liar_rounds r
    set current_speaker_index=r.current_speaker_index+1,drawing_turn_started_at=now(),version=r.version+1
    where r.id=v_round.id returning r.version into v_round.version;
  end if;

  update public.liar_rooms r
  set last_activity_at=now(),expires_at=now()+interval '24 hours',version=r.version+1
  where r.id=v_room.id returning r.version into v_room.version;

  return query select v_round.version,v_room.version,v_finished;
end $$;

-- Preserve the currently deployed snapshot (including runoff candidate speaker
-- projection) as an internal base, then enrich it with mode/drawing data.
do $$
begin
  if to_regprocedure('public.liar_get_room_snapshot_legacy(uuid)') is null then
    execute 'alter function public.liar_get_room_snapshot(uuid) rename to liar_get_room_snapshot_legacy';
  end if;
end $$;

create or replace function public.liar_get_room_snapshot(p_player_key uuid)
returns jsonb language plpgsql security definer stable
set search_path=pg_catalog,public
as $$
declare
  v_base jsonb;
  v_game_id uuid;
  v_round_id uuid;
  v_game public.liar_games%rowtype;
  v_round public.liar_rounds%rowtype;
  v_current_round_player uuid;
  v_current_stroke_count integer:=0;
  v_strokes jsonb:='[]'::jsonb;
begin
  v_base:=public.liar_get_room_snapshot_legacy(p_player_key);
  v_game_id:=nullif(v_base#>>'{game,id}','')::uuid;
  v_round_id:=nullif(v_base#>>'{round,id}','')::uuid;

  if v_game_id is not null then
    select g.* into v_game from public.liar_games g where g.id=v_game_id;
    v_base:=jsonb_set(v_base,'{game}',coalesce(v_base->'game','{}'::jsonb)||jsonb_build_object(
      'game_mode',v_game.game_mode,
      'drawing_time_limit',v_game.drawing_time_limit,
      'drawing_stroke_limit',v_game.drawing_stroke_limit
    ),true);
  end if;

  if v_round_id is not null then
    select r.* into v_round from public.liar_rounds r where r.id=v_round_id;
    v_base:=jsonb_set(v_base,'{round}',coalesce(v_base->'round','{}'::jsonb)||jsonb_build_object(
      'game_mode_snapshot',v_round.game_mode_snapshot,
      'drawing_time_limit_snapshot',v_round.drawing_time_limit_snapshot,
      'drawing_stroke_limit_snapshot',v_round.drawing_stroke_limit_snapshot,
      'drawing_turn_started_at',v_round.drawing_turn_started_at
    ),true);

    if v_round.game_mode_snapshot='drawing_spy' then
      if v_round.status='DRAWING' and v_round.current_speaker_index is not null then
        select rp.id into v_current_round_player
        from public.liar_round_players rp
        where rp.round_id=v_round.id and rp.turn_order=v_round.current_speaker_index;
        if v_current_round_player is not null then
          select count(*) into v_current_stroke_count from public.liar_drawing_strokes s
          where s.round_id=v_round.id and s.round_player_id=v_current_round_player;
        end if;
      end if;

      select coalesce(jsonb_agg(jsonb_build_object(
        'id',s.id,
        'round_player_id',s.round_player_id,
        'nickname',rp.nickname_snapshot,
        'turn_index',s.turn_index,
        'stroke_no',s.stroke_no,
        'points',s.points
      ) order by s.turn_index,s.stroke_no,s.created_at),'[]'::jsonb)
      into v_strokes
      from public.liar_drawing_strokes s
      join public.liar_round_players rp on rp.id=s.round_player_id
      where s.round_id=v_round.id;

      v_base:=jsonb_set(v_base,'{drawing}',jsonb_build_object(
        'time_limit',v_round.drawing_time_limit_snapshot,
        'stroke_limit',v_round.drawing_stroke_limit_snapshot,
        'turn_started_at',v_round.drawing_turn_started_at,
        'server_now',now(),
        'current_round_player_id',v_current_round_player,
        'current_stroke_count',v_current_stroke_count,
        'strokes',v_strokes
      ),true);
    else
      v_base:=jsonb_set(v_base,'{drawing}','null'::jsonb,true);
    end if;
  else
    v_base:=jsonb_set(v_base,'{drawing}','null'::jsonb,true);
  end if;

  return v_base;
end $$;

revoke all on function public.liar_update_game_settings_v2(uuid,text[],text,integer,integer,boolean,text,integer,integer,bigint) from public,anon,authenticated;
revoke all on function public.liar_submit_drawing_stroke(uuid,jsonb,bigint) from public,anon,authenticated;
revoke all on function public.liar_advance_drawing_turn(uuid,bigint) from public,anon,authenticated;
revoke all on function public.liar_get_room_snapshot_legacy(uuid) from public,anon,authenticated;
revoke all on function public.liar_get_room_snapshot(uuid) from public,anon,authenticated;
