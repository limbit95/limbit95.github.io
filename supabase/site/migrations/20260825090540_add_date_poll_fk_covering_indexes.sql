create index if not exists date_poll_votes_option_poll_idx
  on public.date_poll_votes(option_id, poll_id);

create index if not exists date_polls_selected_option_poll_idx
  on public.date_polls(selected_option_id, id);
