-- Shorten Marble Auction roulette result hold while preserving the 2s first-bidder notice.
-- 2s announcement -> 3.2s roulette -> 0.8s result hold -> 2s first-bidder notice -> bidding.

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
  v_roulette_stops_at timestamptz;
  v_winner_notice_at timestamptz;
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

    v_announcement_ends_at := now() + interval '2 seconds';
    v_roulette_stops_at := now() + interval '5.2 seconds';
    v_winner_notice_at := now() + interval '6 seconds';
    v_starts_at := now() + interval '8 seconds';
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
    'rouletteStopsAt', v_roulette_stops_at,
    'winnerNoticeAt', v_winner_notice_at,
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
    'rouletteStopsAt', v_roulette_stops_at,
    'winnerNoticeAt', v_winner_notice_at,
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
        'rouletteStopsAt', v_roulette_stops_at,
        'winnerNoticeAt', v_winner_notice_at,
        'startsAt', v_starts_at,
        'auction', v_auction
      ),
      last_events = v_events,
      version = version + 1,
      updated_at = now()
  where id = p_game_id;
end;
$$;
