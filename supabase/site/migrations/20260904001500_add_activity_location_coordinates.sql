alter table public.events
  add column if not exists location_latitude double precision,
  add column if not exists location_longitude double precision;

alter table public.event_series
  add column if not exists location_latitude double precision,
  add column if not exists location_longitude double precision;

alter table public.events
  drop constraint if exists events_location_latitude_check,
  drop constraint if exists events_location_longitude_check,
  add constraint events_location_latitude_check
    check (location_latitude is null or location_latitude between -90 and 90),
  add constraint events_location_longitude_check
    check (location_longitude is null or location_longitude between -180 and 180);

alter table public.event_series
  drop constraint if exists event_series_location_latitude_check,
  drop constraint if exists event_series_location_longitude_check,
  add constraint event_series_location_latitude_check
    check (location_latitude is null or location_latitude between -90 and 90),
  add constraint event_series_location_longitude_check
    check (location_longitude is null or location_longitude between -180 and 180);

create or replace function public.create_recurring_event(p_series jsonb, p_occurrences jsonb)
returns jsonb
language plpgsql
set search_path to ''
as $function$
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
    location_latitude,
    location_longitude,
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
    nullif(p_series ->> 'location_latitude', '')::double precision,
    nullif(p_series ->> 'location_longitude', '')::double precision,
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
      location_latitude,
      location_longitude,
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
      v_series.location_latitude,
      v_series.location_longitude,
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
$function$;
