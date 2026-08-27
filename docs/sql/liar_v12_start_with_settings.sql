-- Liar Game v1.2: apply the host's current setup draft and start the round atomically.

create or replace function public.liar_start_round_with_settings_v12(
  p_player_key uuid,
  p_selected_categories text[],
  p_difficulty text,
  p_liar_count integer,
  p_guess_limit integer,
  p_show_category_to_liar boolean,
  p_game_mode text,
  p_drawing_time_limit integer,
  p_drawing_stroke_limit integer,
  p_drawing_stroke_unlimited boolean,
  p_speaking_time_limit integer,
  p_discussion_time_limit integer,
  p_liars_know_each_other boolean,
  p_word_source_mode text,
  p_custom_word_pack_id uuid,
  p_expected_room_version bigint
)
returns table(round_id uuid, round_no integer, room_version bigint, round_version bigint)
language plpgsql
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_next_room_version bigint;
begin
  v_next_room_version:=public.liar_update_game_settings_v5(
    p_player_key,
    p_selected_categories,
    p_difficulty,
    p_liar_count,
    p_guess_limit,
    p_show_category_to_liar,
    p_game_mode,
    p_drawing_time_limit,
    p_drawing_stroke_limit,
    p_drawing_stroke_unlimited,
    p_speaking_time_limit,
    p_discussion_time_limit,
    p_liars_know_each_other,
    p_word_source_mode,
    p_custom_word_pack_id,
    p_expected_room_version
  );

  return query
  select *
  from public.liar_start_round(p_player_key,v_next_room_version);
end;
$function$;

revoke all on function public.liar_start_round_with_settings_v12(uuid,text[],text,integer,integer,boolean,text,integer,integer,boolean,integer,integer,boolean,text,uuid,bigint) from public,anon;
grant execute on function public.liar_start_round_with_settings_v12(uuid,text[],text,integer,integer,boolean,text,integer,integer,boolean,integer,integer,boolean,text,uuid,bigint) to authenticated;
