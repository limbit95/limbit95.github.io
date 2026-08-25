-- 청파 같이 본 사이트 baseline: Supabase Storage avatars 버킷과 정책
-- 원본 schema.sql에서 SQL 의미 변경 없이 섹션별로 분리한 파일입니다.

begin;

-- ============================================================================
-- 12. Supabase Storage avatars 버킷과 정책
-- ============================================================================

-- 비공개 avatars 버킷을 생성하고 MIME 유형과 3MB 제한을 서버에서도 강제한다.
insert into storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
values (
    'avatars',
    'avatars',
    false,
    3145728,
    array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- 승인 회원만 아바타를 조회할 수 있다.
create policy avatars_select_approved_members
on storage.objects
for select
to authenticated
using (
    bucket_id = 'avatars'
    and private.is_approved_member()
);

-- 저장 경로의 첫 폴더가 현재 사용자의 UUID인 경우에만 업로드할 수 있다.
create policy avatars_insert_own_folder
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'avatars'
    and private.is_approved_member()
    and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- 자신의 폴더에 있는 객체만 수정할 수 있고 다른 폴더로 이동할 수 없다.
create policy avatars_update_own_folder
on storage.objects
for update
to authenticated
using (
    bucket_id = 'avatars'
    and private.is_approved_member()
    and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
    bucket_id = 'avatars'
    and private.is_approved_member()
    and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- 자신의 폴더에 있는 객체만 삭제할 수 있다.
create policy avatars_delete_own_folder
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'avatars'
    and private.is_approved_member()
    and (storage.foldername(name))[1] = (select auth.uid())::text
);

commit;
