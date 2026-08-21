begin;

alter table public.liar_rounds
  add column if not exists liars_revealed_at timestamptz;

commit;
