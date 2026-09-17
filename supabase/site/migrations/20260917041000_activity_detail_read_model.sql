begin;

create or replace function public.get_event_detail_core(p_event_id bigint)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_result jsonb;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception '승인된 회원만 활동 상세 정보를 확인할 수 있습니다.'
      using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.events as event
    where event.id = p_event_id
  ) then
    raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;

  select jsonb_build_object(
    'id', event.id,
    'series_id', event.series_id,
    'category_id', event.category_id,
    'title', event.title,
    'description', event.description,
    'event_date', event.event_date,
    'start_time', event.start_time,
    'end_time', event.end_time,
    'location_name', event.location_name,
    'location_url', event.location_url,
    'location_latitude', event.location_latitude,
    'location_longitude', event.location_longitude,
    'capacity', event.capacity,
    'fee_text', event.fee_text,
    'difficulty', event.difficulty,
    'preparation', event.preparation,
    'beginner_friendly', event.beginner_friendly,
    'participant_notice', event.participant_notice,
    'registration_deadline', event.registration_deadline,
    'status', event.status,
    'created_by', event.created_by,
    'organizer_id', event.organizer_id,
    'created_at', event.created_at,
    'updated_at', event.updated_at,
    'joined_count', (
      select count(*)::integer
      from public.event_participants as participant
      where participant.event_id = event.id
        and participant.status = 'joined'
    ),
    'waitlisted_count', (
      select count(*)::integer
      from public.event_participants as participant
      where participant.event_id = event.id
        and participant.status = 'waitlisted'
    ),
    'my_participation_status', (
      select participant.status
      from public.event_participants as participant
      where participant.event_id = event.id
        and participant.user_id = v_user_id
        and participant.status in ('joined', 'waitlisted')
      limit 1
    ),
    'category', case
      when category.id is null then null
      else jsonb_build_object(
        'id', category.id,
        'name', category.name,
        'icon', category.icon,
        'color', category.color,
        'description', category.description,
        'is_active', category.is_active,
        'created_at', category.created_at,
        'updated_at', category.updated_at
      )
    end,
    'series', case
      when series.id is null then null
      else jsonb_build_object(
        'id', series.id,
        'category_id', series.category_id,
        'title', series.title,
        'description', series.description,
        'start_date', series.start_date,
        'end_date', series.end_date,
        'start_time', series.start_time,
        'end_time', series.end_time,
        'timezone', series.timezone,
        'recurrence_rule', series.recurrence_rule,
        'location_name', series.location_name,
        'location_url', series.location_url,
        'location_latitude', series.location_latitude,
        'location_longitude', series.location_longitude,
        'capacity', series.capacity,
        'fee_text', series.fee_text,
        'difficulty', series.difficulty,
        'preparation', series.preparation,
        'beginner_friendly', series.beginner_friendly,
        'participant_notice', series.participant_notice,
        'status', series.status,
        'created_by', series.created_by,
        'created_at', series.created_at,
        'updated_at', series.updated_at
      )
    end,
    'organizer', case
      when organizer.id is null then null
      else jsonb_build_object(
        'id', organizer.id,
        'display_name', organizer.display_name,
        'birth_year', case
          when organizer.age_visibility = 'birth_year' then organizer.birth_year
          else null
        end,
        'age_group', case
          when organizer.age_visibility = 'age_group' and organizer.birth_year is not null
            then (((extract(year from current_date)::integer - organizer.birth_year) / 10) * 10)::text || '대'
          else null
        end,
        'bio', organizer.bio,
        'avatar_path', organizer.avatar_path,
        'created_at', organizer.created_at
      )
    end
  )
  into v_result
  from public.events as event
  left join public.activity_categories as category
    on category.id = event.category_id
  left join public.event_series as series
    on series.id = event.series_id
  left join public.profiles as organizer
    on organizer.id = event.organizer_id
   and organizer.status = 'approved'
  where event.id = p_event_id;

  return v_result;
end;
$$;

