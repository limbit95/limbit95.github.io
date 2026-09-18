-- Phase 7A: prevent the legacy end-turn RPC from clearing an active auction flow.
-- BUY_PROPERTY / BUILD_PROPERTY remain declinable through marble_end_turn.

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
    and coalesce(v_game.pending_choice->>'type','') in ('AUCTION_REQUEST','PROPERTY_AUCTION')
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
