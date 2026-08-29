alter table public.the_game_game_players
  add column if not exists cards_played integer not null default 0 check (cards_played >= 0),
  add column if not exists reverse_jumps integer not null default 0 check (reverse_jumps >= 0),
  add column if not exists gap_sum integer not null default 0 check (gap_sum >= 0),
  add column if not exists gap_samples integer not null default 0 check (gap_samples >= 0),
  add column if not exists max_turn_cards integer not null default 0 check (max_turn_cards >= 0),
  add column if not exists late_game_cards integer not null default 0 check (late_game_cards >= 0),
  add column if not exists rescue_plays integer not null default 0 check (rescue_plays >= 0),
  add column if not exists bold_plays integer not null default 0 check (bold_plays >= 0),
  add column if not exists precision_plays integer not null default 0 check (precision_plays >= 0),
  add column if not exists current_reverse_combo integer not null default 0 check (current_reverse_combo >= 0),
  add column if not exists max_reverse_combo integer not null default 0 check (max_reverse_combo >= 0),
  add column if not exists reverse_combo_turn integer not null default 0 check (reverse_combo_turn >= 0),
  add column if not exists mvp_awards text[] not null default '{}'::text[],
  add column if not exists result_outcome text check (result_outcome is null or result_outcome in ('won','lost')),
  add column if not exists result_remaining_cards smallint check (result_remaining_cards is null or result_remaining_cards between 0 and 98),
  add column if not exists stats_finalized_at timestamptz;

create index if not exists the_game_game_players_user_stats_idx
  on public.the_game_game_players(user_id, stats_finalized_at desc)
  where stats_finalized_at is not null;

