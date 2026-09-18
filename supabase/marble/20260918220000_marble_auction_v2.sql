-- Marble Auction v2
-- Request 10s -> recruitment 10s -> sole auto-buy or ordered competitive bidding.
-- Keeps existing snapshot/version/idempotency contracts and replaces only Auction RPC behavior.


-- Expose the database clock with every authoritative snapshot so Auction v2
-- countdowns are independent of the player's local device clock.
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
    'serverNow', now(),
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

create or replace function private.marble_auction_v2_next_turn(
  p_participants jsonb,
  p_passed jsonb,
  p_highest_bidder text,
  p_after_player text
)
returns text
language plpgsql
set search_path = public, private, pg_temp
as $$
declare
  v_ids text[];
  v_len integer;
  v_start integer := 0;
  v_offset integer;
  v_index integer;
  v_candidate text;
begin
  select coalesce(array_agg(value order by ordinality), array[]::text[])
  into v_ids
  from jsonb_array_elements_text(coalesce(p_participants, '[]'::jsonb))
    with ordinality as participant(value, ordinality);

  v_len := coalesce(array_length(v_ids, 1), 0);
  if v_len = 0 then return null; end if;

  for v_index in 1..v_len loop
    if v_ids[v_index] = p_after_player then
      v_start := v_index;
      exit;
    end if;
  end loop;

  for v_offset in 1..v_len loop
    v_index := ((v_start - 1 + v_offset) % v_len) + 1;
    v_candidate := v_ids[v_index];
    if not (coalesce(p_passed, '[]'::jsonb) ? v_candidate)
       and (p_highest_bidder is null or v_candidate <> p_highest_bidder) then
      return v_candidate;
    end if;
  end loop;

  return null;
end;
$$;

create or replace function private.marble_auction_v2_auto_pass(
  p_game_id uuid,
  p_auction jsonb
)
returns jsonb
language plpgsql
set search_path = public, private, pg_temp
as $$
declare
  v_auction jsonb := p_auction;
  v_passed jsonb := coalesce(p_auction->'passedPlayerIds', '[]'::jsonb);
  v_events jsonb := '[]'::jsonb;
  v_highest integer := coalesce((p_auction->>'highestBid')::integer, 0);
  v_minimum integer;
  v_highest_bidder text := p_auction->>'highestBidderId';
  v_player_id text;
  v_player public.marble_game_players%rowtype;
begin
  v_minimum := case
    when v_highest > 0 then v_highest + 1
    else (p_auction->>'openingBid')::integer
  end;

  for v_player_id in
    select value
    from jsonb_array_elements_text(coalesce(p_auction->'participantPlayerIds', '[]'::jsonb))
  loop
    if v_player_id = v_highest_bidder or v_passed ? v_player_id then
      continue;
    end if;

    select * into v_player
    from public.marble_game_players
    where game_id = p_game_id
      and room_player_id::text = v_player_id;

    if not found then
      raise exception 'AUCTION_PLAYER_MISSING';
    end if;

    if v_player.bankrupt or v_player.money < v_minimum then
      v_passed := v_passed || jsonb_build_array(v_player_id);
      v_events := v_events || jsonb_build_array(jsonb_build_object(
        'type','AUCTION_AUTO_PASSED',
        'playerId',v_player_id,
        'nodeId',p_auction->>'nodeId',
        'reason','INSUFFICIENT_GOLD'
      ));
    end if;
  end loop;

  v_auction := jsonb_set(v_auction, '{passedPlayerIds}', v_passed);
  return jsonb_build_object('auction', v_auction, 'events', v_events);
end;
$$;

create or replace function private.marble_auction_v2_settle(
  p_game_id uuid,
  p_auction jsonb,
  p_events jsonb,
  p_auto_purchase boolean default false
)
returns void
language plpgsql
set search_path = public, private, pg_temp
as $$
declare
  v_winner public.marble_game_players%rowtype;
  v_property public.marble_game_properties%rowtype;
  v_winner_id text := p_auction->>'highestBidderId';
  v_amount integer := coalesce((p_auction->>'highestBid')::integer, 0);
  v_node_id text := p_auction->>'nodeId';
  v_events jsonb := coalesce(p_events, '[]'::jsonb);
