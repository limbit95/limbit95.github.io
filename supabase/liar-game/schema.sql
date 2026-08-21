-- Liar Game phase 1 schema for PostgreSQL / Supabase.
-- Execution order: run this file once, then run seed.sql. Later migrations add
-- business RPCs, RLS policies, grants, and Realtime publication configuration.
-- This migration is non-destructive: it intentionally contains no DROP or DELETE.

create extension if not exists pgcrypto;

-- Independent roots are created first. Circular room pointers are added after
-- all referenced tables exist.
create table public.liar_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code varchar(6) not null,
  status text not null default 'active',
  host_player_id uuid,
  current_game_id uuid,
  current_round_id uuid,
  last_activity_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours'),
  expired_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version bigint not null default 0,
  constraint liar_rooms_room_code_key unique (room_code),
  constraint liar_rooms_room_code_format_check check (room_code ~ '^[A-Z0-9]{6}$'),
  constraint liar_rooms_status_check check (status in ('active', 'expired')),
  constraint liar_rooms_version_check check (version >= 0)
);

create table public.liar_words (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  word varchar(100) not null,
  normalized_word varchar(100) not null,
  difficulty text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint liar_words_category_normalized_word_key unique (category, normalized_word),
  constraint liar_words_category_check check (category in ('음식', '장소', '직업', '동물', '물건', '인물', '기타')),
  constraint liar_words_word_check check (char_length(btrim(word)) between 1 and 100),
  constraint liar_words_normalized_word_check check (char_length(normalized_word) between 1 and 100),
  constraint liar_words_difficulty_check check (difficulty in ('easy', 'normal', 'hard'))
);

create table public.liar_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null,
  auth_user_id uuid not null,
  player_key uuid not null,
  nickname varchar(20) not null,
  ready boolean not null default false,
  membership_status text not null default 'active',
  joined_during_round_id uuid,
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  left_at timestamptz,
  constraint liar_players_room_player_key_key unique (room_id, player_key),
  constraint liar_players_room_auth_user_key unique (room_id, auth_user_id),
  constraint liar_players_nickname_check check (char_length(btrim(nickname)) between 1 and 20),
  constraint liar_players_membership_status_check check (membership_status in ('active', 'left')),
  constraint liar_players_room_id_fkey foreign key (room_id) references public.liar_rooms(id) on delete cascade,
  constraint liar_players_auth_user_id_fkey foreign key (auth_user_id) references auth.users(id) on delete cascade
);

create table public.liar_games (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null,
  game_no integer not null,
  status text not null default 'setup',
  selected_categories text[] not null,
  difficulty text not null default 'all',
  liar_count smallint not null default 1,
  guess_limit smallint not null default 1,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint liar_games_room_game_no_key unique (room_id, game_no),
  constraint liar_games_room_id_fkey foreign key (room_id) references public.liar_rooms(id) on delete cascade,
  constraint liar_games_game_no_check check (game_no >= 1),
  constraint liar_games_status_check check (status in ('setup', 'active', 'finished', 'force_ended')),
  constraint liar_games_selected_categories_check check (
    cardinality(selected_categories) >= 1
    and array_position(selected_categories, null) is null
    and selected_categories <@ array['음식', '장소', '직업', '동물', '물건', '인물', '기타']::text[]
  ),
  constraint liar_games_difficulty_check check (difficulty in ('all', 'easy', 'normal', 'hard')),
  constraint liar_games_liar_count_check check (liar_count between 1 and 3),
  constraint liar_games_guess_limit_check check (guess_limit between 1 and 3)
);

create table public.liar_rounds (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null,
  room_id uuid not null,
  round_no integer not null,
  status text not null,
  word_id uuid not null,
  category_snapshot text not null,
  word_snapshot text not null,
  current_speaker_index smallint,
  winner text,
  capture_succeeded boolean,
  current_vote_stage smallint not null default 0,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  force_ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version bigint not null default 0,
  constraint liar_rounds_game_round_no_key unique (game_id, round_no),
  constraint liar_rounds_game_id_fkey foreign key (game_id) references public.liar_games(id) on delete cascade,
  constraint liar_rounds_room_id_fkey foreign key (room_id) references public.liar_rooms(id) on delete cascade,
  constraint liar_rounds_word_id_fkey foreign key (word_id) references public.liar_words(id) on delete restrict,
  constraint liar_rounds_round_no_check check (round_no >= 1),
  constraint liar_rounds_status_check check (status in (
    'ROLE_REVEAL', 'SPEAKING', 'DISCUSSION', 'VOTING', 'VOTE_RESULT',
    'RUNOFF_VOTING', 'LIAR_REVEAL', 'LIAR_GUESS', 'ROUND_RESULT', 'FORCE_ENDED'
  )),
  constraint liar_rounds_category_snapshot_check check (category_snapshot in ('음식', '장소', '직업', '동물', '물건', '인물', '기타')),
  constraint liar_rounds_word_snapshot_check check (char_length(btrim(word_snapshot)) between 1 and 100),
  constraint liar_rounds_current_speaker_index_check check (current_speaker_index is null or current_speaker_index >= 0),
  constraint liar_rounds_winner_check check (winner is null or winner in ('citizen', 'liar')),
  constraint liar_rounds_current_vote_stage_check check (current_vote_stage >= 0),
  constraint liar_rounds_version_check check (version >= 0)
);

