-- Drawing Spy phase 1 upgrades.
-- 1) Tied runoff candidates draw 10 seconds / 1 stroke each instead of speaking.
-- 2) Drawing strokes are partitioned by drawing stage so the same player can draw again in a runoff.
-- 3) The host may change only Drawing Spy time/stroke settings between rounds.

alter table public.liar_drawing_strokes
  add column if not exists drawing_stage_no smallint not null default 0;

alter table public.liar_drawing_strokes
  drop constraint if exists liar_drawing_strokes_player_stroke_key;
alter table public.liar_drawing_strokes
  add constraint liar_drawing_strokes_player_stroke_key
  unique (round_id,drawing_stage_no,round_player_id,stroke_no);

alter table public.liar_drawing_strokes
  drop constraint if exists liar_drawing_strokes_drawing_stage_no_check;
alter table public.liar_drawing_strokes
  add constraint liar_drawing_strokes_drawing_stage_no_check
  check (drawing_stage_no >= 0);

drop index if exists public.liar_drawing_strokes_round_turn_idx;
create index liar_drawing_strokes_round_turn_idx
  on public.liar_drawing_strokes(round_id,drawing_stage_no,turn_index,stroke_no);

create or replace function public.liar_update_next_round_drawing_settings(
  p_player_key uuid,
  p_drawing_time_limit integer,
  p_drawing_stroke_limit integer,
  p_drawing_stroke_unlimited boolean,
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
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  if p_drawing_time_limit not between 5 and 60
     or p_drawing_stroke_limit not between 1 and 10
     or p_drawing_stroke_unlimited is null then
    raise exception using message='INVALID_GAME_SETTINGS',errcode='P0001';
  end if;

  select p.* into v_player
  from public.liar_players p
  where p.auth_user_id=v_auth and p.player_key=p_player_key and p.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select r.* into v_room
  from public.liar_rooms r
  where r.id=v_player.room_id
  for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED',errcode='P0001';
  end if;
  if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
  if p_expected_room_version is null or v_room.version<>p_expected_room_version then
    raise exception using message='STALE_VERSION',errcode='P0001';
  end if;
  if v_room.current_round_id is not null then
    raise exception using message='INVALID_ROUND_STATE',errcode='P0001';
  end if;

  select g.* into v_game
  from public.liar_games g
  where g.id=v_room.current_game_id and g.room_id=v_room.id
  for update;
  if not found or v_game.status<>'active' or v_game.game_mode<>'drawing_spy' then
    raise exception using message='INVALID_GAME_STATE',errcode='P0001';
  end if;

  update public.liar_games g
  set drawing_time_limit=p_drawing_time_limit,
      drawing_stroke_limit=p_drawing_stroke_limit,
      drawing_stroke_unlimited=p_drawing_stroke_unlimited
  where g.id=v_game.id;

  update public.liar_rooms r
  set last_activity_at=now(),expires_at=now()+interval '24 hours',version=r.version+1
  where r.id=v_room.id
  returning r.version into v_room.version;

  return v_room.version;
end $$;

-- Keep the existing RPC name for compatibility. Classic mode enters SPEAKING;
-- Drawing Spy creates the same runoff vote stage but enters DRAWING instead.
create or replace function public.liar_start_runoff_speaking(
  p_player_key uuid,
  p_expected_round_version bigint
)
returns table(vote_stage_id uuid,round_version bigint,room_version bigint)
language plpgsql security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_stage public.liar_vote_stages%rowtype;
  v_game public.liar_games%rowtype;
  v_stage_winners uuid[];
  v_boundary_ids uuid[];
  v_selected uuid[];
  v_remaining integer;
  v_runoff boolean;
  v_locked uuid[];
  v_stage_id uuid;
  v_round_version bigint;
  v_room_version bigint;
  v_valid integer;
  v_next_status text;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select lp.* into v_player
  from public.liar_players lp
  where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active'
  for update;
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select rm.* into v_room from public.liar_rooms rm where rm.id=v_player.room_id for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;

  select rd.* into v_round from public.liar_rounds rd where rd.id=v_room.current_round_id for update;
  if not found or v_round.status<>'VOTE_RESULT' then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
  if p_expected_round_version is null or v_round.version<>p_expected_round_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;

  select vs.* into v_stage
  from public.liar_vote_stages vs
  where vs.round_id=v_round.id and vs.stage_no=v_round.current_vote_stage
  for update;
  if not found or v_stage.status<>'closed' then raise exception using message='INVALID_RUNOFF_STATE',errcode='P0001'; end if;
  if exists(select 1 from public.liar_round_players rp where rp.round_id=v_round.id and rp.is_final_suspect) then
    raise exception using message='RUNOFF_NOT_REQUIRED',errcode='P0001';
  end if;

  select b.stage_winner_ids,b.boundary_candidate_ids,b.remaining_seats,b.runoff_required,b.selected_ids
  into v_stage_winners,v_boundary_ids,v_remaining,v_runoff,v_selected
  from public.liar_compute_vote_boundary(v_stage.id) b;
  if not coalesce(v_runoff,false) then raise exception using message='RUNOFF_NOT_REQUIRED',errcode='P0001'; end if;

  v_locked:=array(select distinct x from unnest(v_stage.locked_winner_round_player_ids||v_stage_winners) u(x));
  select gm.* into v_game from public.liar_games gm where gm.id=v_round.game_id and gm.room_id=v_room.id;
  if not found then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;

  select count(*) into v_valid
  from public.liar_round_players rp
  where rp.round_id=v_round.id and rp.id=any(v_locked||v_boundary_ids);
  if cardinality(v_boundary_ids)<=v_remaining
     or cardinality(v_locked)+v_remaining<>v_game.liar_count
     or v_valid<>cardinality(v_locked)+cardinality(v_boundary_ids) then
    raise exception using message='INVALID_RUNOFF_STATE',errcode='P0001';
  end if;

  insert into public.liar_vote_stages as vs(
    round_id,stage_no,kind,seats_to_fill,candidate_round_player_ids,locked_winner_round_player_ids,status
  ) values(
    v_round.id,v_stage.stage_no+1,'runoff',v_remaining,v_boundary_ids,v_locked,'open'
  ) returning vs.id into v_stage_id;

  v_next_status:=case when v_round.game_mode_snapshot='drawing_spy' then 'DRAWING' else 'SPEAKING' end;

  update public.liar_rounds rd
  set current_vote_stage=v_stage.stage_no+1,
      current_speaker_index=0,
      status=v_next_status,
      drawing_turn_started_at=case when v_next_status='DRAWING' then now() else null end,
      version=rd.version+1
  where rd.id=v_round.id
  returning rd.version into v_round_version;

  update public.liar_rooms rm
  set last_activity_at=now(),expires_at=now()+interval '24 hours',version=rm.version+1
  where rm.id=v_room.id
  returning rm.version into v_room_version;

  return query select v_stage_id,v_round_version,v_room_version;
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
  v_stage public.liar_vote_stages%rowtype;
  v_is_runoff boolean:=false;
  v_drawing_stage_no integer:=0;
  v_player_count integer;
  v_stroke_count integer;
  v_next_stroke integer;
  v_time_limit integer;
  v_stroke_limit integer;
  v_unlimited boolean;
  v_turn_finished boolean:=false;
  v_drawing_finished boolean:=false;
  v_next_status text;
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

  if v_round.current_vote_stage>0 then
    select vs.* into v_stage
    from public.liar_vote_stages vs
    where vs.round_id=v_round.id
      and vs.stage_no=v_round.current_vote_stage
      and vs.kind='runoff'
      and vs.status='open';
    if not found then raise exception using message='INVALID_RUNOFF_STATE',errcode='P0001'; end if;
    v_is_runoff:=true;
    v_drawing_stage_no:=v_round.current_vote_stage;
    v_time_limit:=10;
    v_stroke_limit:=1;
    v_unlimited:=false;
  else
    v_time_limit:=v_round.drawing_time_limit_snapshot;
    v_stroke_limit:=v_round.drawing_stroke_limit_snapshot;
    v_unlimited:=v_round.drawing_stroke_unlimited_snapshot;
  end if;

  if now()>v_round.drawing_turn_started_at+make_interval(secs=>v_time_limit) then
    raise exception using message='DRAWING_TIME_EXPIRED',errcode='P0001';
  end if;

  if v_is_runoff then
    select rp.* into v_round_player
    from public.liar_round_players rp
    where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids)
    order by rp.turn_order
    offset v_round.current_speaker_index limit 1;
    select count(*) into v_player_count
    from public.liar_round_players rp
    where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids);
  else
    select rp.* into v_round_player
    from public.liar_round_players rp
    where rp.round_id=v_round.id
    order by rp.turn_order
    offset v_round.current_speaker_index limit 1;
    select count(*) into v_player_count
    from public.liar_round_players rp where rp.round_id=v_round.id;
  end if;

  if not found or v_round_player.id is null or v_player_count<1 then raise exception using message='INVALID_DRAWING_STATE',errcode='P0001'; end if;
  if v_round_player.player_id is distinct from v_player.id then raise exception using message='NOT_CURRENT_DRAWER',errcode='P0001'; end if;

  select count(*) into v_stroke_count
  from public.liar_drawing_strokes s
  where s.round_id=v_round.id
    and s.drawing_stage_no=v_drawing_stage_no
    and s.round_player_id=v_round_player.id;
  if not v_unlimited and v_stroke_count>=v_stroke_limit then
    raise exception using message='DRAWING_STROKE_LIMIT_REACHED',errcode='P0001';
  end if;
  v_next_stroke:=v_stroke_count+1;

  insert into public.liar_drawing_strokes(
    round_id,drawing_stage_no,round_player_id,turn_index,stroke_no,points
  ) values(
    v_round.id,v_drawing_stage_no,v_round_player.id,v_round.current_speaker_index,v_next_stroke,p_points
  );

  v_turn_finished:=not v_unlimited and v_next_stroke>=v_stroke_limit;
  if v_turn_finished then
    if v_round.current_speaker_index>=v_player_count-1 then
      v_drawing_finished:=true;
      v_next_status:=case when v_is_runoff then 'RUNOFF_VOTING' else 'DISCUSSION' end;
      update public.liar_rounds r
      set status=v_next_status,current_speaker_index=null,drawing_turn_started_at=null,version=r.version+1
      where r.id=v_round.id returning r.version into v_round.version;
    else
      update public.liar_rounds r
      set current_speaker_index=r.current_speaker_index+1,drawing_turn_started_at=now(),version=r.version+1
      where r.id=v_round.id returning r.version into v_round.version;
    end if;
  else
    update public.liar_rounds r
    set version=r.version+1
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
  v_stage public.liar_vote_stages%rowtype;
  v_is_runoff boolean:=false;
  v_player_count integer;
  v_finished boolean:=false;
  v_next_status text;
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

  if v_round.current_vote_stage>0 then
    select vs.* into v_stage
    from public.liar_vote_stages vs
    where vs.round_id=v_round.id
      and vs.stage_no=v_round.current_vote_stage
      and vs.kind='runoff'
      and vs.status='open';
    if not found then raise exception using message='INVALID_RUNOFF_STATE',errcode='P0001'; end if;
    v_is_runoff:=true;
    select rp.* into v_round_player
    from public.liar_round_players rp
    where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids)
    order by rp.turn_order
    offset v_round.current_speaker_index limit 1;
    select count(*) into v_player_count
    from public.liar_round_players rp
    where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids);
  else
    select rp.* into v_round_player
    from public.liar_round_players rp
    where rp.round_id=v_round.id
    order by rp.turn_order
    offset v_round.current_speaker_index limit 1;
    select count(*) into v_player_count
    from public.liar_round_players rp where rp.round_id=v_round.id;
  end if;

  if v_round_player.id is null or v_player_count<1 then raise exception using message='INVALID_DRAWING_STATE',errcode='P0001'; end if;
  if v_player.id<>v_room.host_player_id and v_round_player.player_id is distinct from v_player.id then
    raise exception using message='NOT_CURRENT_DRAWER',errcode='P0001';
  end if;

  if v_round.current_speaker_index>=v_player_count-1 then
    v_finished:=true;
    v_next_status:=case when v_is_runoff then 'RUNOFF_VOTING' else 'DISCUSSION' end;
    update public.liar_rounds r
    set status=v_next_status,current_speaker_index=null,drawing_turn_started_at=null,version=r.version+1
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

