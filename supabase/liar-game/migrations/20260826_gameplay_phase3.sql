-- Liar Game / Drawing Spy phase 3.
-- Common pacing, fairer repeat play, delayed ballot disclosure, guess aliases,
-- and optional hidden-role teammate awareness.

alter table public.liar_games
  add column if not exists speaking_time_limit smallint not null default 30,
  add column if not exists discussion_time_limit smallint not null default 90,
  add column if not exists liars_know_each_other boolean not null default false;

alter table public.liar_rounds
  add column if not exists speaking_time_limit_snapshot smallint not null default 30,
  add column if not exists discussion_time_limit_snapshot smallint not null default 90,
  add column if not exists liars_know_each_other_snapshot boolean not null default false,
  add column if not exists speaking_turn_started_at timestamptz,
  add column if not exists discussion_started_at timestamptz;

alter table public.liar_words
  add column if not exists aliases text[] not null default array[]::text[];

alter table public.liar_games drop constraint if exists liar_games_speaking_time_limit_check;
alter table public.liar_games add constraint liar_games_speaking_time_limit_check
  check (speaking_time_limit in (0,15,30,45,60));
alter table public.liar_games drop constraint if exists liar_games_discussion_time_limit_check;
alter table public.liar_games add constraint liar_games_discussion_time_limit_check
  check (discussion_time_limit in (0,60,90,120,180));

alter table public.liar_rounds drop constraint if exists liar_rounds_speaking_time_limit_snapshot_check;
alter table public.liar_rounds add constraint liar_rounds_speaking_time_limit_snapshot_check
  check (speaking_time_limit_snapshot in (0,15,30,45,60));
alter table public.liar_rounds drop constraint if exists liar_rounds_discussion_time_limit_snapshot_check;
alter table public.liar_rounds add constraint liar_rounds_discussion_time_limit_snapshot_check
  check (discussion_time_limit_snapshot in (0,60,90,120,180));

create or replace function public.liar_normalize_guess_text(p_text text)
returns text
language sql
immutable strict
set search_path=pg_catalog,public
as $$
  select lower(regexp_replace(btrim(normalize(p_text,NFC)), '\\s+', '', 'g'));
$$;

update public.liar_words
set normalized_word=public.liar_normalize_guess_text(word);

update public.liar_words set aliases=array['피시방','피씨방']::text[] where word='PC방';
update public.liar_words set aliases=array['핸드폰','휴대폰']::text[] where word='스마트폰';
update public.liar_words set aliases=array['랩탑']::text[] where word='노트북';

create or replace function public.liar_snapshot_round_mode_settings()
returns trigger
language plpgsql
set search_path=pg_catalog,public
as $$
declare v_game public.liar_games%rowtype;
begin
  select g.* into v_game from public.liar_games g where g.id=new.game_id;
  if not found then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;
  new.game_mode_snapshot:=v_game.game_mode;
  new.drawing_time_limit_snapshot:=v_game.drawing_time_limit;
  new.drawing_stroke_limit_snapshot:=v_game.drawing_stroke_limit;
  new.drawing_stroke_unlimited_snapshot:=v_game.drawing_stroke_unlimited;
  new.speaking_time_limit_snapshot:=v_game.speaking_time_limit;
  new.discussion_time_limit_snapshot:=v_game.discussion_time_limit;
  new.liars_know_each_other_snapshot:=v_game.liars_know_each_other;
  return new;
end $$;

create or replace function public.liar_copy_game_mode_settings()
returns trigger
language plpgsql
set search_path=pg_catalog,public
as $$
declare v_prev public.liar_games%rowtype;
begin
  if new.game_no>1 and new.status='setup' then
    select g.* into v_prev
    from public.liar_games g
    where g.room_id=new.room_id and g.game_no<new.game_no
    order by g.game_no desc limit 1;
    if found then
      new.game_mode:=v_prev.game_mode;
      new.drawing_time_limit:=v_prev.drawing_time_limit;
      new.drawing_stroke_limit:=v_prev.drawing_stroke_limit;
      new.drawing_stroke_unlimited:=v_prev.drawing_stroke_unlimited;
      new.speaking_time_limit:=v_prev.speaking_time_limit;
      new.discussion_time_limit:=v_prev.discussion_time_limit;
      new.liars_know_each_other:=v_prev.liars_know_each_other;
    end if;
  end if;
  return new;
