-- Marble Auction vote flow
-- Purchase decline -> 15-second irreversible JOIN/PASS vote -> auto-buy or competitive auction.

create or replace function private.marble_auction_v3_finalize_vote(
  p_game_id uuid,
  p_pending jsonb,
  p_events jsonb,
  p_reason text
)
returns void
language plpgsql
set search_path = public, private, pg_temp
as $$
declare
  v_participants jsonb := coalesce(p_pending->'participantPlayerIds', '[]'::jsonb);
  v_passed jsonb := coalesce(p_pending->'passedPlayerIds', '[]'::jsonb);
  v_events jsonb := coalesce(p_events, '[]'::jsonb);
  v_count integer := jsonb_array_length(v_participants);
  v_opening integer := (p_pending->>'openingBid')::integer;
  v_opening_bidder text;
  v_auction jsonb;
  v_result jsonb;
  v_remaining integer;
  v_next text;
begin
  v_events := v_events || jsonb_build_array(jsonb_build_object(
    'type', 'AUCTION_VOTE_CLOSED',
    'nodeId', p_pending->>'nodeId',
    'participantPlayerIds', v_participants,
    'passedPlayerIds', v_passed,
    'reason', p_reason
  ));

  if v_count = 0 then
    update public.marble_games
    set phase = 'TURN_END',
        pending_choice = null,
        last_events = v_events,
        version = version + 1,
        updated_at = now()
    where id = p_game_id;
    return;
  end if;

  v_opening_bidder := v_participants->>0;
  v_auction := jsonb_build_object(
    'type', 'PROPERTY_AUCTION',
    'nodeId', p_pending->>'nodeId',
    'openingBid', v_opening,
    'declinedByPlayerId', p_pending->>'declinedByPlayerId',
    'eligiblePlayerIds', coalesce(p_pending->'eligiblePlayerIds', '[]'::jsonb),
    'participantPlayerIds', v_participants,
    'openingBidderPlayerId', v_opening_bidder,
    'requesterPlayerId', v_opening_bidder,
    'requestedByPlayerIds', '[]'::jsonb,
    'bidPlayerIds', jsonb_build_array(v_opening_bidder),
    'passedPlayerIds', '[]'::jsonb,
    'highestBid', v_opening,
    'highestBidderId', v_opening_bidder,
    'turnPlayerId', null,
    'turnDeadlineAt', null,
    'status', 'OPEN',
    'winnerPlayerId', null,
    'winningBid', 0
  );

  if v_count = 1 then
    v_events := v_events || jsonb_build_array(jsonb_build_object(
      'type', 'AUCTION_AUTO_PURCHASED',
      'nodeId', p_pending->>'nodeId',
      'playerId', v_opening_bidder,
      'amount', v_opening
    ));
    perform private.marble_auction_v2_settle(p_game_id, v_auction, v_events, false);
    return;
  end if;

  v_events := v_events || jsonb_build_array(jsonb_build_object(
    'type', 'AUCTION_STARTED',
    'nodeId', p_pending->>'nodeId',
    'openingBid', v_opening,
    'openingBidderPlayerId', v_opening_bidder,
    'participantPlayerIds', v_participants,
    'highestBidderId', v_opening_bidder,
    'highestBid', v_opening
  ));

  v_result := private.marble_auction_v2_auto_pass(p_game_id, v_auction);
  v_auction := v_result->'auction';
  v_events := v_events || coalesce(v_result->'events', '[]'::jsonb);

  select count(*)::integer
  into v_remaining
  from jsonb_array_elements_text(v_participants) as participant(player_id)
  where not (coalesce(v_auction->'passedPlayerIds', '[]'::jsonb) ? participant.player_id);

  if v_remaining = 1 then
    perform private.marble_auction_v2_settle(p_game_id, v_auction, v_events, false);
    return;
  end if;

  v_next := private.marble_auction_v2_next_turn(
    v_participants,
    coalesce(v_auction->'passedPlayerIds', '[]'::jsonb),
    v_opening_bidder,
    v_opening_bidder
  );
  if v_next is null then raise exception 'AUCTION_NEXT_TURN_MISSING'; end if;

  v_auction := jsonb_set(v_auction, '{turnPlayerId}', to_jsonb(v_next));
  v_auction := jsonb_set(v_auction, '{turnDeadlineAt}', to_jsonb(now() + interval '10 seconds'));

  update public.marble_games
  set pending_choice = jsonb_build_object(
        'type', 'PROPERTY_AUCTION',
        'nodeId', p_pending->>'nodeId',
        'openingBid', v_opening,
        'openingBidderPlayerId', v_opening_bidder,
        'requesterPlayerId', v_opening_bidder,
        'participantPlayerIds', v_participants,
        'auction', v_auction
      ),
      last_events = v_events,
      version = version + 1,
      updated_at = now()
  where id = p_game_id;
