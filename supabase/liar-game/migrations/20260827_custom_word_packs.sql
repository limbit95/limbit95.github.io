-- Liar Game v1.1: reusable private custom word packs.
--
-- Security/model rules:
-- - Packs belong to one authenticated account and base-table access stays closed.
-- - Room snapshots expose only source mode, pack display name, and count; never pack words.
-- - Selecting a pack snapshots its words onto the Game so later edits cannot mutate an active Game.
-- - builtin/custom/mixed sources share one Game-level no-repeat rule by normalized word text.
-- - Settings v5 updates the full Game configuration atomically and bumps room.version exactly once.

create table if not exists public.liar_custom_word_packs (
  id uuid primary key default gen_random_uuid(),
  owner_auth_user_id uuid not null references auth.users(id) on delete cascade,
  name varchar(40) not null,
  normalized_name text not null,
  words text[] not null,
  normalized_words text[] not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint liar_custom_word_packs_name_check
    check (char_length(btrim(name)) between 1 and 40),
  constraint liar_custom_word_packs_normalized_name_check
    check (char_length(normalized_name) between 1 and 40),
  constraint liar_custom_word_packs_word_count_check
    check (cardinality(words) between 5 and 200),
  constraint liar_custom_word_packs_no_null_words_check
    check (array_position(words,null) is null),
  constraint liar_custom_word_packs_no_null_normalized_words_check
    check (array_position(normalized_words,null) is null),
  constraint liar_custom_word_packs_normalized_count_check
    check (cardinality(words)=cardinality(normalized_words)),
  constraint liar_custom_word_packs_owner_name_key
    unique (owner_auth_user_id,normalized_name)
);

create index if not exists liar_custom_word_packs_owner_updated_idx
  on public.liar_custom_word_packs(owner_auth_user_id,updated_at desc);

create trigger liar_custom_word_packs_set_updated_at
before update on public.liar_custom_word_packs
for each row execute function public.liar_set_updated_at();

alter table public.liar_custom_word_packs enable row level security;
revoke all on table public.liar_custom_word_packs from public,anon,authenticated;

alter table public.liar_games
  add column if not exists word_source_mode text not null default 'builtin',
  add column if not exists custom_word_pack_id uuid,
  add column if not exists custom_word_pack_name_snapshot varchar(40),
  add column if not exists custom_words_snapshot text[],
  add column if not exists custom_normalized_words_snapshot text[];

alter table public.liar_games
  drop constraint if exists liar_games_word_source_mode_check;
alter table public.liar_games
  add constraint liar_games_word_source_mode_check
  check (word_source_mode in ('builtin','custom','mixed'));

alter table public.liar_games
  drop constraint if exists liar_games_custom_word_pack_id_fkey;
alter table public.liar_games
  add constraint liar_games_custom_word_pack_id_fkey
  foreign key (custom_word_pack_id)
  references public.liar_custom_word_packs(id)
  on delete set null;

alter table public.liar_games
  drop constraint if exists liar_games_custom_word_snapshot_check;
alter table public.liar_games
  add constraint liar_games_custom_word_snapshot_check check (
    (
      word_source_mode='builtin'
      and custom_word_pack_name_snapshot is null
      and custom_words_snapshot is null
      and custom_normalized_words_snapshot is null
    )
    or
    (
      word_source_mode in ('custom','mixed')
      and char_length(btrim(custom_word_pack_name_snapshot)) between 1 and 40
      and cardinality(custom_words_snapshot) between 5 and 200
      and cardinality(custom_words_snapshot)=cardinality(custom_normalized_words_snapshot)
      and array_position(custom_words_snapshot,null) is null
      and array_position(custom_normalized_words_snapshot,null) is null
    )
  );

alter table public.liar_rounds
  alter column word_id drop not null;

alter table public.liar_rounds
  add column if not exists word_source_snapshot text not null default 'builtin',
  add column if not exists custom_word_index integer;

alter table public.liar_rounds
  drop constraint if exists liar_rounds_category_snapshot_check;
alter table public.liar_rounds
  add constraint liar_rounds_category_snapshot_check check (
    category_snapshot in (
      '음식','장소','직업','동물','물건','인물','스포츠','교통수단',
      '자연','취미','음악','기타','게임','영화드라마','커스텀'
    )
  );

alter table public.liar_rounds
  drop constraint if exists liar_rounds_word_source_snapshot_check;
alter table public.liar_rounds
  add constraint liar_rounds_word_source_snapshot_check
  check (word_source_snapshot in ('builtin','custom'));

alter table public.liar_rounds
  drop constraint if exists liar_rounds_custom_word_index_check;
