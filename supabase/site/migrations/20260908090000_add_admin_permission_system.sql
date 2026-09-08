begin;

-- Three roles are kept in the existing profile column to preserve all auth/profile joins.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('member', 'admin', 'system_admin'));

create table public.admin_permissions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  permission text not null check (permission in ('members', 'community', 'games', 'content', 'operations')),
  granted_at timestamptz not null default now(),
  granted_by uuid references public.profiles(id) on delete set null,
  primary key (user_id, permission)
);

alter table public.admin_permissions enable row level security;
revoke all on table public.admin_permissions from public, anon, authenticated;
grant select on table public.admin_permissions to authenticated;

-- Preserve existing administrators' behavior, without guessing who owns the service.
insert into public.admin_permissions (user_id, permission)
select p.id, permission
from public.profiles p
cross join unnest(array['members', 'community', 'games', 'content', 'operations']) permission
where p.role = 'admin' and p.status = 'approved'
on conflict do nothing;

create or replace function private.is_system_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'system_admin' and p.status = 'approved'
  );
$$;

create or replace function private.has_admin_permission(p_permission text)
returns boolean language sql stable security definer set search_path = '' as $$
  select private.is_system_admin() or (
    p_permission in ('members', 'community', 'games', 'content', 'operations') and exists (
      select 1 from public.profiles p
      join public.admin_permissions ap on ap.user_id = p.id
      where p.id = (select auth.uid()) and p.role = 'admin' and p.status = 'approved'
        and ap.permission = p_permission
    )
  );
$$;

-- Legacy broad checks now mean system-level access only. Area policies below are explicit.
create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select private.is_system_admin();
$$;

revoke all on function private.is_system_admin() from public, anon, authenticated;
revoke all on function private.has_admin_permission(text) from public, anon, authenticated;
grant execute on function private.is_system_admin() to authenticated;
grant execute on function private.has_admin_permission(text) to authenticated;

create policy admin_permissions_select_self
on public.admin_permissions for select to authenticated
using (user_id = (select auth.uid()) or private.is_system_admin());

-- Add area policies beside the existing system-admin policies.
create policy profiles_member_admin_select on public.profiles for select to authenticated
using (private.has_admin_permission('members'));
create policy join_requests_member_admin_select on public.join_requests for select to authenticated
using (private.has_admin_permission('members'));
create policy activity_categories_content_admin_insert on public.activity_categories for insert to authenticated
with check (private.has_admin_permission('content'));
create policy activity_categories_content_admin_update on public.activity_categories for update to authenticated
using (private.has_admin_permission('content')) with check (private.has_admin_permission('content'));
create policy activity_categories_content_admin_delete on public.activity_categories for delete to authenticated
using (private.has_admin_permission('content'));
create policy category_managers_operations_admin_insert on public.category_managers for insert to authenticated
with check (private.has_admin_permission('operations') and created_by = (select auth.uid()));
create policy category_managers_operations_admin_delete on public.category_managers for delete to authenticated
using (private.has_admin_permission('operations'));
create policy event_series_operations_admin_all on public.event_series for all to authenticated
using (private.has_admin_permission('operations')) with check (private.has_admin_permission('operations'));
create policy events_operations_admin_all on public.events for all to authenticated
using (private.has_admin_permission('operations')) with check (private.has_admin_permission('operations'));
create policy date_polls_operations_admin_all on public.date_polls for all to authenticated
using (private.has_admin_permission('operations')) with check (private.has_admin_permission('operations'));
create policy date_poll_options_operations_admin_all on public.date_poll_options for all to authenticated
using (private.has_admin_permission('operations')) with check (private.has_admin_permission('operations'));
create policy posts_community_admin_all on public.posts for all to authenticated
using (private.has_admin_permission('community')) with check (private.has_admin_permission('community'));
create policy comments_community_admin_all on public.comments for all to authenticated
using (private.has_admin_permission('community')) with check (private.has_admin_permission('community'));

