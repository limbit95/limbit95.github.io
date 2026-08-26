create or replace function public.get_my_participation_overview(
  p_upcoming_limit integer default 20,
  p_history_limit integer default 10,
  p_history_offset integer default 0
)
returns jsonb
language plpgsql
security invoker
set search_path = public, private, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_today date := timezone('Asia/Seoul', now())::date;
  v_upcoming_limit integer := least(greatest(coalesce(p_upcoming_limit, 20), 1), 50);
  v_history_limit integer := least(greatest(coalesce(p_history_limit, 10), 1), 50);
  v_history_offset integer := greatest(coalesce(p_history_offset, 0), 0);
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if not private.is_approved_member() then
    raise exception 'Approved membership required';
  end if;

  with my_participations as (
    select
      ep.event_id,
      ep.status as participation_status,
      ep.joined_at,
      ep.waitlisted_at,
      ep.created_at as participation_created_at,
      e.category_id,
      e.title,
      e.event_date,
      e.start_time,
      e.location_name,
      e.capacity,
      e.registration_deadline,
      e.status as event_status,
      c.name as category_name,
      c.icon as category_icon,
      c.color as category_color
    from public.event_participants ep
    join public.events e on e.id = ep.event_id
    left join public.activity_categories c on c.id = e.category_id
    where ep.user_id = v_user_id
      and ep.status in ('joined', 'waitlisted')
  ),
  classified as (
    select
      mp.*,
      (mp.event_date >= v_today and mp.event_status in ('scheduled', 'closed')) as is_upcoming
    from my_participations mp
  ),
  event_counts as (
    select
      ep.event_id,
      count(*) filter (where ep.status = 'joined')::integer as joined_count,
      count(*) filter (where ep.status = 'waitlisted')::integer as waitlisted_count
    from public.event_participants ep
    where ep.status in ('joined', 'waitlisted')
      and ep.event_id in (select event_id from classified)
    group by ep.event_id
  ),
  upcoming_rows as (
    select
      cl.*,
      coalesce(ec.joined_count, 0) as joined_count,
      coalesce(ec.waitlisted_count, 0) as waitlisted_count
    from classified cl
    left join event_counts ec on ec.event_id = cl.event_id
    where cl.is_upcoming
    order by cl.event_date asc, cl.start_time asc nulls last, cl.event_id asc
    limit v_upcoming_limit
  ),
  history_rows as (
    select cl.*
    from classified cl
    where not cl.is_upcoming
    order by cl.event_date desc, cl.start_time desc nulls last, cl.event_id desc
    offset v_history_offset
    limit v_history_limit
  )
  select jsonb_build_object(
    'summary', jsonb_build_object(
      'upcoming_joined_count', (select count(*) from classified where is_upcoming and participation_status = 'joined'),
      'upcoming_waitlisted_count', (select count(*) from classified where is_upcoming and participation_status = 'waitlisted'),
      'history_count', (select count(*) from classified where not is_upcoming)
    ),
    'upcoming', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'status', ur.participation_status,
          'event', jsonb_build_object(
            'id', ur.event_id,
            'category_id', ur.category_id,
            'title', ur.title,
            'event_date', ur.event_date,
            'start_time', ur.start_time,
            'location_name', ur.location_name,
            'capacity', ur.capacity,
            'registration_deadline', ur.registration_deadline,
            'status', ur.event_status,
            'joined_count', ur.joined_count,
            'waitlisted_count', ur.waitlisted_count,
            'my_participation_status', ur.participation_status,
            'category', jsonb_build_object(
              'id', ur.category_id,
              'name', ur.category_name,
              'icon', ur.category_icon,
              'color', ur.category_color
            )
          )
        )
        order by ur.event_date asc, ur.start_time asc nulls last, ur.event_id asc
      )
      from upcoming_rows ur
    ), '[]'::jsonb),
    'history', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'status', hr.participation_status,
          'event', jsonb_build_object(
            'id', hr.event_id,
            'title', hr.title,
            'event_date', hr.event_date,
            'start_time', hr.start_time,
            'status', hr.event_status
          )
        )
        order by hr.event_date desc, hr.start_time desc nulls last, hr.event_id desc
      )
      from history_rows hr
    ), '[]'::jsonb),
    'history_limit', v_history_limit,
    'history_offset', v_history_offset
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.get_my_participation_overview(integer, integer, integer) from public, anon;
grant execute on function public.get_my_participation_overview(integer, integer, integer) to authenticated;
