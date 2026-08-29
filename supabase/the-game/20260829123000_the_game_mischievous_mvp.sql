alter table public.the_game_game_players
  add column if not exists non_reverse_gap_sum integer not null default 0 check (non_reverse_gap_sum >= 0),
  add column if not exists non_reverse_gap_samples integer not null default 0 check (non_reverse_gap_samples >= 0),
  add column if not exists max_gap integer not null default 0 check (max_gap >= 0),
  add column if not exists danger_entries integer not null default 0 check (danger_entries >= 0),
  add column if not exists extreme_blocks integer not null default 0 check (extreme_blocks >= 0),
  add column if not exists reverse_opportunities_wasted integer not null default 0 check (reverse_opportunities_wasted >= 0),
  add column if not exists dangerous_big_jumps integer not null default 0 check (dangerous_big_jumps >= 0),
  add column if not exists reckless_openings integer not null default 0 check (reckless_openings >= 0),
  add column if not exists max_danger_overshoot integer not null default 0 check (max_danger_overshoot >= 0),
  add column if not exists mid_risk_plays integer not null default 0 check (mid_risk_plays >= 0),
  add column if not exists current_bold_streak integer not null default 0 check (current_bold_streak >= 0),
  add column if not exists max_bold_streak integer not null default 0 check (max_bold_streak >= 0),
  add column if not exists bold_streak_turn integer not null default 0 check (bold_streak_turn >= 0);

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
  v_hand smallint[] := '{}'::smallint[];
  v_reverse_target smallint;
  v_danger_before boolean := false;
  v_danger_after boolean := false;
  v_danger_entry boolean := false;
  v_extreme_block boolean := false;
  v_wasted_reverse boolean := false;
  v_dangerous_big_jump boolean := false;
  v_reckless_opening boolean := false;
  v_danger_overshoot integer := 0;
  v_mid_risk_play boolean := false;
  v_bold_play boolean := false;
  v_next_bold_streak integer := 0;
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

    v_danger_before := case
      when p_pile_id in ('ascending-1','ascending-2') then p_previous_value >= 75
      when p_pile_id in ('descending-1','descending-2') then p_previous_value <= 25
      else false
    end;

    v_danger_after := case
      when p_pile_id in ('ascending-1','ascending-2') then p_card >= 75
      when p_pile_id in ('descending-1','descending-2') then p_card <= 25
      else false
    end;

    v_danger_entry := not v_reverse and not v_danger_before and v_danger_after;
    v_extreme_block := not v_reverse and case
      when p_pile_id in ('ascending-1','ascending-2') then p_card >= 90
      when p_pile_id in ('descending-1','descending-2') then p_card <= 10
      else false
    end;

    v_reverse_target := case
      when p_pile_id in ('ascending-1','ascending-2') then p_previous_value - 10
      when p_pile_id in ('descending-1','descending-2') then p_previous_value + 10
      else null
    end;

    select coalesce(cards, '{}'::smallint[])
    into v_hand
    from private.the_game_player_hands
    where game_id = p_game_id
      and user_id = p_user_id;

    v_wasted_reverse := not v_reverse
      and v_reverse_target between 2 and 99
      and v_reverse_target = any(v_hand);

    v_dangerous_big_jump := not v_reverse
      and v_danger_before
      and coalesce(v_gap, 0) >= 10;

    v_reckless_opening := not v_reverse
      and coalesce(p_turn_cards, 0) = 1
      and coalesce(v_gap, 0) >= 15;

    if v_danger_entry then
      v_danger_overshoot := case
        when p_pile_id in ('ascending-1','ascending-2') then greatest(p_card::integer - 75, 0)
        when p_pile_id in ('descending-1','descending-2') then greatest(25 - p_card::integer, 0)
        else 0
      end;
    end if;

    v_mid_risk_play := not v_reverse and v_gap between 10 and 24;
    v_bold_play := not v_reverse and coalesce(v_gap, 0) >= 25;
  end if;

  select
    case
      when v_reverse and gp.reverse_combo_turn = p_turn_number then gp.current_reverse_combo + 1
      when v_reverse then 1
      else 0
    end,
    case
      when v_bold_play and gp.bold_streak_turn = p_turn_number then gp.current_bold_streak + 1
      when v_bold_play then 1
      else 0
    end
  into v_next_combo, v_next_bold_streak
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
      bold_plays = gp.bold_plays + case when v_bold_play then 1 else 0 end,
      precision_plays = gp.precision_plays + case when not v_reverse and v_gap between 1 and 3 then 1 else 0 end,
      current_reverse_combo = v_next_combo,
      max_reverse_combo = greatest(gp.max_reverse_combo, v_next_combo),
      reverse_combo_turn = p_turn_number,
      non_reverse_gap_sum = gp.non_reverse_gap_sum + case when not v_reverse then coalesce(v_gap, 0) else 0 end,
      non_reverse_gap_samples = gp.non_reverse_gap_samples + case when not v_reverse and v_gap is not null then 1 else 0 end,
      max_gap = greatest(gp.max_gap, case when not v_reverse then coalesce(v_gap, 0) else 0 end),
      danger_entries = gp.danger_entries + case when v_danger_entry then 1 else 0 end,
      extreme_blocks = gp.extreme_blocks + case when v_extreme_block then 1 else 0 end,
      reverse_opportunities_wasted = gp.reverse_opportunities_wasted + case when v_wasted_reverse then 1 else 0 end,
      dangerous_big_jumps = gp.dangerous_big_jumps + case when v_dangerous_big_jump then 1 else 0 end,
      reckless_openings = gp.reckless_openings + case when v_reckless_opening then 1 else 0 end,
      max_danger_overshoot = greatest(gp.max_danger_overshoot, v_danger_overshoot),
      mid_risk_plays = gp.mid_risk_plays + case when v_mid_risk_play then 1 else 0 end,
      current_bold_streak = v_next_bold_streak,
      max_bold_streak = greatest(gp.max_bold_streak, v_next_bold_streak),
      bold_streak_turn = p_turn_number
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
  v_max_average numeric;
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

  select max(reverse_jumps) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'savior') where game_id = p_game_id and reverse_jumps = v_max; end if;
  select max(cards_played) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'card-machine') where game_id = p_game_id and cards_played = v_max; end if;
  select min(gap_sum::numeric / nullif(gap_samples, 0)) into v_min_average from public.the_game_game_players where game_id = p_game_id and gap_samples >= 3;
  if v_min_average is not null then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'steady-hand') where game_id = p_game_id and gap_samples >= 3 and gap_sum::numeric / gap_samples = v_min_average; end if;
  select max(late_game_cards) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'clutch-finisher') where game_id = p_game_id and late_game_cards = v_max; end if;
  select max(max_turn_cards) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) >= 2 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'chain-player') where game_id = p_game_id and max_turn_cards = v_max; end if;
  select max(rescue_plays) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'crisis-manager') where game_id = p_game_id and rescue_plays = v_max; end if;
  select max(bold_plays) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'bold-player') where game_id = p_game_id and bold_plays = v_max; end if;
  select max(precision_plays) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'precision-player') where game_id = p_game_id and precision_plays = v_max; end if;
  select max(max_reverse_combo) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) >= 2 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'reverse-combo') where game_id = p_game_id and max_reverse_combo = v_max; end if;
  select max(max_bold_streak) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) >= 2 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'runaway-train') where game_id = p_game_id and max_bold_streak = v_max; end if;
  select max(non_reverse_gap_sum::numeric / nullif(non_reverse_gap_samples, 0)) into v_max_average from public.the_game_game_players where game_id = p_game_id and non_reverse_gap_samples >= 3;
  if v_max_average is not null then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'safety-distance') where game_id = p_game_id and non_reverse_gap_samples >= 3 and non_reverse_gap_sum::numeric / non_reverse_gap_samples = v_max_average; end if;
  select max(max_gap) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) >= 20 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'one-hit-too-big') where game_id = p_game_id and max_gap = v_max; end if;
  select max(danger_entries) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'heart-pound') where game_id = p_game_id and danger_entries = v_max; end if;
  select max(extreme_blocks) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'block-master') where game_id = p_game_id and extreme_blocks = v_max; end if;
  select max(reverse_opportunities_wasted) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'reverse-destroyer') where game_id = p_game_id and reverse_opportunities_wasted = v_max; end if;
  select max(dangerous_big_jumps) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'brake-failure') where game_id = p_game_id and dangerous_big_jumps = v_max; end if;
  select max(reckless_openings) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'just-play-it') where game_id = p_game_id and reckless_openings = v_max; end if;
  select max(max_danger_overshoot) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'bomb-thrower') where game_id = p_game_id and max_danger_overshoot = v_max; end if;
  select max(mid_risk_plays) into v_max from public.the_game_game_players where game_id = p_game_id;
  if coalesce(v_max, 0) > 0 then update public.the_game_game_players set mvp_awards = array_append(mvp_awards, 'heart-rate') where game_id = p_game_id and mid_risk_plays = v_max; end if;
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
      ('savior'::text, 1), ('card-machine'::text, 2), ('steady-hand'::text, 3),
      ('clutch-finisher'::text, 4), ('chain-player'::text, 5), ('crisis-manager'::text, 6),
      ('bold-player'::text, 7), ('precision-player'::text, 8), ('reverse-combo'::text, 9),
      ('runaway-train'::text, 10), ('safety-distance'::text, 11), ('one-hit-too-big'::text, 12),
      ('heart-pound'::text, 13), ('block-master'::text, 14), ('reverse-destroyer'::text, 15),
      ('brake-failure'::text, 16), ('just-play-it'::text, 17), ('bomb-thrower'::text, 18),
      ('heart-rate'::text, 19)
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
                 when 'runaway-train' then gp.max_bold_streak::numeric
                 when 'safety-distance' then round(gp.non_reverse_gap_sum::numeric / nullif(gp.non_reverse_gap_samples, 0), 1)
                 when 'one-hit-too-big' then gp.max_gap::numeric
                 when 'heart-pound' then gp.danger_entries::numeric
                 when 'block-master' then gp.extreme_blocks::numeric
                 when 'reverse-destroyer' then gp.reverse_opportunities_wasted::numeric
                 when 'brake-failure' then gp.dangerous_big_jumps::numeric
                 when 'just-play-it' then gp.reckless_openings::numeric
                 when 'bomb-thrower' then gp.max_danger_overshoot::numeric
                 when 'heart-rate' then gp.mid_risk_plays::numeric
                 else 0::numeric
               end
             ) order by gp.seat
           ) as winner_rows
    from categories c
    join public.the_game_game_players gp on gp.game_id = p_game_id and c.code = any(gp.mvp_awards)
    group by c.code, c.sort_order
  )
  select coalesce(jsonb_agg(jsonb_build_object('code', code, 'winners', winner_rows) order by sort_order), '[]'::jsonb)
  from winners;
$function$;

revoke all on function private.the_game_mvp_payload(uuid) from public, anon, authenticated;