-- Enrich the Drawing Spy snapshot with current tiebreak context and stage-aware strokes.
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
  v_stage public.liar_vote_stages%rowtype;
  v_current_round_player uuid;
  v_current_stroke_count integer:=0;
  v_strokes jsonb:='[]'::jsonb;
  v_is_runoff boolean:=false;
  v_drawing_stage_no integer:=0;
  v_candidate_ids uuid[]:=array[]::uuid[];
  v_time_limit integer;
  v_stroke_limit integer;
  v_unlimited boolean;
begin
  v_base:=public.liar_get_room_snapshot_legacy(p_player_key);
  v_game_id:=nullif(v_base#>>'{game,id}','')::uuid;
  v_round_id:=nullif(v_base#>>'{round,id}','')::uuid;

  if v_game_id is not null then
    select g.* into v_game from public.liar_games g where g.id=v_game_id;
    v_base:=jsonb_set(v_base,'{game}',coalesce(v_base->'game','{}'::jsonb)||jsonb_build_object(
      'game_mode',v_game.game_mode,
      'drawing_time_limit',v_game.drawing_time_limit,
      'drawing_stroke_limit',v_game.drawing_stroke_limit,
      'drawing_stroke_unlimited',v_game.drawing_stroke_unlimited
    ),true);
  end if;

  if v_round_id is not null then
    select r.* into v_round from public.liar_rounds r where r.id=v_round_id;
    v_base:=jsonb_set(v_base,'{round}',coalesce(v_base->'round','{}'::jsonb)||jsonb_build_object(
      'game_mode_snapshot',v_round.game_mode_snapshot,
      'drawing_time_limit_snapshot',v_round.drawing_time_limit_snapshot,
      'drawing_stroke_limit_snapshot',v_round.drawing_stroke_limit_snapshot,
      'drawing_stroke_unlimited_snapshot',v_round.drawing_stroke_unlimited_snapshot,
      'drawing_turn_started_at',v_round.drawing_turn_started_at
    ),true);

    if v_round.game_mode_snapshot='drawing_spy' then
      v_time_limit:=v_round.drawing_time_limit_snapshot;
      v_stroke_limit:=v_round.drawing_stroke_limit_snapshot;
      v_unlimited:=v_round.drawing_stroke_unlimited_snapshot;

      if v_round.status='DRAWING' and v_round.current_vote_stage>0 then
        select vs.* into v_stage
        from public.liar_vote_stages vs
        where vs.round_id=v_round.id
          and vs.stage_no=v_round.current_vote_stage
          and vs.kind='runoff'
          and vs.status='open';
        if not found then raise exception using message='INVALID_RUNOFF_STATE',errcode='P0001'; end if;
        v_is_runoff:=true;
        v_drawing_stage_no:=v_round.current_vote_stage;
        v_candidate_ids:=v_stage.candidate_round_player_ids;
        v_time_limit:=10;
        v_stroke_limit:=1;
        v_unlimited:=false;
      end if;

      if v_round.status='DRAWING' and v_round.current_speaker_index is not null then
        if v_is_runoff then
          select rp.id into v_current_round_player
          from public.liar_round_players rp
          where rp.round_id=v_round.id and rp.id=any(v_candidate_ids)
          order by rp.turn_order
          offset v_round.current_speaker_index limit 1;
        else
          select rp.id into v_current_round_player
          from public.liar_round_players rp
          where rp.round_id=v_round.id
          order by rp.turn_order
          offset v_round.current_speaker_index limit 1;
        end if;
        if v_current_round_player is not null then
          select count(*) into v_current_stroke_count
          from public.liar_drawing_strokes s
          where s.round_id=v_round.id
            and s.drawing_stage_no=v_drawing_stage_no
            and s.round_player_id=v_current_round_player;
        end if;
      end if;

      select coalesce(jsonb_agg(jsonb_build_object(
        'id',s.id,
        'drawing_stage_no',s.drawing_stage_no,
        'round_player_id',s.round_player_id,
        'nickname',rp.nickname_snapshot,
        'turn_index',s.turn_index,
        'stroke_no',s.stroke_no,
        'points',s.points,
        'created_at',s.created_at
      ) order by s.drawing_stage_no,s.turn_index,s.stroke_no,s.created_at),'[]'::jsonb)
      into v_strokes
      from public.liar_drawing_strokes s
      join public.liar_round_players rp on rp.id=s.round_player_id
      where s.round_id=v_round.id;

      v_base:=jsonb_set(v_base,'{drawing}',jsonb_build_object(
        'time_limit',v_time_limit,
        'stroke_limit',v_stroke_limit,
        'stroke_unlimited',v_unlimited,
        'turn_started_at',v_round.drawing_turn_started_at,
        'server_now',now(),
        'is_runoff',v_is_runoff,
        'drawing_stage_no',v_drawing_stage_no,
        'candidate_round_player_ids',to_jsonb(v_candidate_ids),
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

revoke all on function public.liar_update_next_round_drawing_settings(uuid,integer,integer,boolean,bigint)
from public,anon,authenticated;
