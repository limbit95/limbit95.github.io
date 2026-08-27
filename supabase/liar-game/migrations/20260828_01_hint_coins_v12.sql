-- Liar Game v1.2: per-game hint coins and liar hint shop.
-- Fresh upgrade path version; the final reward projection is installed by 07_hint_reward_cap_fix.sql.

create table if not exists public.liar_hint_wallets (
  game_id uuid not null references public.liar_games(id) on delete cascade,
  player_id uuid not null references public.liar_players(id) on delete cascade,
  balance smallint not null default 0 check (balance >= 0 and balance <= 99),
  earned smallint not null default 0 check (earned >= 0),
  spent smallint not null default 0 check (spent >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (game_id, player_id)
);

create table if not exists public.liar_hint_coin_events (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.liar_games(id) on delete cascade,
  round_id uuid not null references public.liar_rounds(id) on delete cascade,
  player_id uuid not null references public.liar_players(id) on delete cascade,
  delta smallint not null,
  reason text not null,
  created_at timestamptz not null default now(),
  unique (round_id, player_id, reason)
);

create table if not exists public.liar_hint_purchases (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.liar_games(id) on delete cascade,
  round_id uuid not null references public.liar_rounds(id) on delete cascade,
  round_player_id uuid not null references public.liar_round_players(id) on delete cascade,
  player_id uuid not null references public.liar_players(id) on delete cascade,
  hint_type text not null check (hint_type in ('word_length','category','first_letter')),
  cost smallint not null check (cost between 1 and 9),
  hint_value text not null,
  created_at timestamptz not null default now(),
  unique (round_id, round_player_id, hint_type)
);

alter table public.liar_round_players
  add column if not exists hint_coins_at_start smallint not null default 0,
  add column if not exists hint_category_forced_hidden boolean not null default false;

alter table public.liar_hint_wallets enable row level security;
alter table public.liar_hint_coin_events enable row level security;
alter table public.liar_hint_purchases enable row level security;

revoke all on public.liar_hint_wallets from public, anon, authenticated;
revoke all on public.liar_hint_coin_events from public, anon, authenticated;
revoke all on public.liar_hint_purchases from public, anon, authenticated;

create or replace function public.liar_snapshot_hint_coins_for_round_player()
returns trigger
language plpgsql
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_game_id uuid;
  v_balance integer := 0;
begin
  select r.game_id into v_game_id
  from public.liar_rounds r
  where r.id=new.round_id;

  if v_game_id is null or new.player_id is null then
    new.hint_coins_at_start:=0;
    new.hint_category_forced_hidden:=false;
    return new;
  end if;

  select w.balance into v_balance
  from public.liar_hint_wallets w
  where w.game_id=v_game_id and w.player_id=new.player_id;

  v_balance:=coalesce(v_balance,0);
  new.hint_coins_at_start:=v_balance;
  new.hint_category_forced_hidden:=new.role='liar' and v_balance>=3;
  return new;
end;
$function$;

revoke all on function public.liar_snapshot_hint_coins_for_round_player() from public, anon, authenticated;

drop trigger if exists liar_snapshot_hint_coins_for_round_player on public.liar_round_players;
create trigger liar_snapshot_hint_coins_for_round_player
before insert on public.liar_round_players
for each row execute function public.liar_snapshot_hint_coins_for_round_player();

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

revoke all on function public.liar_award_hint_coin_on_loss() from public, anon, authenticated;

drop trigger if exists liar_award_hint_coin_on_loss on public.liar_rounds;
create trigger liar_award_hint_coin_on_loss
after update of status,winner on public.liar_rounds
for each row execute function public.liar_award_hint_coin_on_loss();

create or replace function public.liar_get_my_round_role_v12(p_player_key uuid)
returns table(
  role text,
  category text,
  word text,
  teammates jsonb,
  hint_coins integer,
  hint_coins_at_start integer,
  category_forced_hidden boolean,
  hint_shop jsonb
)
language plpgsql
stable
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select lp.* into v_player
  from public.liar_players lp
  where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select rm.* into v_room from public.liar_rooms rm where rm.id=v_player.room_id;
  if not found or v_room.status='expired' or now()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED',errcode='P0001';
  end if;

  return query
  select
    rp.role,
    case
      when rp.role='citizen' then r.category_snapshot
      when rp.role='liar' and g.show_category_to_liar and not rp.hint_category_forced_hidden then r.category_snapshot
      else null
    end,
    case when rp.role='citizen' then r.word_snapshot else null end,
    case when rp.role='liar' and r.liars_know_each_other_snapshot then coalesce((
      select jsonb_agg(other.nickname_snapshot order by other.turn_order)
      from public.liar_round_players other
      where other.round_id=r.id and other.role='liar' and other.id<>rp.id
    ),'[]'::jsonb) else '[]'::jsonb end,
    coalesce(w.balance,0)::integer,
    rp.hint_coins_at_start::integer,
    rp.hint_category_forced_hidden,
    case when rp.role='liar' then jsonb_build_array(
      jsonb_build_object(
        'id','word_length','label','글자 수','cost',1,
        'description','제시어의 글자 수를 확인합니다.',
        'purchased',exists(select 1 from public.liar_hint_purchases hp where hp.round_id=r.id and hp.round_player_id=rp.id and hp.hint_type='word_length'),
        'value',(select hp.hint_value from public.liar_hint_purchases hp where hp.round_id=r.id and hp.round_player_id=rp.id and hp.hint_type='word_length')
      ),
      jsonb_build_object(
        'id','category','label','카테고리','cost',2,
        'description','현재 제시어의 카테고리를 확인합니다.',
        'already_known',(g.show_category_to_liar and not rp.hint_category_forced_hidden),
        'purchased',exists(select 1 from public.liar_hint_purchases hp where hp.round_id=r.id and hp.round_player_id=rp.id and hp.hint_type='category'),
        'value',(select hp.hint_value from public.liar_hint_purchases hp where hp.round_id=r.id and hp.round_player_id=rp.id and hp.hint_type='category')
      ),
      jsonb_build_object(
        'id','first_letter','label','첫 글자','cost',3,
        'description','제시어의 첫 글자를 확인합니다.',
        'purchased',exists(select 1 from public.liar_hint_purchases hp where hp.round_id=r.id and hp.round_player_id=rp.id and hp.hint_type='first_letter'),
        'value',(select hp.hint_value from public.liar_hint_purchases hp where hp.round_id=r.id and hp.round_player_id=rp.id and hp.hint_type='first_letter')
      )
    ) else '[]'::jsonb end
  from public.liar_round_players rp
  join public.liar_rounds r on r.id=rp.round_id
  join public.liar_games g on g.id=r.game_id
  left join public.liar_hint_wallets w on w.game_id=r.game_id and w.player_id=rp.player_id
  where rp.round_id=v_room.current_round_id and rp.player_id=v_player.id;

  if not found then raise exception using message='NOT_ROUND_PARTICIPANT',errcode='P0001'; end if;
end;
$function$;

revoke all on function public.liar_get_my_round_role_v12(uuid) from public, anon;
grant execute on function public.liar_get_my_round_role_v12(uuid) to authenticated;

create or replace function public.liar_purchase_hint(p_player_key uuid,p_hint_type text)
returns jsonb
language plpgsql
security definer
set search_path to 'pg_catalog','public'
as $function$
declare
  v_auth uuid:=auth.uid();
  v_player public.liar_players%rowtype;
  v_room public.liar_rooms%rowtype;
  v_round public.liar_rounds%rowtype;
  v_game public.liar_games%rowtype;
  v_round_player public.liar_round_players%rowtype;
  v_wallet public.liar_hint_wallets%rowtype;
  v_cost integer;
  v_value text;
begin
  if v_auth is null then raise exception using message='AUTH_REQUIRED',errcode='P0001'; end if;
  if p_player_key is null then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select lp.* into v_player
  from public.liar_players lp
  where lp.auth_user_id=v_auth and lp.player_key=p_player_key and lp.membership_status='active';
  if not found then raise exception using message='NOT_ROOM_MEMBER',errcode='P0001'; end if;

  select rm.* into v_room from public.liar_rooms rm where rm.id=v_player.room_id for update;
  if not found or v_room.status<>'active' or now()>=v_room.expires_at then
    raise exception using message='ROOM_EXPIRED',errcode='P0001';
  end if;
  if v_room.current_round_id is null then raise exception using message='INVALID_ROUND_STATE',errcode='P0001'; end if;

  select rd.* into v_round from public.liar_rounds rd where rd.id=v_room.current_round_id for update;
  if not found or v_round.status not in ('ROLE_REVEAL','SPEAKING','DRAWING','DISCUSSION','VOTING','RUNOFF_VOTING','VOTE_RESULT','LIAR_REVEAL','LIAR_GUESS') then
    raise exception using message='HINT_SHOP_CLOSED',errcode='P0001';
  end if;

  select gm.* into v_game from public.liar_games gm where gm.id=v_round.game_id and gm.room_id=v_room.id;
  if not found then raise exception using message='INVALID_GAME_STATE',errcode='P0001'; end if;

  select rp.* into v_round_player
  from public.liar_round_players rp
  where rp.round_id=v_round.id and rp.player_id=v_player.id;
  if not found then raise exception using message='NOT_ROUND_PARTICIPANT',errcode='P0001'; end if;
  if v_round_player.role<>'liar' then raise exception using message='NOT_LIAR',errcode='P0001'; end if;

  if p_hint_type='word_length' then
    v_cost:=1;
    v_value:=char_length(regexp_replace(btrim(v_round.word_snapshot),'[[:space:]]','','g'))::text||'글자';
  elsif p_hint_type='category' then
    v_cost:=2;
    if v_game.show_category_to_liar and not v_round_player.hint_category_forced_hidden then
      raise exception using message='HINT_ALREADY_KNOWN',errcode='P0001';
    end if;
    v_value:=v_round.category_snapshot;
  elsif p_hint_type='first_letter' then
    v_cost:=3;
    v_value:=substring(btrim(v_round.word_snapshot) from 1 for 1);
  else
    raise exception using message='INVALID_HINT_TYPE',errcode='P0001';
  end if;

  if exists(
    select 1 from public.liar_hint_purchases hp
    where hp.round_id=v_round.id and hp.round_player_id=v_round_player.id and hp.hint_type=p_hint_type
  ) then
    raise exception using message='HINT_ALREADY_PURCHASED',errcode='P0001';
  end if;

  insert into public.liar_hint_wallets(game_id,player_id,balance,earned,spent,updated_at)
  values(v_round.game_id,v_player.id,0,0,0,now())
  on conflict (game_id,player_id) do nothing;

  select w.* into v_wallet
  from public.liar_hint_wallets w
  where w.game_id=v_round.game_id and w.player_id=v_player.id
  for update;

  if v_wallet.balance<v_cost then raise exception using message='NOT_ENOUGH_HINT_COINS',errcode='P0001'; end if;

  insert into public.liar_hint_purchases(game_id,round_id,round_player_id,player_id,hint_type,cost,hint_value)
  values(v_round.game_id,v_round.id,v_round_player.id,v_player.id,p_hint_type,v_cost,v_value);

  update public.liar_hint_wallets w
  set balance=w.balance-v_cost,spent=w.spent+v_cost,updated_at=now()
  where w.game_id=v_round.game_id and w.player_id=v_player.id
  returning w.* into v_wallet;

  return jsonb_build_object('hint_type',p_hint_type,'cost',v_cost,'value',v_value,'balance',v_wallet.balance);
end;
$function$;

revoke all on function public.liar_purchase_hint(uuid,text) from public, anon;
grant execute on function public.liar_purchase_hint(uuid,text) to authenticated;
