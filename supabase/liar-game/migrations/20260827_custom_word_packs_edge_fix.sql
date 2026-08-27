-- Liar Game v1.1 custom-word-pack hardening.
-- 1) Save v5 settings atomically with exactly one room version increment.
-- 2) Treat equal normalized words across builtin/custom sources as the same
--    Game-level word for no-repeat selection until the combined pool is exhausted.

create or replace function public.liar_update_game_settings_v5(
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
  p_word_source_mode text,
  p_custom_word_pack_id uuid,
  p_expected_room_version bigint
)
returns bigint
language plpgsql
security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_game public.liar_games%rowtype;
  v_pack public.liar_custom_word_packs%rowtype;
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
     or p_liars_know_each_other is null
     or p_word_source_mode not in ('builtin','custom','mixed') then
    raise exception using message='INVALID_GAME_SETTINGS',errcode='P0001';
  end if;

  v_categories:=public.liar_validate_settings(
    p_selected_categories,p_difficulty,p_liar_count,p_guess_limit
  );

  select p.* into v_player
  from public.liar_players p
  where p.auth_user_id=v_auth
    and p.player_key=p_player_key
    and p.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select r.* into v_room
  from public.liar_rooms r
  where r.id=v_player.room_id
  for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED',errcode='P0001';
  end if;
  if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
  if p_expected_room_version is null or v_room.version<>p_expected_room_version then
    raise exception using message='STALE_VERSION',errcode='P0001';
  end if;

  select g.* into v_game
  from public.liar_games g
  where g.id=v_room.current_game_id and g.room_id=v_room.id
  for update;
  if not found or v_game.status<>'setup' or v_game.started_at is not null then
    raise exception using message='INVALID_GAME_STATE',errcode='P0001';
  end if;

  if p_word_source_mode in ('custom','mixed') then
    if p_custom_word_pack_id is null then
      raise exception using message='CUSTOM_WORD_PACK_REQUIRED',errcode='P0001';
    end if;
    select p.* into v_pack
    from public.liar_custom_word_packs p
    where p.id=p_custom_word_pack_id and p.owner_auth_user_id=v_auth;
    if not found then raise exception using message='CUSTOM_WORD_PACK_NOT_FOUND',errcode='P0001'; end if;
  end if;

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
      liars_know_each_other=p_liars_know_each_other,
      word_source_mode=p_word_source_mode,
      custom_word_pack_id=case when p_word_source_mode='builtin' then null else v_pack.id end,
      custom_word_pack_name_snapshot=case when p_word_source_mode='builtin' then null else v_pack.name end,
      custom_words_snapshot=case when p_word_source_mode='builtin' then null else v_pack.words end,
      custom_normalized_words_snapshot=case when p_word_source_mode='builtin' then null else v_pack.normalized_words end
  where g.id=v_game.id;

  update public.liar_rooms r
  set last_activity_at=now(),
      expires_at=now()+interval '24 hours',
      version=r.version+1
  where r.id=v_room.id
  returning r.version into v_room.version;

  return v_room.version;
end $$;

