create index if not exists the_game_player_hands_user_idx
on private.the_game_player_hands(user_id, game_id);

grant execute on function private.the_game_is_game_member(uuid) to authenticated;