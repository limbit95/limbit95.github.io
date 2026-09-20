begin;

create or replace function private.cant_stop_enforce_profile_nickname()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nickname text;
begin
  select btrim(p.display_name)
  into v_nickname
  from public.profiles as p
  where p.id = new.user_id;

  if char_length(coalesce(v_nickname, '')) not between 1 and 20 then
    raise exception 'PROFILE_NICKNAME_REQUIRED' using errcode = 'P0001';
  end if;

  new.nickname := v_nickname;
  return new;
end;
$$;

drop trigger if exists cant_stop_room_players_profile_nickname
  on public.cant_stop_room_players;

create trigger cant_stop_room_players_profile_nickname
before insert or update of nickname, user_id
on public.cant_stop_room_players
for each row
execute function private.cant_stop_enforce_profile_nickname();

update public.cant_stop_room_players as room_player
set nickname = btrim(profile.display_name)
from public.profiles as profile
where profile.id = room_player.user_id
  and char_length(btrim(coalesce(profile.display_name, ''))) between 1 and 20
  and room_player.nickname is distinct from btrim(profile.display_name);

revoke all on function private.cant_stop_enforce_profile_nickname()
  from public, anon, authenticated;

commit;
