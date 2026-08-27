-- Phase 4 follow-up: support FK lookups/cascades for action-log users.
create index if not exists splendor_action_log_user_id_idx
  on public.splendor_action_log(user_id);
