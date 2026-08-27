-- Liar Game v1.2: report the actual credited loss reward at the 99P wallet cap.

create or replace function public.liar_award_hint_coin_on_loss()
returns trigger
language plpgsql
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_player_id uuid;
  v_balance integer;
  v_delta integer;
begin
  if new.status='ROUND_RESULT'
     and new.winner='citizen'
     and (old.status is distinct from 'ROUND_RESULT' or old.winner is distinct from 'citizen') then
    for v_player_id in
      select rp.player_id
      from public.liar_round_players rp
      where rp.round_id=new.id and rp.role='liar' and rp.player_id is not null
    loop
      insert into public.liar_hint_wallets(game_id,player_id,balance,earned,spent,updated_at)
      values(new.game_id,v_player_id,0,0,0,now())
      on conflict (game_id,player_id) do nothing;

      select w.balance into v_balance
      from public.liar_hint_wallets w
      where w.game_id=new.game_id and w.player_id=v_player_id
      for update;

      v_delta:=case when coalesce(v_balance,0)<99 then 1 else 0 end;
      insert into public.liar_hint_coin_events(game_id,round_id,player_id,delta,reason)
      values(new.game_id,new.id,v_player_id,v_delta,'liar_loss_reward')
      on conflict (round_id,player_id,reason) do nothing;

      if found and v_delta>0 then
        update public.liar_hint_wallets w
        set balance=w.balance+v_delta,
            earned=w.earned+v_delta,
            updated_at=now()
        where w.game_id=new.game_id and w.player_id=v_player_id;
      end if;
    end loop;
  end if;
  return new;
end;
$function$;

revoke all on function public.liar_award_hint_coin_on_loss() from public,anon,authenticated;

create or replace function public.liar_get_round_result_v12(p_player_key uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_auth uuid:=auth.uid();
  v_base jsonb;
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_balance integer:=0;
  v_reward integer:=0;
begin
  v_base:=public.liar_get_round_result(p_player_key);
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;

  select lp.* into v_player
  from public.liar_players lp
  where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active';
  if not found then return v_base; end if;

  select rm.* into v_room from public.liar_rooms rm where rm.id=v_player.room_id;
  if not found or v_room.current_round_id is null then return v_base; end if;

  select rd.* into v_round from public.liar_rounds rd where rd.id=v_room.current_round_id;
  if not found then return v_base; end if;

  select coalesce(w.balance,0) into v_balance
  from public.liar_hint_wallets w
  where w.game_id=v_round.game_id and w.player_id=v_player.id;
  v_balance:=coalesce(v_balance,0);

  select coalesce(e.delta,0) into v_reward
  from public.liar_hint_coin_events e
  where e.round_id=v_round.id and e.player_id=v_player.id and e.reason='liar_loss_reward';
  v_reward:=coalesce(v_reward,0);

  return v_base||jsonb_build_object(
    'hint_coin_reward',v_reward,
    'hint_coin_balance',v_balance
  );
end;
$function$;

revoke all on function public.liar_get_round_result_v12(uuid) from public,anon;
grant execute on function public.liar_get_round_result_v12(uuid) to authenticated;
