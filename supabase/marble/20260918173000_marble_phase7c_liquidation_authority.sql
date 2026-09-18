create or replace function private.marble_build_debt_recovery_choice(
  p_game_id uuid,
  p_debtor_seat smallint,
  p_amount_due integer,
  p_creditor_seat smallint,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $debt_choice$
declare
  v_debtor public.marble_game_players%rowtype;
  v_creditor_id text;
  v_catalog jsonb := '[]'::jsonb;
  v_refund_total integer := 0;
begin
  select * into v_debtor
  from public.marble_game_players
  where game_id = p_game_id
    and seat = p_debtor_seat;

  if not found or v_debtor.bankrupt then
    return null;
  end if;

  if v_debtor.money >= p_amount_due then
    return null;
  end if;

  if p_creditor_seat is not null then
    v_creditor_id := private.marble_player_public_id(p_game_id, p_creditor_seat);
  end if;

  select
    coalesce(jsonb_agg(jsonb_build_object(
      'assetId', assets.node_id,
      'refund', assets.refund,
      'buildingLevel', assets.building_level
    ) order by assets.node_id), '[]'::jsonb),
    coalesce(sum(assets.refund), 0)::integer
  into v_catalog, v_refund_total
  from (
    select
      p.node_id,
      p.building_level,
      (
        floor((n.price * 5000)::numeric / 10000)::integer
        + floor((n.build_cost * p.building_level * 5000)::numeric / 10000)::integer
      ) as refund
    from public.marble_game_properties p
    join private.marble_classic_nodes n
      on n.node_id = p.node_id
     and n.node_type = 'PROPERTY'
    where p.game_id = p_game_id
      and p.owner_seat = p_debtor_seat
  ) assets;

  if jsonb_array_length(v_catalog) = 0
    or v_debtor.money + v_refund_total < p_amount_due
  then
    return null;
  end if;

  return jsonb_build_object(
    'type', 'DEBT_RECOVERY',
    'status', 'OPEN',
    'playerId', v_debtor.room_player_id::text,
    'creditorId', v_creditor_id,
    'amountDue', p_amount_due,
    'reason', p_reason,
    'cash', v_debtor.money,
    'shortfall', p_amount_due - v_debtor.money,
    'catalog', v_catalog,
    'selectedAssetIds', '[]'::jsonb,
    'refundTotal', 0,
    'remainingShortfall', p_amount_due - v_debtor.money,
    'ready', false
  );
end;
$debt_choice$;

create or replace function private.marble_guard_debt_recovery_progress()
returns trigger
language plpgsql
set search_path = ''
as $debt_guard$
begin
  if old.pending_choice is null
    or old.pending_choice->>'type' <> 'DEBT_RECOVERY'
  then
    return new;
  end if;

  if new.status <> 'playing' then
    return new;
  end if;

  if current_setting('marble.debt_recovery_opened', true) = '1'
    and new.pending_choice is null
  then
    new.phase := old.phase;
    new.pending_choice := old.pending_choice;
    return new;
  end if;

  if new.pending_choice is not null
    and new.pending_choice->>'type' = 'DEBT_RECOVERY'
    and new.phase = 'WAITING_CHOICE'
    and new.current_seat is not distinct from old.current_seat
  then
    return new;
  end if;

  if current_setting('marble.debt_recovery_confirm', true) = '1'
    and new.pending_choice is null
    and new.phase = 'TURN_END'
  then
    return new;
  end if;

  raise exception 'DEBT_RECOVERY_PENDING';
end;
$debt_guard$;

drop trigger if exists marble_guard_debt_recovery_progress on public.marble_games;
create trigger marble_guard_debt_recovery_progress
before update on public.marble_games
for each row
execute function private.marble_guard_debt_recovery_progress();

create or replace function private.marble_charge_player(
  p_game_id uuid,
  p_seat smallint,
  p_amount integer,
  p_creditor_seat smallint,
  p_reason text,
  p_events jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $charge_player$
declare
  v_player public.marble_game_players%rowtype;
  v_player_id text;
  v_creditor_id text;
  v_events jsonb := coalesce(p_events, '[]'::jsonb);
  v_recovery jsonb;
begin
  select * into v_player
  from public.marble_game_players
  where game_id = p_game_id
    and seat = p_seat
  for update;

  if not found then raise exception 'PLAYER_NOT_FOUND'; end if;

  v_player_id := v_player.room_player_id::text;
  if p_creditor_seat is not null then
    v_creditor_id := private.marble_player_public_id(p_game_id, p_creditor_seat);
  end if;

  if v_player.money < p_amount then
    v_recovery := private.marble_build_debt_recovery_choice(
      p_game_id,
      p_seat,
      p_amount,
      p_creditor_seat,
      p_reason
    );

    if v_recovery is not null then
      perform set_config('marble.debt_recovery_opened', '1', true);

      update public.marble_games
      set phase = 'WAITING_CHOICE',
          pending_choice = v_recovery
      where id = p_game_id;

      return v_events || jsonb_build_array(jsonb_build_object(
        'type', 'DEBT_PAYMENT_REQUIRED',
        'playerId', v_player_id,
        'creditorId', v_creditor_id,
        'amountDue', p_amount,
        'shortfall', p_amount - v_player.money,
        'reason', p_reason
      ));
    end if;

    if p_creditor_seat is not null and v_player.money > 0 then
      update public.marble_game_players
      set money = money + v_player.money
      where game_id = p_game_id
        and seat = p_creditor_seat;
    end if;

    update public.marble_game_players
    set money = 0,
        bankrupt = true
    where game_id = p_game_id
      and seat = p_seat;

    update public.marble_game_properties
    set owner_seat = null,
        building_level = 0
    where game_id = p_game_id
      and owner_seat = p_seat;

    return v_events || jsonb_build_array(jsonb_build_object(
      'type', 'PLAYER_BANKRUPT',
      'playerId', v_player_id,
      'creditorId', v_creditor_id
    ));
  end if;

  update public.marble_game_players
  set money = money - p_amount
  where game_id = p_game_id
    and seat = p_seat;

  if p_creditor_seat is not null then
    update public.marble_game_players
    set money = money + p_amount
    where game_id = p_game_id
      and seat = p_creditor_seat;
  end if;

  return v_events || jsonb_build_array(jsonb_build_object(
    'type', 'MONEY_PAID',
    'playerId', v_player_id,
    'creditorId', v_creditor_id,
    'amount', p_amount,
    'reason', p_reason
  ));
end;
$charge_player$;

create or replace function public.marble_liquidation_select(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid,
  p_asset_ids text[]
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $liquidation_select$
declare
  v_user uuid := auth.uid();
  v_room public.marble_rooms%rowtype;
  v_game public.marble_games%rowtype;
  v_actor public.marble_game_players%rowtype;
  v_choice jsonb;
  v_catalog jsonb;
  v_selected jsonb := '[]'::jsonb;
  v_request jsonb;
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_asset_id text;
  v_refund_total integer := 0;
  v_cash integer;
  v_amount_due integer;
  v_remaining integer;
  v_ready boolean;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;
  if p_asset_ids is null then p_asset_ids := array[]::text[]; end if;

  if cardinality(p_asset_ids) <> (
    select count(distinct asset_id)
    from unnest(p_asset_ids) asset_id
  ) then
    raise exception 'LIQUIDATION_ASSET_DUPLICATE';
  end if;

  v_request := jsonb_build_object(
    'action', 'liquidation_select',
    'assetIds', to_jsonb(p_asset_ids)
  );

  select * into v_room
  from public.marble_rooms
  where id = p_room_id
  for update;

  if not found or v_room.current_game_id is null then
    raise exception 'GAME_NOT_FOUND';
  end if;

  select * into v_game
  from public.marble_games
  where id = v_room.current_game_id
    and room_id = p_room_id
  for update;

  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(
    v_game.id,
    v_user,
    p_client_action_id,
    'liquidation_select',
    v_request
  );
  if v_replay is not null then return v_replay; end if;

  if v_room.status <> 'playing' or v_game.status <> 'playing' then
    raise exception 'GAME_NOT_PLAYING';
  end if;
  if v_game.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;
  if v_game.phase <> 'WAITING_CHOICE'
    or v_game.pending_choice->>'type' <> 'DEBT_RECOVERY'
  then
    raise exception 'DEBT_RECOVERY_NOT_OPEN';
  end if;

  select * into v_actor
  from public.marble_game_players
  where game_id = v_game.id
    and user_id = v_user
  for update;

  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.room_player_id::text <> v_game.pending_choice->>'playerId' then
    raise exception 'DEBT_RECOVERY_DEBTOR_REQUIRED';
  end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;

  v_choice := v_game.pending_choice;
  v_catalog := coalesce(v_choice->'catalog', '[]'::jsonb);
  v_cash := (v_choice->>'cash')::integer;
  v_amount_due := (v_choice->>'amountDue')::integer;

  foreach v_asset_id in array p_asset_ids loop
    if not exists (
      select 1
      from jsonb_array_elements(v_catalog) item
      where item->>'assetId' = v_asset_id
    ) then
      raise exception 'LIQUIDATION_ASSET_NOT_AVAILABLE';
    end if;

    v_refund_total := v_refund_total + (
      select (item->>'refund')::integer
      from jsonb_array_elements(v_catalog) item
      where item->>'assetId' = v_asset_id
      limit 1
    );

    v_selected := v_selected || jsonb_build_array(v_asset_id);
  end loop;

  v_remaining := greatest(0, v_amount_due - (v_cash + v_refund_total));
  v_ready := v_remaining = 0;

  v_choice := jsonb_set(v_choice, '{selectedAssetIds}', v_selected, true);
  v_choice := jsonb_set(v_choice, '{refundTotal}', to_jsonb(v_refund_total), true);
  v_choice := jsonb_set(v_choice, '{remainingShortfall}', to_jsonb(v_remaining), true);
  v_choice := jsonb_set(v_choice, '{ready}', to_jsonb(v_ready), true);
  v_choice := jsonb_set(
    v_choice,
    '{status}',
    to_jsonb(case when v_ready then 'READY' else 'OPEN' end),
    true
  );

  v_before := v_game.version;

  update public.marble_games
  set pending_choice = v_choice,
      last_events = jsonb_build_array(jsonb_build_object(
        'type', 'LIQUIDATION_SELECTION_UPDATED',
        'playerId', v_actor.room_player_id::text,
        'selectedAssetIds', v_selected,
        'refundTotal', v_refund_total,
        'remainingShortfall', v_remaining,
        'ready', v_ready
      )),
      version = version + 1,
      updated_at = now()
  where id = v_game.id;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(
    v_game.id,
    v_user,
    p_client_action_id,
    'liquidation_select',
    v_request,
    v_before,
    v_response
  );

  return v_response;
end;
$liquidation_select$;

create or replace function public.marble_liquidation_confirm(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $liquidation_confirm$
declare
  v_user uuid := auth.uid();
  v_room public.marble_rooms%rowtype;
  v_game public.marble_games%rowtype;
  v_actor public.marble_game_players%rowtype;
  v_creditor public.marble_game_players%rowtype;
  v_property public.marble_game_properties%rowtype;
  v_node private.marble_classic_nodes%rowtype;
  v_choice jsonb;
  v_catalog jsonb;
  v_selected jsonb;
  v_request jsonb := jsonb_build_object('action', 'liquidation_confirm');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_asset_id text;
  v_expected_refund integer;
  v_actual_refund integer;
  v_refund_total integer := 0;
  v_amount_due integer;
  v_starting_cash integer;
  v_creditor_id text;
  v_events jsonb := '[]'::jsonb;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;

  select * into v_room
  from public.marble_rooms
  where id = p_room_id
  for update;

  if not found or v_room.current_game_id is null then
    raise exception 'GAME_NOT_FOUND';
  end if;

  select * into v_game
  from public.marble_games
  where id = v_room.current_game_id
    and room_id = p_room_id
  for update;

  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(
    v_game.id,
    v_user,
    p_client_action_id,
    'liquidation_confirm',
    v_request
  );
  if v_replay is not null then return v_replay; end if;

  if v_room.status <> 'playing' or v_game.status <> 'playing' then
    raise exception 'GAME_NOT_PLAYING';
  end if;
  if v_game.version <> p_expected_version then
    raise exception 'VERSION_CONFLICT';
  end if;
  if v_game.phase <> 'WAITING_CHOICE'
    or v_game.pending_choice->>'type' <> 'DEBT_RECOVERY'
  then
    raise exception 'DEBT_RECOVERY_NOT_OPEN';
  end if;

  v_choice := v_game.pending_choice;
  if coalesce((v_choice->>'ready')::boolean, false) is not true
    or v_choice->>'status' <> 'READY'
  then
    raise exception 'DEBT_RECOVERY_NOT_READY';
  end if;

  select * into v_actor
  from public.marble_game_players
  where game_id = v_game.id
    and user_id = v_user
  for update;

  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.room_player_id::text <> v_choice->>'playerId' then
    raise exception 'DEBT_RECOVERY_DEBTOR_REQUIRED';
  end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;

  v_starting_cash := (v_choice->>'cash')::integer;
  v_amount_due := (v_choice->>'amountDue')::integer;
  v_creditor_id := nullif(v_choice->>'creditorId', '');

  if v_actor.money <> v_starting_cash then
    raise exception 'DEBT_RECOVERY_CASH_CHANGED';
  end if;

  if v_creditor_id is not null then
    select * into v_creditor
    from public.marble_game_players
    where game_id = v_game.id
      and room_player_id::text = v_creditor_id
    for update;

    if not found or v_creditor.bankrupt then
      raise exception 'DEBT_RECOVERY_CREDITOR_INVALID';
    end if;
  end if;

  v_catalog := coalesce(v_choice->'catalog', '[]'::jsonb);
  v_selected := coalesce(v_choice->'selectedAssetIds', '[]'::jsonb);

  if jsonb_array_length(v_selected) = 0 then
    raise exception 'DEBT_RECOVERY_NOT_READY';
  end if;

  for v_asset_id in
    select value
    from jsonb_array_elements_text(v_selected) item(value)
  loop
    select * into v_property
    from public.marble_game_properties
    where game_id = v_game.id
      and node_id = v_asset_id
    for update;

    if not found or v_property.owner_seat is distinct from v_actor.seat then
      raise exception 'DEBT_RECOVERY_OWNERSHIP_CHANGED';
    end if;

    select * into v_node
    from private.marble_classic_nodes
    where node_id = v_asset_id
      and node_type = 'PROPERTY';

    if not found then raise exception 'DEBT_RECOVERY_ASSET_INVALID'; end if;

    v_expected_refund := (
      select (item->>'refund')::integer
      from jsonb_array_elements(v_catalog) item
      where item->>'assetId' = v_asset_id
      limit 1
    );

    if v_expected_refund is null then
      raise exception 'DEBT_RECOVERY_ASSET_INVALID';
    end if;

    if v_property.building_level <> (
      select (item->>'buildingLevel')::smallint
      from jsonb_array_elements(v_catalog) item
      where item->>'assetId' = v_asset_id
      limit 1
    ) then
      raise exception 'DEBT_RECOVERY_BUILDING_CHANGED';
    end if;

    v_actual_refund :=
      floor((v_node.price * 5000)::numeric / 10000)::integer
      + floor((v_node.build_cost * v_property.building_level * 5000)::numeric / 10000)::integer;

    if v_actual_refund <> v_expected_refund then
      raise exception 'DEBT_RECOVERY_REFUND_CHANGED';
    end if;

    v_refund_total := v_refund_total + v_actual_refund;

    update public.marble_game_properties
    set owner_seat = null,
        building_level = 0
    where game_id = v_game.id
      and node_id = v_asset_id;

    v_events := v_events || jsonb_build_array(jsonb_build_object(
      'type', 'PROPERTY_LIQUIDATED',
      'playerId', v_actor.room_player_id::text,
      'nodeId', v_asset_id,
      'refund', v_actual_refund,
      'buildingLevel', v_property.building_level
    ));
  end loop;

  if v_refund_total <> (v_choice->>'refundTotal')::integer then
    raise exception 'DEBT_RECOVERY_REFUND_CHANGED';
  end if;

  if v_starting_cash + v_refund_total < v_amount_due then
    raise exception 'DEBT_RECOVERY_NO_LONGER_COVERS_DEBT';
  end if;

  update public.marble_game_players
  set money = v_starting_cash + v_refund_total - v_amount_due
  where id = v_actor.id;

  if v_creditor_id is not null then
    update public.marble_game_players
    set money = money + v_amount_due
    where id = v_creditor.id;
  end if;

  v_events := v_events || jsonb_build_array(
    jsonb_build_object(
      'type', 'MONEY_PAID',
      'playerId', v_actor.room_player_id::text,
      'creditorId', v_creditor_id,
      'amount', v_amount_due,
      'reason', v_choice->>'reason'
    ),
    jsonb_build_object(
      'type', 'DEBT_RECOVERED',
      'playerId', v_actor.room_player_id::text,
      'creditorId', v_creditor_id,
      'amountDue', v_amount_due,
      'refundTotal', v_refund_total,
      'remainingCash', v_starting_cash + v_refund_total - v_amount_due,
      'liquidatedAssetIds', v_selected
    )
  );

  v_before := v_game.version;
  perform set_config('marble.debt_recovery_confirm', '1', true);

  update public.marble_games
  set phase = 'TURN_END',
      pending_choice = null,
      last_events = v_events,
      version = version + 1,
      updated_at = now()
  where id = v_game.id;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(
    v_game.id,
    v_user,
    p_client_action_id,
    'liquidation_confirm',
    v_request,
    v_before,
    v_response
  );

  return v_response;
end;
$liquidation_confirm$;

revoke all on function private.marble_build_debt_recovery_choice(uuid,smallint,integer,smallint,text)
  from public, anon, authenticated;
revoke all on function private.marble_guard_debt_recovery_progress()
  from public, anon, authenticated;
revoke all on function private.marble_charge_player(uuid,smallint,integer,smallint,text,jsonb)
  from public, anon, authenticated;

revoke all on function public.marble_liquidation_select(uuid,bigint,uuid,text[])
  from public, anon;
revoke all on function public.marble_liquidation_confirm(uuid,bigint,uuid)
  from public, anon;

grant execute on function public.marble_liquidation_select(uuid,bigint,uuid,text[])
  to authenticated;
grant execute on function public.marble_liquidation_confirm(uuid,bigint,uuid)
  to authenticated;
