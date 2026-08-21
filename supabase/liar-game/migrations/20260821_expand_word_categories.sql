-- Expand Liar Game categories without rebuilding tables or removing data.
begin;

alter table public.liar_words
  drop constraint if exists liar_words_category_check;
alter table public.liar_words
  add constraint liar_words_category_check
  check (category in ('음식', '장소', '직업', '동물', '물건', '인물', '스포츠', '교통수단', '자연', '취미', '게임', '영화드라마', '음악', '기타'));

alter table public.liar_games
  drop constraint if exists liar_games_selected_categories_check;
alter table public.liar_games
  add constraint liar_games_selected_categories_check check (
    cardinality(selected_categories) >= 1
    and array_position(selected_categories, null) is null
    and selected_categories <@ array['음식', '장소', '직업', '동물', '물건', '인물', '스포츠', '교통수단', '자연', '취미', '게임', '영화드라마', '음악', '기타']::text[]
  );

alter table public.liar_rounds
  drop constraint if exists liar_rounds_category_snapshot_check;
alter table public.liar_rounds
  add constraint liar_rounds_category_snapshot_check
  check (category_snapshot in ('음식', '장소', '직업', '동물', '물건', '인물', '스포츠', '교통수단', '자연', '취미', '게임', '영화드라마', '음악', '기타'));

commit;
