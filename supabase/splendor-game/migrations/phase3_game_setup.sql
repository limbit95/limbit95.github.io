-- Splendor Phase 3: catalog + server-authoritative game setup.
-- Applied to Supabase as migration: splendor_phase3_game_setup.
-- Test catalog below is original implementation data, not the official Splendor catalog.

create table if not exists public.splendor_rulesets (
  ruleset_key text primary key,
  display_name text not null,
  status text not null default 'test' check (status in ('test','active','retired')),
  target_score smallint not null default 15 check (target_score between 1 and 100),
  max_tokens smallint not null default 10 check (max_tokens between 1 and 30),
  max_reserved smallint not null default 3 check (max_reserved between 0 and 10),
  created_at timestamptz not null default now()
);

create table if not exists public.splendor_card_catalog (
  id uuid primary key default gen_random_uuid(),
  ruleset_key text not null references public.splendor_rulesets(ruleset_key) on delete restrict,
  card_key text not null,
  tier smallint not null check (tier between 1 and 3),
  bonus_color text not null check (bonus_color in ('white','blue','green','red','black')),
  prestige smallint not null default 0 check (prestige between 0 and 20),
  cost jsonb not null default '{}'::jsonb check (jsonb_typeof(cost) = 'object'),
  title text not null,
  image_path text,
  created_at timestamptz not null default now(),
  unique (ruleset_key, card_key)
);

create table if not exists public.splendor_noble_catalog (
  id uuid primary key default gen_random_uuid(),
  ruleset_key text not null references public.splendor_rulesets(ruleset_key) on delete restrict,
  noble_key text not null,
  prestige smallint not null default 3 check (prestige between 0 and 20),
  requirements jsonb not null default '{}'::jsonb check (jsonb_typeof(requirements) = 'object'),
  title text not null,
  image_path text,
  created_at timestamptz not null default now(),
  unique (ruleset_key, noble_key)
);

