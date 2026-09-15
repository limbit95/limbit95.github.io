begin;

create or replace function private.enforce_event_management_boundary()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_is_organizer boolean;
  v_is_community_manager boolean;
  v_organizer_transfer_allowed boolean := coalesce(
    current_setting('app.allow_event_organizer_transfer', true),
    'false'
  ) = 'true';
begin
  if v_user_id is null then
    return new;
  end if;

  if new.created_by is distinct from old.created_by then
    raise exception '최초 등록자는 변경할 수 없습니다.' using errcode = '42501';
  end if;

  if new.organizer_id is distinct from old.organizer_id
     and not v_organizer_transfer_allowed then
    raise exception '주최자는 주최자 변경 기능을 통해서만 변경할 수 있습니다.' using errcode = '42501';
  end if;

  if new.created_at is distinct from old.created_at then
    raise exception '생성일은 변경할 수 없습니다.' using errcode = '42501';
  end if;

  if new.series_id is distinct from old.series_id then
    raise exception '반복 활동 연결은 생성 후 변경할 수 없습니다.' using errcode = '42501';
  end if;

  if old.series_id is not null
     and new.category_id is distinct from old.category_id then
    raise exception '반복 활동 일정의 카테고리는 개별 변경할 수 없습니다.'
      using errcode = '42501';
  end if;

  if new.category_id is distinct from old.category_id and not exists (
    select 1 from public.activity_categories category
    where category.id = new.category_id and category.is_active
  ) then
    raise exception '활성 카테고리만 선택할 수 있습니다.' using errcode = '42501';
  end if;

  if new.organizer_id is distinct from old.organizer_id
     and v_organizer_transfer_allowed then
    return new;
  end if;

  v_is_organizer := old.series_id is null and old.organizer_id = v_user_id;
  v_is_community_manager := private.has_admin_permission('community');

  if v_is_community_manager then
    return new;
  end if;

  if old.series_id is not null then
    if not private.is_category_manager(old.category_id) then
      raise exception '반복 활동 일정은 해당 카테고리 담당자만 변경할 수 있습니다.'
        using errcode = '42501';
    end if;
    return new;
  end if;

  if v_is_organizer then
    if new.status is distinct from old.status and new.status <> 'cancelled' then
      raise exception '활동 주최자는 일정 취소 외의 상태를 변경할 수 없습니다.' using errcode = '42501';
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

commit;
