create or replace function public.marble_leave_room(p_room_id uuid, p_expected_version bigint)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_room public.marble_rooms%rowtype;
  v_next_host uuid;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;

  select * into v_room from public.marble_rooms where id = p_room_id for update;
  if not found then raise exception 'ROOM_NOT_FOUND'; end if;
  if v_room.version <> p_expected_version then raise exception 'VERSION_CONFLICT'; end if;
  if not public.marble_is_room_member(p_room_id) then raise exception 'NOT_ROOM_MEMBER'; end if;

  update public.marble_room_players
  set membership_status = 'left', is_ready = false, left_at = now()
  where room_id = p_room_id and user_id = auth.uid() and membership_status = 'active';

  if v_room.host_user_id = auth.uid() then
    select user_id into v_next_host
    from public.marble_room_players
    where room_id = p_room_id and membership_status = 'active'
    order by seat
    limit 1;
  else
    v_next_host := v_room.host_user_id;
  end if;

  if v_next_host is null then
    update public.marble_rooms
    set status = 'closed', version = version + 1, updated_at = now()
    where id = p_room_id;
    return jsonb_build_object('left', true, 'roomClosed', true);
  end if;

  update public.marble_rooms
  set host_user_id = v_next_host, version = version + 1, updated_at = now()
  where id = p_room_id;

  update public.marble_room_players
  set is_ready = true
  where room_id = p_room_id and user_id = v_next_host and membership_status = 'active';

  return jsonb_build_object('left', true, 'roomClosed', false, 'nextHostUserId', v_next_host);
end;
$$;

revoke all on function public.marble_leave_room(uuid, bigint) from public, anon;
grant execute on function public.marble_leave_room(uuid, bigint) to authenticated;