begin
  if v_winner_id is null or v_amount <= 0 then raise exception 'AUCTION_WINNER_INVALID'; end if;

  select * into v_winner
  from public.marble_game_players
  where game_id=p_game_id and room_player_id::text=v_winner_id
  for update;
  if not found or v_winner.bankrupt or v_winner.money < v_amount then
    raise exception 'AUCTION_WINNER_INVALID';
  end if;

  select * into v_property
  from public.marble_game_properties
  where game_id=p_game_id and node_id=v_node_id
  for update;
  if not found or v_property.owner_seat is not null then
    raise exception 'PROPERTY_NOT_AVAILABLE';
  end if;

  update public.marble_game_players
  set money = money - v_amount
  where id = v_winner.id;

  update public.marble_game_properties
  set owner_seat = v_winner.seat, building_level = 0
  where game_id=p_game_id and node_id=v_node_id;

  if p_auto_purchase then
    v_events := v_events || jsonb_build_array(jsonb_build_object(
      'type','AUCTION_AUTO_PURCHASED',
      'nodeId',v_node_id,
      'playerId',v_winner_id,
      'amount',v_amount
    ));
  end if;

  v_events := v_events || jsonb_build_array(
    jsonb_build_object(
      'type','AUCTION_WON',
      'nodeId',v_node_id,
      'winnerPlayerId',v_winner_id,
      'amount',v_amount
    ),
    jsonb_build_object(
      'type','PROPERTY_BOUGHT',
      'playerId',v_winner_id,
      'nodeId',v_node_id,
      'amount',v_amount,
      'reason','AUCTION'
    )
  );

  update public.marble_games
  set phase='TURN_END',
      pending_choice=null,
      last_events=v_events,
      version=version+1,
      updated_at=now()
  where id=p_game_id;
end;
$$;

revoke all on function private.marble_auction_v2_next_turn(jsonb,jsonb,text,text) from public, anon, authenticated;
revoke all on function private.marble_auction_v2_auto_pass(uuid,jsonb) from public, anon, authenticated;
revoke all on function private.marble_auction_v2_settle(uuid,jsonb,jsonb,boolean) from public, anon, authenticated;

create or replace function public.marble_decline_property_for_auction(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid
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
  v_property public.marble_game_properties%rowtype;
  v_node private.marble_classic_nodes%rowtype;
  v_request jsonb := jsonb_build_object('action','auction_decline_v2');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_node_id text;
  v_base_price integer;
  v_opening_bid integer;
  v_eligible jsonb;
  v_events jsonb;
  v_deadline timestamptz;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;

  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id=v_room.current_game_id and room_id=p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(v_game.id,v_user,p_client_action_id,'auction_decline_v2',v_request);
  if v_replay is not null then return v_replay; end if;
  if v_room.status<>'playing' or v_game.status<>'playing' then raise exception 'GAME_NOT_PLAYING'; end if;
  if v_game.version<>p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase<>'WAITING_CHOICE' or v_game.pending_choice->>'type'<>'BUY_PROPERTY' then
    raise exception 'PROPERTY_DECLINE_NOT_ALLOWED';
  end if;

  select * into v_actor
  from public.marble_game_players
  where game_id=v_game.id and user_id=v_user
  for update;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.seat<>v_game.current_seat then raise exception 'NOT_YOUR_TURN'; end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;

  v_node_id := v_game.pending_choice->>'nodeId';
  v_base_price := (v_game.pending_choice->>'price')::integer;
  v_opening_bid := round(v_base_price::numeric * 1.5)::integer;
  v_deadline := now() + interval '10 seconds';

  select * into v_node
  from private.marble_classic_nodes
  where node_id=v_node_id and node_type='PROPERTY';
  if not found then raise exception 'PROPERTY_NOT_FOUND'; end if;

  select * into v_property
  from public.marble_game_properties
  where game_id=v_game.id and node_id=v_node_id
  for update;
  if not found or v_property.owner_seat is not null then raise exception 'PROPERTY_NOT_AVAILABLE'; end if;

  select coalesce(jsonb_agg(gp.room_player_id::text order by gp.seat), '[]'::jsonb)
  into v_eligible
  from public.marble_game_players gp
  where gp.game_id=v_game.id
    and gp.seat<>v_actor.seat
    and not gp.bankrupt
    and gp.money>=v_opening_bid;

  v_before := v_game.version;
  v_events := jsonb_build_array(jsonb_build_object(
    'type','CHOICE_DECLINED',
    'playerId',v_actor.room_player_id::text,
    'choiceType','BUY_PROPERTY'
  ));

  v_events := v_events || jsonb_build_array(jsonb_build_object(
    'type','AUCTION_REQUEST_OPENED',
    'nodeId',v_node_id,
    'openingBid',v_opening_bid,
    'declinedByPlayerId',v_actor.room_player_id::text,
    'eligiblePlayerIds',v_eligible,
    'deadlineAt',v_deadline
  ));
  update public.marble_games
  set pending_choice=jsonb_build_object(
    'type','AUCTION_REQUEST',
    'nodeId',v_node_id,
    'basePrice',v_base_price,
    'openingBid',v_opening_bid,
    'declinedByPlayerId',v_actor.room_player_id::text,
    'eligiblePlayerIds',v_eligible,
    'requestedByPlayerIds','[]'::jsonb,
    'deadlineAt',v_deadline
  ),
  last_events=v_events,
  version=version+1,
  updated_at=now()
  where id=v_game.id;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'auction_decline_v2',v_request,v_before,v_response);
  return v_response;
