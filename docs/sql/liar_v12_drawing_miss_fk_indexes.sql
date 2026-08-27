create index if not exists liar_drawing_misses_player_idx
  on public.liar_drawing_misses(player_id);

create index if not exists liar_drawing_misses_round_player_idx
  on public.liar_drawing_misses(round_player_id);
