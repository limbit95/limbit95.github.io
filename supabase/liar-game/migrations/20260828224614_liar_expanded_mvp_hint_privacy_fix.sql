-- Liar Game v1.3 security follow-up:
-- hint-related MVPs must not expose purchases from a round whose hidden role
-- has not been revealed yet. Aggregate only finished + identity-revealed rounds.

do $do$
declare
  v_body text;
  v_fixed text;
  v_old_spend text := '    where hp.game_id=v_game_id group by hp.player_id';
  v_new_spend text := '    where hp.game_id=v_game_id
      and rd.finished_at is not null
      and rd.winner in (''citizen'',''liar'')
      and rd.liars_revealed_at is not null
    group by hp.player_id';
  v_old_saver text := '  with saver_totals as (
    select w.player_id,w.earned::integer as earned_points,w.spent::integer as spent_points,w.balance::integer as balance_points,floor((w.balance::numeric*100)/nullif(w.earned,0))::integer as hold_percent,
           (select rp.nickname_snapshot from public.liar_round_players rp join public.liar_rounds rd on rd.id=rp.round_id where rd.game_id=v_game_id and rp.player_id=w.player_id order by rd.round_no desc,rp.created_at desc limit 1) as nickname
    from public.liar_hint_wallets w where w.game_id=v_game_id and w.earned>0
  ), peak as (select max(s.hold_percent) as max_count from saver_totals s)';
  v_new_saver text := '  with earned_totals as (
    select e.player_id,sum(e.delta)::integer as earned_points
    from public.liar_hint_coin_events e
    join public.liar_rounds rd on rd.id=e.round_id
    where e.game_id=v_game_id
      and rd.finished_at is not null
      and rd.winner in (''citizen'',''liar'')
      and rd.liars_revealed_at is not null
    group by e.player_id
  ), spent_totals as (
    select hp.player_id,sum(hp.cost)::integer as spent_points
    from public.liar_hint_purchases hp
    join public.liar_rounds rd on rd.id=hp.round_id
    where hp.game_id=v_game_id
      and rd.finished_at is not null
      and rd.winner in (''citizen'',''liar'')
      and rd.liars_revealed_at is not null
    group by hp.player_id
  ), saver_totals as (
    select e.player_id,e.earned_points,coalesce(s.spent_points,0)::integer as spent_points,
           greatest(e.earned_points-coalesce(s.spent_points,0),0)::integer as balance_points,
           floor((greatest(e.earned_points-coalesce(s.spent_points,0),0)::numeric*100)/nullif(e.earned_points,0))::integer as hold_percent,
           (select rp.nickname_snapshot from public.liar_round_players rp join public.liar_rounds rd on rd.id=rp.round_id where rd.game_id=v_game_id and rp.player_id=e.player_id order by rd.round_no desc,rp.created_at desc limit 1) as nickname
    from earned_totals e
    left join spent_totals s on s.player_id=e.player_id
    where e.earned_points>0
  ), peak as (select max(s.hold_percent) as max_count from saver_totals s)';
begin
  select p.prosrc into v_body
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public'
    and p.proname='liar_get_game_stats_v13'
    and pg_catalog.pg_get_function_identity_arguments(p.oid)='p_player_key uuid';

  if v_body is null then
    raise exception 'liar_get_game_stats_v13(uuid) not found';
  end if;

  if position('and rd.liars_revealed_at is not null' in v_body)>0
     and position('with earned_totals as (' in v_body)>0 then
    return;
  end if;

  v_fixed:=replace(v_body,v_old_spend,v_new_spend);
  if v_fixed=v_body then
    raise exception 'hint spender privacy patch target not found';
  end if;

  v_body:=v_fixed;
  v_fixed:=replace(v_body,v_old_saver,v_new_saver);
  if v_fixed=v_body then
    raise exception 'hint saver privacy patch target not found';
  end if;

  execute format(
    'create or replace function public.liar_get_game_stats_v13(p_player_key uuid) returns jsonb language plpgsql stable security definer set search_path to pg_catalog,public as $fn$%s$fn$',
    v_fixed
  );
end
$do$;

revoke all on function public.liar_get_game_stats_v13(uuid) from public, anon;
grant execute on function public.liar_get_game_stats_v13(uuid) to authenticated;