create or replace function public.get_my_admin_access()
returns table(role text, permissions text[])
language sql stable security definer set search_path = '' as $$
  select p.role,
    case when p.role = 'system_admin'
      then array['members','community','games','content','operations','permissions','system']::text[]
      when p.role = 'admin'
      then coalesce(array_agg(ap.permission order by ap.permission) filter (where ap.permission is not null), '{}'::text[])
      else '{}'::text[] end
  from public.profiles p left join public.admin_permissions ap on ap.user_id = p.id
  where p.id = (select auth.uid()) and p.status = 'approved'
  group by p.id, p.role;
$$;

create or replace function public.admin_list_administrators()
returns table(id uuid, display_name text, role text, permissions text[])
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.is_system_admin() then raise exception '최고 관리자만 관리자 권한을 조회할 수 있습니다.' using errcode='42501'; end if;
  return query select p.id, p.display_name, p.role,
    coalesce(array_agg(ap.permission order by ap.permission) filter (where ap.permission is not null), '{}'::text[])
  from public.profiles p left join public.admin_permissions ap on ap.user_id=p.id
  where p.role in ('admin','system_admin') and p.status='approved'
  group by p.id order by p.role desc, p.display_name;
end; $$;

create or replace function public.system_admin_set_permissions(p_user_id uuid, p_permissions text[])
returns void language plpgsql security definer set search_path = '' as $$
declare v_permission text;
begin
  if not private.is_system_admin() then raise exception '최고 관리자만 관리자 권한을 변경할 수 있습니다.' using errcode='42501'; end if;
  if not exists(select 1 from public.profiles p where p.id=p_user_id and p.role='admin' and p.status='approved') then
    raise exception '승인된 일반 관리자만 권한을 설정할 수 있습니다.' using errcode='23514';
  end if;
  if exists(select 1 from unnest(coalesce(p_permissions,'{}')) x where x not in ('members','community','games','content','operations')) then
    raise exception '권한 관리와 시스템 관리는 위임할 수 없습니다.' using errcode='22023';
  end if;
  delete from public.admin_permissions where user_id=p_user_id;
  foreach v_permission in array coalesce(p_permissions,'{}') loop
    insert into public.admin_permissions(user_id,permission,granted_by) values(p_user_id,v_permission,auth.uid());
  end loop;
end; $$;

