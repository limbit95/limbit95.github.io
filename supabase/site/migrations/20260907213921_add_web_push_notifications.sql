begin;

-- 한 사용자의 여러 기기를 허용하되 Push endpoint는 전체에서 유일하게 유지한다.
create table public.push_subscriptions (
    id bigint generated always as identity primary key,
    user_id uuid not null references public.profiles(id) on delete cascade,
    endpoint text not null check (char_length(btrim(endpoint)) between 1 and 4096),
    p256dh text not null check (char_length(btrim(p256dh)) between 1 and 512),
    auth text not null check (char_length(btrim(auth)) between 1 and 512),
    user_agent text check (char_length(user_agent) <= 1000),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint push_subscriptions_endpoint_unique unique (endpoint)
);

create index push_subscriptions_user_id_idx
    on public.push_subscriptions (user_id, created_at desc);

create trigger push_subscriptions_set_updated_at
before update on public.push_subscriptions
for each row execute function private.set_updated_at();

alter table public.push_subscriptions enable row level security;
revoke all on table public.push_subscriptions from public, anon, authenticated;
grant select, insert, update, delete on table public.push_subscriptions to authenticated;
grant all on table public.push_subscriptions to service_role;
grant usage, select on sequence public.push_subscriptions_id_seq to authenticated, service_role;

create policy push_subscriptions_select_own
on public.push_subscriptions for select to authenticated
using ((select auth.uid()) = user_id);

create policy push_subscriptions_insert_own
on public.push_subscriptions for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy push_subscriptions_update_own
on public.push_subscriptions for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy push_subscriptions_delete_own
on public.push_subscriptions for delete to authenticated
using ((select auth.uid()) = user_id);

alter table public.notifications drop constraint if exists notifications_notification_type_check;
alter table public.notifications add constraint notifications_notification_type_check
check (notification_type = any (array[
    'event_updated'::text,
    'event_cancelled'::text,
    'waitlist_promoted'::text,
    'poll_closed'::text,
    'new_activity'::text,
    'direct_message'::text,
    'activity_reminder'::text,
    'event_participant_joined'::text,
    'event_participant_waitlisted'::text,
    'event_participation_cancelled'::text
]));

-- 상태 변경과 등록자 알림 생성을 한 transaction 안에서 처리한다.
create or replace function public.join_event(p_event_id bigint)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
    v_event public.events%rowtype;
    v_existing_status text;
    v_joined_count integer;
    v_new_status text;
    v_actor_name text;
begin
    if v_user_id is null or not private.is_approved_member() then
        raise exception '승인된 회원만 활동에 참여할 수 있습니다.' using errcode = '42501';
    end if;

    select e.* into v_event from public.events as e
    where e.id = p_event_id for update;
    if not found then
        raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002';
    end if;
    if v_event.status <> 'scheduled' then
        raise exception '현재 참여 신청을 받을 수 없는 활동입니다.' using errcode = '23514';
    end if;
    if now() > v_event.registration_deadline then
        raise exception '참여 신청이 마감되었습니다.' using errcode = '23514';
    end if;

    select ep.status into v_existing_status
    from public.event_participants as ep
    where ep.event_id = p_event_id and ep.user_id = v_user_id for update;
    if found and v_existing_status in ('joined', 'waitlisted') then
        raise exception '이미 참여 또는 대기 신청한 활동입니다.' using errcode = '23505';
    end if;

    select count(*)::integer into v_joined_count
    from public.event_participants as ep
    where ep.event_id = p_event_id and ep.status = 'joined';
    v_new_status := case
        when v_event.capacity is null or v_joined_count < v_event.capacity then 'joined'
        else 'waitlisted'
    end;

    insert into public.event_participants (
        event_id, user_id, status, joined_at, waitlisted_at, cancelled_at
    ) values (
        p_event_id, v_user_id, v_new_status,
        case when v_new_status = 'joined' then now() else null end,
        case when v_new_status = 'waitlisted' then now() else null end,
        null
    )
    on conflict (event_id, user_id) do update
    set status = excluded.status,
        joined_at = excluded.joined_at,
        waitlisted_at = excluded.waitlisted_at,
        cancelled_at = null;

    if v_event.created_by <> v_user_id then
        select coalesce(nullif(btrim(p.display_name), ''), '회원') into v_actor_name
        from public.profiles as p where p.id = v_user_id;
        insert into public.notifications (
            user_id, notification_type, kind, title, body, event_id, target_path
        ) values (
            v_event.created_by,
            case when v_new_status = 'joined' then 'event_participant_joined' else 'event_participant_waitlisted' end,
            case when v_new_status = 'joined' then 'event_participant_joined' else 'event_participant_waitlisted' end,
            case when v_new_status = 'joined' then '새로운 활동 참여' else '새로운 대기 신청' end,
            case when v_new_status = 'joined'
                then format('%s님이 ''%s'' 활동에 참여했습니다.', v_actor_name, v_event.title)
                else format('%s님이 ''%s'' 활동에 대기 신청했습니다.', v_actor_name, v_event.title)
            end,
            p_event_id,
            format('#/activities/%s', p_event_id)
        );
    end if;
    return v_new_status;
