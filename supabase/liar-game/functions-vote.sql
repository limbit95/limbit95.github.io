-- Liar Game vote Phase 1 RPCs. Run after schema.sql and functions-core.sql.
-- Ballots remain private while a stage is open; clients only receive projected RPC data.

create or replace function public.liar_start_vote(
  p_player_key uuid,
  p_expected_round_version bigint
) returns table(vote_stage_id uuid, round_version bigint, room_version bigint)
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_auth uuid := auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_game public.liar_games%rowtype;
  v_candidates uuid[];
  v_stage_id uuid;
  v_round_version bigint;
  v_room_version bigint;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED', errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER', errcode='P0001'; end if;
  select lp.* into v_player from public.liar_players as lp
  where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active' for update;
  if not found then raise exception using message='NOT_ROOM_MEMBER', errcode='P0001'; end if;
  select rm.* into v_room from public.liar_rooms as rm where rm.id=v_player.room_id for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED', errcode='P0001'; end if;
  if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST', errcode='P0001'; end if;
  select rd.* into v_round from public.liar_rounds as rd where rd.id=v_room.current_round_id for update;
  if not found or v_round.status<>'DISCUSSION' then raise exception using message='INVALID_ROUND_STATE', errcode='P0001'; end if;
  if p_expected_round_version is null or v_round.version<>p_expected_round_version then raise exception using message='STALE_VERSION', errcode='P0001'; end if;
  if v_round.current_vote_stage<>0 or exists(select 1 from public.liar_vote_stages as vs where vs.round_id=v_round.id) then
    raise exception using message='VOTE_ALREADY_STARTED', errcode='P0001';
  end if;
  select gm.* into v_game from public.liar_games as gm where gm.id=v_round.game_id and gm.room_id=v_room.id;
  if not found or v_game.status<>'active' then raise exception using message='INVALID_GAME_STATE', errcode='P0001'; end if;
  select array_agg(rp.id order by rp.turn_order) into v_candidates
  from public.liar_round_players as rp where rp.round_id=v_round.id;
  if coalesce(cardinality(v_candidates),0)<=v_game.liar_count then raise exception using message='INVALID_LIAR_COUNT', errcode='P0001'; end if;
  insert into public.liar_vote_stages as vs
    (round_id,stage_no,kind,seats_to_fill,candidate_round_player_ids,locked_winner_round_player_ids,status)
  values (v_round.id,1,'original',v_game.liar_count,v_candidates,array[]::uuid[],'open')
  returning vs.id into v_stage_id;
  update public.liar_rounds as rd set current_vote_stage=1,status='VOTING',version=rd.version+1
  where rd.id=v_round.id returning rd.version into v_round_version;
  update public.liar_rooms as rm set last_activity_at=now(),expires_at=now()+interval '24 hours',version=rm.version+1
  where rm.id=v_room.id returning rm.version into v_room_version;
  return query select v_stage_id,v_round_version,v_room_version;
end;
$$;