-- Deployment bootstrap is intentionally not executable by browser roles. Run once as
-- postgres with an explicit, verified UUID; the uniqueness index prevents two owners.
create unique index profiles_single_system_admin_idx on public.profiles ((role)) where role='system_admin';
create or replace function public.bootstrap_system_admin(p_user_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if current_user not in ('postgres','service_role') then raise exception '서버 운영자만 최고 관리자를 초기화할 수 있습니다.' using errcode='42501'; end if;
  if exists(select 1 from public.profiles where role='system_admin') then raise exception '최고 관리자가 이미 존재합니다.' using errcode='23505'; end if;
  update public.profiles set role='system_admin' where id=p_user_id and role='admin' and status='approved';
  if not found then raise exception '승인된 기존 관리자 UUID를 확인하세요.' using errcode='P0002'; end if;
  delete from public.admin_permissions where user_id=p_user_id;
end; $$;

revoke all on function public.get_my_admin_access() from public, anon, authenticated;
revoke all on function public.admin_list_administrators() from public, anon, authenticated;
revoke all on function public.system_admin_set_permissions(uuid,text[]) from public, anon, authenticated;
revoke all on function public.bootstrap_system_admin(uuid) from public, anon, authenticated;
grant execute on function public.get_my_admin_access() to authenticated;
grant execute on function public.admin_list_administrators() to authenticated;
grant execute on function public.system_admin_set_permissions(uuid,text[]) to authenticated;
grant execute on function public.bootstrap_system_admin(uuid) to service_role;
create or replace function public.admin_approve_join_request(
    p_user_id uuid,
    p_admin_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_admin_id uuid := auth.uid();
    v_request_status text;
begin
    if not private.has_admin_permission('members') then
        raise exception '관리자만 가입을 승인할 수 있습니다.'
            using errcode = '42501';
    end if;

    select jr.status
    into v_request_status
    from public.join_requests as jr
    where jr.user_id = p_user_id
    for update;

    if not found then
        raise exception '가입 신청을 찾을 수 없습니다.'
            using errcode = 'P0002';
    end if;

    if v_request_status not in ('pending', 'held') then
        raise exception '승인 대기 또는 보류 중인 가입 신청만 승인할 수 있습니다.'
            using errcode = '23514';
    end if;

    update public.profiles
    set status = 'approved',
        approved_at = now(),
        approved_by = v_admin_id
    where id = p_user_id;

    update public.join_requests
    set status = 'approved',
        admin_note = nullif(btrim(p_admin_note), ''),
        reviewed_at = now(),
        reviewed_by = v_admin_id
    where user_id = p_user_id;
end;
$$;

create or replace function public.admin_review_join_request(
    p_user_id uuid,
    p_decision text,
    p_admin_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_admin_id uuid := auth.uid();
    v_request_status text;
begin
    if not private.has_admin_permission('members') then
        raise exception '관리자만 가입 신청을 검토할 수 있습니다.'
            using errcode = '42501';
    end if;

    if p_decision is null or p_decision not in ('rejected', 'held') then
        raise exception '처리 상태는 rejected 또는 held만 가능합니다.'
            using errcode = '22023';
    end if;

    select jr.status
    into v_request_status
    from public.join_requests as jr
    where jr.user_id = p_user_id
    for update;

    if not found then
        raise exception '가입 신청을 찾을 수 없습니다.'
            using errcode = 'P0002';
    end if;

    if v_request_status not in ('pending', 'held') then
        raise exception '승인 대기 또는 보류 중인 가입 신청만 검토할 수 있습니다.'
            using errcode = '23514';
    end if;

    update public.profiles
    set status = case
            when p_decision = 'rejected' then 'rejected'
            else 'pending'
        end,
        approved_at = null,
        approved_by = null
    where id = p_user_id;

    update public.join_requests
    set status = p_decision,
        admin_note = nullif(btrim(p_admin_note), ''),
        reviewed_at = now(),
        reviewed_by = v_admin_id
    where user_id = p_user_id;
end;
$$;

create or replace function public.admin_set_member_role(
    p_user_id uuid,
    p_role text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_current_role text;
    v_current_status text;
    v_admin_count integer;
begin
    if not private.has_admin_permission('permissions') then
        raise exception '관리자만 역할을 변경할 수 있습니다.'
            using errcode = '42501';
    end if;

    if p_role is null or p_role not in ('member', 'admin') then
        raise exception '지원하지 않는 역할입니다.'
            using errcode = '22023';
    end if;

    -- 역할 변경과 정지 처리를 같은 잠금 키로 직렬화해 마지막 관리자 보호
    -- 검사가 동시 요청에서도 일관되게 동작하도록 한다.
    perform pg_catalog.pg_advisory_xact_lock(73624721);

    select p.role, p.status
    into v_current_role, v_current_status
    from public.profiles as p
    where p.id = p_user_id
    for update;

    if not found then
        raise exception '회원을 찾을 수 없습니다.'
            using errcode = 'P0002';
    end if;

    if v_current_role = 'system_admin' then
        raise exception '최고 관리자 역할은 서비스 내 권한 관리 RPC로 변경할 수 없습니다.'
            using errcode = '42501';
    end if;

    if v_current_status <> 'approved' then
        raise exception '승인 회원에게만 관리자 역할을 부여할 수 있습니다.'
            using errcode = '23514';
    end if;

    if v_current_role = 'admin' and p_role = 'member' then
        select count(*)::integer
        into v_admin_count
        from public.profiles as p
        where p.role = 'admin'
          and p.status = 'approved';

        if v_admin_count <= 1 then
            raise exception '마지막 관리자의 권한은 회수할 수 없습니다.'
                using errcode = '23514';
        end if;
    end if;

    update public.profiles
    set role = p_role
    where id = p_user_id;
end;
$$;

create or replace function public.admin_set_member_status(
    p_user_id uuid,
    p_status text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_role text;
    v_current_status text;
    v_admin_count integer;
begin
    if not private.has_admin_permission('members') then
        raise exception '관리자만 회원 상태를 변경할 수 있습니다.'
            using errcode = '42501';
    end if;

    if p_status is null or p_status not in ('approved', 'suspended') then
        raise exception '회원 상태는 approved 또는 suspended만 가능합니다.'
            using errcode = '22023';
    end if;

    perform pg_catalog.pg_advisory_xact_lock(73624721);

    select p.role, p.status
    into v_role, v_current_status
    from public.profiles as p
    where p.id = p_user_id
    for update;

    if not found then
        raise exception '회원을 찾을 수 없습니다.'
            using errcode = 'P0002';
    end if;

    if v_role = 'system_admin' then
        raise exception '최고 관리자의 상태는 변경할 수 없습니다.'
            using errcode = '42501';
    end if;

    if v_role = 'admin' and not private.is_system_admin() then
        raise exception '일반 관리자는 다른 관리자의 상태를 변경할 수 없습니다.'
            using errcode = '42501';
    end if;

    if v_current_status not in ('approved', 'suspended') then
        raise exception '가입 승인 전 상태는 가입 신청 관리 RPC로 처리해야 합니다.'
            using errcode = '23514';
    end if;

    if v_role = 'admin'
       and v_current_status = 'approved'
       and p_status = 'suspended'
    then
        select count(*)::integer
        into v_admin_count
        from public.profiles as p
        where p.role = 'admin'
          and p.status = 'approved';

        if v_admin_count <= 1 then
            raise exception '마지막 관리자는 이용 정지할 수 없습니다.'
                using errcode = '23514';
        end if;
    end if;

    update public.profiles
    set status = p_status,
        approved_at = case
            when p_status = 'approved' then coalesce(approved_at, now())
            else approved_at
        end,
        approved_by = case
            when p_status = 'approved' then coalesce(approved_by, auth.uid())
            else approved_by
        end
    where id = p_user_id;
end;
$$;

create or replace function public.admin_set_category_manager(
    p_user_id uuid,
    p_category_id bigint,
    p_enabled boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    if not private.has_admin_permission('operations') then
        raise exception '관리자만 활동 담당자를 변경할 수 있습니다.'
            using errcode = '42501';
    end if;

    if p_enabled is null then
        raise exception '담당자 권한 적용 여부가 필요합니다.'
            using errcode = '22023';
    end if;

    if p_enabled then
        if not exists (
            select 1
            from public.profiles as p
            where p.id = p_user_id
              and p.status = 'approved'
        ) then
            raise exception '승인 회원만 활동 담당자로 지정할 수 있습니다.'
                using errcode = '23514';
        end if;

        if not exists (
            select 1
            from public.activity_categories as c
            where c.id = p_category_id
              and c.is_active = true
        ) then
            raise exception '활성화된 카테고리를 찾을 수 없습니다.'
                using errcode = 'P0002';
        end if;

        insert into public.category_managers (
            category_id,
            user_id,
            created_by
        )
        values (
            p_category_id,
            p_user_id,
            auth.uid()
        )
        on conflict (category_id, user_id) do nothing;
    else
        delete from public.category_managers
        where category_id = p_category_id
          and user_id = p_user_id;
    end if;
end;
$$;
-- The paginated member directory is redefined with the same response contract and an area guard.
create or replace function public.admin_list_members_page(p_search text default null,p_limit integer default 20,p_offset integer default 0)
returns table(id uuid,display_name text,role text,status text,created_at timestamptz,email text,real_name text,church_group text,join_request_status text,total_count bigint)
language plpgsql stable security definer set search_path='' as $$
declare v_search text:=nullif(lower(btrim(coalesce(p_search,''))),''); v_limit integer:=least(greatest(coalesce(p_limit,20),1),100); v_offset integer:=greatest(coalesce(p_offset,0),0);
begin
 if not private.has_admin_permission('members') then raise exception '회원 관리 권한이 필요합니다.' using errcode='42501'; end if;
 return query select p.id,p.display_name,p.role,p.status,p.created_at,j.email,j.real_name,j.church_group,j.status,count(*) over()
 from public.profiles p left join public.join_requests j on j.user_id=p.id
 where v_search is null or strpos(lower(p.display_name),v_search)>0 or strpos(lower(coalesce(j.real_name,'')),v_search)>0 or strpos(lower(coalesce(j.email,'')),v_search)>0
 order by p.created_at desc,p.id desc limit v_limit offset v_offset;
end; $$;

commit;
