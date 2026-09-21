begin;

create or replace function public.admin_list_join_requests_page(
    p_status text default 'pending',
    p_limit integer default 20,
    p_offset integer default 0
)
returns table (
    user_id uuid,
    email text,
    real_name text,
    church_group text,
    request_message text,
    status text,
    admin_note text,
    privacy_consent_at timestamptz,
    privacy_policy_version text,
    requested_at timestamptz,
    reviewed_at timestamptz,
    reviewed_by uuid,
    updated_at timestamptz,
    display_name text,
    total_count bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
    v_status text := nullif(btrim(coalesce(p_status, '')), '');
    v_limit integer := least(greatest(coalesce(p_limit, 20), 1), 100);
    v_offset integer := greatest(coalesce(p_offset, 0), 0);
begin
    if not private.has_admin_permission('members') then
        raise exception '가입 신청 관리 권한이 필요합니다.'
            using errcode = '42501';
    end if;

    if v_status is not null
       and v_status not in ('pending', 'held', 'rejected', 'approved') then
        raise exception '가입 신청 상태를 확인해 주세요.'
            using errcode = '22023';
    end if;

    return query
    select
        jr.user_id,
        jr.email,
        jr.real_name,
        jr.church_group,
        jr.request_message,
        jr.status,
        jr.admin_note,
        jr.privacy_consent_at,
        jr.privacy_policy_version,
        jr.requested_at,
        jr.reviewed_at,
        jr.reviewed_by,
        jr.updated_at,
        p.display_name,
        count(*) over() as total_count
    from public.join_requests as jr
    left join public.profiles as p
      on p.id = jr.user_id
    where v_status is null
       or jr.status = v_status
    order by jr.requested_at asc, jr.user_id asc
    limit v_limit
    offset v_offset;
end;
$$;

revoke all on function public.admin_list_join_requests_page(text, integer, integer)
    from public, anon, authenticated;
grant execute on function public.admin_list_join_requests_page(text, integer, integer)
    to authenticated;

commit;
