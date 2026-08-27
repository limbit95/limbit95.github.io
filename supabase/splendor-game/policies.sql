-- Splendor phase 2: read access policies for approved room members.

create or replace function private.splendor_is_room_member(p_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and private.is_approved_member()
    and exists (
      select 1
      from public.splendor_room_players as srp
      where srp.room_id = p_room_id
        and srp.user_id = (select auth.uid())
        and srp.membership_status = 'active'
    );
$$;

revoke all on function private.splendor_is_room_member(uuid) from public, anon;
grant execute on function private.splendor_is_room_member(uuid) to authenticated;

drop policy if exists "splendor room members can read rooms" on public.splendor_rooms;
create policy "splendor room members can read rooms"
on public.splendor_rooms
for select
to authenticated
using (private.splendor_is_room_member(id));

drop policy if exists "splendor room members can read players" on public.splendor_room_players;
create policy "splendor room members can read players"
on public.splendor_room_players
for select
to authenticated
using (private.splendor_is_room_member(room_id));
