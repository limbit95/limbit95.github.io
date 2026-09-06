create table private.marble_action_log (
  id bigint generated always as identity primary key,
  game_id uuid not null references public.marble_games(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  client_action_id uuid not null,
  action_type text not null,
  request jsonb not null,
  game_version_before bigint not null,
  game_version_after bigint not null,
  response jsonb not null,
  created_at timestamptz not null default now(),
  unique(game_id, user_id, client_action_id)
);

create or replace function private.marble_action_replay(
  p_game_id uuid,
  p_user_id uuid,
  p_client_action_id uuid,
  p_action_type text,
  p_request jsonb
)
returns jsonb
language plpgsql
stable
security definer
set search_path = private, pg_temp
as $$
declare
  v_log private.marble_action_log%rowtype;
begin
  select * into v_log
  from private.marble_action_log
  where game_id = p_game_id and user_id = p_user_id and client_action_id = p_client_action_id;
  if not found then return null; end if;
  if v_log.action_type <> p_action_type or v_log.request <> p_request then
    raise exception 'CLIENT_ACTION_REUSED';
  end if;
  return v_log.response;
end;
$$;

create or replace function private.marble_record_action(
  p_game_id uuid,
  p_user_id uuid,
  p_client_action_id uuid,
  p_action_type text,
  p_request jsonb,
  p_before bigint,
  p_response jsonb
)
returns void
language plpgsql
security definer
set search_path = private, pg_temp
as $$
begin
  insert into private.marble_action_log(
    game_id,user_id,client_action_id,action_type,request,game_version_before,game_version_after,response
  ) values (
    p_game_id,p_user_id,p_client_action_id,p_action_type,p_request,p_before,
    (p_response #>> '{game,version}')::bigint,p_response
  );
end;
$$;

create or replace function private.marble_player_public_id(p_game_id uuid, p_seat smallint)
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select room_player_id::text from public.marble_game_players where game_id = p_game_id and seat = p_seat;
$$;

create or replace function private.marble_charge_player(
  p_game_id uuid,
  p_seat smallint,
  p_amount integer,
  p_creditor_seat smallint,
  p_reason text,
  p_events jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_player public.marble_game_players%rowtype;
  v_player_id text;
  v_creditor_id text;
  v_events jsonb := coalesce(p_events, '[]'::jsonb);
begin
  select * into v_player from public.marble_game_players
  where game_id = p_game_id and seat = p_seat for update;
  if not found then raise exception 'PLAYER_NOT_FOUND'; end if;
  v_player_id := v_player.room_player_id::text;
  if p_creditor_seat is not null then
    v_creditor_id := private.marble_player_public_id(p_game_id, p_creditor_seat);
  end if;

  if v_player.money < p_amount then
    if p_creditor_seat is not null and v_player.money > 0 then
      update public.marble_game_players
      set money = money + v_player.money
      where game_id = p_game_id and seat = p_creditor_seat;
    end if;
    update public.marble_game_players set money = 0, bankrupt = true
    where game_id = p_game_id and seat = p_seat;
    update public.marble_game_properties set owner_seat = null, building_level = 0
    where game_id = p_game_id and owner_seat = p_seat;
    return v_events || jsonb_build_array(jsonb_build_object(
      'type','PLAYER_BANKRUPT','playerId',v_player_id,'creditorId',v_creditor_id
    ));
  end if;

  update public.marble_game_players set money = money - p_amount
  where game_id = p_game_id and seat = p_seat;
  if p_creditor_seat is not null then
    update public.marble_game_players set money = money + p_amount
    where game_id = p_game_id and seat = p_creditor_seat;
  end if;
  return v_events || jsonb_build_array(jsonb_build_object(
    'type','MONEY_PAID','playerId',v_player_id,'creditorId',v_creditor_id,
    'amount',p_amount,'reason',p_reason
  ));
end;
$$;

create or replace function public.marble_roll_dice(
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
  v_node private.marble_classic_nodes%rowtype;
  v_property public.marble_game_properties%rowtype;
  v_request jsonb := jsonb_build_object('action','roll');
  v_replay jsonb;
  v_response jsonb;
  v_before bigint;
  v_d1 smallint;
  v_d2 smallint;
  v_total integer;
  v_new_index smallint;
  v_passed integer;
  v_path jsonb;
  v_events jsonb := '[]'::jsonb;
  v_phase text := 'TURN_END';
  v_status text := 'playing';
  v_pending jsonb := null;
  v_winner smallint := null;
  v_event_cursor integer;
  v_toll integer;
  v_event_type text;
  v_event_amount integer;
  v_event_id text;
  v_event_label text;
  v_active integer;
  v_winner_id text;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;

  select * into v_room from public.marble_rooms where id = p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id = v_room.current_game_id and room_id = p_room_id for update;
  if not found then raise exception 'GAME_NOT_FOUND'; end if;

  v_replay := private.marble_action_replay(v_game.id,v_user,p_client_action_id,'roll',v_request);
  if v_replay is not null then return v_replay; end if;

  if v_room.status <> 'playing' or v_game.status <> 'playing' then raise exception 'GAME_NOT_PLAYING'; end if;
  if v_game.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  select * into v_actor from public.marble_game_players where game_id=v_game.id and user_id=v_user;
  if not found then raise exception 'NOT_ROOM_MEMBER'; end if;
  if v_actor.seat <> v_game.current_seat then raise exception 'NOT_YOUR_TURN'; end if;
  if v_game.phase <> 'WAITING_ROLL' then raise exception 'ROLL_NOT_ALLOWED'; end if;
  if v_actor.bankrupt then raise exception 'PLAYER_BANKRUPT'; end if;

  v_before := v_game.version;
  v_d1 := (floor(random()*6)+1)::smallint;
  v_d2 := (floor(random()*6)+1)::smallint;
  v_total := v_d1 + v_d2;
  v_new_index := ((v_actor.position_index + v_total) % 32)::smallint;
  v_passed := ((v_actor.position_index + v_total) / 32)::integer;
  v_event_cursor := v_game.event_cursor;

  select coalesce(jsonb_agg(n.node_id order by s.step), '[]'::jsonb)
  into v_path
  from generate_series(1,v_total) as s(step)
  join private.marble_classic_nodes n on n.node_index = ((v_actor.position_index + s.step) % 32)::smallint;

  v_events := v_events || jsonb_build_array(jsonb_build_object(
    'type','DICE_ROLLED','playerId',v_actor.room_player_id::text,
    'dice',jsonb_build_array(v_d1,v_d2),'total',v_total
  ));

  if v_passed > 0 then
    update public.marble_game_players set money = money + (v_passed * 200)
    where id = v_actor.id;
    v_events := v_events || jsonb_build_array(jsonb_build_object(
      'type','START_PASSED','playerId',v_actor.room_player_id::text,
      'count',v_passed,'amount',v_passed*200
    ));
  end if;

  update public.marble_game_players set position_index = v_new_index where id = v_actor.id;
  v_events := v_events || jsonb_build_array(jsonb_build_object(
    'type','PLAYER_MOVED','playerId',v_actor.room_player_id::text,
    'fromNodeId',(select node_id from private.marble_classic_nodes where node_index=v_actor.position_index),
    'toNodeId',(select node_id from private.marble_classic_nodes where node_index=v_new_index),
    'path',v_path
  ));

  select * into v_node from private.marble_classic_nodes where node_index = v_new_index;
  v_events := v_events || jsonb_build_array(jsonb_build_object(
    'type','TILE_LANDED','playerId',v_actor.room_player_id::text,
    'nodeId',v_node.node_id,'tileType',v_node.node_type
  ));

  select * into v_actor from public.marble_game_players where id = v_actor.id;

  if v_node.node_type = 'PROPERTY' then
    select * into v_property from public.marble_game_properties
    where game_id=v_game.id and node_id=v_node.node_id for update;
    if v_property.owner_seat is null then
      v_phase := 'WAITING_CHOICE';
      v_pending := jsonb_build_object('type','BUY_PROPERTY','nodeId',v_node.node_id,'price',v_node.price);
    elsif v_property.owner_seat = v_actor.seat then
      if v_property.building_level < v_node.max_building_level and v_actor.money >= v_node.build_cost then
        v_phase := 'WAITING_CHOICE';
        v_pending := jsonb_build_object('type','BUILD_PROPERTY','nodeId',v_node.node_id,'cost',v_node.build_cost);
      end if;
    else
      v_toll := v_node.base_toll * case v_property.building_level when 0 then 1 when 1 then 2 when 2 then 4 else 7 end;
      v_events := private.marble_charge_player(v_game.id,v_actor.seat,v_toll,v_property.owner_seat,'TOLL',v_events);
    end if;
  elsif v_node.node_type = 'BONUS' then
    update public.marble_game_players set money = money + v_node.amount where id=v_actor.id;
    v_events := v_events || jsonb_build_array(jsonb_build_object(
      'type','MONEY_RECEIVED','playerId',v_actor.room_player_id::text,'amount',v_node.amount,'reason','BONUS'
    ));
  elsif v_node.node_type = 'TAX' then
    v_events := private.marble_charge_player(v_game.id,v_actor.seat,v_node.amount,null,'TAX',v_events);
  elsif v_node.node_type = 'REST' then
    update public.marble_game_players set skip_turns = skip_turns + v_node.skip_turns where id=v_actor.id;
    v_events := v_events || jsonb_build_array(jsonb_build_object(
      'type','REST_ASSIGNED','playerId',v_actor.room_player_id::text,'skipTurns',v_node.skip_turns
    ));
  elsif v_node.node_type = 'EVENT' then
    case (v_event_cursor % 4)
      when 0 then v_event_id:='travel-grant'; v_event_type:='BONUS'; v_event_amount:=120; v_event_label:='여행 지원금을 받았습니다.';
      when 1 then v_event_id:='lost-baggage'; v_event_type:='TAX'; v_event_amount:=90; v_event_label:='수하물 문제로 비용이 발생했습니다.';
      when 2 then v_event_id:='local-festival'; v_event_type:='BONUS'; v_event_amount:=160; v_event_label:='지역 축제 보너스를 받았습니다.';
      else v_event_id:='exchange-fee'; v_event_type:='TAX'; v_event_amount:=110; v_event_label:='환전 수수료가 발생했습니다.';
    end case;
    v_event_cursor := v_event_cursor + 1;
    v_events := v_events || jsonb_build_array(jsonb_build_object(
      'type','EVENT_DRAWN','playerId',v_actor.room_player_id::text,'eventId',v_event_id,'label',v_event_label
    ));
    if v_event_type='BONUS' then
      update public.marble_game_players set money=money+v_event_amount where id=v_actor.id;
      v_events := v_events || jsonb_build_array(jsonb_build_object(
        'type','MONEY_RECEIVED','playerId',v_actor.room_player_id::text,'amount',v_event_amount,'reason','EVENT'
      ));
    else
      v_events := private.marble_charge_player(v_game.id,v_actor.seat,v_event_amount,null,'EVENT',v_events);
    end if;
  end if;

  if v_phase = 'TURN_END' then
    select count(*)::integer into v_active from public.marble_game_players where game_id=v_game.id and not bankrupt;
    if v_active <= 1 then
      select seat, room_player_id::text into v_winner, v_winner_id
      from public.marble_game_players where game_id=v_game.id and not bankrupt order by seat limit 1;
      v_status := 'finished';
      v_phase := 'FINISHED';
      v_pending := null;
      v_events := v_events || jsonb_build_array(jsonb_build_object('type','GAME_FINISHED','winnerPlayerId',v_winner_id));
      update public.marble_rooms set status='closed', version=version+1, updated_at=now() where id=p_room_id;
    end if;
  end if;

  update public.marble_games
  set status=v_status, phase=v_phase, pending_choice=v_pending,
      last_roll=jsonb_build_object('dice',jsonb_build_array(v_d1,v_d2),'total',v_total,'isDouble',v_d1=v_d2),
      last_events=v_events, winner_seat=v_winner, event_cursor=v_event_cursor,
      version=version+1, updated_at=now()
  where id=v_game.id;

  v_response := private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'roll',v_request,v_before,v_response);
  return v_response;
end;
$$;

create or replace function public.marble_buy_property(
  p_room_id uuid,p_expected_version bigint,p_client_action_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user uuid:=auth.uid(); v_room public.marble_rooms%rowtype; v_game public.marble_games%rowtype;
  v_actor public.marble_game_players%rowtype; v_node private.marble_classic_nodes%rowtype;
  v_property public.marble_game_properties%rowtype; v_request jsonb:=jsonb_build_object('action','buy');
  v_replay jsonb; v_response jsonb; v_before bigint; v_node_id text;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;
  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id=v_room.current_game_id for update;
  v_replay:=private.marble_action_replay(v_game.id,v_user,p_client_action_id,'buy',v_request);
  if v_replay is not null then return v_replay; end if;
  if v_game.status<>'playing' or v_game.version<>p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  select * into v_actor from public.marble_game_players where game_id=v_game.id and user_id=v_user;
  if not found or v_actor.seat<>v_game.current_seat then raise exception 'NOT_YOUR_TURN'; end if;
  if v_game.phase<>'WAITING_CHOICE' or v_game.pending_choice->>'type'<>'BUY_PROPERTY' then raise exception 'BUY_NOT_ALLOWED'; end if;
  v_node_id:=v_game.pending_choice->>'nodeId';
  select * into v_node from private.marble_classic_nodes where node_id=v_node_id;
  select * into v_property from public.marble_game_properties where game_id=v_game.id and node_id=v_node_id for update;
  if v_property.owner_seat is not null then raise exception 'PROPERTY_OWNED'; end if;
  if v_actor.money<v_node.price then raise exception 'INSUFFICIENT_GOLD'; end if;
  v_before:=v_game.version;
  update public.marble_game_players set money=money-v_node.price where id=v_actor.id;
  update public.marble_game_properties set owner_seat=v_actor.seat,building_level=0 where game_id=v_game.id and node_id=v_node_id;
  update public.marble_games set phase='TURN_END',pending_choice=null,
    last_events=jsonb_build_array(jsonb_build_object('type','PROPERTY_BOUGHT','playerId',v_actor.room_player_id::text,'nodeId',v_node_id,'amount',v_node.price)),
    version=version+1,updated_at=now() where id=v_game.id;
  v_response:=private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'buy',v_request,v_before,v_response);
  return v_response;
end;
$$;

create or replace function public.marble_build_property(
  p_room_id uuid,p_expected_version bigint,p_client_action_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_user uuid:=auth.uid(); v_room public.marble_rooms%rowtype; v_game public.marble_games%rowtype;
  v_actor public.marble_game_players%rowtype; v_node private.marble_classic_nodes%rowtype;
  v_property public.marble_game_properties%rowtype; v_request jsonb:=jsonb_build_object('action','build');
  v_replay jsonb; v_response jsonb; v_before bigint; v_node_id text; v_next_level smallint;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_client_action_id is null then raise exception 'INVALID_ACTION_ID'; end if;
  select * into v_room from public.marble_rooms where id=p_room_id for update;
  if not found or v_room.current_game_id is null then raise exception 'GAME_NOT_FOUND'; end if;
  select * into v_game from public.marble_games where id=v_room.current_game_id for update;
  v_replay:=private.marble_action_replay(v_game.id,v_user,p_client_action_id,'build',v_request);
  if v_replay is not null then return v_replay; end if;
  if v_game.status<>'playing' or v_game.version<>p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  select * into v_actor from public.marble_game_players where game_id=v_game.id and user_id=v_user;
  if not found or v_actor.seat<>v_game.current_seat then raise exception 'NOT_YOUR_TURN'; end if;
  if v_game.phase<>'WAITING_CHOICE' or v_game.pending_choice->>'type'<>'BUILD_PROPERTY' then raise exception 'BUILD_NOT_ALLOWED'; end if;
  v_node_id:=v_game.pending_choice->>'nodeId';
  select * into v_node from private.marble_classic_nodes where node_id=v_node_id;
  select * into v_property from public.marble_game_properties where game_id=v_game.id and node_id=v_node_id for update;
  if v_property.owner_seat<>v_actor.seat then raise exception 'NOT_PROPERTY_OWNER'; end if;
  if v_property.building_level>=v_node.max_building_level then raise exception 'MAX_BUILDING_LEVEL'; end if;
  if v_actor.money<v_node.build_cost then raise exception 'INSUFFICIENT_GOLD'; end if;
  v_before:=v_game.version; v_next_level:=v_property.building_level+1;
  update public.marble_game_players set money=money-v_node.build_cost where id=v_actor.id;
  update public.marble_game_properties set building_level=v_next_level where game_id=v_game.id and node_id=v_node_id;
  update public.marble_games set phase='TURN_END',pending_choice=null,
    last_events=jsonb_build_array(jsonb_build_object('type','PROPERTY_BUILT','playerId',v_actor.room_player_id::text,'nodeId',v_node_id,'buildingLevel',v_next_level,'amount',v_node.build_cost)),
    version=version+1,updated_at=now() where id=v_game.id;
  v_response:=private.marble_game_snapshot(p_room_id);
  perform private.marble_record_action(v_game.id,v_user,p_client_action_id,'build',v_request,v_before,v_response);
  return v_response;
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

revoke all on function public.marble_roll_dice(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_buy_property(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_build_property(uuid,bigint,uuid) from public, anon;
revoke all on function public.marble_end_turn(uuid,bigint,uuid) from public, anon;
grant execute on function public.marble_roll_dice(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_buy_property(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_build_property(uuid,bigint,uuid) to authenticated;
grant execute on function public.marble_end_turn(uuid,bigint,uuid) to authenticated;
