revoke execute on function public.the_game_set_game_settings(uuid, text, bigint) from anon;
revoke all on function public.the_game_set_game_settings(uuid, text, bigint) from public;
grant execute on function public.the_game_set_game_settings(uuid, text, bigint) to authenticated, service_role;
