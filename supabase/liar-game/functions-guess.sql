-- Liar Game guess phase RPCs. Run after schema.sql and functions-core.sql.
-- The answer is evaluated only inside SECURITY DEFINER code and is never projected.

create or replace function public.liar_normalize_guess_text(p_text text)
returns text language sql immutable strict
set search_path = pg_catalog, public
as $$ select regexp_replace(btrim(normalize(p_text, NFC)), '\s+', '', 'g'); $$;

revoke all on function public.liar_normalize_guess_text(text) from public, anon, authenticated;

create or replace function public.liar_submit_guess(p_player_key uuid, p_guess_text text)
returns table(attempt_no integer, is_correct boolean, round_status text, round_version bigint, room_version bigint)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare
 v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype;
 v_round public.liar_rounds%rowtype; v_game public.liar_games%rowtype; v_guesser public.liar_round_players%rowtype;
 v_guess_text text; v_normalized_guess text; v_attempt integer; v_correct boolean; v_status text;
 v_round_version bigint; v_room_version bigint;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 if p_guess_text is null or char_length(btrim(p_guess_text)) not between 1 and 100 then raise exception using message='INVALID_GUESS_TEXT',errcode='P0001'; end if;
 v_guess_text:=btrim(p_guess_text); v_normalized_guess:=public.liar_normalize_guess_text(p_guess_text);
 if char_length(v_normalized_guess) not between 1 and 100 then raise exception using message='INVALID_GUESS_TEXT',errcode='P0001'; end if;
 select lp.* into v_player from public.liar_players lp where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active';
 if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select rm.* into v_room from public.liar_rooms rm where rm.id=v_player.room_id for update;
 if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 if v_room.current_round_id is null then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
 -- This lock serializes the shared attempt sequence across every liar client.
 select rd.* into v_round from public.liar_rounds rd where rd.id=v_room.current_round_id for update;
 if not found or v_round.status<>'LIAR_GUESS' or v_round.capture_succeeded is distinct from true or v_round.winner is not null
    or v_round.finished_at is not null or v_round.liars_revealed_at is null then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
 if v_room.current_game_id is distinct from v_round.game_id then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;
 select gm.* into v_game from public.liar_games gm where gm.id=v_round.game_id and gm.id=v_room.current_game_id and gm.room_id=v_room.id;
 if not found or v_game.status<>'active' or v_game.guess_limit not between 1 and 3 then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;
 select rp.* into v_guesser from public.liar_round_players rp where rp.round_id=v_round.id and rp.player_id=v_player.id and rp.role='liar';
 if not found then raise exception using message='NOT_LIAR',errcode='P0001'; end if;
 select coalesce(max(lg.attempt_no),0)+1 into v_attempt from public.liar_guesses lg where lg.round_id=v_round.id;
 if v_attempt>v_game.guess_limit then raise exception using message='GUESS_LIMIT_REACHED',errcode='P0001'; end if;
 v_correct:=v_normalized_guess=public.liar_normalize_guess_text(v_round.word_snapshot);
 insert into public.liar_guesses(round_id,guesser_round_player_id,attempt_no,guess_text,normalized_guess,is_correct)
 values(v_round.id,v_guesser.id,v_attempt,v_guess_text,v_normalized_guess,v_correct);
 v_status:=case when v_correct or v_attempt=v_game.guess_limit then 'ROUND_RESULT' else 'LIAR_GUESS' end;
 update public.liar_rounds rd set status=v_status,
  winner=case when v_correct then 'liar' when v_attempt=v_game.guess_limit then 'citizen' else null end,
  finished_at=case when v_correct or v_attempt=v_game.guess_limit then now() else null end,version=rd.version+1
 where rd.id=v_round.id returning rd.version into v_round_version;
 update public.liar_rooms rm set last_activity_at=now(),expires_at=now()+interval '24 hours',version=rm.version+1
 where rm.id=v_room.id returning rm.version into v_room_version;
 return query select v_attempt,v_correct,v_status,v_round_version,v_room_version;
end; $$;

create or replace function public.liar_get_guess_snapshot(p_player_key uuid)
returns jsonb language plpgsql security definer stable set search_path = pg_catalog, public
as $$
declare v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype;
 v_round public.liar_rounds%rowtype; v_game public.liar_games%rowtype; v_used integer; v_can_submit boolean; v_guesses jsonb;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select lp.* into v_player from public.liar_players lp where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active';
 if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select rm.* into v_room from public.liar_rooms rm where rm.id=v_player.room_id;
 if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 select rd.* into v_round from public.liar_rounds rd where rd.id=v_room.current_round_id;
 if not found or not (v_round.status='LIAR_GUESS' or (v_round.status='ROUND_RESULT' and v_round.capture_succeeded=true and v_round.liars_revealed_at is not null)) then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
 if v_room.current_game_id is distinct from v_round.game_id then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;
 select gm.* into v_game from public.liar_games gm where gm.id=v_round.game_id and gm.room_id=v_room.id and gm.status='active';
 if not found or v_game.guess_limit not between 1 and 3 then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;
 select count(*)::integer into v_used from public.liar_guesses lg where lg.round_id=v_round.id;
 v_can_submit:=v_round.status='LIAR_GUESS' and v_used<v_game.guess_limit and exists(select 1 from public.liar_round_players rp where rp.round_id=v_round.id and rp.player_id=v_player.id and rp.role='liar');
 select coalesce(jsonb_agg(jsonb_build_object('attempt_no',q.attempt_no,'guess_text',q.guess_text,'guesser',q.nickname_snapshot,'is_correct',q.is_correct) order by q.attempt_no),'[]'::jsonb)
 into v_guesses from (select lg.attempt_no,lg.guess_text,lg.is_correct,rp.nickname_snapshot from public.liar_guesses lg
  join public.liar_round_players rp on rp.id=lg.guesser_round_player_id and rp.round_id=v_round.id where lg.round_id=v_round.id) q;
 return jsonb_build_object('guess_limit',v_game.guess_limit,'used_attempts',v_used,'remaining_attempts',greatest(v_game.guess_limit-v_used,0),'can_submit',v_can_submit,'guesses',v_guesses);
end; $$;
