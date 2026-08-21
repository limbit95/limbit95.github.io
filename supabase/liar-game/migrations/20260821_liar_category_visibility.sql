begin;

alter table public.liar_games
  add column if not exists show_category_to_liar boolean not null default true;

commit;