create or replace function private.the_game_record_play_stats(
  p_game_id uuid,
  p_user_id uuid,
  p_card smallint,
  p_pile_id text,
  p_previous_value smallint,
  p_turn_number integer,
  p_turn_cards integer,
  p_remaining_before integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_reverse boolean := false;
  v_gap integer;
  v_rescue boolean := false;
  v_next_combo integer := 0;
begin
  if p_previous_value is not null then
    v_gap := abs(p_card::integer - p_previous_value::integer);
    v_reverse := case
      when p_pile_id in ('ascending-1','ascending-2') then p_previous_value - p_card = 10
      when p_pile_id in ('descending-1','descending-2') then p_card - p_previous_value = 10
      else false
    end;

    v_rescue := v_reverse and case
      when p_pile_id in ('ascending-1','ascending-2') then p_previous_value >= 75
      when p_pile_id in ('descending-1','descending-2') then p_previous_value <= 25
      else false
    end;
  end if;

  select case
    when v_reverse and gp.reverse_combo_turn = p_turn_number then gp.current_reverse_combo + 1
    when v_reverse then 1
    else 0
  end
  into v_next_combo
  from public.the_game_game_players gp
  where gp.game_id = p_game_id
    and gp.user_id = p_user_id;

  update public.the_game_game_players gp
  set cards_played = gp.cards_played + 1,
      reverse_jumps = gp.reverse_jumps + case when v_reverse then 1 else 0 end,
      gap_sum = gp.gap_sum + coalesce(v_gap, 0),
      gap_samples = gp.gap_samples + case when v_gap is null then 0 else 1 end,
      max_turn_cards = greatest(gp.max_turn_cards, greatest(coalesce(p_turn_cards, 0), 0)),
      late_game_cards = gp.late_game_cards + case when coalesce(p_remaining_before, 99) <= 20 then 1 else 0 end,
      rescue_plays = gp.rescue_plays + case when v_rescue then 1 else 0 end,
      bold_plays = gp.bold_plays + case when not v_reverse and coalesce(v_gap, 0) >= 25 then 1 else 0 end,
      precision_plays = gp.precision_plays + case when not v_reverse and v_gap between 1 and 3 then 1 else 0 end,
      current_reverse_combo = v_next_combo,
      max_reverse_combo = greatest(gp.max_reverse_combo, v_next_combo),
      reverse_combo_turn = p_turn_number
  where gp.game_id = p_game_id
    and gp.user_id = p_user_id;
end;
$function$;

revoke all on function private.the_game_record_play_stats(uuid, uuid, smallint, text, smallint, integer, integer, integer) from public, anon, authenticated;

create or replace function private.the_game_finalize_stats(p_game_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_game public.the_game_games%rowtype;
  v_remaining integer;
  v_max integer;
  v_min_average numeric;
begin
  select * into v_game
  from public.the_game_games
  where id = p_game_id;

  if not found or v_game.status not in ('won','lost') then
    return;
  end if;

  if exists (
    select 1 from public.the_game_game_players
    where game_id = p_game_id and stats_finalized_at is not null
  ) then
    return;
  end if;

  select v_game.draw_count + coalesce(sum(gp.hand_count), 0)::integer
  into v_remaining
  from public.the_game_game_players gp
  where gp.game_id = p_game_id;

  update public.the_game_game_players
  set mvp_awards = '{}'::text[],
      result_outcome = v_game.status,
      result_remaining_cards = v_remaining::smallint,
      stats_finalized_at = now()
  where game_id = p_game_id;

  select max(reverse_jumps) into v_max
  from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then
    update public.the_game_game_players
    set mvp_awards = array_append(mvp_awards, 'savior')
    where game_id = p_game_id and reverse_jumps = v_max;
  end if;

  select max(cards_played) into v_max
  from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then
    update public.the_game_game_players
    set mvp_awards = array_append(mvp_awards, 'card-machine')
    where game_id = p_game_id and cards_played = v_max;
  end if;

  select min(gap_sum::numeric / nullif(gap_samples, 0)) into v_min_average
  from public.the_game_game_players
  where game_id = p_game_id and gap_samples >= 3;
  if v_min_average is not null then
    update public.the_game_game_players
    set mvp_awards = array_append(mvp_awards, 'steady-hand')
    where game_id = p_game_id
      and gap_samples >= 3
      and gap_sum::numeric / gap_samples = v_min_average;
  end if;

  select max(late_game_cards) into v_max
  from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then
    update public.the_game_game_players
    set mvp_awards = array_append(mvp_awards, 'clutch-finisher')
    where game_id = p_game_id and late_game_cards = v_max;
  end if;

  select max(max_turn_cards) into v_max
  from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) >= 2 then
    update public.the_game_game_players
    set mvp_awards = array_append(mvp_awards, 'chain-player')
    where game_id = p_game_id and max_turn_cards = v_max;
  end if;

  select max(rescue_plays) into v_max
  from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then
    update public.the_game_game_players
    set mvp_awards = array_append(mvp_awards, 'crisis-manager')
    where game_id = p_game_id and rescue_plays = v_max;
  end if;

  select max(bold_plays) into v_max
  from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then
    update public.the_game_game_players
    set mvp_awards = array_append(mvp_awards, 'bold-player')
    where game_id = p_game_id and bold_plays = v_max;
  end if;

  select max(precision_plays) into v_max
  from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then
    update public.the_game_game_players
    set mvp_awards = array_append(mvp_awards, 'precision-player')
    where game_id = p_game_id and precision_plays = v_max;
  end if;

  select max(max_reverse_combo) into v_max
  from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) >= 2 then
    update public.the_game_game_players
    set mvp_awards = array_append(mvp_awards, 'reverse-combo')
    where game_id = p_game_id and max_reverse_combo = v_max;
  end if;
end;
$function$;

revoke all on function private.the_game_finalize_stats(uuid) from public, anon, authenticated;

create or replace function private.the_game_mvp_payload(p_game_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
  with categories(code, sort_order) as (
    values
      ('savior'::text, 1),
      ('card-machine'::text, 2),
      ('steady-hand'::text, 3),
      ('clutch-finisher'::text, 4),
      ('chain-player'::text, 5),
      ('crisis-manager'::text, 6),
      ('bold-player'::text, 7),
      ('precision-player'::text, 8),
      ('reverse-combo'::text, 9)
  ), winners as (
    select c.code,
           c.sort_order,
           jsonb_agg(
             jsonb_build_object(
               'user_id', gp.user_id,
               'nickname', gp.nickname,
               'seat', gp.seat,
               'value', case c.code
                 when 'savior' then gp.reverse_jumps::numeric
                 when 'card-machine' then gp.cards_played::numeric
                 when 'steady-hand' then round(gp.gap_sum::numeric / nullif(gp.gap_samples, 0), 1)
                 when 'clutch-finisher' then gp.late_game_cards::numeric
                 when 'chain-player' then gp.max_turn_cards::numeric
                 when 'crisis-manager' then gp.rescue_plays::numeric
                 when 'bold-player' then gp.bold_plays::numeric
                 when 'precision-player' then gp.precision_plays::numeric
                 when 'reverse-combo' then gp.max_reverse_combo::numeric
                 else 0::numeric
               end
             ) order by gp.seat
           ) as winner_rows
    from categories c
    join public.the_game_game_players gp
      on gp.game_id = p_game_id
     and c.code = any(gp.mvp_awards)
    group by c.code, c.sort_order
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object('code', code, 'winners', winner_rows)
      order by sort_order
    ),
    '[]'::jsonb
  )
  from winners;
