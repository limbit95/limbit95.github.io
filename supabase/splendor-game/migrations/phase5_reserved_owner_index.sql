-- Phase 5 follow-up: support reserved-card owner lookups and FK cascades.
create index if not exists splendor_game_cards_owner_game_player_id_idx
  on public.splendor_game_cards(owner_game_player_id)
  where owner_game_player_id is not null;
