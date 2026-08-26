-- Final production hardening for Liar Game / Drawing Spy.
-- Keep historical settings RPC definitions for migration compatibility, but expose
-- only the current v4 settings contract to authenticated clients.

revoke all on function public.liar_update_game_settings(
  uuid,text[],text,integer,integer,boolean,bigint
) from public,anon,authenticated;

revoke all on function public.liar_update_game_settings_v2(
  uuid,text[],text,integer,integer,boolean,text,integer,integer,bigint
) from public,anon,authenticated;

revoke all on function public.liar_update_game_settings_v3(
  uuid,text[],text,integer,integer,boolean,text,integer,integer,boolean,bigint
) from public,anon,authenticated;

revoke all on function public.liar_update_game_settings_v4(
  uuid,text[],text,integer,integer,boolean,text,integer,integer,boolean,integer,integer,boolean,bigint
) from public,anon,authenticated;

grant execute on function public.liar_update_game_settings_v4(
  uuid,text[],text,integer,integer,boolean,text,integer,integer,boolean,integer,integer,boolean,bigint
) to authenticated;