end $$;

create or replace function public.liar_stamp_phase3_round_timers()
returns trigger
language plpgsql
set search_path=pg_catalog,public
as $$
begin
  if new.status='SPEAKING' and (
    old.status is distinct from 'SPEAKING'
    or new.current_speaker_index is distinct from old.current_speaker_index
  ) then
    new.speaking_turn_started_at:=now();
  elsif new.status<>'SPEAKING' then
    new.speaking_turn_started_at:=null;
  end if;

  if new.status='DISCUSSION' and old.status is distinct from 'DISCUSSION' then
    new.discussion_started_at:=now();
  elsif new.status<>'DISCUSSION' then
    new.discussion_started_at:=null;
  end if;
  return new;
end $$;

drop trigger if exists liar_stamp_phase3_round_timers on public.liar_rounds;
create trigger liar_stamp_phase3_round_timers
before update of status,current_speaker_index on public.liar_rounds
for each row execute function public.liar_stamp_phase3_round_timers();

revoke all on function public.liar_stamp_phase3_round_timers() from public,anon,authenticated;

create or replace function public.liar_update_game_settings_v4(
  p_player_key uuid,
  p_selected_categories text[],
  p_difficulty text,
  p_liar_count integer,
  p_guess_limit integer,
  p_show_category_to_liar boolean,
  p_game_mode text,
  p_drawing_time_limit integer,
  p_drawing_stroke_limit integer,
  p_drawing_stroke_unlimited boolean,
  p_speaking_time_limit integer,
  p_discussion_time_limit integer,
  p_liars_know_each_other boolean,
  p_expected_room_version bigint
)
returns bigint language plpgsql security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_game public.liar_games%rowtype;
  v_categories text[];
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  if p_show_category_to_liar is null
     or p_game_mode not in ('classic','drawing_spy')
     or p_drawing_time_limit not between 5 and 60
     or p_drawing_stroke_limit not between 1 and 10
     or p_drawing_stroke_unlimited is null
     or p_speaking_time_limit not in (0,15,30,45,60)
     or p_discussion_time_limit not in (0,60,90,120,180)
     or p_liars_know_each_other is null then
    raise exception using message='INVALID_GAME_SETTINGS',errcode='P0001';
  end if;

  v_categories:=public.liar_validate_settings(p_selected_categories,p_difficulty,p_liar_count,p_guess_limit);

  select p.* into v_player from public.liar_players p
  where p.auth_user_id=v_auth and p.player_key=p_player_key and p.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select r.* into v_room from public.liar_rooms r where r.id=v_player.room_id for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
  if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
  if p_expected_room_version is null or v_room.version<>p_expected_room_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;

  select g.* into v_game from public.liar_games g
  where g.id=v_room.current_game_id and g.room_id=v_room.id for update;
  if not found or v_game.status<>'setup' or v_game.started_at is not null then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;

  update public.liar_games g
  set selected_categories=v_categories,
      difficulty=p_difficulty,
      liar_count=p_liar_count,
      guess_limit=p_guess_limit,
      show_category_to_liar=p_show_category_to_liar,
      game_mode=p_game_mode,
      drawing_time_limit=p_drawing_time_limit,
      drawing_stroke_limit=p_drawing_stroke_limit,
      drawing_stroke_unlimited=p_drawing_stroke_unlimited,
      speaking_time_limit=p_speaking_time_limit,
      discussion_time_limit=p_discussion_time_limit,
      liars_know_each_other=p_liars_know_each_other
  where g.id=v_game.id;

  update public.liar_rooms r
  set last_activity_at=now(),expires_at=now()+interval '24 hours',version=r.version+1
  where r.id=v_room.id returning r.version into v_room.version;
  return v_room.version;
end $$;

