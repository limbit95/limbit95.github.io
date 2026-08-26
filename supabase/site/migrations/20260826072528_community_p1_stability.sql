create or replace function public.replace_my_profile_interests(
  p_category_ids bigint[]
)
returns setof public.profile_interests
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception '승인된 회원만 관심 활동을 변경할 수 있습니다.'
      using errcode = '42501';
  end if;

  delete from public.profile_interests
  where user_id = v_user_id;

  return query
  insert into public.profile_interests (user_id, category_id)
  select v_user_id, item.category_id
  from (
    select distinct category_id
    from unnest(coalesce(p_category_ids, '{}'::bigint[])) as valueset(category_id)
    where category_id is not null
  ) as item
  returning *;
end;
$$;

revoke all on function public.replace_my_profile_interests(bigint[])
  from public, anon, authenticated;
grant execute on function public.replace_my_profile_interests(bigint[])
  to authenticated;

create or replace function public.create_recurring_event(
  p_series jsonb,
  p_occurrences jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_category_id bigint;
  v_start_date date;
  v_end_date date;
  v_series public.event_series%rowtype;
  v_events jsonb;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception '승인된 회원만 반복 활동을 등록할 수 있습니다.'
      using errcode = '42501';
  end if;

  if p_series is null or jsonb_typeof(p_series) <> 'object' then
    raise exception '반복 활동 정보를 확인해 주세요.'
      using errcode = '22023';
  end if;

  if p_occurrences is null
     or jsonb_typeof(p_occurrences) <> 'array'
     or jsonb_array_length(p_occurrences) < 1
     or jsonb_array_length(p_occurrences) > 60 then
    raise exception '반복 활동 일정은 1개 이상 60개 이하로 등록해 주세요.'
      using errcode = '22023';
  end if;

  v_category_id := nullif(p_series ->> 'category_id', '')::bigint;
  v_start_date := nullif(p_series ->> 'start_date', '')::date;
  v_end_date := nullif(p_series ->> 'end_date', '')::date;

  if v_category_id is null or v_start_date is null or v_end_date is null then
    raise exception '카테고리와 반복 시작일/종료일을 확인해 주세요.'
      using errcode = '22023';
  end if;

  if not (private.is_admin() or private.is_category_manager(v_category_id)) then
    raise exception '이 카테고리의 반복 활동을 등록할 권한이 없습니다.'
      using errcode = '42501';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_occurrences) as occurrence(value)
    where nullif(occurrence.value ->> 'event_date', '')::date < v_start_date
       or nullif(occurrence.value ->> 'event_date', '')::date > v_end_date
  ) then
    raise exception '반복 활동 날짜가 반복 기간을 벗어났습니다.'
      using errcode = '23514';
  end if;

  if not exists (
    select 1
    from jsonb_array_elements(p_occurrences) as occurrence(value)
    where nullif(occurrence.value ->> 'event_date', '')::date = v_start_date
  ) then
    raise exception '첫 활동 날짜가 반복 일정에 포함되어야 합니다.'
      using errcode = '23514';
  end if;

  insert into public.event_series (
    category_id,
    title,
    description,
    start_date,
    end_date,
    start_time,
    end_time,
    timezone,
    recurrence_rule,
    location_name,
    location_url,
    capacity,
    fee_text,
    difficulty,
    preparation,
    beginner_friendly,
    participant_notice,
    status,
    created_by
  ) values (
    v_category_id,
    p_series ->> 'title',
    p_series ->> 'description',
    v_start_date,
    v_end_date,
    nullif(p_series ->> 'start_time', '')::time,
    nullif(p_series ->> 'end_time', '')::time,
    'Asia/Seoul',
    p_series ->> 'recurrence_rule',
    p_series ->> 'location_name',
    nullif(p_series ->> 'location_url', ''),
    nullif(p_series ->> 'capacity', '')::integer,
    coalesce(nullif(p_series ->> 'fee_text', ''), '무료'),
    nullif(p_series ->> 'difficulty', ''),
    coalesce(p_series ->> 'preparation', ''),
    coalesce(nullif(p_series ->> 'beginner_friendly', '')::boolean, true),
    coalesce(p_series ->> 'participant_notice', ''),
    'active',
    v_user_id
  )
  returning * into v_series;

  with inserted as (
    insert into public.events (
      series_id,
      category_id,
      title,
      description,
      event_date,
      start_time,
      end_time,
      location_name,
      location_url,
      capacity,
      fee_text,
      difficulty,
      preparation,
      beginner_friendly,
      participant_notice,
      registration_deadline,
      status,
      created_by
    )
    select
      v_series.id,
      v_series.category_id,
      v_series.title,
      v_series.description,
      nullif(occurrence.value ->> 'event_date', '')::date,
      v_series.start_time,
      v_series.end_time,
      v_series.location_name,
      v_series.location_url,
      v_series.capacity,
      v_series.fee_text,
      v_series.difficulty,
      v_series.preparation,
      v_series.beginner_friendly,
      v_series.participant_notice,
      nullif(occurrence.value ->> 'registration_deadline', '')::timestamptz,
      'scheduled',
      v_user_id
    from jsonb_array_elements(p_occurrences) with ordinality as occurrence(value, position)
    order by occurrence.position
    returning *
  )
  select coalesce(
    jsonb_agg(to_jsonb(inserted) order by event_date, start_time, id),
    '[]'::jsonb
  )
  into v_events
  from inserted;

  return jsonb_build_object(
    'series', to_jsonb(v_series),
    'events', v_events
  );
end;
$$;

revoke all on function public.create_recurring_event(jsonb, jsonb)
  from public, anon, authenticated;
grant execute on function public.create_recurring_event(jsonb, jsonb)
  to authenticated;

drop policy if exists direct_messages_select_own on public.direct_messages;
create policy direct_messages_select_own
  on public.direct_messages
  for select
  to authenticated
  using (
    private.is_approved_member()
    and (
      (select auth.uid()) = sender_id
      or (select auth.uid()) = recipient_id
    )
  );