-- Add the deferred circular references only after players, games, and rounds exist.
alter table public.liar_rooms
  add constraint liar_rooms_host_player_id_fkey foreign key (host_player_id) references public.liar_players(id) on delete set null,
  add constraint liar_rooms_current_game_id_fkey foreign key (current_game_id) references public.liar_games(id) on delete set null,
  add constraint liar_rooms_current_round_id_fkey foreign key (current_round_id) references public.liar_rounds(id) on delete set null;

alter table public.liar_players
  add constraint liar_players_joined_during_round_id_fkey foreign key (joined_during_round_id) references public.liar_rounds(id) on delete set null;

create table public.liar_round_players (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null,
  player_id uuid,
  nickname_snapshot varchar(20) not null,
  role text not null,
  role_checked_at timestamptz,
  turn_order smallint not null,
  is_final_suspect boolean not null default false,
  created_at timestamptz not null default now(),
  constraint liar_round_players_round_player_key unique (round_id, player_id),
  constraint liar_round_players_round_turn_order_key unique (round_id, turn_order),
  constraint liar_round_players_round_id_fkey foreign key (round_id) references public.liar_rounds(id) on delete cascade,
  constraint liar_round_players_player_id_fkey foreign key (player_id) references public.liar_players(id) on delete set null,
  constraint liar_round_players_nickname_snapshot_check check (char_length(btrim(nickname_snapshot)) between 1 and 20),
  constraint liar_round_players_role_check check (role in ('citizen', 'liar')),
  constraint liar_round_players_turn_order_check check (turn_order >= 0)
);

-- PostgreSQL UNIQUE treats NULL values as distinct. If player_id later becomes
-- NULL through ON DELETE SET NULL, multiple historical snapshots remain valid;
-- turn_order still uniquely identifies each participant within the round.

create table public.liar_vote_stages (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null,
  stage_no smallint not null,
  kind text not null,
  seats_to_fill smallint not null,
  candidate_round_player_ids uuid[] not null,
  locked_winner_round_player_ids uuid[] not null default array[]::uuid[],
  status text not null default 'open',
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  constraint liar_vote_stages_round_stage_no_key unique (round_id, stage_no),
  constraint liar_vote_stages_round_id_fkey foreign key (round_id) references public.liar_rounds(id) on delete cascade,
  constraint liar_vote_stages_stage_no_check check (stage_no >= 1),
  constraint liar_vote_stages_kind_check check (kind in ('original', 'runoff')),
  constraint liar_vote_stages_seats_to_fill_check check (seats_to_fill >= 1),
  constraint liar_vote_stages_candidate_ids_check check (cardinality(candidate_round_player_ids) >= 1 and array_position(candidate_round_player_ids, null) is null),
  constraint liar_vote_stages_locked_ids_check check (array_position(locked_winner_round_player_ids, null) is null),
  constraint liar_vote_stages_status_check check (status in ('open', 'closed'))
);

-- PostgreSQL cannot attach ordinary foreign keys to UUID array elements. A
-- later RPC migration must verify that candidate/locked IDs belong to this round.

create table public.liar_ballots (
  id uuid primary key default gen_random_uuid(),
  vote_stage_id uuid not null,
  voter_round_player_id uuid not null,
  revision integer not null default 1,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint liar_ballots_stage_voter_key unique (vote_stage_id, voter_round_player_id),
  constraint liar_ballots_vote_stage_id_fkey foreign key (vote_stage_id) references public.liar_vote_stages(id) on delete cascade,
  constraint liar_ballots_voter_round_player_id_fkey foreign key (voter_round_player_id) references public.liar_round_players(id) on delete cascade,
  constraint liar_ballots_revision_check check (revision >= 1)
);

create table public.liar_votes (
  id uuid primary key default gen_random_uuid(),
  ballot_id uuid not null,
  target_round_player_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint liar_votes_ballot_target_key unique (ballot_id, target_round_player_id),
  constraint liar_votes_ballot_id_fkey foreign key (ballot_id) references public.liar_ballots(id) on delete cascade,
  constraint liar_votes_target_round_player_id_fkey foreign key (target_round_player_id) references public.liar_round_players(id) on delete cascade
);

