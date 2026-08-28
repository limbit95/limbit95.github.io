create table if not exists private.site_invites (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  target_type text not null,
  target_id text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  constraint site_invites_target_type_check check (target_type ~ '^[a-z][a-z0-9_]{1,63}$'),
  constraint site_invites_target_id_check check (char_length(target_id) between 1 and 256),
  constraint site_invites_expiry_check check (expires_at > created_at)
);

alter table private.site_invites enable row level security;
revoke all on table private.site_invites from public, anon, authenticated;

create index if not exists site_invites_created_by_idx
  on private.site_invites (created_by, created_at desc);
create index if not exists site_invites_validity_idx
  on private.site_invites (expires_at)
  where revoked_at is null;

create or replace function public.site_invite_create(
  p_target_type text,
  p_target_id text,
  p_expires_in_minutes integer default 1440,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token text;
  v_row private.site_invites%rowtype;
begin
  if auth.uid() is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;
  if p_target_type is null or p_target_type !~ '^[a-z][a-z0-9_]{1,63}$' then
    raise exception 'INVALID_INVITE_TARGET_TYPE';
  end if;
  if p_target_id is null or char_length(trim(p_target_id)) not between 1 and 256 then
    raise exception 'INVALID_INVITE_TARGET_ID';
  end if;
  if p_expires_in_minutes is null or p_expires_in_minutes < 5 or p_expires_in_minutes > 43200 then
    raise exception 'INVALID_INVITE_EXPIRY';
  end if;

  v_token := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  insert into private.site_invites (token, target_type, target_id, created_by, metadata, expires_at)
  values (v_token, p_target_type, trim(p_target_id), auth.uid(), coalesce(p_metadata, '{}'::jsonb), now() + make_interval(mins => p_expires_in_minutes))
  returning * into v_row;

  return jsonb_build_object(
    'token', v_row.token,
    'target_type', v_row.target_type,
    'expires_at', v_row.expires_at,
    'created_at', v_row.created_at
  );
end;
$$;

create or replace function public.site_invite_resolve(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row private.site_invites%rowtype;
begin
  if auth.uid() is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;

  select * into v_row
  from private.site_invites
  where token = p_token
    and revoked_at is null
    and expires_at > now();

  if not found then
    raise exception 'INVITE_NOT_FOUND_OR_EXPIRED';
  end if;

  return jsonb_build_object(
    'token', v_row.token,
    'target_type', v_row.target_type,
    'target_id', v_row.target_id,
    'metadata', v_row.metadata,
    'expires_at', v_row.expires_at,
    'created_by', v_row.created_by
  );
end;
$$;

create or replace function public.site_invite_revoke(p_token text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_updated integer;
begin
  if auth.uid() is null or not private.is_approved_member() then
    raise exception 'AUTH_REQUIRED';
  end if;

  update private.site_invites
  set revoked_at = coalesce(revoked_at, now())
  where token = p_token
    and (created_by = auth.uid() or private.is_admin());
  get diagnostics v_updated = row_count;

  if v_updated = 0 then
    raise exception 'INVITE_NOT_FOUND_OR_FORBIDDEN';
  end if;
  return true;
end;
$$;

revoke all on function public.site_invite_create(text, text, integer, jsonb) from public, anon;
revoke all on function public.site_invite_resolve(text) from public, anon;
revoke all on function public.site_invite_revoke(text) from public, anon;
grant execute on function public.site_invite_create(text, text, integer, jsonb) to authenticated;
grant execute on function public.site_invite_resolve(text) to authenticated;
grant execute on function public.site_invite_revoke(text) to authenticated;
