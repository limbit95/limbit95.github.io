-- Splendor Phase 5: reserve a face-up development card.
-- Applied to Supabase as migration: splendor_phase5_faceup_reservation.

alter table public.splendor_action_log
  drop constraint if exists splendor_action_log_action_type_check;

alter table public.splendor_action_log
  add constraint splendor_action_log_action_type_check
  check (action_type in ('take_distinct','take_double','return_excess','reserve_faceup'));

create or replace function private.splendor_game_snapshot(p_game_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_result jsonb;
begin
  if not private.splendor_is_game_member(p_game_id) then
    return null;
  end if;

  select jsonb_build_object(
    'game', jsonb_build_object(
      'id', g.id,
      'room_id', g.room_id,
      'room_code', r.room_code,
      'ruleset_key', g.ruleset_key,
      'status', g.status,
      'version', g.version,
      'turn_no', g.turn_no,
      'turn_phase', g.turn_phase,
      'starting_player_seat', g.starting_player_seat,
      'current_turn_seat', g.current_turn_seat,
      'bank_tokens', g.bank_tokens,
      'target_score', g.target_score,
      'max_tokens', g.max_tokens,
      'max_reserved', g.max_reserved,
      'started_at', g.started_at,
      'last_action_at', g.last_action_at
    ),
    'players', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', gp.id,
          'user_id', gp.user_id,
          'nickname', gp.nickname,
          'seat', gp.seat,
          'score', gp.score,
          'tokens', gp.tokens,
          'token_count', private.splendor_token_total(gp.tokens),
          'bonuses', gp.bonuses,
          'purchased_card_count', gp.purchased_card_count,
          'reserved_card_count', gp.reserved_card_count,
          'is_current_turn', gp.seat = g.current_turn_seat
        ) order by gp.seat
      )
      from public.splendor_game_players gp
      where gp.game_id = g.id and gp.status = 'active'
    ), '[]'::jsonb),
    'self', (
      select jsonb_build_object(
        'id', gp.id,
        'user_id', gp.user_id,
        'nickname', gp.nickname,
        'seat', gp.seat,
        'score', gp.score,
        'tokens', gp.tokens,
        'token_count', private.splendor_token_total(gp.tokens),
        'must_return_count', case
          when gp.seat = g.current_turn_seat and g.turn_phase = 'return_excess'
            then greatest(private.splendor_token_total(gp.tokens) - g.max_tokens, 0)
          else 0
        end,
        'bonuses', gp.bonuses,
        'purchased_card_count', gp.purchased_card_count,
        'reserved_card_count', gp.reserved_card_count,
        'is_current_turn', gp.seat = g.current_turn_seat
      )
      from public.splendor_game_players gp
      where gp.game_id = g.id
        and gp.user_id = (select auth.uid())
      limit 1
    ),
    'cards', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'instance_id', gc.id,
          'card_key', cc.card_key,
          'tier', cc.tier,
          'slot', gc.face_up_slot,
          'bonus', cc.bonus_color,
          'prestige', cc.prestige,
          'cost', cc.cost,
          'title', cc.title,
          'image_path', cc.image_path
        ) order by cc.tier desc, gc.face_up_slot
      )
      from public.splendor_game_cards gc
      join public.splendor_card_catalog cc on cc.id = gc.catalog_card_id
      where gc.game_id = g.id and gc.location = 'face_up'
    ), '[]'::jsonb),
    'reserved_cards', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'instance_id', gc.id,
          'card_key', cc.card_key,
          'tier', cc.tier,
          'bonus', cc.bonus_color,
          'prestige', cc.prestige,
          'cost', cc.cost,
          'title', cc.title,
          'image_path', cc.image_path,
          'reserved_hidden', gc.reserved_hidden
        ) order by gc.created_at, gc.id
      )
      from public.splendor_game_cards gc
      join public.splendor_card_catalog cc on cc.id = gc.catalog_card_id
      join public.splendor_game_players owner on owner.id = gc.owner_game_player_id
      where gc.game_id = g.id
        and gc.location = 'reserved'
        and owner.user_id = (select auth.uid())
    ), '[]'::jsonb),
    'decks', jsonb_build_object(
      '1', (select count(*) from public.splendor_game_cards gc where gc.game_id = g.id and gc.tier = 1 and gc.location = 'deck'),
      '2', (select count(*) from public.splendor_game_cards gc where gc.game_id = g.id and gc.tier = 2 and gc.location = 'deck'),
      '3', (select count(*) from public.splendor_game_cards gc where gc.game_id = g.id and gc.tier = 3 and gc.location = 'deck')
    ),
    'nobles', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'instance_id', gn.id,
          'noble_key', nc.noble_key,
          'prestige', nc.prestige,
          'requirements', nc.requirements,
          'title', nc.title,
          'image_path', nc.image_path,
          'display_order', gn.display_order,
          'status', gn.status
        ) order by gn.display_order
      )
      from public.splendor_game_nobles gn
      join public.splendor_noble_catalog nc on nc.id = gn.catalog_noble_id
      where gn.game_id = g.id
    ), '[]'::jsonb)
  ) into v_result
  from public.splendor_games g
  join public.splendor_rooms r on r.id = g.room_id
  where g.id = p_game_id;

  return v_result;
end;
$$;

revoke all on function private.splendor_game_snapshot(uuid) from public, anon, authenticated;

create or replace function public.splendor_reserve_faceup(
  p_room_id uuid,
  p_card_instance_id uuid,
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
  v_replacement public.splendor_game_cards%rowtype;
  v_existing public.splendor_action_log%rowtype;
  v_bank jsonb;
  v_tokens jsonb;
  v_gold_bank integer;
  v_gold_player integer;
  v_gold_received boolean := false;
  v_total_after integer;
  v_next_seat smallint;
  v_new_version bigint;
  v_old_slot smallint;
  v_old_tier smallint;
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
    if v_existing.user_id = v_user_id and v_existing.action_type = 'reserve_faceup' then
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
  where id = p_card_instance_id
    and game_id = v_game.id
    and location = 'face_up'
    and face_up_slot is not null
  for update;

  if not found then
    raise exception 'CARD_NOT_AVAILABLE' using errcode = 'P0001';
  end if;

  v_old_slot := v_card.face_up_slot;
  v_old_tier := v_card.tier;
  v_bank := v_game.bank_tokens;
  v_tokens := v_player.tokens;
  v_gold_bank := coalesce((v_bank ->> 'gold')::integer, 0);
  v_gold_player := coalesce((v_tokens ->> 'gold')::integer, 0);

  update public.splendor_game_cards
  set location = 'reserved',
      face_up_slot = null,
      owner_game_player_id = v_player.id,
      reserved_hidden = false
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
    'reserve_faceup',
    jsonb_build_object(
      'card_instance_id', v_card.id,
      'tier', v_old_tier,
      'slot', v_old_slot,
      'gold_received', v_gold_received,
      'replacement_card_instance_id', case when v_replacement.id is null then null else v_replacement.id end
    ),
    v_new_version
  );

  return private.splendor_game_snapshot(v_game.id);
end;
$$;

revoke all on function public.splendor_reserve_faceup(uuid, uuid, bigint, uuid) from public, anon, authenticated;
grant execute on function public.splendor_reserve_faceup(uuid, uuid, bigint, uuid) to authenticated;