create or replace function public.liar_start_round(
  p_player_key uuid,
  p_expected_room_version bigint
)
returns table(round_id uuid,round_no integer,room_version bigint,round_version bigint)
language plpgsql
security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_game public.liar_games%rowtype;
  v_count integer;
  v_round_no integer;
  v_round uuid;
  v_word public.liar_words%rowtype;
  v_builtin_candidates integer:=0;
  v_builtin_unused integer:=0;
  v_custom_candidates integer:=0;
  v_custom_unused integer:=0;
  v_use_custom boolean:=false;
  v_custom_index integer;
  v_custom_word text;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select lp.* into v_player
  from public.liar_players lp
  where lp.auth_user_id=v_auth
    and lp.player_key=p_player_key
    and lp.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select rm.* into v_room
  from public.liar_rooms rm
  where rm.id=v_player.room_id
  for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED',errcode='P0001';
  end if;
  if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
  if p_expected_room_version is null or v_room.version<>p_expected_room_version then
    raise exception using message='STALE_VERSION',errcode='P0001';
  end if;
  if v_room.current_round_id is not null then raise exception using message='INVALID_ROOM_STATE',errcode='P0001'; end if;

  select g.* into v_game
  from public.liar_games g
  where g.id=v_room.current_game_id and g.room_id=v_room.id
  for update;
  if not found or v_game.status not in ('setup','active') then
    raise exception using message='INVALID_GAME_STATE',errcode='P0001';
  end if;

  select count(*) into v_count
  from public.liar_players lp
  where lp.room_id=v_room.id and lp.membership_status='active' and lp.ready;
  if v_count<4 then raise exception using message='NOT_ENOUGH_READY_PLAYERS',errcode='P0001'; end if;
  if v_count>12 then raise exception using message='TOO_MANY_READY_PLAYERS',errcode='P0001'; end if;
  if v_count-v_game.liar_count<2 then raise exception using message='INVALID_LIAR_COUNT',errcode='P0001'; end if;

  select coalesce(max(r.round_no),0)+1 into v_round_no
  from public.liar_rounds r
  where r.game_id=v_game.id;

  if v_game.word_source_mode in ('builtin','mixed') then
    select count(*) into v_builtin_candidates
    from public.liar_words w
    where w.enabled
      and w.category=any(v_game.selected_categories)
      and (v_game.difficulty='all' or w.difficulty=v_game.difficulty);

    select count(*) into v_builtin_unused
    from public.liar_words w
    where w.enabled
      and w.category=any(v_game.selected_categories)
      and (v_game.difficulty='all' or w.difficulty=v_game.difficulty)
      and not exists(
        select 1
        from public.liar_rounds r
        where r.game_id=v_game.id
          and public.liar_normalize_guess_text(r.word_snapshot)=public.liar_normalize_guess_text(w.word)
      );
  end if;

  if v_game.word_source_mode in ('custom','mixed') then
    v_custom_candidates:=coalesce(cardinality(v_game.custom_words_snapshot),0);
    if v_custom_candidates>0 then
      select count(*) into v_custom_unused
      from generate_series(1,v_custom_candidates) idx
      where not exists(
        select 1
        from public.liar_rounds r
        where r.game_id=v_game.id
          and public.liar_normalize_guess_text(r.word_snapshot)=v_game.custom_normalized_words_snapshot[idx]
      );
    end if;
  end if;

  if v_builtin_candidates+v_custom_candidates=0 then
    raise exception using message='WORD_POOL_EMPTY',errcode='P0001';
  end if;

  if v_game.word_source_mode='custom' then
    v_use_custom:=true;
  elsif v_game.word_source_mode='builtin' then
    v_use_custom:=false;
  elsif v_builtin_unused+v_custom_unused>0 then
    if v_builtin_unused>0 and v_custom_unused>0 then
      v_use_custom:=random()<0.5;
    else
      v_use_custom:=v_custom_unused>0;
    end if;
  else
    if v_builtin_candidates>0 and v_custom_candidates>0 then
      v_use_custom:=random()<0.5;
    else
      v_use_custom:=v_custom_candidates>0;
    end if;
  end if;

  if v_use_custom then
    if v_custom_unused>0 then
      select idx into v_custom_index
      from generate_series(1,v_custom_candidates) idx
      where not exists(
        select 1
        from public.liar_rounds r
        where r.game_id=v_game.id
          and public.liar_normalize_guess_text(r.word_snapshot)=v_game.custom_normalized_words_snapshot[idx]
      )
      order by random()
      limit 1;
    else
      select idx into v_custom_index
      from generate_series(1,v_custom_candidates) idx
      order by random()
      limit 1;
    end if;

    v_custom_word:=v_game.custom_words_snapshot[v_custom_index];
    if v_custom_word is null then raise exception using message='WORD_POOL_EMPTY',errcode='P0001'; end if;

    insert into public.liar_rounds(
      game_id,room_id,round_no,status,word_id,category_snapshot,word_snapshot,
      word_source_snapshot,custom_word_index,current_speaker_index
    ) values(
      v_game.id,v_room.id,v_round_no,'ROLE_REVEAL',null,'커스텀',v_custom_word,
      'custom',v_custom_index,null
    )
    returning liar_rounds.id into v_round;
  else
    if v_builtin_unused>0 then
      select * into v_word
      from public.liar_words w
      where w.enabled
        and w.category=any(v_game.selected_categories)
        and (v_game.difficulty='all' or w.difficulty=v_game.difficulty)
        and not exists(
          select 1
          from public.liar_rounds r
          where r.game_id=v_game.id
            and public.liar_normalize_guess_text(r.word_snapshot)=public.liar_normalize_guess_text(w.word)
        )
      order by random()
      limit 1;
    else
      select * into v_word
      from public.liar_words w
      where w.enabled
        and w.category=any(v_game.selected_categories)
        and (v_game.difficulty='all' or w.difficulty=v_game.difficulty)
      order by random()
      limit 1;
    end if;

    if v_word.id is null then raise exception using message='WORD_POOL_EMPTY',errcode='P0001'; end if;

    insert into public.liar_rounds(
      game_id,room_id,round_no,status,word_id,category_snapshot,word_snapshot,
      word_source_snapshot,custom_word_index,current_speaker_index
    ) values(
      v_game.id,v_room.id,v_round_no,'ROLE_REVEAL',v_word.id,v_word.category,v_word.word,
      'builtin',null,null
    )
    returning liar_rounds.id into v_round;
  end if;

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
      order by coalesce(h.liar_rounds,0)::numeric+random()*1.25,random()
    ) as liar_order
    from shuffled s
    left join history h on h.player_id=s.id
  )
  insert into public.liar_round_players(round_id,player_id,nickname_snapshot,role,turn_order)
  select v_round,a.id,a.nickname,
         case when a.liar_order<=v_game.liar_count then 'liar' else 'citizen' end,
         a.turn_order
  from assigned a;

  update public.liar_players lp
  set ready=false
  where lp.room_id=v_room.id and lp.membership_status='active';

  update public.liar_games g
  set status='active',started_at=coalesce(g.started_at,now())
  where g.id=v_game.id;

  update public.liar_rooms rm
  set current_round_id=v_round,
      last_activity_at=now(),
      expires_at=now()+interval '24 hours',
      version=rm.version+1
  where rm.id=v_room.id
  returning rm.version into v_room.version;

  return query
  select v_round,v_round_no,v_room.version,r.version
  from public.liar_rounds r
  where r.id=v_round;
end $$;
