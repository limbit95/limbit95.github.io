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
  v_request jsonb := jsonb_build_object('action','auction_decline');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_node_id text;
  v_opening_bid integer;
  v_eligible jsonb;
  v_events jsonb;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;

  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id=v_room.current_game_id and room_id=p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(v_game.id,v_user,p_client_action_id,'auction_decline',v_request);
  if v_replay is not null then return v_replay; end if;
  if v_room.status <> 'playing' or v_game.status <> 'playing' then raise exception 'GAME_NOT_PLAYING'; end if;
  if v_game.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase <> 'WAITING_CHOICE' or v_game.pending_choice->>'type' <> 'BUY_PROPERTY' then
    raise exception 'PROPERTY_DECLINE_NOT_ALLOWED';
  end if;

  select * into v_actor from public.marble_game_players where game_id=v_game.id and user_id=v_user for update;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.seat <> v_game.current_seat then raise exception 'NOT_YOUR_TURN'; end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;

  v_node_id := v_game.pending_choice->>'nodeId';
  v_opening_bid := (v_game.pending_choice->>'price')::integer;
  select * into v_node from private.marble_classic_nodes where node_id=v_node_id and node_type='PROPERTY';
  if not found then raise exception 'PROPERTY_NOT_FOUND'; end if;
  select * into v_property from public.marble_game_properties where game_id=v_game.id and node_id=v_node_id for update;
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
    'type','CHOICE_DECLINED','playerId',v_actor.room_player_id::text,'choiceType','BUY_PROPERTY'
  ));

  if jsonb_array_length(v_eligible)=0 then
    v_events := v_events || jsonb_build_array(jsonb_build_object(
      'type','AUCTION_REQUEST_CLOSED','nodeId',v_node_id,'requestedByPlayerIds','[]'::jsonb,'reason','NO_ELIGIBLE_PLAYERS'
    ));
    update public.marble_games
    set phase='TURN_END', pending_choice=null, last_events=v_events, version=version+1, updated_at=now()
    where id=v_game.id;
  else
    v_events := v_events || jsonb_build_array(jsonb_build_object(
      'type','AUCTION_REQUEST_OPENED','nodeId',v_node_id,'openingBid',v_opening_bid,
      'declinedByPlayerId',v_actor.room_player_id::text,'eligiblePlayerIds',v_eligible
    ));
    update public.marble_games
    set pending_choice=jsonb_build_object(
      'type','AUCTION_REQUEST','nodeId',v_node_id,'openingBid',v_opening_bid,
      'declinedByPlayerId',v_actor.room_player_id::text,
      'eligiblePlayerIds',v_eligible,'requestedByPlayerIds','[]'::jsonb
    ), last_events=v_events, version=version+1, updated_at=now()
    where id=v_game.id;
  end if;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'auction_decline',v_request,v_before,v_response);
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
  v_request jsonb := jsonb_build_object('action','auction_request');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_player_id text;
  v_requested jsonb;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;
  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id=v_room.current_game_id and room_id=p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(v_game.id,v_user,p_client_action_id,'auction_request',v_request);
  if v_replay is not null then return v_replay; end if;
  if v_game.status<>'playing' or v_game.version<>p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase<>'WAITING_CHOICE' or v_game.pending_choice->>'type'<>'AUCTION_REQUEST' then raise exception 'AUCTION_REQUEST_NOT_OPEN'; end if;

  select * into v_actor from public.marble_game_players where game_id=v_game.id and user_id=v_user for update;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;
  v_player_id := v_actor.room_player_id::text;
  if not (coalesce(v_game.pending_choice->'eligiblePlayerIds','[]'::jsonb) ? v_player_id) then raise exception 'AUCTION_NOT_ELIGIBLE'; end if;
  v_requested := coalesce(v_game.pending_choice->'requestedByPlayerIds','[]'::jsonb);
  if v_requested ? v_player_id then raise exception 'AUCTION_ALREADY_REQUESTED'; end if;

  v_before := v_game.version;
  v_requested := v_requested || jsonb_build_array(v_player_id);
  update public.marble_games
  set pending_choice=jsonb_set(pending_choice,'{requestedByPlayerIds}',v_requested),
      last_events=jsonb_build_array(jsonb_build_object('type','AUCTION_REQUESTED','playerId',v_player_id,'nodeId',v_game.pending_choice->>'nodeId')),
      version=version+1, updated_at=now()
  where id=v_game.id;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'auction_request',v_request,v_before,v_response);
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
declare
  v_user uuid := auth.uid();
  v_room public.marble_rooms%rowtype;
  v_game public.marble_games%rowtype;
  v_actor public.marble_game_players%rowtype;
  v_request jsonb := jsonb_build_object('action','auction_request_close');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_requested jsonb;
  v_auction jsonb;
  v_reason text;
  v_events jsonb;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;
  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id=v_room.current_game_id and room_id=p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(v_game.id,v_user,p_client_action_id,'auction_request_close',v_request);
  if v_replay is not null then return v_replay; end if;
  if v_game.status<>'playing' or v_game.version<>p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase<>'WAITING_CHOICE' or v_game.pending_choice->>'type'<>'AUCTION_REQUEST' then raise exception 'AUCTION_REQUEST_NOT_OPEN'; end if;

  select * into v_actor from public.marble_game_players where game_id=v_game.id and user_id=v_user for update;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.seat<>v_game.current_seat or v_actor.room_player_id::text<>v_game.pending_choice->>'declinedByPlayerId' then
    raise exception 'AUCTION_REQUEST_CLOSE_NOT_ALLOWED';
  end if;

  v_before := v_game.version;
  v_requested := coalesce(v_game.pending_choice->'requestedByPlayerIds','[]'::jsonb);
  v_reason := case when jsonb_array_length(v_requested)>0 then 'REQUESTED' else 'NO_REQUESTS' end;
  v_events := jsonb_build_array(jsonb_build_object(
    'type','AUCTION_REQUEST_CLOSED','nodeId',v_game.pending_choice->>'nodeId',
    'requestedByPlayerIds',v_requested,'reason',v_reason
  ));

  if jsonb_array_length(v_requested)=0 then
    update public.marble_games
    set phase='TURN_END', pending_choice=null, last_events=v_events, version=version+1, updated_at=now()
    where id=v_game.id;
  else
    v_auction := jsonb_build_object(
      'type','PROPERTY_AUCTION','nodeId',v_game.pending_choice->>'nodeId',
      'openingBid',(v_game.pending_choice->>'openingBid')::integer,
      'declinedByPlayerId',v_game.pending_choice->>'declinedByPlayerId',
      'eligiblePlayerIds',v_game.pending_choice->'eligiblePlayerIds',
      'requestedByPlayerIds',v_requested,'bidPlayerIds','[]'::jsonb,'passedPlayerIds','[]'::jsonb,
      'highestBid',0,'highestBidderId',null,'status','OPEN','winnerPlayerId',null,'winningBid',0
    );
    v_events := v_events || jsonb_build_array(jsonb_build_object(
      'type','AUCTION_STARTED','nodeId',v_game.pending_choice->>'nodeId',
      'openingBid',(v_game.pending_choice->>'openingBid')::integer,
      'requestedByPlayerIds',v_requested,'eligiblePlayerIds',v_game.pending_choice->'eligiblePlayerIds'
    ));
    update public.marble_games
    set pending_choice=jsonb_build_object(
      'type','PROPERTY_AUCTION','nodeId',v_game.pending_choice->>'nodeId',
      'openingBid',(v_game.pending_choice->>'openingBid')::integer,
      'requestedByPlayerIds',v_requested,'auction',v_auction
    ), last_events=v_events, version=version+1, updated_at=now()
    where id=v_game.id;
  end if;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'auction_request_close',v_request,v_before,v_response);
  return v_response;
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
  v_winner public.marble_game_players%rowtype;
  v_property public.marble_game_properties%rowtype;
  v_request jsonb := jsonb_build_object('action','auction_bid','amount',p_amount,'pass',p_pass);
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_player_id text;
  v_auction jsonb;
  v_eligible jsonb;
  v_requested jsonb;
  v_bids jsonb;
  v_passed jsonb;
  v_opening integer;
  v_highest integer;
  v_highest_bidder text;
  v_minimum integer;
  v_remaining integer;
  v_status text := 'OPEN';
  v_events jsonb := '[]'::jsonb;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;
  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id=v_room.current_game_id and room_id=p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(v_game.id,v_user,p_client_action_id,'auction_bid',v_request);
  if v_replay is not null then return v_replay; end if;
  if v_game.status<>'playing' or v_game.version<>p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if v_game.phase<>'WAITING_CHOICE' or v_game.pending_choice->>'type'<>'PROPERTY_AUCTION' then raise exception 'AUCTION_NOT_OPEN'; end if;

  v_auction := v_game.pending_choice->'auction';
  if v_auction->>'status'<>'OPEN' then raise exception 'AUCTION_NOT_OPEN'; end if;
  select * into v_actor from public.marble_game_players where game_id=v_game.id and user_id=v_user for update;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;
  v_player_id := v_actor.room_player_id::text;
  v_eligible := coalesce(v_auction->'eligiblePlayerIds','[]'::jsonb);
  v_requested := coalesce(v_auction->'requestedByPlayerIds','[]'::jsonb);
  v_bids := coalesce(v_auction->'bidPlayerIds','[]'::jsonb);
  v_passed := coalesce(v_auction->'passedPlayerIds','[]'::jsonb);
  if not (v_eligible ? v_player_id) then raise exception 'AUCTION_NOT_ELIGIBLE'; end if;
  if v_passed ? v_player_id then raise exception 'AUCTION_ALREADY_PASSED'; end if;

  v_opening := (v_auction->>'openingBid')::integer;
  v_highest := coalesce((v_auction->>'highestBid')::integer,0);
  v_highest_bidder := v_auction->>'highestBidderId';
  v_minimum := case when v_highest>0 then v_highest+1 else v_opening end;
  v_before := v_game.version;

  if p_pass then
    if v_highest_bidder=v_player_id then raise exception 'AUCTION_HIGHEST_BIDDER_CANNOT_PASS'; end if;
    if (v_requested ? v_player_id) and not (v_bids ? v_player_id) and v_actor.money>=v_minimum then
      raise exception 'AUCTION_REQUESTER_BID_REQUIRED';
    end if;
    v_passed := v_passed || jsonb_build_array(v_player_id);
    v_auction := jsonb_set(v_auction,'{passedPlayerIds}',v_passed);
    v_events := jsonb_build_array(jsonb_build_object('type','AUCTION_PASSED','playerId',v_player_id,'nodeId',v_auction->>'nodeId'));
  else
    if p_amount is null or p_amount<v_minimum then raise exception 'AUCTION_BID_TOO_LOW'; end if;
    if p_amount>v_actor.money then raise exception 'INSUFFICIENT_GOLD'; end if;
    if not (v_bids ? v_player_id) then v_bids := v_bids || jsonb_build_array(v_player_id); end if;
    v_highest := p_amount;
    v_highest_bidder := v_player_id;
    v_auction := jsonb_set(v_auction,'{bidPlayerIds}',v_bids);
    v_auction := jsonb_set(v_auction,'{highestBid}',to_jsonb(v_highest));
    v_auction := jsonb_set(v_auction,'{highestBidderId}',to_jsonb(v_highest_bidder));
    v_events := jsonb_build_array(jsonb_build_object('type','AUCTION_BID_PLACED','playerId',v_player_id,'nodeId',v_auction->>'nodeId','amount',v_highest));
  end if;

  select count(*)::integer into v_remaining
  from jsonb_array_elements_text(v_eligible) as e(player_id)
  where not (v_passed ? e.player_id);

  if v_highest_bidder is null and v_remaining=0 then
    v_status := 'UNSOLD';
  elsif v_highest_bidder is not null and v_remaining=1 and not (v_passed ? v_highest_bidder) then
    v_status := 'WON';
  end if;

  if v_status='OPEN' then
    update public.marble_games
    set pending_choice=jsonb_set(pending_choice,'{auction}',v_auction), last_events=v_events,
        version=version+1, updated_at=now()
    where id=v_game.id;
  elsif v_status='UNSOLD' then
    v_events := v_events || jsonb_build_array(jsonb_build_object('type','AUCTION_ENDED','nodeId',v_auction->>'nodeId','winnerPlayerId',null,'amount',0));
    update public.marble_games
    set phase='TURN_END', pending_choice=null, last_events=v_events, version=version+1, updated_at=now()
    where id=v_game.id;
  else
    select * into v_winner from public.marble_game_players
    where game_id=v_game.id and room_player_id::text=v_highest_bidder for update;
    if not found or v_winner.bankrupt or v_winner.money<v_highest then raise exception 'AUCTION_WINNER_INVALID'; end if;
    select * into v_property from public.marble_game_properties
    where game_id=v_game.id and node_id=v_auction->>'nodeId' for update;
    if not found or v_property.owner_seat is not null then raise exception 'PROPERTY_NOT_AVAILABLE'; end if;
    update public.marble_game_players set money=money-v_highest where id=v_winner.id;
    update public.marble_game_properties set owner_seat=v_winner.seat, building_level=0
    where game_id=v_game.id and node_id=v_auction->>'nodeId';
    v_events := v_events || jsonb_build_array(
      jsonb_build_object('type','AUCTION_WON','nodeId',v_auction->>'nodeId','winnerPlayerId',v_highest_bidder,'amount',v_highest),
      jsonb_build_object('type','PROPERTY_BOUGHT','playerId',v_highest_bidder,'nodeId',v_auction->>'nodeId','amount',v_highest,'reason','AUCTION')
    );
    update public.marble_games
    set phase='TURN_END', pending_choice=null, last_events=v_events, version=version+1, updated_at=now()
    where id=v_game.id;
  end if;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'auction_bid',v_request,v_before,v_response);
  return v_response;
end;
$$;

revoke all on function public.marble_decline_property_for_auction(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_request_auction(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_close_auction_request(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_auction_bid(uuid,bigint,uuid,integer,boolean) from public, anon;
grant execute on function public.marble_decline_property_for_auction(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_request_auction(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_close_auction_request(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_auction_bid(uuid,bigint,uuid,integer,boolean) to authenticated;
