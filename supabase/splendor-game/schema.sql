-- Splendor phase 2: room/lobby schema.

create table if not exists public.splendor_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  host_user_id uuid not null references auth.users(id) on delete restrict,
  status text not null default 'waiting' check (status in ('waiting','playing','finished','closed')),
  max_players smallint not null default 4 check (max_players between 2 and 4),
  ruleset_key text not null default 'splendor-test-v1',
  version bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '8 hours'),
  constraint splendor_rooms_room_code_format check (room_code ~ '^[A-Z0-9]{6}$')
);

create table if not exists public.splendor_room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.splendor_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  seat smallint not null check (seat between 1 and 4),
  is_ready boolean not null default false,
  membership_status text not null default 'active' check (membership_status in ('active','left')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  constraint splendor_room_players_nickname_length check (char_length(btrim(nickname)) between 1 and 20)
);

create unique index if not exists splendor_room_players_active_user_room_uq
  on public.splendor_room_players(room_id, user_id)
  where membership_status = 'active';

create unique index if not exists splendor_room_players_active_seat_uq
  on public.splendor_room_players(room_id, seat)
  where membership_status = 'active';

create unique index if not exists splendor_room_players_one_active_room_per_user_uq
  on public.splendor_room_players(user_id)
  where membership_status = 'active';

create index if not exists splendor_room_players_room_id_idx
  on public.splendor_room_players(room_id);

create index if not exists splendor_rooms_status_expires_idx
  on public.splendor_rooms(status, expires_at);

alter table public.splendor_rooms enable row level security;
alter table public.splendor_room_players enable row level security;

grant select on public.splendor_rooms to authenticated;
grant select on public.splendor_room_players to authenticated;
revoke insert, update, delete on public.splendor_rooms from anon, authenticated;
revoke insert, update, delete on public.splendor_room_players from anon, authenticated;