create table if not exists public.splendor_games (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null unique references public.splendor_rooms(id) on delete cascade,
  ruleset_key text not null references public.splendor_rulesets(ruleset_key) on delete restrict,
  status text not null default 'playing' check (status in ('playing','finished')),
  version bigint not null default 0,
  turn_no integer not null default 1 check (turn_no >= 1),
  starting_player_seat smallint not null check (starting_player_seat between 1 and 4),
  current_turn_seat smallint not null check (current_turn_seat between 1 and 4),
  bank_tokens jsonb not null check (jsonb_typeof(bank_tokens) = 'object'),
  target_score smallint not null default 15,
  max_tokens smallint not null default 10,
  max_reserved smallint not null default 3,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists public.splendor_game_players (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.splendor_games(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  seat smallint not null check (seat between 1 and 4),
  score smallint not null default 0,
  tokens jsonb not null default '{"white":0,"blue":0,"green":0,"red":0,"black":0,"gold":0}'::jsonb,
  bonuses jsonb not null default '{"white":0,"blue":0,"green":0,"red":0,"black":0}'::jsonb,
  purchased_card_count integer not null default 0,
  reserved_card_count integer not null default 0,
  status text not null default 'active' check (status in ('active','left')),
  created_at timestamptz not null default now(),
  unique (game_id, user_id),
  unique (game_id, seat)
);

create table if not exists public.splendor_game_cards (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.splendor_games(id) on delete cascade,
  catalog_card_id uuid not null references public.splendor_card_catalog(id) on delete restrict,
  tier smallint not null check (tier between 1 and 3),
  deck_position integer not null check (deck_position >= 1),
  location text not null default 'deck' check (location in ('deck','face_up','reserved','purchased')),
  face_up_slot smallint check (face_up_slot between 1 and 4),
  owner_game_player_id uuid references public.splendor_game_players(id) on delete set null,
  reserved_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  unique (game_id, catalog_card_id)
);

create unique index if not exists splendor_game_cards_face_up_slot_uq
  on public.splendor_game_cards(game_id, tier, face_up_slot)
  where location = 'face_up';

create index if not exists splendor_game_cards_deck_idx
  on public.splendor_game_cards(game_id, tier, location, deck_position);

create table if not exists public.splendor_game_nobles (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.splendor_games(id) on delete cascade,
  catalog_noble_id uuid not null references public.splendor_noble_catalog(id) on delete restrict,
  display_order smallint not null check (display_order between 1 and 5),
  status text not null default 'available' check (status in ('available','claimed')),
  owner_game_player_id uuid references public.splendor_game_players(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (game_id, catalog_noble_id),
  unique (game_id, display_order)
);

alter table public.splendor_rulesets enable row level security;
alter table public.splendor_card_catalog enable row level security;
alter table public.splendor_noble_catalog enable row level security;
alter table public.splendor_games enable row level security;
alter table public.splendor_game_players enable row level security;
alter table public.splendor_game_cards enable row level security;
alter table public.splendor_game_nobles enable row level security;

create or replace function private.splendor_is_game_member(p_game_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select (select auth.uid()) is not null
    and private.is_approved_member()
    and exists (
      select 1
      from public.splendor_games g
      join public.splendor_room_players rp on rp.room_id = g.room_id
      where g.id = p_game_id
        and rp.user_id = (select auth.uid())
        and rp.membership_status = 'active'
    );
$$;

revoke all on function private.splendor_is_game_member(uuid) from public, anon;
grant execute on function private.splendor_is_game_member(uuid) to authenticated;

grant select on public.splendor_rulesets to authenticated;
grant select on public.splendor_card_catalog to authenticated;
grant select on public.splendor_noble_catalog to authenticated;
grant select on public.splendor_games to authenticated;
grant select on public.splendor_game_players to authenticated;
grant select on public.splendor_game_nobles to authenticated;
revoke all on public.splendor_game_cards from anon, authenticated;

revoke insert, update, delete on public.splendor_rulesets from anon, authenticated;
revoke insert, update, delete on public.splendor_card_catalog from anon, authenticated;
revoke insert, update, delete on public.splendor_noble_catalog from anon, authenticated;
revoke insert, update, delete on public.splendor_games from anon, authenticated;
revoke insert, update, delete on public.splendor_game_players from anon, authenticated;
revoke insert, update, delete on public.splendor_game_nobles from anon, authenticated;

drop policy if exists "splendor approved members can read rulesets" on public.splendor_rulesets;
create policy "splendor approved members can read rulesets"
on public.splendor_rulesets for select to authenticated using (private.is_approved_member());

drop policy if exists "splendor approved members can read card catalog" on public.splendor_card_catalog;
create policy "splendor approved members can read card catalog"
on public.splendor_card_catalog for select to authenticated using (private.is_approved_member());

drop policy if exists "splendor approved members can read noble catalog" on public.splendor_noble_catalog;
create policy "splendor approved members can read noble catalog"
on public.splendor_noble_catalog for select to authenticated using (private.is_approved_member());

drop policy if exists "splendor game members can read games" on public.splendor_games;
create policy "splendor game members can read games"
on public.splendor_games for select to authenticated using (private.splendor_is_room_member(room_id));

drop policy if exists "splendor game members can read game players" on public.splendor_game_players;
create policy "splendor game members can read game players"
on public.splendor_game_players for select to authenticated using (private.splendor_is_game_member(game_id));

drop policy if exists "splendor no direct game card reads" on public.splendor_game_cards;
create policy "splendor no direct game card reads"
on public.splendor_game_cards for select to authenticated using (false);

drop policy if exists "splendor game members can read game nobles" on public.splendor_game_nobles;
create policy "splendor game members can read game nobles"
on public.splendor_game_nobles for select to authenticated using (private.splendor_is_game_member(game_id));

insert into public.splendor_rulesets(ruleset_key, display_name, status, target_score, max_tokens, max_reserved)
values ('splendor-test-v1', 'Splendor Test Ruleset v1', 'test', 15, 10, 3)
on conflict (ruleset_key) do update set
  display_name=excluded.display_name, status=excluded.status, target_score=excluded.target_score,
  max_tokens=excluded.max_tokens, max_reserved=excluded.max_reserved;

insert into public.splendor_card_catalog(ruleset_key,card_key,tier,bonus_color,prestige,cost,title,image_path)
values
('splendor-test-v1','test-t1-01',1,'white',0,'{"blue":1,"green":1,"red":1,"black":1}','진주 채굴장',null),
('splendor-test-v1','test-t1-02',1,'blue',0,'{"white":1,"green":2,"black":1}','사파이어 시장',null),
('splendor-test-v1','test-t1-03',1,'green',0,'{"white":2,"blue":1,"red":1}','에메랄드 공방',null),
('splendor-test-v1','test-t1-04',1,'red',0,'{"blue":2,"green":1,"black":1}','루비 세공소',null),
('splendor-test-v1','test-t1-05',1,'black',0,'{"white":1,"green":1,"red":2}','흑요석 상점',null),
('splendor-test-v1','test-t1-06',1,'white',1,'{"blue":4}','백석 교역소',null),
('splendor-test-v1','test-t1-07',1,'blue',1,'{"green":4}','청옥 교역소',null),
('splendor-test-v1','test-t1-08',1,'green',1,'{"red":4}','녹옥 교역소',null),
('splendor-test-v1','test-t1-09',1,'red',1,'{"black":4}','홍옥 교역소',null),
('splendor-test-v1','test-t1-10',1,'black',1,'{"white":4}','암석 교역소',null),
('splendor-test-v1','test-t2-01',2,'white',1,'{"blue":2,"green":3,"red":2}','왕실 진주 공방',null),
('splendor-test-v1','test-t2-02',2,'blue',1,'{"white":2,"green":2,"black":3}','대운하 상단',null),
('splendor-test-v1','test-t2-03',2,'green',1,'{"white":3,"red":2,"black":2}','숲길 보석상',null),
('splendor-test-v1','test-t2-04',2,'red',1,'{"blue":3,"green":2,"black":2}','붉은 궁정 시장',null),
('splendor-test-v1','test-t2-05',2,'black',1,'{"white":2,"blue":2,"red":3}','야간 대상단',null),
('splendor-test-v1','test-t2-06',2,'white',2,'{"blue":5,"black":2}','백금 세공관',null),
('splendor-test-v1','test-t2-07',2,'blue',2,'{"green":5,"white":2}','푸른 항구',null),
('splendor-test-v1','test-t2-08',2,'green',2,'{"red":5,"blue":2}','왕립 정원 공방',null),
('splendor-test-v1','test-t2-09',2,'red',2,'{"black":5,"green":2}','홍옥 회관',null),
('splendor-test-v1','test-t2-10',2,'black',2,'{"white":5,"red":2}','흑단 상인회',null),
('splendor-test-v1','test-t3-01',3,'white',3,'{"blue":3,"green":3,"red":3,"black":3}','진주 궁전',null),
('splendor-test-v1','test-t3-02',3,'blue',3,'{"white":3,"green":3,"red":3,"black":3}','사파이어 궁전',null),
('splendor-test-v1','test-t3-03',3,'green',3,'{"white":3,"blue":3,"red":3,"black":3}','에메랄드 궁전',null),
('splendor-test-v1','test-t3-04',3,'red',3,'{"white":3,"blue":3,"green":3,"black":3}','루비 궁전',null),
('splendor-test-v1','test-t3-05',3,'black',3,'{"white":3,"blue":3,"green":3,"red":3}','흑요석 궁전',null),
('splendor-test-v1','test-t3-06',3,'white',4,'{"blue":7,"black":3}','왕실 보석 금고',null),
('splendor-test-v1','test-t3-07',3,'blue',4,'{"green":7,"white":3}','대양 교역 궁전',null),
('splendor-test-v1','test-t3-08',3,'green',4,'{"red":7,"blue":3}','비취 왕궁',null),
('splendor-test-v1','test-t3-09',3,'red',4,'{"black":7,"green":3}','붉은 왕실 회관',null),
('splendor-test-v1','test-t3-10',3,'black',4,'{"white":7,"red":3}','검은 왕관 금고',null)
on conflict (ruleset_key,card_key) do update set
 tier=excluded.tier,bonus_color=excluded.bonus_color,prestige=excluded.prestige,cost=excluded.cost,title=excluded.title,image_path=excluded.image_path;

insert into public.splendor_noble_catalog(ruleset_key,noble_key,prestige,requirements,title,image_path)
values
('splendor-test-v1','test-noble-01',3,'{"white":4,"blue":4,"black":4}','북부의 공작',null),
('splendor-test-v1','test-noble-02',3,'{"green":3,"red":3,"black":3}','남부의 후작',null),
('splendor-test-v1','test-noble-03',3,'{"white":4,"green":4,"red":4}','왕실 재무관',null),
('splendor-test-v1','test-noble-04',3,'{"blue":3,"green":3,"black":3}','대항구의 백작',null),
('splendor-test-v1','test-noble-05',3,'{"white":3,"blue":3,"red":3}','보석 길드장',null),
('splendor-test-v1','test-noble-06',3,'{"blue":4,"red":4,"black":4}','왕실 외교관',null)
on conflict (ruleset_key,noble_key) do update set prestige=excluded.prestige,requirements=excluded.requirements,title=excluded.title,image_path=excluded.image_path;

create or replace function private.splendor_game_snapshot(p_game_id uuid)
returns jsonb language plpgsql stable security definer set search_path=''
as $$
declare v_result jsonb;
begin
  if not private.splendor_is_game_member(p_game_id) then return null; end if;
  select jsonb_build_object(
    'game',jsonb_build_object('id',g.id,'room_id',g.room_id,'room_code',r.room_code,'ruleset_key',g.ruleset_key,'status',g.status,'version',g.version,'turn_no',g.turn_no,'starting_player_seat',g.starting_player_seat,'current_turn_seat',g.current_turn_seat,'bank_tokens',g.bank_tokens,'target_score',g.target_score,'max_tokens',g.max_tokens,'max_reserved',g.max_reserved,'started_at',g.started_at),
    'players',coalesce((select jsonb_agg(jsonb_build_object('id',gp.id,'user_id',gp.user_id,'nickname',gp.nickname,'seat',gp.seat,'score',gp.score,'tokens',gp.tokens,'bonuses',gp.bonuses,'purchased_card_count',gp.purchased_card_count,'reserved_card_count',gp.reserved_card_count,'is_current_turn',gp.seat=g.current_turn_seat) order by gp.seat) from public.splendor_game_players gp where gp.game_id=g.id and gp.status='active'),'[]'::jsonb),
    'self',(select jsonb_build_object('id',gp.id,'user_id',gp.user_id,'nickname',gp.nickname,'seat',gp.seat,'score',gp.score,'tokens',gp.tokens,'bonuses',gp.bonuses,'purchased_card_count',gp.purchased_card_count,'reserved_card_count',gp.reserved_card_count,'is_current_turn',gp.seat=g.current_turn_seat) from public.splendor_game_players gp where gp.game_id=g.id and gp.user_id=(select auth.uid()) limit 1),
    'cards',coalesce((select jsonb_agg(jsonb_build_object('instance_id',gc.id,'card_key',cc.card_key,'tier',cc.tier,'slot',gc.face_up_slot,'bonus',cc.bonus_color,'prestige',cc.prestige,'cost',cc.cost,'title',cc.title,'image_path',cc.image_path) order by cc.tier desc,gc.face_up_slot) from public.splendor_game_cards gc join public.splendor_card_catalog cc on cc.id=gc.catalog_card_id where gc.game_id=g.id and gc.location='face_up'),'[]'::jsonb),
    'decks',jsonb_build_object('1',(select count(*) from public.splendor_game_cards gc where gc.game_id=g.id and gc.tier=1 and gc.location='deck'),'2',(select count(*) from public.splendor_game_cards gc where gc.game_id=g.id and gc.tier=2 and gc.location='deck'),'3',(select count(*) from public.splendor_game_cards gc where gc.game_id=g.id and gc.tier=3 and gc.location='deck')),
    'nobles',coalesce((select jsonb_agg(jsonb_build_object('instance_id',gn.id,'noble_key',nc.noble_key,'prestige',nc.prestige,'requirements',nc.requirements,'title',nc.title,'image_path',nc.image_path,'display_order',gn.display_order,'status',gn.status) order by gn.display_order) from public.splendor_game_nobles gn join public.splendor_noble_catalog nc on nc.id=gn.catalog_noble_id where gn.game_id=g.id),'[]'::jsonb)
  ) into v_result
  from public.splendor_games g join public.splendor_rooms r on r.id=g.room_id
  where g.id=p_game_id;
  return v_result;
end; $$;

revoke all on function private.splendor_game_snapshot(uuid) from public,anon,authenticated;

create or replace function public.splendor_get_game_snapshot(p_room_id uuid)
returns jsonb language plpgsql stable security definer set search_path=''
as $$
declare v_game_id uuid;
begin
  if (select auth.uid()) is null or not private.is_approved_member() then raise exception 'AUTH_REQUIRED' using errcode='P0001'; end if;
  if not private.splendor_is_room_member(p_room_id) then raise exception 'PLAYER_NOT_MEMBER' using errcode='P0001'; end if;
  select id into v_game_id from public.splendor_games where room_id=p_room_id limit 1;
  if v_game_id is null then raise exception 'GAME_NOT_STARTED' using errcode='P0001'; end if;
  return private.splendor_game_snapshot(v_game_id);
end; $$;

create or replace function public.splendor_start_game(p_room_id uuid,p_expected_version bigint)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare
  v_user_id uuid := (select auth.uid()); v_room public.splendor_rooms%rowtype; v_ruleset public.splendor_rulesets%rowtype;
  v_player_count integer; v_all_ready boolean; v_starting_seat smallint; v_game_id uuid; v_normal_tokens integer;
  v_tier1_count integer; v_tier2_count integer; v_tier3_count integer; v_noble_count integer;
begin
  if v_user_id is null or not private.is_approved_member() then raise exception 'AUTH_REQUIRED' using errcode='P0001'; end if;
  select * into v_room from public.splendor_rooms where id=p_room_id for update;
  if not found or v_room.expires_at<=now() or v_room.status='closed' then raise exception 'ROOM_NOT_FOUND' using errcode='P0001'; end if;
  if v_room.version<>p_expected_version then raise exception 'STATE_CHANGED' using errcode='P0001'; end if;
  if v_room.status<>'waiting' then raise exception 'ROOM_ALREADY_STARTED' using errcode='P0001'; end if;
  if v_room.host_user_id<>v_user_id then raise exception 'HOST_ONLY' using errcode='P0001'; end if;
  if not private.splendor_is_room_member(p_room_id) then raise exception 'PLAYER_NOT_MEMBER' using errcode='P0001'; end if;
  if exists(select 1 from public.splendor_games where room_id=p_room_id) then raise exception 'GAME_ALREADY_EXISTS' using errcode='P0001'; end if;
  select count(*)::integer,coalesce(bool_and(is_ready),false) into v_player_count,v_all_ready from public.splendor_room_players where room_id=p_room_id and membership_status='active';
  if v_player_count not between 2 and v_room.max_players then raise exception 'INVALID_PLAYER_COUNT' using errcode='P0001'; end if;
  if not v_all_ready then raise exception 'PLAYERS_NOT_READY' using errcode='P0001'; end if;
  select * into v_ruleset from public.splendor_rulesets where ruleset_key=v_room.ruleset_key and status in ('test','active');
  if not found then raise exception 'RULESET_NOT_FOUND' using errcode='P0001'; end if;
  select count(*) filter(where tier=1),count(*) filter(where tier=2),count(*) filter(where tier=3) into v_tier1_count,v_tier2_count,v_tier3_count from public.splendor_card_catalog where ruleset_key=v_room.ruleset_key;
  select count(*) into v_noble_count from public.splendor_noble_catalog where ruleset_key=v_room.ruleset_key;
  if v_tier1_count<4 or v_tier2_count<4 or v_tier3_count<4 or v_noble_count<v_player_count+1 then raise exception 'RULESET_INCOMPLETE' using errcode='P0001'; end if;
  select seat into v_starting_seat from public.splendor_room_players where room_id=p_room_id and membership_status='active' order by random() limit 1;
  v_normal_tokens:=case v_player_count when 2 then 4 when 3 then 5 else 7 end;
  insert into public.splendor_games(room_id,ruleset_key,starting_player_seat,current_turn_seat,bank_tokens,target_score,max_tokens,max_reserved)
  values(p_room_id,v_room.ruleset_key,v_starting_seat,v_starting_seat,jsonb_build_object('white',v_normal_tokens,'blue',v_normal_tokens,'green',v_normal_tokens,'red',v_normal_tokens,'black',v_normal_tokens,'gold',5),v_ruleset.target_score,v_ruleset.max_tokens,v_ruleset.max_reserved)
  returning id into v_game_id;
  insert into public.splendor_game_players(game_id,user_id,nickname,seat)
  select v_game_id,rp.user_id,rp.nickname,rp.seat from public.splendor_room_players rp where rp.room_id=p_room_id and rp.membership_status='active' order by rp.seat;
  insert into public.splendor_game_cards(game_id,catalog_card_id,tier,deck_position,location)
  select v_game_id,cc.id,cc.tier,row_number() over(partition by cc.tier order by random())::integer,'deck' from public.splendor_card_catalog cc where cc.ruleset_key=v_room.ruleset_key;
  update public.splendor_game_cards set location='face_up',face_up_slot=deck_position::smallint where game_id=v_game_id and deck_position<=4;
  with picked as(select nc.id from public.splendor_noble_catalog nc where nc.ruleset_key=v_room.ruleset_key order by random() limit(v_player_count+1)), numbered as(select id,row_number() over()::smallint display_order from picked)
  insert into public.splendor_game_nobles(game_id,catalog_noble_id,display_order) select v_game_id,id,display_order from numbered;
  update public.splendor_rooms set status='playing',version=version+1,updated_at=now(),expires_at=now()+interval '8 hours' where id=p_room_id;
  return private.splendor_game_snapshot(v_game_id);
end; $$;

revoke all on function public.splendor_get_game_snapshot(uuid) from public,anon;
revoke all on function public.splendor_start_game(uuid,bigint) from public,anon;
grant execute on function public.splendor_get_game_snapshot(uuid) to authenticated;
grant execute on function public.splendor_start_game(uuid,bigint) to authenticated;

create or replace function private.splendor_broadcast_game_state_changed()
returns trigger language plpgsql security definer set search_path=''
as $$ begin
  perform realtime.send(jsonb_build_object('room_id',new.room_id,'game_id',new.id,'version',new.version),'state_changed','splendor-room:'||new.room_id::text,true);
  return null;
end; $$;

revoke all on function private.splendor_broadcast_game_state_changed() from public,anon,authenticated;
drop trigger if exists splendor_broadcast_game_state_changed on public.splendor_games;
create trigger splendor_broadcast_game_state_changed after update of version on public.splendor_games
for each row when(new.version is distinct from old.version)
execute function private.splendor_broadcast_game_state_changed();
