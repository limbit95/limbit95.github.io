-- Let every approved member own single activities while preserving category and
-- COMMUNITY management boundaries. Physical removal is only exposed via the
-- domain RPC below so participation history cannot be deleted accidentally.

begin;

drop policy if exists events_insert_policy on public.events;
drop policy if exists events_update_policy on public.events;
drop policy if exists events_delete_policy on public.events;
drop policy if exists events_community_admin_insert on public.events;
drop policy if exists events_community_admin_update on public.events;
drop policy if exists events_community_admin_delete on public.events;

create policy events_member_insert
on public.events for insert to authenticated
with check (
  private.is_approved_member()
  and created_by = (select auth.uid())
  and exists (
    select 1 from public.activity_categories category
    where category.id = category_id and category.is_active
  )
  and (
    series_id is null
    or private.has_admin_permission('community')
    or private.is_category_manager(category_id)
  )
);

create policy events_owner_manager_update
on public.events for update to authenticated
using (
  private.is_approved_member()
  and (
    created_by = (select auth.uid())
    or private.has_admin_permission('community')
    or private.is_category_manager(category_id)
  )
)
with check (
  private.is_approved_member()
  and (
    created_by = (select auth.uid())
    or private.has_admin_permission('community')
    or private.is_category_manager(category_id)
  )
);

-- OLD/NEW comparisons and owner-only status limits cannot be expressed safely
-- by permissive RLS policies alone, so enforce them in one row trigger.
create or replace function private.enforce_event_management_boundary()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_is_owner boolean;
  v_is_community_manager boolean;
  v_can_manage_recurring boolean;
begin
  if v_user_id is null then
    return new;
  end if;

  if new.created_by is distinct from old.created_by
     or new.created_at is distinct from old.created_at then
    raise exception '작성자와 생성일은 변경할 수 없습니다.' using errcode = '42501';
  end if;

  if new.category_id is distinct from old.category_id and not exists (
    select 1 from public.activity_categories category
    where category.id = new.category_id and category.is_active
  ) then
    raise exception '활성 카테고리만 선택할 수 있습니다.' using errcode = '42501';
  end if;

  v_is_owner := old.created_by = v_user_id;
  v_is_community_manager := private.has_admin_permission('community');
  v_can_manage_recurring := v_is_community_manager
    or (
      private.is_category_manager(old.category_id)
      and private.is_category_manager(new.category_id)
    );

  if new.series_id is distinct from old.series_id and not v_can_manage_recurring then
    raise exception '반복 활동 연결은 카테고리 담당자 또는 COMMUNITY 관리자만 변경할 수 있습니다.'
      using errcode = '42501';
  end if;

  if v_is_community_manager then
    return new;
  end if;

  if v_is_owner then
    if new.status is distinct from old.status and new.status <> 'cancelled' then
      raise exception '활동 작성자는 일정 취소 외의 상태를 변경할 수 없습니다.' using errcode = '42501';
    end if;
    return new;
  end if;

  if not private.is_category_manager(old.category_id)
     or not private.is_category_manager(new.category_id) then
    raise exception '담당 중인 카테고리 안에서만 다른 회원의 활동을 변경할 수 있습니다.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_event_management_boundary()
from public, anon, authenticated;

drop trigger if exists events_enforce_management_boundary on public.events;
create trigger events_enforce_management_boundary
before update on public.events
for each row execute function private.enforce_event_management_boundary();

create or replace function public.remove_or_cancel_event(p_event_id bigint)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event public.events%rowtype;
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception '승인된 회원만 활동을 관리할 수 있습니다.' using errcode = '42501';
  end if;

  select * into v_event
  from public.events
  where id = p_event_id
  for update;

  if not found then
    raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;

  if not (
    v_event.created_by = v_user_id
    or private.has_admin_permission('community')
    or private.is_category_manager(v_event.category_id)
  ) then
    raise exception '이 활동을 관리할 권한이 없습니다.' using errcode = '42501';
  end if;

  if exists (
    select 1 from public.event_participants participant
    where participant.event_id = p_event_id
  ) or exists (
    select 1 from public.notifications notification
    where notification.event_id = p_event_id
  ) or exists (
    select 1 from public.date_polls poll
    where poll.result_event_id = p_event_id
  ) then
    if v_event.status <> 'cancelled' then
      update public.events set status = 'cancelled' where id = p_event_id;
    end if;
    return jsonb_build_object('action', 'cancelled', 'event_id', p_event_id);
  end if;

  delete from public.events where id = p_event_id;
  return jsonb_build_object('action', 'deleted', 'event_id', p_event_id);
end;
$$;

revoke all on function public.remove_or_cancel_event(bigint) from public, anon, authenticated;
grant execute on function public.remove_or_cancel_event(bigint) to authenticated;

commit;