-- Avoid word repetition throughout one Game until the eligible pool is exhausted,
-- and bias hidden-role assignment toward people with fewer prior hidden-role rounds.
create or replace function public.liar_start_round(p_player_key uuid,p_expected_room_version bigint)
returns table(round_id uuid,round_no integer,room_version bigint,round_version bigint)
language plpgsql security definer
set search_path=pg_catalog,public
as $$
declare
 v_auth uuid:=auth.uid();v_player public.liar_players%rowtype;v_room public.liar_rooms%rowtype;v_game public.liar_games%rowtype;
 v_count integer;v_round_no integer;v_round uuid;v_word public.liar_words%rowtype;v_candidates integer;v_unused integer;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select lp.* into v_player from public.liar_players lp where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active';
 if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select rm.* into v_room from public.liar_rooms rm where rm.id=v_player.room_id for update;
 if v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
 if p_expected_room_version is null or v_room.version<>p_expected_room_version then raise exception using message='STALE_VERSION',errcode='P0001'; end if;
 if v_room.current_round_id is not null then raise exception using message='INVALID_ROOM_STATE',errcode='P0001'; end if;
 select g.* into v_game from public.liar_games g where g.id=v_room.current_game_id and g.room_id=v_room.id for update;
 if not found or v_game.status not in ('setup','active') then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;
 select count(*) into v_count from public.liar_players lp where lp.room_id=v_room.id and lp.membership_status='active' and lp.ready;
 if v_count<4 then raise exception using message='NOT_ENOUGH_READY_PLAYERS',errcode='P0001'; end if;
 if v_count>12 then raise exception using message='TOO_MANY_READY_PLAYERS',errcode='P0001'; end if;
 if v_count-v_game.liar_count<2 then raise exception using message='INVALID_LIAR_COUNT',errcode='P0001'; end if;

 select coalesce(max(r.round_no),0)+1 into v_round_no from public.liar_rounds r where r.game_id=v_game.id;
 select count(*) into v_candidates from public.liar_words w
 where w.enabled and w.category=any(v_game.selected_categories) and (v_game.difficulty='all' or w.difficulty=v_game.difficulty);
 if v_candidates=0 then raise exception using message='WORD_POOL_EMPTY',errcode='P0001'; end if;

 select count(*) into v_unused from public.liar_words w
 where w.enabled and w.category=any(v_game.selected_categories) and (v_game.difficulty='all' or w.difficulty=v_game.difficulty)
   and not exists(select 1 from public.liar_rounds r where r.game_id=v_game.id and r.word_id=w.id);

 if v_unused>0 then
  select * into v_word from public.liar_words w
  where w.enabled and w.category=any(v_game.selected_categories) and (v_game.difficulty='all' or w.difficulty=v_game.difficulty)
    and not exists(select 1 from public.liar_rounds r where r.game_id=v_game.id and r.word_id=w.id)
  order by random() limit 1;
 else
  select * into v_word from public.liar_words w
  where w.enabled and w.category=any(v_game.selected_categories) and (v_game.difficulty='all' or w.difficulty=v_game.difficulty)
  order by random() limit 1;
 end if;

 insert into public.liar_rounds(game_id,room_id,round_no,status,word_id,category_snapshot,word_snapshot,current_speaker_index)
 values(v_game.id,v_room.id,v_round_no,'ROLE_REVEAL',v_word.id,v_word.category,v_word.word,null)
 returning liar_rounds.id into v_round;

 with shuffled as (
   select p.id,p.nickname,(row_number() over(order by random())-1)::smallint as turn_order
   from public.liar_players p
   where p.room_id=v_room.id and p.membership_status='active' and p.ready
 ), history as (
   select rp.player_id,count(*) filter(where rp.role='liar')::integer as liar_rounds
   from public.liar_round_players rp
   join public.liar_rounds r on r.id=rp.round_id
   where r.game_id=v_game.id
   group by rp.player_id
 ), assigned as (
   select s.*,row_number() over(
     order by coalesce(h.liar_rounds,0)::numeric + random()*1.25,random()
   ) as liar_order
   from shuffled s left join history h on h.player_id=s.id
 )
 insert into public.liar_round_players(round_id,player_id,nickname_snapshot,role,turn_order)
 select v_round,a.id,a.nickname,case when a.liar_order<=v_game.liar_count then 'liar' else 'citizen' end,a.turn_order
 from assigned a;

 update public.liar_players lp set ready=false where lp.room_id=v_room.id and lp.membership_status='active';
 update public.liar_games g set status='active',started_at=coalesce(g.started_at,now()) where g.id=v_game.id;
 update public.liar_rooms rm set current_round_id=v_round,last_activity_at=now(),expires_at=now()+interval '24 hours',version=rm.version+1
 where rm.id=v_room.id returning rm.version into v_room.version;
 return query select v_round,v_round_no,v_room.version,r.version from public.liar_rounds r where r.id=v_round;
