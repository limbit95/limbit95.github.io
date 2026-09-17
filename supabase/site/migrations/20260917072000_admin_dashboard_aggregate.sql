begin;

create or replace function public.get_admin_dashboard_stats(p_from_date date)
returns table (
    pending_join_requests bigint,
    approved_members bigint,
    suspended_members bigint,
    total_accounts bigint,
    admin_accounts bigint,
    upcoming_events bigint,
    upcoming_scheduled_events bigint,
    active_categories bigint,
    category_manager_assignments bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
    v_can_members boolean := private.has_admin_permission('members');
    v_can_operations boolean := private.has_admin_permission('operations');
    v_can_content boolean := private.has_admin_permission('content');
begin
    return query
    select
        case when v_can_members then (
            select count(*)
            from public.join_requests as jr
            where jr.status in ('pending', 'held')
        ) else 0::bigint end,
        case when v_can_members then (
            select count(*)
            from public.profiles as p
            where p.status = 'approved'
        ) else 0::bigint end,
        case when v_can_members then (
            select count(*)
            from public.profiles as p
            where p.status = 'suspended'
        ) else 0::bigint end,
        case when v_can_members then (
            select count(*)
            from public.profiles
        ) else 0::bigint end,
        case when v_can_members then (
            select count(*)
            from public.profiles as p
            where p.role = 'admin'
        ) else 0::bigint end,
        case when v_can_operations then (
            select count(*)
            from public.events as e
            where e.event_date >= p_from_date
        ) else 0::bigint end,
        case when v_can_operations then (
            select count(*)
            from public.events as e
            where e.event_date >= p_from_date
              and e.status = 'scheduled'
        ) else 0::bigint end,
        case when v_can_content then (
            select count(*)
            from public.activity_categories as c
            where c.is_active = true
        ) else 0::bigint end,
        case when v_can_operations then (
            select count(*)
            from public.category_managers
        ) else 0::bigint end;
end;
$$;

revoke all on function public.get_admin_dashboard_stats(date)
    from public, anon, authenticated;
grant execute on function public.get_admin_dashboard_stats(date)
    to authenticated;

commit;
