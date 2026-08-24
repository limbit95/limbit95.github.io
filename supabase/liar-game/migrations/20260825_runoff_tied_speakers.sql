-- During the optional speaking step before a runoff, only tied runoff candidates speak.
-- current_speaker_index is interpreted as a zero-based position inside that candidate subset.

create or replace function public.liar_get_room_snapshot(p_player_key uuid)
returns jsonb language plpgsql security definer stable
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_result jsonb;
  v_is_spectator boolean;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select * into v_player
  from public.liar_players
  where auth_user_id=v_auth and player_key=p_player_key and membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select * into v_room from public.liar_rooms where id=v_player.room_id;
  if v_room.status='expired' or now()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED',errcode='P0001';
  end if;

  v_is_spectator:=v_room.current_round_id is not null and not exists(
    select 1 from public.liar_round_players rp
    where rp.round_id=v_room.current_round_id and rp.player_id=v_player.id
  );

  select jsonb_build_object(
    'room',jsonb_build_object(
      'id',r.id,'room_code',r.room_code,'status',r.status,
      'host_player_id',r.host_player_id,'current_game_id',r.current_game_id,
      'current_round_id',r.current_round_id,'version',r.version,'expires_at',r.expires_at
    ),
    'me',jsonb_build_object(
      'player_id',v_player.id,'nickname',v_player.nickname,
      'is_host',r.host_player_id=v_player.id,'is_spectator',v_is_spectator
    ),
    'game',(
      select jsonb_build_object(
        'id',g.id,'game_no',g.game_no,'status',g.status,
        'selected_categories',g.selected_categories,'difficulty',g.difficulty,
        'liar_count',g.liar_count,'guess_limit',g.guess_limit,
        'show_category_to_liar',g.show_category_to_liar,'started_at',g.started_at
      )
      from public.liar_games g where g.id=r.current_game_id
    ),
    'players',(
      select coalesce(jsonb_agg(jsonb_build_object(
        'id',p.id,'nickname',p.nickname,'ready',p.ready,'membership_status',p.membership_status
      ) order by p.joined_at),'[]'::jsonb)
      from public.liar_players p
      where p.room_id=r.id and p.membership_status='active'
    ),
    'round',(
      select jsonb_build_object(
        'id',x.id,'round_no',x.round_no,'status',x.status,
        'current_speaker_index',x.current_speaker_index,
        'current_vote_stage',x.current_vote_stage,'version',x.version,
        'spectator_category',case when v_is_spectator then x.category_snapshot else null end,
        'spectator_word',case when v_is_spectator then x.word_snapshot else null end,
        'runoff_speaker_round_player_ids',case
          when x.status='SPEAKING' and x.current_vote_stage>0 then coalesce((
            select to_jsonb(vs.candidate_round_player_ids)
            from public.liar_vote_stages vs
            where vs.round_id=x.id
              and vs.stage_no=x.current_vote_stage
              and vs.kind='runoff'
              and vs.status='open'
            limit 1
          ),'[]'::jsonb)
          else '[]'::jsonb
        end
      )
      from public.liar_rounds x where x.id=r.current_round_id
    ),
    'round_players',(
      select coalesce(jsonb_agg(jsonb_build_object(
        'id',rp.id,'player_id',rp.player_id,'nickname_snapshot',rp.nickname_snapshot,
        'turn_order',rp.turn_order,'role_checked',rp.role_checked_at is not null,
        'is_liar',case when v_is_spectator then rp.role='liar' else null end
      ) order by rp.turn_order),'[]'::jsonb)
      from public.liar_round_players rp where rp.round_id=r.current_round_id
    )
  ) into v_result
  from public.liar_rooms r where r.id=v_room.id;

  return v_result;
end $$;

