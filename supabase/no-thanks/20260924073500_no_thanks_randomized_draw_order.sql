begin;

create or replace function public.no_thanks_start_game(
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
  v_existing public.no_thanks_room_actions%rowtype;
  v_payload jsonb := '{}'::jsonb;
  v_player_count integer;
  v_unready integer;
  v_initial_counters integer;
  v_turn_order uuid[];
  v_cards integer[];
  v_draw_deck integer[];
  v_excluded integer[];
  v_player_counters jsonb;
  v_public_players jsonb;
  v_game jsonb;
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
      or v_existing.action_type <> 'start_game'
      or v_existing.request_payload <> v_payload then
      raise exception 'ACTION_CONFLICT';
    end if;
    return v_existing.response_snapshot;
  end if;

  select * into v_room
  from public.no_thanks_rooms
  where id = p_room_id
  for update;

  if not found or v_room.status <> 'waiting' then
    raise exception 'ROOM_NOT_FOUND';
  end if;
  if v_room.host_user_id <> v_user_id then
    raise exception 'HOST_REQUIRED';
  end if;
  if v_room.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;

  select count(*)
    into v_player_count
  from public.no_thanks_room_players
  where room_id = p_room_id and membership_status = 'active';

  if v_player_count < 3 or v_player_count > 7 then
    raise exception 'PLAYER_COUNT_REQUIRED';
  end if;

  select count(*)
    into v_unready
  from public.no_thanks_room_players
  where room_id = p_room_id
    and membership_status = 'active'
    and user_id <> v_room.host_user_id
    and is_ready = false;

  if v_unready > 0 then
    raise exception 'PLAYERS_NOT_READY';
  end if;

  select array_agg(user_id order by random())
    into v_turn_order
  from public.no_thanks_room_players
  where room_id = p_room_id and membership_status = 'active';

  -- generate_series must produce rows before random() is evaluated.
  -- Keeping the set-returning function in the SELECT list can preserve 3..35 order.
  select array_agg(card order by random())
    into v_cards
  from generate_series(3, 35) as card;

  v_draw_deck := v_cards[1:24];
  v_excluded := v_cards[25:33];

  if v_player_count <= 5 then
    v_initial_counters := 11;
  elsif v_player_count = 6 then
    v_initial_counters := 9;
  else
    v_initial_counters := 7;
  end if;

  select jsonb_object_agg(user_id::text, v_initial_counters)
    into v_player_counters
  from public.no_thanks_room_players
  where room_id = p_room_id and membership_status = 'active';

  select jsonb_agg(
    jsonb_build_object('playerId', p.user_id, 'cards', '[]'::jsonb)
    order by p.seat
  )
    into v_public_players
  from public.no_thanks_room_players as p
  where p.room_id = p_room_id and p.membership_status = 'active';

  v_game := jsonb_build_object(
    'phase', 'PLAYING',
    'turnOrder', to_jsonb(v_turn_order),
    'turnIndex', 0,
    'activePlayerId', v_turn_order[1],
    'currentCard', v_draw_deck[1],
    'centerCounters', 0,
    'deckRemaining', 23,
    'excludedCount', 9,
    'players', coalesce(v_public_players, '[]'::jsonb),
    'winners', '[]'::jsonb,
    'finalScores', null,
    'endReason', null
  );

  insert into public.no_thanks_room_private_state(
    room_id, draw_deck, excluded_cards, player_counters, updated_at
  )
  values (
    p_room_id,
    coalesce(v_draw_deck[2:24], '{}'::integer[]),
    v_excluded,
    v_player_counters,
    now()
  )
  on conflict (room_id) do update
    set draw_deck = excluded.draw_deck,
        excluded_cards = excluded.excluded_cards,
        player_counters = excluded.player_counters,
        updated_at = excluded.updated_at;

  update public.no_thanks_rooms
  set status = 'playing',
      game_state = v_game,
      version = version + 1,
      updated_at = now()
  where id = p_room_id;

  v_snapshot := private.no_thanks_snapshot(p_room_id, v_user_id);

  insert into public.no_thanks_room_actions(
    room_id, client_action_id, actor_user_id, action_type, request_payload, response_snapshot
  )
  values (
    p_room_id, p_client_action_id, v_user_id, 'start_game', v_payload, v_snapshot
  );

  return v_snapshot;
end;
$$;

revoke all on function public.no_thanks_start_game(uuid, bigint, text)
  from public, anon, authenticated;
grant execute on function public.no_thanks_start_game(uuid, bigint, text)
  to authenticated;

commit;
