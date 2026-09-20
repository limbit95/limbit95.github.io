begin;

-- Reserve normalized display names for active or potentially active members.
-- Rejected applications release their display name so another member can reuse it.
create unique index profiles_active_display_name_uidx
    on public.profiles (lower(btrim(display_name)))
    where status in ('pending', 'approved', 'suspended');

-- Authenticated users can ask only whether a display name is available.
-- The current user's own profile is excluded so profile edits can keep the same name.
create or replace function public.check_display_name_availability(p_display_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
    v_display_name text := nullif(btrim(p_display_name), '');
begin
    if v_user_id is null then
        raise exception '로그인된 사용자만 닉네임을 확인할 수 있습니다.'
            using errcode = '42501';
    end if;

    if v_display_name is null or char_length(v_display_name) > 50 then
        return false;
    end if;

    return not exists (
        select 1
        from public.profiles as p
        where p.status in ('pending', 'approved', 'suspended')
          and lower(btrim(p.display_name)) = lower(v_display_name)
          and p.id <> v_user_id
    );
end;
$$;

revoke all on function public.check_display_name_availability(text)
    from public, anon, authenticated;
grant execute on function public.check_display_name_availability(text)
    to authenticated;

commit;