create or replace function public.liar_move_speaker(
  p_player_key uuid,
  p_direction text,
  p_expected_round_version bigint
)
returns table(current_speaker_index smallint,round_version bigint)
language plpgsql security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_stage public.liar_vote_stages%rowtype;
  v_count integer;
  v_new integer;
  v_current_player_id uuid;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select * into v_player
  from public.liar_players
  where auth_user_id=v_auth and player_key=p_player_key and membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select * into v_room from public.liar_rooms where id=v_player.room_id for update;
  if v_room.status='expired' or now()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED',errcode='P0001';
  end if;

  select * into v_round from public.liar_rounds where id=v_room.current_round_id for update;
  if not found or v_round.status<>'SPEAKING' then
    raise exception using message='INVALID_ROUND_STATE',errcode='P0001';
  end if;
  if p_expected_round_version is null or v_round.version<>p_expected_round_version then
    raise exception using message='STALE_VERSION',errcode='P0001';
  end if;
  if p_direction is null or upper(p_direction) not in ('NEXT','PREVIOUS','RESTART') then
    raise exception using message='INVALID_DIRECTION',errcode='P0001';
  end if;

  if v_round.current_vote_stage>0 then
    select vs.* into v_stage
    from public.liar_vote_stages vs
    where vs.round_id=v_round.id
      and vs.stage_no=v_round.current_vote_stage
      and vs.kind='runoff'
      and vs.status='open';
    if not found then raise exception using message='INVALID_RUNOFF_STATE',errcode='P0001'; end if;

    select count(*) into v_count
    from public.liar_round_players rp
    where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids);

    select rp.player_id into v_current_player_id
    from public.liar_round_players rp
    where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids)
    order by rp.turn_order
    offset v_round.current_speaker_index limit 1;
  else
    select count(*) into v_count
    from public.liar_round_players rp where rp.round_id=v_round.id;

    select rp.player_id into v_current_player_id
    from public.liar_round_players rp
    where rp.round_id=v_round.id
    order by rp.turn_order
    offset v_round.current_speaker_index limit 1;
  end if;

  if v_count<1 or v_current_player_id is null then
    raise exception using message='SPEAKER_INDEX_OUT_OF_RANGE',errcode='P0001';
  end if;

  if upper(p_direction)='PREVIOUS' and v_room.host_player_id<>v_player.id then
    raise exception using message='NOT_HOST',errcode='P0001';
  end if;
  if upper(p_direction)='NEXT'
     and v_room.host_player_id<>v_player.id
     and v_current_player_id is distinct from v_player.id then
    raise exception using message='NOT_CURRENT_SPEAKER',errcode='P0001';
  end if;

  if upper(p_direction)='RESTART' then
    if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;
    if v_round.current_speaker_index<>v_count-1 then
      raise exception using message='SPEAKING_NOT_FINISHED',errcode='P0001';
    end if;
    v_new:=0;
  else
    v_new:=v_round.current_speaker_index + case when upper(p_direction)='NEXT' then 1 else -1 end;
    if v_new<0 or v_new>=v_count then
      raise exception using message='SPEAKER_INDEX_OUT_OF_RANGE',errcode='P0001';
    end if;
  end if;

  update public.liar_rounds r
  set current_speaker_index=v_new,version=r.version+1
  where r.id=v_round.id
  returning r.current_speaker_index,r.version into current_speaker_index,round_version;

  update public.liar_rooms
  set last_activity_at=now(),expires_at=now()+interval '24 hours',version=version+1
  where id=v_room.id;

  return next;
end $$;

create or replace function public.liar_finish_speaking(
  p_player_key uuid,
  p_expected_round_version bigint
)
returns bigint language plpgsql security definer
set search_path=pg_catalog,public
as $$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_stage public.liar_vote_stages%rowtype;
  v_count integer;
  v_next_status text:='DISCUSSION';
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select * into v_player
  from public.liar_players
  where auth_user_id=v_auth and player_key=p_player_key and membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select * into v_room from public.liar_rooms where id=v_player.room_id for update;
  if v_room.status='expired' or now()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED',errcode='P0001';
  end if;
  if v_room.host_player_id<>v_player.id then raise exception using message='NOT_HOST',errcode='P0001'; end if;

  select * into v_round from public.liar_rounds where id=v_room.current_round_id for update;
  if not found or v_round.status<>'SPEAKING' then
    raise exception using message='INVALID_ROUND_STATE',errcode='P0001';
  end if;
  if p_expected_round_version is null or v_round.version<>p_expected_round_version then
    raise exception using message='STALE_VERSION',errcode='P0001';
  end if;

  if v_round.current_vote_stage>0 then
    select vs.* into v_stage
    from public.liar_vote_stages vs
    where vs.round_id=v_round.id
      and vs.stage_no=v_round.current_vote_stage
      and vs.kind='runoff'
      and vs.status='open';
    if not found then raise exception using message='INVALID_RUNOFF_STATE',errcode='P0001'; end if;

    select count(*) into v_count
    from public.liar_round_players rp
    where rp.round_id=v_round.id and rp.id=any(v_stage.candidate_round_player_ids);
    v_next_status:='RUNOFF_VOTING';
  else
    select count(*) into v_count
    from public.liar_round_players rp where rp.round_id=v_round.id;
  end if;

  if v_count<1 then raise exception using message='INVALID_RUNOFF_STATE',errcode='P0001'; end if;
  if v_round.current_speaker_index<>v_count-1 then
    raise exception using message='SPEAKING_NOT_FINISHED',errcode='P0001';
  end if;

  update public.liar_rounds
  set status=v_next_status,version=version+1
  where id=v_round.id
  returning version into v_round.version;

  update public.liar_rooms
  set last_activity_at=now(),expires_at=now()+interval '24 hours',version=version+1
  where id=v_room.id;

  return v_round.version;
end $$;
