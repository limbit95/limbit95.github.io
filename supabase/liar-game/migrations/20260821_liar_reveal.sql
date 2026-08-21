begin;

alter table public.liar_rounds
  drop constraint if exists liar_rounds_status_check;

alter table public.liar_rounds
  add constraint liar_rounds_status_check check (status in (
    'ROLE_REVEAL', 'SPEAKING', 'DISCUSSION', 'VOTING', 'VOTE_RESULT',
    'RUNOFF_VOTING', 'LIAR_REVEAL', 'LIAR_GUESS', 'ROUND_RESULT', 'FORCE_ENDED'
  ));

commit;