alter table public.liar_rounds
  add constraint liar_rounds_custom_word_index_check
  check (custom_word_index is null or custom_word_index between 1 and 200);

alter table public.liar_rounds
  drop constraint if exists liar_rounds_word_source_consistency_check;
alter table public.liar_rounds
  add constraint liar_rounds_word_source_consistency_check check (
    (word_source_snapshot='builtin' and word_id is not null and custom_word_index is null)
    or
    (word_source_snapshot='custom' and word_id is null and custom_word_index is not null)
  );

create or replace function public.liar_list_my_word_packs(p_player_key uuid)
returns table(
  id uuid,
  name text,
  word_count integer,
  updated_at timestamptz,
  selected_in_current_game boolean
)
language plpgsql
stable
security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select p.* into v_player
  from public.liar_players p
  where p.auth_user_id=v_auth
    and p.player_key=p_player_key
    and p.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select r.* into v_room
  from public.liar_rooms r
  where r.id=v_player.room_id;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED',errcode='P0001';
  end if;

  return query
  select p.id,
         p.name::text,
         cardinality(p.words)::integer,
         p.updated_at,
         exists(
           select 1
           from public.liar_games g
           where g.id=v_room.current_game_id
             and g.custom_word_pack_id=p.id
         )
  from public.liar_custom_word_packs p
  where p.owner_auth_user_id=v_auth
  order by p.updated_at desc,p.name;
end $$;

create or replace function public.liar_get_my_word_pack(
  p_player_key uuid,
  p_pack_id uuid
)
returns table(id uuid,name text,words text[],updated_at timestamptz)
language plpgsql
stable
security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  if p_pack_id is null then raise exception using message='CUSTOM_WORD_PACK_REQUIRED',errcode='P0001'; end if;

  select p.* into v_player
  from public.liar_players p
  where p.auth_user_id=v_auth
    and p.player_key=p_player_key
    and p.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  return query
  select p.id,p.name::text,p.words,p.updated_at
  from public.liar_custom_word_packs p
  where p.id=p_pack_id and p.owner_auth_user_id=v_auth;

  if not found then raise exception using message='CUSTOM_WORD_PACK_NOT_FOUND',errcode='P0001'; end if;
end $$;

create or replace function public.liar_save_my_word_pack(
  p_player_key uuid,
  p_pack_id uuid,
  p_name text,
  p_words text[]
)
returns table(pack_id uuid,pack_name text,word_count integer)
language plpgsql
security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_name text;
  v_normalized_name text;
  v_words text[];
  v_normalized_words text[];
  v_id uuid;
  v_count integer;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select p.* into v_player
  from public.liar_players p
  where p.auth_user_id=v_auth
    and p.player_key=p_player_key
    and p.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  v_name:=btrim(coalesce(p_name,''));
  v_normalized_name:=lower(regexp_replace(v_name,'[[:space:]]+',' ','g'));

  if char_length(v_name) not between 1 and 40 then
    raise exception using message='INVALID_CUSTOM_WORD_PACK_NAME',errcode='P0001';
  end if;
  if p_words is null or cardinality(p_words) not between 5 and 200 then
    raise exception using message='INVALID_CUSTOM_WORD_PACK',errcode='P0001';
  end if;
  if exists(
    select 1
    from unnest(p_words) w(word)
    where w.word is null
       or char_length(btrim(w.word)) not between 1 and 100
       or char_length(public.liar_normalize_guess_text(w.word)) not between 1 and 100
  ) then
    raise exception using message='INVALID_CUSTOM_WORD_PACK',errcode='P0001';
  end if;

  select array_agg(btrim(w.word) order by w.ord),
         array_agg(public.liar_normalize_guess_text(w.word) order by w.ord)
  into v_words,v_normalized_words
  from unnest(p_words) with ordinality w(word,ord);

  if (
    select count(distinct n)
    from unnest(v_normalized_words) n
  )<>cardinality(v_normalized_words) then
    raise exception using message='DUPLICATE_CUSTOM_WORD',errcode='P0001';
  end if;

  if exists(
    select 1
    from public.liar_custom_word_packs p
    where p.owner_auth_user_id=v_auth
      and p.normalized_name=v_normalized_name
      and (p_pack_id is null or p.id<>p_pack_id)
  ) then
    raise exception using message='CUSTOM_WORD_PACK_NAME_TAKEN',errcode='P0001';
  end if;

  if p_pack_id is null then
    select count(*) into v_count
    from public.liar_custom_word_packs p
    where p.owner_auth_user_id=v_auth;

    if v_count>=20 then
      raise exception using message='CUSTOM_WORD_PACK_LIMIT',errcode='P0001';
    end if;

    insert into public.liar_custom_word_packs(
      owner_auth_user_id,name,normalized_name,words,normalized_words
    ) values(
      v_auth,v_name,v_normalized_name,v_words,v_normalized_words
    )
    returning id into v_id;
  else
    update public.liar_custom_word_packs p
    set name=v_name,
        normalized_name=v_normalized_name,
        words=v_words,
        normalized_words=v_normalized_words
    where p.id=p_pack_id and p.owner_auth_user_id=v_auth
    returning p.id into v_id;

    if v_id is null then
      raise exception using message='CUSTOM_WORD_PACK_NOT_FOUND',errcode='P0001';
    end if;
  end if;

  return query
  select v_id,v_name,cardinality(v_words)::integer;
