begin;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'no_thanks_rooms'
  ) then
    alter publication supabase_realtime add table public.no_thanks_rooms;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'no_thanks_room_players'
  ) then
    alter publication supabase_realtime add table public.no_thanks_room_players;
  end if;
end;
$$;

commit;
