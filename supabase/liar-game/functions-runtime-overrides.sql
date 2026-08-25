-- Canonical final runtime overrides for Liar Game.
-- Run this AFTER functions-core/functions-vote and all current liar-game migrations.
-- It intentionally reasserts functions that older base SQL files also define,
-- preventing a fresh install or maintenance rerun from leaving stale behavior active.

create or replace function public.liar_validate_settings(
  p_categories text[], p_difficulty text, p_liar_count integer, p_guess_limit integer
) returns text[]
language plpgsql immutable
set search_path=pg_catalog,public
as $$
declare v_categories text[];
begin
  if p_categories is null or p_difficulty is null or p_liar_count is null or p_guess_limit is null then
    raise exception using message='INVALID_GAME_SETTINGS',errcode='P0001';
  end if;
  select array_agg(x order by first_pos) into v_categories
  from (
    select x,min(pos) first_pos
    from unnest(p_categories) with ordinality u(x,pos)
    group by x
  ) s;
  if coalesce(cardinality(v_categories),0)<1
     or not (v_categories <@ array['음식','장소','직업','동물','물건','인물','스포츠','교통수단','자연','취미','음악','기타']::text[])
     or array_position(v_categories,null) is not null
     or p_difficulty not in ('all','easy','normal','hard')
     or p_liar_count not between 1 and 3
     or p_guess_limit not between 1 and 3 then
    raise exception using message='INVALID_GAME_SETTINGS',errcode='P0001';
  end if;
  return v_categories;
end $$;

create or replace function public.liar_start_speaking(
  p_player_key uuid,
  p_expected_round_version bigint
)
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
  set status=v_next_status,current_speaker_index=0,
      drawing_turn_started_at=case when v_next_status='DRAWING' then now() else null end,
      version=r.version+1
  where r.id=v_round.id returning r.version into v_round.version;
  update public.liar_rooms r
  set last_activity_at=now(),expires_at=now()+interval '24 hours',version=r.version+1
  where r.id=v_room.id;
  return v_round.version;
end $$;

create or replace function public.liar_move_speaker(
  p_player_key uuid,
  p_direction text,
  p_expected_round_version bigint
)
returns table(current_speaker_index smallint,round_version bigint)
language plpgsql security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_stage public.liar_vote_stages%rowtype;
  v_count integer;
  v_new integer;
  v_current_player_id uuid;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select * into v_player from public.liar_players
  where auth_user_id=v_auth and player_key=p_player_key and membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select * into v_room from public.liar_rooms where id=v_player.room_id for update;
  if v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  select * into v_round from public.liar_rounds where id=v_room.current_round_id for update;
  if not found or v_round.status<>'SPEAKING' then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
  if p_expected_round_version is null or v_round.version<>p_expected_round_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;
  if p_direction is null or upper(p_direction) not in ('NEXT','PREVIOUS','RESTART') then raise exception using message='INVALID_DIRECTION',errcode='P0001'; end if;

  if v_round.current_vote_stage>0 then
    select vs.* into v_stage from public.liar_vote_stages vs
    where vs.round_id=v_round.id and vs.stage_no=v_round.current_vote_stage and vs.kind='runoff' and vs.status='open';
    if not found then raise exception using message='INVALID_RUNOFF_STATE',errcode='P0001'; end if;
    select count(*) into v_count from public.liar_round_players rp
    where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids);
    select rp.player_id into v_current_player_id from public.liar_round_players rp
    where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids)
    order by rp.turn_order offset v_round.current_speaker_index limit 1;
  else
    select count(*) into v_count from public.liar_round_players rp where rp.round_id=v_round.id;
    select rp.player_id into v_current_player_id from public.liar_round_players rp
    where rp.round_id=v_round.id order by rp.turn_order offset v_round.current_speaker_index limit 1;
  end if;

  if v_count<1 or v_current_player_id is null then raise exception using message='SPEAKER_INDEX_OUT_OF_RANGE',errcode='P0001'; end if;
  if upper(p_direction)='PREVIOUS' and v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
  if upper(p_direction)='NEXT' and v_room.host_player_id<>v_player.id and v_current_player_id is distinct from v_player.id then
    raise exception using message='NOT_CURRENT_SPEAKER',errcode='P0001';
  end if;

  if upper(p_direction)='RESTART' then
    if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
    if v_round.current_speaker_index<>v_count-1 then raise exception using message='SPEAKING_NOT_FINISHED',errcode='P0001'; end if;
    v_new:=0;
  else
    v_new:=v_round.current_speaker_index+case when upper(p_direction)='NEXT' then 1 else -1 end;
    if v_new<0 or v_new>=v_count then raise exception using message='SPEAKER_INDEX_OUT_OF_RANGE',errcode='P0001'; end if;
  end if;

  update public.liar_rounds r set current_speaker_index=v_new,version=r.version+1
  where r.id=v_round.id returning r.current_speaker_index,r.version into current_speaker_index,round_version;
  update public.liar_rooms set last_activity_at=now(),expires_at=now()+interval '24 hours',version=version+1 where id=v_room.id;
  return next;
end $$;

