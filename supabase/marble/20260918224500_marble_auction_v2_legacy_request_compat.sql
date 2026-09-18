-- Normalize in-flight Phase 7A AUCTION_REQUEST snapshots created before Auction v2.
-- Only legacy request windows with no confirmed requester are upgraded.

do $$
declare
  v_game record;
  v_base_price integer;
  v_opening_bid integer;
  v_eligible jsonb;
  v_deadline timestamptz;
  v_declined_player_id text;
begin
  for v_game in
    select id, pending_choice
    from public.marble_games
    where status = 'playing'
      and phase = 'WAITING_CHOICE'
      and pending_choice->>'type' = 'AUCTION_REQUEST'
      and (
        not (pending_choice ? 'basePrice')
        or not (pending_choice ? 'deadlineAt')
      )
      and jsonb_array_length(
        coalesce(pending_choice->'requestedByPlayerIds', '[]'::jsonb)
      ) = 0
    for update
  loop
    v_base_price := coalesce(
      nullif(v_game.pending_choice->>'basePrice', '')::integer,
      nullif(v_game.pending_choice->>'openingBid', '')::integer
    );

    if v_base_price is null or v_base_price <= 0 then
      continue;
    end if;

    v_opening_bid := round(v_base_price::numeric * 1.5)::integer;
    v_deadline := now() + interval '10 seconds';
    v_declined_player_id := v_game.pending_choice->>'declinedByPlayerId';

    select coalesce(
      jsonb_agg(gp.room_player_id::text order by gp.seat),
      '[]'::jsonb
    )
    into v_eligible
    from public.marble_game_players gp
    where gp.game_id = v_game.id
      and gp.room_player_id::text <> v_declined_player_id
      and not gp.bankrupt
      and gp.money >= v_opening_bid;

    update public.marble_games
    set pending_choice = jsonb_build_object(
          'type', 'AUCTION_REQUEST',
          'nodeId', v_game.pending_choice->>'nodeId',
          'basePrice', v_base_price,
          'openingBid', v_opening_bid,
          'declinedByPlayerId', v_declined_player_id,
          'eligiblePlayerIds', v_eligible,
          'requestedByPlayerIds', '[]'::jsonb,
          'deadlineAt', v_deadline
        ),
        last_events = jsonb_build_array(jsonb_build_object(
          'type', 'AUCTION_REQUEST_OPENED',
          'nodeId', v_game.pending_choice->>'nodeId',
          'openingBid', v_opening_bid,
          'declinedByPlayerId', v_declined_player_id,
          'eligiblePlayerIds', v_eligible,
          'deadlineAt', v_deadline
        )),
        version = version + 1,
        updated_at = now()
    where id = v_game.id;
  end loop;
end;
$$;