create or replace function public.liar_submit_ballot(
  p_player_key uuid,
  p_target_round_player_ids uuid[]
) returns table(ballot_id uuid, revision integer, room_version bigint)
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_auth uuid := auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_stage public.liar_vote_stages%rowtype;
  v_voter public.liar_round_players%rowtype;
  v_ballot_id uuid;
  v_revision integer;
  v_room_version bigint;
  v_distinct_count integer;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED', errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER', errcode='P0001'; end if;
  select lp.* into v_player from public.liar_players as lp
  where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active' for update;
  if not found then raise exception using message='NOT_ROOM_MEMBER', errcode='P0001'; end if;
  -- Keeping room -> round -> stage lock order makes close and submit mutually safe.
  select rm.* into v_room from public.liar_rooms as rm where rm.id=v_player.room_id for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED', errcode='P0001'; end if;
  select rd.* into v_round from public.liar_rounds as rd where rd.id=v_room.current_round_id for update;
  if not found then raise exception using message='VOTE_NOT_STARTED', errcode='P0001'; end if;
  if v_round.status<>'VOTING' then
    if v_round.status='VOTE_RESULT' then raise exception using message='VOTE_CLOSED', errcode='P0001'; end if;
    raise exception using message='INVALID_ROUND_STATE', errcode='P0001';
  end if;
  if v_round.current_vote_stage=0 then raise exception using message='VOTE_NOT_STARTED', errcode='P0001'; end if;
  select vs.* into v_stage from public.liar_vote_stages as vs
  where vs.round_id=v_round.id and vs.stage_no=v_round.current_vote_stage for update;
  if not found then raise exception using message='VOTE_NOT_STARTED', errcode='P0001'; end if;
  if v_stage.status<>'open' then raise exception using message='VOTE_CLOSED', errcode='P0001'; end if;
  select rp.* into v_voter from public.liar_round_players as rp
  where rp.round_id=v_round.id and rp.player_id=v_player.id;
  if not found then raise exception using message='NOT_ROUND_PARTICIPANT', errcode='P0001'; end if;
  if p_target_round_player_ids is null or cardinality(p_target_round_player_ids)<>v_stage.seats_to_fill
     or array_position(p_target_round_player_ids,null) is not null then
    raise exception using message='INVALID_BALLOT_SELECTION_COUNT', errcode='P0001';
  end if;
  select count(distinct target_id) into v_distinct_count from unnest(p_target_round_player_ids) as targets(target_id);
  if v_distinct_count<>v_stage.seats_to_fill then raise exception using message='INVALID_BALLOT_SELECTION_COUNT', errcode='P0001'; end if;
  if v_voter.id=any(p_target_round_player_ids) then raise exception using message='SELF_VOTE_NOT_ALLOWED', errcode='P0001'; end if;
  if exists (
    select 1 from unnest(p_target_round_player_ids) as targets(target_id)
    where not (targets.target_id=any(v_stage.candidate_round_player_ids))
       or not exists(select 1 from public.liar_round_players as rp where rp.id=targets.target_id and rp.round_id=v_round.id)
  ) then raise exception using message='INVALID_VOTE_CANDIDATE', errcode='P0001'; end if;

  -- The unique stage/voter key serializes concurrent first submissions. The
  -- conflict update also locks the existing ballot and advances its revision.
  insert into public.liar_ballots as lb(vote_stage_id,voter_round_player_id,revision,submitted_at,updated_at)
  values(v_stage.id,v_voter.id,1,now(),now())
  on conflict (vote_stage_id,voter_round_player_id) do update
    set revision=lb.revision+1,updated_at=now()
  returning lb.id,lb.revision into v_ballot_id,v_revision;
  delete from public.liar_votes as lv where lv.ballot_id=v_ballot_id;
  insert into public.liar_votes(ballot_id,target_round_player_id)
  select v_ballot_id,targets.target_id from unnest(p_target_round_player_ids) with ordinality as targets(target_id,position)
  order by targets.position;
  update public.liar_rooms as rm set last_activity_at=now(),expires_at=now()+interval '24 hours',version=rm.version+1
  where rm.id=v_room.id returning rm.version into v_room_version;
  return query select v_ballot_id,v_revision,v_room_version;
end;
$$;

create or replace function public.liar_get_my_ballot(p_player_key uuid)
returns jsonb language plpgsql security definer stable
set search_path = pg_catalog, public
as $$
declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype;
        v_round public.liar_rounds%rowtype; v_stage public.liar_vote_stages%rowtype; v_voter uuid; v_result jsonb;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select lp.* into v_player from public.liar_players as lp where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select rm.* into v_room from public.liar_rooms as rm where rm.id=v_player.room_id;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  select rd.* into v_round from public.liar_rounds as rd where rd.id=v_room.current_round_id;
  if not found or v_round.status not in ('VOTING','VOTE_RESULT') or v_round.current_vote_stage=0 then raise exception using message='VOTE_NOT_STARTED',errcode='P0001'; end if;
  select vs.* into v_stage from public.liar_vote_stages as vs where vs.round_id=v_round.id and vs.stage_no=v_round.current_vote_stage;
  if not found then raise exception using message='VOTE_NOT_STARTED',errcode='P0001'; end if;
  select rp.id into v_voter from public.liar_round_players as rp where rp.round_id=v_round.id and rp.player_id=v_player.id;
  if not found then raise exception using message='NOT_ROUND_PARTICIPANT',errcode='P0001'; end if;
  select jsonb_build_object('stage_id',v_stage.id,'revision',lb.revision,'target_round_player_ids',
    coalesce((select jsonb_agg(lv.target_round_player_id order by lv.created_at,lv.id) from public.liar_votes as lv where lv.ballot_id=lb.id),'[]'::jsonb))
  into v_result from public.liar_ballots as lb where lb.vote_stage_id=v_stage.id and lb.voter_round_player_id=v_voter;
  return coalesce(v_result,jsonb_build_object('stage_id',v_stage.id,'revision',0,'target_round_player_ids','[]'::jsonb));
end;
$$;

