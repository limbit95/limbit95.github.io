-- Liar Game v1.3: expand game-wide MVP stats without changing the existing v1.2 metrics.

create or replace function public.liar_get_game_stats_v13(p_player_key uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_base jsonb;
  v_result jsonb;
  v_game_id uuid;
  v_rival_pair jsonb;
  v_swing_leader jsonb;
  v_focus_pair jsonb;
  v_stubborn_leader jsonb;
  v_crowd_follower jsonb;
  v_hint_spender jsonb;
  v_hint_saver jsonb;
  v_drawing_storm jsonb;
  v_drawing_miss_leader jsonb;
begin
  v_base:=public.liar_get_game_stats_v12(p_player_key);
  v_game_id:=nullif(v_base->>'game_id','')::uuid;
  if v_game_id is null then return v_base; end if;

  with directed as (
    select voter.player_id as voter_id,target.player_id as target_id,count(v.id)::integer as vote_count
    from public.liar_votes v
    join public.liar_ballots b on b.id=v.ballot_id
    join public.liar_vote_stages vs on vs.id=b.vote_stage_id and vs.status='closed'
    join public.liar_rounds rd on rd.id=vs.round_id
    join public.liar_round_players voter on voter.id=b.voter_round_player_id and voter.round_id=rd.id
    join public.liar_round_players target on target.id=v.target_round_player_id and target.round_id=rd.id
    where rd.game_id=v_game_id and rd.finished_at is not null and rd.winner in ('citizen','liar') and voter.player_id is not null and target.player_id is not null and voter.player_id<>target.player_id
    group by voter.player_id,target.player_id
  ), pairs as (
    select case when voter_id::text<target_id::text then voter_id else target_id end as player_a_id,
           case when voter_id::text<target_id::text then target_id else voter_id end as player_b_id,
           sum(vote_count)::integer as mutual_votes
    from directed
    group by case when voter_id::text<target_id::text then voter_id else target_id end,case when voter_id::text<target_id::text then target_id else voter_id end
  ), best as (
    select p.* from pairs p where p.mutual_votes>0 order by p.mutual_votes desc,p.player_a_id::text,p.player_b_id::text limit 1
  )
  select case when exists(select 1 from best) then (
    select jsonb_build_object('count',b.mutual_votes,'players',jsonb_build_array(
      jsonb_build_object('player_id',b.player_a_id,'nickname',(select rp.nickname_snapshot from public.liar_round_players rp join public.liar_rounds rd on rd.id=rp.round_id where rd.game_id=v_game_id and rp.player_id=b.player_a_id order by rd.round_no desc,rp.created_at desc limit 1)),
      jsonb_build_object('player_id',b.player_b_id,'nickname',(select rp.nickname_snapshot from public.liar_round_players rp join public.liar_rounds rd on rd.id=rp.round_id where rd.game_id=v_game_id and rp.player_id=b.player_b_id order by rd.round_no desc,rp.created_at desc limit 1))
    )) from best b
  ) else null end into v_rival_pair;

  with ballot_sets as (
    select rd.id as round_id,rd.round_no,vs.stage_no,voter.player_id,(array_agg(voter.nickname_snapshot order by voter.nickname_snapshot))[1] as nickname,array_agg(v.target_round_player_id order by v.target_round_player_id::text) as target_ids
    from public.liar_ballots b
    join public.liar_vote_stages vs on vs.id=b.vote_stage_id and vs.status='closed'
    join public.liar_rounds rd on rd.id=vs.round_id
    join public.liar_round_players voter on voter.id=b.voter_round_player_id and voter.round_id=rd.id
    join public.liar_votes v on v.ballot_id=b.id
    where rd.game_id=v_game_id and rd.finished_at is not null and rd.winner in ('citizen','liar') and voter.player_id is not null
    group by rd.id,rd.round_no,vs.stage_no,voter.player_id
  ), transitions as (
    select bs.*,lag(bs.target_ids) over(partition by bs.round_id,bs.player_id order by bs.stage_no) as previous_targets from ballot_sets bs
  ), swing_totals as (
    select t.player_id,(array_agg(t.nickname order by t.round_no desc,t.stage_no desc))[1] as nickname,count(*) filter(where t.previous_targets is not null and not (t.target_ids && t.previous_targets))::integer as swing_count
    from transitions t group by t.player_id
  ), peak as (select max(s.swing_count) as max_count from swing_totals s)
  select case when coalesce(p.max_count,0)>0 then jsonb_build_object('count',p.max_count,'players',coalesce((select jsonb_agg(jsonb_build_object('player_id',s.player_id,'nickname',s.nickname) order by s.nickname) from swing_totals s where s.swing_count=p.max_count),'[]'::jsonb)) else null end into v_swing_leader from peak p;

  with ballot_sets as (
    select rd.id as round_id,rd.round_no,vs.stage_no,voter.player_id,(array_agg(voter.nickname_snapshot order by voter.nickname_snapshot))[1] as nickname,array_agg(v.target_round_player_id order by v.target_round_player_id::text) as target_ids
    from public.liar_ballots b
    join public.liar_vote_stages vs on vs.id=b.vote_stage_id and vs.status='closed'
    join public.liar_rounds rd on rd.id=vs.round_id
    join public.liar_round_players voter on voter.id=b.voter_round_player_id and voter.round_id=rd.id
    join public.liar_votes v on v.ballot_id=b.id
    where rd.game_id=v_game_id and rd.finished_at is not null and rd.winner in ('citizen','liar') and voter.player_id is not null
    group by rd.id,rd.round_no,vs.stage_no,voter.player_id
  ), transitions as (
    select bs.*,lag(bs.target_ids) over(partition by bs.round_id,bs.player_id order by bs.stage_no) as previous_targets from ballot_sets bs
  ), stubborn_totals as (
    select t.player_id,(array_agg(t.nickname order by t.round_no desc,t.stage_no desc))[1] as nickname,count(*) filter(where t.previous_targets is not null and (t.target_ids && t.previous_targets))::integer as stubborn_count
    from transitions t group by t.player_id
  ), peak as (select max(s.stubborn_count) as max_count from stubborn_totals s)
  select case when coalesce(p.max_count,0)>0 then jsonb_build_object('count',p.max_count,'players',coalesce((select jsonb_agg(jsonb_build_object('player_id',s.player_id,'nickname',s.nickname) order by s.nickname) from stubborn_totals s where s.stubborn_count=p.max_count),'[]'::jsonb)) else null end into v_stubborn_leader from peak p;

  with directed as (
    select voter.player_id as voter_id,target.player_id as target_id,count(v.id)::integer as vote_count
    from public.liar_votes v
    join public.liar_ballots b on b.id=v.ballot_id
    join public.liar_vote_stages vs on vs.id=b.vote_stage_id and vs.status='closed'
    join public.liar_rounds rd on rd.id=vs.round_id
    join public.liar_round_players voter on voter.id=b.voter_round_player_id and voter.round_id=rd.id
    join public.liar_round_players target on target.id=v.target_round_player_id and target.round_id=rd.id
    where rd.game_id=v_game_id and rd.finished_at is not null and rd.winner in ('citizen','liar') and voter.player_id is not null and target.player_id is not null and voter.player_id<>target.player_id
    group by voter.player_id,target.player_id
  ), best as (select d.* from directed d where d.vote_count>0 order by d.vote_count desc,d.voter_id::text,d.target_id::text limit 1)
  select case when exists(select 1 from best) then (
    select jsonb_build_object('count',b.vote_count,'players',jsonb_build_array(
      jsonb_build_object('player_id',b.voter_id,'nickname',(select rp.nickname_snapshot from public.liar_round_players rp join public.liar_rounds rd on rd.id=rp.round_id where rd.game_id=v_game_id and rp.player_id=b.voter_id order by rd.round_no desc,rp.created_at desc limit 1)),
      jsonb_build_object('player_id',b.target_id,'nickname',(select rp.nickname_snapshot from public.liar_round_players rp join public.liar_rounds rd on rd.id=rp.round_id where rd.game_id=v_game_id and rp.player_id=b.target_id order by rd.round_no desc,rp.created_at desc limit 1))
    )) from best b
  ) else null end into v_focus_pair;

  with crowd_totals as (
    select voter.player_id,(array_agg(voter.nickname_snapshot order by rd.round_no desc))[1] as nickname,count(v.id)::integer as aligned_votes
    from public.liar_votes v
    join public.liar_ballots b on b.id=v.ballot_id
    join public.liar_vote_stages vs on vs.id=b.vote_stage_id and vs.status='closed'
    join public.liar_rounds rd on rd.id=vs.round_id
    join public.liar_round_players voter on voter.id=b.voter_round_player_id and voter.round_id=rd.id
    join public.liar_round_players target on target.id=v.target_round_player_id and target.round_id=rd.id
    where rd.game_id=v_game_id and rd.finished_at is not null and rd.winner in ('citizen','liar') and voter.player_id is not null and target.is_final_suspect is true
    group by voter.player_id
  ), peak as (select max(c.aligned_votes) as max_count from crowd_totals c)
  select case when coalesce(p.max_count,0)>0 then jsonb_build_object('count',p.max_count,'players',coalesce((select jsonb_agg(jsonb_build_object('player_id',c.player_id,'nickname',c.nickname) order by c.nickname) from crowd_totals c where c.aligned_votes=p.max_count),'[]'::jsonb)) else null end into v_crowd_follower from peak p;

  with spend_totals as (
    select hp.player_id,(array_agg(rp.nickname_snapshot order by rd.round_no desc,hp.created_at desc))[1] as nickname,sum(hp.cost)::integer as spent_points
    from public.liar_hint_purchases hp
    join public.liar_round_players rp on rp.id=hp.round_player_id
    join public.liar_rounds rd on rd.id=hp.round_id and rd.id=rp.round_id
    where hp.game_id=v_game_id group by hp.player_id
  ), peak as (select max(s.spent_points) as max_count from spend_totals s)
  select case when coalesce(p.max_count,0)>0 then jsonb_build_object('count',p.max_count,'players',coalesce((select jsonb_agg(jsonb_build_object('player_id',s.player_id,'nickname',s.nickname) order by s.nickname) from spend_totals s where s.spent_points=p.max_count),'[]'::jsonb)) else null end into v_hint_spender from peak p;

  with saver_totals as (
    select w.player_id,w.earned::integer as earned_points,w.spent::integer as spent_points,w.balance::integer as balance_points,floor((w.balance::numeric*100)/nullif(w.earned,0))::integer as hold_percent,
           (select rp.nickname_snapshot from public.liar_round_players rp join public.liar_rounds rd on rd.id=rp.round_id where rd.game_id=v_game_id and rp.player_id=w.player_id order by rd.round_no desc,rp.created_at desc limit 1) as nickname
    from public.liar_hint_wallets w where w.game_id=v_game_id and w.earned>0
  ), peak as (select max(s.hold_percent) as max_count from saver_totals s)
  select case when p.max_count is not null then jsonb_build_object('count',p.max_count,'players',coalesce((select jsonb_agg(jsonb_build_object('player_id',s.player_id,'nickname',s.nickname,'earned',s.earned_points,'spent',s.spent_points,'balance',s.balance_points) order by s.nickname) from saver_totals s where s.hold_percent=p.max_count),'[]'::jsonb)) else null end into v_hint_saver from peak p;

  with stroke_totals as (
    select rp.player_id,(array_agg(rp.nickname_snapshot order by rd.round_no desc))[1] as nickname,count(s.id)::integer as stroke_count
    from public.liar_drawing_strokes s
    join public.liar_round_players rp on rp.id=s.round_player_id and rp.round_id=s.round_id
    join public.liar_rounds rd on rd.id=s.round_id
    where rd.game_id=v_game_id and rd.game_mode_snapshot='drawing_spy' and rd.finished_at is not null and rd.winner in ('citizen','liar') and rp.player_id is not null
    group by rp.player_id
  ), peak as (select max(s.stroke_count) as max_count from stroke_totals s)
  select case when coalesce(p.max_count,0)>0 then jsonb_build_object('count',p.max_count,'players',coalesce((select jsonb_agg(jsonb_build_object('player_id',s.player_id,'nickname',s.nickname) order by s.nickname) from stroke_totals s where s.stroke_count=p.max_count),'[]'::jsonb)) else null end into v_drawing_storm from peak p;

  with miss_totals as (
    select dm.player_id,(array_agg(rp.nickname_snapshot order by rd.round_no desc,dm.created_at desc))[1] as nickname,count(dm.id)::integer as miss_count
    from public.liar_drawing_misses dm
    join public.liar_round_players rp on rp.id=dm.round_player_id and rp.round_id=dm.round_id
    join public.liar_rounds rd on rd.id=dm.round_id
    where dm.game_id=v_game_id and rd.game_mode_snapshot='drawing_spy' and rd.finished_at is not null and rd.winner in ('citizen','liar')
    group by dm.player_id
  ), peak as (select max(m.miss_count) as max_count from miss_totals m)
  select case when coalesce(p.max_count,0)>0 then jsonb_build_object('count',p.max_count,'players',coalesce((select jsonb_agg(jsonb_build_object('player_id',m.player_id,'nickname',m.nickname) order by m.nickname) from miss_totals m where m.miss_count=p.max_count),'[]'::jsonb)) else null end into v_drawing_miss_leader from peak p;

  v_result:=jsonb_set(v_base,'{rival_pair}',coalesce(v_rival_pair,'null'::jsonb),true);
  v_result:=jsonb_set(v_result,'{swing_leader}',coalesce(v_swing_leader,'null'::jsonb),true);
  v_result:=jsonb_set(v_result,'{focus_pair}',coalesce(v_focus_pair,'null'::jsonb),true);
  v_result:=jsonb_set(v_result,'{stubborn_leader}',coalesce(v_stubborn_leader,'null'::jsonb),true);
  v_result:=jsonb_set(v_result,'{crowd_follower}',coalesce(v_crowd_follower,'null'::jsonb),true);
  v_result:=jsonb_set(v_result,'{hint_spender}',coalesce(v_hint_spender,'null'::jsonb),true);
  v_result:=jsonb_set(v_result,'{hint_saver}',coalesce(v_hint_saver,'null'::jsonb),true);
  v_result:=jsonb_set(v_result,'{drawing_storm}',coalesce(v_drawing_storm,'null'::jsonb),true);
  v_result:=jsonb_set(v_result,'{drawing_miss_leader}',coalesce(v_drawing_miss_leader,'null'::jsonb),true);
  return v_result;
end;
$function$;

revoke all on function public.liar_get_game_stats_v13(uuid) from public, anon;
grant execute on function public.liar_get_game_stats_v13(uuid) to authenticated;
