-- Final result flow and read-only report.
-- Capture failure reveals the actual liar automatically only after a server-enforced 5 second delay.
create or replace function public.liar_auto_reveal_result_liars(
  p_player_key uuid,
  p_expected_round_version bigint
)
returns table(round_version bigint,room_version bigint)
language plpgsql security definer
set search_path = pg_catalog, public
as $$
declare
  v_auth uuid := auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_round_version bigint;
  v_room_version bigint;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select p.* into v_player
  from public.liar_players p
  where p.auth_user_id=v_auth
    and p.player_key=p_player_key
    and p.membership_status='active'
  for update;
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select r.* into v_room
  from public.liar_rooms r
  where r.id=v_player.room_id
  for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED',errcode='P0001';
  end if;
  if v_room.current_round_id is null then
    raise exception using message='INVALID_ROUND_STATE',errcode='P0001';
  end if;

  select r.* into v_round
  from public.liar_rounds r
  where r.id=v_room.current_round_id
    and r.room_id=v_room.id
  for update;
  if not found
     or v_round.status<>'ROUND_RESULT'
     or v_round.winner<>'liar'
     or v_round.capture_succeeded is not false
     or v_round.finished_at is null then
    raise exception using message='INVALID_ROUND_STATE',errcode='P0001';
  end if;

  -- Idempotent after another client has already completed the timed reveal.
  if v_round.liars_revealed_at is not null then
    return query select v_round.version,v_room.version;
    return;
  end if;

  -- This protects the reveal timing even if a client tampers with the countdown UI.
  if now() < v_round.finished_at + interval '5 seconds' then
    raise exception using message='RESULT_REVEAL_COUNTDOWN_ACTIVE',errcode='P0001';
  end if;

  if p_expected_round_version is null or v_round.version<>p_expected_round_version then
    raise exception using message='STALE_VERSION',errcode='P0001';
  end if;

  update public.liar_rounds r
  set liars_revealed_at=now(),version=r.version+1
  where r.id=v_round.id
  returning r.version into v_round_version;

  update public.liar_rooms r
  set last_activity_at=now(),expires_at=now()+interval '24 hours',version=r.version+1
  where r.id=v_room.id
  returning r.version into v_room_version;

  return query select v_round_version,v_room_version;
end;
$$;