end $$;

create or replace function public.liar_submit_guess(p_player_key uuid,p_guess_text text)
returns table(attempt_no integer,is_correct boolean,round_status text,round_version bigint,room_version bigint)
language plpgsql security definer
set search_path=pg_catalog,public
as $$
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
 if v_room.current_game_id is distinct from v_round.game_id then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;
 select gm.* into v_game from public.liar_games gm where gm.id=v_round.game_id and gm.id=v_room.current_game_id and gm.room_id=v_room.id;
 if not found or v_game.status<>'active' or v_game.guess_limit not between 1 and 3 then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;
 select rp.* into v_guesser from public.liar_round_players rp where rp.round_id=v_round.id and rp.player_id=v_player.id and rp.role='liar';
 if not found then raise exception using message='NOT_LIAR',errcode='P0001'; end if;
 select w.* into v_word from public.liar_words w where w.id=v_round.word_id;
 select coalesce(max(lg.attempt_no),0)+1 into v_attempt from public.liar_guesses lg where lg.round_id=v_round.id;
 if v_attempt>v_game.guess_limit then raise exception using message='GUESS_LIMIT_REACHED',errcode='P0001'; end if;

 v_correct:=v_normalized_guess=public.liar_normalize_guess_text(v_round.word_snapshot)
   or exists(
     select 1 from unnest(coalesce(v_word.aliases,array[]::text[])) a(alias)
     where v_normalized_guess=public.liar_normalize_guess_text(a.alias)
   );

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
end $$;

-- Return optional teammate names only to a hidden-role participant when the
-- round snapshot explicitly allows teammates to know one another.
drop function if exists public.liar_get_my_round_role(uuid);
create function public.liar_get_my_round_role(p_player_key uuid)
returns table(role text,category text,word text,teammates jsonb)
language plpgsql stable security definer
set search_path=pg_catalog,public
as $$
declare v_auth uuid:=auth.uid();v_player public.liar_players%rowtype;v_room public.liar_rooms%rowtype;
begin
 if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
 if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select lp.* into v_player from public.liar_players lp
 where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active';
 if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
 select rm.* into v_room from public.liar_rooms rm where rm.id=v_player.room_id;
 if not found or v_room.status='expired' or now()>=v_room.expires_at then raise exception using message='ROOM_EXPIRED',errcode='P0001'; end if;
 return query
 select rp.role,
   case when rp.role='citizen' or g.show_category_to_liar then r.category_snapshot else null end,
   case when rp.role='citizen' then r.word_snapshot else null end,
   case when rp.role='liar' and r.liars_know_each_other_snapshot then coalesce((
     select jsonb_agg(other.nickname_snapshot order by other.turn_order)
     from public.liar_round_players other
     where other.round_id=r.id and other.role='liar' and other.id<>rp.id
   ),'[]'::jsonb) else '[]'::jsonb end
 from public.liar_round_players rp
 join public.liar_rounds r on r.id=rp.round_id
 join public.liar_games g on g.id=r.game_id
 where rp.round_id=v_room.current_round_id and rp.player_id=v_player.id;
 if not found then raise exception using message='NOT_ROUND_PARTICIPANT',errcode='P0001'; end if;
