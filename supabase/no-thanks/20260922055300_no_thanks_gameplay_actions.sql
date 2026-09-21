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
  with ordered as (
    select
      card,
      lag(card) over (order by card) as previous_card
    from unnest(coalesce(p_cards, '{}'::integer[])) as cards(card)
  )
  select coalesce(
    sum(
      case
        when previous_card is null or card <> previous_card + 1 then card
        else 0
      end
    ),
    0
  )::integer
  from ordered;
$$;

create or replace function public.no_thanks_play_action(
  p_room_id uuid,
  p_action_type text,
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
  v_action_type text := lower(btrim(coalesce(p_action_type, '')));
  v_room public.no_thanks_rooms%rowtype;
  v_private public.no_thanks_room_private_state%rowtype;
  v_existing public.no_thanks_room_actions%rowtype;
  v_payload jsonb := '{}'::jsonb;
  v_game jsonb;
  v_snapshot jsonb;
  v_actor_counters integer;
  v_center_counters integer;
  v_turn_index integer;
  v_turn_count integer;
  v_next_index integer;
  v_next_player text;
  v_current_card integer;
  v_next_card integer;
  v_public_players jsonb;
  v_final_scores jsonb := '{}'::jsonb;
  v_winners jsonb := '[]'::jsonb;
  v_lowest_score integer;
  v_player_score integer;
  v_player record;
  v_turn_player text;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;
  if p_client_action_id is null or btrim(p_client_action_id) = '' then
    raise exception 'INVALID_ACTION_ID';
  end if;
  if v_action_type not in ('refuse_card', 'take_card') then
    raise exception 'INVALID_GAME_ACTION';
  end if;

  select *
    into v_existing
  from public.no_thanks_room_actions
  where room_id = p_room_id
    and client_action_id = p_client_action_id;

  if found then
    if v_existing.actor_user_id <> v_user_id
      or v_existing.action_type <> v_action_type
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
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;
  if not exists (
    select 1
    from public.no_thanks_room_players
    where room_id = p_room_id
      and user_id = v_user_id
      and membership_status = 'active'
  ) then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  select *
    into v_private
  from public.no_thanks_room_private_state
  where room_id = p_room_id
  for update;

  if not found then
    raise exception 'GAME_STATE_REQUIRED';
  end if;

  v_game := v_room.game_state;
  if v_game is null or v_game ->> 'phase' <> 'PLAYING' then
    raise exception 'GAME_NOT_PLAYING';
  end if;
  if coalesce(v_game ->> 'activePlayerId', '') <> v_user_id::text then
    raise exception 'TURN_REQUIRED';
  end if;

  v_actor_counters := coalesce(
    (v_private.player_counters ->> v_user_id::text)::integer,
    -1
  );
  if v_actor_counters < 0 then
    raise exception 'GAME_STATE_REQUIRED';
  end if;

  v_center_counters := coalesce((v_game ->> 'centerCounters')::integer, 0);

  if v_action_type = 'refuse_card' then
    if v_actor_counters = 0 then
      raise exception 'TAKE_REQUIRED';
    end if;

    v_turn_index := coalesce((v_game ->> 'turnIndex')::integer, 0);
    v_turn_count := jsonb_array_length(v_game -> 'turnOrder');
    if v_turn_count < 3 then
      raise exception 'GAME_STATE_REQUIRED';
    end if;

    v_next_index := (v_turn_index + 1) % v_turn_count;
    v_next_player := v_game -> 'turnOrder' ->> v_next_index;

    v_private.player_counters := jsonb_set(
      v_private.player_counters,
      array[v_user_id::text],
      to_jsonb(v_actor_counters - 1),
      true
    );

    v_game := jsonb_set(
      v_game,
      '{centerCounters}',
      to_jsonb(v_center_counters + 1),
      true
    );
    v_game := jsonb_set(v_game, '{turnIndex}', to_jsonb(v_next_index), true);
    v_game := jsonb_set(
      v_game,
      '{activePlayerId}',
      to_jsonb(v_next_player),
      true
    );
  else
    v_current_card := (v_game ->> 'currentCard')::integer;
    if v_current_card is null or v_current_card < 3 or v_current_card > 35 then
      raise exception 'GAME_STATE_REQUIRED';
    end if;

    update public.no_thanks_room_players as p
    set cards = (
      select coalesce(array_agg(card order by card), '{}'::integer[])
      from unnest(array_append(p.cards, v_current_card)) as owned(card)
    )
    where p.room_id = p_room_id
      and p.user_id = v_user_id
      and p.membership_status = 'active';

    v_private.player_counters := jsonb_set(
      v_private.player_counters,
      array[v_user_id::text],
      to_jsonb(v_actor_counters + v_center_counters),
      true
    );

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

    v_game := jsonb_set(v_game, '{players}', v_public_players, true);
    v_game := jsonb_set(v_game, '{centerCounters}', '0'::jsonb, true);

    if coalesce(cardinality(v_private.draw_deck), 0) > 0 then
      v_next_card := v_private.draw_deck[1];

      if cardinality(v_private.draw_deck) = 1 then
        v_private.draw_deck := '{}'::integer[];
      else
        v_private.draw_deck := v_private.draw_deck[2:cardinality(v_private.draw_deck)];
      end if;

      v_game := jsonb_set(v_game, '{currentCard}', to_jsonb(v_next_card), true);
      v_game := jsonb_set(
        v_game,
        '{deckRemaining}',
        to_jsonb(coalesce(cardinality(v_private.draw_deck), 0)),
        true
      );
    else
      for v_player in
        select p.user_id, p.cards
        from public.no_thanks_room_players as p
        where p.room_id = p_room_id
          and p.membership_status = 'active'
        order by p.seat
      loop
        v_player_score :=
          private.no_thanks_card_score(v_player.cards)
          - coalesce(
              (v_private.player_counters ->> v_player.user_id::text)::integer,
              0
            );

        v_final_scores := v_final_scores || jsonb_build_object(
          v_player.user_id::text,
          v_player_score
        );

        if v_lowest_score is null or v_player_score < v_lowest_score then
          v_lowest_score := v_player_score;
        end if;
      end loop;

      for v_turn_player in
        select value
        from jsonb_array_elements_text(v_game -> 'turnOrder') as ordered(value)
      loop
        if (v_final_scores ->> v_turn_player)::integer = v_lowest_score then
          v_winners := v_winners || jsonb_build_array(v_turn_player);
        end if;
      end loop;

      v_game := jsonb_set(v_game, '{currentCard}', 'null'::jsonb, true);
      v_game := jsonb_set(v_game, '{deckRemaining}', '0'::jsonb, true);
      v_game := jsonb_set(v_game, '{phase}', '"GAME_OVER"'::jsonb, true);
      v_game := jsonb_set(
        v_game,
        '{endReason}',
        '"LAST_CARD_TAKEN"'::jsonb,
        true
      );
      v_game := jsonb_set(v_game, '{finalScores}', v_final_scores, true);
      v_game := jsonb_set(v_game, '{winners}', v_winners, true);
    end if;
  end if;

  update public.no_thanks_room_private_state
  set draw_deck = v_private.draw_deck,
      player_counters = v_private.player_counters,
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
    v_action_type,
    v_payload,
    v_snapshot
  );

  return v_snapshot;
