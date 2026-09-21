begin;

alter table public.no_thanks_room_actions
  drop constraint if exists no_thanks_room_actions_action_type_check;

alter table public.no_thanks_room_actions
  add constraint no_thanks_room_actions_action_type_check
  check (action_type in ('set_ready', 'start_game', 'refuse_card', 'take_card'));

create or replace function private.no_thanks_card_score(p_cards integer[])
returns integer
language sql
immutable
set search_path = ''
as $$
  select coalesce(sum(card), 0)::integer
  from (
    select
      card,
      lag(card) over (order by card) as previous_card
    from unnest(coalesce(p_cards, '{}'::integer[])) as cards(card)
  ) as ordered_cards
  where previous_card is null or card <> previous_card + 1;
$$;

create or replace function public.no_thanks_refuse_card(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_room public.no_thanks_rooms%rowtype;
  v_private public.no_thanks_room_private_state%rowtype;
  v_existing public.no_thanks_room_actions%rowtype;
  v_payload jsonb := '{}'::jsonb;
  v_game jsonb;
  v_counter integer;
  v_center integer;
  v_turn_index integer;
  v_turn_count integer;
  v_next_player uuid;
  v_counters jsonb;
  v_snapshot jsonb;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;
  if p_client_action_id is null or btrim(p_client_action_id) = '' then
    raise exception 'INVALID_ACTION_ID';
  end if;

  select *
    into v_existing
  from public.no_thanks_room_actions
  where room_id = p_room_id and client_action_id = p_client_action_id;

  if found then
    if v_existing.actor_user_id <> v_user_id
      or v_existing.action_type <> 'refuse_card'
      or v_existing.request_payload <> v_payload then
      raise exception 'ACTION_CONFLICT';
    end if;
    return v_existing.response_snapshot;
  end if;

  select *
    into v_room
  from public.no_thanks_rooms
  where id = p_room_id
  for update;

  if not found or v_room.status <> 'playing' then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  select *
    into v_existing
  from public.no_thanks_room_actions
  where room_id = p_room_id and client_action_id = p_client_action_id;

  if found then
    if v_existing.actor_user_id <> v_user_id
      or v_existing.action_type <> 'refuse_card'
      or v_existing.request_payload <> v_payload then
      raise exception 'ACTION_CONFLICT';
    end if;
    return v_existing.response_snapshot;
  end if;

  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;

  if not exists (
    select 1
    from public.no_thanks_room_players as p
    where p.room_id = p_room_id
      and p.user_id = v_user_id
      and p.membership_status = 'active'
  ) then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  v_game := v_room.game_state;
  if v_game is null or v_game ->> 'phase' <> 'PLAYING' then
    raise exception 'GAME_NOT_PLAYING';
  end if;
  if v_game ->> 'activePlayerId' <> v_user_id::text then
    raise exception 'TURN_REQUIRED';
  end if;

  select *
    into v_private
  from public.no_thanks_room_private_state
  where room_id = p_room_id
  for update;

  if not found then
    raise exception 'GAME_STATE_MISSING';
  end if;

  v_counter := coalesce((v_private.player_counters ->> v_user_id::text)::integer, -1);
  if v_counter < 0 then
    raise exception 'GAME_STATE_MISSING';
  end if;
  if v_counter = 0 then
    raise exception 'COUNTER_REQUIRED';
  end if;

  v_turn_index := coalesce((v_game ->> 'turnIndex')::integer, -1);
  v_turn_count := jsonb_array_length(v_game -> 'turnOrder');
  if v_turn_index < 0 or v_turn_count < 3 then
    raise exception 'GAME_STATE_MISSING';
  end if;

  v_turn_index := (v_turn_index + 1) % v_turn_count;
  v_next_player := ((v_game -> 'turnOrder') ->> v_turn_index)::uuid;
  v_center := coalesce((v_game ->> 'centerCounters')::integer, 0) + 1;
  v_counters := jsonb_set(
    v_private.player_counters,
    array[v_user_id::text],
    to_jsonb(v_counter - 1),
    false
  );

  v_game := jsonb_set(v_game, '{centerCounters}', to_jsonb(v_center), false);
  v_game := jsonb_set(v_game, '{turnIndex}', to_jsonb(v_turn_index), false);
  v_game := jsonb_set(v_game, '{activePlayerId}', to_jsonb(v_next_player::text), false);

  update public.no_thanks_room_private_state
  set player_counters = v_counters,
      updated_at = now()
  where room_id = p_room_id;

  update public.no_thanks_rooms
  set game_state = v_game,
      version = version + 1,
      updated_at = now()
  where id = p_room_id;

  v_snapshot := private.no_thanks_snapshot(p_room_id, v_user_id);

  insert into public.no_thanks_room_actions(
    room_id,
    client_action_id,
    actor_user_id,
    action_type,
    request_payload,
    response_snapshot
  )
  values (
    p_room_id,
    p_client_action_id,
    v_user_id,
    'refuse_card',
    v_payload,
    v_snapshot
  );

  return v_snapshot;
end;
$$;

create or replace function public.no_thanks_take_card(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_room public.no_thanks_rooms%rowtype;
  v_private public.no_thanks_room_private_state%rowtype;
  v_existing public.no_thanks_room_actions%rowtype;
  v_payload jsonb := '{}'::jsonb;
  v_game jsonb;
  v_current_card integer;
  v_center integer;
  v_counter integer;
  v_counters jsonb;
  v_remaining_deck integer[];
  v_next_card integer;
  v_public_players jsonb;
  v_scores jsonb;
  v_lowest_score integer;
  v_winners jsonb;
  v_snapshot jsonb;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;
  if p_client_action_id is null or btrim(p_client_action_id) = '' then
    raise exception 'INVALID_ACTION_ID';
  end if;

  select *
    into v_existing
  from public.no_thanks_room_actions
  where room_id = p_room_id and client_action_id = p_client_action_id;

  if found then
    if v_existing.actor_user_id <> v_user_id
      or v_existing.action_type <> 'take_card'
      or v_existing.request_payload <> v_payload then
      raise exception 'ACTION_CONFLICT';
    end if;
    return v_existing.response_snapshot;
  end if;

  select *
    into v_room
  from public.no_thanks_rooms
  where id = p_room_id
  for update;

  if not found or v_room.status <> 'playing' then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  select *
    into v_existing
  from public.no_thanks_room_actions
  where room_id = p_room_id and client_action_id = p_client_action_id;

  if found then
    if v_existing.actor_user_id <> v_user_id
      or v_existing.action_type <> 'take_card'
      or v_existing.request_payload <> v_payload then
      raise exception 'ACTION_CONFLICT';
    end if;
    return v_existing.response_snapshot;
  end if;

  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;

  if not exists (
    select 1
    from public.no_thanks_room_players as p
    where p.room_id = p_room_id
      and p.user_id = v_user_id
      and p.membership_status = 'active'
  ) then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  v_game := v_room.game_state;
  if v_game is null or v_game ->> 'phase' <> 'PLAYING' then
    raise exception 'GAME_NOT_PLAYING';
  end if;
  if v_game ->> 'activePlayerId' <> v_user_id::text then
    raise exception 'TURN_REQUIRED';
  end if;

  v_current_card := (v_game ->> 'currentCard')::integer;
  if v_current_card is null or v_current_card < 3 or v_current_card > 35 then
    raise exception 'GAME_STATE_MISSING';
  end if;
  v_center := coalesce((v_game ->> 'centerCounters')::integer, 0);

  select *
    into v_private
  from public.no_thanks_room_private_state
  where room_id = p_room_id
  for update;

  if not found then
    raise exception 'GAME_STATE_MISSING';
  end if;

  v_counter := coalesce((v_private.player_counters ->> v_user_id::text)::integer, -1);
  if v_counter < 0 then
    raise exception 'GAME_STATE_MISSING';
  end if;
  v_counters := jsonb_set(
    v_private.player_counters,
    array[v_user_id::text],
    to_jsonb(v_counter + v_center),
    false
  );

  update public.no_thanks_room_players
  set cards = array(
    select card
    from unnest(cards || v_current_card) as taken(card)
    order by card
  )
  where room_id = p_room_id
    and user_id = v_user_id
    and membership_status = 'active';

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'playerId', p.user_id,
        'cards', to_jsonb(p.cards)
      )
      order by p.seat
    ),
    '[]'::jsonb
  )
    into v_public_players
  from public.no_thanks_room_players as p
  where p.room_id = p_room_id
    and p.membership_status = 'active';

  if cardinality(v_private.draw_deck) > 0 then
    v_next_card := v_private.draw_deck[1];
    v_remaining_deck := coalesce(
      v_private.draw_deck[2:cardinality(v_private.draw_deck)],
      '{}'::integer[]
    );

    v_game := jsonb_set(v_game, '{currentCard}', to_jsonb(v_next_card), false);
    v_game := jsonb_set(v_game, '{centerCounters}', '0'::jsonb, false);
    v_game := jsonb_set(
      v_game,
      '{deckRemaining}',
      to_jsonb(cardinality(v_remaining_deck)),
      false
    );
    v_game := jsonb_set(v_game, '{players}', v_public_players, false);
  else
    select jsonb_object_agg(
      p.user_id::text,
      private.no_thanks_card_score(p.cards)
        - (v_counters ->> p.user_id::text)::integer
    )
      into v_scores
    from public.no_thanks_room_players as p
    where p.room_id = p_room_id
      and p.membership_status = 'active';

    select min(score::integer)
      into v_lowest_score
    from jsonb_each_text(v_scores) as scores(player_id, score);

    select coalesce(jsonb_agg(player_id order by ordinality), '[]'::jsonb)
      into v_winners
    from jsonb_array_elements_text(v_game -> 'turnOrder')
      with ordinality as turn_order(player_id, ordinality)
    where (v_scores ->> player_id)::integer = v_lowest_score;

    v_remaining_deck := '{}'::integer[];
    v_game := jsonb_set(v_game, '{phase}', '"GAME_OVER"'::jsonb, false);
    v_game := jsonb_set(v_game, '{currentCard}', 'null'::jsonb, false);
    v_game := jsonb_set(v_game, '{centerCounters}', '0'::jsonb, false);
    v_game := jsonb_set(v_game, '{deckRemaining}', '0'::jsonb, false);
    v_game := jsonb_set(v_game, '{players}', v_public_players, false);
    v_game := jsonb_set(v_game, '{finalScores}', v_scores, false);
    v_game := jsonb_set(v_game, '{winners}', v_winners, false);
    v_game := jsonb_set(v_game, '{endReason}', '"LAST_CARD_TAKEN"'::jsonb, false);
  end if;

  update public.no_thanks_room_private_state
  set draw_deck = v_remaining_deck,
      player_counters = v_counters,
      updated_at = now()
  where room_id = p_room_id;

  update public.no_thanks_rooms
  set game_state = v_game,
      version = version + 1,
      updated_at = now()
  where id = p_room_id;

  v_snapshot := private.no_thanks_snapshot(p_room_id, v_user_id);

  insert into public.no_thanks_room_actions(
    room_id,
    client_action_id,
    actor_user_id,
    action_type,
    request_payload,
    response_snapshot
  )
  values (
    p_room_id,
    p_client_action_id,
    v_user_id,
    'take_card',
    v_payload,
    v_snapshot
  );

  return v_snapshot;
end;
$$;

revoke all on function private.no_thanks_card_score(integer[]) from public, anon, authenticated;
revoke all on function public.no_thanks_refuse_card(uuid, bigint, text) from public, anon, authenticated;
revoke all on function public.no_thanks_take_card(uuid, bigint, text) from public, anon, authenticated;

grant execute on function public.no_thanks_refuse_card(uuid, bigint, text) to authenticated;
grant execute on function public.no_thanks_take_card(uuid, bigint, text) to authenticated;

commit;