-- Voter/target round consistency, candidate eligibility, selection count, and
-- self-vote prevention are deliberately deferred to the future submit_ballot RPC.

create table public.liar_guesses (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null,
  guesser_round_player_id uuid not null,
  attempt_no smallint not null,
  guess_text text not null,
  normalized_guess text not null,
  is_correct boolean not null,
  created_at timestamptz not null default now(),
  constraint liar_guesses_round_attempt_no_key unique (round_id, attempt_no),
  constraint liar_guesses_round_id_fkey foreign key (round_id) references public.liar_rounds(id) on delete cascade,
  constraint liar_guesses_guesser_round_player_id_fkey foreign key (guesser_round_player_id) references public.liar_round_players(id) on delete cascade,
  constraint liar_guesses_attempt_no_check check (attempt_no between 1 and 3),
  constraint liar_guesses_guess_text_check check (char_length(btrim(guess_text)) between 1 and 100),
  constraint liar_guesses_normalized_guess_check check (char_length(normalized_guess) between 1 and 100)
);

-- attempt_no is shared by the entire round, not counted per liar. The UNIQUE
-- constraint above protects the shared multi-liar guess limit from races.

-- Lookup and lifecycle indexes.
create index liar_rooms_status_expires_at_idx on public.liar_rooms (status, expires_at);
create index liar_rooms_last_activity_at_idx on public.liar_rooms (last_activity_at);
create index liar_players_room_membership_status_idx on public.liar_players (room_id, membership_status);
create index liar_players_auth_membership_status_idx on public.liar_players (auth_user_id, membership_status);
create index liar_players_player_key_idx on public.liar_players (player_key);
create unique index liar_players_one_active_membership_idx on public.liar_players (auth_user_id) where membership_status = 'active';
create index liar_games_room_status_idx on public.liar_games (room_id, status);
create unique index liar_games_one_open_per_room_idx on public.liar_games (room_id) where status in ('setup', 'active');
create index liar_rounds_room_status_idx on public.liar_rounds (room_id, status);
create index liar_rounds_game_created_at_idx on public.liar_rounds (game_id, created_at desc);
create unique index liar_rounds_one_in_progress_per_game_idx on public.liar_rounds (game_id) where status in (
  'ROLE_REVEAL', 'SPEAKING', 'DISCUSSION', 'VOTING', 'VOTE_RESULT', 'RUNOFF_VOTING', 'LIAR_REVEAL', 'LIAR_GUESS'
);
create index liar_round_players_round_role_idx on public.liar_round_players (round_id, role);
create index liar_round_players_player_round_idx on public.liar_round_players (player_id, round_id);
create index liar_round_players_final_suspect_idx on public.liar_round_players (round_id) where is_final_suspect;
create index liar_votes_target_ballot_idx on public.liar_votes (target_round_player_id, ballot_id);
create index liar_guesses_round_created_at_idx on public.liar_guesses (round_id, created_at);
create index liar_words_enabled_category_difficulty_idx on public.liar_words (category, difficulty) where enabled = true;

-- Timestamp-only helper; no game business logic is implemented here.
create or replace function public.liar_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger liar_rooms_set_updated_at before update on public.liar_rooms for each row execute function public.liar_set_updated_at();
create trigger liar_players_set_updated_at before update on public.liar_players for each row execute function public.liar_set_updated_at();
create trigger liar_games_set_updated_at before update on public.liar_games for each row execute function public.liar_set_updated_at();
create trigger liar_rounds_set_updated_at before update on public.liar_rounds for each row execute function public.liar_set_updated_at();
create trigger liar_ballots_set_updated_at before update on public.liar_ballots for each row execute function public.liar_set_updated_at();
create trigger liar_votes_set_updated_at before update on public.liar_votes for each row execute function public.liar_set_updated_at();
create trigger liar_words_set_updated_at before update on public.liar_words for each row execute function public.liar_set_updated_at();

-- RLS is enabled now, but no policies are intentionally defined in phase 1.
-- Consequently frontend direct access is denied until the later RLS/RPC migration.
alter table public.liar_rooms enable row level security;
alter table public.liar_players enable row level security;
alter table public.liar_games enable row level security;
alter table public.liar_rounds enable row level security;
alter table public.liar_round_players enable row level security;
alter table public.liar_vote_stages enable row level security;
alter table public.liar_ballots enable row level security;
alter table public.liar_votes enable row level security;
alter table public.liar_guesses enable row level security;
alter table public.liar_words enable row level security;

-- Intentionally absent: business RPCs, RLS policies/grants, service-role code,
-- and ALTER PUBLICATION / any other Realtime publication configuration.
