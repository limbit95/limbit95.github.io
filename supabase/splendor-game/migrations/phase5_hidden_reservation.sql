-- Phase 5-2: reserve the top card of a selected tier without revealing it first.

alter table public.splendor_action_log
  drop constraint if exists splendor_action_log_action_type_check;

alter table public.splendor_action_log
  add constraint splendor_action_log_action_type_check
  check (action_type = any (array[
    'take_distinct'::text,
    'take_double'::text,
    'return_excess'::text,
    'reserve_faceup'::text,
    'reserve_hidden'::text
  ]));

create or replace function public.splendor_reserve_hidden(
  p_room_id uuid,
  p_tier smallint,
  p_expected_version bigint,
  p_client_action_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_game public.splendor_games%rowtype;
  v_player public.splendor_game_players%rowtype;
  v_card public.splendor_game_cards%rowtype;
  v_existing public.splendor_action_log%rowtype;
  v_bank jsonb;
  v_tokens jsonb;
  v_gold_bank integer;
  v_gold_player integer;
  v_gold_received boolean := false;
  v_total_after integer;
  v_next_seat smallint;
  v_new_version bigint;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if p_client_action_id is null then
    raise exception 'INVALID_ACTION_ID' using errcode = 'P0001';
  end if;
  if p_tier is null or p_tier not in (1, 2, 3) then
    raise exception 'INVALID_TIER' using errcode = 'P0001';
  end if;
  if not private.splendor_is_room_member(p_room_id) then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;

  select * into v_game
  from public.splendor_games
  where room_id = p_room_id
  for update;

  if not found or v_game.status <> 'playing' then
    raise exception 'GAME_NOT_STARTED' using errcode = 'P0001';
  end if;

  select * into v_existing
  from public.splendor_action_log
  where game_id = v_game.id and client_action_id = p_client_action_id;

  if found then
    if v_existing.user_id = v_user_id and v_existing.action_type = 'reserve_hidden' then
      return private.splendor_game_snapshot(v_game.id);
    end if;
    raise exception 'ACTION_ID_REUSED' using errcode = 'P0001';
  end if;

  if v_game.version <> p_expected_version then
    raise exception 'STATE_CHANGED' using errcode = 'P0001';
  end if;
  if v_game.turn_phase <> 'action' then
    raise exception 'RETURN_TOKENS_REQUIRED' using errcode = 'P0001';
  end if;

  select * into v_player
  from public.splendor_game_players
  where game_id = v_game.id
    and user_id = v_user_id
    and status = 'active'
  for update;

  if not found then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;
  if v_player.seat <> v_game.current_turn_seat then
    raise exception 'NOT_YOUR_TURN' using errcode = 'P0001';
  end if;
  if v_player.reserved_card_count >= v_game.max_reserved then
    raise exception 'RESERVE_LIMIT_REACHED' using errcode = 'P0001';
  end if;

  select * into v_card
  from public.splendor_game_cards
  where game_id = v_game.id
    and tier = p_tier
    and location = 'deck'
  order by deck_position
  limit 1
  for update;

  if not found then
    raise exception 'DECK_EMPTY' using errcode = 'P0001';
  end if;

  v_bank := v_game.bank_tokens;
  v_tokens := v_player.tokens;
  v_gold_bank := coalesce((v_bank ->> 'gold')::integer, 0);
  v_gold_player := coalesce((v_tokens ->> 'gold')::integer, 0);

  update public.splendor_game_cards
  set location = 'reserved',
      face_up_slot = null,
      owner_game_player_id = v_player.id,
      reserved_hidden = true
  where id = v_card.id;

  if v_gold_bank > 0 then
    v_bank := jsonb_set(v_bank, '{gold}', to_jsonb(v_gold_bank - 1), true);
    v_tokens := jsonb_set(v_tokens, '{gold}', to_jsonb(v_gold_player + 1), true);
    v_gold_received := true;
  end if;

  update public.splendor_game_players
  set reserved_card_count = reserved_card_count + 1,
      tokens = v_tokens
  where id = v_player.id;

  v_total_after := private.splendor_token_total(v_tokens);
  if v_total_after > v_game.max_tokens then
    update public.splendor_games
    set bank_tokens = v_bank,
        turn_phase = 'return_excess',
        version = version + 1,
        last_action_at = now()
    where id = v_game.id
    returning version into v_new_version;
  else
    v_next_seat := private.splendor_next_active_seat(v_game.id, v_game.current_turn_seat);
    update public.splendor_games
    set bank_tokens = v_bank,
        current_turn_seat = v_next_seat,
        turn_phase = 'action',
        turn_no = turn_no + 1,
        version = version + 1,
        last_action_at = now()
    where id = v_game.id
    returning version into v_new_version;
  end if;

  insert into public.splendor_action_log(
    game_id, user_id, client_action_id, action_type, payload, game_version_after
  ) values (
    v_game.id,
    v_user_id,
    p_client_action_id,
    'reserve_hidden',
    jsonb_build_object(
      'card_instance_id', v_card.id,
      'tier', v_card.tier,
      'gold_received', v_gold_received,
      'reserved_hidden', true
    ),
    v_new_version
  );

  return private.splendor_game_snapshot(v_game.id);
end;
$$;

revoke execute on function public.splendor_reserve_hidden(uuid, smallint, bigint, uuid) from public;
revoke execute on function public.splendor_reserve_hidden(uuid, smallint, bigint, uuid) from anon;
grant execute on function public.splendor_reserve_hidden(uuid, smallint, bigint, uuid) to authenticated;
