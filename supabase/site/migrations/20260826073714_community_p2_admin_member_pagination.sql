begin;

create or replace function public.admin_list_members_page(
    p_search text default null,
    p_limit integer default 20,
    p_offset integer default 0
)
returns table (
    id uuid,
    display_name text,
    role text,
    status text,
    created_at timestamptz,
    email text,
    real_name text,
    church_group text,
    join_request_status text,
    total_count bigint
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
    v_search text := nullif(lower(btrim(coalesce(p_search, ''))), '');
    v_limit integer := least(greatest(coalesce(p_limit, 20), 1), 100);
    v_offset integer := greatest(coalesce(p_offset, 0), 0);
begin
    if not private.is_admin() then
        raise exception '관리자만 회원 목록을 조회할 수 있습니다.'
            using errcode = '42501';
    end if;

    return query
    select
        p.id,
        p.display_name,
        p.role,
        p.status,
        p.created_at,
        j.email,
        j.real_name,
        j.church_group,
        j.status as join_request_status,
        count(*) over() as total_count
    from public.profiles as p
    left join public.join_requests as j
      on j.user_id = p.id
    where v_search is null
       or strpos(lower(p.display_name), v_search) > 0
       or strpos(lower(coalesce(j.real_name, '')), v_search) > 0
       or strpos(lower(coalesce(j.email, '')), v_search) > 0
    order by p.created_at desc, p.id desc
    limit v_limit
    offset v_offset;
end;
$$;

revoke all on function public.admin_list_members_page(text, integer, integer)
    from public, anon, authenticated;
grant execute on function public.admin_list_members_page(text, integer, integer)
    to authenticated;

commit;