end $$;

create or replace function public.liar_delete_my_word_pack(
  p_player_key uuid,
  p_pack_id uuid
)
returns boolean
language plpgsql
security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_exists boolean;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;
  if p_pack_id is null then raise exception using message='CUSTOM_WORD_PACK_NOT_FOUND',errcode='P0001'; end if;

  select p.* into v_player
  from public.liar_players p
  where p.auth_user_id=v_auth
    and p.player_key=p_player_key
    and p.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select exists(
    select 1
    from public.liar_custom_word_packs p
    where p.id=p_pack_id and p.owner_auth_user_id=v_auth
  ) into v_exists;
  if not v_exists then raise exception using message='CUSTOM_WORD_PACK_NOT_FOUND',errcode='P0001'; end if;

  if exists(
    select 1
    from public.liar_games g
    join public.liar_rooms r on r.id=g.room_id
    where g.custom_word_pack_id=p_pack_id
      and g.status in ('setup','active')
      and r.status='active'
      and now()<r.expires_at
  ) then
    raise exception using message='CUSTOM_WORD_PACK_IN_USE',errcode='P0001';
  end if;

  delete from public.liar_custom_word_packs p
  where p.id=p_pack_id and p.owner_auth_user_id=v_auth;

  return true;
end $$;

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
    where p.id=p_custom_word_pack_id
      and p.owner_auth_user_id=v_auth
    for share;
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

-- Existing liar_games INSERT trigger calls this function. Extending the trigger
-- function makes "새 게임 · 설정 변경" inherit the selected word-source snapshot.
create or replace function public.liar_copy_game_mode_settings()
returns trigger
language plpgsql
set search_path=pg_catalog,public
as $$
declare
  v_prev public.liar_games%rowtype;
begin
  if new.game_no>1 and new.status='setup' then
    select g.* into v_prev
    from public.liar_games g
    where g.room_id=new.room_id and g.game_no<new.game_no
    order by g.game_no desc
    limit 1;

    if found then
      new.game_mode:=v_prev.game_mode;
      new.drawing_time_limit:=v_prev.drawing_time_limit;
      new.drawing_stroke_limit:=v_prev.drawing_stroke_limit;
      new.drawing_stroke_unlimited:=v_prev.drawing_stroke_unlimited;
      new.speaking_time_limit:=v_prev.speaking_time_limit;
      new.discussion_time_limit:=v_prev.discussion_time_limit;
      new.liars_know_each_other:=v_prev.liars_know_each_other;
      new.word_source_mode:=v_prev.word_source_mode;
      new.custom_word_pack_id:=v_prev.custom_word_pack_id;
      new.custom_word_pack_name_snapshot:=v_prev.custom_word_pack_name_snapshot;
      new.custom_words_snapshot:=v_prev.custom_words_snapshot;
      new.custom_normalized_words_snapshot:=v_prev.custom_normalized_words_snapshot;
    end if;
  end if;

  return new;
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
  where lp.room_id=v_room.id
    and lp.membership_status='active'
    and lp.ready;
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
          and public.liar_normalize_guess_text(r.word_snapshot)
              = public.liar_normalize_guess_text(w.word)
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
          and public.liar_normalize_guess_text(r.word_snapshot)
              = v_game.custom_normalized_words_snapshot[idx]
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
          and public.liar_normalize_guess_text(r.word_snapshot)
              = v_game.custom_normalized_words_snapshot[idx]
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
            and public.liar_normalize_guess_text(r.word_snapshot)
                = public.liar_normalize_guess_text(w.word)
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
    select p.id,
           p.nickname,
           (row_number() over(order by random())-1)::smallint as turn_order
    from public.liar_players p
    where p.room_id=v_room.id
      and p.membership_status='active'
      and p.ready
  ), history as (
    select rp.player_id,
           count(*) filter(where rp.role='liar')::integer as liar_rounds
    from public.liar_round_players rp
    join public.liar_rounds r on r.id=rp.round_id
    where r.game_id=v_game.id
    group by rp.player_id
  ), assigned as (
    select s.*,
           row_number() over(
             order by coalesce(h.liar_rounds,0)::numeric+random()*1.25,random()
           ) as liar_order
    from shuffled s
    left join history h on h.player_id=s.id
  )
  insert into public.liar_round_players(
    round_id,player_id,nickname_snapshot,role,turn_order
  )
  select v_round,
         a.id,
         a.nickname,
         case when a.liar_order<=v_game.liar_count then 'liar' else 'citizen' end,
         a.turn_order
  from assigned a;

  update public.liar_players lp
  set ready=false
  where lp.room_id=v_room.id and lp.membership_status='active';

  update public.liar_games g
  set status='active',
      started_at=coalesce(g.started_at,now())
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