end;
$$;

create or replace function public.marble_request_auction(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid
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
  v_request jsonb := jsonb_build_object('action','auction_request_v2');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_player_id text;
  v_participants jsonb;
  v_deadline timestamptz;
  v_type text;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;

  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id=v_room.current_game_id and room_id=p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(v_game.id,v_user,p_client_action_id,'auction_request_v2',v_request);
  if v_replay is not null then return v_replay; end if;
  if v_game.status<>'playing' then raise exception 'GAME_NOT_PLAYING'; end if;

  select * into v_actor
  from public.marble_game_players
  where game_id=v_game.id and user_id=v_user
  for update;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;
  v_player_id := v_actor.room_player_id::text;
  v_type := v_game.pending_choice->>'type';

  if v_type='AUCTION_REQUEST' then
    if v_game.version<>p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
    if (v_game.pending_choice->>'deadlineAt')::timestamptz<=now() then
      raise exception 'AUCTION_REQUEST_DEADLINE_EXPIRED';
    end if;
    if not (coalesce(v_game.pending_choice->'eligiblePlayerIds','[]'::jsonb) ? v_player_id) then
      raise exception 'AUCTION_NOT_ELIGIBLE';
    end if;
    if v_actor.money < (v_game.pending_choice->>'openingBid')::integer then
      raise exception 'INSUFFICIENT_GOLD';
    end if;

    v_before := v_game.version;
    v_deadline := now() + interval '10 seconds';
    update public.marble_games
    set pending_choice=jsonb_build_object(
      'type','AUCTION_RECRUITMENT',
      'nodeId',v_game.pending_choice->>'nodeId',
      'basePrice',(v_game.pending_choice->>'basePrice')::integer,
      'openingBid',(v_game.pending_choice->>'openingBid')::integer,
      'declinedByPlayerId',v_game.pending_choice->>'declinedByPlayerId',
      'eligiblePlayerIds',v_game.pending_choice->'eligiblePlayerIds',
      'requesterPlayerId',v_player_id,
      'requestedByPlayerIds',jsonb_build_array(v_player_id),
      'participantPlayerIds',jsonb_build_array(v_player_id),
      'deadlineAt',v_deadline
    ),
    last_events=jsonb_build_array(
      jsonb_build_object(
        'type','AUCTION_REQUESTED',
        'playerId',v_player_id,
        'nodeId',v_game.pending_choice->>'nodeId'
      ),
      jsonb_build_object(
        'type','AUCTION_RECRUITMENT_OPENED',
        'nodeId',v_game.pending_choice->>'nodeId',
        'requesterPlayerId',v_player_id,
        'openingBid',(v_game.pending_choice->>'openingBid')::integer,
        'deadlineAt',v_deadline
      )
    ),
    version=version+1,
    updated_at=now()
    where id=v_game.id;

  elsif v_type='AUCTION_RECRUITMENT' then
    -- A request that lost the first-request race is intentionally absorbed as
    -- a recruitment join even if its expected_version is now stale.
    if v_game.version < p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
    if (v_game.pending_choice->>'deadlineAt')::timestamptz<=now() then
      raise exception 'AUCTION_RECRUITMENT_DEADLINE_EXPIRED';
    end if;
    if not (coalesce(v_game.pending_choice->'eligiblePlayerIds','[]'::jsonb) ? v_player_id) then
      raise exception 'AUCTION_NOT_ELIGIBLE';
    end if;
    if v_actor.money < (v_game.pending_choice->>'openingBid')::integer then
      raise exception 'INSUFFICIENT_GOLD';
    end if;
    v_participants := coalesce(v_game.pending_choice->'participantPlayerIds','[]'::jsonb);
    if v_participants ? v_player_id then raise exception 'AUCTION_ALREADY_JOINED'; end if;

    v_before := v_game.version;
    v_participants := v_participants || jsonb_build_array(v_player_id);
    update public.marble_games
    set pending_choice=jsonb_set(pending_choice,'{participantPlayerIds}',v_participants),
        last_events=jsonb_build_array(jsonb_build_object(
          'type','AUCTION_PARTICIPANT_JOINED',
          'playerId',v_player_id,
          'nodeId',v_game.pending_choice->>'nodeId',
          'source','CONCURRENT_REQUEST'
        )),
        version=version+1,
        updated_at=now()
    where id=v_game.id;
  else
    raise exception 'AUCTION_REQUEST_NOT_OPEN';
  end if;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'auction_request_v2',v_request,v_before,v_response);
  return v_response;
