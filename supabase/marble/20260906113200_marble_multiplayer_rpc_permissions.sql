revoke all on function public.marble_is_room_member(uuid) from public, anon;
revoke all on function public.marble_lobby_snapshot(uuid) from public, anon;
revoke all on function public.marble_create_room(text, smallint) from public, anon;
revoke all on function public.marble_join_room(text, text) from public, anon;
revoke all on function public.marble_get_my_active_room() from public, anon;
revoke all on function public.marble_get_lobby_snapshot(uuid) from public, anon;
revoke all on function public.marble_set_ready(uuid, boolean, bigint) from public, anon;
revoke all on function public.marble_leave_room(uuid, bigint) from public, anon;

grant execute on function public.marble_is_room_member(uuid) to authenticated;
grant execute on function public.marble_lobby_snapshot(uuid) to authenticated;
grant execute on function public.marble_create_room(text, smallint) to authenticated;
grant execute on function public.marble_join_room(text, text) to authenticated;
grant execute on function public.marble_get_my_active_room() to authenticated;
grant execute on function public.marble_get_lobby_snapshot(uuid) to authenticated;
grant execute on function public.marble_set_ready(uuid, boolean, bigint) to authenticated;
grant execute on function public.marble_leave_room(uuid, bigint) to authenticated;
