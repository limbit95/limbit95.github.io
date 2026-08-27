-- Liar Game v1.2: deterministic join order + additional fun stats.

create or replace function public.liar_get_room_snapshot(p_player_key uuid)
returns jsonb
language plpgsql
stable security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_base jsonb;
  v_room_id uuid;
  v_game_id uuid;
  v_round_id uuid;
  v_game public.liar_games%rowtype;
  v_round public.liar_rounds%rowtype;
begin
  v_base:=public.liar_get_room_snapshot_phase3_base(p_player_key);
  v_room_id:=nullif(v_base#>>'{room,id}','')::uuid;
  v_game_id:=nullif(v_base#>>'{game,id}','')::uuid;
  v_round_id:=nullif(v_base#>>'{round,id}','')::uuid;

  if v_room_id is not null then
    v_base:=jsonb_set(v_base,'{players}',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',p.id,'nickname',p.nickname,'ready',p.ready,'membership_status',p.membership_status,'joined_at',p.joined_at
      ) order by p.joined_at,p.id)
      from public.liar_players p
      where p.room_id=v_room_id and p.membership_status='active'
    ),'[]'::jsonb),true);
  end if;

  if v_game_id is not null then
    select g.* into v_game from public.liar_games g where g.id=v_game_id;
    v_base:=jsonb_set(v_base,'{game}',coalesce(v_base->'game','{}'::jsonb)||jsonb_build_object(
      'speaking_time_limit',v_game.speaking_time_limit,
      'discussion_time_limit',v_game.discussion_time_limit,
      'liars_know_each_other',v_game.liars_know_each_other,
      'word_source_mode',v_game.word_source_mode,
      'custom_word_pack_name',v_game.custom_word_pack_name_snapshot,
      'custom_word_count',coalesce(cardinality(v_game.custom_words_snapshot),0)
    ),true);
  end if;

  if v_round_id is not null then
    select r.* into v_round from public.liar_rounds r where r.id=v_round_id;
    v_base:=jsonb_set(v_base,'{round}',coalesce(v_base->'round','{}'::jsonb)||jsonb_build_object(
      'speaking_time_limit_snapshot',v_round.speaking_time_limit_snapshot,
      'discussion_time_limit_snapshot',v_round.discussion_time_limit_snapshot,
      'liars_know_each_other_snapshot',v_round.liars_know_each_other_snapshot,
      'speaking_turn_started_at',v_round.speaking_turn_started_at,
      'discussion_started_at',v_round.discussion_started_at,
      'word_source_snapshot',v_round.word_source_snapshot,
      'server_now',now()
    ),true);
  end if;

  return v_base;
end
$function$;

create or replace function public.liar_get_game_stats_v12(p_player_key uuid)
returns jsonb
language plpgsql
stable security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_base jsonb;
  v_result jsonb;
  v_game_id uuid;
  v_most_suspected jsonb;
  v_liar_hunter jsonb;
  v_liar_regular jsonb;
begin
  v_base:=public.liar_get_game_stats(p_player_key);
  v_game_id:=nullif(v_base->>'game_id','')::uuid;
  if v_game_id is null then return v_base; end if;

  with round_vote_totals as (
    select rd.id as round_id,rd.round_no,target.player_id,
           (array_agg(target.nickname_snapshot order by target.nickname_snapshot))[1] as nickname,
           count(v.id)::integer as round_votes
    from public.liar_votes v
    join public.liar_ballots b on b.id=v.ballot_id
    join public.liar_vote_stages vs on vs.id=b.vote_stage_id and vs.status='closed'
    join public.liar_rounds rd on rd.id=vs.round_id
    join public.liar_round_players target on target.id=v.target_round_player_id and target.round_id=rd.id
    where rd.game_id=v_game_id and rd.finished_at is not null and rd.winner in ('citizen','liar')
    group by rd.id,rd.round_no,target.player_id
  ), vote_totals as (
    select r.player_id,(array_agg(r.nickname order by r.round_no desc))[1] as nickname,
           sum(r.round_votes)::integer as total_votes
    from round_vote_totals r group by r.player_id
  ), peak as (select max(total_votes) as max_count from vote_totals)
  select case when coalesce(peak.max_count,0)>0 then jsonb_build_object(
      'count',peak.max_count,'players',coalesce((
        select jsonb_agg(jsonb_build_object('player_id',v.player_id,'nickname',v.nickname) order by v.nickname)
        from vote_totals v where v.total_votes=peak.max_count
      ),'[]'::jsonb)
    ) else null end
  into v_most_suspected from peak;

  with correct_vote_totals as (
    select voter.player_id,(array_agg(voter.nickname_snapshot order by rd.round_no desc))[1] as nickname,
           count(v.id)::integer as correct_votes
    from public.liar_votes v
    join public.liar_ballots b on b.id=v.ballot_id
    join public.liar_vote_stages vs on vs.id=b.vote_stage_id and vs.status='closed'
    join public.liar_rounds rd on rd.id=vs.round_id
    join public.liar_round_players voter on voter.id=b.voter_round_player_id and voter.round_id=rd.id
    join public.liar_round_players target on target.id=v.target_round_player_id and target.round_id=rd.id
    where rd.game_id=v_game_id and rd.finished_at is not null and rd.winner in ('citizen','liar') and target.role='liar'
    group by voter.player_id
  ), peak as (select max(correct_votes) as max_count from correct_vote_totals)
  select case when coalesce(peak.max_count,0)>0 then jsonb_build_object(
      'count',peak.max_count,'players',coalesce((
        select jsonb_agg(jsonb_build_object('player_id',v.player_id,'nickname',v.nickname) order by v.nickname)
        from correct_vote_totals v where v.correct_votes=peak.max_count
      ),'[]'::jsonb)
    ) else null end
  into v_liar_hunter from peak;

  with liar_totals as (
    select rp.player_id,(array_agg(rp.nickname_snapshot order by rd.round_no desc))[1] as nickname,
           count(*)::integer as role_count
    from public.liar_round_players rp
    join public.liar_rounds rd on rd.id=rp.round_id
    where rd.game_id=v_game_id and rd.finished_at is not null and rd.winner in ('citizen','liar')
      and rd.liars_revealed_at is not null and rp.role='liar'
    group by rp.player_id
  ), peak as (select max(role_count) as max_count from liar_totals)
  select case when coalesce(peak.max_count,0)>0 then jsonb_build_object(
      'count',peak.max_count,'players',coalesce((
        select jsonb_agg(jsonb_build_object('player_id',v.player_id,'nickname',v.nickname) order by v.nickname)
        from liar_totals v where v.role_count=peak.max_count
      ),'[]'::jsonb)
    ) else null end
  into v_liar_regular from peak;

  v_result:=jsonb_set(v_base,'{most_suspected}',coalesce(v_most_suspected,'null'::jsonb),true);
  v_result:=jsonb_set(v_result,'{liar_hunter}',coalesce(v_liar_hunter,'null'::jsonb),true);
  v_result:=jsonb_set(v_result,'{liar_regular}',coalesce(v_liar_regular,'null'::jsonb),true);
  return v_result;
end
$function$;
