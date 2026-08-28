-- Liar Game v1.2.1: allow the host or an active round participant to finish
-- the deterministic capture-success reveal after the shared 5-second delay.
-- This prevents a suspended/disconnected host tab from stalling LIAR_REVEAL.

create or replace function public.liar_reveal_liars(p_player_key uuid,p_expected_round_version bigint)
returns table(round_version bigint,room_version bigint)
language plpgsql
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_round_version bigint;
  v_room_version bigint;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select lp.* into v_player
  from public.liar_players lp
  where lp.auth_user_id=v_auth
    and lp.player_key=p_player_key
    and lp.membership_status='active'
  for update;
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select rm.* into v_room
  from public.liar_rooms rm
  where rm.id=v_player.room_id
  for update;
  if not found or v_room.status<>'active' or clock_timestamp()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED',errcode='P0001';
  end if;

  select rd.* into v_round
  from public.liar_rounds rd
  where rd.id=v_room.current_round_id
  for update;
  if not found
     or v_round.status<>'LIAR_REVEAL'
     or v_round.capture_succeeded is not true
     or v_round.winner is not null then
    raise exception using message='INVALID_ROUND_STATE',errcode='P0001';
  end if;

  if v_room.host_player_id<>v_player.id
     and not exists(
       select 1
       from public.liar_round_players rp
       where rp.round_id=v_round.id
         and rp.player_id=v_player.id
     ) then
    raise exception using message='NOT_ROUND_PARTICIPANT',errcode='P0001';
  end if;

  if p_expected_round_version is null or v_round.version<>p_expected_round_version then
    raise exception using message='STALE_VERSION',errcode='P0001';
  end if;

  if clock_timestamp()<coalesce(v_round.updated_at,v_round.created_at)+interval '5 seconds' then
    raise exception using message='REVEAL_NOT_READY',errcode='P0001';
  end if;

  update public.liar_rounds rd
  set status='LIAR_GUESS',
      liars_revealed_at=coalesce(rd.liars_revealed_at,clock_timestamp()),
      guess_unlocked_at=coalesce(rd.guess_unlocked_at,clock_timestamp()+interval '8 seconds'),
      version=rd.version+1
  where rd.id=v_round.id
  returning rd.version into v_round_version;

  update public.liar_rooms rm
  set last_activity_at=clock_timestamp(),
      expires_at=clock_timestamp()+interval '24 hours',
      version=rm.version+1
  where rm.id=v_room.id
  returning rm.version into v_room_version;

  return query select v_round_version,v_room_version;
end;
$function$;

revoke all on function public.liar_reveal_liars(uuid,bigint) from public, anon;
grant execute on function public.liar_reveal_liars(uuid,bigint) to authenticated;
