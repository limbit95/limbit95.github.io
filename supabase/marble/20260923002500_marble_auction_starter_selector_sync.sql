-- Align Marble auction starter authority and expose profile avatars to the presentation layer.
-- Competitive auctions start with no implicit bid: the randomly selected starter owns the first actual turn.

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
  v_selector_stops_at := now() + interval '4.8 seconds';
  v_starts_at := now() + interval '5.6 seconds';

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
$function$


CREATE OR REPLACE FUNCTION private.marble_game_snapshot(p_room_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'private', 'pg_temp'
AS $function$
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
    'avatarPath', pr.avatar_path,
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
  left join public.profiles pr
    on pr.id = gp.user_id
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
$function$

