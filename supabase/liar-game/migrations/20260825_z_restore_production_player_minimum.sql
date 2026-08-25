-- Restore the production player-count policy after temporary two-player testing.
-- Production requires at least 4 ready participants and at least 2 citizens.

do $$
declare
  v_def text;
begin
  select pg_get_functiondef('public.liar_start_round(uuid,bigint)'::regprocedure)
  into v_def;

  -- Already restored: leave the function unchanged.
  if position('if v_count<4 then' in v_def)>0
     and position('if v_count-v_game.liar_count<2 then' in v_def)>0 then
    return;
  end if;

  if position('if v_count<2 then' in v_def)=0
     or position('if v_count-v_game.liar_count<1 then' in v_def)=0 then
    raise exception 'Unexpected liar_start_round definition; production player minimums were not restored.';
  end if;

  v_def:=replace(v_def,
    'if v_count<2 then',
    'if v_count<4 then');
  v_def:=replace(v_def,
    'if v_count-v_game.liar_count<1 then',
    'if v_count-v_game.liar_count<2 then');
  v_def:=replace(v_def,
    '-- TEMP TEST minimum: 2 ready participants.',
    '-- Production minimum: 4 ready participants.');

  execute v_def;
end $$;