-- Keep custom pack contents out of the shared room snapshot.
create or replace function public.liar_get_room_snapshot(p_player_key uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path=pg_catalog,public
as $$
declare
  v_base jsonb;
  v_game_id uuid;
  v_round_id uuid;
  v_game public.liar_games%rowtype;
  v_round public.liar_rounds%rowtype;
begin
  v_base:=public.liar_get_room_snapshot_phase3_base(p_player_key);
  v_game_id:=nullif(v_base#>>'{game,id}','')::uuid;
  v_round_id:=nullif(v_base#>>'{round,id}','')::uuid;

  if v_game_id is not null then
    select g.* into v_game
    from public.liar_games g
    where g.id=v_game_id;

    v_base:=jsonb_set(
      v_base,
      '{game}',
      coalesce(v_base->'game','{}'::jsonb)||jsonb_build_object(
        'speaking_time_limit',v_game.speaking_time_limit,
        'discussion_time_limit',v_game.discussion_time_limit,
        'liars_know_each_other',v_game.liars_know_each_other,
        'word_source_mode',v_game.word_source_mode,
        'custom_word_pack_name',v_game.custom_word_pack_name_snapshot,
        'custom_word_count',coalesce(cardinality(v_game.custom_words_snapshot),0)
      ),
      true
    );
  end if;

  if v_round_id is not null then
    select r.* into v_round
    from public.liar_rounds r
    where r.id=v_round_id;

    v_base:=jsonb_set(
      v_base,
      '{round}',
      coalesce(v_base->'round','{}'::jsonb)||jsonb_build_object(
        'speaking_time_limit_snapshot',v_round.speaking_time_limit_snapshot,
        'discussion_time_limit_snapshot',v_round.discussion_time_limit_snapshot,
        'liars_know_each_other_snapshot',v_round.liars_know_each_other_snapshot,
        'speaking_turn_started_at',v_round.speaking_turn_started_at,
        'discussion_started_at',v_round.discussion_started_at,
        'word_source_snapshot',v_round.word_source_snapshot,
        'server_now',now()
      ),
      true
    );
  end if;

  return v_base;
end $$;

-- Client access: owner-scoped pack RPCs + current v5 settings only.
revoke all on function public.liar_list_my_word_packs(uuid)
  from public,anon,authenticated;
revoke all on function public.liar_get_my_word_pack(uuid,uuid)
  from public,anon,authenticated;
revoke all on function public.liar_save_my_word_pack(uuid,uuid,text,text[])
  from public,anon,authenticated;
revoke all on function public.liar_delete_my_word_pack(uuid,uuid)
  from public,anon,authenticated;
revoke all on function public.liar_update_game_settings_v4(
  uuid,text[],text,integer,integer,boolean,text,integer,integer,boolean,
  integer,integer,boolean,bigint
) from public,anon,authenticated;
revoke all on function public.liar_update_game_settings_v5(
  uuid,text[],text,integer,integer,boolean,text,integer,integer,boolean,
  integer,integer,boolean,text,uuid,bigint
) from public,anon,authenticated;

grant execute on function public.liar_list_my_word_packs(uuid) to authenticated;
grant execute on function public.liar_get_my_word_pack(uuid,uuid) to authenticated;
grant execute on function public.liar_save_my_word_pack(uuid,uuid,text,text[]) to authenticated;
grant execute on function public.liar_delete_my_word_pack(uuid,uuid) to authenticated;
grant execute on function public.liar_update_game_settings_v5(
  uuid,text[],text,integer,integer,boolean,text,integer,integer,boolean,
  integer,integer,boolean,text,uuid,bigint
) to authenticated;