create or replace function public.liar_get_vote_snapshot(p_player_key uuid)
returns jsonb language plpgsql security definer stable
set search_path = pg_catalog, public
as $$
declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype;
        v_round public.liar_rounds%rowtype; v_stage public.liar_vote_stages%rowtype; v_voter uuid;
        v_submitted integer; v_required integer; v_candidates jsonb; v_tally jsonb;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select lp.* into v_player from public.liar_players as lp where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select rm.* into v_room from public.liar_rooms as rm where rm.id=v_player.room_id;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  select rd.* into v_round from public.liar_rounds as rd where rd.id=v_room.current_round_id;
  if not found or v_round.status not in ('VOTING','VOTE_RESULT') or v_round.current_vote_stage=0 then raise exception using message='VOTE_NOT_STARTED',errcode='P0001'; end if;
  select vs.* into v_stage from public.liar_vote_stages as vs where vs.round_id=v_round.id and vs.stage_no=v_round.current_vote_stage;
  if not found then raise exception using message='VOTE_NOT_STARTED',errcode='P0001'; end if;
  select rp.id into v_voter from public.liar_round_players as rp where rp.round_id=v_round.id and rp.player_id=v_player.id;
  select count(*) into v_required from public.liar_round_players as rp where rp.round_id=v_round.id;
  select count(*) into v_submitted from public.liar_ballots as lb
  join public.liar_round_players as rp on rp.id=lb.voter_round_player_id and rp.round_id=v_round.id
  where lb.vote_stage_id=v_stage.id;
  select coalesce(jsonb_agg(jsonb_build_object('round_player_id',rp.id,'nickname',rp.nickname_snapshot,
    'turn_order',rp.turn_order,'is_me',rp.id=v_voter) order by rp.turn_order),'[]'::jsonb)
  into v_candidates from public.liar_round_players as rp
  where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids);
  if v_stage.status='closed' then
    select coalesce(jsonb_agg(jsonb_build_object('round_player_id',t.id,'nickname',t.nickname_snapshot,'votes',t.vote_count)
      order by t.vote_count desc,t.turn_order),'[]'::jsonb) into v_tally
    from (select rp.id,rp.nickname_snapshot,rp.turn_order,count(lv.id)::integer as vote_count
          from public.liar_round_players as rp
          left join public.liar_votes as lv on lv.target_round_player_id=rp.id
            and exists(select 1 from public.liar_ballots as lb where lb.id=lv.ballot_id and lb.vote_stage_id=v_stage.id)
          where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids)
          group by rp.id,rp.nickname_snapshot,rp.turn_order) as t;
  else v_tally:=null;
  end if;
  return jsonb_build_object('stage_id',v_stage.id,'stage_no',v_stage.stage_no,'kind',v_stage.kind,'status',v_stage.status,
    'seats_to_fill',v_stage.seats_to_fill,'submitted_count',v_submitted,'required_count',v_required,
    'is_round_participant',v_voter is not null,
    'has_submitted',exists(select 1 from public.liar_ballots as lb where lb.vote_stage_id=v_stage.id and lb.voter_round_player_id=v_voter),
    'candidates',v_candidates,'tally',v_tally);
end;
$$;

create or replace function public.liar_close_vote(p_player_key uuid,p_expected_round_version bigint)
returns table(vote_stage_id uuid,round_version bigint,room_version bigint)
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype;
        v_round public.liar_rounds%rowtype; v_stage public.liar_vote_stages%rowtype;
        v_required integer; v_submitted integer; v_round_version bigint; v_room_version bigint;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select lp.* into v_player from public.liar_players as lp where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active' for update;
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select rm.* into v_room from public.liar_rooms as rm where rm.id=v_player.room_id for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
  select rd.* into v_round from public.liar_rounds as rd where rd.id=v_room.current_round_id for update;
  if not found or v_round.status<>'VOTING' then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
  if p_expected_round_version is null or v_round.version<>p_expected_round_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;
  if v_round.current_vote_stage=0 then raise exception using message='VOTE_NOT_STARTED',errcode='P0001'; end if;
  select vs.* into v_stage from public.liar_vote_stages as vs where vs.round_id=v_round.id and vs.stage_no=v_round.current_vote_stage for update;
  if not found then raise exception using message='VOTE_NOT_STARTED',errcode='P0001'; end if;
  if v_stage.status<>'open' then raise exception using message='VOTE_CLOSED',errcode='P0001'; end if;
  select count(*) into v_required from public.liar_round_players as rp where rp.round_id=v_round.id;
  select count(*) into v_submitted from public.liar_ballots as lb
  join public.liar_round_players as rp on rp.id=lb.voter_round_player_id and rp.round_id=v_round.id
  where lb.vote_stage_id=v_stage.id;
  if v_submitted<>v_required then raise exception using message='VOTE_NOT_ALL_SUBMITTED',errcode='P0001'; end if;
  update public.liar_vote_stages as vs set status='closed',closed_at=now() where vs.id=v_stage.id;
  update public.liar_rounds as rd set status='VOTE_RESULT',version=rd.version+1 where rd.id=v_round.id returning rd.version into v_round_version;
  update public.liar_rooms as rm set last_activity_at=now(),expires_at=now()+interval '24 hours',version=rm.version+1
  where rm.id=v_room.id returning rm.version into v_room_version;
  return query select v_stage.id,v_round_version,v_room_version;
end;
$$;

revoke all on function public.liar_start_vote(uuid,bigint) from public,anon,authenticated;
revoke all on function public.liar_submit_ballot(uuid,uuid[]) from public,anon,authenticated;
revoke all on function public.liar_get_my_ballot(uuid) from public,anon,authenticated;
revoke all on function public.liar_get_vote_snapshot(uuid) from public,anon,authenticated;
revoke all on function public.liar_close_vote(uuid,bigint) from public,anon,authenticated;
