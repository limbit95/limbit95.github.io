begin;

create or replace function private.protect_creator_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_required_permission text;
  v_organizer_transfer_allowed boolean := tg_table_name = 'events'
    and coalesce(current_setting('app.allow_event_organizer_transfer', true), 'false') = 'true';
begin
  v_required_permission := case tg_table_name
    when 'events' then 'community'
    when 'event_series' then 'community'
    when 'date_polls' then 'operations'
    else null
  end;

  if auth.uid() is not null
     and (v_required_permission is null or not private.has_admin_permission(v_required_permission))
  then
    if new.created_by is distinct from old.created_by
       and not v_organizer_transfer_allowed
    then
      raise exception '작성자는 전용 변경 기능을 통해서만 변경할 수 있습니다.' using errcode = '42501';
    end if;

    if new.created_at is distinct from old.created_at then
      raise exception '생성일은 변경할 수 없습니다.' using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.protect_creator_identity()
from public, anon, authenticated;

commit;
