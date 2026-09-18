alter table public.marble_games
  add column if not exists pending_trade jsonb;

create or replace function private.marble_normalize_trade_terms(p_terms jsonb)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_offered jsonb;
  v_requested jsonb;
  v_offered_ids jsonb;
  v_requested_ids jsonb;
  v_offered_gold integer := 0;
  v_requested_gold integer := 0;
begin
  if p_terms is null or jsonb_typeof(p_terms) <> 'object' then
    raise exception 'TRADE_TERMS_INVALID';
  end if;

  v_offered := coalesce(p_terms->'offered', '{}'::jsonb);
  v_requested := coalesce(p_terms->'requested', '{}'::jsonb);

  if jsonb_typeof(v_offered) <> 'object' or jsonb_typeof(v_requested) <> 'object' then
    raise exception 'TRADE_TERMS_INVALID';
  end if;

  v_offered_ids := coalesce(v_offered->'propertyIds', '[]'::jsonb);
  v_requested_ids := coalesce(v_requested->'propertyIds', '[]'::jsonb);

  if jsonb_typeof(v_offered_ids) <> 'array' or jsonb_typeof(v_requested_ids) <> 'array' then
    raise exception 'TRADE_PROPERTY_IDS_INVALID';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(v_offered_ids) as item(value)
    where jsonb_typeof(item.value) <> 'string'
  ) or exists (
    select 1
    from jsonb_array_elements(v_requested_ids) as item(value)
    where jsonb_typeof(item.value) <> 'string'
  ) then
    raise exception 'TRADE_PROPERTY_IDS_INVALID';
  end if;

  if exists (
    select 1
    from jsonb_array_elements_text(v_offered_ids) as item(value)
    where btrim(item.value) = ''
  ) or exists (
    select 1
    from jsonb_array_elements_text(v_requested_ids) as item(value)
    where btrim(item.value) = ''
  ) then
    raise exception 'TRADE_PROPERTY_IDS_INVALID';
  end if;

  if exists (
    select 1
    from jsonb_array_elements_text(v_offered_ids) as item(value)
    group by item.value
    having count(*) > 1
  ) or exists (
    select 1
    from jsonb_array_elements_text(v_requested_ids) as item(value)
    group by item.value
    having count(*) > 1
  ) then
    raise exception 'TRADE_PROPERTY_DUPLICATE';
  end if;

  if exists (
    select 1
    from jsonb_array_elements_text(v_offered_ids) as offered(value)
    join jsonb_array_elements_text(v_requested_ids) as requested(value)
      on requested.value = offered.value
  ) then
    raise exception 'TRADE_PROPERTY_OVERLAP';
  end if;

  if v_offered ? 'gold' then
    if jsonb_typeof(v_offered->'gold') <> 'number'
      or (v_offered->>'gold') !~ '^[0-9]+$'
      or (v_offered->>'gold')::numeric > 2147483647
    then
      raise exception 'TRADE_GOLD_INVALID';
    end if;
    v_offered_gold := (v_offered->>'gold')::integer;
  end if;

  if v_requested ? 'gold' then
    if jsonb_typeof(v_requested->'gold') <> 'number'
      or (v_requested->>'gold') !~ '^[0-9]+$'
      or (v_requested->>'gold')::numeric > 2147483647
    then
      raise exception 'TRADE_GOLD_INVALID';
    end if;
    v_requested_gold := (v_requested->>'gold')::integer;
  end if;

  if jsonb_array_length(v_offered_ids) = 0
    and jsonb_array_length(v_requested_ids) = 0
    and v_offered_gold = 0
    and v_requested_gold = 0
  then
    raise exception 'TRADE_EMPTY';
  end if;

  return jsonb_build_object(
    'offered', jsonb_build_object(
      'propertyIds', v_offered_ids,
      'gold', v_offered_gold
    ),
    'requested', jsonb_build_object(
      'propertyIds', v_requested_ids,
      'gold', v_requested_gold
    )
  );
end;
$$;