end;
$$;

revoke all on function private.marble_auction_v3_finalize_vote(uuid,jsonb,jsonb,text)
from public, anon, authenticated;

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
  v_request jsonb := jsonb_build_object('action','auction_vote_open_v3');
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

  select * into v_room
  from public.marble_rooms
  where id = p_room_id
  for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;

  select * into v_game
  from public.marble_games
  where id = v_room.current_game_id and room_id = p_room_id
  for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(
    v_game.id, v_user, p_client_action_id, 'auction_vote_open_v3', v_request
  );
  if v_replay is not null then return v_replay; end if;
  if v_room.status <> 'playing' or v_game.status <> 'playing' then raise exception 'GAME_NOT_PLAYING'; end if;
  if v_game.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase <> 'WAITING_CHOICE' or v_game.pending_choice->>'type' <> 'BUY_PROPERTY' then
    raise exception 'PROPERTY_DECLINE_NOT_ALLOWED';
  end if;

  select * into v_actor
  from public.marble_game_players
  where game_id = v_game.id and user_id = v_user
  for update;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.seat <> v_game.current_seat then raise exception 'NOT_YOUR_TURN'; end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;

  v_node_id := v_game.pending_choice->>'nodeId';
  v_base_price := (v_game.pending_choice->>'price')::integer;
  v_opening_bid := round(v_base_price::numeric * 1.5)::integer;
  v_deadline := now() + interval '15 seconds';

  select * into v_property
  from public.marble_game_properties
  where game_id = v_game.id and node_id = v_node_id
  for update;
  if not found or v_property.owner_seat is not null then raise exception 'PROPERTY_NOT_AVAILABLE'; end if;

  select coalesce(jsonb_agg(gp.room_player_id::text order by gp.seat), '[]'::jsonb)
  into v_eligible
  from public.marble_game_players gp
  where gp.game_id = v_game.id
    and gp.seat <> v_actor.seat
    and not gp.bankrupt
    and gp.money >= v_opening_bid;

  v_before := v_game.version;
  v_events := jsonb_build_array(jsonb_build_object(
    'type','CHOICE_DECLINED',
    'playerId',v_actor.room_player_id::text,
    'choiceType','BUY_PROPERTY'
  ));

  if jsonb_array_length(v_eligible) = 0 then
    v_events := v_events || jsonb_build_array(jsonb_build_object(
      'type','AUCTION_VOTE_CLOSED',
      'nodeId',v_node_id,
      'participantPlayerIds','[]'::jsonb,
      'passedPlayerIds','[]'::jsonb,
      'reason','NO_ELIGIBLE_PLAYERS'
    ));
    update public.marble_games
    set phase='TURN_END',
        pending_choice=null,
        last_events=v_events,
        version=version+1,
        updated_at=now()
    where id=v_game.id;
  else
    v_events := v_events || jsonb_build_array(jsonb_build_object(
      'type','AUCTION_VOTE_OPENED',
      'nodeId',v_node_id,
      'openingBid',v_opening_bid,
      'declinedByPlayerId',v_actor.room_player_id::text,
      'eligiblePlayerIds',v_eligible,
      'deadlineAt',v_deadline
    ));
    update public.marble_games
    set pending_choice=jsonb_build_object(
          'type','AUCTION_VOTE',
          'nodeId',v_node_id,
          'basePrice',v_base_price,
          'openingBid',v_opening_bid,
          'declinedByPlayerId',v_actor.room_player_id::text,
          'eligiblePlayerIds',v_eligible,
          'participantPlayerIds','[]'::jsonb,
          'passedPlayerIds','[]'::jsonb,
          'openedVersion',v_game.version + 1,
          'deadlineAt',v_deadline
        ),
        last_events=v_events,
        version=version+1,
        updated_at=now()
    where id=v_game.id;
  end if;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(
    v_game.id, v_user, p_client_action_id, 'auction_vote_open_v3', v_request, v_before, v_response
  );
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
  v_request jsonb := jsonb_build_object('action','auction_vote_join_v3');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_player_id text;
  v_pending jsonb;
  v_participants jsonb;
  v_passed jsonb;
  v_events jsonb;
  v_opened_version bigint;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;

  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games
  where id=v_room.current_game_id and room_id=p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(
    v_game.id,v_user,p_client_action_id,'auction_vote_join_v3',v_request
  );
  if v_replay is not null then return v_replay; end if;
  if v_game.status <> 'playing' then raise exception 'GAME_NOT_PLAYING'; end if;
  if v_game.phase <> 'WAITING_CHOICE' or v_game.pending_choice->>'type' <> 'AUCTION_VOTE' then
    raise exception 'AUCTION_VOTE_NOT_OPEN';
  end if;
  if (v_game.pending_choice->>'deadlineAt')::timestamptz <= now() then
    raise exception 'AUCTION_VOTE_DEADLINE_EXPIRED';
  end if;
  v_opened_version := coalesce(
    nullif(v_game.pending_choice->>'openedVersion','')::bigint,
    v_game.version
  );
  if p_expected_version < v_opened_version or p_expected_version > v_game.version then
    raise exception 'VERSION_CONFLICT';
  end if;

  select * into v_actor
  from public.marble_game_players
  where game_id=v_game.id and user_id=v_user
  for update;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;

  v_player_id := v_actor.room_player_id::text;
  v_pending := v_game.pending_choice;
  if not (coalesce(v_pending->'eligiblePlayerIds','[]'::jsonb) ? v_player_id) then
    raise exception 'AUCTION_NOT_ELIGIBLE';
  end if;
  if v_actor.money < (v_pending->>'openingBid')::integer then raise exception 'INSUFFICIENT_GOLD'; end if;

  v_participants := coalesce(v_pending->'participantPlayerIds','[]'::jsonb);
  v_passed := coalesce(v_pending->'passedPlayerIds','[]'::jsonb);
  if v_participants ? v_player_id or v_passed ? v_player_id then
    raise exception 'AUCTION_VOTE_ALREADY_FINAL';
  end if;

  v_before := v_game.version;
  v_participants := v_participants || jsonb_build_array(v_player_id);
  v_pending := jsonb_set(v_pending,'{participantPlayerIds}',v_participants);
  v_events := jsonb_build_array(jsonb_build_object(
    'type','AUCTION_VOTE_JOINED',
    'playerId',v_player_id,
    'nodeId',v_pending->>'nodeId',
    'order',jsonb_array_length(v_participants)
  ));

  if jsonb_array_length(v_participants) + jsonb_array_length(v_passed)
      >= jsonb_array_length(coalesce(v_pending->'eligiblePlayerIds','[]'::jsonb)) then
    perform private.marble_auction_v3_finalize_vote(v_game.id,v_pending,v_events,'ALL_RESPONDED');
  else
    update public.marble_games
    set pending_choice=v_pending,
        last_events=v_events,
        version=version+1,
        updated_at=now()
    where id=v_game.id;
  end if;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(
    v_game.id,v_user,p_client_action_id,'auction_vote_join_v3',v_request,v_before,v_response
  );
  return v_response;
