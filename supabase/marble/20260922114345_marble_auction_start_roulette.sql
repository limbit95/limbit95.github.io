-- Marble Auction staged start sequence and server-authoritative opening bidder roulette.
-- Two-or-more participant auctions announce first, run a synced roulette, then open bidding.

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
  v_announcement_ends_at timestamptz;
  v_starts_at timestamptz;
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

  if v_count > 1 then
    select coalesce(jsonb_agg(player_id order by random()), '[]'::jsonb)
    into v_participants
    from jsonb_array_elements_text(v_participants) as participant(player_id);

    v_announcement_ends_at := now() + interval '2.4 seconds';
    v_starts_at := now() + interval '5.8 seconds';
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
    'announcementEndsAt', v_announcement_ends_at,
    'startsAt', v_starts_at,
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
    'type', 'AUCTION_STARTING',
    'nodeId', p_pending->>'nodeId',
    'openingBid', v_opening,
    'openingBidderPlayerId', v_opening_bidder,
    'participantPlayerIds', v_participants,
    'announcementEndsAt', v_announcement_ends_at,
    'startsAt', v_starts_at
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
  v_auction := jsonb_set(v_auction, '{turnDeadlineAt}', to_jsonb(v_starts_at + interval '15 seconds'));

  update public.marble_games
  set pending_choice = jsonb_build_object(
        'type', 'PROPERTY_AUCTION',
        'nodeId', p_pending->>'nodeId',
        'openingBid', v_opening,
        'openingBidderPlayerId', v_opening_bidder,
        'requesterPlayerId', v_opening_bidder,
        'participantPlayerIds', v_participants,
        'announcementEndsAt', v_announcement_ends_at,
        'startsAt', v_starts_at,
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
  v_previous_highest integer;
  v_highest_bidder text;
  v_minimum integer;
  v_increase integer;
  v_surge_threshold integer;
  v_auto_passed_ids jsonb := '[]'::jsonb;
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
  if nullif(v_auction->>'startsAt','') is not null
     and (v_auction->>'startsAt')::timestamptz > now()
  then
    raise exception 'AUCTION_NOT_STARTED';
  end if;
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
  v_previous_highest := v_highest;
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
    v_increase := p_amount - v_previous_highest;
    v_surge_threshold := greatest(100, ceil(v_previous_highest::numeric * 0.30)::integer);
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
      'amount',v_highest,
      'previousAmount',v_previous_highest,
      'increase',v_increase,
      'surge',(v_increase>=v_surge_threshold)
    ));
  end if;

  v_result := private.marble_auction_v2_auto_pass(v_game.id,v_auction);
  v_auction := v_result->'auction';
  v_events := v_events || coalesce(v_result->'events','[]'::jsonb);

  select coalesce(jsonb_agg(event->>'playerId'), '[]'::jsonb)
  into v_auto_passed_ids
  from jsonb_array_elements(coalesce(v_result->'events','[]'::jsonb)) event
  where event->>'type'='AUCTION_AUTO_PASSED'
    and event->>'reason'='INSUFFICIENT_GOLD';
  v_passed := coalesce(v_auction->'passedPlayerIds','[]'::jsonb);
  v_highest_bidder := v_auction->>'highestBidderId';

  select count(*)::integer into v_remaining
  from jsonb_array_elements_text(v_participants) as participant(player_id)
  where not (v_passed ? participant.player_id);

  if v_remaining=1 and v_highest_bidder is not null and not (v_passed ? v_highest_bidder) then
    if not p_pass then
      -- Reassert the submitted final bid immediately before settlement so an instant
      -- affordability knockout can never settle at the previous highest amount.
      v_auction := jsonb_set(v_auction,'{highestBid}',to_jsonb(p_amount));
      v_auction := jsonb_set(v_auction,'{highestBidderId}',to_jsonb(v_player_id));

      if jsonb_array_length(v_auto_passed_ids) > 0 then
        v_events := v_events || jsonb_build_array(jsonb_build_object(
          'type','AUCTION_DECISIVE_BID',
          'playerId',v_player_id,
          'nodeId',v_auction->>'nodeId',
          'amount',p_amount,
          'previousAmount',v_previous_highest,
          'increase',v_increase,
          'eliminatedPlayerIds',v_auto_passed_ids
        ));
      end if;
    end if;
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

revoke all on function public.marble_auction_bid(uuid,bigint,uuid,integer,boolean)
from public, anon;
grant execute on function public.marble_auction_bid(uuid,bigint,uuid,integer,boolean)
to authenticated, service_role;
