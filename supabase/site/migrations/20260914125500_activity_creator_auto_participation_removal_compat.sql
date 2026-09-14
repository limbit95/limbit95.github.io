-- Creator auto-participation is the initial state of a newly created activity, not
-- meaningful participation history by itself. Preserve the current operator-only
-- removal boundary while allowing a clean standalone activity to be physically
-- deleted when its only participant row belongs to the creator.

begin;

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
    private.has_admin_permission('community')
    or private.is_category_manager(v_event.category_id)
  ) then
    raise exception '활동 삭제는 카테고리 담당자 또는 커뮤니티 관리자만 할 수 있습니다.' using errcode = '42501';
  end if;

  if v_event.series_id is not null or exists (
    select 1 from public.event_participants participant
    where participant.event_id = p_event_id
      and participant.user_id <> v_event.created_by
  ) or exists (
    select 1 from public.notifications notification
    where notification.event_id = p_event_id
      and notification.notification_type <> 'new_activity'
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
