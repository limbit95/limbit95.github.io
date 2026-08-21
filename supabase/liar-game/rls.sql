-- Liar Game phase 2 access boundary. All normal reads and writes go through
-- carefully projected SECURITY DEFINER RPCs; base tables expose no client rows.

alter table public.liar_rooms enable row level security;
alter table public.liar_players enable row level security;
alter table public.liar_games enable row level security;
alter table public.liar_rounds enable row level security;
alter table public.liar_round_players enable row level security;
alter table public.liar_vote_stages enable row level security;
alter table public.liar_ballots enable row level security;
alter table public.liar_votes enable row level security;
alter table public.liar_guesses enable row level security;
alter table public.liar_words enable row level security;

-- No SELECT policies are defined: this deliberately protects round words,
-- roles, votes, guesses, and the word pool. No INSERT/UPDATE/DELETE policies are
-- defined either. Authenticated clients use the RPCs below; anon has no access.
revoke all on table public.liar_rooms, public.liar_players, public.liar_games,
  public.liar_rounds, public.liar_round_players, public.liar_vote_stages,
  public.liar_ballots, public.liar_votes, public.liar_guesses, public.liar_words
from anon, authenticated;

revoke all on function public.liar_create_room(uuid,text,text[],text,integer,integer) from public, anon, authenticated;
revoke all on function public.liar_join_room(text,uuid,text) from public, anon, authenticated;
revoke all on function public.liar_leave_room(uuid) from public, anon, authenticated;
revoke all on function public.liar_get_my_active_rooms() from public, anon, authenticated;
revoke all on function public.liar_resume_room(uuid,uuid) from public, anon, authenticated;
revoke all on function public.liar_update_nickname(uuid,text) from public, anon, authenticated;
revoke all on function public.liar_set_ready(uuid,boolean) from public, anon, authenticated;
revoke all on function public.liar_update_game_settings(uuid,text[],text,integer,integer,boolean,bigint) from public, anon, authenticated;
revoke all on function public.liar_start_round(uuid,bigint) from public, anon, authenticated;
revoke all on function public.liar_restart_game(uuid,bigint) from public, anon, authenticated;
revoke all on function public.liar_mark_role_checked(uuid) from public, anon, authenticated;
revoke all on function public.liar_get_my_round_role(uuid) from public, anon, authenticated;
revoke all on function public.liar_get_room_snapshot(uuid) from public, anon, authenticated;
revoke all on function public.liar_start_speaking(uuid,bigint) from public, anon, authenticated;
revoke all on function public.liar_move_speaker(uuid,text,bigint) from public, anon, authenticated;
revoke all on function public.liar_finish_speaking(uuid,bigint) from public, anon, authenticated;
revoke all on function public.liar_start_vote(uuid,bigint) from public, anon, authenticated;
revoke all on function public.liar_submit_ballot(uuid,uuid[]) from public, anon, authenticated;
revoke all on function public.liar_get_my_ballot(uuid) from public, anon, authenticated;
revoke all on function public.liar_get_vote_snapshot(uuid) from public, anon, authenticated;
revoke all on function public.liar_close_vote(uuid,bigint) from public, anon, authenticated;
revoke all on function public.liar_start_runoff(uuid,bigint) from public, anon, authenticated;
revoke all on function public.liar_start_runoff_speaking(uuid,bigint) from public, anon, authenticated;
revoke all on function public.liar_reveal_liars(uuid,bigint) from public, anon, authenticated;
revoke all on function public.liar_reveal_result_liars(uuid,bigint) from public, anon, authenticated;
revoke all on function public.liar_get_guess_snapshot(uuid) from public, anon, authenticated;
revoke all on function public.liar_submit_guess(uuid,text) from public, anon, authenticated;

grant execute on function public.liar_create_room(uuid,text,text[],text,integer,integer) to authenticated;
grant execute on function public.liar_join_room(text,uuid,text) to authenticated;
grant execute on function public.liar_leave_room(uuid) to authenticated;
grant execute on function public.liar_get_my_active_rooms() to authenticated;
grant execute on function public.liar_resume_room(uuid,uuid) to authenticated;
grant execute on function public.liar_update_nickname(uuid,text) to authenticated;
grant execute on function public.liar_set_ready(uuid,boolean) to authenticated;
grant execute on function public.liar_update_game_settings(uuid,text[],text,integer,integer,boolean,bigint) to authenticated;
grant execute on function public.liar_start_round(uuid,bigint) to authenticated;
grant execute on function public.liar_restart_game(uuid,bigint) to authenticated;
grant execute on function public.liar_mark_role_checked(uuid) to authenticated;
grant execute on function public.liar_get_my_round_role(uuid) to authenticated;
grant execute on function public.liar_get_room_snapshot(uuid) to authenticated;
grant execute on function public.liar_start_speaking(uuid,bigint) to authenticated;
grant execute on function public.liar_move_speaker(uuid,text,bigint) to authenticated;
grant execute on function public.liar_finish_speaking(uuid,bigint) to authenticated;
grant execute on function public.liar_start_vote(uuid,bigint) to authenticated;
grant execute on function public.liar_submit_ballot(uuid,uuid[]) to authenticated;
grant execute on function public.liar_get_my_ballot(uuid) to authenticated;
grant execute on function public.liar_get_vote_snapshot(uuid) to authenticated;
grant execute on function public.liar_close_vote(uuid,bigint) to authenticated;
grant execute on function public.liar_start_runoff(uuid,bigint) to authenticated;
grant execute on function public.liar_start_runoff_speaking(uuid,bigint) to authenticated;
grant execute on function public.liar_reveal_liars(uuid,bigint) to authenticated;
grant execute on function public.liar_reveal_result_liars(uuid,bigint) to authenticated;
grant execute on function public.liar_get_guess_snapshot(uuid) to authenticated;
grant execute on function public.liar_submit_guess(uuid,text) to authenticated;