-- Read-only final report assembled from the immutable round snapshot and history.
create or replace function public.liar_get_round_result(p_player_key uuid)
returns jsonb language plpgsql security definer stable
set search_path = pg_catalog, public
as $$
declare
  v_auth uuid := auth.uid(); v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype; v_round public.liar_rounds%rowtype;
  v_game public.liar_games%rowtype; v_stage public.liar_vote_stages%rowtype;
  v_stages jsonb := '[]'::jsonb; v_boundary record;
  v_candidates jsonb; v_locked jsonb; v_tally jsonb; v_ballots jsonb;
  v_winners jsonb; v_tied jsonb; v_final jsonb; v_liars jsonb; v_guesses jsonb;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select p.* into v_player from public.liar_players p
   where p.auth_user_id=v_auth and p.player_key=p_player_key and p.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select r.* into v_room from public.liar_rooms r where r.id=v_player.room_id;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED',errcode='P0001';
  end if;
  if v_room.current_round_id is null then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
  select r.* into v_round from public.liar_rounds r where r.id=v_room.current_round_id and r.room_id=v_room.id;
  if not found or v_round.status<>'ROUND_RESULT' or v_round.winner not in ('citizen','liar') or v_round.finished_at is null then
    raise exception using message='INVALID_ROUND_STATE',errcode='P0001';
  end if;
  select g.* into v_game from public.liar_games g where g.id=v_round.game_id and g.room_id=v_room.id;
  if not found then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
  if exists(select 1 from public.liar_vote_stages s where s.round_id=v_round.id and s.status<>'closed') then
    raise exception using message='INVALID_ROUND_STATE',errcode='P0001';
  end if;

  for v_stage in select s.* from public.liar_vote_stages s where s.round_id=v_round.id order by s.stage_no loop
    select * into v_boundary from public.liar_compute_vote_boundary(v_stage.id);
    select coalesce(jsonb_agg(jsonb_build_object('round_player_id',p.id,'nickname',p.nickname_snapshot) order by p.turn_order),'[]') into v_candidates
      from public.liar_round_players p where p.round_id=v_round.id and p.id=any(v_stage.candidate_round_player_ids);
    select coalesce(jsonb_agg(jsonb_build_object('round_player_id',p.id,'nickname',p.nickname_snapshot) order by p.turn_order),'[]') into v_locked
      from public.liar_round_players p where p.round_id=v_round.id and p.id=any(v_stage.locked_winner_round_player_ids);
    select coalesce(jsonb_agg(jsonb_build_object('round_player_id',x.id,'nickname',x.nickname_snapshot,'votes',x.votes) order by x.votes desc,x.turn_order),'[]') into v_tally
      from (select p.id,p.nickname_snapshot,p.turn_order,count(v.id)::integer votes from public.liar_round_players p
        left join public.liar_votes v on v.target_round_player_id=p.id and exists(select 1 from public.liar_ballots b where b.id=v.ballot_id and b.vote_stage_id=v_stage.id)
        where p.round_id=v_round.id and p.id=any(v_stage.candidate_round_player_ids) group by p.id) x;
    select coalesce(jsonb_agg(jsonb_build_object('voter_round_player_id',x.id,'voter',x.nickname_snapshot,'targets',x.targets) order by x.turn_order),'[]') into v_ballots
      from (select p.id,p.nickname_snapshot,p.turn_order,coalesce((select jsonb_agg(jsonb_build_object('round_player_id',t.id,'nickname',t.nickname_snapshot) order by t.turn_order)
        from public.liar_votes v join public.liar_round_players t on t.id=v.target_round_player_id where v.ballot_id=b.id),'[]') targets
        from public.liar_ballots b join public.liar_round_players p on p.id=b.voter_round_player_id where b.vote_stage_id=v_stage.id) x;
    select coalesce(jsonb_agg(jsonb_build_object('round_player_id',p.id,'nickname',p.nickname_snapshot) order by p.turn_order),'[]') into v_winners from public.liar_round_players p where p.id=any(v_boundary.stage_winner_ids);
    select coalesce(jsonb_agg(jsonb_build_object('round_player_id',p.id,'nickname',p.nickname_snapshot) order by p.turn_order),'[]') into v_tied from public.liar_round_players p where p.id=any(v_boundary.boundary_candidate_ids);
    v_stages := v_stages || jsonb_build_array(jsonb_build_object('stage_id',v_stage.id,'stage_no',v_stage.stage_no,'kind',v_stage.kind,'seats_to_fill',v_stage.seats_to_fill,'status',v_stage.status,'candidates',v_candidates,'locked_winners',v_locked,'tally',v_tally,'ballot_details',v_ballots,'runoff_required',v_boundary.runoff_required,'stage_winners',v_winners,'boundary_candidates',v_tied,'remaining_seats',v_boundary.remaining_seats));
  end loop;
  select coalesce(jsonb_agg(jsonb_build_object('round_player_id',p.id,'nickname',p.nickname_snapshot) order by p.turn_order),'[]') into v_final from public.liar_round_players p where p.round_id=v_round.id and p.is_final_suspect;
  if v_round.liars_revealed_at is not null then
    select coalesce(jsonb_agg(jsonb_build_object('round_player_id',p.id,'nickname',p.nickname_snapshot) order by p.turn_order),'[]') into v_liars from public.liar_round_players p where p.round_id=v_round.id and p.role='liar';
  else v_liars := '[]'; end if;
  if v_round.capture_succeeded then
    select coalesce(jsonb_agg(jsonb_build_object('attempt_no',g.attempt_no,'guesser',p.nickname_snapshot,'guesser_round_player_id',p.id,'guess_text',g.guess_text,'is_correct',g.is_correct) order by g.attempt_no),'[]') into v_guesses
      from public.liar_guesses g join public.liar_round_players p on p.id=g.guesser_round_player_id where g.round_id=v_round.id;
  else v_guesses := '[]'; end if;
  return jsonb_build_object('round_id',v_round.id,'round_no',v_round.round_no,'game_no',v_game.game_no,'winner',v_round.winner,'capture_succeeded',v_round.capture_succeeded,
    'result_reason',case when not v_round.capture_succeeded then 'CAPTURE_FAILED' when v_round.winner='liar' then 'GUESS_CORRECT' else 'GUESSES_EXHAUSTED' end,
    'category',v_round.category_snapshot,'word',v_round.word_snapshot,'liar_count',v_game.liar_count,'guess_limit',v_game.guess_limit,'started_at',v_round.started_at,'finished_at',v_round.finished_at,'server_now',now(),
    'liars_revealed',v_round.liars_revealed_at is not null,'actual_liars',v_liars,'final_suspects',v_final,'vote_stages',v_stages,'guesses',v_guesses);
end;
$$;

-- The former host-only immediate result reveal is intentionally not client-callable.
revoke all on function public.liar_reveal_result_liars(uuid,bigint) from public,anon,authenticated;
revoke all on function public.liar_auto_reveal_result_liars(uuid,bigint) from public,anon,authenticated;
revoke all on function public.liar_get_round_result(uuid) from public,anon,authenticated;
