-- Fix Phase 3 guess normalization: use a POSIX whitespace class so SQL
-- string escaping cannot leave spaces behind (e.g. "PC 방" -> "pc방").
create or replace function public.liar_normalize_guess_text(p_text text)
returns text
language sql
immutable strict
set search_path=pg_catalog,public
as $$
  select lower(regexp_replace(btrim(normalize(p_text,NFC)), '[[:space:]]+', '', 'g'));
$$;

update public.liar_words
set normalized_word=public.liar_normalize_guess_text(word);