$function$;

revoke all on function private.the_game_mvp_payload(uuid) from public, anon, authenticated;

create or replace function private.the_game_evaluate_state(p_game_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_game public.the_game_games%rowtype;
  v_remaining integer;
  v_outcome text;
begin
  select * into v_game
  from public.the_game_games
  where id = p_game_id
  for update;

  if not found then
    raise exception 'GAME_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_game.status <> 'playing' then
    return v_game.status;
  end if;

  select v_game.draw_count + coalesce(sum(gp.hand_count), 0)::integer
  into v_remaining
  from public.the_game_game_players gp
  where gp.game_id = p_game_id;

  if v_remaining = 0 then
    v_outcome := 'won';
  elsif not private.the_game_can_complete_minimum(p_game_id) then
    v_outcome := 'lost';
  else
    return 'playing';
  end if;

  update public.the_game_games
  set status = v_outcome,
      finished_at = coalesce(finished_at, now()),
      updated_at = now()
  where id = p_game_id;

  update public.the_game_rooms
  set status = 'finished',
      version = version + 1,
      updated_at = now()
  where id = v_game.room_id
    and status = 'playing';

  perform private.the_game_finalize_stats(p_game_id);
  return v_outcome;
end;
$function$;

create or replace function public.the_game_play_card(
  p_room_id uuid,
  p_card smallint,
  p_pile_id text,
  p_expected_version bigint,
  p_client_action_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := (select auth.uid());
  v_room public.the_game_rooms%rowtype;
  v_game public.the_game_games%rowtype;
  v_player public.the_game_game_players%rowtype;
  v_hand smallint[];
  v_request jsonb;
  v_existing private.the_game_action_log%rowtype;
  v_response jsonb;
  v_before_version bigint;
  v_previous_value smallint;
  v_remaining_before integer;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if p_client_action_id is null then
    raise exception 'INVALID_ACTION_ID' using errcode = 'P0001';
  end if;
  if p_card is null or p_card < 2 or p_card > 99 then
    raise exception 'INVALID_CARD' using errcode = 'P0001';
  end if;
  if p_pile_id is null or p_pile_id not in ('ascending-1','ascending-2','descending-1','descending-2') then
    raise exception 'INVALID_PILE' using errcode = 'P0001';
  end if;

  select * into v_room
  from public.the_game_rooms
  where id = p_room_id
  for update;

  if not found or v_room.current_game_id is null then
    raise exception 'GAME_NOT_FOUND' using errcode = 'P0001';
  end if;

  select * into v_game
  from public.the_game_games
  where id = v_room.current_game_id
    and room_id = p_room_id
  for update;

  if not found then
    raise exception 'GAME_NOT_FOUND' using errcode = 'P0001';
  end if;

  v_request := jsonb_build_object('action','play_card','card',p_card,'pile_id',p_pile_id);

  select * into v_existing
  from private.the_game_action_log
  where game_id = v_game.id
    and user_id = v_user_id
    and client_action_id = p_client_action_id;

  if found then
    if v_existing.action_type <> 'play_card' or v_existing.request <> v_request then
      raise exception 'CLIENT_ACTION_REUSED' using errcode = 'P0001';
    end if;
    return v_existing.response;
  end if;

  if v_room.status <> 'playing' or v_game.status <> 'playing' then
    raise exception 'GAME_NOT_PLAYING' using errcode = 'P0001';
  end if;
  if p_expected_version is null or v_game.version <> p_expected_version then
    raise exception 'STATE_CHANGED' using errcode = 'P0001';
  end if;
  if not private.the_game_is_room_member(p_room_id) then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;

  select * into v_player
  from public.the_game_game_players
  where game_id = v_game.id
    and user_id = v_user_id;

  if not found then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;
  if v_player.seat <> v_game.current_seat then
    raise exception 'NOT_YOUR_TURN' using errcode = 'P0001';
  end if;

  select cards into v_hand
  from private.the_game_player_hands
  where game_id = v_game.id
    and user_id = v_user_id
  for update;

  if not found or not (p_card = any(coalesce(v_hand, '{}'::smallint[]))) then
    raise exception 'CARD_NOT_IN_HAND' using errcode = 'P0001';
  end if;

  if not private.the_game_is_card_playable(
    p_card, p_pile_id,
    v_game.ascending_1, v_game.ascending_2,
    v_game.descending_1, v_game.descending_2
  ) then
    raise exception 'CARD_NOT_PLAYABLE' using errcode = 'P0001';
  end if;

  v_previous_value := case p_pile_id
    when 'ascending-1' then v_game.ascending_1
    when 'ascending-2' then v_game.ascending_2
    when 'descending-1' then v_game.descending_1
    when 'descending-2' then v_game.descending_2
    else null
  end;

  select v_game.draw_count + coalesce(sum(gp.hand_count), 0)::integer
  into v_remaining_before
  from public.the_game_game_players gp
  where gp.game_id = v_game.id;

  perform private.the_game_record_play_stats(
    v_game.id,
    v_user_id,
    p_card,
    p_pile_id,
    v_previous_value,
    v_game.turn_number,
    v_game.cards_played_this_turn + 1,
    v_remaining_before
  );

  v_before_version := v_game.version;

  update private.the_game_player_hands
  set cards = array_remove(cards, p_card)
  where game_id = v_game.id
    and user_id = v_user_id;

  update public.the_game_game_players
  set hand_count = hand_count - 1
  where id = v_player.id;

  update public.the_game_games
  set ascending_1 = case when p_pile_id = 'ascending-1' then p_card else ascending_1 end,
      ascending_2 = case when p_pile_id = 'ascending-2' then p_card else ascending_2 end,
      descending_1 = case when p_pile_id = 'descending-1' then p_card else descending_1 end,
      descending_2 = case when p_pile_id = 'descending-2' then p_card else descending_2 end,
      cards_played_this_turn = cards_played_this_turn + 1,
      version = version + 1,
      updated_at = now()
  where id = v_game.id;

  perform private.the_game_evaluate_state(v_game.id);
  v_response := private.the_game_game_snapshot(p_room_id);

  insert into private.the_game_action_log(
    game_id, user_id, client_action_id, action_type, request,
    game_version_before, game_version_after, response
  ) values (
    v_game.id, v_user_id, p_client_action_id, 'play_card', v_request,
    v_before_version, (v_response #>> '{game,version}')::bigint, v_response
  );

  return v_response;
end;
$function$;

create or replace function public.the_game_get_game_stats(p_room_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := (select auth.uid());
  v_game public.the_game_games%rowtype;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if not private.the_game_is_room_member(p_room_id) then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;

  select g.* into v_game
  from public.the_game_games g
  join public.the_game_rooms r on r.current_game_id = g.id
  where r.id = p_room_id
  order by g.started_at desc
  limit 1;

  if not found or v_game.status not in ('won','lost') then
    return null;
  end if;

  return jsonb_build_object(
    'game_id', v_game.id,
    'outcome', v_game.status,
    'mvp', private.the_game_mvp_payload(v_game.id),
    'players', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'user_id', gp.user_id,
          'nickname', gp.nickname,
          'seat', gp.seat,
          'cards_played', gp.cards_played,
          'reverse_jumps', gp.reverse_jumps,
          'average_gap', case when gp.gap_samples > 0 then round(gp.gap_sum::numeric / gp.gap_samples, 1) else null end,
          'max_turn_cards', gp.max_turn_cards,
          'late_game_cards', gp.late_game_cards,
          'rescue_plays', gp.rescue_plays,
          'bold_plays', gp.bold_plays,
          'precision_plays', gp.precision_plays,
          'max_reverse_combo', gp.max_reverse_combo,
          'mvp_awards', to_jsonb(gp.mvp_awards)
        ) order by gp.seat
      )
      from public.the_game_game_players gp
      where gp.game_id = v_game.id
    ), '[]'::jsonb)
  );