create or replace function private.marble_guard_open_trade_progress()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.pending_trade is null then
    return new;
  end if;

  if new.status <> 'playing' then
    new.pending_trade := null;
    return new;
  end if;

  if new.pending_trade is not null and (
    new.phase is distinct from old.phase
    or new.current_seat is distinct from old.current_seat
    or new.pending_choice is distinct from old.pending_choice
    or new.last_roll is distinct from old.last_roll
  ) then
    raise exception 'TRADE_PENDING';
  end if;

  return new;
end;
$$;

drop trigger if exists marble_guard_open_trade_progress on public.marble_games;
create trigger marble_guard_open_trade_progress
before update on public.marble_games
for each row
execute function private.marble_guard_open_trade_progress();

create or replace function private.marble_game_snapshot(p_room_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_room public.marble_rooms%rowtype;
  v_game public.marble_games%rowtype;
  v_players jsonb;
  v_properties jsonb;
  v_viewer_player_id text;
  v_winner_player_id text;
begin
  select * into v_room
  from public.marble_rooms
  where id = p_room_id;

  if not found or v_room.current_game_id is null then
    raise exception 'GAME_NOT_FOUND';
  end if;

  select * into v_game
  from public.marble_games
  where id = v_room.current_game_id
    and room_id = p_room_id;

  if not found then
    raise exception 'GAME_NOT_FOUND';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', gp.room_player_id::text,
    'userId', gp.user_id,
    'name', gp.nickname,
    'seat', gp.seat,
    'positionIndex', gp.position_index,
    'positionNodeId', n.node_id,
    'money', gp.money,
    'bankrupt', gp.bankrupt,
    'skipTurns', gp.skip_turns
  ) order by gp.seat), '[]'::jsonb)
  into v_players
  from public.marble_game_players gp
  join private.marble_classic_nodes n
    on n.node_index = gp.position_index
  where gp.game_id = v_game.id;

  select coalesce(jsonb_object_agg(p.node_id, jsonb_build_object(
    'ownerId', owner.room_player_id::text,
    'ownerSeat', p.owner_seat,
    'buildingLevel', p.building_level
  )), '{}'::jsonb)
  into v_properties
  from public.marble_game_properties p
  left join public.marble_game_players owner
    on owner.game_id = p.game_id
   and owner.seat = p.owner_seat
  where p.game_id = v_game.id;

  select gp.room_player_id::text
  into v_viewer_player_id
  from public.marble_game_players gp
  where gp.game_id = v_game.id
    and gp.user_id = auth.uid();

  if v_game.winner_seat is not null then
    select gp.room_player_id::text
    into v_winner_player_id
    from public.marble_game_players gp
    where gp.game_id = v_game.id
      and gp.seat = v_game.winner_seat;
  end if;

  return jsonb_build_object(
    'room', jsonb_build_object(
      'id', v_room.id,
      'roomCode', v_room.room_code,
      'status', v_room.status,
      'version', v_room.version,
      'currentGameId', v_room.current_game_id
    ),
    'game', jsonb_build_object(
      'id', v_game.id,
      'status', v_game.status,
      'phase', v_game.phase,
      'turn', v_game.turn_number,
      'currentSeat', v_game.current_seat,
      'version', v_game.version,
      'pendingChoice', v_game.pending_choice,
      'pendingTrade', v_game.pending_trade,
      'lastRoll', v_game.last_roll,
      'lastEvents', v_game.last_events,
      'winnerSeat', v_game.winner_seat,
      'winnerPlayerId', v_winner_player_id,
      'rulesetVersion', v_game.ruleset_version
    ),
    'players', v_players,
    'properties', v_properties,
    'viewerUserId', auth.uid(),
    'viewerPlayerId', v_viewer_player_id
  );
end;
$$;

