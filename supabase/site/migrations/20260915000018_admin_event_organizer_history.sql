begin;

alter table public.event_organizer_history
  add column if not exists event_title text;

update public.event_organizer_history as history
set event_title = coalesce(
  nullif(btrim(event.title), ''),
  format('활동 #%s', event.id)
)
from public.events as event
where history.event_id = event.id
  and history.event_title is null;

alter table public.event_organizer_history
  alter column event_title set not null;

alter table public.event_organizer_history
  alter column event_id drop not null;

alter table public.event_organizer_history
  drop constraint if exists event_organizer_history_event_id_fkey;
alter table public.event_organizer_history
  add constraint event_organizer_history_event_id_fkey
  foreign key (event_id) references public.events(id) on delete set null;

create or replace function private.populate_event_organizer_history_event_title()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.event_title is null then
    select coalesce(
      nullif(btrim(event.title), ''),
      format('활동 #%s', event.id)
    )
    into new.event_title
    from public.events as event
    where event.id = new.event_id;
  end if;

  if new.event_title is null then
    raise exception '주최자 이력에 활동 제목을 기록할 수 없습니다.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all on function private.populate_event_organizer_history_event_title()
from public, anon, authenticated;

drop trigger if exists event_organizer_history_set_event_title
on public.event_organizer_history;
create trigger event_organizer_history_set_event_title
before insert on public.event_organizer_history
for each row execute function private.populate_event_organizer_history_event_title();

create or replace function public.admin_list_event_organizer_history(
  p_search text default null,
  p_change_type text default null,
  p_limit integer default 30,
  p_offset integer default 0
)
returns table (
  id bigint,
  event_id bigint,
  event_title text,
  previous_organizer_id uuid,
  previous_organizer_name text,
  organizer_id uuid,
  organizer_name text,
  changed_by uuid,
  changed_by_name text,
  change_type text,
  previous_organizer_left boolean,
  changed_at timestamptz,
  total_count bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_search text := nullif(lower(btrim(coalesce(p_search, ''))), '');
  v_change_type text := nullif(lower(btrim(coalesce(p_change_type, ''))), '');
  v_limit integer := least(greatest(coalesce(p_limit, 30), 1), 100);
  v_offset integer := greatest(coalesce(p_offset, 0), 0);
begin
  if not private.has_admin_permission('operations') then
    raise exception '운영 관리 권한이 있어야 주최자 변경 이력을 조회할 수 있습니다.'
      using errcode = '42501';
  end if;

  if v_change_type is not null and v_change_type not in ('initial', 'transfer') then
    raise exception '지원하지 않는 주최자 이력 유형입니다.'
      using errcode = '22023';
  end if;

  return query
  select
    history.id,
    history.event_id,
    history.event_title,
    history.previous_organizer_id,
    previous_organizer.display_name as previous_organizer_name,
    history.organizer_id,
    organizer.display_name as organizer_name,
    history.changed_by,
    changed_by.display_name as changed_by_name,
    history.change_type,
    history.previous_organizer_left,
    history.changed_at,
    count(*) over() as total_count
  from public.event_organizer_history as history
  left join public.profiles as previous_organizer
    on previous_organizer.id = history.previous_organizer_id
  left join public.profiles as organizer
    on organizer.id = history.organizer_id
  left join public.profiles as changed_by
    on changed_by.id = history.changed_by
  where (v_change_type is null or history.change_type = v_change_type)
    and (
      v_search is null
      or strpos(lower(history.event_title), v_search) > 0
      or strpos(lower(coalesce(previous_organizer.display_name, '')), v_search) > 0
      or strpos(lower(coalesce(organizer.display_name, '')), v_search) > 0
      or strpos(lower(coalesce(changed_by.display_name, '')), v_search) > 0
    )
  order by history.changed_at desc, history.id desc
  limit v_limit
  offset v_offset;
end;
$$;

revoke all on function public.admin_list_event_organizer_history(text, text, integer, integer)
from public, anon, authenticated;
grant execute on function public.admin_list_event_organizer_history(text, text, integer, integer)
to authenticated;

notify pgrst, 'reload schema';

commit;