end;
$$;

create or replace function public.marble_join_auction(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid
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
  v_request jsonb := jsonb_build_object('action','auction_join_v2');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_player_id text;
  v_participants jsonb;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;
  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id=v_room.current_game_id and room_id=p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(v_game.id,v_user,p_client_action_id,'auction_join_v2',v_request);
  if v_replay is not null then return v_replay; end if;
  if v_game.status<>'playing' or v_game.version<>p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase<>'WAITING_CHOICE' or v_game.pending_choice->>'type'<>'AUCTION_RECRUITMENT' then
    raise exception 'AUCTION_RECRUITMENT_NOT_OPEN';
  end if;
  if (v_game.pending_choice->>'deadlineAt')::timestamptz<=now() then
    raise exception 'AUCTION_RECRUITMENT_DEADLINE_EXPIRED';
  end if;

  select * into v_actor
  from public.marble_game_players
  where game_id=v_game.id and user_id=v_user
  for update;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;
  v_player_id := v_actor.room_player_id::text;
  if not (coalesce(v_game.pending_choice->'eligiblePlayerIds','[]'::jsonb) ? v_player_id) then
    raise exception 'AUCTION_NOT_ELIGIBLE';
  end if;
  if v_actor.money < (v_game.pending_choice->>'openingBid')::integer then raise exception 'INSUFFICIENT_GOLD'; end if;

  v_participants := coalesce(v_game.pending_choice->'participantPlayerIds','[]'::jsonb);
  if v_participants ? v_player_id then raise exception 'AUCTION_ALREADY_JOINED'; end if;

  v_before := v_game.version;
  v_participants := v_participants || jsonb_build_array(v_player_id);
  update public.marble_games
  set pending_choice=jsonb_set(pending_choice,'{participantPlayerIds}',v_participants),
      last_events=jsonb_build_array(jsonb_build_object(
        'type','AUCTION_PARTICIPANT_JOINED',
        'playerId',v_player_id,
        'nodeId',v_game.pending_choice->>'nodeId',
        'source','JOIN'
      )),
      version=version+1,
      updated_at=now()
  where id=v_game.id;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'auction_join_v2',v_request,v_before,v_response);
  return v_response;
end;
$$;

create or replace function public.marble_withdraw_auction(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid
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
  v_request jsonb := jsonb_build_object('action','auction_withdraw_v2');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_player_id text;
  v_participants jsonb;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;
  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id=v_room.current_game_id and room_id=p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(v_game.id,v_user,p_client_action_id,'auction_withdraw_v2',v_request);
  if v_replay is not null then return v_replay; end if;
  if v_game.status<>'playing' or v_game.version<>p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase<>'WAITING_CHOICE' or v_game.pending_choice->>'type'<>'AUCTION_RECRUITMENT' then
    raise exception 'AUCTION_RECRUITMENT_NOT_OPEN';
  end if;
  if (v_game.pending_choice->>'deadlineAt')::timestamptz<=now() then
    raise exception 'AUCTION_RECRUITMENT_DEADLINE_EXPIRED';
  end if;

  select * into v_actor
  from public.marble_game_players
  where game_id=v_game.id and user_id=v_user
  for update;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  v_player_id := v_actor.room_player_id::text;

  if v_player_id=v_game.pending_choice->>'requesterPlayerId' then
    raise exception 'AUCTION_REQUESTER_WITHDRAW_NOT_ALLOWED';
  end if;
  v_participants := coalesce(v_game.pending_choice->'participantPlayerIds','[]'::jsonb);
  if not (v_participants ? v_player_id) then raise exception 'AUCTION_NOT_JOINED'; end if;

  v_before := v_game.version;
  select coalesce(jsonb_agg(value order by ordinality), '[]'::jsonb)
  into v_participants
  from jsonb_array_elements_text(v_participants)
    with ordinality as participant(value, ordinality)
  where value<>v_player_id;

  update public.marble_games
  set pending_choice=jsonb_set(pending_choice,'{participantPlayerIds}',v_participants),
      last_events=jsonb_build_array(jsonb_build_object(
        'type','AUCTION_PARTICIPANT_WITHDREW',
        'playerId',v_player_id,
        'nodeId',v_game.pending_choice->>'nodeId'
      )),
      version=version+1,
      updated_at=now()
  where id=v_game.id;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'auction_withdraw_v2',v_request,v_before,v_response);
  return v_response;
