-- Phase 3 polish.
-- Discussion chat becomes read-only as soon as the configured discussion timer expires.
-- Unlimited discussion (limit = 0) keeps chat available until the host starts voting.

create or replace function public.liar_can_send_discussion_chat_topic(p_topic text)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.liar_players as lp
      join public.liar_rooms as lr on lr.id = lp.room_id
      join public.liar_rounds as rd on rd.id = lr.current_round_id and rd.room_id = lr.id
      join public.liar_round_players as rp on rp.round_id = rd.id and rp.player_id = lp.id
      where lp.auth_user_id = auth.uid()
        and lp.membership_status = 'active'
        and lr.status = 'active'
        and pg_catalog.now() < lr.expires_at
        and rd.status = 'DISCUSSION'
        and (
          coalesce(rd.discussion_time_limit_snapshot,0) = 0
          or (
            rd.discussion_started_at is not null
            and pg_catalog.now() < rd.discussion_started_at + pg_catalog.make_interval(secs => rd.discussion_time_limit_snapshot)
          )
        )
        and p_topic = 'liar-chat:' || lp.room_id::text
    );
$$;

revoke all on function public.liar_can_send_discussion_chat_topic(text)
from public, anon, authenticated;
grant execute on function public.liar_can_send_discussion_chat_topic(text)
to authenticated;
