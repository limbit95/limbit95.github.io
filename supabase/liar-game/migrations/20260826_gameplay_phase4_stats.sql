-- Liar Game / Drawing Spy phase 4.
-- Read-only Game-level score, round history, and fun statistics derived from
-- existing authoritative round/vote/guess history. No duplicate stats table.

create or replace function public.liar_get_game_stats(p_player_key uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_game public.liar_games%rowtype;
  v_citizen_wins integer:=0;
  v_liar_wins integer:=0;
  v_round_history jsonb:='[]'::jsonb;
  v_most_suspected jsonb;
  v_survival_leader jsonb;
  v_comeback_leader jsonb;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select p.* into v_player
  from public.liar_players p
  where p.auth_user_id=v_auth
    and p.player_key=p_player_key
    and p.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select r.* into v_room
  from public.liar_rooms r
  where r.id=v_player.room_id;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED',errcode='P0001';
  end if;

  select g.* into v_game
  from public.liar_games g
  where g.id=v_room.current_game_id and g.room_id=v_room.id;
  if not found then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;

  select
    count(*) filter(where r.winner='citizen')::integer,
    count(*) filter(where r.winner='liar')::integer
  into v_citizen_wins,v_liar_wins
  from public.liar_rounds r
  where r.game_id=v_game.id
    and r.finished_at is not null
    and r.winner in ('citizen','liar');

  select coalesce(jsonb_agg(jsonb_build_object(
    'round_id',h.id,
    'round_no',h.round_no,
    'winner',h.winner,
    'result_reason',h.result_reason,
    'category',h.category_snapshot,
    'word',h.word_snapshot,
    'game_mode',h.game_mode_snapshot,
    'finished_at',h.finished_at
  ) order by h.round_no),'[]'::jsonb)
  into v_round_history
  from (
    select r.id,r.round_no,r.winner,r.category_snapshot,r.word_snapshot,
      r.game_mode_snapshot,r.finished_at,
      case
        when r.capture_succeeded is false then 'CAPTURE_FAILED'
        when r.winner='liar' then 'GUESS_CORRECT'
        else 'GUESSES_EXHAUSTED'
      end as result_reason
    from public.liar_rounds r
    where r.game_id=v_game.id
      and r.finished_at is not null
      and r.winner in ('citizen','liar')
  ) h;

  with vote_totals as (
    select target.player_id,
      (array_agg(target.nickname_snapshot order by rd.round_no desc))[1] as nickname,
      count(v.id)::integer as total_votes
    from public.liar_votes v
    join public.liar_ballots b on b.id=v.ballot_id
    join public.liar_vote_stages vs on vs.id=b.vote_stage_id and vs.status='closed'
    join public.liar_rounds rd on rd.id=vs.round_id
    join public.liar_round_players target on target.id=v.target_round_player_id and target.round_id=rd.id
    where rd.game_id=v_game.id
      and rd.finished_at is not null
      and rd.winner in ('citizen','liar')
    group by target.player_id
  ), peak as (
    select max(total_votes) as max_count from vote_totals
  )
  select case when coalesce(peak.max_count,0)>0 then jsonb_build_object(
      'count',peak.max_count,
      'players',coalesce((select jsonb_agg(jsonb_build_object('player_id',v.player_id,'nickname',v.nickname) order by v.nickname)
        from vote_totals v where v.total_votes=peak.max_count),'[]'::jsonb)
    ) else null end
  into v_most_suspected
  from peak;

  -- A capture-failure round only contributes to individual hidden-role stats
  -- after the server-enforced identity reveal, so this RPC cannot bypass the
  -- five-second failed-capture reveal experience.
  with survival_totals as (
    select rp.player_id,
      (array_agg(rp.nickname_snapshot order by rd.round_no desc))[1] as nickname,
      count(*)::integer as wins
    from public.liar_round_players rp
    join public.liar_rounds rd on rd.id=rp.round_id
    where rd.game_id=v_game.id
      and rd.finished_at is not null
      and rd.winner='liar'
      and rd.capture_succeeded is false
      and rd.liars_revealed_at is not null
      and rp.role='liar'
    group by rp.player_id
  ), peak as (
    select max(wins) as max_count from survival_totals
  )
  select case when coalesce(peak.max_count,0)>0 then jsonb_build_object(
      'count',peak.max_count,
      'players',coalesce((select jsonb_agg(jsonb_build_object('player_id',s.player_id,'nickname',s.nickname) order by s.nickname)
        from survival_totals s where s.wins=peak.max_count),'[]'::jsonb)
    ) else null end
  into v_survival_leader
  from peak;

  with comeback_totals as (
    select rp.player_id,
      (array_agg(rp.nickname_snapshot order by rd.round_no desc))[1] as nickname,
      count(*)::integer as wins
    from public.liar_guesses g
    join public.liar_round_players rp on rp.id=g.guesser_round_player_id
    join public.liar_rounds rd on rd.id=g.round_id and rd.id=rp.round_id
    where rd.game_id=v_game.id
      and rd.finished_at is not null
      and rd.winner='liar'
      and rd.capture_succeeded is true
      and rd.liars_revealed_at is not null
      and g.is_correct is true
    group by rp.player_id
  ), peak as (
    select max(wins) as max_count from comeback_totals
  )
  select case when coalesce(peak.max_count,0)>0 then jsonb_build_object(
      'count',peak.max_count,
      'players',coalesce((select jsonb_agg(jsonb_build_object('player_id',c.player_id,'nickname',c.nickname) order by c.nickname)
        from comeback_totals c where c.wins=peak.max_count),'[]'::jsonb)
    ) else null end
  into v_comeback_leader
  from peak;

  return jsonb_build_object(
    'game_id',v_game.id,
    'game_no',v_game.game_no,
    'game_mode',v_game.game_mode,
    'score',jsonb_build_object(
      'citizen',v_citizen_wins,
      'liar',v_liar_wins,
      'rounds',v_citizen_wins+v_liar_wins
    ),
    'round_history',v_round_history,
    'most_suspected',v_most_suspected,
    'survival_leader',v_survival_leader,
    'comeback_leader',v_comeback_leader,
    'server_now',now()
  );
end $$;

revoke all on function public.liar_get_game_stats(uuid) from public,anon,authenticated;
grant execute on function public.liar_get_game_stats(uuid) to authenticated;