end;
$$;

create or replace function public.marble_close_auction_request(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  raise exception 'AUCTION_REQUEST_CLOSE_DEPRECATED';
end;
$$;

create or replace function public.marble_auction_bid(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid,
  p_amount integer default null,
  p_pass boolean default false
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
  v_request jsonb := jsonb_build_object('action','auction_bid_v2','amount',p_amount,'pass',p_pass);
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_player_id text;
  v_auction jsonb;
  v_participants jsonb;
  v_passed jsonb;
  v_bids jsonb;
  v_highest integer;
  v_highest_bidder text;
  v_minimum integer;
  v_result jsonb;
  v_events jsonb := '[]'::jsonb;
  v_remaining integer;
  v_next text;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;
  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id=v_room.current_game_id and room_id=p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(v_game.id,v_user,p_client_action_id,'auction_bid_v2',v_request);
  if v_replay is not null then return v_replay; end if;
  if v_game.status<>'playing' or v_game.version<>p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase<>'WAITING_CHOICE' or v_game.pending_choice->>'type'<>'PROPERTY_AUCTION' then
    raise exception 'AUCTION_NOT_OPEN';
  end if;

  v_auction := v_game.pending_choice->'auction';
  if v_auction->>'status'<>'OPEN' then raise exception 'AUCTION_NOT_OPEN'; end if;
  if (v_auction->>'turnDeadlineAt')::timestamptz<=now() then raise exception 'AUCTION_BID_DEADLINE_EXPIRED'; end if;

  select * into v_actor
  from public.marble_game_players
  where game_id=v_game.id and user_id=v_user
  for update;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;
  v_player_id := v_actor.room_player_id::text;

  if v_player_id<>v_auction->>'turnPlayerId' then raise exception 'AUCTION_NOT_YOUR_BID_TURN'; end if;
  v_participants := coalesce(v_auction->'participantPlayerIds','[]'::jsonb);
  v_passed := coalesce(v_auction->'passedPlayerIds','[]'::jsonb);
  v_bids := coalesce(v_auction->'bidPlayerIds','[]'::jsonb);
  if not (v_participants ? v_player_id) then raise exception 'AUCTION_NOT_PARTICIPANT'; end if;
  if v_passed ? v_player_id then raise exception 'AUCTION_ALREADY_PASSED'; end if;

  v_highest := coalesce((v_auction->>'highestBid')::integer,0);
  v_highest_bidder := v_auction->>'highestBidderId';
  v_minimum := case when v_highest>0 then v_highest+1 else (v_auction->>'openingBid')::integer end;
  v_before := v_game.version;

  if p_pass then
    v_passed := v_passed || jsonb_build_array(v_player_id);
    v_auction := jsonb_set(v_auction,'{passedPlayerIds}',v_passed);
    v_events := jsonb_build_array(jsonb_build_object(
      'type','AUCTION_PASSED',
      'playerId',v_player_id,
      'nodeId',v_auction->>'nodeId',
      'reason','VOLUNTARY'
    ));
  else
    if p_amount is null or p_amount<v_minimum then raise exception 'AUCTION_BID_TOO_LOW'; end if;
    if p_amount>v_actor.money then raise exception 'INSUFFICIENT_GOLD'; end if;
    if not (v_bids ? v_player_id) then v_bids := v_bids || jsonb_build_array(v_player_id); end if;
    v_highest := p_amount;
    v_highest_bidder := v_player_id;
    v_auction := jsonb_set(v_auction,'{bidPlayerIds}',v_bids);
    v_auction := jsonb_set(v_auction,'{highestBid}',to_jsonb(v_highest));
    v_auction := jsonb_set(v_auction,'{highestBidderId}',to_jsonb(v_highest_bidder));
    v_events := jsonb_build_array(jsonb_build_object(
      'type','AUCTION_BID_PLACED',
      'playerId',v_player_id,
      'nodeId',v_auction->>'nodeId',
      'amount',v_highest
    ));
  end if;

  v_result := private.marble_auction_v2_auto_pass(v_game.id,v_auction);
  v_auction := v_result->'auction';
  v_events := v_events || coalesce(v_result->'events','[]'::jsonb);
  v_passed := coalesce(v_auction->'passedPlayerIds','[]'::jsonb);
  v_highest_bidder := v_auction->>'highestBidderId';

  select count(*)::integer into v_remaining
  from jsonb_array_elements_text(v_participants) as participant(player_id)
  where not (v_passed ? participant.player_id);

  if v_remaining=1 and v_highest_bidder is not null and not (v_passed ? v_highest_bidder) then
    perform private.marble_auction_v2_settle(v_game.id,v_auction,v_events,false);
  else
    v_next := private.marble_auction_v2_next_turn(v_participants,v_passed,v_highest_bidder,v_player_id);
    if v_next is null then raise exception 'AUCTION_NEXT_TURN_MISSING'; end if;
    v_auction := jsonb_set(v_auction,'{turnPlayerId}',to_jsonb(v_next));
    v_auction := jsonb_set(v_auction,'{turnDeadlineAt}',to_jsonb(now()+interval '10 seconds'));
    update public.marble_games
    set pending_choice=jsonb_set(pending_choice,'{auction}',v_auction),
        last_events=v_events,
        version=version+1,
        updated_at=now()
    where id=v_game.id;
  end if;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'auction_bid_v2',v_request,v_before,v_response);
  return v_response;
end;
$$;

create or replace function public.marble_advance_auction_deadline(
  p_room_id uuid,
  p_expected_version bigint,
  p_client_action_id uuid
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
  v_request jsonb := jsonb_build_object('action','auction_deadline_advance_v2');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_type text;
  v_participants jsonb;
  v_passed jsonb;
  v_requester text;
  v_opening integer;
  v_node_id text;
  v_auction jsonb;
  v_events jsonb := '[]'::jsonb;
  v_result jsonb;
  v_remaining integer;
  v_next text;
  v_turn_player text;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;
  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id=v_room.current_game_id and room_id=p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(v_game.id,v_user,p_client_action_id,'auction_deadline_advance_v2',v_request);
  if v_replay is not null then return v_replay; end if;
  if v_game.status<>'playing' or v_game.version<>p_expected_version then raise exception 'VERSION_CONFLICT'; end if;

  select * into v_actor
  from public.marble_game_players
  where game_id=v_game.id and user_id=v_user;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;

  v_type := v_game.pending_choice->>'type';
  v_before := v_game.version;

  if v_type='AUCTION_REQUEST' then
    if (v_game.pending_choice->>'deadlineAt')::timestamptz>now() then
      raise exception 'AUCTION_DEADLINE_NOT_REACHED';
    end if;
    v_events := jsonb_build_array(jsonb_build_object(
      'type','AUCTION_REQUEST_CLOSED',
      'nodeId',v_game.pending_choice->>'nodeId',
      'requestedByPlayerIds','[]'::jsonb,
      'reason','NO_REQUESTS'
    ));
    update public.marble_games
    set phase='TURN_END', pending_choice=null, last_events=v_events,
        version=version+1, updated_at=now()
    where id=v_game.id;

  elsif v_type='AUCTION_RECRUITMENT' then
    if (v_game.pending_choice->>'deadlineAt')::timestamptz>now() then
      raise exception 'AUCTION_DEADLINE_NOT_REACHED';
    end if;
    v_participants := coalesce(v_game.pending_choice->'participantPlayerIds','[]'::jsonb);
    v_requester := v_game.pending_choice->>'requesterPlayerId';
    v_opening := (v_game.pending_choice->>'openingBid')::integer;
    v_node_id := v_game.pending_choice->>'nodeId';

    if jsonb_array_length(v_participants)=0 or not (v_participants ? v_requester) then
      raise exception 'AUCTION_REQUESTER_MISSING';
    end if;

    v_auction := jsonb_build_object(
      'type','PROPERTY_AUCTION',
      'nodeId',v_node_id,
      'openingBid',v_opening,
      'declinedByPlayerId',v_game.pending_choice->>'declinedByPlayerId',
      'eligiblePlayerIds',v_game.pending_choice->'eligiblePlayerIds',
      'participantPlayerIds',v_participants,
      'requesterPlayerId',v_requester,
      'requestedByPlayerIds',jsonb_build_array(v_requester),
      'bidPlayerIds',jsonb_build_array(v_requester),
      'passedPlayerIds','[]'::jsonb,
      'highestBid',v_opening,
      'highestBidderId',v_requester,
      'turnPlayerId',null,
      'turnDeadlineAt',null,
      'status','OPEN',
      'winnerPlayerId',null,
      'winningBid',0
    );

    v_events := jsonb_build_array(jsonb_build_object(
      'type','AUCTION_RECRUITMENT_CLOSED',
      'nodeId',v_node_id,
      'participantPlayerIds',v_participants,
      'reason',case when jsonb_array_length(v_participants)=1 then 'SOLE_PARTICIPANT' else 'COMPETITIVE' end
    ));

    if jsonb_array_length(v_participants)=1 then
      perform private.marble_auction_v2_settle(v_game.id,v_auction,v_events,true);
    else
      v_events := v_events || jsonb_build_array(jsonb_build_object(
        'type','AUCTION_STARTED',
        'nodeId',v_node_id,
        'openingBid',v_opening,
        'requesterPlayerId',v_requester,
        'participantPlayerIds',v_participants,
        'highestBidderId',v_requester,
        'highestBid',v_opening
      ));

      v_result := private.marble_auction_v2_auto_pass(v_game.id,v_auction);
      v_auction := v_result->'auction';
      v_events := v_events || coalesce(v_result->'events','[]'::jsonb);
      v_passed := coalesce(v_auction->'passedPlayerIds','[]'::jsonb);

      select count(*)::integer into v_remaining
      from jsonb_array_elements_text(v_participants) as participant(player_id)
      where not (v_passed ? participant.player_id);

      if v_remaining=1 then
        perform private.marble_auction_v2_settle(v_game.id,v_auction,v_events,false);
      else
        v_next := private.marble_auction_v2_next_turn(v_participants,v_passed,v_requester,v_requester);
        if v_next is null then raise exception 'AUCTION_NEXT_TURN_MISSING'; end if;
        v_auction := jsonb_set(v_auction,'{turnPlayerId}',to_jsonb(v_next));
        v_auction := jsonb_set(v_auction,'{turnDeadlineAt}',to_jsonb(now()+interval '10 seconds'));
        update public.marble_games
        set pending_choice=jsonb_build_object(
          'type','PROPERTY_AUCTION',
          'nodeId',v_node_id,
          'openingBid',v_opening,
          'requesterPlayerId',v_requester,
          'participantPlayerIds',v_participants,
          'auction',v_auction
        ),
        last_events=v_events,
        version=version+1,
        updated_at=now()
        where id=v_game.id;
      end if;
    end if;

  elsif v_type='PROPERTY_AUCTION' then
    v_auction := v_game.pending_choice->'auction';
    if (v_auction->>'turnDeadlineAt')::timestamptz>now() then
      raise exception 'AUCTION_DEADLINE_NOT_REACHED';
    end if;

    v_turn_player := v_auction->>'turnPlayerId';
    if v_turn_player is null then raise exception 'AUCTION_TURN_MISSING'; end if;
    v_participants := coalesce(v_auction->'participantPlayerIds','[]'::jsonb);
    v_passed := coalesce(v_auction->'passedPlayerIds','[]'::jsonb);
    if v_passed ? v_turn_player then raise exception 'AUCTION_TURN_ALREADY_PASSED'; end if;

    v_passed := v_passed || jsonb_build_array(v_turn_player);
    v_auction := jsonb_set(v_auction,'{passedPlayerIds}',v_passed);
    v_events := jsonb_build_array(jsonb_build_object(
      'type','AUCTION_AUTO_PASSED',
      'playerId',v_turn_player,
      'nodeId',v_auction->>'nodeId',
      'reason','TIMEOUT'
    ));

    v_result := private.marble_auction_v2_auto_pass(v_game.id,v_auction);
    v_auction := v_result->'auction';
    v_events := v_events || coalesce(v_result->'events','[]'::jsonb);
    v_passed := coalesce(v_auction->'passedPlayerIds','[]'::jsonb);

    select count(*)::integer into v_remaining
    from jsonb_array_elements_text(v_participants) as participant(player_id)
    where not (v_passed ? participant.player_id);

    if v_remaining=1 and v_auction->>'highestBidderId' is not null then
      perform private.marble_auction_v2_settle(v_game.id,v_auction,v_events,false);
    else
      v_next := private.marble_auction_v2_next_turn(
        v_participants,
        v_passed,
        v_auction->>'highestBidderId',
        v_turn_player
      );
      if v_next is null then raise exception 'AUCTION_NEXT_TURN_MISSING'; end if;
      v_auction := jsonb_set(v_auction,'{turnPlayerId}',to_jsonb(v_next));
      v_auction := jsonb_set(v_auction,'{turnDeadlineAt}',to_jsonb(now()+interval '10 seconds'));
      update public.marble_games
      set pending_choice=jsonb_set(pending_choice,'{auction}',v_auction),
          last_events=v_events,
          version=version+1,
          updated_at=now()
      where id=v_game.id;
    end if;
  else
    raise exception 'AUCTION_DEADLINE_NOT_ACTIVE';
  end if;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'auction_deadline_advance_v2',v_request,v_before,v_response);
  return v_response;
end;
$$;

revoke all on function public.marble_decline_property_for_auction(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_request_auction(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_close_auction_request(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_join_auction(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_withdraw_auction(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_advance_auction_deadline(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_auction_bid(uuid,bigint,uuid,integer,boolean) from public, anon;

grant execute on function public.marble_decline_property_for_auction(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_request_auction(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_close_auction_request(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_join_auction(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_withdraw_auction(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_advance_auction_deadline(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_auction_bid(uuid,bigint,uuid,integer,boolean) to authenticated;

-- Auction v2: keep the legacy end-turn RPC from clearing request, recruitment, or bidding state.

create or replace function public.marble_end_turn(
  p_room_id uuid,p_expected_version bigint,p_client_action_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user uuid:=auth.uid(); v_room public.marble_rooms%rowtype; v_game public.marble_games%rowtype;
  v_actor public.marble_game_players%rowtype; v_candidate public.marble_game_players%rowtype;
  v_request jsonb:=jsonb_build_object('action','end_turn'); v_replay jsonb; v_response jsonb; v_before bigint;
  v_events jsonb:='[]'::jsonb; v_cursor smallint; v_turn integer; v_checks integer; v_max_checks integer;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;
  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id=v_room.current_game_id for update;
  v_replay:=private.marble_action_replay(v_game.id,v_user,p_client_action_id,'end_turn',v_request);
  if v_replay is not null then return v_replay; end if;
  if v_game.status<>'playing' or v_game.version<>p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  select * into v_actor from public.marble_game_players where game_id=v_game.id and user_id=v_user;
  if not found or v_actor.seat<>v_game.current_seat then raise exception 'NOT_YOUR_TURN'; end if;
  if (
    v_game.phase='WAITING_CHOICE'
    and coalesce(v_game.pending_choice->>'type','') in ('AUCTION_REQUEST','AUCTION_RECRUITMENT','PROPERTY_AUCTION')
  ) then
    raise exception 'END_TURN_NOT_ALLOWED';
  end if;
  if v_game.phase not in ('TURN_END','WAITING_CHOICE') then raise exception 'END_TURN_NOT_ALLOWED'; end if;
  v_before:=v_game.version;
  if v_game.phase='WAITING_CHOICE' then
    v_events:=v_events||jsonb_build_array(jsonb_build_object('type','CHOICE_DECLINED','playerId',v_actor.room_player_id::text,'choiceType',v_game.pending_choice->>'type'));
  end if;
  v_cursor:=v_game.current_seat; v_turn:=v_game.turn_number;
  select count(*)::integer*2 into v_max_checks from public.marble_game_players where game_id=v_game.id;
  for v_checks in 1..v_max_checks loop
    select * into v_candidate from public.marble_game_players
      where game_id=v_game.id and seat>v_cursor order by seat limit 1;
    if not found then
      select * into v_candidate from public.marble_game_players where game_id=v_game.id order by seat limit 1;
    end if;
    v_cursor:=v_candidate.seat; v_turn:=v_turn+1;
    if v_candidate.bankrupt then continue; end if;
    if v_candidate.skip_turns>0 then
      update public.marble_game_players set skip_turns=skip_turns-1 where id=v_candidate.id;
      v_events:=v_events||jsonb_build_array(jsonb_build_object('type','TURN_SKIPPED','playerId',v_candidate.room_player_id::text));
      continue;
    end if;
    update public.marble_games set current_seat=v_candidate.seat,turn_number=v_turn,phase='WAITING_ROLL',pending_choice=null,
      last_events=v_events,version=version+1,updated_at=now() where id=v_game.id;
    v_response:=private.marble_game_snapshot(p_room_id);
    perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'end_turn',v_request,v_before,v_response);
    return v_response;
  end loop;
  raise exception 'NO_ACTIVE_PLAYER';
end;
$$;

revoke all on function public.marble_end_turn(uuid,bigint,uuid) from public, anon;
grant execute on function public.marble_end_turn(uuid,bigint,uuid) to authenticated;