end;
$$;

create or replace function public.no_thanks_leave_room(
  p_room_id uuid,
  p_expected_version bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_room public.no_thanks_rooms%rowtype;
  v_game_phase text;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;

  select *
    into v_room
  from public.no_thanks_rooms
  where id = p_room_id
  for update;

  if not found then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  v_game_phase := coalesce(v_room.game_state ->> 'phase', '');
  if v_room.status = 'playing' and v_game_phase <> 'GAME_OVER' then
    raise exception 'GAME_IN_PROGRESS';
  end if;
  if v_room.status not in ('waiting', 'playing') then
    raise exception 'ROOM_NOT_FOUND';
  end if;
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;
  if not exists (
    select 1
    from public.no_thanks_room_players
    where room_id = p_room_id
      and user_id = v_user_id
      and membership_status = 'active'
  ) then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  if v_room.host_user_id = v_user_id then
    update public.no_thanks_room_players
    set membership_status = 'left',
        left_at = now(),
        is_ready = false
    where room_id = p_room_id
      and membership_status = 'active';

    update public.no_thanks_rooms
    set status = 'closed',
        version = version + 1,
        updated_at = now()
    where id = p_room_id;
  else
    update public.no_thanks_room_players
    set membership_status = 'left',
        left_at = now(),
        is_ready = false
    where room_id = p_room_id
      and user_id = v_user_id;

    update public.no_thanks_rooms
    set version = version + 1,
        updated_at = now()
    where id = p_room_id;
  end if;

  return jsonb_build_object('left', true, 'roomId', p_room_id);
end;
$$;

revoke all on function public.no_thanks_play_action(uuid, text, bigint, text)
  from public, anon, authenticated;
grant execute on function public.no_thanks_play_action(uuid, text, bigint, text)
  to authenticated;

commit;