create or replace function public.marble_trade_offer(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid,
  p_offer_id uuid,
  p_recipient_player_id uuid,
  p_terms jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_room public.marble_rooms%rowtype;
  v_game public.marble_games%rowtype;
  v_actor public.marble_game_players%rowtype;
  v_recipient public.marble_game_players%rowtype;
  v_property public.marble_game_properties%rowtype;
  v_terms jsonb;
  v_request jsonb;
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_node_id text;
  v_offered_gold integer;
  v_requested_gold integer;
  v_trade jsonb;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null or p_offer_id is null then raise exception 'INVALID_ACTION_ID'; end if;
  if p_recipient_player_id is null then raise exception 'TRADE_RECIPIENT_REQUIRED'; end if;

  v_terms := private.marble_normalize_trade_terms(p_terms);
  v_request := jsonb_build_object(
    'action', 'trade_offer',
    'offerId', p_offer_id::text,
    'recipientPlayerId', p_recipient_player_id::text,
    'terms', v_terms
  );

  select * into v_room
  from public.marble_rooms
  where id = p_room_id
  for update;

  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;

  select * into v_game
  from public.marble_games
  where id = v_room.current_game_id
    and room_id = p_room_id
  for update;

  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(
    v_game.id, v_user, p_client_action_id, 'trade_offer', v_request
  );
  if v_replay is not null then return v_replay; end if;

  if v_room.status <> 'playing' or v_game.status <> 'playing' then raise exception 'GAME_NOT_PLAYING'; end if;
  if v_game.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase <> 'WAITING_ROLL' or v_game.pending_choice is not null then raise exception 'TRADE_NOT_ALLOWED'; end if;
  if v_game.pending_trade is not null then raise exception 'TRADE_ALREADY_OPEN'; end if;

  select * into v_actor
  from public.marble_game_players
  where game_id = v_game.id
    and user_id = v_user
  for update;

  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.seat <> v_game.current_seat then raise exception 'NOT_YOUR_TURN'; end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;

  select * into v_recipient
  from public.marble_game_players
  where game_id = v_game.id
    and room_player_id = p_recipient_player_id
  for update;

  if not found then raise exception 'TRADE_RECIPIENT_NOT_FOUND'; end if;
  if v_recipient.id = v_actor.id then raise exception 'TRADE_SELF_NOT_ALLOWED'; end if;
  if v_recipient.bankrupt then raise exception 'TRADE_RECIPIENT_BANKRUPT'; end if;

  for v_node_id in
    select value
    from jsonb_array_elements_text(v_terms #> '{offered,propertyIds}') as item(value)
  loop
    select * into v_property
    from public.marble_game_properties
    where game_id = v_game.id
      and node_id = v_node_id
    for update;

    if not found or v_property.owner_seat is distinct from v_actor.seat then
      raise exception 'TRADE_PROPERTY_NOT_OWNED';
    end if;
    if v_property.building_level > 0 then
      raise exception 'TRADE_IMPROVED_PROPERTY_NOT_ALLOWED';
    end if;
  end loop;

  for v_node_id in
    select value
    from jsonb_array_elements_text(v_terms #> '{requested,propertyIds}') as item(value)
  loop
    select * into v_property
    from public.marble_game_properties
    where game_id = v_game.id
      and node_id = v_node_id
    for update;

    if not found or v_property.owner_seat is distinct from v_recipient.seat then
      raise exception 'TRADE_PROPERTY_NOT_OWNED';
    end if;
    if v_property.building_level > 0 then
      raise exception 'TRADE_IMPROVED_PROPERTY_NOT_ALLOWED';
    end if;
  end loop;

  v_offered_gold := (v_terms #>> '{offered,gold}')::integer;
  v_requested_gold := (v_terms #>> '{requested,gold}')::integer;

  if v_actor.money < v_offered_gold then raise exception 'INSUFFICIENT_GOLD'; end if;
  if v_recipient.money < v_requested_gold then raise exception 'TRADE_RECIPIENT_INSUFFICIENT_GOLD'; end if;

  v_trade := jsonb_build_object(
    'type', 'PLAYER_TRADE',
    'offerId', p_offer_id::text,
    'proposerPlayerId', v_actor.room_player_id::text,
    'recipientPlayerId', v_recipient.room_player_id::text,
    'terms', v_terms,
    'status', 'OPEN',
    'resolvedByPlayerId', null
  );

  v_before := v_game.version;

  update public.marble_games
  set pending_trade = v_trade,
      last_events = jsonb_build_array(jsonb_build_object(
        'type', 'TRADE_OFFERED',
        'offerId', p_offer_id::text,
        'proposerPlayerId', v_actor.room_player_id::text,
        'recipientPlayerId', v_recipient.room_player_id::text,
        'terms', v_terms
      )),
      version = version + 1,
      updated_at = now()
  where id = v_game.id;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(
    v_game.id, v_user, p_client_action_id, 'trade_offer', v_request, v_before, v_response
  );
  return v_response;
end;
$$;

create or replace function public.marble_trade_accept(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid,
  p_offer_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_room public.marble_rooms%rowtype;
  v_game public.marble_games%rowtype;
  v_actor public.marble_game_players%rowtype;
  v_proposer public.marble_game_players%rowtype;
  v_property public.marble_game_properties%rowtype;
  v_trade jsonb;
  v_terms jsonb;
  v_request jsonb;
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_node_id text;
  v_offered_gold integer;
  v_requested_gold integer;
  v_events jsonb;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null or p_offer_id is null then raise exception 'INVALID_ACTION_ID'; end if;

  v_request := jsonb_build_object('action', 'trade_accept', 'offerId', p_offer_id::text);

  select * into v_room
  from public.marble_rooms
  where id = p_room_id
  for update;

  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;

  select * into v_game
  from public.marble_games
  where id = v_room.current_game_id
    and room_id = p_room_id
  for update;

  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(
    v_game.id, v_user, p_client_action_id, 'trade_accept', v_request
  );
  if v_replay is not null then return v_replay; end if;

  if v_room.status <> 'playing' or v_game.status <> 'playing' then raise exception 'GAME_NOT_PLAYING'; end if;
  if v_game.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase <> 'WAITING_ROLL' then raise exception 'TRADE_NOT_ALLOWED'; end if;

  v_trade := v_game.pending_trade;
  if v_trade is null or v_trade->>'type' <> 'PLAYER_TRADE' or v_trade->>'status' <> 'OPEN' then
    raise exception 'TRADE_NOT_OPEN';
  end if;
  if v_trade->>'offerId' <> p_offer_id::text then raise exception 'TRADE_OFFER_MISMATCH'; end if;

  select * into v_actor
  from public.marble_game_players
  where game_id = v_game.id
    and user_id = v_user
  for update;

  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.room_player_id::text <> v_trade->>'recipientPlayerId' then
    raise exception 'TRADE_RECIPIENT_REQUIRED';
  end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;

  select * into v_proposer
  from public.marble_game_players
  where game_id = v_game.id
    and room_player_id::text = v_trade->>'proposerPlayerId'
  for update;

  if not found or v_proposer.bankrupt then raise exception 'TRADE_PROPOSER_INVALID'; end if;

  v_terms := private.marble_normalize_trade_terms(v_trade->'terms');

  for v_node_id in
    select value
    from jsonb_array_elements_text(v_terms #> '{offered,propertyIds}') as item(value)
  loop
    select * into v_property
    from public.marble_game_properties
    where game_id = v_game.id
      and node_id = v_node_id
    for update;

    if not found or v_property.owner_seat is distinct from v_proposer.seat then
      raise exception 'TRADE_PROPERTY_OWNERSHIP_CHANGED';
    end if;
    if v_property.building_level > 0 then
      raise exception 'TRADE_IMPROVED_PROPERTY_NOT_ALLOWED';
    end if;
  end loop;

  for v_node_id in
    select value
    from jsonb_array_elements_text(v_terms #> '{requested,propertyIds}') as item(value)
  loop
    select * into v_property
    from public.marble_game_properties
    where game_id = v_game.id
      and node_id = v_node_id
    for update;

    if not found or v_property.owner_seat is distinct from v_actor.seat then
      raise exception 'TRADE_PROPERTY_OWNERSHIP_CHANGED';
    end if;
    if v_property.building_level > 0 then
      raise exception 'TRADE_IMPROVED_PROPERTY_NOT_ALLOWED';
    end if;
  end loop;

  v_offered_gold := (v_terms #>> '{offered,gold}')::integer;
  v_requested_gold := (v_terms #>> '{requested,gold}')::integer;

  if v_proposer.money < v_offered_gold then raise exception 'INSUFFICIENT_GOLD'; end if;
  if v_actor.money < v_requested_gold then raise exception 'TRADE_RECIPIENT_INSUFFICIENT_GOLD'; end if;

  v_before := v_game.version;

  update public.marble_game_players
  set money = money - v_offered_gold + v_requested_gold
  where id = v_proposer.id;

  update public.marble_game_players
  set money = money - v_requested_gold + v_offered_gold
  where id = v_actor.id;

  for v_node_id in
    select value
    from jsonb_array_elements_text(v_terms #> '{offered,propertyIds}') as item(value)
  loop
    update public.marble_game_properties
    set owner_seat = v_actor.seat
    where game_id = v_game.id
      and node_id = v_node_id;
  end loop;

  for v_node_id in
    select value
    from jsonb_array_elements_text(v_terms #> '{requested,propertyIds}') as item(value)
  loop
    update public.marble_game_properties
    set owner_seat = v_proposer.seat
    where game_id = v_game.id
      and node_id = v_node_id;
  end loop;

  v_events := jsonb_build_array(
    jsonb_build_object(
      'type', 'TRADE_ACCEPTED',
      'offerId', p_offer_id::text,
      'proposerPlayerId', v_proposer.room_player_id::text,
      'recipientPlayerId', v_actor.room_player_id::text
    ),
    jsonb_build_object(
      'type', 'TRADE_SETTLED',
      'offerId', p_offer_id::text,
      'proposerPlayerId', v_proposer.room_player_id::text,
      'recipientPlayerId', v_actor.room_player_id::text,
      'terms', v_terms
    )
  );

  update public.marble_games
  set pending_trade = null,
      last_events = v_events,
      version = version + 1,
      updated_at = now()
  where id = v_game.id;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(
    v_game.id, v_user, p_client_action_id, 'trade_accept', v_request, v_before, v_response
  );
  return v_response;
end;
$$;

create or replace function public.marble_trade_reject(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid,
  p_offer_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_room public.marble_rooms%rowtype;
  v_game public.marble_games%rowtype;
  v_actor public.marble_game_players%rowtype;
  v_trade jsonb;
  v_request jsonb;
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null or p_offer_id is null then raise exception 'INVALID_ACTION_ID'; end if;

  v_request := jsonb_build_object('action', 'trade_reject', 'offerId', p_offer_id::text);

  select * into v_room
  from public.marble_rooms
  where id = p_room_id
  for update;

  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;

  select * into v_game
  from public.marble_games
  where id = v_room.current_game_id
    and room_id = p_room_id
  for update;

  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(
    v_game.id, v_user, p_client_action_id, 'trade_reject', v_request
  );
  if v_replay is not null then return v_replay; end if;

  if v_room.status <> 'playing' or v_game.status <> 'playing' then raise exception 'GAME_NOT_PLAYING'; end if;
  if v_game.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase <> 'WAITING_ROLL' then raise exception 'TRADE_NOT_ALLOWED'; end if;

  v_trade := v_game.pending_trade;
  if v_trade is null or v_trade->>'type' <> 'PLAYER_TRADE' or v_trade->>'status' <> 'OPEN' then
    raise exception 'TRADE_NOT_OPEN';
  end if;
  if v_trade->>'offerId' <> p_offer_id::text then raise exception 'TRADE_OFFER_MISMATCH'; end if;

  select * into v_actor
  from public.marble_game_players
  where game_id = v_game.id
    and user_id = v_user
  for update;

  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.room_player_id::text <> v_trade->>'recipientPlayerId' then
    raise exception 'TRADE_RECIPIENT_REQUIRED';
  end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;

  v_before := v_game.version;

  update public.marble_games
  set pending_trade = null,
      last_events = jsonb_build_array(jsonb_build_object(
        'type', 'TRADE_REJECTED',
        'offerId', p_offer_id::text,
        'proposerPlayerId', v_trade->>'proposerPlayerId',
        'recipientPlayerId', v_trade->>'recipientPlayerId'
      )),
      version = version + 1,
      updated_at = now()
  where id = v_game.id;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(
    v_game.id, v_user, p_client_action_id, 'trade_reject', v_request, v_before, v_response
  );
  return v_response;
end;
$$;


create or replace function public.marble_trade_cancel(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid,
  p_offer_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $
declare
  v_user uuid := auth.uid();
  v_room public.marble_rooms%rowtype;
  v_game public.marble_games%rowtype;
  v_actor public.marble_game_players%rowtype;
  v_trade jsonb;
  v_request jsonb;
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null or p_offer_id is null then raise exception 'INVALID_ACTION_ID'; end if;

  v_request := jsonb_build_object('action', 'trade_cancel', 'offerId', p_offer_id::text);

  select * into v_room
  from public.marble_rooms
  where id = p_room_id
  for update;

  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;

  select * into v_game
  from public.marble_games
  where id = v_room.current_game_id
    and room_id = p_room_id
  for update;

  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(
    v_game.id, v_user, p_client_action_id, 'trade_cancel', v_request
  );
  if v_replay is not null then return v_replay; end if;

  if v_room.status <> 'playing' or v_game.status <> 'playing' then raise exception 'GAME_NOT_PLAYING'; end if;
  if v_game.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase <> 'WAITING_ROLL' then raise exception 'TRADE_NOT_ALLOWED'; end if;

  v_trade := v_game.pending_trade;
  if v_trade is null or v_trade->>'type' <> 'PLAYER_TRADE' or v_trade->>'status' <> 'OPEN' then
    raise exception 'TRADE_NOT_OPEN';
  end if;
  if v_trade->>'offerId' <> p_offer_id::text then raise exception 'TRADE_OFFER_MISMATCH'; end if;

  select * into v_actor
  from public.marble_game_players
  where game_id = v_game.id
    and user_id = v_user
  for update;

  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.room_player_id::text <> v_trade->>'proposerPlayerId' then
    raise exception 'TRADE_PROPOSER_REQUIRED';
  end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;

  v_before := v_game.version;

  update public.marble_games
  set pending_trade = null,
      last_events = jsonb_build_array(jsonb_build_object(
        'type', 'TRADE_CANCELLED',
        'offerId', p_offer_id::text,
        'proposerPlayerId', v_trade->>'proposerPlayerId',
        'recipientPlayerId', v_trade->>'recipientPlayerId'
      )),
      version = version + 1,
      updated_at = now()
  where id = v_game.id;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(
    v_game.id, v_user, p_client_action_id, 'trade_cancel', v_request, v_before, v_response
  );
  return v_response;
end;
$;

revoke all on function private.marble_normalize_trade_terms(jsonb) from public, anon, authenticated;
revoke all on function private.marble_guard_open_trade_progress() from public, anon, authenticated;

revoke all on function public.marble_trade_offer(uuid,bigint,uuid,uuid,uuid,jsonb) from public, anon;
revoke all on function public.marble_trade_accept(uuid,bigint,uuid,uuid) from public, anon;
revoke all on function public.marble_trade_reject(uuid,bigint,uuid,uuid) from public, anon;
revoke all on function public.marble_trade_cancel(uuid,bigint,uuid,uuid) from public, anon;

grant execute on function public.marble_trade_offer(uuid,bigint,uuid,uuid,uuid,jsonb) to authenticated;
grant execute on function public.marble_trade_accept(uuid,bigint,uuid,uuid) to authenticated;
grant execute on function public.marble_trade_reject(uuid,bigint,uuid,uuid) to authenticated;
grant execute on function public.marble_trade_cancel(uuid,bigint,uuid,uuid) to authenticated;