end $$;

-- Layer phase-three public timing/settings fields over the existing authoritative
-- snapshot without duplicating the Drawing Spy snapshot implementation.
do $$
begin
 if to_regprocedure('public.liar_get_room_snapshot_phase3_base(uuid)') is null then
   alter function public.liar_get_room_snapshot(uuid) rename to liar_get_room_snapshot_phase3_base;
 end if;
end $$;

create or replace function public.liar_get_room_snapshot(p_player_key uuid)
returns jsonb
language plpgsql stable security definer
set search_path=pg_catalog,public
as $$
declare
 v_base jsonb;v_game_id uuid;v_round_id uuid;v_game public.liar_games%rowtype;v_round public.liar_rounds%rowtype;
begin
 v_base:=public.liar_get_room_snapshot_phase3_base(p_player_key);
 v_game_id:=nullif(v_base#>>'{game,id}','')::uuid;
 v_round_id:=nullif(v_base#>>'{round,id}','')::uuid;
 if v_game_id is not null then
  select g.* into v_game from public.liar_games g where g.id=v_game_id;
  v_base:=jsonb_set(v_base,'{game}',coalesce(v_base->'game','{}'::jsonb)||jsonb_build_object(
    'speaking_time_limit',v_game.speaking_time_limit,
    'discussion_time_limit',v_game.discussion_time_limit,
    'liars_know_each_other',v_game.liars_know_each_other
  ),true);
 end if;
 if v_round_id is not null then
  select r.* into v_round from public.liar_rounds r where r.id=v_round_id;
  v_base:=jsonb_set(v_base,'{round}',coalesce(v_base->'round','{}'::jsonb)||jsonb_build_object(
    'speaking_time_limit_snapshot',v_round.speaking_time_limit_snapshot,
    'discussion_time_limit_snapshot',v_round.discussion_time_limit_snapshot,
    'liars_know_each_other_snapshot',v_round.liars_know_each_other_snapshot,
    'speaking_turn_started_at',v_round.speaking_turn_started_at,
    'discussion_started_at',v_round.discussion_started_at,
    'server_now',now()
  ),true);
 end if;
 return v_base;
end $$;

-- The live vote snapshot intentionally withholds individual voter->target data.
-- Detailed ballots remain available from liar_get_round_result after the round.
do $$
begin
 if to_regprocedure('public.liar_get_vote_snapshot_phase3_base(uuid)') is null then
   alter function public.liar_get_vote_snapshot(uuid) rename to liar_get_vote_snapshot_phase3_base;
 end if;
end $$;

create or replace function public.liar_get_vote_snapshot(p_player_key uuid)
returns jsonb
language plpgsql stable security definer
set search_path=pg_catalog,public
as $$
declare v_base jsonb;
begin
 v_base:=public.liar_get_vote_snapshot_phase3_base(p_player_key);
 return jsonb_set(v_base,'{ballot_details}','null'::jsonb,true);
end $$;

revoke all on function public.liar_update_game_settings_v4(uuid,text[],text,integer,integer,boolean,text,integer,integer,boolean,integer,integer,boolean,bigint) from public,anon,authenticated;
grant execute on function public.liar_update_game_settings_v4(uuid,text[],text,integer,integer,boolean,text,integer,integer,boolean,integer,integer,boolean,bigint) to authenticated;

revoke all on function public.liar_get_my_round_role(uuid) from public,anon,authenticated;
grant execute on function public.liar_get_my_round_role(uuid) to authenticated;

revoke all on function public.liar_get_room_snapshot_phase3_base(uuid) from public,anon,authenticated;
revoke all on function public.liar_get_room_snapshot(uuid) from public,anon,authenticated;
grant execute on function public.liar_get_room_snapshot(uuid) to authenticated;

revoke all on function public.liar_get_vote_snapshot_phase3_base(uuid) from public,anon,authenticated;
revoke all on function public.liar_get_vote_snapshot(uuid) from public,anon,authenticated;
grant execute on function public.liar_get_vote_snapshot(uuid) to authenticated;
