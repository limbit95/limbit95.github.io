begin;

revoke execute on function private.no_thanks_generate_room_code()
  from public, anon, authenticated;

revoke execute on function private.no_thanks_profile_display_name(uuid)
  from public, anon, authenticated;

revoke execute on function private.no_thanks_snapshot(uuid, uuid)
  from public, anon, authenticated;

revoke execute on function private.no_thanks_card_score(integer[])
  from public, anon, authenticated;

revoke execute on function private.no_thanks_is_room_member(uuid)
  from public, anon, authenticated;

grant execute on function private.no_thanks_is_room_member(uuid)
  to authenticated;

commit;
