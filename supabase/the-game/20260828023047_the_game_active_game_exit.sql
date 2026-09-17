alter table public.the_game_games
  drop constraint if exists the_game_games_status_check;

alter table public.the_game_games
  add constraint the_game_games_status_check
  check (status = any (array['playing'::text, 'won'::text, 'lost'::text, 'abandoned'::text]));

create or replace function public.the_game_close_game(
  p_room_id uuid,
  p_expected_room_version bigint,
  p_expected_game_version bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid := (select auth.uid());
  v_room public.the_game_rooms%rowtype;
  v_game public.the_game_games%rowtype;
  v_new_room_version bigint;
  v_new_game_version bigint;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED' using errcode = 'P0001';
  end if;

  select * into v_room
  from public.the_game_rooms
  where id = p_room_id
  for update;

  if not found then
    raise exception 'ROOM_NOT_FOUND' using errcode = 'P0001';
  end if;
  if p_expected_room_version is null or v_room.version <> p_expected_room_version then
    raise exception 'STATE_CHANGED' using errcode = 'P0001';
  end if;
  if v_room.status <> 'playing' or v_room.current_game_id is null then
    raise exception 'GAME_NOT_PLAYING' using errcode = 'P0001';
  end if;
  if not exists (
    select 1
    from public.the_game_room_players rp
    where rp.room_id = p_room_id
      and rp.user_id = v_user_id
      and rp.membership_status = 'active'
  ) then
    raise exception 'PLAYER_NOT_MEMBER' using errcode = 'P0001';
  end if;

  select * into v_game
  from public.the_game_games
  where id = v_room.current_game_id
    and room_id = p_room_id
  for update;

  if not found then
    raise exception 'GAME_NOT_FOUND' using errcode = 'P0001';
  end if;
  if p_expected_game_version is null or v_game.version <> p_expected_game_version then
    raise exception 'STATE_CHANGED' using errcode = 'P0001';
  end if;
  if v_game.status <> 'playing' then
    raise exception 'GAME_NOT_PLAYING' using errcode = 'P0001';
  end if;

  update public.the_game_games
  set status = 'abandoned',
      version = version + 1,
      updated_at = now(),
      finished_at = coalesce(finished_at, now())
  where id = v_game.id
  returning version into v_new_game_version;

  delete from private.the_game_draw_piles
  where game_id = v_game.id;

  delete from private.the_game_player_hands
  where game_id = v_game.id;

  delete from private.the_game_action_log
  where game_id = v_game.id;

  update public.the_game_room_players
  set membership_status = 'left',
      is_ready = false,
      left_at = coalesce(left_at, now())
  where room_id = p_room_id
    and membership_status = 'active';

  update public.the_game_rooms
  set status = 'closed',
      version = version + 1,
      updated_at = now()
  where id = p_room_id
  returning version into v_new_room_version;

  return jsonb_build_object(
    'closed', true,
    'room_id', p_room_id,
    'game_id', v_game.id,
    'game_status', 'abandoned',
    'room_version', v_new_room_version,
    'game_version', v_new_game_version
  );
end;
$function$;

revoke all on function public.the_game_close_game(uuid, bigint, bigint) from public;
revoke all on function public.the_game_close_game(uuid, bigint, bigint) from anon;
grant execute on function public.the_game_close_game(uuid, bigint, bigint) to authenticated;
grant execute on function public.the_game_close_game(uuid, bigint, bigint) to service_role;