create or replace function public.liar_finish_speaking(
  p_player_key uuid,
  p_expected_round_version bigint
)
returns bigint language plpgsql security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_stage public.liar_vote_stages%rowtype;
  v_count integer;
  v_next_status text:='DISCUSSION';
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select * into v_player from public.liar_players
  where auth_user_id=v_auth and player_key=p_player_key and membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select * into v_room from public.liar_rooms where id=v_player.room_id for update;
  if v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
  select * into v_round from public.liar_rounds where id=v_room.current_round_id for update;
  if not found or v_round.status<>'SPEAKING' then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
  if p_expected_round_version is null or v_round.version<>p_expected_round_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;

  if v_round.current_vote_stage>0 then
    select vs.* into v_stage from public.liar_vote_stages vs
    where vs.round_id=v_round.id and vs.stage_no=v_round.current_vote_stage and vs.kind='runoff' and vs.status='open';
    if not found then raise exception using message='INVALID_RUNOFF_STATE',errcode='P0001'; end if;
    select count(*) into v_count from public.liar_round_players rp
    where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids);
    v_next_status:='RUNOFF_VOTING';
  else
    select count(*) into v_count from public.liar_round_players rp where rp.round_id=v_round.id;
  end if;

  if v_count<1 then raise exception using message='INVALID_RUNOFF_STATE',errcode='P0001'; end if;
  if v_round.current_speaker_index<>v_count-1 then raise exception using message='SPEAKING_NOT_FINISHED',errcode='P0001'; end if;
  update public.liar_rounds set status=v_next_status,version=version+1 where id=v_round.id returning version into v_round.version;
  update public.liar_rooms set last_activity_at=now(),expires_at=now()+interval '24 hours',version=version+1 where id=v_room.id;
  return v_round.version;
end $$;

-- Drawing Spy snapshot projection. This is identical in intent to the latest
-- drawing migration and is repeated here because functions-core.sql defines the
-- public snapshot name too.
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
      'game_mode',v_game.game_mode,'drawing_time_limit',v_game.drawing_time_limit,
      'drawing_stroke_limit',v_game.drawing_stroke_limit,'drawing_stroke_unlimited',v_game.drawing_stroke_unlimited
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
        select vs.* into v_stage from public.liar_vote_stages vs
        where vs.round_id=v_round.id and vs.stage_no=v_round.current_vote_stage and vs.kind='runoff' and vs.status='open';
        if not found then raise exception using message='INVALID_RUNOFF_STATE',errcode='P0001'; end if;
        v_is_runoff:=true;
        v_drawing_stage_no:=v_round.current_vote_stage;
        v_candidate_ids:=v_stage.candidate_round_player_ids;
        v_time_limit:=10;v_stroke_limit:=1;v_unlimited:=false;
      end if;

      if v_round.status='DRAWING' and v_round.current_speaker_index is not null then
        if v_is_runoff then
          select rp.id into v_current_round_player from public.liar_round_players rp
          where rp.round_id=v_round.id and rp.id=any(v_candidate_ids)
          order by rp.turn_order offset v_round.current_speaker_index limit 1;
        else
          select rp.id into v_current_round_player from public.liar_round_players rp
          where rp.round_id=v_round.id order by rp.turn_order offset v_round.current_speaker_index limit 1;
        end if;
        if v_current_round_player is not null then
          select count(*) into v_current_stroke_count from public.liar_drawing_strokes s
          where s.round_id=v_round.id and s.drawing_stage_no=v_drawing_stage_no and s.round_player_id=v_current_round_player;
        end if;
      end if;

      select coalesce(jsonb_agg(jsonb_build_object(
        'id',s.id,'drawing_stage_no',s.drawing_stage_no,'round_player_id',s.round_player_id,
        'nickname',rp.nickname_snapshot,'turn_index',s.turn_index,'stroke_no',s.stroke_no,
        'points',s.points,'created_at',s.created_at
      ) order by s.drawing_stage_no,s.turn_index,s.stroke_no,s.created_at),'[]'::jsonb)
      into v_strokes
      from public.liar_drawing_strokes s
      join public.liar_round_players rp on rp.id=s.round_player_id
      where s.round_id=v_round.id;

      v_base:=jsonb_set(v_base,'{drawing}',jsonb_build_object(
        'time_limit',v_time_limit,'stroke_limit',v_stroke_limit,'stroke_unlimited',v_unlimited,
        'turn_started_at',v_round.drawing_turn_started_at,'server_now',now(),
        'is_runoff',v_is_runoff,'drawing_stage_no',v_drawing_stage_no,
        'candidate_round_player_ids',to_jsonb(v_candidate_ids),
        'current_round_player_id',v_current_round_player,'current_stroke_count',v_current_stroke_count,'strokes',v_strokes
      ),true);
    else
      v_base:=jsonb_set(v_base,'{drawing}','null'::jsonb,true);
    end if;
  else
    v_base:=jsonb_set(v_base,'{drawing}','null'::jsonb,true);
  end if;
  return v_base;
end $$;

-- The newest mode-aware runoff entry point is supplied by
-- migrations/20260826_drawing_spy_phase1.sql. Revoke helper/public defaults
-- here; rls.sql grants the intended client RPCs after this file.
revoke all on function public.liar_validate_settings(text[],text,integer,integer) from public,anon,authenticated;
revoke all on function public.liar_get_room_snapshot(uuid) from public,anon,authenticated;
revoke all on function public.liar_start_speaking(uuid,bigint) from public,anon,authenticated;
revoke all on function public.liar_move_speaker(uuid,text,bigint) from public,anon,authenticated;
revoke all on function public.liar_finish_speaking(uuid,bigint) from public,anon,authenticated;
