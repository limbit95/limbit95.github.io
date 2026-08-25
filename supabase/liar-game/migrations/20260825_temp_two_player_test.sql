-- TEMPORARY TEST OVERRIDE.
-- Allows a two-player round (1 hidden role + 1 citizen) for Drawing Spy testing.
-- Do not treat this as the production player-count policy.

do $$
declare
  v_def text;
begin
  select pg_get_functiondef('public.liar_start_round(uuid,bigint)'::regprocedure)
  into v_def;

  if position('if v_count<4 then' in v_def)=0
     or position('if v_count-v_game.liar_count<2 then' in v_def)=0 then
    raise exception 'Unexpected liar_start_round definition; temporary test override was not applied.';
  end if;

  v_def:=replace(v_def,
    'if v_count<4 then',
    'if v_count<2 then');
  v_def:=replace(v_def,
    'if v_count-v_game.liar_count<2 then',
    'if v_count-v_game.liar_count<1 then');
  v_def:=replace(v_def,
    '-- Production minimum: 4 ready participants.',
    '-- TEMP TEST minimum: 2 ready participants.');

  execute v_def;
end $$;
