-- Liar Game v1.2: synchronize post-capture guessing and record zero-stroke timeouts.

alter table public.liar_rounds
  add column if not exists guess_unlocked_at timestamptz;

create table if not exists public.liar_drawing_misses (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.liar_games(id) on delete cascade,
  round_id uuid not null references public.liar_rounds(id) on delete cascade,
  drawing_stage_no smallint not null default 0,
  round_player_id uuid not null references public.liar_round_players(id) on delete cascade,
  player_id uuid not null references public.liar_players(id) on delete cascade,
  turn_index smallint not null,
  reason text not null default 'timeout_zero_stroke' check (reason in ('timeout_zero_stroke')),
  created_at timestamptz not null default now(),
  unique (round_id,drawing_stage_no,round_player_id,turn_index,reason)
);

create index if not exists liar_drawing_misses_game_player_idx
  on public.liar_drawing_misses(game_id,player_id);

alter table public.liar_drawing_misses enable row level security;
revoke all on public.liar_drawing_misses from public, anon, authenticated;

create or replace function public.liar_reveal_liars(p_player_key uuid,p_expected_round_version bigint)
returns table(round_version bigint,room_version bigint)
language plpgsql
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype; v_round_version bigint; v_room_version bigint;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select lp.* into v_player from public.liar_players lp where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active' for update;
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  select rm.* into v_room from public.liar_rooms rm where rm.id=v_player.room_id for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
  select rd.* into v_round from public.liar_rounds rd where rd.id=v_room.current_round_id for update;
  if not found or v_round.status<>'LIAR_REVEAL' or v_round.capture_succeeded is not true or v_round.winner is not null then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
  if p_expected_round_version is null or v_round.version<>p_expected_round_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;
  update public.liar_rounds rd
  set status='LIAR_GUESS',
      liars_revealed_at=coalesce(rd.liars_revealed_at,now()),
      guess_unlocked_at=coalesce(rd.guess_unlocked_at,now()+interval '8 seconds'),
      version=rd.version+1
  where rd.id=v_round.id
  returning rd.version into v_round_version;
  update public.liar_rooms rm set last_activity_at=now(),expires_at=now()+interval '24 hours',version=rm.version+1 where rm.id=v_room.id returning rm.version into v_room_version;
  return query select v_round_version,v_room_version;
end;
$function$;

revoke all on function public.liar_reveal_liars(uuid,bigint) from public, anon;
grant execute on function public.liar_reveal_liars(uuid,bigint) to authenticated;