end;
$function$;

revoke all on function public.the_game_get_game_stats(uuid) from public, anon;
grant execute on function public.the_game_get_game_stats(uuid) to authenticated, service_role;

create or replace function public.the_game_get_my_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := (select auth.uid());
  v_games integer := 0;
  v_wins integer := 0;
  v_losses integer := 0;
  v_cards integer := 0;
  v_reverse integer := 0;
  v_best_reverse integer := 0;
  v_best_turn integer := 0;
  v_best_combo integer := 0;
  v_late integer := 0;
  v_rescue integer := 0;
  v_bold integer := 0;
  v_precision integer := 0;
  v_gap_sum bigint := 0;
  v_gap_samples bigint := 0;
  v_best_loss_remaining integer;
  v_current_streak integer := 0;
  v_best_streak integer := 0;
  v_outcome text;
  v_mvp_counts jsonb := '{}'::jsonb;
  v_recent jsonb := '[]'::jsonb;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  select count(*)::integer,
         count(*) filter (where gp.result_outcome = 'won')::integer,
         count(*) filter (where gp.result_outcome = 'lost')::integer,
         coalesce(sum(gp.cards_played), 0)::integer,
         coalesce(sum(gp.reverse_jumps), 0)::integer,
         coalesce(max(gp.reverse_jumps), 0)::integer,
         coalesce(max(gp.max_turn_cards), 0)::integer,
         coalesce(max(gp.max_reverse_combo), 0)::integer,
         coalesce(sum(gp.late_game_cards), 0)::integer,
         coalesce(sum(gp.rescue_plays), 0)::integer,
         coalesce(sum(gp.bold_plays), 0)::integer,
         coalesce(sum(gp.precision_plays), 0)::integer,
         coalesce(sum(gp.gap_sum), 0)::bigint,
         coalesce(sum(gp.gap_samples), 0)::bigint,
         min(gp.result_remaining_cards) filter (where gp.result_outcome = 'lost')::integer
  into v_games, v_wins, v_losses, v_cards, v_reverse, v_best_reverse,
       v_best_turn, v_best_combo, v_late, v_rescue, v_bold, v_precision,
       v_gap_sum, v_gap_samples, v_best_loss_remaining
  from public.the_game_game_players gp
  where gp.user_id = v_user_id
    and gp.stats_finalized_at is not null;

  for v_outcome in
    select gp.result_outcome
    from public.the_game_game_players gp
    join public.the_game_games g on g.id = gp.game_id
    where gp.user_id = v_user_id
      and gp.stats_finalized_at is not null
    order by g.finished_at, g.id
  loop
    if v_outcome = 'won' then
      v_current_streak := v_current_streak + 1;
      v_best_streak := greatest(v_best_streak, v_current_streak);
    else
      v_current_streak := 0;
    end if;
  end loop;

  select coalesce(jsonb_object_agg(code, award_count), '{}'::jsonb)
  into v_mvp_counts
  from (
    select award as code, count(*)::integer as award_count
    from public.the_game_game_players gp
    cross join lateral unnest(gp.mvp_awards) as award
    where gp.user_id = v_user_id
      and gp.stats_finalized_at is not null
    group by award
  ) counts;

  select coalesce(jsonb_agg(row_data order by finished_at desc), '[]'::jsonb)
  into v_recent
  from (
    select g.finished_at,
           jsonb_build_object(
             'game_id', gp.game_id,
             'outcome', gp.result_outcome,
             'remaining_cards', gp.result_remaining_cards,
             'cards_played', gp.cards_played,
             'reverse_jumps', gp.reverse_jumps,
             'mvp_awards', to_jsonb(gp.mvp_awards),
             'finished_at', g.finished_at
           ) as row_data
    from public.the_game_game_players gp
    join public.the_game_games g on g.id = gp.game_id
    where gp.user_id = v_user_id
      and gp.stats_finalized_at is not null
    order by g.finished_at desc
    limit 10
  ) recent_rows;

  return jsonb_build_object(
    'games_played', v_games,
    'wins', v_wins,
    'losses', v_losses,
    'win_rate', case when v_games > 0 then round(v_wins::numeric * 100 / v_games, 1) else 0 end,
    'current_win_streak', v_current_streak,
    'best_win_streak', v_best_streak,
    'total_cards_played', v_cards,
    'total_reverse_jumps', v_reverse,
    'best_reverse_jumps', v_best_reverse,
    'best_turn_cards', v_best_turn,
    'best_reverse_combo', v_best_combo,
    'average_gap', case when v_gap_samples > 0 then round(v_gap_sum::numeric / v_gap_samples, 1) else null end,
    'best_loss_remaining', v_best_loss_remaining,
    'late_game_cards', v_late,
    'rescue_plays', v_rescue,
    'bold_plays', v_bold,
    'precision_plays', v_precision,
    'mvp_counts', v_mvp_counts,
    'recent_games', v_recent
  );
end;
$function$;

revoke all on function public.the_game_get_my_stats() from public, anon;
grant execute on function public.the_game_get_my_stats() to authenticated, service_role;
