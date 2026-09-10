create or replace function public.marble_create_room(p_nickname text, p_max_players smallint default 4)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_room public.marble_rooms%rowtype;
  v_code text;
  v_nickname text := btrim(coalesce(p_nickname, ''));
  v_attempt integer := 0;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if char_length(v_nickname) < 1 or char_length(v_nickname) > 20 then raise exception 'INVALID_NICKNAME'; end if;
  if p_max_players < 2 or p_max_players > 4 then raise exception 'INVALID_PLAYER_COUNT'; end if;

  if exists (
    select 1 from public.marble_room_players rp
    join public.marble_rooms r on r.id = rp.room_id
    where rp.user_id = v_user
      and rp.membership_status = 'active'
      and r.status in ('waiting','playing')
      and r.expires_at > now()
  ) then
    raise exception 'ACTIVE_ROOM_EXISTS';
  end if;

  loop
    v_attempt := v_attempt + 1;
    v_code := upper(substr(encode(extensions.gen_random_bytes(4), 'hex'), 1, 6));
    begin
      insert into public.marble_rooms(room_code, host_user_id, max_players)
      values (v_code, v_user, p_max_players)
      returning * into v_room;
      exit;
    exception when unique_violation then
      if v_attempt >= 8 then raise; end if;
    end;
  end loop;

  insert into public.marble_room_players(room_id, user_id, nickname, seat, is_ready)
  values (v_room.id, v_user, v_nickname, 0, true);

  return public.marble_lobby_snapshot(v_room.id);
end;
$$;

revoke all on function public.marble_create_room(text, smallint) from public;
revoke execute on function public.marble_create_room(text, smallint) from anon;
grant execute on function public.marble_create_room(text, smallint) to authenticated;
