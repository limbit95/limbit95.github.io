create or replace function public.get_public_member_profiles_by_ids(p_user_ids uuid[])
returns table(
  id uuid,
  display_name text,
  birth_year integer,
  age_group text,
  bio text,
  avatar_path text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_approved_member() then
    raise exception '승인된 회원만 회원 프로필을 조회할 수 있습니다.'
      using errcode = '42501';
  end if;

  return query
  select
    p.id,
    p.display_name,
    case
      when p.age_visibility = 'birth_year' then p.birth_year
      else null
    end as birth_year,
    case
      when p.age_visibility = 'age_group' and p.birth_year is not null
        then (((extract(year from current_date)::integer - p.birth_year) / 10) * 10)::text || '대'
      else null
    end as age_group,
    p.bio,
    p.avatar_path,
    p.created_at
  from public.profiles as p
  where p.status = 'approved'
    and p.id = any(coalesce(p_user_ids, '{}'::uuid[]))
  order by p.display_name, p.id;
end;
$$;

revoke all on function public.get_public_member_profiles_by_ids(uuid[]) from public;
revoke all on function public.get_public_member_profiles_by_ids(uuid[]) from anon;
grant execute on function public.get_public_member_profiles_by_ids(uuid[]) to authenticated;
grant execute on function public.get_public_member_profiles_by_ids(uuid[]) to service_role;
