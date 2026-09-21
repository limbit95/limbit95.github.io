begin;

create or replace function public.admin_list_category_manager_candidates(
    p_search text default null,
    p_limit integer default 20
)
returns table (
    id uuid,
    display_name text,
    email text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
    v_search text := nullif(btrim(p_search), '');
    v_limit integer := least(greatest(coalesce(p_limit, 20), 1), 50);
    v_can_member_details boolean := private.has_admin_permission('members');
begin
    if not private.has_admin_permission('operations') then
        raise exception '활동 담당자 관리 권한이 없습니다.'
            using errcode = '42501';
    end if;

    return query
    select
        p.id,
        p.display_name,
        case when v_can_member_details then jr.email else null end
    from public.profiles as p
    left join public.join_requests as jr
      on jr.user_id = p.id
    where p.status = 'approved'
      and (
        v_search is null
        or strpos(lower(p.display_name), lower(v_search)) > 0
        or (
          v_can_member_details
          and strpos(lower(coalesce(jr.email, '')), lower(v_search)) > 0
        )
      )
    order by lower(p.display_name), p.id
    limit v_limit;
end;
$$;

revoke all on function public.admin_list_category_manager_candidates(text, integer)
    from public, anon, authenticated;
grant execute on function public.admin_list_category_manager_candidates(text, integer)
    to authenticated;

commit;
