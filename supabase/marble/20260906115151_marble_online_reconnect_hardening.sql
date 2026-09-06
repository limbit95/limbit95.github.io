create or replace function public.marble_get_my_active_game()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, private, pg_temp
as $$
declare
  v_room_id uuid;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  select rp.room_id into v_room_id
  from public.marble_room_players rp
  join public.marble_rooms r on r.id = rp.room_id
  join public.marble_games g on g.id = r.current_game_id
  where rp.user_id = auth.uid()
    and rp.membership_status = 'active'
    and r.current_game_id is not null
    and (
      (r.status = 'playing' and g.status in ('playing','finished'))
      or (r.status = 'closed' and g.status = 'finished')
    )
  order by g.updated_at desc
  limit 1;
  if v_room_id is null then return null; end if;
  return private.marble_game_snapshot(v_room_id);
end;
$$;

create or replace function public.marble_leave_room(p_room_id uuid, p_expected_version bigint)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_room public.marble_rooms%rowtype;
  v_next_host uuid;
  v_game_status text;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  select * into v_room from public.marble_rooms where id = p_room_id for update;
  if not found then raise exception 'ROOM_NOT_FOUND'; end if;
  if v_room.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if not public.marble_is_room_member(p_room_id) then raise exception 'NOT_ROOM_MEMBER'; end if;

  if v_room.current_game_id is not null then
    select status into v_game_status from public.marble_games where id = v_room.current_game_id;
    if v_game_status = 'playing' then raise exception 'GAME_IN_PROGRESS'; end if;
  end if;

  update public.marble_room_players
  set membership_status = 'left', is_ready = false, left_at = now()
  where room_id = p_room_id and user_id = auth.uid() and membership_status = 'active';

  if v_room.host_user_id = auth.uid() then
    select user_id into v_next_host
    from public.marble_room_players
    where room_id = p_room_id and membership_status = 'active'
    order by seat limit 1;
  else
    v_next_host := v_room.host_user_id;
  end if;

  if v_next_host is null then
    update public.marble_rooms set status='closed',version=version+1,updated_at=now() where id=p_room_id;
    return jsonb_build_object('left',true,'roomClosed',true);
  end if;

  update public.marble_rooms set host_user_id=v_next_host,version=version+1,updated_at=now() where id=p_room_id;
  update public.marble_room_players set is_ready=true
  where room_id=p_room_id and user_id=v_next_host and membership_status='active';
  return jsonb_build_object('left',true,'roomClosed',false,'nextHostUserId',v_next_host);
end;
$$;

revoke all on function public.marble_get_my_active_game() from public, anon;
revoke all on function public.marble_leave_room(uuid,bigint) from public, anon;
grant execute on function public.marble_get_my_active_game() to authenticated;
grant execute on function public.marble_leave_room(uuid,bigint) to authenticated;
