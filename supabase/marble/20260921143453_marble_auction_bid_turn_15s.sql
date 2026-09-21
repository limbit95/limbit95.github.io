-- Marble competitive auction bid turn timing
-- Keep the existing Auction v3 authority and permissions while extending each competitive bid turn to 15 seconds.

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
  v_auction := jsonb_set(v_auction, '{turnDeadlineAt}', to_jsonb(now() + interval '15 seconds'));

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
    v_auction := jsonb_set(v_auction,'{turnDeadlineAt}',to_jsonb(now()+interval '15 seconds'));
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
      v_auction := jsonb_set(v_auction,'{turnDeadlineAt}',to_jsonb(now()+interval '15 seconds'));
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

revoke all on function private.marble_auction_v3_finalize_vote(uuid,jsonb,jsonb,text)
from public, anon, authenticated;

revoke all on function public.marble_auction_bid(uuid,bigint,uuid,integer,boolean)
from public, anon;
grant execute on function public.marble_auction_bid(uuid,bigint,uuid,integer,boolean)
to authenticated, service_role;

revoke all on function public.marble_advance_auction_deadline(uuid,bigint,uuid)
from public, anon;
grant execute on function public.marble_advance_auction_deadline(uuid,bigint,uuid)
to authenticated, service_role;
