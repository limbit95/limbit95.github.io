-- Liar Game v1.2: weighted random hidden roles + explicit game-wide suspicion aggregation

create or replace function public.liar_rebalance_round_roles_v12()
returns trigger
language plpgsql
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_round_id uuid;
  v_round_ids integer;
  v_game_id uuid;
  v_round_no integer;
  v_liar_count integer;
begin
  select (array_agg(distinct round_id))[1],count(distinct round_id)::integer
  into v_round_id,v_round_ids
  from new_rows;

  if v_round_id is null or v_round_ids<>1 then return null; end if;

  select r.game_id,r.round_no,g.liar_count
  into v_game_id,v_round_no,v_liar_count
  from public.liar_rounds r
  join public.liar_games g on g.id=r.game_id
  where r.id=v_round_id;

  if v_game_id is null or coalesce(v_liar_count,0)<1 then return null; end if;

  with recent as (
    select cur.id as round_player_id,
           cur.player_id,
           count(pr.id)::integer as played_last_three,
           count(pr.id) filter(where prev.role='liar')::integer as liar_last_three
    from public.liar_round_players cur
    left join public.liar_round_players prev on prev.player_id=cur.player_id
    left join public.liar_rounds pr on pr.id=prev.round_id
      and pr.game_id=v_game_id
      and pr.round_no between v_round_no-3 and v_round_no-1
    where cur.round_id=v_round_id
    group by cur.id,cur.player_id
  ), weighted as (
    select r.*,
           case when r.played_last_three=3 and r.liar_last_three=3
                then 0.35::double precision
                else 1.0::double precision
           end as role_weight
    from recent r
  ), ranked as (
    select w.*,
           row_number() over(
             order by (-ln(greatest(random(),0.000000001))/w.role_weight),random()
           ) as liar_order
    from weighted w
  ), assignments as (
    select ranked.round_player_id,
           case when ranked.liar_order<=v_liar_count then 'liar'::text else 'citizen'::text end as role,
           coalesce(wallet.balance,0)::smallint as hint_balance
    from ranked
    join public.liar_round_players cur on cur.id=ranked.round_player_id
    left join public.liar_hint_wallets wallet on wallet.game_id=v_game_id and wallet.player_id=cur.player_id
  )
  update public.liar_round_players rp
  set role=a.role,
      hint_coins_at_start=a.hint_balance,
      hint_category_forced_hidden=(a.role='liar' and a.hint_balance>=3)
  from assignments a
  where rp.id=a.round_player_id;

  return null;
end;
$function$;

revoke all on function public.liar_rebalance_round_roles_v12() from public, anon, authenticated;

drop trigger if exists liar_rebalance_round_roles_v12 on public.liar_round_players;
create trigger liar_rebalance_round_roles_v12
after insert on public.liar_round_players
referencing new table as new_rows
for each statement execute function public.liar_rebalance_round_roles_v12();

create or replace function public.liar_get_game_stats_v12(p_player_key uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_base jsonb;
  v_game_id uuid;
  v_most_suspected jsonb;
begin
  v_base:=public.liar_get_game_stats(p_player_key);
  v_game_id:=nullif(v_base->>'game_id','')::uuid;

  if v_game_id is null then return v_base; end if;

  -- First aggregate every closed vote within each finished round, then sum
  -- those round totals across the entire current game.
  with round_vote_totals as (
    select rd.id as round_id,
           rd.round_no,
           target.player_id,
           (array_agg(target.nickname_snapshot order by target.nickname_snapshot))[1] as nickname,
           count(v.id)::integer as round_votes
    from public.liar_votes v
    join public.liar_ballots b on b.id=v.ballot_id
    join public.liar_vote_stages vs on vs.id=b.vote_stage_id and vs.status='closed'
    join public.liar_rounds rd on rd.id=vs.round_id
    join public.liar_round_players target on target.id=v.target_round_player_id and target.round_id=rd.id
    where rd.game_id=v_game_id
      and rd.finished_at is not null
      and rd.winner in ('citizen','liar')
    group by rd.id,rd.round_no,target.player_id
  ), vote_totals as (
    select r.player_id,
           (array_agg(r.nickname order by r.round_no desc))[1] as nickname,
           sum(r.round_votes)::integer as total_votes
    from round_vote_totals r
    group by r.player_id
  ), peak as (
    select max(total_votes) as max_count from vote_totals
  )
  select case when coalesce(peak.max_count,0)>0 then jsonb_build_object(
      'count',peak.max_count,
      'players',coalesce((
        select jsonb_agg(jsonb_build_object('player_id',v.player_id,'nickname',v.nickname) order by v.nickname)
        from vote_totals v where v.total_votes=peak.max_count
      ),'[]'::jsonb)
    ) else null end
  into v_most_suspected
  from peak;

  return jsonb_set(v_base,'{most_suspected}',coalesce(v_most_suspected,'null'::jsonb),true);
end;
$function$;

revoke all on function public.liar_get_game_stats_v12(uuid) from public, anon;
grant execute on function public.liar_get_game_stats_v12(uuid) to authenticated;
