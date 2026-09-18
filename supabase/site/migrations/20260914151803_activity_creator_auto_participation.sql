begin;

-- 활동 생성자는 기본적으로 첫 참여자가 된다.
-- 최고 관리자(system_admin)는 운영 목적으로 활동을 대신 등록할 수 있으므로 자동 참여에서 제외한다.
-- AFTER INSERT trigger는 일반 활동과 반복 활동의 개별 일정 INSERT 모두에 동일하게 적용되며,
-- 참여 행 생성이 실패하면 원래 events INSERT도 같은 트랜잭션에서 함께 롤백된다.
create or replace function private.auto_join_event_creator()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null
     or new.created_by is distinct from v_user_id
     or not private.is_approved_member()
     or private.is_system_admin()
  then
    return new;
  end if;

  insert into public.event_participants (
    event_id,
    user_id,
    status,
    joined_at,
    waitlisted_at,
    cancelled_at
  )
  values (
    new.id,
    v_user_id,
    'joined',
    now(),
    null,
    null
  );

  return new;
end;
$$;

revoke all on function private.auto_join_event_creator()
from public, anon, authenticated;

drop trigger if exists events_auto_join_creator on public.events;
create trigger events_auto_join_creator
after insert on public.events
for each row execute function private.auto_join_event_creator();

commit;