create or replace function public.liar_get_guess_snapshot(p_player_key uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
 v_auth uuid:=auth.uid(); v_player public.liar_players%rowtype; v_room public.liar_rooms%rowtype;
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
 v_can_submit:=v_round.status='LIAR_GUESS'
   and now()>=coalesce(v_round.guess_unlocked_at,now())
   and v_used<v_game.guess_limit
   and exists(select 1 from public.liar_round_players rp where rp.round_id=v_round.id and rp.player_id=v_player.id and rp.role='liar');
 select coalesce(jsonb_agg(jsonb_build_object('attempt_no',q.attempt_no,'guess_text',q.guess_text,'guesser',q.nickname_snapshot,'is_correct',q.is_correct) order by q.attempt_no),'[]'::jsonb)
 into v_guesses from (select lg.attempt_no,lg.guess_text,lg.is_correct,rp.nickname_snapshot from public.liar_guesses lg
  join public.liar_round_players rp on rp.id=lg.guesser_round_player_id and rp.round_id=v_round.id where lg.round_id=v_round.id) q;
 return jsonb_build_object(
   'guess_limit',v_game.guess_limit,
   'used_attempts',v_used,
   'remaining_attempts',greatest(v_game.guess_limit-v_used,0),
   'can_submit',v_can_submit,
   'guess_unlocked_at',v_round.guess_unlocked_at,
   'server_now',now(),
   'guesses',v_guesses
 );
end;
$function$;

revoke all on function public.liar_get_guess_snapshot(uuid) from public, anon;
grant execute on function public.liar_get_guess_snapshot(uuid) to authenticated;

create or replace function public.liar_submit_guess(p_player_key uuid,p_guess_text text)
returns table(attempt_no integer,is_correct boolean,round_status text,round_version bigint,room_version bigint)
language plpgsql
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
 v_auth uuid:=auth.uid();v_player public.liar_players%rowtype;v_room public.liar_rooms%rowtype;
 v_round public.liar_rounds%rowtype;v_game public.liar_games%rowtype;v_guesser public.liar_round_players%rowtype;v_word public.liar_words%rowtype;
 v_guess_text text;v_normalized_guess text;v_attempt integer;v_correct boolean;v_status text;
 v_round_version bigint;v_room_version bigint;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 if p_guess_text is null or char_length(btrim(p_guess_text)) not between 1 and 100 then raise exception using message='INVALID_GUESS_TEXT',errcode='P0001'; end if;
 v_guess_text:=btrim(p_guess_text);v_normalized_guess:=public.liar_normalize_guess_text(p_guess_text);
 if char_length(v_normalized_guess) not between 1 and 100 then raise exception using message='INVALID_GUESS_TEXT',errcode='P0001'; end if;
 select lp.* into v_player from public.liar_players lp where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active';
 if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select rm.* into v_room from public.liar_rooms rm where rm.id=v_player.room_id for update;
 if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 if v_room.current_round_id is null then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
 select rd.* into v_round from public.liar_rounds rd where rd.id=v_room.current_round_id for update;
 if not found or v_round.status<>'LIAR_GUESS' or v_round.capture_succeeded is distinct from true or v_round.winner is not null
    or v_round.finished_at is not null or v_round.liars_revealed_at is null then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
 if v_round.guess_unlocked_at is not null and now()<v_round.guess_unlocked_at then raise exception using message='GUESS_NOT_UNLOCKED',errcode='P0001'; end if;
 if v_room.current_game_id is distinct from v_round.game_id then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;
 select gm.* into v_game from public.liar_games gm where gm.id=v_round.game_id and gm.id=v_room.current_game_id and gm.room_id=v_room.id;
 if not found or v_game.status<>'active' or v_game.guess_limit not between 1 and 3 then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;
 select rp.* into v_guesser from public.liar_round_players rp where rp.round_id=v_round.id and rp.player_id=v_player.id and rp.role='liar';
 if not found then raise exception using message='NOT_LIAR',errcode='P0001'; end if;
 select w.* into v_word from public.liar_words w where w.id=v_round.word_id;
 select coalesce(max(lg.attempt_no),0)+1 into v_attempt from public.liar_guesses lg where lg.round_id=v_round.id;
 if v_attempt>v_game.guess_limit then raise exception using message='GUESS_LIMIT_REACHED',errcode='P0001'; end if;
 v_correct:=v_normalized_guess=public.liar_normalize_guess_text(v_round.word_snapshot)
   or exists(select 1 from unnest(coalesce(v_word.aliases,array[]::text[])) a(alias) where v_normalized_guess=public.liar_normalize_guess_text(a.alias));
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
end;
$function$;

revoke all on function public.liar_submit_guess(uuid,text) from public, anon;
grant execute on function public.liar_submit_guess(uuid,text) to authenticated;

create or replace function public.liar_advance_drawing_turn(p_player_key uuid,p_expected_round_version bigint)
returns table(round_version bigint,room_version bigint,drawing_finished boolean)
language plpgsql
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
 v_auth uuid:=auth.uid();v_player public.liar_players%rowtype;v_room public.liar_rooms%rowtype;v_round public.liar_rounds%rowtype;v_round_player public.liar_round_players%rowtype;v_stage public.liar_vote_stages%rowtype;v_is_runoff boolean:=false;v_player_count integer;v_finished boolean:=false;v_next_status text;
 v_drawing_stage_no integer:=0;v_time_limit integer;v_stroke_count integer:=0;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select p.* into v_player from public.liar_players p where p.auth_user_id=v_auth and p.player_key=p_player_key and p.membership_status='active';if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select r.* into v_room from public.liar_rooms r where r.id=v_player.room_id for update;if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 select r.* into v_round from public.liar_rounds r where r.id=v_room.current_round_id for update;if not found or v_round.status<>'DRAWING' or v_round.game_mode_snapshot<>'drawing_spy' then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;
 if p_expected_round_version is null or v_round.version<>p_expected_round_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;
 if v_round.current_vote_stage>0 then
  select vs.* into v_stage from public.liar_vote_stages vs where vs.round_id=v_round.id and vs.stage_no=v_round.current_vote_stage and vs.kind='runoff' and vs.status='open';if not found then raise exception using message='INVALID_RUNOFF_STATE',errcode='P0001'; end if;v_is_runoff:=true;v_drawing_stage_no:=v_round.current_vote_stage;v_time_limit:=10;
  select rp.* into v_round_player from public.liar_round_players rp where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids) order by rp.turn_order offset v_round.current_speaker_index limit 1;
  select count(*) into v_player_count from public.liar_round_players rp where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids);
 else
  v_drawing_stage_no:=0;v_time_limit:=v_round.drawing_time_limit_snapshot;
  select rp.* into v_round_player from public.liar_round_players rp where rp.round_id=v_round.id order by rp.turn_order offset v_round.current_speaker_index limit 1;
  select count(*) into v_player_count from public.liar_round_players rp where rp.round_id=v_round.id;
 end if;
 if v_round_player.id is null or v_player_count<1 then raise exception using message='INVALID_DRAWING_STATE',errcode='P0001'; end if;
 if v_player.id<>v_room.host_player_id and v_round_player.player_id is distinct from v_player.id then raise exception using message='NOT_CURRENT_DRAWER',errcode='P0001'; end if;
 select count(*) into v_stroke_count from public.liar_drawing_strokes s where s.round_id=v_round.id and s.drawing_stage_no=v_drawing_stage_no and s.round_player_id=v_round_player.id;
 if v_round.drawing_turn_started_at is not null
    and now()>=v_round.drawing_turn_started_at+make_interval(secs=>greatest(v_time_limit,1))
    and v_stroke_count=0 then
   insert into public.liar_drawing_misses(game_id,round_id,drawing_stage_no,round_player_id,player_id,turn_index,reason)
   values(v_round.game_id,v_round.id,v_drawing_stage_no,v_round_player.id,v_round_player.player_id,v_round.current_speaker_index,'timeout_zero_stroke')
   on conflict (round_id,drawing_stage_no,round_player_id,turn_index,reason) do nothing;
 end if;
 if v_round.current_speaker_index>=v_player_count-1 then
  v_finished:=true;v_next_status:=case when v_is_runoff then 'RUNOFF_VOTING' else 'DISCUSSION' end;
  update public.liar_rounds r set status=v_next_status,current_speaker_index=null,drawing_turn_started_at=null,version=r.version+1 where r.id=v_round.id returning r.version into v_round.version;
 else
  update public.liar_rounds r set current_speaker_index=r.current_speaker_index+1,drawing_turn_started_at=now()+interval '3 seconds',version=r.version+1 where r.id=v_round.id returning r.version into v_round.version;
 end if;
 update public.liar_rooms r set last_activity_at=now(),expires_at=now()+interval '24 hours',version=r.version+1 where r.id=v_room.id returning r.version into v_room.version;
 return query select v_round.version,v_room.version,v_finished;
end;
$function$;

revoke all on function public.liar_advance_drawing_turn(uuid,bigint) from public, anon;
grant execute on function public.liar_advance_drawing_turn(uuid,bigint) to authenticated;
