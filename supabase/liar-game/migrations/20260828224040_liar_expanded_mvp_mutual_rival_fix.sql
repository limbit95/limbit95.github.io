-- Liar Game v1.3 follow-up: "운명의 라이벌" must be a genuinely reciprocal voting relationship.
-- The initial v13 aggregation combined a pair even if votes existed in only one direction.
-- Patch the already-installed v13 function in place; this is a no-op if the reciprocal guard is already present.

do $do$
declare
  v_body text;
  v_fixed text;
  v_old text := 'group by case when voter_id::text<target_id::text then voter_id else target_id end,case when voter_id::text<target_id::text then target_id else voter_id end
  ), best as (';
  v_new text := 'group by case when voter_id::text<target_id::text then voter_id else target_id end,case when voter_id::text<target_id::text then target_id else voter_id end
    having count(*)=2
  ), best as (';
begin
  select p.prosrc into v_body
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public'
    and p.proname='liar_get_game_stats_v13'
    and pg_catalog.pg_get_function_identity_arguments(p.oid)='p_player_key uuid';

  if v_body is null then
    raise exception 'liar_get_game_stats_v13(uuid) not found';
  end if;

  if position('having count(*)=2' in v_body)>0 then
    return;
  end if;

  v_fixed:=replace(v_body,v_old,v_new);
  if v_fixed=v_body then
    raise exception 'mutual rival patch target not found';
  end if;

  execute format(
    'create or replace function public.liar_get_game_stats_v13(p_player_key uuid) returns jsonb language plpgsql stable security definer set search_path to pg_catalog,public as $fn$%s$fn$',
    v_fixed
  );
end
$do$;

revoke all on function public.liar_get_game_stats_v13(uuid) from public, anon;
grant execute on function public.liar_get_game_stats_v13(uuid) to authenticated;
