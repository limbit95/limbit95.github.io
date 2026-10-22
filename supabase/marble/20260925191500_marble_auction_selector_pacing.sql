-- Extend Marble auction starter selection pacing without changing auction authority.
-- Timeline: 2.0s announcement + 7.2s profile-chain spin + 1.2s selected-starter hold.

CREATE OR REPLACE FUNCTION private.marble_auction_v3_finalize_vote(p_game_id uuid, p_pending jsonb, p_events jsonb, p_reason text)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public', 'private', 'pg_temp'
AS $function$
declare
  v_participants jsonb := coalesce(p_pending->'participantPlayerIds', '[]'::jsonb);
  v_passed jsonb := coalesce(p_pending->'passedPlayerIds', '[]'::jsonb);
  v_events jsonb := coalesce(p_events, '[]'::jsonb);
  v_count integer := jsonb_array_length(v_participants);
  v_opening integer := (p_pending->>'openingBid')::integer;
  v_starter text;
  v_announcement_ends_at timestamptz;
  v_selector_stops_at timestamptz;
  v_starts_at timestamptz;
  v_auction jsonb;
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

  if v_count = 1 then
    v_starter := v_participants->>0;
    v_auction := jsonb_build_object(
      'type', 'PROPERTY_AUCTION',
      'nodeId', p_pending->>'nodeId',
      'openingBid', v_opening,
      'declinedByPlayerId', p_pending->>'declinedByPlayerId',
      'eligiblePlayerIds', coalesce(p_pending->'eligiblePlayerIds', '[]'::jsonb),
      'participantPlayerIds', v_participants,
      'starterPlayerId', v_starter,
      'bidPlayerIds', jsonb_build_array(v_starter),
      'passedPlayerIds', '[]'::jsonb,
      'highestBid', v_opening,
      'highestBidderId', v_starter,
      'turnPlayerId', null,
      'turnDeadlineAt', null,
      'status', 'WON',
      'winnerPlayerId', v_starter,
      'winningBid', v_opening
    );
    v_events := v_events || jsonb_build_array(jsonb_build_object(
      'type', 'AUCTION_AUTO_PURCHASED',
      'nodeId', p_pending->>'nodeId',
      'playerId', v_starter,
      'amount', v_opening
    ));
    perform private.marble_auction_v2_settle(p_game_id, v_auction, v_events, false);
    return;
  end if;

  select coalesce(jsonb_agg(player_id order by random()), '[]'::jsonb)
  into v_participants
  from jsonb_array_elements_text(v_participants) as participant(player_id);

  v_starter := v_participants->>0;
  v_announcement_ends_at := now() + interval '2 seconds';
  v_selector_stops_at := now() + interval '9.2 seconds';
  v_starts_at := now() + interval '10.4 seconds';

  v_auction := jsonb_build_object(
    'type', 'PROPERTY_AUCTION',
    'nodeId', p_pending->>'nodeId',
    'openingBid', v_opening,
    'declinedByPlayerId', p_pending->>'declinedByPlayerId',
    'eligiblePlayerIds', coalesce(p_pending->'eligiblePlayerIds', '[]'::jsonb),
    'participantPlayerIds', v_participants,
    'starterPlayerId', v_starter,
    'bidPlayerIds', '[]'::jsonb,
    'passedPlayerIds', '[]'::jsonb,
    'highestBid', 0,
    'highestBidderId', null,
    'turnPlayerId', v_starter,
    'turnDeadlineAt', v_starts_at + interval '15 seconds',
    'announcementEndsAt', v_announcement_ends_at,
    'selectorStopsAt', v_selector_stops_at,
    'startsAt', v_starts_at,
    'status', 'OPEN',
    'winnerPlayerId', null,
    'winningBid', 0
  );

  v_events := v_events || jsonb_build_array(jsonb_build_object(
    'type', 'AUCTION_STARTING',
    'nodeId', p_pending->>'nodeId',
    'openingBid', v_opening,
    'starterPlayerId', v_starter,
    'participantPlayerIds', v_participants,
    'announcementEndsAt', v_announcement_ends_at,
    'selectorStopsAt', v_selector_stops_at,
    'startsAt', v_starts_at
  ));

  update public.marble_games
  set pending_choice = jsonb_build_object(
        'type', 'PROPERTY_AUCTION',
        'nodeId', p_pending->>'nodeId',
        'openingBid', v_opening,
        'starterPlayerId', v_starter,
        'participantPlayerIds', v_participants,
        'announcementEndsAt', v_announcement_ends_at,
        'selectorStopsAt', v_selector_stops_at,
        'startsAt', v_starts_at,
        'auction', v_auction
      ),
      last_events = v_events,
      version = version + 1,
      updated_at = now()
  where id = p_game_id;
end;
$function$;
