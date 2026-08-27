-- Liar Game / Drawing Spy v1.0.0 canonical verification.
-- Read-only. Run after installing the canonical baseline on a fresh Supabase project.

with
expected_tables(name) as (
  values
    ('liar_rooms'),('liar_players'),('liar_games'),('liar_rounds'),('liar_round_players'),
    ('liar_vote_stages'),('liar_ballots'),('liar_votes'),('liar_guesses'),('liar_words'),
    ('liar_drawing_strokes')
),
table_state as (
  select
    count(*) filter (where c.oid is not null)::int as existing_tables,
    count(*) filter (where c.relrowsecurity)::int as rls_tables,
    count(*) filter (where c.oid is not null and not has_table_privilege('authenticated',format('public.%I',e.name),'SELECT'))::int as auth_select_blocked,
    count(*) filter (where c.oid is not null and not has_table_privilege('authenticated',format('public.%I',e.name),'INSERT,UPDATE,DELETE'))::int as auth_write_blocked,
    count(*) filter (where c.oid is not null and not has_table_privilege('anon',format('public.%I',e.name),'SELECT,INSERT,UPDATE,DELETE'))::int as anon_blocked
  from expected_tables e
  left join pg_class c on c.oid=to_regclass(format('public.%I',e.name))
),
word_state as (
  select
    count(*) filter(where enabled)::int as active_words,
    count(distinct category) filter(where enabled)::int as active_categories,
    count(*) filter(where enabled and category in ('게임','영화드라마'))::int as active_retired_words,
    count(*) filter(where enabled and normalized_word<>public.liar_normalize_guess_text(word))::int as bad_normalized_words
  from public.liar_words
),
schema_state as (
  select jsonb_build_object(
    'drawing_stage_no',exists(select 1 from information_schema.columns where table_schema='public' and table_name='liar_drawing_strokes' and column_name='drawing_stage_no'),
    'word_aliases',exists(select 1 from information_schema.columns where table_schema='public' and table_name='liar_words' and column_name='aliases'),
    'game_mode',exists(select 1 from information_schema.columns where table_schema='public' and table_name='liar_games' and column_name='game_mode'),
    'drawing_unlimited',exists(select 1 from information_schema.columns where table_schema='public' and table_name='liar_games' and column_name='drawing_stroke_unlimited'),
    'speaking_timer',exists(select 1 from information_schema.columns where table_schema='public' and table_name='liar_games' and column_name='speaking_time_limit'),
    'discussion_timer',exists(select 1 from information_schema.columns where table_schema='public' and table_name='liar_games' and column_name='discussion_time_limit'),
    'liars_know_each_other',exists(select 1 from information_schema.columns where table_schema='public' and table_name='liar_games' and column_name='liars_know_each_other')
  ) as value
),
function_state as (
  select jsonb_build_object(
    'room_snapshot',to_regprocedure('public.liar_get_room_snapshot(uuid)') is not null,
    'round_result',to_regprocedure('public.liar_get_round_result(uuid)') is not null,
    'game_stats',to_regprocedure('public.liar_get_game_stats(uuid)') is not null,
    'drawing_submit',to_regprocedure('public.liar_submit_drawing_stroke(uuid,jsonb,bigint)') is not null,
    'settings_v1_auth',has_function_privilege('authenticated','public.liar_update_game_settings(uuid,text[],text,integer,integer,boolean,bigint)','EXECUTE'),
    'settings_v2_auth',has_function_privilege('authenticated','public.liar_update_game_settings_v2(uuid,text[],text,integer,integer,boolean,text,integer,integer,bigint)','EXECUTE'),
    'settings_v3_auth',has_function_privilege('authenticated','public.liar_update_game_settings_v3(uuid,text[],text,integer,integer,boolean,text,integer,integer,boolean,bigint)','EXECUTE'),
    'settings_v4_auth',has_function_privilege('authenticated','public.liar_update_game_settings_v4(uuid,text[],text,integer,integer,boolean,text,integer,integer,boolean,integer,integer,boolean,bigint)','EXECUTE'),
    'settings_v4_anon',has_function_privilege('anon','public.liar_update_game_settings_v4(uuid,text[],text,integer,integer,boolean,text,integer,integer,boolean,integer,integer,boolean,bigint)','EXECUTE')
  ) as value
),
production_limits as (
  select jsonb_build_object(
    'min_ready_4',position('if v_count<4 then' in pg_get_functiondef('public.liar_start_round(uuid,bigint)'::regprocedure))>0,
    'min_citizens_2',position('if v_count-v_game.liar_count<2 then' in pg_get_functiondef('public.liar_start_round(uuid,bigint)'::regprocedure))>0
  ) as value
),
realtime_state as (
  select jsonb_build_object(
    'receive_policy',exists(select 1 from pg_policies where schemaname='realtime' and tablename='messages' and policyname='liar active room members can receive broadcasts'),
    'send_policy',exists(select 1 from pg_policies where schemaname='realtime' and tablename='messages' and policyname='liar active room members can send broadcasts'),
    'discussion_receive_helper',to_regprocedure('public.liar_can_receive_discussion_chat_topic(text)') is not null,
    'discussion_send_helper',to_regprocedure('public.liar_can_send_discussion_chat_topic(text)') is not null,
    'drawing_receive_helper',to_regprocedure('public.liar_can_receive_drawing_topic(text)') is not null,
    'drawing_send_helper',to_regprocedure('public.liar_can_send_drawing_topic(text)') is not null
  ) as value
),
integrity as (
  select jsonb_build_object(
    'room_game_pointer_mismatch',(select count(*) from public.liar_rooms r join public.liar_games g on g.id=r.current_game_id where g.room_id<>r.id),
    'room_round_pointer_mismatch',(select count(*) from public.liar_rooms r join public.liar_rounds rd on rd.id=r.current_round_id where rd.room_id<>r.id),
    'round_game_room_mismatch',(select count(*) from public.liar_rounds rd join public.liar_games g on g.id=rd.game_id where rd.room_id<>g.room_id),
    'duplicate_turn_order',(select count(*) from (select round_id,turn_order from public.liar_round_players group by round_id,turn_order having count(*)>1) x),
    'open_vote_on_finished_round',(select count(*) from public.liar_vote_stages vs join public.liar_rounds rd on rd.id=vs.round_id where rd.finished_at is not null and vs.status='open')
  ) as value
)
select jsonb_pretty(jsonb_build_object(
  'release','1.0.0',
  'pass',
    ts.existing_tables=11 and ts.rls_tables=11 and ts.auth_select_blocked=11 and ts.auth_write_blocked=11 and ts.anon_blocked=11
    and ws.active_words=600 and ws.active_categories=12 and ws.active_retired_words=0 and ws.bad_normalized_words=0
    and (ss.value->>'drawing_stage_no')::boolean and (ss.value->>'word_aliases')::boolean
    and (fs.value->>'room_snapshot')::boolean and (fs.value->>'round_result')::boolean and (fs.value->>'game_stats')::boolean
    and not (fs.value->>'settings_v1_auth')::boolean and not (fs.value->>'settings_v2_auth')::boolean and not (fs.value->>'settings_v3_auth')::boolean
    and (fs.value->>'settings_v4_auth')::boolean and not (fs.value->>'settings_v4_anon')::boolean
    and (pl.value->>'min_ready_4')::boolean and (pl.value->>'min_citizens_2')::boolean
    and (rt.value->>'receive_policy')::boolean and (rt.value->>'send_policy')::boolean,
  'tables',jsonb_build_object(
    'expected',11,'existing',ts.existing_tables,'rls_enabled',ts.rls_tables,
    'authenticated_select_blocked',ts.auth_select_blocked,'authenticated_write_blocked',ts.auth_write_blocked,'anon_blocked',ts.anon_blocked
  ),
  'words',jsonb_build_object(
    'active_words',ws.active_words,'active_categories',ws.active_categories,
    'active_retired_words',ws.active_retired_words,'bad_normalized_words',ws.bad_normalized_words
  ),
  'schema',ss.value,
  'functions',fs.value,
  'production_limits',pl.value,
  'realtime',rt.value,
  'integrity',i.value
)) as liar_game_v1_verification
from table_state ts
cross join word_state ws
cross join schema_state ss
cross join function_state fs
cross join production_limits pl
cross join realtime_state rt
cross join integrity i;
