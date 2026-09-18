alter table public.member_access_state
add column if not exists last_accessed_path text
check (last_accessed_path is null or char_length(last_accessed_path) <= 500);

create or replace function public.touch_my_member_access()
returns timestamptz
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_now timestamptz := now();
begin
  if (select auth.uid()) is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;

  insert into public.member_access_state (user_id, last_accessed_at, last_accessed_path)
  values ((select auth.uid()), v_now, null)
  on conflict (user_id)
  do update set
    last_accessed_at = excluded.last_accessed_at,
    last_accessed_path = null;

  return v_now;
end;
$$;

create or replace function public.touch_my_member_access(p_path text)
returns timestamptz
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_now timestamptz := now();
  v_path text := left(nullif(btrim(coalesce(p_path, '')), ''), 500);
begin
  if (select auth.uid()) is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;

  if v_path is not null and left(v_path, 1) <> '/' then
    v_path := null;
  end if;

  insert into public.member_access_state (user_id, last_accessed_at, last_accessed_path)
  values ((select auth.uid()), v_now, v_path)
  on conflict (user_id)
  do update set
    last_accessed_at = excluded.last_accessed_at,
    last_accessed_path = excluded.last_accessed_path;

  return v_now;
end;
$$;

revoke all on function public.touch_my_member_access() from public;
revoke execute on function public.touch_my_member_access() from anon;
grant execute on function public.touch_my_member_access() to authenticated;

revoke all on function public.touch_my_member_access(text) from public;
revoke execute on function public.touch_my_member_access(text) from anon;
grant execute on function public.touch_my_member_access(text) to authenticated;

drop function public.system_admin_list_member_access(text, text, integer, integer);

create function public.system_admin_list_member_access(
  p_search text default null,
  p_recency text default 'all',
  p_limit integer default 30,
  p_offset integer default 0
)
returns table (
  id uuid,
  display_name text,
  real_name text,
  email text,
  status text,
  role text,
  last_accessed_at timestamptz,
  last_accessed_path text,
  total_count bigint
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  v_search text := nullif(lower(btrim(coalesce(p_search, ''))), '');
  v_recency text := coalesce(nullif(btrim(p_recency), ''), 'all');
  v_limit integer := least(greatest(coalesce(p_limit, 30), 1), 100);
  v_offset integer := greatest(coalesce(p_offset, 0), 0);
begin
  if not private.is_system_admin() then
    raise exception '최고 관리자 권한이 필요합니다.' using errcode = '42501';
  end if;

  if v_recency not in ('all', '24h', '7d', '30d', 'inactive_30d', 'never') then
    raise exception 'INVALID_RECENCY_FILTER' using errcode = '22023';
  end if;

  return query
  select
    p.id,
    p.display_name,
    j.real_name,
    j.email,
    p.status,
    p.role,
    a.last_accessed_at,
    a.last_accessed_path,
    count(*) over()
  from public.profiles p
  left join public.join_requests j on j.user_id = p.id
  left join public.member_access_state a on a.user_id = p.id
  where
    (
      v_search is null
      or strpos(lower(p.display_name), v_search) > 0
      or strpos(lower(coalesce(j.real_name, '')), v_search) > 0
      or strpos(lower(coalesce(j.email, '')), v_search) > 0
    )
    and (
      v_recency = 'all'
      or (v_recency = '24h' and a.last_accessed_at >= now() - interval '24 hours')
      or (v_recency = '7d' and a.last_accessed_at >= now() - interval '7 days')
      or (v_recency = '30d' and a.last_accessed_at >= now() - interval '30 days')
      or (v_recency = 'inactive_30d' and a.last_accessed_at < now() - interval '30 days')
      or (v_recency = 'never' and a.last_accessed_at is null)
    )
  order by a.last_accessed_at desc nulls last, p.display_name asc, p.id asc
  limit v_limit offset v_offset;
end;
$$;

revoke all on function public.system_admin_list_member_access(text, text, integer, integer) from public;
revoke execute on function public.system_admin_list_member_access(text, text, integer, integer) from anon;
grant execute on function public.system_admin_list_member_access(text, text, integer, integer) to authenticated;