end;
$$;

create or replace function public.marble_pass_auction_vote(
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
  v_request jsonb := jsonb_build_object('action','auction_vote_pass_v3');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_player_id text;
  v_pending jsonb;
  v_participants jsonb;
  v_passed jsonb;
  v_events jsonb;
  v_opened_version bigint;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;

  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games
  where id=v_room.current_game_id and room_id=p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(
    v_game.id,v_user,p_client_action_id,'auction_vote_pass_v3',v_request
  );
  if v_replay is not null then return v_replay; end if;
  if v_game.status <> 'playing' then raise exception 'GAME_NOT_PLAYING'; end if;
  if v_game.version < p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase <> 'WAITING_CHOICE' or v_game.pending_choice->>'type' <> 'AUCTION_VOTE' then
    raise exception 'AUCTION_VOTE_NOT_OPEN';
  end if;
  if (v_game.pending_choice->>'deadlineAt')::timestamptz <= now() then
    raise exception 'AUCTION_VOTE_DEADLINE_EXPIRED';
  end if;
  v_opened_version := coalesce(
    nullif(v_game.pending_choice->>'openedVersion','')::bigint,
    v_game.version
  );
  if p_expected_version < v_opened_version or p_expected_version > v_game.version then
    raise exception 'VERSION_CONFLICT';
  end if;

  select * into v_actor
  from public.marble_game_players
  where game_id=v_game.id and user_id=v_user
  for update;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;

  v_player_id := v_actor.room_player_id::text;
  v_pending := v_game.pending_choice;
  if not (coalesce(v_pending->'eligiblePlayerIds','[]'::jsonb) ? v_player_id) then
    raise exception 'AUCTION_NOT_ELIGIBLE';
  end if;

  v_participants := coalesce(v_pending->'participantPlayerIds','[]'::jsonb);
  v_passed := coalesce(v_pending->'passedPlayerIds','[]'::jsonb);
  if v_participants ? v_player_id or v_passed ? v_player_id then
    raise exception 'AUCTION_VOTE_ALREADY_FINAL';
  end if;

  v_before := v_game.version;
  v_passed := v_passed || jsonb_build_array(v_player_id);
  v_pending := jsonb_set(v_pending,'{passedPlayerIds}',v_passed);
  v_events := jsonb_build_array(jsonb_build_object(
    'type','AUCTION_VOTE_PASSED',
    'playerId',v_player_id,
    'nodeId',v_pending->>'nodeId',
    'reason','VOLUNTARY'
  ));

  if jsonb_array_length(v_participants) + jsonb_array_length(v_passed)
      >= jsonb_array_length(coalesce(v_pending->'eligiblePlayerIds','[]'::jsonb)) then
    perform private.marble_auction_v3_finalize_vote(v_game.id,v_pending,v_events,'ALL_RESPONDED');
  else
    update public.marble_games
    set pending_choice=v_pending,
        last_events=v_events,
        version=version+1,
        updated_at=now()
    where id=v_game.id;
  end if;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(
    v_game.id,v_user,p_client_action_id,'auction_vote_pass_v3',v_request,v_before,v_response
  );
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
begin
  return public.marble_join_auction(p_room_id,p_expected_version,p_client_action_id);
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
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  raise exception 'AUCTION_VOTE_IS_FINAL';
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
  v_request jsonb := jsonb_build_object('action','auction_deadline_advance_v3');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_type text;
  v_pending jsonb;
  v_eligible jsonb;
  v_participants jsonb;
  v_passed jsonb;
  v_player_id text;
  v_events jsonb := '[]'::jsonb;
  v_auction jsonb;
  v_result jsonb;
  v_remaining integer;
  v_next text;
  v_turn_player text;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;

  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games
  where id=v_room.current_game_id and room_id=p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(
    v_game.id,v_user,p_client_action_id,'auction_deadline_advance_v3',v_request
  );
  if v_replay is not null then return v_replay; end if;
  if v_game.status <> 'playing' or v_game.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;

  select * into v_actor
  from public.marble_game_players
  where game_id=v_game.id and user_id=v_user;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;

  v_before := v_game.version;
  v_type := v_game.pending_choice->>'type';

  if v_type = 'AUCTION_VOTE' then
    if (v_game.pending_choice->>'deadlineAt')::timestamptz > now() then
      raise exception 'AUCTION_DEADLINE_NOT_REACHED';
    end if;

    v_pending := v_game.pending_choice;
    v_eligible := coalesce(v_pending->'eligiblePlayerIds','[]'::jsonb);
    v_participants := coalesce(v_pending->'participantPlayerIds','[]'::jsonb);
    v_passed := coalesce(v_pending->'passedPlayerIds','[]'::jsonb);

    for v_player_id in
      select value from jsonb_array_elements_text(v_eligible)
    loop
      if v_participants ? v_player_id or v_passed ? v_player_id then
        continue;
      end if;
      v_passed := v_passed || jsonb_build_array(v_player_id);
      v_events := v_events || jsonb_build_array(jsonb_build_object(
        'type','AUCTION_VOTE_AUTO_PASSED',
        'playerId',v_player_id,
        'nodeId',v_pending->>'nodeId',
        'reason','TIMEOUT'
      ));
    end loop;

    v_pending := jsonb_set(v_pending,'{passedPlayerIds}',v_passed);
    perform private.marble_auction_v3_finalize_vote(
      v_game.id,v_pending,v_events,'DEADLINE'
    );

  elsif v_type = 'PROPERTY_AUCTION' then
    v_auction := v_game.pending_choice->'auction';
    if (v_auction->>'turnDeadlineAt')::timestamptz > now() then
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
  perform private.marble_record_action(
    v_game.id,v_user,p_client_action_id,'auction_deadline_advance_v3',v_request,v_before,v_response
  );
  return v_response;
end;
$$;

-- Normalize in-flight Auction v2 request/recruitment states to the new single vote window.
do $$
declare
  v_game record;
  v_pending jsonb;
  v_base_price integer;
  v_opening_bid integer;
  v_eligible jsonb;
  v_participants jsonb;
begin
  for v_game in
    select id, pending_choice
    from public.marble_games
    where status='playing'
      and phase='WAITING_CHOICE'
      and pending_choice->>'type' in ('AUCTION_REQUEST','AUCTION_RECRUITMENT')
    for update
  loop
    v_base_price := coalesce(
      nullif(v_game.pending_choice->>'basePrice','')::integer,
      case
        when v_game.pending_choice->>'openingBid' is not null
          then round(((v_game.pending_choice->>'openingBid')::integer)::numeric / 1.5)::integer
        else null
      end
    );
    if v_base_price is null or v_base_price <= 0 then
      continue;
    end if;

    v_opening_bid := round(v_base_price::numeric * 1.5)::integer;

    select coalesce(jsonb_agg(gp.room_player_id::text order by gp.seat),'[]'::jsonb)
    into v_eligible
    from public.marble_game_players gp
    where gp.game_id=v_game.id
      and gp.room_player_id::text <> v_game.pending_choice->>'declinedByPlayerId'
      and not gp.bankrupt
      and gp.money >= v_opening_bid;

    v_participants := case
      when v_game.pending_choice->>'type'='AUCTION_RECRUITMENT'
        then coalesce(v_game.pending_choice->'participantPlayerIds','[]'::jsonb)
      else '[]'::jsonb
    end;

    select coalesce(jsonb_agg(value order by ordinality),'[]'::jsonb)
    into v_participants
    from jsonb_array_elements_text(v_participants)
      with ordinality as participant(value, ordinality)
    where v_eligible ? value;

    v_pending := jsonb_build_object(
      'type','AUCTION_VOTE',
      'nodeId',v_game.pending_choice->>'nodeId',
      'basePrice',v_base_price,
      'openingBid',v_opening_bid,
      'declinedByPlayerId',v_game.pending_choice->>'declinedByPlayerId',
      'eligiblePlayerIds',v_eligible,
      'participantPlayerIds',v_participants,
      'passedPlayerIds','[]'::jsonb,
      'openedVersion',v_game.version + 1,
      'deadlineAt',now()+interval '15 seconds'
    );

    if jsonb_array_length(v_eligible)=0 then
      perform private.marble_auction_v3_finalize_vote(
        v_game.id,v_pending,'[]'::jsonb,'NO_ELIGIBLE_PLAYERS'
      );
    elsif jsonb_array_length(v_participants)=jsonb_array_length(v_eligible) then
      perform private.marble_auction_v3_finalize_vote(
        v_game.id,v_pending,'[]'::jsonb,'ALL_RESPONDED'
      );
    else
      update public.marble_games
      set pending_choice=v_pending,
          last_events=jsonb_build_array(jsonb_build_object(
            'type','AUCTION_VOTE_OPENED',
            'nodeId',v_pending->>'nodeId',
            'openingBid',v_opening_bid,
            'declinedByPlayerId',v_pending->>'declinedByPlayerId',
            'eligiblePlayerIds',v_eligible,
            'deadlineAt',v_pending->>'deadlineAt'
          )),
          version=version+1,
          updated_at=now()
      where id=v_game.id;
    end if;
  end loop;
end;
$$;

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
    and coalesce(v_game.pending_choice->>'type','')
      in ('AUCTION_REQUEST','AUCTION_RECRUITMENT','AUCTION_VOTE','PROPERTY_AUCTION')
  ) then
    raise exception 'END_TURN_NOT_ALLOWED';
  end if;
  if v_game.phase not in ('TURN_END','WAITING_CHOICE') then raise exception 'END_TURN_NOT_ALLOWED'; end if;
  v_before:=v_game.version;
  if v_game.phase='WAITING_CHOICE' then
    v_events:=v_events||jsonb_build_array(jsonb_build_object(
      'type','CHOICE_DECLINED',
      'playerId',v_actor.room_player_id::text,
      'choiceType',v_game.pending_choice->>'type'
    ));
  end if;
  v_cursor:=v_game.current_seat; v_turn:=v_game.turn_number;
  select count(*)::integer*2 into v_max_checks
  from public.marble_game_players where game_id=v_game.id;
  for v_checks in 1..v_max_checks loop
    select * into v_candidate from public.marble_game_players
      where game_id=v_game.id and seat>v_cursor order by seat limit 1;
    if not found then
      select * into v_candidate from public.marble_game_players
      where game_id=v_game.id order by seat limit 1;
    end if;
    v_cursor:=v_candidate.seat; v_turn:=v_turn+1;
    if v_candidate.bankrupt then continue; end if;
    if v_candidate.skip_turns>0 then
      update public.marble_game_players
      set skip_turns=skip_turns-1 where id=v_candidate.id;
      v_events:=v_events||jsonb_build_array(jsonb_build_object(
        'type','TURN_SKIPPED','playerId',v_candidate.room_player_id::text
      ));
      continue;
    end if;
    update public.marble_games
    set current_seat=v_candidate.seat,
        turn_number=v_turn,
        phase='WAITING_ROLL',
        pending_choice=null,
        last_events=v_events,
        version=version+1,
        updated_at=now()
    where id=v_game.id;
    v_response:=private.marble_game_snapshot(p_room_id);
    perform private.marble_record_action(
      v_game.id,v_user,p_client_action_id,'end_turn',v_request,v_before,v_response
    );
    return v_response;
  end loop;
  raise exception 'NO_ACTIVE_PLAYER';
end;
$$;

revoke all on function public.marble_decline_property_for_auction(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_join_auction(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_pass_auction_vote(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_request_auction(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_withdraw_auction(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_advance_auction_deadline(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_end_turn(uuid,bigint,uuid) from public, anon;

grant execute on function public.marble_decline_property_for_auction(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_join_auction(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_pass_auction_vote(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_request_auction(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_withdraw_auction(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_advance_auction_deadline(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_end_turn(uuid,bigint,uuid) to authenticated;
