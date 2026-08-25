-- Phase 6: face-up Development card purchase.
-- Server-authoritative payment validation, permanent bonus discounts,
-- Gold wildcards, card ownership, score/bonus updates, refill and turn advance.

alter table public.splendor_action_log
  drop constraint if exists splendor_action_log_action_type_check;

alter table public.splendor_action_log
  add constraint splendor_action_log_action_type_check
  check (action_type = any (array[
    'take_distinct'::text,
    'take_double'::text,
    'return_excess'::text,
    'reserve_faceup'::text,
    'reserve_hidden'::text,
    'purchase_faceup'::text
  ]));

create or replace function public.splendor_purchase_faceup(
  p_room_id uuid,
  p_card_instance_id uuid,
  p_payment jsonb,
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
  v_catalog public.splendor_card_catalog%rowtype;
  v_replacement public.splendor_game_cards%rowtype;
  v_existing public.splendor_action_log%rowtype;
  v_colors text[] := array['white','blue','green','red','black'];
  v_color text;
  v_cost jsonb;
  v_bonuses jsonb;
  v_required jsonb := jsonb_build_object('white',0,'blue',0,'green',0,'red',0,'black',0);
  v_normalized_payment jsonb := jsonb_build_object('white',0,'blue',0,'green',0,'red',0,'black',0,'gold',0);
  v_tokens jsonb;
  v_bank jsonb;
  v_required_amount integer;
  v_cost_amount integer;
  v_bonus_amount integer;
  v_paid_amount integer;
  v_owned_amount integer;
  v_gold_paid integer;
  v_gold_owned integer;
  v_gold_needed integer := 0;
  v_old_slot smallint;
  v_old_tier smallint;
  v_next_seat smallint;
  v_new_version bigint;
  v_bonus_before integer;
  v_payment_text text;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;
  if p_client_action_id is null then
    raise exception 'INVALID_ACTION_ID' using errcode = 'P0001';
  end if;
  if p_card_instance_id is null then
    raise exception 'INVALID_CARD_ID' using errcode = 'P0001';
  end if;
  if p_payment is null or jsonb_typeof(p_payment) <> 'object' then
    raise exception 'INVALID_PAYMENT' using errcode = 'P0001';
  end if;
  if exists (
    select 1
    from jsonb_object_keys(p_payment) as k(key)
    where k.key <> all(array['white','blue','green','red','black','gold'])
  ) then
    raise exception 'INVALID_PAYMENT' using errcode = 'P0001';
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
    if v_existing.user_id = v_user_id and v_existing.action_type = 'purchase_faceup' then
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

  select gc.* into v_card
  from public.splendor_game_cards gc
  where gc.id = p_card_instance_id
    and gc.game_id = v_game.id
    and gc.location = 'face_up'
    and gc.face_up_slot is not null
  for update;

  if not found then
    raise exception 'CARD_NOT_AVAILABLE' using errcode = 'P0001';
  end if;

  select * into v_catalog
  from public.splendor_card_catalog
  where id = v_card.catalog_card_id;

  if not found then
    raise exception 'CARD_NOT_AVAILABLE' using errcode = 'P0001';
  end if;

  v_cost := v_catalog.cost;
  v_bonuses := v_player.bonuses;
  v_tokens := v_player.tokens;
  v_bank := v_game.bank_tokens;

  foreach v_color in array v_colors loop
    v_payment_text := p_payment ->> v_color;
    if v_payment_text is not null and v_payment_text !~ '^[0-9]+$' then
      raise exception 'INVALID_PAYMENT' using errcode = 'P0001';
    end if;

    v_cost_amount := coalesce((v_cost ->> v_color)::integer, 0);
    v_bonus_amount := coalesce((v_bonuses ->> v_color)::integer, 0);
    v_required_amount := greatest(v_cost_amount - v_bonus_amount, 0);
    v_paid_amount := coalesce(v_payment_text::integer, 0);
    v_owned_amount := coalesce((v_tokens ->> v_color)::integer, 0);

    if v_paid_amount > v_required_amount then
      raise exception 'PAYMENT_MISMATCH' using errcode = 'P0001';
    end if;
    if v_paid_amount > v_owned_amount then
      raise exception 'INSUFFICIENT_TOKENS' using errcode = 'P0001';
    end if;

    v_gold_needed := v_gold_needed + (v_required_amount - v_paid_amount);
    v_required := jsonb_set(v_required, array[v_color], to_jsonb(v_required_amount), true);
    v_normalized_payment := jsonb_set(v_normalized_payment, array[v_color], to_jsonb(v_paid_amount), true);
  end loop;

  v_payment_text := p_payment ->> 'gold';
  if v_payment_text is not null and v_payment_text !~ '^[0-9]+$' then
    raise exception 'INVALID_PAYMENT' using errcode = 'P0001';
  end if;
  v_gold_paid := coalesce(v_payment_text::integer, 0);
  v_gold_owned := coalesce((v_tokens ->> 'gold')::integer, 0);

  if v_gold_paid <> v_gold_needed then
    raise exception 'PAYMENT_MISMATCH' using errcode = 'P0001';
  end if;
  if v_gold_paid > v_gold_owned then
    raise exception 'INSUFFICIENT_TOKENS' using errcode = 'P0001';
  end if;
  v_normalized_payment := jsonb_set(v_normalized_payment, '{gold}', to_jsonb(v_gold_paid), true);

  foreach v_color in array array['white','blue','green','red','black','gold'] loop
    v_paid_amount := coalesce((v_normalized_payment ->> v_color)::integer, 0);
    if v_paid_amount > 0 then
      v_tokens := jsonb_set(v_tokens, array[v_color], to_jsonb(coalesce((v_tokens ->> v_color)::integer, 0) - v_paid_amount), true);
      v_bank := jsonb_set(v_bank, array[v_color], to_jsonb(coalesce((v_bank ->> v_color)::integer, 0) + v_paid_amount), true);
    end if;
  end loop;

  v_old_slot := v_card.face_up_slot;
  v_old_tier := v_card.tier;

  update public.splendor_game_cards
  set location = 'purchased',
      face_up_slot = null,
      owner_game_player_id = v_player.id,
      reserved_hidden = false
  where id = v_card.id;

  select * into v_replacement
  from public.splendor_game_cards
  where game_id = v_game.id
    and tier = v_old_tier
    and location = 'deck'
  order by deck_position
  limit 1
  for update;

  if found then
    update public.splendor_game_cards
    set location = 'face_up',
        face_up_slot = v_old_slot,
        owner_game_player_id = null,
        reserved_hidden = false
    where id = v_replacement.id;
  end if;

  v_bonus_before := coalesce((v_bonuses ->> v_catalog.bonus_color)::integer, 0);
  v_bonuses := jsonb_set(v_bonuses, array[v_catalog.bonus_color], to_jsonb(v_bonus_before + 1), true);

  update public.splendor_game_players
  set tokens = v_tokens,
      bonuses = v_bonuses,
      score = score + v_catalog.prestige,
      purchased_card_count = purchased_card_count + 1
  where id = v_player.id;

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

  insert into public.splendor_action_log(
    game_id, user_id, client_action_id, action_type, payload, game_version_after
  ) values (
    v_game.id,
    v_user_id,
    p_client_action_id,
    'purchase_faceup',
    jsonb_build_object(
      'card_instance_id', v_card.id,
      'card_key', v_catalog.card_key,
      'tier', v_old_tier,
      'slot', v_old_slot,
      'prestige', v_catalog.prestige,
      'bonus', v_catalog.bonus_color,
      'required_cost', v_required,
      'payment', v_normalized_payment,
      'replacement_card_instance_id', case when v_replacement.id is null then null else v_replacement.id end
    ),
    v_new_version
  );

  return private.splendor_game_snapshot(v_game.id);
end;
$$;

revoke all on function public.splendor_purchase_faceup(uuid, uuid, jsonb, bigint, uuid) from public;
revoke all on function public.splendor_purchase_faceup(uuid, uuid, jsonb, bigint, uuid) from anon;
grant execute on function public.splendor_purchase_faceup(uuid, uuid, jsonb, bigint, uuid) to authenticated;