create or replace function public.get_activity_detail_supplement(p_event_id bigint)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_participants jsonb;
  v_organizer_history jsonb;
  v_organizer_transfer_request jsonb;
begin
  if v_user_id is null or not private.is_approved_member() then
    raise exception '승인된 회원만 활동 상세 정보를 확인할 수 있습니다.'
      using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.events as event
    where event.id = p_event_id
  ) then
    raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'event_id', participant.event_id,
        'user_id', participant.user_id,
        'status', participant.status,
        'joined_at', participant.joined_at,
        'waitlisted_at', participant.waitlisted_at,
        'cancelled_at', participant.cancelled_at,
        'created_at', participant.created_at,
        'updated_at', participant.updated_at,
        'profile', case
          when profile.id is null then null
          else jsonb_build_object(
            'id', profile.id,
            'display_name', profile.display_name,
            'birth_year', case
              when profile.age_visibility = 'birth_year' then profile.birth_year
              else null
            end,
            'age_group', case
              when profile.age_visibility = 'age_group' and profile.birth_year is not null
                then (((extract(year from current_date)::integer - profile.birth_year) / 10) * 10)::text || '대'
              else null
            end,
            'bio', profile.bio,
            'avatar_path', profile.avatar_path,
            'created_at', profile.created_at
          )
        end
      )
      order by participant.joined_at asc nulls last,
               participant.waitlisted_at asc nulls last
    ),
    '[]'::jsonb
  )
  into v_participants
  from public.event_participants as participant
  left join public.profiles as profile
    on profile.id = participant.user_id
   and profile.status = 'approved'
  where participant.event_id = p_event_id
    and participant.status in ('joined', 'waitlisted');

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', history.id,
        'previous_organizer_id', history.previous_organizer_id,
        'previous_organizer_name', previous_organizer.display_name,
        'organizer_id', history.organizer_id,
        'organizer_name', organizer.display_name,
        'changed_by', history.changed_by,
        'changed_by_name', changed_by.display_name,
        'previous_organizer_left', history.previous_organizer_left,
        'changed_at', history.changed_at
      )
      order by history.changed_at desc, history.id desc
    ),
    '[]'::jsonb
  )
  into v_organizer_history
  from public.event_organizer_history as history
  left join public.profiles as previous_organizer
    on previous_organizer.id = history.previous_organizer_id
  left join public.profiles as organizer
    on organizer.id = history.organizer_id
  left join public.profiles as changed_by
    on changed_by.id = history.changed_by
  where history.event_id = p_event_id
    and history.change_type = 'transfer';

  select jsonb_build_object(
    'id', request.id,
    'event_id', request.event_id,
    'from_organizer_id', request.from_organizer_id,
    'from_organizer_name', from_organizer.display_name,
    'to_organizer_id', request.to_organizer_id,
    'to_organizer_name', to_organizer.display_name,
    'leave_current_after_accept', request.leave_current_after_accept,
    'requested_at', request.requested_at
  )
  into v_organizer_transfer_request
  from public.event_organizer_transfer_requests as request
  left join public.profiles as from_organizer
    on from_organizer.id = request.from_organizer_id
  left join public.profiles as to_organizer
    on to_organizer.id = request.to_organizer_id
  where request.event_id = p_event_id
    and request.status = 'pending'
    and v_user_id in (request.from_organizer_id, request.to_organizer_id)
  limit 1;

  return jsonb_build_object(
    'participants', v_participants,
    'organizer_history', v_organizer_history,
    'organizer_transfer_request', v_organizer_transfer_request
  );
end;
$$;

revoke all on function public.get_event_detail_core(bigint)
  from public, anon, authenticated;
revoke all on function public.get_activity_detail_supplement(bigint)
  from public, anon, authenticated;

grant execute on function public.get_event_detail_core(bigint)
  to authenticated, service_role;
grant execute on function public.get_activity_detail_supplement(bigint)
  to authenticated, service_role;

commit;
