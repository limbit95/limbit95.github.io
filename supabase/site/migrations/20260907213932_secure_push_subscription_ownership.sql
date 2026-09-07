begin;

-- Endpoint ownership changes must be performed as the authenticated caller, not
-- by accepting a caller-supplied user_id. This also permits an account switch to
-- atomically transfer the browser endpoint despite row-level visibility rules.
create or replace function public.claim_push_subscription(
    p_endpoint text,
    p_p256dh text,
    p_auth text,
    p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
begin
    if v_user_id is null or not private.is_approved_member() then
        raise exception '승인된 회원만 푸시 알림을 설정할 수 있습니다.' using errcode = '42501';
    end if;
    if p_endpoint is null or p_p256dh is null or p_auth is null
       or char_length(btrim(p_endpoint)) not between 1 and 4096
       or char_length(btrim(p_p256dh)) not between 1 and 512
       or char_length(btrim(p_auth)) not between 1 and 512
       or char_length(p_user_agent) > 1000 then
        raise exception '올바르지 않은 푸시 구독 정보입니다.' using errcode = '22023';
    end if;

    insert into public.push_subscriptions (user_id, endpoint, p256dh, auth, user_agent)
    values (v_user_id, p_endpoint, p_p256dh, p_auth, p_user_agent)
    on conflict (endpoint) do update
    set user_id = v_user_id,
        p256dh = excluded.p256dh,
        auth = excluded.auth,
        user_agent = excluded.user_agent;
end;
$$;

create or replace function public.remove_own_push_subscription(p_endpoint text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
    v_removed_count integer;
begin
    if v_user_id is null or not private.is_approved_member() then
        raise exception '승인된 회원만 푸시 알림을 해제할 수 있습니다.' using errcode = '42501';
    end if;

    delete from public.push_subscriptions
    where user_id = v_user_id and endpoint = p_endpoint;
    get diagnostics v_removed_count = row_count;
    return v_removed_count > 0;
end;
$$;

revoke insert, update, delete on table public.push_subscriptions from authenticated;
revoke usage, select on sequence public.push_subscriptions_id_seq from authenticated;
revoke all on function public.claim_push_subscription(text, text, text, text) from public, anon, authenticated;
revoke all on function public.remove_own_push_subscription(text) from public, anon, authenticated;
grant execute on function public.claim_push_subscription(text, text, text, text) to authenticated;
grant execute on function public.remove_own_push_subscription(text) to authenticated;

commit;