end;
$$;

create or replace function public.cancel_event_participation(p_event_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
    v_event public.events%rowtype;
    v_current_status text;
    v_promoted_user_id uuid;
    v_joined_count integer;
    v_actor_name text;
begin
    if v_user_id is null or not private.is_approved_member() then
        raise exception '승인된 회원만 참여를 취소할 수 있습니다.' using errcode = '42501';
    end if;
    select e.* into v_event from public.events as e
    where e.id = p_event_id for update;
    if not found then raise exception '활동을 찾을 수 없습니다.' using errcode = 'P0002'; end if;
    if v_event.status not in ('scheduled', 'closed') then
        raise exception '현재 참여 취소를 처리할 수 없는 활동입니다.' using errcode = '23514';
    end if;
    if now() > v_event.registration_deadline then
        raise exception '참여 취소 가능 시간이 지났습니다.' using errcode = '23514';
    end if;
    select ep.status into v_current_status from public.event_participants as ep
    where ep.event_id = p_event_id and ep.user_id = v_user_id for update;
    if not found or v_current_status = 'cancelled' then
        raise exception '취소할 참여 정보가 없습니다.' using errcode = 'P0002';
    end if;

    update public.event_participants set status = 'cancelled', cancelled_at = now()
    where event_id = p_event_id and user_id = v_user_id;

    if v_event.created_by <> v_user_id then
        select coalesce(nullif(btrim(p.display_name), ''), '회원') into v_actor_name
        from public.profiles as p where p.id = v_user_id;
        insert into public.notifications (
            user_id, notification_type, kind, title, body, event_id, target_path
        ) values (
            v_event.created_by, 'event_participation_cancelled', 'event_participation_cancelled',
            '활동 참여 취소',
            format('%s님이 ''%s'' 활동 참여를 취소했습니다.', v_actor_name, v_event.title),
            p_event_id, format('#/activities/%s', p_event_id)
        );
    end if;

    if v_current_status = 'joined' then
        select count(*)::integer into v_joined_count from public.event_participants as ep
        where ep.event_id = p_event_id and ep.status = 'joined';
        if v_event.capacity is null or v_joined_count < v_event.capacity then
            select ep.user_id into v_promoted_user_id from public.event_participants as ep
            where ep.event_id = p_event_id and ep.status = 'waitlisted'
            order by ep.waitlisted_at asc, ep.created_at asc for update skip locked limit 1;
            if v_promoted_user_id is not null then
                update public.event_participants
                set status = 'joined', joined_at = now(), waitlisted_at = null, cancelled_at = null
                where event_id = p_event_id and user_id = v_promoted_user_id;
                insert into public.notifications (user_id, notification_type, title, body, event_id)
                values (
                    v_promoted_user_id, 'waitlist_promoted', '활동 참여가 확정되었어요',
                    format('대기 중이던 "%s" 활동에 참여할 수 있게 되었습니다.', v_event.title), p_event_id
                );
            end if;
        end if;
    end if;
end;
$$;

revoke all on function public.join_event(bigint) from public, anon, authenticated;
revoke all on function public.cancel_event_participation(bigint) from public, anon, authenticated;
grant execute on function public.join_event(bigint) to authenticated;
grant execute on function public.cancel_event_participation(bigint) to authenticated;

commit;
